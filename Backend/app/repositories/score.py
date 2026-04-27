from datetime import date
from typing import List, Any
from beanie import Link
from app.models.models import Score, User
from app.repositories.base import BaseRepository

class ScoreRepository(BaseRepository[Score]):
    def __init__(self):
        super().__init__(Score)

    async def get_by_user(self, user_id: Any) -> List[Score]:
        return await Score.find(Score.user_id.id == user_id).sort(-Score.date).to_list()

    async def add_score(self, user_id: Any, score_val: int, score_date: date) -> Score:
        # Check if date exists
        existing = await Score.find_one(Score.user_id.id == user_id, Score.date == score_date)
        if existing:
            raise ValueError("Duplicate date entry for score")

        # Add new score
        new_score = Score(user_id=user_id, score=score_val, date=score_date)
        await new_score.insert()

        # Check count and delete oldest if > 5
        scores = await Score.find(Score.user_id.id == user_id).sort(-Score.date).to_list()

        if len(scores) > 5:
            # Delete oldest (last in sorted list by date)
            oldest = scores[-1]
            await oldest.delete()

        return new_score
