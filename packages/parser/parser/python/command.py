def validate_command(command: str) -> None:
    if not command:
        return
    if not command.startswith("poetry add "):
        raise Exception("Command must start with 'poetry add '")
    if command == "poetry add ":
        raise Exception("Command must specify a package to add. If no package is needed, make command empty.")
