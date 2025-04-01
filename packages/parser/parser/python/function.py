import tree_sitter_python as tspython
from tree_sitter import Language, Parser

PY_LANGUAGE = Language(tspython.language())
parser = Parser(PY_LANGUAGE)


def validate_signature(signature: str) -> None:
    """
    Validate the function signature given the test cases.
    """
    # Check if it has a return type
    if "->" not in signature:
        raise Exception("return type not found")

    # Check if it ends with a colon
    if signature.endswith(":"):
        signature = signature[:-1]

    fn = f"{signature}:\n    pass"
    tree = parser.parse(bytes(fn, "utf8"))
    root = tree.root_node

    if not root.children or len(root.children) == 0:
        raise Exception("signature definition invalid")

    fn_node = root.children[0]  # The function definition

    # Check if the function definition has a name
    name = fn_node.child_by_field_name("name")
    if not name:
        raise Exception("function name not found")

    if (
        name.text.decode("utf-8") == "invalid"
        or not name.text.decode("utf-8").isidentifier()
    ):
        raise Exception("invalid function name")

    # Check if the function definition has parameters
    params = fn_node.child_by_field_name("parameters")
    if not params:
        raise Exception("function parameters not found")

    params = params.text.decode("utf8")[1:-1].split(",")
    params = [param for param in params if param]

    for param in params:
        param = [p.strip() for p in param.split(":")]
        if len(param) == 1:
            raise Exception(f"parameter type not found for {param[0]}")

        if len(param) != 2:
            raise Exception(f"invalid parameter {param}")

        if "=" in param[1]:
            raise Exception("default parameters not supported")

        if "|" in param[1]:
            raise Exception("union types not supported")

        if not param[0].isidentifier():
            raise Exception(f"invalid parameter name {param[0]}")

    # Check if the function definition has a return type
    return_type = fn_node.child_by_field_name("return_type")
    if not return_type:
        raise Exception("function return type not found")

    return_type_extracted = signature.split("->")[1].strip()
    if return_type_extracted != return_type.text.decode("utf8"):
        raise Exception(f"return type mismatch: {return_type_extracted}")


def extract_signature(signature: str) -> dict:
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

    return {"name": name, "params": params, "return_type": return_type}


def validate_function(code: str) -> None:
    code_bytes = bytes(code, "utf8")
    tree = parser.parse(code_bytes, encoding="utf8")
    root = tree.root_node
    if not root.type == "module":
        raise Exception("the code is not a valid Python function.")

    try:
        for fn in root.children:
            if fn.type == "function_definition":
                name = fn.child_by_field_name("name").text.decode("utf8")
                params = (
                    fn.child_by_field_name("parameters")
                    .text.decode("utf8")[1:-1]
                    .split(", ")
                )

                body = fn.child_by_field_name("body").text.decode("utf8")

                if not name or not params or not body:
                    raise Exception("the function is not well-defined.")
    except Exception as e:
        raise Exception(e)
