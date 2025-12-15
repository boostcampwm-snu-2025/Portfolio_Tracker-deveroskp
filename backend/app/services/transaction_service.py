from typing import Annotated
from fastapi import Depends, HTTPException

from app.repositories.transaction_repository import TransactionRepository
from app.repositories.portfolio_repository import PortfolioRepository
from app.schemas.transaction import TransactionCreate


class TransactionService:
    def __init__(
        self, 
        repository: Annotated[TransactionRepository, Depends()],
        portfolio_repository: Annotated[PortfolioRepository, Depends()]
    ) -> None:
        self.repository = repository
        self.portfolio_repository = portfolio_repository

    def get_transactions(self, skip: int = 0, limit: int = 100):
        return self.repository.get_all(skip, limit)

    def create_transaction(self, transaction: TransactionCreate):
        # Validate buy transactions
        if transaction.type in ["매수", "BUY"]:
            summary = self.portfolio_repository.calculate_summary()
            cash = summary["cash"]
            required_cash = (transaction.amount * transaction.price) + transaction.fee
            
            if required_cash > cash:
                raise HTTPException(
                    status_code=400,
                    detail=f"현금이 부족합니다. 보유 현금: {cash:,.0f}, 필요 금액: {required_cash:,.0f}"
                )

        # Validate withdrawal transactions
        if transaction.type in ["출금", "WITHDRAWAL"]:
            summary = self.portfolio_repository.calculate_summary()
            cash = summary["cash"]
            
            if transaction.amount > cash:
                raise HTTPException(
                    status_code=400,
                    detail=f"출금 가능한 현금이 부족합니다. 보유 현금: {cash:,.0f}"
                )

        # Validate sell transactions
        if transaction.type in ["매도", "SELL"]:
            holdings = self.portfolio_repository.get_current_holdings()
            
            # Find the asset in holdings
            asset_holding = None
            for h in holdings:
                if h["asset"] == transaction.asset or h["name"] == transaction.asset:
                    asset_holding = h
                    break
            
            if asset_holding is None:
                raise HTTPException(
                    status_code=400, 
                    detail=f"보유하지 않은 자산입니다: {transaction.asset}"
                )
            
            if transaction.amount > asset_holding["amount"]:
                raise HTTPException(
                    status_code=400, 
                    detail=f"매도 수량({transaction.amount})이 보유 수량({asset_holding['amount']})을 초과합니다."
                )
        
        return self.repository.create(transaction)
