import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse

router = APIRouter()


@router.get("/{poi_id}")
async def get_poi(poi_id: str):
    """Get POI details with UGC stats."""
    return {
        "id": poi_id,
        "name": "西湖风景区",
        "rating": 4.7,
        "time_window": {"mu": "16:45", "sigma": 22.5, "weight": 0.87, "sampleCount": 423},
        "anti_hype": {"marketing_ratio": 0.12, "real_reviews": 367},
        "tags": ["户外", "拍照", "必去"],
    }


@router.get("/{poi_id}/explain")
async def explain_poi(poi_id: str):
    """Streaming explanation."""
    async def gen():
        yield {"event": "reason", "data": json.dumps({"text": "根据423条UGC共识，16:30-17:30是最佳拍摄时间"})}
    return EventSourceResponse(gen())
