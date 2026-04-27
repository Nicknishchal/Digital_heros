from typing import List, Optional, Union, Any
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Digital Heros"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # MONGODB
    MONGODB_URI: str
    MONGODB_DB: str

    # STRIPE
    STRIPE_API_KEY: str
    STRIPE_WEBHOOK_SECRET: str
    STRIPE_MONTHLY_PRICE_ID: str
    STRIPE_YEARLY_PRICE_ID: str

    # INITIAL ADMIN
    FIRST_SUPERUSER: str
    FIRST_SUPERUSER_PASSWORD: str

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
