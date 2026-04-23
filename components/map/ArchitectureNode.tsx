import React from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Folder, ExternalLink, Globe } from "lucide-react";
import { cn } from "@/utils/helpers";

import { ArchitectureNodeData } from "@/types/map";

const ArchitectureNode = ({ data, selected }: NodeProps<Node>) => {
  const nodeData = data as unknown as ArchitectureNodeData;
  const isRoot = nodeData.isRoot;

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="invisible"
      />

      <div
        className={cn(
          "w-64 bg-card border rounded-2xl p-5 shadow-md transition-all relative overflow-hidden group hover:shadow-xl outline-none",
          isRoot
            ? "border-primary/50 ring-1 ring-primary/30 bg-card"
            : "border-border",
          (nodeData.isHighlighted || selected) &&
            "border-primary ring-2 ring-primary bg-primary/5 shadow-primary/20"
        )}
      >
        {/* Subtle top accent for root node */}
        {isRoot && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
        )}

        {/* Glow Background */}
        <div
          className={cn(
            "absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 blur-3xl transition-colors",
            nodeData.isHighlighted
              ? "bg-primary/20"
              : "bg-primary/5 group-hover:bg-primary/10"
          )}
        />

        <div className="space-y-3.5 relative z-10">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105",
                isRoot
                  ? "bg-primary/15 text-primary"
                  : "bg-accent/50 text-primary"
              )}
            >
              {isRoot ? (
                <Globe className="w-4.5 h-4.5" />
              ) : (
                <Folder className="w-4.5 h-4.5" />
              )}
            </div>
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider border",
                isRoot
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-accent/50 border-border text-muted-foreground/50"
              )}
            >
              {isRoot
                ? `${nodeData.linksCount} Nodes`
                : nodeData.status || 200}
            </div>
          </div>

          {/* Title / path */}
          <div className="space-y-0.5">
            <h4 className="text-sm font-black truncate tracking-tight">
              {nodeData.title}
            </h4>
            <div
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.15em] transition-colors",
                nodeData.isHighlighted
                  ? "text-primary/70"
                  : "text-muted-foreground/30 group-hover:text-primary/50"
              )}
            >
              {isRoot ? "Root Element" : `/${nodeData.label.toLowerCase()}`}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <span className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.15em]">
              {isRoot ? "v1.2.0" : `${nodeData.linksCount || 0} Records`}
            </span>
            {!isRoot && (
              <a
                href={nodeData.url}
                target="_blank"
                rel="noopener"
                className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground/25 hover:text-primary transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="invisible"
      />
    </div>
  );
};

export default ArchitectureNode;
