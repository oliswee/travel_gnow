"""Gemini AI agent pipeline: Intake -> RAG -> Planner -> Reflection."""

import json
from typing import Any
from google import genai
from google.genai import types as genai_types
from app.config import settings

client = genai.Client(api_key=settings.gemini_api_key)


INTAKE_SCHEMA = {
    "type": "object",
    "properties": {
        "city": {"type": "string"},
        "days": {"type": "integer"},
        "people": {"type": "integer"},
        "preferences": {"type": "array", "items": {"type": "string"}},
        "pace": {"type": "string", "enum": ["relaxed", "normal", "intensive"]},
        "max_budget": {"type": "integer"},
    },
    "required": ["city", "days", "people", "preferences"],
}

PLANNER_OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "plan_a_description": {"type": "string"},
        "plan_b_description": {"type": "string"},
        "plan_c_description": {"type": "string"},
        "poi_ids_a": {"type": "array", "items": {"type": "string"}},
        "poi_ids_b": {"type": "array", "items": {"type": "string"}},
        "poi_ids_c": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["plan_a_description", "plan_b_description", "plan_c_description"],
}


async def intake_agent(user_query: str, background_prompt: str = "") -> dict[str, Any]:
    """Parse user query into structured TripIntent."""
    prompt = (
        f"You are an AI travel planner. Parse the following user request into a structured intent.\n"
        f"User: {user_query}\n"
    )
    if background_prompt:
        prompt += f"User background: {background_prompt}\n"

    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=genai_types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=INTAKE_SCHEMA,
            temperature=0.1,
        ),
    )
    return json.loads(response.text)


async def rag_agent(intent: dict[str, Any], pois: list[dict[str, Any]]) -> list[str]:
    """Filter and rank POIs based on user intent. Returns POI IDs ordered by relevance."""
    prompt = (
        f"User intent: {json.dumps(intent, ensure_ascii=False)}\n"
        f"Available POIs: {json.dumps(pois, ensure_ascii=False)}\n"
        "Rank the POIs by relevance to this user. Return POI IDs in order of best match."
    )

    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=genai_types.GenerateContentConfig(temperature=0.2),
    )
    text = response.text.strip()
    ids = [id.strip() for id in text.replace("- ", "").split(",") if id.strip()]
    return ids


async def planner_agent(
    intent: dict[str, Any],
    user_profile: dict[str, Any],
    ranked_poi_ids: list[str],
) -> dict[str, Any]:
    """Generate three diverse plan strategies (A/B/C)."""
    prompt = (
        f"User intent: {json.dumps(intent, ensure_ascii=False)}\n"
        f"User profile: {json.dumps(user_profile, ensure_ascii=False)}\n"
        f"Available POI IDs (ranked by relevance): {ranked_poi_ids}\n\n"
        "Design THREE distinct trip plans:\n"
        "- Plan A: Maximize preference match\n"
        "- Plan B: Minimize travel time / most efficient\n"
        "- Plan C: Maximize comfort / least walking\n\n"
        "For each plan, provide a description and assign POI IDs."
    )

    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=genai_types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=PLANNER_OUTPUT_SCHEMA,
            temperature=0.5,
        ),
    )
    return json.loads(response.text)


async def reflection_agent(
    intent: dict[str, Any],
    plan_results: dict[str, Any],
) -> str:
    """Reflect on the generated plans and suggest improvements."""
    prompt = (
        f"User intent: {json.dumps(intent, ensure_ascii=False)}\n"
        f"Generated plans: {json.dumps(plan_results, ensure_ascii=False)}\n\n"
        "Review these plans. Are there any issues? Suggest quick fixes or confirm they look good."
    )

    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=genai_types.GenerateContentConfig(temperature=0.3),
    )
    return response.text.strip()
