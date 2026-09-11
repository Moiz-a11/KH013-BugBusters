"""
Groq LLM Service for ResQAI

Responsibilities:
- Communicate with the Groq API.
- Analyze natural-language disaster reports.
- Return structured disaster needs.
- Validate the LLM response.
- Never perform resource optimization.
- Fail safely so the Needs Assessment Agent can use
  the deterministic fallback.
"""

import json
import logging
from typing import Any

from groq import Groq

from app.config import settings


logger = logging.getLogger(__name__)


# ================================================================
# Allowed values
# ================================================================

ALLOWED_DISASTER_TYPES = {
    "flood",
    "earthquake",
    "cyclone",
    "tsunami",
    "landslide",
    "fire",
    "other",
}

ALLOWED_SEVERITIES = {
    "low",
    "medium",
    "high",
    "critical",
}

ALLOWED_RESOURCE_KEYS = {
    "food_packet",
    "water_bottle",
    "medical_kit",
    "rescue_team",
    "ambulance",
    "shelter",
    "boat",
}


# ================================================================
# System Prompt
# ================================================================

SYSTEM_PROMPT = """
You are the Needs Assessment Agent for ResQAI,
an emergency disaster-response coordination system.

Your task is to analyze an emergency incident report
and extract structured operational information.

Identify:

1. disaster type
2. number of affected people
3. severity
4. whether a medical emergency exists
5. whether rescue is required
6. required resource categories and estimated quantities
7. missing critical information

IMPORTANT RULES:

- Do not invent incident facts that are not present in the report.
- If the number of affected people is unknown, return 0.

- You MAY estimate operational resource quantities when the report
  clearly indicates that a resource is needed but does not provide
  an exact quantity.

- When estimating resource quantities, use:
  - number of affected people
  - disaster type
  - severity
  - medical emergency status
  - rescue requirement
  - explicitly mentioned resource needs

- Estimated resource quantities must be reasonable, non-negative
  integers and should be appropriate for the reported incident.

- If a resource is clearly required by the report, do not automatically
  return 0 merely because its exact quantity was not stated.

- Do not create a resource need that has no reasonable connection
  to the incident.

- Use only the allowed disaster types.
- Use only the allowed severity values.
- Use only the allowed resource keys.
- Resource quantities must be non-negative integers.

- Return ONLY valid JSON.
- Do not include Markdown.
- Do not include explanations outside the JSON.

- You are NOT responsible for final resource allocation.
- Do NOT decide which agency receives resources.
- Do NOT optimize global resource distribution.

- Your responsibility is to understand the incident, extract facts,
  identify operational needs, and estimate reasonable quantities
  for those needs.

- The returned resource quantities are NEED ESTIMATES only.
  The final allocation of available resources will be performed
  separately by the deterministic optimization system.

Allowed disaster types:

flood
earthquake
cyclone
tsunami
landslide
fire
other

Allowed severity:

low
medium
high
critical

Allowed resource keys:

food_packet
water_bottle
medical_kit
rescue_team
ambulance
shelter
boat

Return exactly this JSON structure:

{
  "disaster_type": "flood",
  "people_affected": 0,
  "severity": "medium",
  "medical_emergency": false,
  "rescue_required": false,
  "needs": {
    "food_packet": 0,
    "water_bottle": 0,
    "medical_kit": 0,
    "rescue_team": 0,
    "ambulance": 0,
    "shelter": 0,
    "boat": 0
  },
  "missing_information": []
}
"""


# ================================================================
# Create Groq Client
# ================================================================

def _get_client() -> Groq | None:
    """
    Create Groq client only when Groq is configured.
    """

    provider = (settings.LLM_PROVIDER or "").strip().lower()
    api_key = (settings.GROQ_API_KEY or "").strip()

    if provider != "groq":
        return None

    if not api_key:
        return None

    try:
        return Groq(
            api_key=api_key,
            timeout=30.0,
            max_retries=1,
        )

    except Exception:
        logger.exception(
            "Needs Agent: failed to initialize Groq client"
        )
        return None


# ================================================================
# Validate LLM Result
# ================================================================

def _validate_llm_result(data: Any) -> dict | None:
    """
    Validate structured JSON returned by Groq.

    Returns:
        Validated dictionary or None.
    """

    if not isinstance(data, dict):
        return None

    required_fields = {
        "disaster_type",
        "people_affected",
        "severity",
        "medical_emergency",
        "rescue_required",
        "needs",
        "missing_information",
    }

    # ------------------------------------------------------------
    # Required fields
    # ------------------------------------------------------------

    if not required_fields.issubset(data.keys()):
        logger.warning(
            "Needs Agent: LLM response missing required fields"
        )
        return None

    # ------------------------------------------------------------
    # Reject unexpected top-level fields
    # ------------------------------------------------------------

    if set(data.keys()) != required_fields:
        logger.warning(
            "Needs Agent: LLM response contains unexpected fields"
        )
        return None

    # ------------------------------------------------------------
    # Disaster type
    # ------------------------------------------------------------

    disaster_type = data.get("disaster_type")

    if not isinstance(disaster_type, str):
        return None

    disaster_type = disaster_type.strip().lower()

    if disaster_type not in ALLOWED_DISASTER_TYPES:
        logger.warning(
            "Needs Agent: invalid disaster type"
        )
        return None

    # ------------------------------------------------------------
    # People affected
    # ------------------------------------------------------------

    people_affected = data.get("people_affected")

    if isinstance(people_affected, bool):
        return None

    if not isinstance(people_affected, int):
        return None

    if people_affected < 0:
        return None

    # ------------------------------------------------------------
    # Severity
    # ------------------------------------------------------------

    severity = data.get("severity")

    if not isinstance(severity, str):
        return None

    severity = severity.strip().lower()

    if severity not in ALLOWED_SEVERITIES:
        logger.warning(
            "Needs Agent: invalid severity"
        )
        return None

    # ------------------------------------------------------------
    # Medical emergency
    # ------------------------------------------------------------

    medical_emergency = data.get("medical_emergency")

    if not isinstance(medical_emergency, bool):
        return None

    # ------------------------------------------------------------
    # Rescue required
    # ------------------------------------------------------------

    rescue_required = data.get("rescue_required")

    if not isinstance(rescue_required, bool):
        return None

    # ------------------------------------------------------------
    # Needs
    # ------------------------------------------------------------

    needs = data.get("needs")

    if not isinstance(needs, dict):
        return None

    # No arbitrary resources allowed.
    if set(needs.keys()) != ALLOWED_RESOURCE_KEYS:
        logger.warning(
            "Needs Agent: invalid resource keys"
        )
        return None

    validated_needs = {}

    for resource, quantity in needs.items():

        if isinstance(quantity, bool):
            return None

        if not isinstance(quantity, int):
            return None

        if quantity < 0:
            return None

        validated_needs[resource] = quantity

    # ------------------------------------------------------------
    # Missing information
    # ------------------------------------------------------------

    missing_information = data.get(
        "missing_information"
    )

    if not isinstance(missing_information, list):
        return None

    for item in missing_information:
        if not isinstance(item, str):
            return None

    # ------------------------------------------------------------
    # Return validated result
    # ------------------------------------------------------------

    return {
        "disaster_type": disaster_type,
        "people_affected": people_affected,
        "severity": severity,
        "medical_emergency": medical_emergency,
        "rescue_required": rescue_required,
        "needs": validated_needs,
        "missing_information": missing_information,
    }


# ================================================================
# Analyze Incident With Groq
# ================================================================

def analyze_incident_with_llm(
    report_text: str
) -> dict | None:
    """
    Analyze an incident report using Groq.

    Returns:
        Validated structured result.

    Returns None when:
        - Groq is not configured
        - API key is missing
        - API request fails
        - JSON is invalid
        - validation fails
    """

    if not report_text or not report_text.strip():
        logger.warning(
            "Needs Agent: empty incident report"
        )
        return None

    client = _get_client()

    if client is None:
        logger.info(
            "Needs Agent: Groq not configured, using fallback"
        )
        return None

    model = (
        settings.GROQ_MODEL
        or "llama-3.3-70b-versatile"
    ).strip()

    try:

        response = client.chat.completions.create(
            model=model,
            temperature=0,
            response_format={
                "type": "json_object"
            },
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": (
                        "Analyze the following emergency "
                        "incident report and return the "
                        "required JSON.\n\n"
                        "INCIDENT REPORT:\n"
                        f"{report_text.strip()}"
                    ),
                },
            ],
        )

        # --------------------------------------------------------
        # Check response
        # --------------------------------------------------------

        if not response.choices:
            logger.warning(
                "Needs Agent: Groq returned no choices"
            )
            return None

        message = response.choices[0].message

        if not message or not message.content:
            logger.warning(
                "Needs Agent: Groq returned empty content"
            )
            return None

        raw_content = message.content.strip()

        # --------------------------------------------------------
        # Parse JSON
        # --------------------------------------------------------

        try:
            data = json.loads(raw_content)

        except json.JSONDecodeError:
            logger.warning(
                "Needs Agent: invalid Groq JSON response, "
                "using fallback"
            )
            return None

        # --------------------------------------------------------
        # Validate
        # --------------------------------------------------------

        validated = _validate_llm_result(data)

        if validated is None:
            logger.warning(
                "Needs Agent: Groq response failed validation, "
                "using fallback"
            )
            return None

        logger.info(
            "Needs Agent: Groq LLM analysis successful"
        )

        return validated

    except Exception:
        # Never expose API key or authorization information.
        logger.exception(
            "Needs Agent: Groq unavailable, using fallback"
        )
        return None