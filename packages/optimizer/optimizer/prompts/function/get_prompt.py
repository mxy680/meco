from typing import Tuple

from .python import (
    get_baseline_prompt_system_input as get_python_baseline_prompt_system_input,
    get_baseline_prompt_user_input as get_python_baseline_prompt_user_input,
    get_fix_prompt_system_input as get_python_fix_prompt_system_input,
    get_fix_prompt_user_input as get_python_fix_prompt_user_input,
    get_approach_prompt_system_input as get_python_approach_prompt_system_input,
    get_approach_prompt_user_input as get_python_approach_prompt_user_input,
    get_solution_prompt_system_input as get_python_solution_prompt_system_input,
    get_solution_prompt_user_input as get_python_solution_prompt_user_input,
    get_input_generation_prompt_system_input as get_python_input_generation_prompt_system_input,
    get_input_generation_prompt_user_input as get_python_input_generation_prompt_user_input,
)


def get_prompt(language: str, prompt_type: str, **kwargs) -> Tuple[str, str]:
    match language:
        case "python":
            match prompt_type:
                case "baseline":
                    return (
                        get_python_baseline_prompt_system_input(),
                        get_python_baseline_prompt_user_input(**kwargs),
                    )
                case "fix":
                    return (
                        get_python_fix_prompt_system_input(),
                        get_python_fix_prompt_user_input(**kwargs),
                    )
                case "approach":
                    return (
                        get_python_approach_prompt_system_input(),
                        get_python_approach_prompt_user_input(**kwargs),
                    )
                case "solution":
                    return (
                        get_python_solution_prompt_system_input(),
                        get_python_solution_prompt_user_input(**kwargs),
                    )
                case "input_generation":
                    return (
                        get_python_input_generation_prompt_system_input(),
                        get_python_input_generation_prompt_user_input(**kwargs),
                    )
                case _:
                    raise ValueError(f"Unsupported prompt type: {prompt_type}")
        case _:
            raise ValueError(f"Unsupported language: {language}")
