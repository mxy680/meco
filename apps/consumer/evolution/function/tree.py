from .node import Node
import json


class Tree:
    def __init__(self):
        self.root = Node(0)
        self.curr = [self.root]

    def add_node(self, curr_idx: int):
        child_idx = len(self.curr[curr_idx].children)
        child = Node(child_idx)
        self.curr[curr_idx].children.append(child)

    def add_nodes(self, curr_idx: int, n: int):
        for _ in range(n):
            self.add_node(curr_idx)

    def get_child(self, curr_idx: int, child_idx: int):
        return self.curr[curr_idx].children[child_idx]

    def update(self, curr_idx: int, child_idx: int, return_update=False, **kwargs):
        update = {}
        if child_idx < 0:
            update = self.curr[curr_idx].update(**kwargs)
        else:
            update = self.curr[curr_idx].children[child_idx].update(**kwargs)

        if return_update:
            return update, self.serialize()
        return self.serialize()

    def winners(self, curr_idx: int) -> list:
        # Use the node at curr_idx as the baseline.
        baseline = self.curr[curr_idx]

        # Only consider children (candidates), excluding the baseline itself.
        candidates = baseline.children
        if not candidates:
            return []

        metrics = ["runtime", "memory_usage", "cpu_percent"]
        winners_list = []

        for candidate in candidates:
            total_improvement = 0
            for metric in metrics:
                baseline_value = baseline.metrics.get(metric)
                candidate_value = candidate.metrics.get(metric)
                # Only compute improvement if both values are present and baseline_value is nonzero.
                if (
                    baseline_value is not None
                    and candidate_value is not None
                    and baseline_value != 0
                ):
                    # Improvement is positive if the candidate's metric is lower than the baseline's.
                    improvement = (baseline_value - candidate_value) / baseline_value
                    total_improvement += improvement
            # If the cumulative improvement is positive, add candidate to winners.
            if total_improvement > -10:
                winners_list.append(candidate)

        return winners_list

    def move_winners_to_curr(self, curr_idx, child_idx: list[int]):
        for idx in child_idx:
            self.curr.append(self.curr[curr_idx].children[idx])
        self.curr.remove(self.curr[curr_idx])

    def stop(self):
        self.curr = []

    def serialize(self):
        """
        Convert the entire tree (starting at the root) to a JSON string.
        """
        return json.dumps(self.root.serialize())
