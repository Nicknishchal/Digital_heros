from datetime import date
from typing import Any, Union
from pydantic import BaseModel, Field, field_validator
from beanie import PydanticObjectId, Link

class ScoreBase(BaseModel):
    score: int = Field(ge=1, le=45)
    date: date

class ScoreCreate(ScoreBase):
    pass

class ScoreResponse(ScoreBase):
    id: PydanticObjectId
    user_id: Union[PydanticObjectId, Any]
    
    @field_validator("user_id", mode="before")
    @classmethod
    def transform_user_id(cls, v: Any) -> Any:
        if isinstance(v, Link):
            return v.ref.id
        return v
    
    class Config:
        from_attributes = True
        populate_by_name = True
