import { useMemo } from "react";
import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { buildFlowChart } from "@/utils/flow";
import { EvolutionData } from "@/types/evolution";
import RootNode from "@/components/node/root-node";
import ChildNode from "@/components/node/child-node";

interface FlowChartProps {
  data: EvolutionData;
}

const nodeTypes = {
  root: RootNode,
  child: ChildNode,
};

/**
 * Renders a flow chart using the provided evolution data.
 */
export function FlowChart({ data }: FlowChartProps) {
  // Build nodes using the provided evolution data and the openModal callback.
  const [nodes, edges] = useMemo(() => buildFlowChart(data), [data]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}
