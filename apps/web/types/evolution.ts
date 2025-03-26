// evolution.ts

/**
 * Represents the result data for a node.
 */
export interface ResultData {
  stdout: Record<string, number>;
  runtime: number;
  cpu_percent: number;
  memory_usage: number;
}

/**
 * Represents the metrics data for a node.
 */
export interface MetricsData {
  cpu_percent: number;
  memory_usage: number;
  runtime: number;
}

/**
 * Represents a single node in the evolution tree.
 */
export interface TreeNode {
  valid: boolean;
  result: ResultData;
  status: string;
  command: string;
  message: string;
  metrics: MetricsData;
  approach: string | null;
  children: TreeNode[];
  fn: string;
  retrying: boolean;
  child_idx: number;
}

/**
 * Represents the entire evolution response from the API.
 * The data property is an object where keys are model identifiers
 * and values are the root node of the evolution tree.
 */
export interface EvolutionData {
  status: string;
  data: {
    [modelId: string]: TreeNode;
  };
}
