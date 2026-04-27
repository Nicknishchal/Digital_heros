from datetime import timedelta
from typing import Optional
from fastapi import HTTPException, status
from app.core import security
from app.core.config import settings
from app.models.models import User
from app.repositories.user import UserRepository
from app.schemas.token import Token

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def authenticate(self, email: str, password: str) -> Optional[User]:
        user = await self.user_repo.get_by_email(email)
        if not user:
            return None
        if not security.verify_password(password, user.hashed_password):
            return None
        return user

    def create_tokens(self, user_id: str) -> Token:
        access_token = security.create_access_token(subject=user_id)
        refresh_token = security.create_refresh_token(subject=user_id)
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )

    async def refresh_access_token(self, refresh_token: str) -> Token:
        try:
            payload = security.decode_token(refresh_token)
            if not payload.get("refresh"):
                raise HTTPException(status_code=401, detail="Invalid refresh token")
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid token payload")
            
            # Create new tokens
            return self.create_tokens(str(user_id))
        except Exception:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
