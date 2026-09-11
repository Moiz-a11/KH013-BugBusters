from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.store import store
from app.graph.disaster_workflow import run_incident_workflow
from app.realtime import manager

router = APIRouter()

class IncidentCreate(BaseModel):
    zone_id: str
    report: str = Field(min_length=5)
    disaster_type: str | None = None

@router.post("")
async def create_incident(payload: IncidentCreate):
    if payload.zone_id not in store.zones:
        raise HTTPException(404, "Zone not found")
    iid = f"INC-{len(store.incidents)+1:04d}"
    result = run_incident_workflow(
        payload.report, payload.zone_id, payload.disaster_type,
        list(store.incidents.values()), list(store.allocations.values()), list(store.resources.values())
    )
    result.update({
        "incident_id": iid, "status": "active",
        "created_at": store.now(), "updated_at": store.now()
    })
    store.incidents[iid] = result
    zone = store.zones[payload.zone_id]
    zone.update({"population": result["people_affected"], "severity": result["severity"],
                 "priority_score": result["priority_score"], "status": "active"})
    store.add_audit("INCIDENT_CREATED", f"{zone['name']} incident created; priority {result['priority_score']}", "report_agent", iid)
    if result["duplicate_check"]["detected"]:
        store.add_audit("DUPLICATE_DETECTED", f"Overlapping effort detected in {zone['name']}", "duplicate_agent", iid)
    await manager.broadcast("INCIDENT_CREATED", result)
    return result

@router.get("")
def list_incidents():
    return list(store.incidents.values())

@router.get("/{incident_id}")
def get_incident(incident_id: str):
    if incident_id not in store.incidents:
        raise HTTPException(404, "Incident not found")
    return store.incidents[incident_id]
