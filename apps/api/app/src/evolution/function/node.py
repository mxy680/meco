class Node:
    def __init__(self, child_idx: int):
        self.child_idx = child_idx
        self.approach: str = None  # Description or identifier for the approach.
        self.function: str = None  # The code or candidate solution.
        self.command: str = None  # The terminal command to install packages
        self.children: list = []  # List to hold child Node objects.

        self.valid: bool = None  # Flag to indicate if the function is valid.
        self.retrying: bool = None  # Flag to indicate if the node is being retried.
        self.message: str = None  # Message to store any additional information.
        self.result: str = None  # The output of the function execution.
        self.proceed: bool = True  # Flag to indicate if the node should proceed to the next step.

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

    def add_child(self, child_node):
        self.children.append(child_node)
