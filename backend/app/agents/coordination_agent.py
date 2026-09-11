def match_agencies(needs, agencies, resources):
    result = []
    for typ, qty in needs.items():
        if qty <= 0:
            continue
        candidates = []
        for r in resources:
            if r["type"] == typ and r["available_quantity"] > 0:
                candidates.append(r)
        candidates.sort(key=lambda x: x["available_quantity"], reverse=True)
        remaining = qty
        for r in candidates:
            if remaining <= 0:
                break
            take = min(remaining, r["available_quantity"])
            agency = next((a for a in agencies if a["agency_id"] == r["agency_id"]), None)
            result.append({
                "resource_id": r["resource_id"], "resource_type": typ,
                "quantity": take, "agency_id": r["agency_id"],
                "agency_name": agency["name"] if agency else "Unknown"
            })
            remaining -= take
    return result
