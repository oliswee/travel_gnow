from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class SettingsUpdate(BaseModel):
    background_prompt: str | None = None
    memory_enabled: dict | None = None
    preference_weights: dict | None = None
    privacy_mode: bool | None = None


@router.get("/settings")
async def get_settings(user_id: str = "foodie"):
    return {
        "background_prompt": "我喜欢小众、人少、步行不要太多；不喜欢网红店。",
        "memory_enabled": {"searchHistory": True, "tripHistory": True, "favorites": True},
        "preference_weights": {"美食": 3, "博物馆": 3, "少步行": 3, "小众": 3},
        "privacy_mode": False,
    }


@router.put("/settings")
async def update_settings(update: SettingsUpdate, user_id: str = "foodie"):
    return {"status": "ok", "updated": update.model_dump(exclude_none=True)}
