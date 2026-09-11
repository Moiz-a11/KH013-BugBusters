from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.store import store
from app.realtime import manager

router = APIRouter()

class ResourceCreate(BaseModel):
    type: str
    quantity: int = Field(gt=0)
    agency_id: str

class ResourceUpdate(BaseModel):
    available_quantity: int = Field(ge=0)

@router.get("")
def list_resources():
    return list(store.resources.values())

@router.post("")
async def create_resource(payload: ResourceCreate):
    if payload.agency_id not in store.agencies:
        raise HTTPException(404, "Agency not found")
    rid = f"RES-{len(store.resources)+1:03d}"
    item = {"resource_id": rid, "type": payload.type, "quantity": payload.quantity,
            "available_quantity": payload.quantity, "agency_id": payload.agency_id, "status": "available"}
    store.resources[rid] = item
    await manager.broadcast("RESOURCE_UPDATED", item)
    return item

@router.patch("/{resource_id}")
async def update_resource(resource_id: str, payload: ResourceUpdate):
    if resource_id not in store.resources:
        raise HTTPException(404, "Resource not found")
    r = store.resources[resource_id]
    r["available_quantity"] = min(payload.available_quantity, r["quantity"])
    await manager.broadcast("RESOURCE_UPDATED", r)
    return r
