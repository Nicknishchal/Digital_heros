from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.models.models import User, Score
from app.repositories.score import ScoreRepository
from app.schemas.score import ScoreCreate, ScoreResponse

router = APIRouter()

@router.post("/", response_model=ScoreResponse)
async def create_score(
    score_in: ScoreCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    score_repo = ScoreRepository()
    try:
        score = await score_repo.add_score(
            user_id=current_user,
            score_val=score_in.score,
            score_date=score_in.date
        )
        return score
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=List[ScoreResponse])
async def read_my_scores(
    current_user: User = Depends(deps.get_current_active_user)
):
    score_repo = ScoreRepository()
    return await score_repo.get_by_user(current_user.id)
