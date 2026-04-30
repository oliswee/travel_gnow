"""Gaode Maps API wrapper for distance matrix and POI search."""
import math
from typing import Any
import httpx
from app.config import settings


async def geocode_address(address: str, city: str = "杭州") -> dict[str, float] | None:
    """Convert address to (lat, lng) coordinates."""
    params = {
        "key": settings.gaode_web_key,
        "address": address,
        "city": city,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://restapi.amap.com/v3/geocode/geo",
            params=params,
            timeout=10,
        )
        data = resp.json()
        if data.get("status") == "1" and data.get("geocodes"):
            loc = data["geocodes"][0]["location"].split(",")
            return {"lat": float(loc[1]), "lng": float(loc[0])}
        return None


async def driving_distance_matrix(
    origins: list[tuple[float, float]],
    destinations: list[tuple[float, float]],
) -> list[list[int]]:
    """Get driving distance matrix (minutes) between two sets of coordinates."""
    n, m = len(origins), len(destinations)
    result = [[0] * m for _ in range(n)]

    async def _fetch_pair(i: int, j: int) -> int | None:
        params = {
            "key": settings.gaode_web_key,
            "origin": f"{origins[i][1]},{origins[i][0]}",
            "destination": f"{destinations[j][1]},{destinations[j][0]}",
            "strategy": 0,
        }
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://restapi.amap.com/v3/direction/driving",
                params=params,
                timeout=10,
            )
            data = resp.json()
            if data.get("status") == "1" and data.get("route", {}).get("paths"):
                return int(data["route"]["paths"][0]["duration"])
            return None

    for i in range(n):
        for j in range(m):
            duration = await _fetch_pair(i, j)
            if duration is not None:
                result[i][j] = duration
            else:
                # Fallback: Haversine estimate (60 km/h avg)
                R = 6371
                dlat = math.radians(destinations[j][0] - origins[i][0])
                dlng = math.radians(destinations[j][1] - origins[i][1])
                a = (
                    math.sin(dlat / 2) ** 2
                    + math.cos(math.radians(origins[i][0]))
                    * math.cos(math.radians(destinations[j][0]))
                    * math.sin(dlng / 2) ** 2
                )
                c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                dist_km = R * c
                result[i][j] = int((dist_km / 60) * 60)

    return result


async def poi_search(keyword: str, city: str = "杭州") -> list[dict[str, Any]]:
    """Search POIs by keyword."""
    params = {
        "key": settings.gaode_web_key,
        "keywords": keyword,
        "city": city,
        "offset": 20,
        "page": 1,
        "extensions": "all",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://restapi.amap.com/v3/place/text",
            params=params,
            timeout=10,
        )
        data = resp.json()
        if data.get("status") == "1":
            return data.get("pois", [])
        return []
