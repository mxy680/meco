class FunctionNode:
    def __init__(self, approach, solution, metrics, parent=None):
        self.approach = approach  # Description or identifier for the approach.
        self.solution = solution  # The code or candidate solution.
        self.metrics = metrics  # Performance metrics (e.g., runtime, CPU, memory).
        self.parent = parent  # Optional reference to the parent node.
        self.children = []  # List to hold child Node objects.

    def add_child(self, child_node):
        self.children.append(child_node)
