import re

def _normalize_devanagari_digits(s: str) -> str:
    devanagari_map = str.maketrans("०१२३४५६७८९", "0123456789")
    return s.translate(devanagari_map)

def parse_report(text: str, zone_id: str, disaster_type: str | None = None):
    normalized_text = _normalize_devanagari_digits(text)
    t = normalized_text.lower()

    numbers = [int(x.replace(",", "")) for x in re.findall(r"\d[\d,]*", normalized_text)]
    people = numbers[0] if numbers else 0
    disaster = disaster_type

    disaster_keywords = {
        "flood": ["flood", "बाढ़", "पूर", "पाणी"],
        "earthquake": ["earthquake", "भूकंप", "धरणीकंप"],
        "cyclone": ["cyclone", "तूफान", "चक्रीवादळ", "वादळ"],
        "landslide": ["landslide", "भूस्खलन", "दरड"],
        "fire": ["fire", "आग", "वणवा"],
        "tsunami": ["tsunami", "सुनामी"]
    }

    if not disaster:
        for kind, keywords in disaster_keywords.items():
            if any(k in t for k in keywords):
                disaster = kind
                break

    medical_keywords = [
        "hospital", "medical", "medicine", "injured", "doctor",
        "चिकित्सा", "अस्पताल", "डॉक्टर", "दवा", "घायल", "वैद्यकीय", "औषध", "आरोग्य", "जखमी", "रोगी", "मदत"
    ]
    rescue_keywords = [
        "trapped", "rescue", "evacuate", "stranded",
        "बचाव", "फंसे", "अडकले", "सुरक्षित", "वाचवा"
    ]
    infra_keywords = [
        "collapsed", "destroyed", "damaged", "bridge", "hospital",
        "क्षतिग्रस्त", "खराब", "पूल", "इमारत", "रस्ता", "गिरा", "मोडले"
    ]
    vulnerable_keywords = [
        "elderly", "children", "disabled", "pregnant",
        "बच्चे", "वृद्ध", "गर्भवती", "महिला", "मुले", "म्हातारे", "अपंग"
    ]

    return {
        "zone_id": zone_id,
        "disaster_type": disaster or "other",
        "people_affected": people,
        "medical_emergency": any(k in t for k in medical_keywords),
        "rescue_required": any(k in t for k in rescue_keywords),
        "infrastructure_damage": any(k in t for k in infra_keywords),
        "vulnerable_population": any(k in t for k in vulnerable_keywords),
        "raw_text": text,
    }

