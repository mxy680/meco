import tree_sitter_python as tspython
from tree_sitter import Language, Parser
from typing import Dict

PY_LANGUAGE = Language(tspython.language())
parser = Parser(PY_LANGUAGE)


def extract_signature(signature: str) -> Dict[str, str]:
    """Extracts function name, parameters, and body using Tree-sitter"""
    fn = f"{signature}:\n    pass"
    tree = parser.parse(bytes(fn, "utf8"))
    root = tree.root_node

    fn_node = root.children[0]  # The function definition
    name = fn_node.child_by_field_name("name").text.decode("utf8")
    params = fn_node.child_by_field_name("parameters").text.decode("utf8")[1:-1]
    return_type: str = None
    if fn_node.child_by_field_name("return_type"):
        return_type = fn_node.child_by_field_name("return_type").text.decode("utf8")
    body = "    pass"

    return {"name": name, "params": params, "body": body, "return_type": return_type}
