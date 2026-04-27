from datetime import datetime
from typing import Optional, Any, Union
from pydantic import BaseModel, HttpUrl, field_validator
from beanie import PydanticObjectId, Link

class CharityBase(BaseModel):
    name: str
    description: Optional[str] = None
    website_url: Optional[str] = None
    is_active: bool = True

class CharityCreate(CharityBase):
    pass

class CharityUpdate(CharityBase):
    name: Optional[str] = None

class CharityResponse(CharityBase):
    id: PydanticObjectId
    
    class Config:
        from_attributes = True
        populate_by_name = True

class CharityContributionResponse(BaseModel):
    id: PydanticObjectId
    user_id: Union[PydanticObjectId, Any]
    charity_id: Union[PydanticObjectId, Any]
    amount: float
    percentage: float
    created_at: datetime
    
    @field_validator("user_id", "charity_id", mode="before")
    @classmethod
    def transform_links(cls, v: Any) -> Any:
        if isinstance(v, Link):
            return v.ref.id
        return v
    
    class Config:
        from_attributes = True
        populate_by_name = True
