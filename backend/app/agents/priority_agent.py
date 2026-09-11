def calculate_priority(parsed: dict, needs: dict):
    people = min(int(parsed.get("people_affected") or 0), 5000)
    score = min(40, people / 125)
    score += 20 if parsed["medical_emergency"] else 0
    score += 15 if parsed["rescue_required"] else 0
    score += 10 if parsed["infrastructure_damage"] else 0
    score += 10 if parsed["vulnerable_population"] else 0
    score += 5 if parsed["disaster_type"] in {"earthquake", "cyclone", "tsunami"} else 0
    score = round(min(100, score), 1)
    if score >= 85:
        level = "CRITICAL"
    elif score >= 65:
        level = "HIGH"
    elif score >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"
    reasons = []
    if parsed["medical_emergency"]: reasons.append("medical emergency")
    if parsed["rescue_required"]: reasons.append("rescue required")
    if parsed["infrastructure_damage"]: reasons.append("infrastructure damage")
    if parsed["vulnerable_population"]: reasons.append("vulnerable population")
    return score, level, reasons
