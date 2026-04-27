from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.models.models import User, Draw
from app.services.draw_service import DrawService
from app.schemas.draw import DrawCreate, DrawResponse, DrawUpdate

router = APIRouter()

@router.post("/", response_model=DrawResponse)
async def create_draw(
    draw_in: DrawCreate,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    draw = Draw(**draw_in.dict())
    await draw.insert()
    return draw

@router.post("/run", response_model=DrawResponse)
async def run_latest_draw(
    current_user: User = Depends(deps.get_current_active_superuser)
):
    # Find latest pending draw
    draw = await Draw.find_one(Draw.status == "pending")
    
    if not draw:
        # Auto-create a draw if none exists
        from datetime import datetime
        draw = Draw(
            draw_date=datetime.utcnow(),
            status="pending",
            mode="random"
        )
        await draw.insert()
    
    draw_service = DrawService()
    await draw_service.run_draw(str(draw.id))
    return draw

@router.post("/{draw_id}/run", response_model=DrawResponse)
async def run_draw(
    draw_id: str,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    draw_service = DrawService()
    draw = await draw_service.run_draw(draw_id)
    return draw

@router.get("/", response_model=List[DrawResponse])
async def list_draws(
    skip: int = 0,
    limit: int = 100
):
    return await Draw.find_all(skip=skip, limit=limit).to_list()
