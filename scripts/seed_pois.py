#!/usr/bin/env python3
"""Seed POI data into Postgres from JSON files."""
import asyncio
import json
from pathlib import Path
import sys

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent / "services" / "demo-backend"))

from app.data.models import POIModel, init_db, async_session


async def seed_pois():
    await init_db()
    data_dir = Path(__file__).parent.parent / "data" / "pois"

    async with async_session() as session:
        for json_file in sorted(data_dir.glob("*_pois.json")):
            city = json_file.stem.split("_")[0]
            with open(json_file, encoding="utf-8") as f:
                pois = json.load(f)
            count = 0
            for item in pois:
                poi = POIModel(
                    id=item["id"],
                    name=item["name"],
                    city=item["city"],
                    category=item.get("category"),
                    sub_category=item.get("sub_category"),
                    rating=item.get("rating", 0.0),
                    lat=item["lat"],
                    lng=item["lng"],
                    address=item.get("address", ""),
                    visit_duration=item.get("visit_duration", 60),
                    indoor=item.get("indoor", False),
                    price=item.get("price", 0.0),
                    time_window=item.get("time_window"),
                    ugc_stats=item.get("ugc_stats"),
                )
                await session.merge(poi)
                count += 1
            print(f"Seeded {count} POIs for {city}")
        await session.commit()

    print("Done seeding POIs")


if __name__ == "__main__":
    asyncio.run(seed_pois())
