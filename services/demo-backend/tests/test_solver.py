import pytest
from app.solver.cp_sat import solve_route


class MockPOI:
    def __init__(self, id: str, visit_duration: int):
        self.id = id
        self.visit_duration = visit_duration


class TestSolver:
    def test_solve_3_poi_route(self):
        pois = [MockPOI('a', 60), MockPOI('b', 45), MockPOI('c', 90)]
        dist = [
            [0, 15, 20],
            [15, 0, 10],
            [20, 10, 0],
        ]
        windows = [(480, 720), (540, 780), (600, 900)]

        result = solve_route(pois, dist, windows, time_limit_seconds=5)
        assert result is not None, "Solver should find a feasible solution"
        assert len(result['order']) == 3
        assert sorted(result['order']) == [0, 1, 2]
        assert result['status'] in ('optimal', 'feasible')

    def test_infeasible_returns_none(self):
        pois = [MockPOI('a', 60), MockPOI('b', 45)]
        dist = [[0, 10], [10, 0]]
        windows = [(1000, 1020), (0, 30)]

        result = solve_route(pois, dist, windows, time_limit_seconds=2)
        assert result is None

    def test_gaussian_reward(self):
        from app.solver.reward import gaussian_reward, discretize_reward

        # At exact mu, reward should equal weight
        r = gaussian_reward(600, 600, 30, 0.8)
        assert abs(r - 0.8) < 0.001

        # Far from mu, reward should approach 0
        r = gaussian_reward(0, 600, 30, 0.8)
        assert r < 0.001

        # Discretize returns expected keys
        lookup = discretize_reward(600, 30, 0.8)
        assert len(lookup) == 24 * 4  # 96 entries (15-min steps)
        assert 600 in lookup
        assert abs(lookup[600] - 0.8) < 0.001
