#!/usr/bin/env python3
"""Seed entry point for offline data pre-run."""
import asyncio
from app.data.models import init_db


async def seed_all():
    await init_db()
    print("Database tables created. Ready for data seeding.")


if __name__ == "__main__":
    asyncio.run(seed_all())
