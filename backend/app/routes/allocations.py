from fastapi import APIRouter
from app.store import store
from app.optimization.resource_optimizer import optimize_allocations
from app.agents.coordination_agent import match_agencies
from app.realtime import manager

router = APIRouter()

@router.post("/optimize")
async def optimize():
    active = [i for i in store.incidents.values() if i["status"] == "active"]
    proposals = optimize_allocations(active, list(store.resources.values()))

    # Reset available quantities before applying the fresh global allocation.
    for r in store.resources.values():
        r["available_quantity"] = r["quantity"]

    store.allocations.clear()
    store.missions.clear()

    for p in proposals:
        rid = p["resource_id"]
        r = store.resources[rid]
        r["available_quantity"] = max(0, r["available_quantity"] - p["quantity"])
        aid = p["agency_id"]
        allocation_id = f"AL-{len(store.allocations)+1:04d}"
        allocation = {"allocation_id": allocation_id, **p, "created_at": store.now()}
        store.allocations[allocation_id] = allocation

        mission_id = f"MIS-{len(store.missions)+1:04d}"
        mission = {
            "mission_id": mission_id, "incident_id": p["incident_id"], "zone_id": p["zone_id"],
            "agency_id": aid, "resource_type": p["resource_type"], "quantity": p["quantity"],
            "status": "dispatched", "created_at": store.now()
        }
        store.missions[mission_id] = mission

    store.add_audit("ALLOCATION_OPTIMIZED",
                    f"Global allocation recalculated for {len(active)} active incidents",
                    "allocation_agent", metadata={"allocation_count": len(proposals)})
    await manager.broadcast("ALLOCATION_UPDATED", {"allocations": list(store.allocations.values()),
                                                    "resources": list(store.resources.values())})
    return {"allocations": list(store.allocations.values()), "missions": list(store.missions.values())}

@router.get("")
def list_allocations():
    return list(store.allocations.values())

@router.post("/reallocate")
async def reallocate():
    result = await optimize()
    store.add_audit("REALLOCATION_COMPLETED", "Resources re-allocated after situation change", "allocation_agent")
    await manager.broadcast("REALLOCATION_COMPLETED", result)
    return result
