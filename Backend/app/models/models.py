from datetime import datetime, date
from typing import List, Optional
from beanie import Document, Link, Indexed
from pydantic import Field, EmailStr
from bson import ObjectId

class User(Document):
    email: Indexed(EmailStr, unique=True)
    full_name: Optional[str] = None
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    charity_id: Optional[Link["Charity"]] = None
    charity_percentage: float = 10.0
    subscription_status: str = "inactive" # active, inactive, canceled, expired
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

class Charity(Document):
    name: Indexed(str)
    description: Optional[str] = None
    website_url: Optional[str] = None
    is_active: bool = True

    class Settings:
        name = "charities"

class Subscription(Document):
    user_id: Link[User]
    stripe_subscription_id: Indexed(str, unique=True)
    plan_type: str # monthly, yearly
    status: str # active, past_due, canceled, incomplete
    current_period_end: datetime

    class Settings:
        name = "subscriptions"

class Score(Document):
    user_id: Link[User]
    score: int = Field(ge=1, le=45)
    date: Indexed(date)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "scores"

class Draw(Document):
    draw_date: Indexed(datetime)
    status: str = "pending" # pending, completed, simulated
    winning_numbers: Optional[List[int]] = None
    mode: str = "random" # random, algorithm
    prize_pool: float = 0.0
    jackpot_rollover: float = 0.0
    winners_count: int = 0

    class Settings:
        name = "draws"

class DrawResult(Document):
    draw_id: Link[Draw]
    user_id: Link[User]
    numbers_matched: int = 0 # 3, 4, 5
    reward_amount: float = 0.0

    class Settings:
        name = "draw_results"

class Winner(Document):
    draw_result_id: Link[DrawResult]
    proof_url: Optional[str] = None
    status: str = "pending" # pending, approved, rejected
    admin_comment: Optional[str] = None
    verified_at: Optional[datetime] = None

    class Settings:
        name = "winners"

class CharityContribution(Document):
    user_id: Link[User]
    draw_id: Optional[Link[Draw]] = None
    charity_id: Link[Charity]
    amount: float
    percentage: float = 10.0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "charity_contributions"
