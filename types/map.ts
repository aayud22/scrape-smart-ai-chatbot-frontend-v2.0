import React from "react";

export interface MapLinksData {
  url: string;
  title: string;
}

export interface BaseNodeData {
  label: string;
  url: string;
  title: string;
  linksCount: number;
  isHighlighted: boolean;
  isRoot: boolean;
}

export interface ArchitectureNodeData extends BaseNodeData {
  status: number;
}

export interface CustomNodeData extends BaseNodeData {
  [key: string]: unknown;
}

export interface GroupedNode {
  id: string;
  label: string;
  url: string;
  title: string;
  path: string;
  status: "synced" | "pending" | "error";
}

export interface NodeGroup {
  name: string;
  icon: React.ElementType;
  nodes: GroupedNode[];
  isLocked?: boolean;
}

export interface SelectedNode {
  id: string;
  data: {
    label?: string;
    url?: string;
    title?: string;
    [key: string]: unknown;
  };
}

export type InteractionMode = "select" | "pan";
