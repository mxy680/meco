import tree_sitter_python as tspython
from tree_sitter import Language, Parser
from parser.exceptions import InvalidFunctionException
from .validate import validate_fn
from typing import List, Tuple

PY_LANGUAGE = Language(tspython.language())
parser = Parser(PY_LANGUAGE)

type ExtractionResult = Tuple[str, List[str], str]


def extract_fn(code: str) -> ExtractionResult:
    code_bytes = bytes(code, "utf8")
    tree = parser.parse(code_bytes, encoding="utf8")

    if not validate_fn(code):
        raise InvalidFunctionException()

    fn = tree.root_node.children[0]
    name = fn.child_by_field_name("name").text.decode("utf8")
    params = fn.child_by_field_name("parameters").text.decode("utf8")[1:-1].split(", ")
    body = fn.child_by_field_name("body").text.decode("utf8")
    return name, params, body
