import random
from datetime import datetime
from typing import List, Dict
from beanie import Link
from app.models.models import User, Score, Draw, DrawResult, CharityContribution, Subscription

class DrawService:
    async def generate_winning_numbers(self, mode: str = "random") -> List[int]:
        if mode == "random":
            return random.sample(range(1, 46), 5)
        else:
            # Algorithm-based: weighted by score frequency
            # Get all scores (simplified for Mongo)
            all_scores_docs = await Score.find_all().to_list()
            all_scores = [s.score for s in all_scores_docs]
            
            if not all_scores:
                return random.sample(range(1, 46), 5)
            
            # Count frequencies
            freq = {}
            for s in all_scores:
                freq[s] = freq.get(s, 0) + 1
            
            # Weighted choice
            weights = [freq.get(i, 1) for i in range(1, 46)]
            return random.choices(range(1, 46), weights=weights, k=5)

    async def run_draw(self, draw_id: str):
        draw = await Draw.get(draw_id)
        
        if not draw or draw.status == "completed":
            return

        # 1. Generate winning numbers if not set
        if not draw.winning_numbers:
            draw.winning_numbers = await self.generate_winning_numbers(draw.mode)

        # 2. Calculate Prize Pool
        # Simplified:
        draw.prize_pool = 10000.0 + draw.jackpot_rollover

        # 3. Match users
        active_users = await User.find(User.subscription_status == "active").to_list()

        winners = {5: [], 4: [], 3: []}
        winning_set = set(draw.winning_numbers)

        for user in active_users:
            # Get user's scores
            user_scores_docs = await Score.find(Score.user_id.id == user.id).sort(-Score.date).limit(5).to_list()
            user_scores = [s.score for s in user_scores_docs]
            
            matches = len(set(user_scores) & winning_set)
            if matches >= 3:
                winners[matches].append(user)

        # 4. Distribute Rewards
        payouts = {5: 0.5, 4: 0.3, 3: 0.2}
        total_winners = 0
        
        for match_count, percentage in payouts.items():
            if winners[match_count]:
                total_winners += len(winners[match_count])
                reward_per_user = (draw.prize_pool * percentage) / len(winners[match_count])
                for user in winners[match_count]:
                    # Create DrawResult
                    res = DrawResult(
                        draw_id=draw,
                        user_id=user,
                        numbers_matched=match_count,
                        reward_amount=reward_per_user
                    )
                    await res.insert()
                    
                    # 5. Handle Charity Contribution
                    if user.charity_id:
                        contribution_amount = reward_per_user * (user.charity_percentage / 100.0) 
                        contribution = CharityContribution(
                            user_id=user,
                            draw_id=draw,
                            charity_id=user.charity_id,
                            amount=contribution_amount,
                            percentage=user.charity_percentage
                        )
                        await contribution.insert()
            elif match_count == 5:
                # 6. Rollover if no 5-match winner
                draw.jackpot_rollover = draw.prize_pool * 0.5

        draw.winners_count = total_winners
        draw.status = "completed"
        await draw.save()
        return draw
