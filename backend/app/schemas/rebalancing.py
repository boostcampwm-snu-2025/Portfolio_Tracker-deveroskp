from pydantic import BaseModel
from typing import Optional

class TargetAllocationItem(BaseModel):
    asset: str
    target: float

class RebalancingSuggestion(BaseModel):
    asset: str
    action: str 
    type: str   
    amount: int
    reason: str
    urgency: str
    detail: str
