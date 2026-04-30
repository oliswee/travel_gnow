from app.data.models import async_session, POIModel, UGCModel, TripModel, UserSettingsModel


async def get_poi(poi_id: str) -> POIModel | None:
    async with async_session() as session:
        return await session.get(POIModel, poi_id)


async def list_pois(city: str, limit: int = 50) -> list[POIModel]:
    async with async_session() as session:
        from sqlalchemy import select
        result = await session.execute(
            select(POIModel).where(POIModel.city == city).limit(limit)
        )
        return list(result.scalars().all())


async def get_trip(trip_id: str) -> TripModel | None:
    async with async_session() as session:
        return await session.get(TripModel, trip_id)


async def save_trip(trip: TripModel) -> None:
    async with async_session() as session:
        session.add(trip)
        await session.commit()


async def get_user_settings(user_id: str) -> UserSettingsModel | None:
    async with async_session() as session:
        return await session.get(UserSettingsModel, user_id)


async def upsert_user_settings(settings_obj: UserSettingsModel) -> None:
    async with async_session() as session:
        await session.merge(settings_obj)
        await session.commit()


async def search_pois(query: str, city: str = "杭州", limit: int = 20) -> list[POIModel]:
    """Simple keyword search on POI name."""
    from sqlalchemy import select
    async with async_session() as session:
        result = await session.execute(
            select(POIModel)
            .where(POIModel.city == city, POIModel.name.ilike(f"%{query}%"))
            .limit(limit)
        )
        return list(result.scalars().all())


async def list_pois_by_ids(poi_ids: list[str]) -> list[POIModel]:
    """Fetch multiple POIs by IDs in order."""
    from sqlalchemy import select
    async with async_session() as session:
        result = await session.execute(
            select(POIModel).where(POIModel.id.in_(poi_ids))
        )
        return list(result.scalars().all())


async def get_ugc_for_poi(poi_id: str) -> list[UGCModel]:
    """Get UGC entries for a POI."""
    from sqlalchemy import select
    async with async_session() as session:
        result = await session.execute(
            select(UGCModel).where(UGCModel.poi_id == poi_id)
        )
        return list(result.scalars().all())
