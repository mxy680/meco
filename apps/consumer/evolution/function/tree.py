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
        """
        Returns the top 50% of candidate nodes (from the baseline's children) that have a normalized cumulative score
        close to or better than the baseline. The cumulative score is computed by first normalizing runtime, memory_usage,
        and cpu_usage (lower is better) across all nodes (baseline plus children) and then summing the normalized values.
        A candidate is considered acceptable if its score is within a set threshold of the baseline's score or better.
        If no candidate node qualifies, returns an empty list.
        """
        # Use the node at curr_idx as the baseline.
        baseline = self.curr[curr_idx]

        # Only consider children, excluding the baseline itself.
        candidates = baseline.children
        if not candidates:
            return []

        # Include baseline in normalization computation.
        all_nodes = [baseline] + candidates
        metrics = ["runtime", "memory_usage", "cpu_usage"]

        # Compute min and max for each metric over all nodes.
        metric_stats = {}
        for metric in metrics:
            values = [
                node.metrics[metric] for node in all_nodes if metric in node.metrics
            ]
            if values:
                metric_stats[metric] = (min(values), max(values))
            else:
                metric_stats[metric] = (0, 0)

        def normalized_score(node):
            score = 0
            for metric in metrics:
                if metric in node.metrics:
                    min_val, max_val = metric_stats[metric]
                    # If all values are equal, set normalized value to 0.
                    if max_val == min_val:
                        normalized = 0
                    else:
                        normalized = (node.metrics[metric] - min_val) / (
                            max_val - min_val
                        )
                    score += normalized
                else:
                    score += 1  # Penalize missing metric.
            return score

        baseline_score = normalized_score(baseline)

        # Define a threshold that allows candidates with scores close to the baseline.
        threshold = 0.05  # Adjust this value as needed.

        # Compute normalized scores for each candidate.
        candidate_scores = []
        for node in candidates:
            score = normalized_score(node)
            candidate_scores.append((node, score))

        # Filter for candidates that are within the threshold of the baseline or better.
        acceptable_candidates = [
            (node, score)
            for node, score in candidate_scores
            if score <= baseline_score + threshold
        ]

        if not acceptable_candidates:
            return []

        # Sort the candidates by their cumulative score (lower is better).
        acceptable_candidates.sort(key=lambda x: x[1])

        # Return the top 50% (rounded up) of the acceptable candidates.
        n_candidates = len(acceptable_candidates)
        n_winners = -(-n_candidates // 2)  # Ceiling division
        winners_list = [node for node, _ in acceptable_candidates[:n_winners]]

        return winners_list

    def move_winners_to_curr(self, curr_idx, child_idx: list[int]):
        for idx in child_idx:
            self.curr.append(self.curr[curr_idx].children[idx])
        self.curr.remove(self.curr[curr_idx])

    def no_winner(self, curr_idx: int):
        self.curr.remove(self.curr[curr_idx])

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
