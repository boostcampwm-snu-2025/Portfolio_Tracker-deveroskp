from typing import Annotated, List, Dict, Any
from fastapi import APIRouter, Depends

from app.services.portfolio_service import PortfolioService
from app.schemas.portfolio import PortfolioSummary, Holding

router = APIRouter()


@router.get("/summary", response_model=PortfolioSummary)
def get_portfolio_summary(service: Annotated[PortfolioService, Depends()] = None):
    return service.get_portfolio_summary()


@router.get("/holdings", response_model=List[Holding])
def get_holdings(service: Annotated[PortfolioService, Depends()] = None):
    return service.get_current_holdings()


@router.get("/allocation", response_model=List[Dict[str, Any]])
def get_allocation(service: Annotated[PortfolioService, Depends()] = None):
    holdings = service.get_current_holdings()
    summary = service.get_portfolio_summary()
    total_value = summary.totalValue
    cash = summary.cash
    
    allocation = []
    
    if cash > 0:
        allocation.append({
            "name": "현금",
            "value": (cash / total_value * 100) if total_value > 0 else 0,
            "color": "#94a3b8"
        })
        
    colors = ["#0ea5e9", "#22c55e", "#eab308", "#f97316", "#ef4444", "#a855f7"]
    for i, h in enumerate(holdings):
        percent = (h.value / total_value * 100) if total_value > 0 else 0
        allocation.append({
            "name": h.name,
            "value": percent,
            "color": colors[i % len(colors)]
        })
        
    return allocation
