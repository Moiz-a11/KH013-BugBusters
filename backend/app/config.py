from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "PS20 Disaster Coordinator"
    MONGODB_URI: str = ""
    MONGODB_DB: str = "ps20"
    REDIS_URL: str = "redis://localhost:6379/0"
    LLM_PROVIDER: str = "none"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    CORS_ORIGINS: str = "http://localhost:5173"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
