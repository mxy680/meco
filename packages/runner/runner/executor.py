class CodeExecutor:
    @staticmethod
    def run_code_python(container, code, test_cases, script_name, run_command, workdir="/code"):
        if container.container is None:
            raise RuntimeError(
                "Container is not running. Call start_container() first."
            )
            
        # Append the test cases to the code
        test_cases_str = "\n".join([f"print(run({tc}))" for tc in test_cases])
        code += f"\n{test_cases_str}"
        
        # Construct the command to write `code` into script_name and run it.
        command = (
            f'echo "{code}" > {script_name} && '
            f"{run_command.format(file=script_name)}"
        )

        try:
            # Get initial container metrics before execution
            stats_before = container.container.stats(stream=False)

            exec_result = container.container.exec_run(
                cmd=["bash", "-c", command], workdir=workdir, stdout=True, stderr=True
            )

            # Get container metrics after execution
            stats_after = container.container.stats(stream=False)

            # Compute CPU usage
            cpu_percent = CodeExecutor.calculate_cpu_percent(stats_before, stats_after)
            memory_usage = stats_after["memory_stats"]["usage"]

            return {
                "stdout": exec_result.output.decode(),
                "exit_code": exec_result.exit_code,
                "cpu_percent": cpu_percent,
                "memory_usage": memory_usage,
            }

        except Exception as e:
            return {"error": str(e)}

    @staticmethod
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
