import copy
from threading import RLock
from datetime import datetime, timezone

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

    def now(self):
        return datetime.now(timezone.utc).isoformat()

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
