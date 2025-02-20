import tree_sitter_python as tspython
from tree_sitter import Language, Parser
from typing import Dict
from .body import extract_body_statements

PY_LANGUAGE = Language(tspython.language())
parser = Parser(PY_LANGUAGE)


def extract_fn(code: str) -> Dict[str, str]:
    """Extracts function name, parameters, and body using Tree-sitter"""
    tree = parser.parse(bytes(code, "utf8"))
    root = tree.root_node

    fn_node = root.children[0]  # The function definition
    name = fn_node.child_by_field_name("name").text.decode("utf8")
    params = fn_node.child_by_field_name("parameters").text.decode("utf8")[
        1:-1
    ]

    # Extract and reformat function body
    body_node = fn_node.child_by_field_name("body")
    body = extract_body_statements(body_node)

    return {"name": name, "params": params, "body": body}
