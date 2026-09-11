import logging

from app.config import settings
from app.services.llm_service import analyze_incident_with_llm
from app.ml.need_predictor import predict_need

logger = logging.getLogger(__name__)


def assess_needs(
    parsed: dict,
    report_text: str | None = None
):
    """
    Needs Assessment Agent.

    Priority:
    1. ML model
    2. Groq LLM if ML confidence is low
    3. Rule-based fallback if Groq is unavailable/fails

    The return format remains the same as the existing system
    so downstream agents are not affected.
    """

    # ---------------------------------------------------------
    # 1. ML MODEL
    # ---------------------------------------------------------
    if report_text:
        try:
            ml_result = predict_need(report_text)

            if not ml_result["fallback_required"]:
                logger.info(
                    "Needs Agent: source=ml | primary_need=%s | confidence=%s",
                    ml_result["need"],
                    ml_result["confidence"],
                )

                return _calculate_needs_from_primary_need(
                    parsed,
                    ml_result["need"]
                )

            logger.info(
                "Needs Agent: source=ml | confidence=%s | fallback=groq",
                ml_result["confidence"],
            )

        except Exception:
            logger.exception(
                "Needs Agent: ML prediction failed, fallback=groq"
            )

    # ---------------------------------------------------------
    # 2. GROQ LLM
    # ---------------------------------------------------------
    provider = (
        settings.LLM_PROVIDER or ""
    ).strip().lower()

    api_key = (
        settings.GROQ_API_KEY or ""
    ).strip()

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
                    "Needs Agent: source=groq | fallback_from=ml"
                )

                return llm_result["needs"]

        except Exception:
            logger.exception(
                "Needs Agent: Groq failed, fallback=rules"
            )

    # ---------------------------------------------------------
    # 3. RULE-BASED FALLBACK
    # ---------------------------------------------------------
    logger.info(
        "Needs Agent: source=rules | fallback_from=ml_and_groq"
    )

    return _calculate_rule_based_needs(parsed)


def _calculate_needs_from_primary_need(
    parsed: dict,
    primary_need: str
):
    """
    Use the ML prediction as the primary need signal,
    while keeping the existing quantity calculations.
    """

    needs = _calculate_rule_based_needs(parsed)

    # Make the ML-predicted category the primary need
    # without removing the other calculated resources.
    if primary_need == "WATER":
        needs["water_bottle"] = max(
            needs["water_bottle"],
            max(int(parsed.get("people_affected") or 0), 1)
        )

    elif primary_need == "FOOD":
        needs["food_packet"] = max(
            needs["food_packet"],
            max(
                round(
                    max(
                        int(parsed.get("people_affected") or 0),
                        1
                    ) * 0.60
                ),
                100
            )
        )

    elif primary_need == "MEDICAL":
        needs["medical_kit"] = max(
            needs["medical_kit"],
            max(
                round(
                    max(
                        int(parsed.get("people_affected") or 0),
                        1
                    ) * 0.06
                ),
                20
            )
        )

    elif primary_need == "SHELTER":
        needs["shelter"] = max(
            needs["shelter"],
            max(
                round(
                    max(
                        int(parsed.get("people_affected") or 0),
                        1
                    ) * 0.30
                ),
                100
            )
        )

    elif primary_need == "RESCUE":
        needs["rescue_team"] = max(
            needs["rescue_team"],
            2
        )

    return needs


def _calculate_rule_based_needs(parsed: dict):
    """
    Existing deterministic needs calculation.
    """

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