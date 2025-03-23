from runner.function.client import Runner
from parser.validate import validate_fn, validate_signature, validate_command
from parser.extract import extract_test_code, extract_signature
from optimizer.function.gpt.client import OpenAIOptimizer
from evolution.function.evo import EvolutionManager
from database.client import fail, update_job, end_job


async def optimize_function(job_id: int, request: dict):
    language = request["language"]

    # Validate the signature
    valid_sig, sig_message = validate_signature(
        request["signature"], request["test_cases"], language
    )

    if not valid_sig:
        await fail(job_id)
        return {"error": sig_message}

    fn = extract_signature(request["signature"], language)

    test_code = extract_test_code(fn, request["test_cases"], language)

    runner = Runner(language, test_code)
    runner.start_container()

    for model in request["models"]:
        optimizer = OpenAIOptimizer(
            request["signature"], request["description"], language, model, test_code
        )

        evo_manager = EvolutionManager(
            request["signature"],
            request["description"],
            language,
            model,
            request["test_cases"],
            test_code,
            optimizer,
            runner,
            validate_fn,
            validate_command,
        )

        async for data in evo_manager.baseline():
            await update_job(job_id, data)

        # Keep evolving until no more improvements can be made
        proceed = True
        while proceed:
            async for data in evo_manager.evolve():
                if isinstance(data, bool):
                    if data == False:
                        proceed = False
                        await end_job(job_id)
                        break

                await update_job(job_id, data)

    return {"success": True}
