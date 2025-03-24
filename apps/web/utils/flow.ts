import { EvolutionData, TreeNode } from "@/types/evolution";
import { Node, Edge } from "@xyflow/react";

interface FlowNode extends Node {
  data: {
    model: string;
    tree: TreeNode;
    parent: FlowNode | null;
  };
}

/**
 * Recursively builds nodes for a single model's tree.
 * @param model The model identifier (e.g. "gpt-4o-2024-08-06").
 * @param tree The current TreeNode.
 * @param depth How many levels deep we are (used for horizontal positioning).
 * @param siblingIndex The index of this node among its siblings (used for vertical positioning).
 * @param parentId The id of the parent node (if any).
 */
function buildNodes(
    model: string,
    tree: TreeNode,
    depth: number,
    siblingIndex: number,
    parent?: FlowNode
): FlowNode[] {
    const nodes: FlowNode[] = [];

    // Create a unique ID for this node.
    const currId = `${model}-${depth}-${siblingIndex}`;

    // Set the coordinates
    const nChildren = tree.children.length;
    const x = depth * 500;
    let y: number;
    if (depth === 0) {
        // Root node is vertically centered respective to its children.
        y = (Math.floor(nChildren / 2) * 250) + 5
    }
    else {
        // Child nodes are vertically centered respective to their parent.
        const parentPos = (parent?.position.y || 0)
        const nSiblings = parent?.data.tree.children.length || 1;
        if (nSiblings % 2 === 1) {
            // If there are an odd number of siblings, center the middle sibling.
            // Get the index of the middle sibling.
            const middleIdx = Math.floor(nSiblings / 2);
            // Calculate the y position of the middle sibling.
            const middleY = (middleIdx * 250);
            // Calculate the y position of the current sibling.
            const currY = (siblingIndex * 250);
            // Calculate the difference between the middle sibling and the current sibling.
            const diff = middleY - currY;
            // Add the difference to the parent's y position.
            y = parentPos + diff;
        } else {
            // If there are an even number of siblings, center the two middle siblings.
            // Get the index of the middle siblings.
            const middleIdx1 = nSiblings / 2 - 1;
            const middleIdx2 = nSiblings / 2;
            // Calculate the y position of the middle siblings.
            const middleY1 = (middleIdx1 * 250);
            const middleY2 = (middleIdx2 * 250);
            // Calculate the y position of the current sibling.
            const currY = (siblingIndex * 250);
            // Calculate the difference between the middle siblings and the current sibling.
            const diff1 = middleY1 - currY;
            const diff2 = middleY2 - currY;
            // Add the average difference to the parent's y position.
            y = parentPos + (diff1 + diff2) / 2;
        }
    }

    const curr: FlowNode = {
        id: currId,
        // Use different node types for root vs. child nodes.
        type: depth === 0 ? "root" : "child",
        data: {
            model,
            tree,
            parent: parent || null, // pass the parent id, or null if root
        },
        // Position: X offset increases by depth, Y offset by sibling index.
        position: { x, y },
    };

    nodes.push(curr);

    // Recursively build child nodes, passing the current node's id as the parentId.
    tree.children.forEach((child, index) => {
        const childNodes = buildNodes(model, child, depth + 1, index, curr);
        nodes.push(...childNodes);
    });

    return nodes;
}


function buildEdges(nodes: FlowNode[]): Edge[] {
    const edges: Edge[] = [];

    nodes.forEach(node => {
        node.data.tree.children.forEach((child: TreeNode) => {
            const childNode = nodes.find(n => n.data.tree === child);
            if (!childNode) {
                console.error(`Could not find child node for ${node.id}`)
                return
            }
            edges.push({
                id: `${node.id}-${childNode.id}`, source: node.id, target: childNode.id, style: {
                    stroke: "#999",    // set the edge color
                    strokeWidth: 2,    // set the edge thickness
                },
            });
        });
    });

    return edges;
}


/**
 * Builds an array of nodes for all models in the EvolutionData.
 */
export function buildFlowChart(data: EvolutionData): [Node[], Edge[]] {
    const nodes: Node[] = [];

    // For each model in data.data, build a subtree of nodes.
    for (const modelId in data.data) {
        const modelTree = data.data[modelId];
        const modelNodes = buildNodes(modelId, modelTree, 0, 0);
        nodes.push(...modelNodes);
    }

    // Build edges between nodes
    const edges = buildEdges(nodes as FlowNode[]);
    console.log(edges)

    return [nodes, edges];
}
