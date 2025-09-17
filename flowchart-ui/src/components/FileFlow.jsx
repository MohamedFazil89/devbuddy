import React, { useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { fetchFileFlow } from "../utils/api";
import NodeSmall from "./nodes/NodeSmall";
import FileNode from "./nodes/FileNode";

const nodeTypes = { small: NodeSmall, fileNode: FileNode };

export default function FileFlow({ fileNode, onSelectSymbol }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!fileNode?.id) return;

    let path = fileNode.id;
    const match = path.match(/([^/]+\/[^/]+)$/); // ✅ corrected regex
    if (match) {
      path = match[1];
    }

    fetchFileFlow(path)
      .then((d) => {
        const subNodes = (d.nodes || []).map((n) => ({
          ...n,
          type: n.type === "fileNode" ? "fileNode" : "small",
        }));
        setNodes(subNodes);
        setEdges(d.edges || []);
      })
      .catch((err) => console.error("Error loading file flow:", err));
  }, [fileNode?.id, setNodes, setEdges]);

  const onNodeClick = useCallback((_, node) => {
    if (node.type !== "fileNode") {
      onSelectSymbol && onSelectSymbol(node);
    } else {
      onSelectSymbol && onSelectSymbol(null);
    }
  }, [onSelectSymbol]);

  const onConnect = useCallback((params) => setEdges((es) => addEdge(params, es)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      style={{ width: "100%", height: "100%" }}
    >
      <Background gap={12} color="#111827" />
      <MiniMap nodeStrokeWidth={1} maskColor="rgba(0,0,0,0.6)" />
      <Controls />
    </ReactFlow>
  );
}
