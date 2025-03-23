from .node import Node
import json


class Tree:
    def __init__(self):
        self.root = Node(0)
        self.curr = self.root

    def add_node(self):
        idx = len(self.curr.children)
        child = Node(idx)
        self.curr.children.append(child)

    def add_nodes(self, n: int):
        for _ in range(n):
            self.add_node()

    def get_child(self, idx: int):
        return self.curr.children[idx]

    def update(self, idx: int, return_update=False, **kwargs):
        update = {}
        if idx < 0:
            update = self.curr.update(**kwargs)
        else:
            update = self.curr.children[idx].update(**kwargs)

        if return_update:
            return update, self.serialize()
        return self.serialize()

    def winner(self):
        # Get the best node based on the metrics
        winner = self.curr.children[0]
        nodes = self.curr.children[1:]
        nodes.append(self.curr)
        for node in nodes:
            if node.metrics and node.metrics["runtime"] < winner.metrics["runtime"]:
                winner = node
        return winner

    def move_to_winner(self, idx: int):
        self.curr = self.curr.children[idx]

    def serialize(self):
        """
        Convert the entire tree (starting at the root) to a JSON string.
        """
        return json.dumps(self.root.serialize())

    @staticmethod
    def get_default_metrics():
        return {
            "runtime": float("inf"),
            "cpu": float("inf"),
            "memory": float("inf"),
        }
