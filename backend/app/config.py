from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "PS20 Disaster Coordinator"

    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "ps20"

    REDIS_URL: str = "redis://localhost:6379/0"

    # ============================================================
    # LLM Configuration
    # ============================================================

    LLM_PROVIDER: str = "none"

    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    # ============================================================
    # CORS
    # ============================================================

    CORS_ORIGINS: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()