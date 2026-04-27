from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, scores, draws, charities, subscriptions

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(scores.router, prefix="/scores", tags=["scores"])
api_router.include_router(draws.router, prefix="/draws", tags=["draws"])
api_router.include_router(charities.router, prefix="/charities", tags=["charities"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
