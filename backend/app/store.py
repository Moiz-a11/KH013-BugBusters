import copy
from threading import RLock
from datetime import datetime, timezone
from app.db import (
    save_entity,
    delete_entity,
    clear_entities,
    load_all_entities,
)

class MemoryStore:
    def __init__(self):
        self.lock = RLock()
        self.incidents = {}
        self.resources = {}
        self.agencies = {}
        self.allocations = {}
        self.missions = {}
        self.audit_logs = []
        self.zones = {}
        self.seeded = False
        self.load_from_db()

    def now(self):
        return datetime.now(timezone.utc).isoformat()

    def load_from_db(self):
        with self.lock:
            zones_list = load_all_entities("zones")
            for z in zones_list:
                zid = z.get("zone_id") or z.get("id")
                if zid:
                    self.zones[zid] = z

            agencies_list = load_all_entities("agencies")
            for a in agencies_list:
                aid = a.get("agency_id") or a.get("id")
                if aid:
                    self.agencies[aid] = a

            resources_list = load_all_entities("resources")
            for r in resources_list:
                rid = r.get("resource_id") or r.get("id")
                if rid:
                    self.resources[rid] = r

            incidents_list = load_all_entities("incidents")
            for i in incidents_list:
                iid = i.get("incident_id") or i.get("id")
                if iid:
                    self.incidents[iid] = i

            allocations_list = load_all_entities("allocations")
            for al in allocations_list:
                alid = al.get("allocation_id") or al.get("id")
                if alid:
                    self.allocations[alid] = al

            missions_list = load_all_entities("missions")
            for m in missions_list:
                mid = m.get("mission_id") or m.get("id")
                if mid:
                    self.missions[mid] = m

            self.audit_logs = load_all_entities("audit_logs")
            self.audit_logs.sort(key=lambda x: x.get("timestamp", ""), reverse=True)

            if self.zones or self.resources or self.agencies or self.incidents:
                self.seeded = True

    def save_zone(self, zone):
        zid = zone.get("zone_id") or zone.get("id")
        if zid:
            self.zones[zid] = zone
            save_entity("zones", zid, zone)

    def save_agency(self, agency):
        aid = agency.get("agency_id") or agency.get("id")
        if aid:
            self.agencies[aid] = agency
            save_entity("agencies", aid, agency)

    def save_resource(self, resource):
        rid = resource.get("resource_id") or resource.get("id")
        if rid:
            self.resources[rid] = resource
            save_entity("resources", rid, resource)

    def save_incident(self, incident):
        iid = incident.get("incident_id") or incident.get("id")
        if iid:
            self.incidents[iid] = incident
            save_entity("incidents", iid, incident)

    def save_allocation(self, allocation):
        alid = allocation.get("allocation_id") or allocation.get("id")
        if alid:
            self.allocations[alid] = allocation
            save_entity("allocations", alid, allocation)

    def save_mission(self, mission):
        mid = mission.get("mission_id") or mission.get("id")
        if mid:
            self.missions[mid] = mission
            save_entity("missions", mid, mission)

    def sync_all_to_db(self):
        with self.lock:
            for zid, z in self.zones.items():
                save_entity("zones", zid, z)
            for aid, a in self.agencies.items():
                save_entity("agencies", aid, a)
            for rid, r in self.resources.items():
                save_entity("resources", rid, r)
            for iid, inc in self.incidents.items():
                save_entity("incidents", iid, inc)
            for alid, al in self.allocations.items():
                save_entity("allocations", alid, al)
            for mid, m in self.missions.items():
                save_entity("missions", mid, m)
            for log in self.audit_logs:
                lid = log.get("log_id")
                if lid:
                    save_entity("audit_logs", lid, log)

    def clear(self):
        with self.lock:
            self.incidents.clear()
            self.resources.clear()
            self.agencies.clear()
            self.allocations.clear()
            self.missions.clear()
            self.audit_logs.clear()
            self.zones.clear()
            self.seeded = False
            for t in ["zones", "agencies", "resources", "incidents", "allocations", "missions", "audit_logs"]:
                clear_entities(t)

    def add_audit(self, event_type, description, actor="system", incident_id=None, metadata=None):
        item = {
            "log_id": f"LOG-{len(self.audit_logs)+1:05d}",
            "event_type": event_type,
            "description": description,
            "actor": actor,
            "incident_id": incident_id,
            "timestamp": self.now(),
            "metadata": metadata or {},
        }
        self.audit_logs.insert(0, item)
        save_entity("audit_logs", item["log_id"], item)
        return item

    def snapshot(self):
        with self.lock:
            return copy.deepcopy({
                "incidents": list(self.incidents.values()),
                "resources": list(self.resources.values()),
                "agencies": list(self.agencies.values()),
                "allocations": list(self.allocations.values()),
                "missions": list(self.missions.values()),
                "audit_logs": self.audit_logs,
                "zones": list(self.zones.values()),
            })

store = MemoryStore()

