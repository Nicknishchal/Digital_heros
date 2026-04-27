from datetime import datetime
import stripe
from app.core.config import settings
from app.models.models import User, Subscription

stripe.api_key = settings.STRIPE_API_KEY

class StripeService:
    @staticmethod
    async def create_checkout_session(user_id: str, email: str, plan_type: str):
        price_id = settings.STRIPE_MONTHLY_PRICE_ID if plan_type == "monthly" else settings.STRIPE_YEARLY_PRICE_ID
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"https://digitalheros.com/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"https://digitalheros.com/cancel",
            customer_email=email,
            metadata={
                'user_id': user_id,
                'plan_type': plan_type
            }
        )
        return session

    @staticmethod
    async def handle_webhook(payload: str, sig_header: str):
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            raise Exception("Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise Exception("Invalid signature")

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            await StripeService._process_subscription(session)
        elif event['type'] == 'invoice.payment_succeeded':
            pass
        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            await StripeService._cancel_subscription(subscription)
            
        return {"status": "success"}

    @staticmethod
    async def _process_subscription(session):
        user_id = session['metadata']['user_id']
        stripe_sub_id = session['subscription']
        plan_type = session['metadata']['plan_type']
        
        stripe_sub = stripe.Subscription.retrieve(stripe_sub_id)
        
        user = await User.get(user_id)
        if user:
            user.subscription_status = "active"
            await user.save()
            
            sub = Subscription(
                user_id=user,
                stripe_subscription_id=stripe_sub_id,
                plan_type=plan_type,
                status="active",
                current_period_end=datetime.fromtimestamp(stripe_sub.current_period_end)
            )
            await sub.insert()

    @staticmethod
    async def _cancel_subscription(stripe_sub):
        stripe_sub_id = stripe_sub['id']
        sub = await Subscription.find_one(Subscription.stripe_subscription_id == stripe_sub_id, fetch_links=True)
        if sub:
            sub.status = "canceled"
            await sub.save()
            
            user = sub.user_id
            if user:
                user.subscription_status = "inactive"
                await user.save()
