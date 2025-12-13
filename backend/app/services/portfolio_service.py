from typing import Annotated, List
from fastapi import Depends

from app.repositories.portfolio_repository import PortfolioRepository
from app.schemas.portfolio import PortfolioSummary, Holding


class PortfolioService:
    def __init__(self, repository: Annotated[PortfolioRepository, Depends()]) -> None:
        self.repository = repository

    def get_portfolio_summary(self) -> PortfolioSummary:
        data = self.repository.calculate_summary()
        return PortfolioSummary(**data)

    def get_current_holdings(self) -> List[Holding]:
        data = self.repository.get_current_holdings()
        return [Holding(**h) for h in data]
