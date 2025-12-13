from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import rebalancing_controller, transaction_controller, portfolio_controller
from database.connection import engine, Base
from app.models import transaction # Register models

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rebalancing_controller.router, prefix="/api/v1/rebalancing", tags=["rebalancing"])
app.include_router(transaction_controller.router, prefix="/api/v1/transactions", tags=["transactions"])
app.include_router(portfolio_controller.router, prefix="/api/v1/portfolio", tags=["portfolio"])