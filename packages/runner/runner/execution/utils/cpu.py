def calculate_cpu_percent(stats_before, stats_after):
    """Compute CPU usage percentage."""
    cpu_delta = (
        stats_after["cpu_stats"]["cpu_usage"]["total_usage"]
        - stats_before["cpu_stats"]["cpu_usage"]["total_usage"]
    )
    system_delta = (
        stats_after["cpu_stats"]["system_cpu_usage"]
        - stats_before["precpu_stats"]["system_cpu_usage"]
    )
    num_cpus = stats_after["cpu_stats"]["online_cpus"]

    return (
        (cpu_delta / system_delta) * num_cpus * 100.0
        if system_delta > 0 and num_cpus > 0
        else 0.0
    )