import React from "react";
import { useReactFlow } from "@xyflow/react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export const ZoomControls = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5 p-0.5 bg-accent/50 border border-border rounded-xl">
        <button
          onClick={() => zoomIn()}
          className="p-2 hover:bg-card rounded-lg transition-all text-muted-foreground/50 hover:text-primary cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => zoomOut()}
          className="p-2 hover:bg-card rounded-lg transition-all text-muted-foreground/50 hover:text-primary cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>
      <button
        onClick={() => fitView({ padding: 0.3, duration: 500 })}
        className="flex items-center gap-1.5 h-9 px-3 bg-accent/50 border border-border rounded-xl text-[10px] font-black uppercase tracking-wider text-muted-foreground/50 hover:text-foreground transition-all cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        <span className="hidden sm:inline">Reset View</span>
      </button>
    </div>
  );
};
