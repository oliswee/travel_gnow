import math


def gaussian_reward(
    t_minute: int,
    mu_minute: int,
    sigma_minute: float,
    weight: float = 1.0,
) -> float:
    """Gaussian reward for soft time window.

    Args:
        t_minute: Current time in minutes from midnight
        mu_minute: Best time midpoint in minutes
        sigma_minute: Half-width in minutes
        weight: UGC consensus strength 0-1

    Returns:
        Reward value 0-weight
    """
    return weight * math.exp(-((t_minute - mu_minute) ** 2) / (2 * sigma_minute**2))


def discretize_reward(
    mu_minute: int,
    sigma_minute: float,
    weight: float = 1.0,
    step: int = 15,
) -> dict[int, float]:
    """Precompute Gaussian reward as step-minute lookup table for CP-SAT."""
    lookup = {}
    for t in range(0, 24 * 60, step):
        lookup[t] = round(gaussian_reward(t, mu_minute, sigma_minute, weight), 4)
    return lookup
