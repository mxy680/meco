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
import { ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Handle, Position } from "@xyflow/react";

interface RootNodeProps {
  data: { model: string; tree: TreeNode; parent: null };
}

function RootNode({ data }: RootNodeProps) {
  const { model, tree } = data;
  const { metrics, status } = tree;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card
        className="w-90 max-w-md relative hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <Handle
          type="source"
          position={Position.Right}
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full"
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
            <div className="flex flex-col">
              <span className="text-md font-bold">
                {metrics?.cpu_percent != null
                  ? `${metrics.cpu_percent.toPrecision(5)}%`
                  : "?"}
              </span>
              <span className="text-xs text-muted-foreground">CPU Usage</span>
            </div>
            <div className="flex flex-col">
              <span className="text-md font-bold">
                {metrics?.memory_usage != null
                  ? `${(metrics.memory_usage / 1000).toPrecision(5)} KB`
                  : "?"}
              </span>
              <span className="text-xs text-muted-foreground">RAM Usage</span>
            </div>
            <div className="flex flex-col">
              <span className="text-md font-bold">
                {metrics?.runtime != null
                  ? `${(metrics.runtime * 1e6).toPrecision(3)}μs`
                  : "?"}
              </span>
              <span className="text-xs text-muted-foreground">Exec Time</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Root Attempt {model}</DialogTitle>
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

export default memo(RootNode);
