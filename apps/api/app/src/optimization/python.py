from app.models import OptimizationRequest
from runner.function.client import Runner
from runner.utils.score import compute_score
from parser.validate import validate_fn, validate_signature, validate_command
from parser.extract import extract_test_code, extract_signature
from optimizer.function.gpt.client import OpenAIOptimizer
from app.src.evolution.function.evo import EvolutionManager

language = "python"


async def optimize_python(request: OptimizationRequest):
    valid_sig, sig_message = validate_signature(
        request.signature, request.test_cases, language
    )
    if not valid_sig:
        raise ValueError(f"❌ Signature validation failed: {sig_message}")
    fn = extract_signature(request.signature, language)

    test_code = extract_test_code(fn, request.test_cases, language)

    runner = Runner(language, test_code)
    runner.start_container()

    for model in request.models:
        optimizer = OpenAIOptimizer(
            request.signature, request.description, language, model, test_code
        )

        evo_manager = EvolutionManager(
            request.signature,
            request.description,
            language,
            model,
            request.test_cases,
            test_code,
            optimizer,
            runner,
            validate_fn,
            validate_command
        )

        await evo_manager.baseline()

        await evo_manager.evolve()
        await evo_manager.evolve()
