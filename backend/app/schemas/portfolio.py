from pydantic import BaseModel
from typing import List, Optional

class Holding(BaseModel):
    name: str
    symbol: Optional[str] = None
    amount: float
    avgPrice: float
    value: float
    profit: float = 0.0
    profitPercent: float = 0.0

class PortfolioSummary(BaseModel):
    totalValue: float
    cash: float
    holdingsValue: float
    realizedPnL: float
    unrealizedPnL: float
    todaysChange: float
    todaysChangePercent: float
