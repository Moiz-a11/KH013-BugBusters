from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import incidents, resources, agencies, allocations, dashboard, simulation, missions, audit, websocket
from app.services.bootstrap import bootstrap_demo

app = FastAPI(title=settings.APP_NAME, version="1.0.0")

origins = [x.strip() for x in settings.CORS_ORIGINS.split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(resources.router, prefix="/api/resources", tags=["Resources"])
app.include_router(agencies.router, prefix="/api/agencies", tags=["Agencies"])
app.include_router(allocations.router, prefix="/api/allocations", tags=["Allocations"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["Simulation"])
app.include_router(missions.router, prefix="/api/missions", tags=["Missions"])
app.include_router(audit.router, prefix="/api/audit-logs", tags=["Audit"])
app.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])

@app.on_event("startup")
async def startup():
    bootstrap_demo()

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "PS20 backend"}

@app.get("/")
def root():
    return {"message": "PS20 Disaster Relief Coordinator API", "docs": "/docs"}
