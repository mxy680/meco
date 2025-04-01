from runner.function.client import Runner
from parser.validate import validate_signature, validate_test_cases
from parser.extract import extract_test_cases, extract_signature
from optimizer.function.gpt.client import OpenAIOptimizer
from evolution.function.manager import EvolutionManager
from database.client import update_job, end_job
import json
from operator import itemgetter
import uuid

async def optimize(job_id: int, request: dict):
    language, signature, description, models, test_cases = itemgetter(
        "language", "signature", "description", "models", "test_cases"
    )(request)

    # Validate the signature
    validate_signature(signature, language)

    # Extract the function properties: name, return type, and params
    fn = extract_signature(signature, language)
    name, params = itemgetter("name", "params")(fn)

    # Validate the test cases
    validate_test_cases(params, test_cases, language)

    # Extract the test cases into code
    test_code = extract_test_cases(name, test_cases, language)
    
    # Start the runner
    runner = Runner(language, test_code)

    data = {}
    for model in models:
        # Start the optimizer
        optimizer = OpenAIOptimizer(signature, description, language, model, test_code)

        # Start the evolution manager
        evo_manager = EvolutionManager(
            signature,
            description,
            language,
            model,
            test_cases,
            optimizer,
            runner,
        )

        step = 1
        async for baseline_data in evo_manager.baseline():
            data[model] = json.loads(baseline_data)
            await update_job(job_id, data)
            # Save the data to a json file
            with open(f"output/baseline_{step}.json", "w") as f:
                json.dump(data[model], f)
                step += 1

        # Keep evolving until no more improvements can be made
        proceed = True
        while proceed:
            async for evolution_data in evo_manager.evolve():
                if isinstance(evolution_data, bool):
                    if evolution_data == False:
                        proceed = False
                        await end_job(job_id)
                        break

                data[model] = json.loads(evolution_data)
                await update_job(job_id, data)
                with open(f"output/baseline_{step}.json", "w") as f:
                    json.dump(data[model], f)
                    step += 1

    print("Optimization complete")
