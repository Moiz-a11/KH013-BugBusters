def detect_duplicate(incident, existing_incidents, allocations, resources):
    zone = incident["zone_id"]
    requested = incident.get("needs", {})
    overlaps = []
    for a in allocations:
        if a.get("zone_id") != zone or a.get("status") in {"cancelled", "completed"}:
            continue
        overlaps.append(a)
    covered = {}
    for a in overlaps:
        typ = a["resource_type"]
        covered[typ] = covered.get(typ, 0) + a["quantity"]
    duplicate = {}
    for typ, qty in requested.items():
        if covered.get(typ, 0) > 0:
            duplicate[typ] = min(qty, covered[typ])
    return {"detected": bool(duplicate), "overlap": duplicate, "existing_allocations": overlaps}
