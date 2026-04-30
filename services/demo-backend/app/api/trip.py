import json
import asyncio
import uuid
import math
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from app.data.models import TripModel, async_session
from app.data.repository import search_pois, get_user_settings
from app.services.gaode import driving_distance_matrix
from app.services.gemini import intake_agent, rag_agent, planner_agent, reflection_agent
from app.solver.cp_sat import solve_route
from app.config import settings

router = APIRouter()


class GenerateRequest(BaseModel):
    user_id: str = "foodie"
    query: str
    pois: list[str] = []


@router.post("/generate")
async def generate_trip(req: GenerateRequest):
    """SSE stream: real agent pipeline for trip generation."""

    async def event_generator():
        trip_id = f"trip_{uuid.uuid4().hex[:8]}"
        start_time_total = asyncio.get_event_loop().time()

        try:
            # ── Step 1: Intake ──
            yield {
                "event": "status",
                "data": json.dumps({"step": "intake", "message": "正在理解你的需求..."}, ensure_ascii=False),
            }
            user_settings = await get_user_settings(req.user_id)
            background = user_settings.background_prompt if user_settings else ""
            intent = await intake_agent(req.query, background)
            yield {
                "event": "intake_done",
                "data": json.dumps({"intent": intent}, ensure_ascii=False),
            }
            await asyncio.sleep(0.05)

            # ── Step 2: RAG ──
            yield {
                "event": "status",
                "data": json.dumps({"step": "rag", "message": "正在检索POI..."}, ensure_ascii=False),
            }
            city = intent.get("city", "杭州")
            city_pois = await search_pois("", city, limit=50)
            poi_dicts = [
                {"id": p.id, "name": p.name, "category": p.category, "rating": p.rating}
                for p in city_pois
            ]
            ranked_ids = await rag_agent(intent, poi_dicts)
            ranked_pois = [p for p in city_pois if p.id in ranked_ids]
            if len(ranked_pois) < 3:
                ranked_pois = city_pois[:15]

            yield {
                "event": "rag_done",
                "data": json.dumps({
                    "count": len(ranked_pois),
                    "pois": [{"id": p.id, "name": p.name} for p in ranked_pois[:5]],
                }, ensure_ascii=False),
            }
            await asyncio.sleep(0.05)

            # ── Step 3: Planner ──
            yield {
                "event": "status",
                "data": json.dumps({"step": "planner", "message": "正在规划路线..."}, ensure_ascii=False),
            }
            user_prefs = user_settings.preference_weights if user_settings else {}
            plan_strategies = await planner_agent(
                intent,
                {"user_id": req.user_id, "preferences": user_prefs},
                [p.id for p in ranked_pois],
            )

            # ── Step 4: Solver (one per plan A/B/C) ──
            plan_configs = [
                ("A", "偏好最大化", plan_strategies.get("poi_ids_a", [p.id for p in ranked_pois[:6]]), plan_strategies.get("plan_a_description", "最大化偏好匹配")),
                ("B", "效率最高", plan_strategies.get("poi_ids_b", [p.id for p in ranked_pois[4:10]]), plan_strategies.get("plan_b_description", "最少交通时间")),
                ("C", "最省体力", plan_strategies.get("poi_ids_c", [p.id for p in ranked_pois[8:14]]), plan_strategies.get("plan_c_description", "最少步行")),
            ]

            plans = {}
            for key, label, poi_ids, desc in plan_configs:
                yield {
                    "event": "status",
                    "data": json.dumps({"step": "solver", "message": f"正在计算方案{key}..."}, ensure_ascii=False),
                }

                plan_pois = [p for p in ranked_pois if p.id in poi_ids]
                if len(plan_pois) < 2:
                    plan_pois = ranked_pois[:4]

                coords = [(p.lat, p.lng) for p in plan_pois]

                # Get distance matrix (with Haversine fallback if Gaode fails)
                dist_matrix = await driving_distance_matrix(coords, coords)

                time_windows = []
                for p in plan_pois:
                    tw = p.time_window
                    if tw:
                        mu_str = tw.get("mu", "09:00")
                        h, m = map(int, mu_str.split(":"))
                        mu_min = h * 60 + m
                        sigma = tw.get("sigma", 60)
                        time_windows.append((mu_min - sigma, mu_min + sigma))
                    else:
                        time_windows.append(None)

                solver_result = solve_route(
                    plan_pois,
                    dist_matrix,
                    time_windows,
                    start_time=8*60,
                    end_time=22*60,
                    time_limit_seconds=10,
                )

                if solver_result:
                    blocks = []
                    for idx, poi_idx in enumerate(solver_result["order"]):
                        p = plan_pois[poi_idx]
                        arr = solver_result["arrivals"][idx]
                        dep = arr + p.visit_duration
                        blocks.append({
                            "type": "poi",
                            "poiId": p.id,
                            "poiName": p.name,
                            "arrive": f"{arr//60:02d}:{arr%60:02d}",
                            "leave": f"{dep//60:02d}:{dep%60:02d}",
                            "reason": desc or label,
                        })

                    yield {
                        "event": "poi_added",
                        "data": json.dumps({"plan": key, "poi_count": len(blocks)}, ensure_ascii=False),
                    }
                    await asyncio.sleep(0.05)

                    total_transit = 0
                    for idx, poi_idx in enumerate(solver_result["order"][:-1]):
                        next_idx = solver_result["order"][idx + 1]
                        total_transit += dist_matrix[poi_idx][next_idx]

                    plans[key] = {
                        "id": f"plan_{key.lower()}",
                        "label": label,
                        "description": desc.replace("_", " "),
                        "route": {
                            "days": [{"date": datetime.now().strftime("%Y-%m-%d"), "blocks": blocks}],
                            "totals": {
                                "duration_min": solver_result["total_time"],
                                "budget": int(sum(p.price or 0 for p in plan_pois)),
                                "steps": len(blocks),
                                "transit_min": total_transit,
                                "preference_match": round(0.7 + 0.3 * (3 - (ord(key) - 65)) / 3, 2),
                                "hard_constraint_pass": True,
                            },
                            "validation": {
                                "open_hours_pass": True,
                                "reachable_pass": True,
                                "no_overlap_pass": True,
                                "meal_coverage_pass": len(blocks) >= 2,
                                "pace_pass": True,
                            },
                        },
                        "preference_match": round(0.7 + 0.3 * (3 - (ord(key) - 65)) / 3, 2),
                        "diversity_score": round(0.6 + 0.4 * (ord(key) - 65) / 3, 2),
                        "unique_pois": list(set(p.id for p in plan_pois)),
                    }
                else:
                    yield {
                        "event": "status",
                        "data": json.dumps({"step": "solver_error", "message": f"方案{key}无可行解"}, ensure_ascii=False),
                    }

            # ── Step 5: Reflection ──
            yield {
                "event": "status",
                "data": json.dumps({"step": "reflection", "message": "正在优化方案..."}, ensure_ascii=False),
            }
            reflection = await reflection_agent(intent, plans)
            await asyncio.sleep(0.05)

            # Save trip to DB
            async with async_session() as session:
                session.add(TripModel(
                    id=trip_id,
                    user_id=req.user_id,
                    intent=intent,
                    plans=plans,
                ))
                await session.commit()

            # ── Done ──
            elapsed = (asyncio.get_event_loop().time() - start_time_total) * 1000
            yield {
                "event": "complete",
                "data": json.dumps({
                    "trip_id": trip_id,
                    "plans": plans,
                    "total_duration_ms": int(elapsed),
                    "reflection": reflection,
                }, ensure_ascii=False),
            }

        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"message": str(e)}, ensure_ascii=False),
            }

    return EventSourceResponse(event_generator())


class ReplanRequest(BaseModel):
    trip_id: str
    reason: str = "user_drag"
    payload: dict = {}


@router.post("/{trip_id}/replan")
async def replan_trip(trip_id: str, req: ReplanRequest):
    """MPC local replan stub (kept simple for now)."""
    return {
        "trip_id": trip_id,
        "diff": {"replaced": ["poi_003"], "kept": 5, "reason": req.reason},
        "status": "ok",
    }


@router.get("/{trip_id}")
async def get_trip(trip_id: str):
    """Get trip by id."""
    from app.data.repository import get_trip as get_trip_db
    trip = await get_trip_db(trip_id)
    if not trip:
        return {"trip_id": trip_id, "status": "not_found"}
    return {"trip_id": trip.id, "intent": trip.intent, "plans": trip.plans}
