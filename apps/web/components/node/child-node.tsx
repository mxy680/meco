"use client";

import { memo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { TreeNode } from "@/types/evolution";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Handle, Position } from "@xyflow/react";

/**
 * Calculates the percentage difference between childMetric and parentMetric.
 * Returns a string like "+110.0%" or "-32.5%". If either value is null, returns "?".
 */
function getMetricDifference(
  childMetric: number | undefined,
  parentMetric: number | undefined
): string {
  if (
    childMetric == null ||
    parentMetric == null ||
    isNaN(childMetric) ||
    isNaN(parentMetric)
  ) {
    return "?";
  }

  const diff = childMetric - parentMetric;
  // Avoid division by zero if both metrics are zero
  const avg = (Math.abs(childMetric) + Math.abs(parentMetric)) / 2 || 1;
  const percentDiff = (Math.abs(diff) / avg) * 100;

  const sign = diff >= 0 ? "+" : "-";
  return `${sign}${percentDiff.toFixed(1)}%`;
}

interface ChildNodeProps {
  data: {
    model: string;
    tree: TreeNode;
    parent: {
      data: {
        tree: {
          metrics: {
            cpu_percent: number;
            memory_usage: number;
            runtime: number;
          };
        };
      };
    };
  };
}

function ChildNode({ data }: ChildNodeProps) {
  const { model, tree, parent } = data;
  const { metrics, status } = tree;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Parent metrics
  const parentMetrics = parent.data.tree.metrics;

  // Child metrics
  const childCpu = metrics?.cpu_percent;
  const childMem = metrics?.memory_usage;
  const childTime = metrics?.runtime;

  // Parent metrics
  const parentCpu = parentMetrics.cpu_percent;
  const parentMem = parentMetrics.memory_usage;
  const parentTime = parentMetrics.runtime;

  // Differences
  const cpuDiff = getMetricDifference(childCpu, parentCpu);
  const memDiff = getMetricDifference(childMem, parentMem);
  const timeDiff = getMetricDifference(childTime, parentTime);

  // Decide colors and icons based on sign
  const cpuDiffColor = cpuDiff.includes("-")
    ? "text-green-500"
    : "text-red-500";
  const cpuDiffIcon = cpuDiff.includes("-") ? (
    <TrendingUp size={14} />
  ) : (
    <TrendingDown size={14} />
  );

  const memDiffColor = memDiff.includes("-")
    ? "text-green-500"
    : "text-red-500";
  const memDiffIcon = memDiff.includes("-") ? (
    <TrendingUp size={14} />
  ) : (
    <TrendingDown size={14} />
  );

  const timeDiffColor = timeDiff.includes("-")
    ? "text-green-500"
    : "text-red-500";
  const timeDiffIcon = timeDiff.includes("-") ? (
    <TrendingUp size={14} />
  ) : (
    <TrendingDown size={14} />
  );

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Card
        className="w-90 max-w-md hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <Handle
          type="source"
          position={Position.Right}
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full"
        />
        <Handle
          type="target"
          position={Position.Left}
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full"
        />
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold">{model}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                status: {status}
              </CardDescription>
            </div>
            <ChevronRight className="text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {/* CPU Usage */}
            <div className="flex flex-col">
              <span className="text-md font-bold">
                {childCpu != null ? `${childCpu.toPrecision(5)}%` : "?"}
              </span>
              <span className="text-xs text-muted-foreground">CPU Usage</span>
              <span
                className={`inline-flex items-center gap-1 text-xs ${cpuDiffColor}`}
              >
                {cpuDiff}
                {cpuDiffIcon}
              </span>
            </div>

            {/* RAM Usage */}
            <div className="flex flex-col">
              <span className="text-md font-bold">
                {childMem != null
                  ? `${(childMem / 1000).toPrecision(5)} KB`
                  : "?"}
              </span>
              <span className="text-xs text-muted-foreground">RAM Usage</span>
              <span
                className={`inline-flex items-center gap-1 text-xs ${memDiffColor}`}
              >
                {memDiff}
                {memDiffIcon}
              </span>
            </div>

            {/* Exec Time */}
            <div className="flex flex-col">
              <span className="text-md font-bold">
                {childTime != null
                  ? `${(childTime * 1e6).toPrecision(3)}μs`
                  : "?"}
              </span>
              <span className="text-xs text-muted-foreground">Exec Time</span>
              <span
                className={`inline-flex items-center gap-1 text-xs ${timeDiffColor}`}
              >
                {timeDiff}
                {timeDiffIcon}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Child Attempt {model}</DialogTitle>
            <DialogDescription>
              Functionality prioritized over metrics
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto pr-2 max-h-[calc(90vh-120px)]">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Description</h3>
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm whitespace-pre-line">
                  {tree.approach || "No approach specified"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Function</h3>
              <pre className="rounded-md bg-muted p-3 overflow-x-auto text-xs whitespace-pre-wrap break-all">
                <code>{tree.function || "No function specified"}</code>
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Terminal Command</h3>
              <div className="rounded-md bg-muted p-3 font-mono">
                <code className="text-xs break-all whitespace-pre-wrap">
                  {tree.command || "No command specified"}
                </code>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(ChildNode);
