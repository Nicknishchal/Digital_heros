from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.models import (
    User, Charity, Subscription, Score, Draw, DrawResult, Winner, CharityContribution
)

async def init_db():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(
        database=client[settings.MONGODB_DB],
        document_models=[
            User, Charity, Subscription, Score, Draw, DrawResult, Winner, CharityContribution
        ]
    )
