from typing import Annotated, List, Dict, Any
from fastapi import Depends

from app.repositories.portfolio_repository import PortfolioRepository


class RebalancingService:
    def __init__(self, repository: Annotated[PortfolioRepository, Depends()]) -> None:
        self.repository = repository

    def generate_suggestions(self, target_allocations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generates rebalancing suggestions based on current holdings and target allocations.
        """
        current_holdings = self.repository.get_current_holdings()
        
        total_value = sum(item['amount'] for item in current_holdings)
        
        suggestions = []
        
        holdings_map = {item['asset']: item['amount'] for item in current_holdings}
        
        for target in target_allocations:
            asset_name = target['asset']
            target_percent = target['target']
            
            current_amount = holdings_map.get(asset_name, 0)
            current_percent = (current_amount / total_value * 100) if total_value > 0 else 0
            
            diff_percent = target_percent - current_percent
            
            if abs(diff_percent) >= 1.0:
                amount_to_adjust = abs(diff_percent) / 100 * total_value
                action = "매수" if diff_percent > 0 else "매도"
                type_ = "buy" if diff_percent > 0 else "sell"
                
                reason = ""
                if action == "매수":
                    reason = f"목표 비중({target_percent}%)보다 현재 비중({current_percent:.1f}%)이 낮음"
                else:
                    reason = f"목표 비중({target_percent}%)보다 현재 비중({current_percent:.1f}%)이 높음"

                urgency = "high" if abs(diff_percent) > 5 else "normal"

                suggestions.append({
                    "asset": asset_name,
                    "action": action,
                    "type": type_,
                    "amount": int(amount_to_adjust),
                    "reason": reason,
                    "urgency": urgency,
                    "detail": reason
                })
                
        return suggestions
