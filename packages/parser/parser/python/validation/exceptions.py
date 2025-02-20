# Validation
class ModuleNotRootException(Exception):
    """Raised when the root node of the parsed code is not a module."""

    def __init__(
        self, message="The parsed code does not have a module as the root node."
    ):
        self.message = message
        super().__init__(self.message)


class ImportNotSupportedException(Exception):
    """Raised when the parsed code contains an import statement."""

    def __init__(self, message="Import statements are not supported."):
        self.message = message
        super().__init__(self.message)


class SingleFunctionOnlyException(Exception):
    """Raised when the parsed code contains more than one function."""

    def __init__(self, message="Only a single function definition is allowed."):
        self.message = message
        super().__init__(self.message)


class InvalidFunctionException(Exception):
    """Raised when the parsed code does not contain a valid function."""

    def __init__(self, message="The parsed code does not contain a valid function."):
        self.message = message
        super().__init__(self.message)


class InvalidTestCasesException(Exception):
    """Raised when the test cases are invalid."""

    def __init__(self, message="The test cases are invalid"):
        self.message = message
        super().__init__(self.message)
