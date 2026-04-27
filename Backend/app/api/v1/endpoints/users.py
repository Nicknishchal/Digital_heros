from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.models.models import User, Charity
from app.schemas.user import UserResponse, UserUpdate, UserSelectCharity
from app.repositories.user import UserRepository

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
):
    return current_user

@router.post("/select-charity", response_model=UserResponse)
async def select_charity(
    selection: UserSelectCharity,
    current_user: User = Depends(deps.get_current_active_user),
):
    user_repo = UserRepository()
    charity = await Charity.get(selection.charity_id)
    if not charity:
        raise HTTPException(status_code=404, detail="Charity not found")
        
    update_data = {
        "charity_id": charity,
        "charity_percentage": selection.contribution_percentage
    }
    return await user_repo.update(current_user, update_data)

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_active_user),
):
    user_repo = UserRepository()
    update_data = user_in.dict(exclude_unset=True)
    if update_data.get("password"):
        from app.core import security
        update_data["hashed_password"] = security.get_password_hash(update_data.pop("password"))
    
    return await user_repo.update(current_user, update_data)

@router.get("/", response_model=List[UserResponse])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_superuser),
):
    user_repo = UserRepository()
    return await user_repo.get_multi(skip=skip, limit=limit)
