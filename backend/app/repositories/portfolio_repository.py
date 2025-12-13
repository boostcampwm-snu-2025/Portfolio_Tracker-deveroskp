from typing import Annotated, List, Dict, Any
from fastapi import Depends
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from database.connection import get_db_session


class PortfolioRepository:
    def __init__(self, session: Annotated[Session, Depends(get_db_session)]) -> None:
        self.session = session

    def get_current_holdings(self) -> List[Dict[str, Any]]:
        """
        Calculates current holdings from transaction history.
        """
        transactions = self.session.query(Transaction).all()
        
        holdings_map = {}

        for tx in transactions:
            # Skip cash deposits/withdrawals
            if tx.type in ["입금", "출금", "DEPOSIT", "WITHDRAWAL"]:
                continue
            if tx.asset == "현금":
                continue
                
            if tx.asset not in holdings_map:
                holdings_map[tx.asset] = {
                    "asset": tx.asset, 
                    "ticker": tx.ticker,
                    "amount": 0.0, 
                    "total_cost": 0.0
                }
            
            data = holdings_map[tx.asset]
            
            if tx.type == "매수" or tx.type == "BUY":
                data["amount"] += tx.amount
                data["total_cost"] += (tx.price * tx.amount) + tx.fee
            elif tx.type == "매도" or tx.type == "SELL":
                avg_price = data["total_cost"] / data["amount"] if data["amount"] > 0 else 0
                data["amount"] -= tx.amount
                data["total_cost"] -= avg_price * tx.amount
        
        result = []
        for asset, data in holdings_map.items():
            if data["amount"] > 1e-9:
                avg_price = data["total_cost"] / data["amount"]
                result.append({
                    "name": asset,
                    "asset": asset,
                    "symbol": data["ticker"],
                    "amount": data["amount"],
                    "avgPrice": avg_price,
                    "value": data["amount"] * avg_price
                })
        
        return result

    def calculate_summary(self) -> Dict[str, Any]:
        """
        Calculates Cash, Total Value, etc.
        Cash = 입금 - 출금 (매수/매도와 무관)
        Holdings = 보유자산 가치
        """
        transactions = self.session.query(Transaction).all()
        
        # Cash only tracks deposits and withdrawals
        cash = 0.0
        
        for tx in transactions:
            if tx.type in ["DEPOSIT", "입금"]:
                cash += tx.amount
            elif tx.type in ["WITHDRAWAL", "출금"]:
                cash -= tx.amount

        # Holdings value is calculated from current holdings
        holdings = self.get_current_holdings()
        holdings_value = sum(h["value"] for h in holdings)
        
        total_value = cash + holdings_value
        
        return {
            "totalValue": total_value,
            "cash": cash,
            "holdingsValue": holdings_value,
            "realizedPnL": 0.0,
            "unrealizedPnL": 0.0,
            "todaysChange": 0.0,
            "todaysChangePercent": 0.0
        }
