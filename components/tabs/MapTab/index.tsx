import React, { useState, useRef } from "react";
import {
  ReactFlowProvider,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DirectoryPanel from "@/components/map/DirectoryPanel";
import {
  Search,
  Target,
  MousePointer2,
  Hand,
  Plus,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { ZoomControls } from "./ZoomControls";
import { MapCanvas } from "./MapCanvas";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

import { MapLinksData, InteractionMode } from "@/types/map";

interface MapTabProps {
  isMapping: boolean;
  mapLinksData: MapLinksData[] | null;
  error: string | null;
}

export default function MapTab({ isMapping, mapLinksData, error }: MapTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(
    "pan"
  );
  const [showPanel, setShowPanel] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const flowRef = useRef<ReactFlowInstance | null>(null);

  if (isMapping)
    return (
      <LoadingState message="Decoding system architecture clusters..." />
    );
  if (error)
    return <ErrorState title="Neural Mapping Failed" message={error} />;
  if (!mapLinksData) return null;

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full overflow-hidden">
        {/* ── Sub-header Toolbar ── */}
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-border bg-card/80 backdrop-blur-md">
          {/* Left: Title */}
          <h2 className="text-sm font-black uppercase tracking-widest whitespace-nowrap">
            Map Links Tree
          </h2>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative group/search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40 group-focus-within/search:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Find node or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full sm:w-56 pl-9 pr-3 bg-accent/50 border border-border rounded-xl text-xs font-bold placeholder:text-muted-foreground/30 focus:border-primary/50 outline-none transition-all"
              />
            </div>

            {/* Zoom + Reset */}
            <ZoomControls />

            {/* Mode Toggle */}
            <div className="flex items-center gap-0.5 p-0.5 bg-accent/50 border border-border rounded-xl">
              <button
                onClick={() => setInteractionMode("select")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                  interactionMode === "select"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground/50 hover:text-foreground"
                )}
              >
                <MousePointer2 className="w-3 h-3" />
                <span className="hidden sm:inline">Select</span>
              </button>
              <button
                onClick={() => setInteractionMode("pan")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                  interactionMode === "pan"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground/50 hover:text-foreground"
                )}
              >
                <Hand className="w-3 h-3" />
                <span className="hidden sm:inline">Pan</span>
              </button>
            </div>

            {/* Toggle Panel (desktop only) */}
            <button
              onClick={() => setShowPanel(!showPanel)}
              className="hidden lg:flex items-center justify-center w-9 h-9 bg-accent/50 border border-border rounded-xl text-muted-foreground/50 hover:text-primary transition-all cursor-pointer"
              title={showPanel ? "Hide panel" : "Show panel"}
            >
              {showPanel ? (
                <PanelRightClose className="w-3.5 h-3.5" />
              ) : (
                <PanelRightOpen className="w-3.5 h-3.5" />
              )}
            </button>

            {/* + New Node */}
            <button className="flex items-center gap-1.5 h-9 px-4 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md shadow-primary/20">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Node</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left: ReactFlow Tree Canvas */}
          <div
            className={cn(
              "flex-1 relative min-w-0 transition-all duration-300",
              showPanel ? "hidden md:block" : "block"
            )}
          >
            <MapCanvas
              mapLinksData={mapLinksData}
              searchQuery={searchQuery}
              interactionMode={interactionMode}
              selectedUrl={selectedUrl}
              onInit={(instance) => {
                flowRef.current = instance;
              }}
            />

            {/* Bottom-left status badge */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2.5 px-4 py-2 bg-card/60 backdrop-blur-2xl border border-border/50 rounded-2xl text-[9px] font-black text-muted-foreground/30 uppercase tracking-wider shadow-lg ring-1 ring-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Flow Buffer
            </div>
          </div>

          <div
            className={cn(
              "h-full flex flex-col min-h-0 border-l border-border transition-all duration-300 overflow-hidden shrink-0",
              showPanel
                ? "w-full md:w-[360px] lg:w-[400px]"
                : "w-0 border-l-0"
            )}
          >
            {showPanel && (
              <DirectoryPanel
                mapLinksData={mapLinksData}
                searchQuery={searchQuery}
                selectedUrl={selectedUrl}
                onNodeSelect={(url) => {
                  setSelectedUrl(url);
                }}
              />
            )}
          </div>
        </div>

        {/* ── Mobile: Panel Toggle FAB ── */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="md:hidden fixed bottom-24 right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/30 active:scale-95 transition-transform"
        >
          {showPanel ? (
            <Target className="w-5 h-5" />
          ) : (
            <PanelRightOpen className="w-5 h-5" />
          )}
        </button>
      </div>
    </ReactFlowProvider>
  );
}
