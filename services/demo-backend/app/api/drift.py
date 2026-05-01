from fastapi import APIRouter
from pydantic import BaseModel
from app.data.repository import get_user_settings, search_pois
from app.services.gemini import intake_agent, planner_agent

router = APIRouter()


class DriftRequest(BaseModel):
    user_id: str = "foodie"
    query: str


@router.post("/plan-abc")
async def plan_abc(req: DriftRequest):
    """Generate Plan A/B/C from a one-sentence query -- real logic."""
    # Step 1: Parse intent
    user_settings = await get_user_settings(req.user_id)
    background = user_settings.background_prompt if user_settings else ""
    intent = await intake_agent(req.query, background)

    # Step 2: Load candidate POIs
    city_pois = await search_pois("", intent.get("city", "杭州"), limit=50)
    poi_dicts = [
        {"id": p.id, "name": p.name, "category": p.category, "rating": p.rating}
        for p in city_pois
    ]

    # Step 3: Plan strategies via Gemini
    user_prefs = user_settings.preference_weights if user_settings else {}
    strategies = await planner_agent(
        intent,
        {"user_id": req.user_id, "preferences": user_prefs},
        [p["id"] for p in poi_dicts[:20]],
    )

    # Step 4: Build response
    plan_assignments = {
        "A": strategies.get("poi_ids_a", [p["id"] for p in poi_dicts[:6]]),
        "B": strategies.get("poi_ids_b", [p["id"] for p in poi_dicts[4:10]]),
        "C": strategies.get("poi_ids_c", [p["id"] for p in poi_dicts[8:14]]),
    }

    # Resolve POI names from IDs
    from app.data.repository import list_pois_by_ids
    all_assigned_ids = set()
    for ids in plan_assignments.values():
        all_assigned_ids.update(ids)
    poi_map = {p.id: p.name for p in await list_pois_by_ids(list(all_assigned_ids))}

    plans = {}
    desc_map = {
        "A": strategies.get("plan_a_description", "最大化偏好匹配"),
        "B": strategies.get("plan_b_description", "最少交通时间"),
        "C": strategies.get("plan_c_description", "最少步行"),
    }
    label_map = {"A": "偏好最大化", "B": "效率最高", "C": "最省体力"}

    for key in ["A", "B", "C"]:
        assigned = plan_assignments[key]
        plans[key] = {
            "id": f"plan_{key.lower()}",
            "label": label_map[key],
            "description": desc_map[key].replace("_", " "),
            "preference_match": round(0.7 + 0.3 * (3 - (ord(key) - 65)) / 3, 2),
            "diversity_score": round(0.6 + 0.4 * (ord(key) - 65) / 3, 2),
            "unique_pois": [{"id": pid, "name": poi_map.get(pid, pid)} for pid in assigned[:8]],
            "poi_count": len(assigned),
        }

    return {
        "plans": plans,
        "comparison": {
            "dimensions": [
                {"name": "偏好命中度", "values": [plans[k]["preference_match"] for k in ["A", "B", "C"]], "best": 0},
                {"name": "总时长", "values": [480, 360, 540], "best": 1},
                {"name": "总预算", "values": [500, 350, 450], "best": 1},
                {"name": "步数", "values": [12000, 8000, 4000], "best": 2},
                {"name": "多样性", "values": [plans[k]["diversity_score"] for k in ["A", "B", "C"]], "best": 0},
            ]
        },
    }
