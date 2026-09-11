from app.agents.report_agent import parse_report
from app.agents.needs_agent import assess_needs
from app.agents.priority_agent import calculate_priority
from app.agents.duplicate_agent import detect_duplicate


def run_incident_workflow(
    report: str,
    zone_id: str,
    disaster_type: str | None,
    existing_incidents,
    allocations,
    resources
):
    # ================================================================
    # 1. PARSE INCIDENT REPORT
    # ================================================================

    parsed = parse_report(
        report,
        zone_id,
        disaster_type
    )

    # ================================================================
    # 2. NEEDS ASSESSMENT
    # ================================================================
    # Pass the ORIGINAL natural-language report to the Needs Agent.
    #
    # The Needs Agent will:
    #   - Try OpenAI LLM if configured
    #   - Extract structured needs
    #   - Fall back to the existing rule-based calculation
    #     if the LLM is unavailable
    # ================================================================

    needs = assess_needs(
        parsed,
        report_text=report
    )

    # ================================================================
    # 3. PRIORITY CALCULATION
    # ================================================================
    # This remains deterministic.
    # No LLM is used here.

    score, level, reasons = calculate_priority(
        parsed,
        needs
    )

    # ================================================================
    # 4. BUILD INCIDENT
    # ================================================================

    incident = {
        **parsed,
        "needs": needs,
        "priority_score": score,
        "severity": level,
        "priority_reasons": reasons,
    }

    # ================================================================
    # 5. DUPLICATE DETECTION
    # ================================================================

    duplicate = detect_duplicate(
        incident,
        existing_incidents,
        allocations,
        resources
    )

    incident["duplicate_check"] = duplicate

    return incident