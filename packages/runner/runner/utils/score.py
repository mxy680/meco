def normalize_metric(value: float, min_value: float, max_value: float) -> float:
    # Avoid division by zero if min and max are the same.
    if max_value == min_value:
        return 0.0
    return (value - min_value) / (max_value - min_value)


def compute_score(
    scores: list,
    runtime_weight: float = 0.7,
    cpu_weight: float = 0.1,
    memory_weight: float = 0.2,
) -> list:
    """
    Given a list of solutions with raw metrics, compute a composite score for each.
    Each solution in 'scores' is a dictionary with keys: 'runtime', 'cpu_percent', 'memory_usage',
    and other fields.
    Returns the same list with an extra key 'composite_score' for each solution.
    """
    # Find min and max for each metric.
    min_runtime = min(s["runtime"] for s in scores)
    max_runtime = max(s["runtime"] for s in scores)

    min_cpu = min(s["cpu_percent"] for s in scores)
    max_cpu = max(s["cpu_percent"] for s in scores)

    min_memory = min(s["memory_usage"] for s in scores)
    max_memory = max(s["memory_usage"] for s in scores)

    for s in scores:
        norm_runtime = normalize_metric(s["runtime"], min_runtime, max_runtime)
        norm_cpu = normalize_metric(s["cpu_percent"], min_cpu, max_cpu)
        norm_memory = normalize_metric(s["memory_usage"], min_memory, max_memory)

        # The composite score is a weighted sum of the normalized metrics.
        # Lower composite scores are better.
        s["composite_score"] = (
            runtime_weight * norm_runtime
            + cpu_weight * norm_cpu
            + memory_weight * norm_memory
        )

    return scores
