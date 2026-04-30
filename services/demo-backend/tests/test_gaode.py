import pytest
from app.services.gaode import driving_distance_matrix


class TestGaodeService:
    @pytest.mark.asyncio
    async def test_driving_distance_same_point(self):
        coords = [(30.259, 120.145), (30.224, 120.115)]
        matrix = await driving_distance_matrix(coords, coords)
        assert len(matrix) == 2
        assert len(matrix[0]) == 2
        assert matrix[0][0] == 0  # same point
        assert matrix[0][1] > 0  # different points

    @pytest.mark.asyncio
    async def test_driving_distance_fallback(self):
        """Test with made-up coordinates to exercise the haversine fallback."""
        coords = [(0.0, 0.0), (1.0, 1.0)]
        matrix = await driving_distance_matrix(coords, coords)
        assert len(matrix) == 2
        assert matrix[0][0] == 0
