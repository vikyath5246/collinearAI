from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"

@lru_cache
def get_settings():
    return Settings()
