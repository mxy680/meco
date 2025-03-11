import tree_sitter_python as tspython
from tree_sitter import Language, Parser

from typing import Tuple

PY_LANGUAGE = Language(tspython.language())
parser = Parser(PY_LANGUAGE)


def validate_fn(code: str) -> Tuple[bool, str]:
    code_bytes = bytes(code, "utf8")
    tree = parser.parse(code_bytes, encoding="utf8")
    root = tree.root_node
    if not root.type == "module":
        return False, "The code is not a valid Python function."

    try:
        for fn in root.children:
            if fn.type == "function_definition":
                name = fn.child_by_field_name("name").text.decode("utf8")
                params = (
                    fn.child_by_field_name("parameters").text.decode("utf8")[1:-1].split(", ")
                )

                body = fn.child_by_field_name("body").text.decode("utf8")

                if not name or not params or not body:
                    return False, "The function is not well-defined."
    except Exception as e:
        return False, str(e)

    return True, "The function is valid."
