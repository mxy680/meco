import tree_sitter_python as tspython
from tree_sitter import Language, Parser
from typing import Dict

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
    ]  # Remove parentheses

    # Extract and reformat function body
    body_node = fn_node.child_by_field_name("body")
    body = extract_body_statements(body_node)

    return {"name": name, "params": params, "body": body}


def extract_body_statements(body_node):
    """Extracts function body while preserving correct indentation"""
    cursor = body_node.walk()
    cursor.goto_first_child()

    statements = []
    base_indent = None

    while True:
        node_text = cursor.node.text.decode("utf8")
        if node_text.strip():
            current_indent = len(node_text) - len(node_text.lstrip())

            if base_indent is None:
                base_indent = current_indent

            adjusted_text = "    " + node_text[base_indent:]  # Normalize indentation
            statements.append(adjusted_text)

        if not cursor.goto_next_sibling():
            break

    return "\n".join(statements)
