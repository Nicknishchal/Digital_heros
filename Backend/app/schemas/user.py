from typing import Optional, Union, Any
from pydantic import BaseModel, EmailStr, Field, field_validator
from beanie import PydanticObjectId, Link

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    charity_id: Optional[Union[PydanticObjectId, str, Any]] = None

    @field_validator("charity_id", mode="before")
    @classmethod
    def transform_charity_id(cls, v: Any) -> Any:
        if isinstance(v, Link):
            return v.ref.id
        return v

class UserCreate(UserBase):
    password: str
    charity_percentage: Optional[float] = 10.0

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserSelectCharity(BaseModel):
    charity_id: PydanticObjectId
    contribution_percentage: float = Field(ge=10.0, le=100.0)

class UserResponse(UserBase):
    id: PydanticObjectId
    is_superuser: bool
    subscription_status: str
    
    class Config:
        from_attributes = True
        populate_by_name = True
