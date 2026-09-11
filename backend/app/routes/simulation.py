from fastapi import APIRouter
from pydantic import BaseModel
from app.store import store
from app.routes.incidents import IncidentCreate, create_incident
from app.routes.allocations import optimize
from app.realtime import manager

router = APIRouter()

class SimulationReport(BaseModel):
    zone_id: str
    report: str
    disaster_type: str | None = None

SCENARIO = [
    ("ZONE-A", "Severe flood. 2500 people are stranded. The hospital needs medicine and rescue support.", "flood"),
    ("ZONE-B", "High flood. 1500 people are affected and roads are blocked. Rescue is required.", "flood"),
    ("ZONE-C", "Moderate flood. 700 people need food and clean water.", "flood"),
    ("ZONE-D", "Critical earthquake. 3000 people are trapped and a hospital is damaged. Immediate medical rescue required.", "earthquake"),
    ("ZONE-E", "Cyclone warning with 900 people requiring shelter and evacuation support.", "cyclone"),
]

@router.post("/seed")
async def seed():
    store.clear()
    from app.services.bootstrap import bootstrap_demo
    bootstrap_demo()
    created = []
    for zone, report, kind in SCENARIO:
        created.append(await create_incident(IncidentCreate(zone_id=zone, report=report, disaster_type=kind)))
    await optimize()
    store.add_audit("SCENARIO_SEEDED", "Five-zone disaster simulation loaded", "simulation")
    await manager.broadcast("SCENARIO_SEEDED", {"zones": 5})
    return {"message": "Five-zone scenario seeded", "incidents": created}

@router.post("/emergency")
async def emergency():
    payload = IncidentCreate(
        zone_id="ZONE-B",
        disaster_type="flood",
        report="URGENT: Zone B hospital collapsed. 800 additional people are trapped, including elderly patients. Immediate rescue and medical assistance required."
    )
    incident = await create_incident(payload)
    result = await optimize()
    store.add_audit("EMERGENCY_REALLOCATION", "Zone B emergency triggered; global resources recalculated", "simulation", incident["incident_id"])
    await manager.broadcast("EMERGENCY_REALLOCATION", {"incident": incident, "result": result})
    return {"incident": incident, "reallocation": result}

@router.post("/report")
async def simulated_report(payload: SimulationReport):
    return await create_incident(IncidentCreate(**payload.model_dump()))
