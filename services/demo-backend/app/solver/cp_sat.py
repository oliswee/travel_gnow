"""OR-Tools CP-SAT solver for TSP-TW route optimization."""

from ortools.sat.python import cp_model
from typing import Any


def solve_route(
    pois: list[Any],
    distance_matrix: list[list[int]],
    time_windows: list[tuple[int, int] | None],
    start_time: int = 8 * 60,
    end_time: int = 22 * 60,
    time_limit_seconds: int = 10,
) -> dict | None:
    """Solve TSP-TW using CP-SAT with circuit constraint.

    Args:
        pois: List of POI objects with id and visit_duration
        distance_matrix: n x n matrix of travel times in minutes
        time_windows: List of (open, close) tuples or None for no constraint
        start_time: Global start time in minutes from midnight
        end_time: Global end time in minutes from midnight
        time_limit_seconds: Solver timeout

    Returns:
        Dict with 'order', 'arrivals', 'total_time', 'objective' or None if infeasible
    """
    n = len(pois)
    model = cp_model.CpModel()

    # x[i][j] = True iff we travel directly from POI i to POI j
    x: dict[tuple[int, int], cp_model.BoolVarT] = {}
    for i in range(n):
        for j in range(n):
            if i != j:
                x[i, j] = model.NewBoolVar(f'x_{i}_{j}')

    # Constant false literal for self-loops
    false_lit = model.NewBoolVar('false')
    model.Add(false_lit == 0)

    # Circuit constraint: each node has exactly one incoming and one outgoing arc,
    # forming a single Hamiltonian circuit (no subtours).
    arcs = []
    for i in range(n):
        for j in range(n):
            if i != j:
                arcs.append((i, j, x[i, j]))
        arcs.append((i, i, false_lit))  # no self-loops
    model.AddCircuit(arcs)

    # Arrival time at each POI (in minutes from midnight)
    arr_var = [model.NewIntVar(start_time, end_time, f'arr_{i}') for i in range(n)]

    # Fix start node arrival at the beginning of the day.
    # The circuit closing edge returns here but we skip its successor constraint,
    # so this variable represents only the initial visit.
    model.Add(arr_var[0] == start_time)

    # Big-M: upper bound for the linear relaxation
    max_travel = max(
        distance_matrix[i][j] for i in range(n) for j in range(n)
    )
    max_visit = max(p.visit_duration for p in pois) if pois else 0
    M = end_time + max_travel + max_visit

    # Successor constraint: if x[i][j] == 1 and j != 0 (not returning to start), then
    #   arrival[j] >= arrival[i] + visit_duration[i] + travel_time[i][j]
    # The return edge to start (node 0) is unconstrained since it's just for tour closure.
    for i in range(n):
        for j in range(n):
            if i != j and j != 0:
                model.Add(
                    arr_var[j] >= arr_var[i] + pois[i].visit_duration + distance_matrix[i][j] - M * (1 - x[i, j])
                )

    # Time window constraints
    for i, (open_t, close_t) in enumerate(time_windows):
        if open_t is not None:
            model.Add(arr_var[i] >= open_t)
        if close_t is not None:
            model.Add(arr_var[i] + pois[i].visit_duration <= close_t)

    # Minimize makespan (time last POI finishes)
    makespan = model.NewIntVar(0, end_time - start_time, 'makespan')
    model.AddMaxEquality(makespan, [arr_var[i] + pois[i].visit_duration for i in range(n)])
    model.Minimize(makespan)

    # Solve
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = time_limit_seconds
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        # Reconstruct the order by following arcs from node 0
        order = [0]
        current = 0
        for _ in range(n - 1):
            for j in range(n):
                if current != j and solver.BooleanValue(x[current, j]):
                    current = j
                    break
            order.append(current)

        arrivals = [int(solver.Value(arr_var[i])) for i in order]

        return {
            'order': order,
            'arrivals': arrivals,
            'total_time': int(solver.Value(makespan)),
            'objective': solver.ObjectiveValue(),
            'iterations': solver.NumConflicts(),
            'status': 'optimal' if status == cp_model.OPTIMAL else 'feasible',
        }

    return None
