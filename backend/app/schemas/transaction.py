from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TransactionBase(BaseModel):
    type: str
    asset: str
    ticker: Optional[str] = None
    amount: float
    price: float
    currency: str = "KRW"
    fee: float = 0.0

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    date: datetime
    total: float

    class Config:
        from_attributes = True
