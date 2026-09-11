import logging

from app.config import settings
from app.services.llm_service import analyze_incident_with_llm


logger = logging.getLogger(__name__)


def assess_needs(
    parsed: dict,
    report_text: str | None = None
):
    """
    Needs Assessment Agent.

    Groq LLM is used to understand the incident report.
    Existing rule-based logic is the fallback.
    """

    provider = (
        settings.LLM_PROVIDER or ""
    ).strip().lower()

    api_key = (
        settings.GROQ_API_KEY or ""
    ).strip()

    # ============================================================
    # TRY GROQ
    # ============================================================

    if (
        provider == "groq"
        and api_key
        and report_text
    ):

        try:

            llm_result = analyze_incident_with_llm(
                report_text
            )

            if llm_result is not None:

                logger.info(
                    "Needs Agent: using Groq LLM assessment"
                )

                return llm_result["needs"]

        except Exception:

            logger.exception(
                "Needs Agent: Groq failed, using fallback"
            )

    # ============================================================
    # EXISTING RULE-BASED FALLBACK
    # ============================================================

    logger.info(
        "Needs Agent: using rule-based fallback"
    )

    people = max(
        int(parsed.get("people_affected") or 0),
        1
    )

    severe = parsed.get("disaster_type") in {
        "earthquake",
        "cyclone",
        "tsunami"
    }

    food = max(
        100,
        round(people * 0.60)
    )

    water = max(
        150,
        round(people * 1.00)
    )

    medical = max(
        20,
        round(
            people
            * (
                0.06
                if parsed.get("medical_emergency")
                else 0.02
            )
        )
    )

    rescue = (
        2
        if parsed.get("rescue_required")
        else (1 if severe else 0)
    )

    ambulances = (
        2
        if parsed.get("medical_emergency")
        else 0
    )

    shelter = max(
        100,
        round(people * 0.30)
    )

    boats = (
        1
        if (
            parsed.get("disaster_type") == "flood"
            and parsed.get("rescue_required")
        )
        else 0
    )

    return {
        "food_packet": food,
        "water_bottle": water,
        "medical_kit": medical,
        "rescue_team": rescue,
        "ambulance": ambulances,
        "shelter": shelter,
        "boat": boats
    }