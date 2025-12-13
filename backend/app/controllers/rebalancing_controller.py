from typing import Annotated, List
from fastapi import APIRouter, Depends

from app.services.rebalancing_service import RebalancingService
from app.schemas.rebalancing import TargetAllocationItem, RebalancingSuggestion

router = APIRouter()


@router.post("/suggestions", response_model=List[RebalancingSuggestion])
def get_rebalancing_suggestions(
    target_allocations: List[TargetAllocationItem],
    service: Annotated[RebalancingService, Depends()] = None
):
    """
    Analyze portfolio and return rebalancing suggestions based on target allocations.
    """
    return service.generate_suggestions([t.model_dump() for t in target_allocations])
