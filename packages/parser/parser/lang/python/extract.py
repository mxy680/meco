import tree_sitter_python as tspython
from tree_sitter import Language, Parser
from parser.exceptions import InvalidFunctionException
from .validate import validate_fn

PY_LANGUAGE = Language(tspython.language())
parser = Parser(PY_LANGUAGE)


def extract_fn(code: str):
    code_bytes = bytes(code, "utf8")
    tree = parser.parse(code_bytes, encoding="utf8")

    if not validate_fn(code):
        raise InvalidFunctionException()

    fn = tree.root_node.children[0]
    print(fn)
    name = fn.child_by_field_name("name")
    print(f"Extracted function: {name}")
