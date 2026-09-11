from fastapi import APIRouter
from app.store import store
router = APIRouter()

@router.get("/summary")
def summary():
    incidents = list(store.incidents.values())
    return {
        "zones": len(store.zones),
        "active_incidents": len([i for i in incidents if i["status"] == "active"]),
        "critical": len([i for i in incidents if i["severity"] == "CRITICAL"]),
        "high": len([i for i in incidents if i["severity"] == "HIGH"]),
        "medium": len([i for i in incidents if i["severity"] == "MEDIUM"]),
        "low": len([i for i in incidents if i["severity"] == "LOW"]),
        "available_resources": sum(r["available_quantity"] for r in store.resources.values()),
        "active_missions": len([m for m in store.missions.values() if m["status"] == "dispatched"]),
    }
