def validate_command(command: str):
    if not command or not command.startswith("poetry add "):
        return False, "Command must start with 'poetry add '"
    return True, ""