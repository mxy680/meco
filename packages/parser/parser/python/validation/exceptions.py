# Validation
class InvalidFunctionException(Exception):
    """Raised when the function is invalid."""

    def __init__(self, message="The function is invalid"):
        self.message = message
        super().__init__(self.message)


class InvalidSignatureException(Exception):
    """Raised when the function signature is invalid."""

    def __init__(self, message="The function signature is invalid"):
        self.message = message
        super().__init__(self.message)
