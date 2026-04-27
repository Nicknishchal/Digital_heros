from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.models.models import User, Charity
from app.schemas.charity import CharityCreate, CharityResponse, CharityUpdate

router = APIRouter()

@router.get("/", response_model=List[CharityResponse])
async def list_charities(
    skip: int = 0,
    limit: int = 100
):
    return await Charity.find(Charity.is_active == True).skip(skip).limit(limit).to_list()

@router.post("/", response_model=CharityResponse)
async def create_charity(
    charity_in: CharityCreate,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    charity = Charity(**charity_in.dict())
    await charity.insert()
    return charity

@router.get("/{charity_id}", response_model=CharityResponse)
async def get_charity(charity_id: str):
    charity = await Charity.get(charity_id)
    if not charity:
        raise HTTPException(status_code=404, detail="Charity not found")
    return charity

@router.put("/{charity_id}", response_model=CharityResponse)
async def update_charity(
    charity_id: str,
    charity_in: CharityUpdate,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    charity = await Charity.get(charity_id)
    if not charity:
        raise HTTPException(status_code=404, detail="Charity not found")
    
    update_data = charity_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(charity, key, value)
    
    await charity.save()
    return charity
