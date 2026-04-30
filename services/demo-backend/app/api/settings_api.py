from fastapi import APIRouter
from pydantic import BaseModel
from app.data.repository import get_user_settings, upsert_user_settings
from app.data.models import UserSettingsModel

router = APIRouter()


class SettingsUpdate(BaseModel):
    background_prompt: str | None = None
    memory_enabled: dict | None = None
    preference_weights: dict | None = None
    privacy_mode: bool | None = None


@router.get("/settings")
async def get_settings(user_id: str = "foodie"):
    s = await get_user_settings(user_id)
    if s:
        return {
            "background_prompt": s.background_prompt,
            "memory_enabled": s.memory_enabled,
            "preference_weights": s.preference_weights,
            "privacy_mode": s.privacy_mode,
        }
    return {
        "background_prompt": "",
        "memory_enabled": {"searchHistory": True, "tripHistory": True, "favorites": True},
        "preference_weights": {},
        "privacy_mode": False,
    }


@router.put("/settings")
async def update_settings(update: SettingsUpdate, user_id: str = "foodie"):
    existing = await get_user_settings(user_id)
    if existing:
        if update.background_prompt is not None:
            existing.background_prompt = update.background_prompt
        if update.memory_enabled is not None:
            existing.memory_enabled = update.memory_enabled
        if update.preference_weights is not None:
            existing.preference_weights = update.preference_weights
        if update.privacy_mode is not None:
            existing.privacy_mode = update.privacy_mode
        await upsert_user_settings(existing)
    else:
        s = UserSettingsModel(
            user_id=user_id,
            background_prompt=update.background_prompt or "",
            memory_enabled=update.memory_enabled or {},
            preference_weights=update.preference_weights or {},
            privacy_mode=update.privacy_mode or False,
        )
        await upsert_user_settings(s)
    return {"status": "ok", "updated": update.model_dump(exclude_none=True)}
