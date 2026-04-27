import asyncio
from app.db.session import init_db
from app.models.models import User
from app.core.config import settings
from app.core.security import get_password_hash

async def create_initial_data():
    await init_db()
    
    # Check if superuser exists
    user = await User.find_one(User.email == settings.FIRST_SUPERUSER)
    if not user:
        print(f"Creating superuser: {settings.FIRST_SUPERUSER}")
        user = User(
            email=settings.FIRST_SUPERUSER,
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            full_name="Initial Admin",
            is_superuser=True,
            is_active=True,
            subscription_status="active"
        )
        await user.insert()
        print("Superuser created successfully")
    else:
        print("Superuser already exists")

if __name__ == "__main__":
    asyncio.run(create_initial_data())
