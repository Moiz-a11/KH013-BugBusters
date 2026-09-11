import re

def parse_report(text: str, zone_id: str, disaster_type: str | None = None):
    t = text.lower()
    numbers = [int(x.replace(",", "")) for x in re.findall(r"\d[\d,]*", text)]
    people = numbers[0] if numbers else 0
    disaster = disaster_type
    if not disaster:
        for kind in ["flood", "earthquake", "cyclone", "landslide", "fire", "tsunami"]:
            if kind in t:
                disaster = kind
                break
    return {
        "zone_id": zone_id,
        "disaster_type": disaster or "other",
        "people_affected": people,
        "medical_emergency": any(k in t for k in ["hospital", "medical", "medicine", "injured", "doctor"]),
        "rescue_required": any(k in t for k in ["trapped", "rescue", "evacuate", "stranded"]),
        "infrastructure_damage": any(k in t for k in ["collapsed", "destroyed", "damaged", "bridge", "hospital"]),
        "vulnerable_population": any(k in t for k in ["elderly", "children", "disabled", "pregnant"]),
        "raw_text": text,
    }
