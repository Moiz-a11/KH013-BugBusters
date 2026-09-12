from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.store import store
from app.realtime import manager

router = APIRouter()

class ResourceCreate(BaseModel):
    type: str
    quantity: int = Field(gt=0)
    agency_id: str
    zone_id: str | None = None

class ResourceUpdate(BaseModel):
    available_quantity: int = Field(ge=0)

@router.get("")
def list_resources():
    return list(store.resources.values())

@router.post("")
async def create_resource(payload: ResourceCreate):
    if not store.agencies:
        from app.services.bootstrap import bootstrap_demo
        bootstrap_demo()

    # Validate agency_id or default to AG-001 if unknown
    agency_id = payload.agency_id if payload.agency_id in store.agencies else "AG-001"

    existing_nums = [
        int(r.get("resource_id", "0").replace("RES-", ""))
        for r in store.resources.values()
        if isinstance(r.get("resource_id"), str) and r.get("resource_id", "").startswith("RES-") and r.get("resource_id", "").replace("RES-", "").isdigit()
    ]
    next_num = max(existing_nums or [0]) + 1
    rid = f"RES-{next_num:03d}"

    item = {
        "resource_id": rid,
        "type": payload.type,
        "quantity": payload.quantity,
        "available_quantity": payload.quantity,
        "agency_id": agency_id,
        "zone_id": payload.zone_id or "ZONE-A",
        "status": "available"
    }
    store.save_resource(item)
    store.add_audit(
        "RESOURCE_CREATED",
        f"Added new resource {rid} ({payload.type}, Qty: {payload.quantity})",
        "system",
        metadata={
            "resource_id": rid,
            "type": payload.type,
            "quantity": payload.quantity,
            "agency_id": agency_id,
            "zone_id": payload.zone_id or "ZONE-A"
        }
    )
    await manager.broadcast("RESOURCE_UPDATED", item)
    return item

@router.patch("/{resource_id}")
async def update_resource(resource_id: str, payload: ResourceUpdate):
    if resource_id not in store.resources:
        raise HTTPException(404, "Resource not found")
    r = store.resources[resource_id]
    r["available_quantity"] = min(payload.available_quantity, r["quantity"])
    store.save_resource(r)
    await manager.broadcast("RESOURCE_UPDATED", r)
    return r

