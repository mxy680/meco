class Node:
    def __init__(self, child_idx: int, model: str = None):
        self.child_idx = child_idx
        self.approach: str = None  # Description or identifier for the approach.
        self.function: str = None  # The code or candidate solution.
        self.command: str = None  # The terminal command to install packages
        self.children: list = []  # List to hold child Node objects.
        self.status: str = None

        self.valid: bool = None  # Flag to indicate if the function is valid.
        self.retrying: bool = None  # Flag to indicate if the node is being retried.
        self.message: str = None  # Message to store any additional information.
        self.result: str = None  # The output of the function execution.

        self.metrics: dict = None  # Performance metrics (e.g., runtime, CPU, memory).

    def update(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

        return self.__dict__

    def fail(self):
        # Make sure valid is set to False
        if self.valid:
            raise ValueError("Node is validated, failing is not allowed.")

        self.metrics = {
            "runtime": float("inf"),
            "cpu": float("inf"),
            "memory": float("inf"),
        }
        self.status = "failed"

    def add_child(self, child_node):
        self.children.append(child_node)

    def serialize(self):
        return {
            "child_idx": self.child_idx,
            "approach": self.approach,
            "function": self.function,
            "command": self.command,
            "status": self.status,
            "children": [child.serialize() for child in self.children],
            "valid": self.valid,
            "retrying": self.retrying,
            "message": self.message,
            "result": self.result,
            "metrics": self.metrics,
        }
