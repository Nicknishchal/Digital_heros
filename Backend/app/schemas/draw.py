from datetime import datetime
from typing import List, Optional, Any, Union
from pydantic import BaseModel, field_validator
from beanie import PydanticObjectId, Link

class DrawBase(BaseModel):
    draw_date: datetime
    mode: str = "random" # random, algorithm

class DrawCreate(DrawBase):
    pass

class DrawUpdate(BaseModel):
    status: Optional[str] = None
    winning_numbers: Optional[List[int]] = None
    prize_pool: Optional[float] = None
    jackpot_rollover: Optional[float] = None

class DrawResponse(DrawBase):
    id: PydanticObjectId
    status: str
    winning_numbers: Optional[List[int]] = None
    prize_pool: float
    jackpot_rollover: float
    winners_count: Optional[int] = 0
    
    class Config:
        from_attributes = True
        populate_by_name = True

class DrawResultResponse(BaseModel):
    id: PydanticObjectId
    draw_id: Union[PydanticObjectId, Any]
    user_id: Union[PydanticObjectId, Any]
    numbers_matched: int
    reward_amount: float
    
    @field_validator("draw_id", "user_id", mode="before")
    @classmethod
    def transform_links(cls, v: Any) -> Any:
        if isinstance(v, Link):
            return v.ref.id
        return v
    
    class Config:
        from_attributes = True
        populate_by_name = True
