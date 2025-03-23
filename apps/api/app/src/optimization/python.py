from app.models import OptimizationRequest
from runner.function.client import Runner
from parser.validate import validate_fn, validate_signature, validate_command
from parser.extract import extract_test_code, extract_signature
from optimizer.function.gpt.client import OpenAIOptimizer
from app.src.evolution.function.evo import EvolutionManager
from prisma import Json
from app.database.client import create_job, fail, update_job

language = "python"


async def optimize_python(request: OptimizationRequest):
    # Create datbase job instance
    job = await create_job()

    # Validate the signature
    valid_sig, sig_message = validate_signature(
        request.signature, request.test_cases, language
    )

    if not valid_sig:
        await fail(job.id)
        return {"error": sig_message}

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
            validate_command,
        )

        async for data in evo_manager.baseline():
            update_job(job.id, data)

        return
        # Keep evolving until no more improvements can be made
        proceed = True
        while proceed:
            async for data in evo_manager.evolve():
                proceed = data["proceed"]
                if not proceed:
                    print("No more improvements can be made.")
                    break

                print(data["message"])
