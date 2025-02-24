import tree_sitter_python as tspython
from tree_sitter import Language, Parser
from .exceptions import InvalidFunctionException

from typing import Union

PY_LANGUAGE = Language(tspython.language())
parser = Parser(PY_LANGUAGE)


def validate_fn(code: str) -> Union[bool, Exception]:
    code_bytes = bytes(code, "utf8")
    tree = parser.parse(code_bytes, encoding="utf8")
    root = tree.root_node
    if not root.type == "module":
        return InvalidFunctionException("The code is not a valid Python function.")

    # if root.children[0].type == "import_statement":
    #     return ImportNotSupportedException()

    if len(root.children) > 1:
        return InvalidFunctionException("The code contains more than one function.")

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
