from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://gonow:gonow123@localhost:5433/gonow"
    redis_url: str = "redis://localhost:6380/0"
    mock_mode: bool = True

    # LLM
    gemini_api_key: str = ""
    gemini_model: str = "models/gemini-2.5-flash"

    # Gaode Maps
    gaode_web_key: str = ""
    gaode_js_key: str = ""
    gaode_js_secret: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
