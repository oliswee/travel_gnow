from fastapi import APIRouter, HTTPException, Query
from app.data.repository import get_poi, search_pois, get_ugc_for_poi

router = APIRouter()


@router.get("/search")
async def search_poi(
    q: str = Query(..., description="Search keyword"),
    city: str = Query("杭州"),
):
    """Search POIs by keyword."""
    pois = await search_pois(q, city)
    return [
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "lat": p.lat,
            "lng": p.lng,
            "address": p.address,
            "visit_duration": p.visit_duration,
            "price": p.price,
            "rating": p.rating,
        }
        for p in pois
    ]


@router.get("/{poi_id}")
async def get_poi_detail(poi_id: str):
    """Get POI details with UGC stats."""
    poi = await get_poi(poi_id)
    if not poi:
        raise HTTPException(status_code=404, detail="POI not found")

    ugc_list = await get_ugc_for_poi(poi_id)
    total_reviews = len(ugc_list)
    positive_ratio = (
        sum(1 for u in ugc_list if (u.confidence or 0) > 0.5) / max(total_reviews, 1)
    )

    return {
        "id": poi.id,
        "name": poi.name,
        "rating": poi.rating,
        "category": poi.category,
        "sub_category": poi.sub_category,
        "lat": poi.lat,
        "lng": poi.lng,
        "address": poi.address,
        "visit_duration": poi.visit_duration,
        "indoor": poi.indoor,
        "price": poi.price,
        "time_window": poi.time_window,
        "ugc_stats": {
            "total_reviews": total_reviews,
            "positive_ratio": round(positive_ratio, 2),
        },
        "tags": poi.ugc_stats.get("tags", []) if poi.ugc_stats else [],
    }
