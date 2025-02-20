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
