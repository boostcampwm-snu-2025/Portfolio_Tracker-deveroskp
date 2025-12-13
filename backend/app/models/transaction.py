from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database.connection import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), server_default=func.now())
    type = Column(String(10), nullable=False) # BUY, SELL
    asset = Column(String(100), nullable=False) # e.g., 'Apple'
    ticker = Column(String(20), nullable=True) # e.g., 'AAPL'
    amount = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="KRW")
    fee = Column(Float, default=0.0)
    total = Column(Float, nullable=False) # Cached total (amount * price)
