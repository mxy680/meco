import tree_sitter_python as tspython
from tree_sitter import Language, Parser

from typing import Union

PY_LANGUAGE = Language(tspython.language())
parser = Parser(PY_LANGUAGE)


class InvalidFunctionException(Exception):
    """Raised when the function is invalid."""

    def __init__(self, message="The function is invalid"):
        self.message = message
        super().__init__(self.message)


def validate_fn(code: str) -> Union[bool, Exception]:
    code_bytes = bytes(code, "utf8")
    tree = parser.parse(code_bytes, encoding="utf8")
    root = tree.root_node
    if not root.type == "module":
        return InvalidFunctionException("The code is not a valid Python function.")

    try:
        fn = tree.root_node.children[0]
        name = fn.child_by_field_name("name").text.decode("utf8")
        params = (
            fn.child_by_field_name("parameters").text.decode("utf8")[1:-1].split(", ")
        )

        body = fn.child_by_field_name("body").text.decode("utf8")

        if not name or not params or not body:
            return InvalidFunctionException("The function is not well-defined.")
    except Exception as e:
        return False

    return True
