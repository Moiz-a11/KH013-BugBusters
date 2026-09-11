def assess_needs(parsed: dict):
    people = max(int(parsed.get("people_affected") or 0), 1)
    severe = parsed.get("disaster_type") in {"earthquake", "cyclone", "tsunami"}
    food = max(100, round(people * 0.60))
    water = max(150, round(people * 1.00))
    medical = max(20, round(people * (0.06 if parsed["medical_emergency"] else 0.02)))
    rescue = 2 if parsed["rescue_required"] else (1 if severe else 0)
    ambulances = 2 if parsed["medical_emergency"] else 0
    shelter = max(100, round(people * 0.30))
    boats = 1 if parsed["disaster_type"] == "flood" and parsed["rescue_required"] else 0
    return {
        "food_packet": food, "water_bottle": water, "medical_kit": medical,
        "rescue_team": rescue, "ambulance": ambulances, "shelter": shelter, "boat": boats
    }
