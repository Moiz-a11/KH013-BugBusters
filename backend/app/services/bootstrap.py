from app.store import store

def bootstrap_demo():
    if store.seeded:
        return

    zones = [
        ("ZONE-A", "Zone A", 18.5204, 73.8567),
        ("ZONE-B", "Zone B", 18.5314, 73.8446),
        ("ZONE-C", "Zone C", 18.5074, 73.8077),
        ("ZONE-D", "Zone D", 18.5913, 73.7389),
        ("ZONE-E", "Zone E", 18.5642, 73.7769),
    ]
    for zid, name, lat, lon in zones:
        store.save_zone({
            "zone_id": zid, "name": name, "latitude": lat, "longitude": lon,
            "population": 1000, "severity": 0, "priority_score": 0, "status": "monitoring"
        })

    agencies = [
        ("AG-001", "Fire Department", ["rescue_team", "boat"]),
        ("AG-002", "Health Department", ["ambulance", "medical_kit"]),
        ("AG-003", "Relief NGO", ["food_packet", "water_bottle", "shelter"]),
        ("AG-004", "Police Department", ["evacuation", "security"]),
    ]
    for aid, name, capabilities in agencies:
        store.save_agency({"agency_id": aid, "name": name, "capabilities": capabilities, "status": "active"})

    resources = [
        ("RES-001","food_packet",5000,"AG-003"),("RES-002","water_bottle",8000,"AG-003"),
        ("RES-003","medical_kit",500,"AG-002"),("RES-004","rescue_team",8,"AG-001"),
        ("RES-005","ambulance",10,"AG-002"),("RES-006","boat",5,"AG-001"),
        ("RES-007","shelter",2000,"AG-003"),
    ]
    for rid, typ, qty, aid in resources:
        store.save_resource({
            "resource_id": rid, "type": typ, "quantity": qty,
            "available_quantity": qty, "agency_id": aid, "status": "available"
        })

    store.seeded = True
    store.add_audit("SYSTEM_INITIALIZED", "Five-zone demo environment initialized", "system")

