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
        transactions = self.session.query(Transaction).order_by(Transaction.date).all()
        
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
                # Cost Basis = (Price * Amount) + Fee
                data["amount"] += tx.amount
                data["total_cost"] += (tx.price * tx.amount) + tx.fee
            elif tx.type == "매도" or tx.type == "SELL":
                avg_price = data["total_cost"] / data["amount"] if data["amount"] > 0 else 0
                data["amount"] -= tx.amount
                # Reduce total cost by the proportion of sold amount
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
        Calculates Cash, Total Value, Realized PnL.
        """
        transactions = self.session.query(Transaction).order_by(Transaction.date).all()
        
        cash = 0.0
        realized_pnl = 0.0
        holdings_map = {}
        
        for tx in transactions:
            if tx.type in ["DEPOSIT", "입금"]:
                cash += tx.amount
            elif tx.type in ["WITHDRAWAL", "출금"]:
                cash -= tx.amount
            
            elif tx.type in ["BUY", "매수"]:
                cost = (tx.price * tx.amount) + tx.fee
                cash -= cost
                
                if tx.asset not in holdings_map:
                    holdings_map[tx.asset] = {"amount": 0.0, "total_cost": 0.0}
                
                holdings_map[tx.asset]["amount"] += tx.amount
                holdings_map[tx.asset]["total_cost"] += cost
                
            elif tx.type in ["SELL", "매도"]:
                proceeds = (tx.price * tx.amount) - tx.fee
                cash += proceeds
                
                if tx.asset in holdings_map and holdings_map[tx.asset]["amount"] > 0:
                    data = holdings_map[tx.asset]
                    avg_cost = data["total_cost"] / data["amount"]
                    
                    # Realized PnL = Proceeds - Cost Basis of sold amount
                    cost_basis_sold = avg_cost * tx.amount
                    pnl = proceeds - cost_basis_sold
                    realized_pnl += pnl
                    
                    data["amount"] -= tx.amount
                    data["total_cost"] -= cost_basis_sold

        # Calculate current holdings value (Cost Basis)
        # Note: To get true Market Value, we need current prices.
        # Here we use Cost Basis as a placeholder or if prices are not available.
        holdings_value = 0.0
        for data in holdings_map.values():
            if data["amount"] > 1e-9:
                # Remaining Cost Basis
                holdings_value += data["total_cost"]
        
        total_value = cash + holdings_value
        
        return {
            "totalValue": total_value,
            "cash": cash,
            "holdingsValue": holdings_value,
            "realizedPnL": realized_pnl,
            "unrealizedPnL": 0.0, # Requires current market price
            "todaysChange": 0.0,
            "todaysChangePercent": 0.0
        }
