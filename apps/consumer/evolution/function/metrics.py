def get_metrics(result: dict) -> dict:
    """
    Extracts metrics from the result.
    """
    return {
        "runtime": result.get("runtime", float("inf")),
        "cpu_percent": result.get("cpu_percent", float("inf")),
        "memory_usage": result.get("memory_usage", float("inf")),
    }


def get_default_metrics():
    return {
        "runtime": float("inf"),
        "cpu": float("inf"),
        "memory": float("inf"),
    }
