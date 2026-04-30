from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, Text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, declared_attr

from app.config import settings as app_settings

engine = create_async_engine(app_settings.database_url, echo=False)
async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(AsyncAttrs, DeclarativeBase):
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


class POIModel(Base):
    __tablename__ = "pois"

    id = Column(String, primary_key=True)
    name = Column(String(200), nullable=False)
    city = Column(String(50), nullable=False)
    category = Column(String(50))
    sub_category = Column(String(50))
    rating = Column(Float, default=0.0)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(Text)
    open_hours = Column(String(200))
    price = Column(Float, default=0.0)
    visit_duration = Column(Integer, default=60)
    indoor = Column(Boolean, default=False)
    time_window = Column(JSON, nullable=True)
    ugc_stats = Column(JSON, nullable=True)
    anti_hype_score = Column(Float, default=1.0)
    embedding = Column(String, nullable=True)


class UGCModel(Base):
    __tablename__ = "ugc"

    id = Column(Integer, primary_key=True, autoincrement=True)
    poi_id = Column(String(50), nullable=False, index=True)
    source = Column(String(50))
    text = Column(Text)
    triples = Column(JSON)
    anti_hype_score = Column(Float, default=1.0)
    confidence = Column(Float, default=0.0)


class UserHistoryModel(Base):
    __tablename__ = "user_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(50), nullable=False, index=True)
    type = Column(String(20))
    payload = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)


class TripModel(Base):
    __tablename__ = "trips"

    id = Column(String(50), primary_key=True)
    user_id = Column(String(50), nullable=False, index=True)
    intent = Column(JSON)
    plans = Column(JSON)
    checker_result = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserSettingsModel(Base):
    __tablename__ = "user_settings"

    user_id = Column(String(50), primary_key=True)
    background_prompt = Column(Text, default="")
    memory_enabled = Column(JSON)
    preference_weights = Column(JSON)
    privacy_mode = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def drop_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
