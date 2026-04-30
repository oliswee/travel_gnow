from fastapi import APIRouter

router = APIRouter()


@router.get("/trace/{trip_id}")
async def debug_trace(trip_id: str):
    return {
        "trip_id": trip_id,
        "agent_calls": [
            {"agent": "Intake Agent", "duration_ms": 1200, "status": "success"},
            {"agent": "RAG 检索", "duration_ms": 300, "status": "success"},
            {"agent": "Planner Agent", "duration_ms": 1000, "status": "success"},
            {"agent": "OR-Tools Solver", "duration_ms": 1500, "status": "success"},
            {"agent": "Reflection Agent", "duration_ms": 1200, "status": "success"},
        ],
        "solver_log": {
            "iterations": 47,
            "objective_value": 8234.5,
            "hard_constraint_satisfied": True,
            "soft_window_reward": 1240.0,
            "diversity_score": 0.78,
        },
    }
