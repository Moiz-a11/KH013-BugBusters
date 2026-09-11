from app.agents.report_agent import parse_report
from app.agents.needs_agent import assess_needs
from app.agents.priority_agent import calculate_priority
from app.agents.duplicate_agent import detect_duplicate

def run_incident_workflow(report: str, zone_id: str, disaster_type: str | None, existing_incidents, allocations, resources):
    parsed = parse_report(report, zone_id, disaster_type)
    needs = assess_needs(parsed)
    score, level, reasons = calculate_priority(parsed, needs)
    incident = {
        **parsed,
        "needs": needs,
        "priority_score": score,
        "severity": level,
        "priority_reasons": reasons,
    }
    duplicate = detect_duplicate(incident, existing_incidents, allocations, resources)
    incident["duplicate_check"] = duplicate
    return incident
