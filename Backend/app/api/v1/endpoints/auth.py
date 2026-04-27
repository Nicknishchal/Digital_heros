from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.repositories.user import UserRepository
from app.services.auth_service import AuthService
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserResponse
from app.core import security
from app.models.models import User

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate):
    user_repo = UserRepository()
    existing_user = await user_repo.get_by_email(user_in.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user_in.password)
    user_data = user_in.dict(exclude={"password"})
    user_data["hashed_password"] = hashed_password
    
    user = User(**user_data)
    return await user_repo.create(user)

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user_repo = UserRepository()
    auth_service = AuthService(user_repo)
    user = await auth_service.authenticate(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    return auth_service.create_tokens(str(user.id))

@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str
):
    user_repo = UserRepository()
    auth_service = AuthService(user_repo)
    return await auth_service.refresh_access_token(refresh_token)
