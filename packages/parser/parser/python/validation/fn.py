import tree_sitter_python as tspython
from tree_sitter import Language, Parser
from .exceptions import (
    ModuleNotRootException,
    ImportNotSupportedException,
    SingleFunctionOnlyException,
    InvalidFunctionException,
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

    try:
        fn = tree.root_node.children[0]
        name = fn.child_by_field_name("name").text.decode("utf8")
        params = (
            fn.child_by_field_name("parameters").text.decode("utf8")[1:-1].split(", ")
        )

        body = fn.child_by_field_name("body").text.decode("utf8")

        if not name and params and body:
            return InvalidFunctionException()
    except Exception as e:
        print(e)
        return False

    return True
