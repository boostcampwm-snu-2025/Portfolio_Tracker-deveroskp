from typing import Annotated, List
from fastapi import APIRouter, Depends

from app.schemas.transaction import Transaction, TransactionCreate
from app.services.transaction_service import TransactionService

router = APIRouter()


@router.get("/", response_model=List[Transaction])
def read_transactions(
    skip: int = 0, 
    limit: int = 100, 
    service: Annotated[TransactionService, Depends()] = None
):
    return service.get_transactions(skip=skip, limit=limit)


@router.post("/", response_model=Transaction)
def create_transaction(
    transaction: TransactionCreate, 
    service: Annotated[TransactionService, Depends()] = None
):
    return service.create_transaction(transaction)
