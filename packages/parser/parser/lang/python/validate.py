import tree_sitter_python as tspython
from tree_sitter import Language, Parser
from parser.exceptions import (
    ModuleNotRootException,
    ImportNotSupportedException,
    SingleFunctionOnlyException,
)

PY_LANGUAGE = Language(tspython.language())
parser = Parser(PY_LANGUAGE)


def validate_fn(code: str):
    code_bytes = bytes(code, "utf8")
    tree = parser.parse(code_bytes, encoding="utf8")
    root = tree.root_node
    if not root.type == "module":
        return ModuleNotRootException()

    if root.children[0].type == "import_statement":
        return ImportNotSupportedException()

    if len(root.children) > 1:
        return SingleFunctionOnlyException()

    return True
