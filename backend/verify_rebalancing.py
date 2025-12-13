from app.services.rebalancing_service import RebalancingService
import json

def verify():
    # Service no longer needs DB session
    rebalancing_service = RebalancingService()

    target_allocation = [
        {"asset": "주식", "target": 60},
        {"asset": "가상화폐", "target": 20},
        {"asset": "현금", "target": 20},
    ]

    print("\n--- Target Allocations ---")
    for t in target_allocation:
        print(f"{t['asset']}: {t['target']}%")

    print("\n--- Generating Suggestions ---")
    suggestions = rebalancing_service.generate_suggestions(target_allocation)

    print("\n--- Rebalancing Suggestions ---")
    print(json.dumps(suggestions, indent=4, ensure_ascii=False))

if __name__ == "__main__":
    verify()
