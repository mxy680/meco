from parser.python.types import TYPE_MAP
from tree_sitter import Language, Parser
import tree_sitter_python as tspython
from typing import Tuple

PY_LANGUAGE = Language(tspython.language())
parser = Parser(PY_LANGUAGE)


def validate_signature(signature: str) -> Tuple[bool, str]:
    """
    Validate the function signature given the test cases.
    """
    # Check if it has a return type
    if "->" not in signature:
        return False, "return type not found"

    # Check if it ends with a colon
    if signature.endswith(":"):
        signature = signature[:-1]

    fn = f"{signature}:\n    pass"
    tree = parser.parse(bytes(fn, "utf8"))
    root = tree.root_node

    if not root.children or len(root.children) == 0:
        return False, "signature definition invalid"

    fn_node = root.children[0]  # The function definition

    # Check if the function definition has a name
    name = fn_node.child_by_field_name("name")
    if not name:
        return False, "function name not found"

    if (
        name.text.decode("utf-8") == "invalid"
        or not name.text.decode("utf-8").isidentifier()
    ):
        return False, "invalid function name"

    # Check if the function definition has parameters
    params = fn_node.child_by_field_name("parameters")
    if not params:
        return False, "function parameters not found"

    params = params.text.decode("utf8")[1:-1].split(",")
    params = [param for param in params if param]

    for param in params:
        param = [p.strip() for p in param.split(":")]
        if len(param) == 1:
            return False, f"parameter type not found for {param[0]}"

        if len(param) != 2:
            return False, f"invalid parameter {param}"

        if "=" in param[1]:
            return False, f"default parameters not supported"
        
        if "|" in param[1]:
            return False, f"union types not supported"

        if not param[0].isidentifier():
            return False, f"invalid parameter name {param[0]}"

    # Check if the function definition has a return type
    return_type = fn_node.child_by_field_name("return_type")
    if not return_type:
        return False, "function return type not found"

    return_type_extracted = signature.split("->")[1].strip()
    if return_type_extracted != return_type.text.decode("utf8"):
        return False, f"invalid return type {return_type_extracted}"

    return True, "signature is valid"
