from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class DriftRequest(BaseModel):
    user_id: str = "foodie"
    query: str


@router.post("/plan-abc")
async def plan_abc(req: DriftRequest):
    """Generate Plan A/B/C from a one-sentence query."""
    return {
        "plans": {
            "A": {
                "id": "plan_a",
                "label": "美食最大化",
                "description": "吃得最好，茶馆/夜市/本地小馆最多",
                "preference_match": 0.92,
                "diversity_score": 0.78,
                "unique_pois": ["poi_101", "poi_102"],
            },
            "B": {
                "id": "plan_b",
                "label": "时间最少",
                "description": "交通最顺，少绕路",
                "preference_match": 0.74,
                "diversity_score": 0.62,
                "unique_pois": [],
            },
            "C": {
                "id": "plan_c",
                "label": "体力最省",
                "description": "少走路，室内多，休息多",
                "preference_match": 0.81,
                "diversity_score": 0.71,
                "unique_pois": ["poi_201", "poi_202"],
            },
        },
        "comparison": {
            "dimensions": [
                {"name": "偏好命中度", "values": [0.92, 0.74, 0.81], "best": 0},
                {"name": "总时长", "values": [560, 370, 465], "best": 1},
                {"name": "总预算", "values": [520, 380, 440], "best": 1},
                {"name": "步数", "values": [14000, 9000, 5000], "best": 2},
                {"name": "多样性", "values": [0.78, 0.62, 0.71], "best": 0},
            ]
        },
    }
