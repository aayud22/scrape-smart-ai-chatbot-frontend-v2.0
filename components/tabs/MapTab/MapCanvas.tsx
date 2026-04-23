import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
  SelectionMode,
  useOnSelectionChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import { getLayoutedElements } from "@/utils/mapLayout";
import ArchitectureNode from "@/components/map/ArchitectureNode";
import SelectionHud from "@/components/map/SelectionHud";
import { MapLinksData, CustomNodeData, InteractionMode } from "@/types/map";

type CustomNode = Node<CustomNodeData>;

interface MapCanvasProps {
  mapLinksData: MapLinksData[];
  searchQuery: string;
  interactionMode: InteractionMode;
  selectedUrl: string | null;
  onInit: (instance: ReactFlowInstance) => void;
}

export const MapCanvas = ({
  mapLinksData,
  searchQuery,
  interactionMode,
  selectedUrl,
  onInit,
}: MapCanvasProps) => {
  const flowInstance = useReactFlow();
  const { fitView } = flowInstance;
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [isDraggingSelection, setIsDraggingSelection] = useState(false);

  useEffect(() => {
    onInit(flowInstance);
  }, [flowInstance, onInit]);

  const initialElements = useMemo(() => {
    const nodes: Node[] = [
      {
        id: "root",
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          label: "Home",
          url: "/",
          title: "Main Map Directory",
          linksCount: mapLinksData.length,
          isHighlighted: false,
          isRoot: true,
        },
      },
    ];
    const edges: Edge[] = [];

    mapLinksData.forEach((item: MapLinksData) => {
      try {
        const parts = new URL(item.url).pathname.split("/").filter(Boolean);
        let parentId = "root";
        parts.forEach((part) => {
          const nodeId = `${parentId}-${part}`;
          if (!nodes.find((n) => n.id === nodeId)) {
            nodes.push({
              id: nodeId,
              type: "custom",
              position: { x: 0, y: 0 },
              data: {
                label: part,
                url: item.url,
                title: item.title,
                linksCount: ((parts.length * 7) % 10) + 1,
                isHighlighted: false,
                isRoot: false,
              },
            });
            edges.push({
              id: `edge-${parentId}-${nodeId}`,
              source: parentId,
              target: nodeId,
              animated: true,
              style: {
                stroke: "var(--border)",
                strokeDasharray: "4 4",
                strokeWidth: 2,
              },
            });
          }
          parentId = nodeId;
        });
      } catch {
        /* skip invalid URLs */
      }
    });

    const matches = nodes.map((node) => {
      const data = node.data as CustomNodeData;
      return {
        ...node,
        data: {
          ...data,
          isHighlighted:
            !!searchQuery &&
            (data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              data.title.toLowerCase().includes(searchQuery.toLowerCase())),
        },
      };
    });

    return getLayoutedElements(matches, edges);
  }, [mapLinksData, searchQuery]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialElements.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialElements.edges);

  useOnSelectionChange({
    onChange: ({ nodes }) => setSelectedNodes(nodes),
  });

  useEffect(() => {
    setNodes(initialElements.nodes);
    setEdges(initialElements.edges);

    if (searchQuery) {
      const matchedIds = initialElements.nodes
        .filter((n) => (n.data as CustomNodeData).isHighlighted)
        .map((n) => n.id);
      if (matchedIds.length > 0) {
        fitView({
          nodes: matchedIds.map((id) => ({ id })),
          padding: 0.6,
          duration: 800,
          maxZoom: 1,
        });
      }
    }
  }, [initialElements, setNodes, setEdges, searchQuery, fitView]);

  useEffect(() => {
    if (!selectedUrl) return;

    let targetId = "root";
    try {
      const pathname = new URL(selectedUrl).pathname;
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 0) {
        targetId = `root-${segments.join("-")}`;
      }
    } catch { /* ignore */ }

    const timer = setTimeout(() => {
      const latestNodes = flowInstance.getNodes() as CustomNode[];
      const node = latestNodes.find((n) => n.id === targetId) || 
                   latestNodes.find((n) => n.data?.url === selectedUrl);

      if (node) {
        setNodes((nds) => nds.map((n) => ({
          ...n,
          selected: n.id === node.id
        })));

        flowInstance.fitView({
          nodes: [{ id: node.id }],
          duration: 800,
          padding: 0.5, 
          maxZoom: 1.6
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedUrl, setNodes, flowInstance]);

  const onSelectionStart = useCallback(
    () => setIsDraggingSelection(true),
    []
  );
  const onSelectionEnd = useCallback(
    () => setIsDraggingSelection(false),
    []
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (interactionMode === "pan") {
        setSelectedNodes([node]);
      }
    },
    [interactionMode]
  );

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{ custom: ArchitectureNode }}
        fitView
        className="bg-background"
        minZoom={0.1}
        maxZoom={2}
        panOnDrag={interactionMode === "pan"}
        selectionOnDrag={interactionMode === "select"}
        selectionMode={SelectionMode.Partial}
        onSelectionStart={onSelectionStart}
        onSelectionEnd={onSelectionEnd}
        onNodeClick={onNodeClick}
        style={{
          cursor:
            interactionMode === "select" || isDraggingSelection
              ? "pointer"
              : "inherit",
        }}
      >
        <Background
          gap={32}
          size={1}
          color="currentColor"
          className="text-muted-foreground/10"
        />
      </ReactFlow>

      <SelectionHud
        selectedNodes={selectedNodes}
        onClear={() => setSelectedNodes([])}
      />
    </div>
  );
};
