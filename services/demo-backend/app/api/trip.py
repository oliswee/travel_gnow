import json
import asyncio
from fastapi import APIRouter
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

router = APIRouter()


class GenerateRequest(BaseModel):
    user_id: str = "foodie"
    query: str
    pois: list[str] = []


class ReplanRequest(BaseModel):
    trip_id: str
    reason: str = "user_drag"
    payload: dict = {}


@router.post("/generate")
async def generate_trip(req: GenerateRequest):
    """SSE stream: generates trip plan A/B/C."""
    async def event_generator():
        await asyncio.sleep(0.3)
        yield {"event": "intake_done", "data": json.dumps({"intent": {"query": req.query}})}
        await asyncio.sleep(0.2)
        yield {"event": "rag_done", "data": json.dumps({"count": 12})}
        await asyncio.sleep(0.5)
        yield {"event": "solver_progress", "data": json.dumps({"progress": 0.6})}
        await asyncio.sleep(0.3)
        yield {"event": "poi_added", "data": json.dumps({"poi_id": "poi_001", "name": "西湖"})}
        await asyncio.sleep(0.3)
        yield {"event": "poi_added", "data": json.dumps({"poi_id": "poi_002", "name": "龙井茶室"})}
        await asyncio.sleep(0.3)
        yield {"event": "complete", "data": json.dumps({"trip_id": "trip_001", "plan_count": 3})}

    return EventSourceResponse(event_generator())


@router.post("/{trip_id}/replan")
async def replan_trip(trip_id: str, req: ReplanRequest):
    """MPC local replan stub."""
    return {
        "trip_id": trip_id,
        "diff": {"replaced": ["poi_003"], "kept": 5, "reason": req.reason},
        "status": "ok",
    }


@router.get("/{trip_id}")
async def get_trip(trip_id: str):
    """Get trip by id."""
    return {"trip_id": trip_id, "status": "stub"}
