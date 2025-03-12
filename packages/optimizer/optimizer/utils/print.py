def print_function(title: str, function_code: str):
        print(f"\n🔢 {title}")
        print(function_code)

def print_metrics(result: dict):
    runtime = result.get("runtime", float("inf"))
    cpu_percent = result.get("cpu_percent", float("inf"))
    memory_usage = result.get("memory_usage", float("inf"))
    print(f"⏱ Runtime: {runtime} sec")
    print(f"📈 CPU Usage: {cpu_percent}%")
    print(f"💾 Memory Usage: {memory_usage} MB")