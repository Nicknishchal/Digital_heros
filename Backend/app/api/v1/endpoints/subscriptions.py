from fastapi import APIRouter, Depends, HTTPException, Request, Header
from app.api import deps
from app.models.models import User
from app.services.stripe_service import StripeService
from app.core.config import settings

router = APIRouter()

@router.post("/create-checkout-session")
async def create_checkout_session(
    plan_type: str, # monthly or yearly
    current_user: User = Depends(deps.get_current_active_user)
):
    if plan_type not in ["monthly", "yearly"]:
        raise HTTPException(status_code=400, detail="Invalid plan type")
    
    session = await StripeService.create_checkout_session(
        user_id=str(current_user.id),
        email=current_user.email,
        plan_type=plan_type
    )
    return {"checkout_url": session.url}

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None)
):
    payload = await request.body()
    try:
        return await StripeService.handle_webhook(payload, stripe_signature)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
