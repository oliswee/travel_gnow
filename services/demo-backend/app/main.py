from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import trip, poi, drift, settings_api, debug
from app.data.models import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.connect() as conn:
        await conn.run_sync(lambda sync_conn: None)
    yield
    await engine.dispose()


app = FastAPI(title="GoNow Demo Backend", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trip.router, prefix="/api/trip", tags=["trip"])
app.include_router(poi.router, prefix="/api/poi", tags=["poi"])
app.include_router(drift.router, prefix="/api/drift", tags=["drift"])
app.include_router(settings_api.router, prefix="/api/me", tags=["settings"])
app.include_router(debug.router, prefix="/api/debug", tags=["debug"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
