from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.store import store
from app.graph.disaster_workflow import run_incident_workflow
from app.realtime import manager
from app.routes.allocations import optimize


router = APIRouter()


class IncidentCreate(BaseModel):
    zone_id: str
    report: str = Field(min_length=5)
    disaster_type: str | None = None


@router.post("")
async def create_incident(payload: IncidentCreate):
    # Check whether the selected zone exists
    if payload.zone_id not in store.zones:
        raise HTTPException(
            status_code=404,
            detail="Zone not found"
        )

    # Generate incident ID
    iid = f"INC-{len(store.incidents) + 1:04d}"

    # Create pending incident record (Awaiting EOC Review)
    incident_record = {
        "incident_id": iid,
        "zone_id": payload.zone_id,
        "report": payload.report,
        "disaster_type": payload.disaster_type or "flood",
        "status": "pending",
        "severity": "PENDING",
        "priority_score": 0,
        "people_affected": 0,
        "needs": {},
        "created_at": store.now(),
        "updated_at": store.now(),
    }

    # Store incident
    store.save_incident(incident_record)

    # Audit incident receipt
    store.add_audit(
        "REPORT_RECEIVED",
        f"Public emergency report {iid} received for {payload.zone_id}; awaiting EOC approval",
        "public_user",
        iid
    )

    # Broadcast real-time update to EOC controllers
    await manager.broadcast(
        "REPORT_SUBMITTED",
        incident_record
    )

    return incident_record


@router.post("/{incident_id}/approve")
async def approve_incident(incident_id: str):
    if incident_id not in store.incidents:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    incident = store.incidents[incident_id]

    # Run AI incident analysis workflow upon EOC approval
    result = run_incident_workflow(
        incident["report"],
        incident["zone_id"],
        incident.get("disaster_type"),
        list(store.incidents.values()),
        list(store.allocations.values()),
        list(store.resources.values())
    )

    # Add incident metadata
    result.update({
        "incident_id": incident_id,
        "status": "active",
        "created_at": incident.get("created_at", store.now()),
        "updated_at": store.now()
    })

    # Store incident
    store.save_incident(result)

    # Update affected zone
    zone_id = incident["zone_id"]
    if zone_id in store.zones:
        zone = store.zones[zone_id]
        zone.update({
            "population": result.get("people_affected", 0),
            "severity": result.get("severity", "HIGH"),
            "priority_score": result.get("priority_score", 50),
            "status": "active"
        })
        store.save_zone(zone)

    # Audit incident approval
    store.add_audit(
        "HUMAN_APPROVED",
        f"EOC Controller approved report {incident_id} in {zone_id}. Priority: {result.get('priority_score')}",
        "human",
        incident_id
    )

    # Audit duplicate effort detection if applicable
    if result.get("duplicate_check", {}).get("detected"):
        store.add_audit(
            "DUPLICATE_DETECTED",
            f"Overlapping effort detected in {zone_id}",
            "duplicate_agent",
            incident_id
        )

    # Re-optimize allocations automatically after approval
    await optimize()

    # Broadcast real-time update
    await manager.broadcast(
        "INCIDENT_APPROVED",
        result
    )

    return result


@router.post("/{incident_id}/reject")
async def reject_incident(incident_id: str):
    if incident_id not in store.incidents:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    incident = store.incidents[incident_id]
    incident["status"] = "rejected"
    incident["updated_at"] = store.now()
    store.save_incident(incident)

    # Audit rejection
    store.add_audit(
        "REPORT_REJECTED",
        f"EOC Controller rejected report {incident_id}.",
        "human",
        incident_id
    )

    await manager.broadcast(
        "INCIDENT_REJECTED",
        incident
    )

    return incident


@router.get("")
def list_incidents():
    return list(store.incidents.values())


@router.get("/{incident_id}")
def get_incident(incident_id: str):
    if incident_id not in store.incidents:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return store.incidents[incident_id]