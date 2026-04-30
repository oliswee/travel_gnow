#!/usr/bin/env python3
"""Seed mock user profiles and settings."""
import asyncio
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent / "services" / "demo-backend"))

from app.data.models import init_db, async_session, UserSettingsModel


async def seed_users():
    await init_db()
    data_path = Path(__file__).parent.parent / "data" / "mock-users" / "profiles.json"

    with open(data_path, encoding="utf-8") as f:
        users = json.load(f)

    async with async_session() as session:
        for user in users:
            settings = UserSettingsModel(
                user_id=user["id"],
                background_prompt="",
                memory_enabled={"searchHistory": True, "tripHistory": True, "favorites": True},
                preference_weights={c["name"]: c["weight"] for c in user["topCategories"]},
                privacy_mode=False,
            )
            session.add(settings)
        await session.commit()

    print(f"Seeded {len(users)} mock users")


if __name__ == "__main__":
    asyncio.run(seed_users())
