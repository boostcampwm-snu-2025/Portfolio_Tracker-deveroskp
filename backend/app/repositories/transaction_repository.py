from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate
from database.connection import get_db_session


class TransactionRepository:
    def __init__(self, session: Annotated[Session, Depends(get_db_session)]) -> None:
        self.session = session

    def get_all(self, skip: int = 0, limit: int = 100):
        return self.session.query(Transaction).offset(skip).limit(limit).all()

    def create(self, transaction: TransactionCreate):
        total = transaction.amount * transaction.price
        db_transaction = Transaction(
            type=transaction.type,
            asset=transaction.asset,
            ticker=transaction.ticker,
            amount=transaction.amount,
            price=transaction.price,
            currency=transaction.currency,
            fee=transaction.fee,
            total=total
        )
        self.session.add(db_transaction)
        self.session.flush()
        return db_transaction
