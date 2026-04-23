"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  ChevronDown,
  ExternalLink,
  Lock,
  Archive,
  Globe,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { MapLinksData, GroupedNode, NodeGroup } from "@/types/map";

interface DirectoryPanelProps {
  mapLinksData: MapLinksData[];
  searchQuery: string;
  selectedUrl?: string | null;
  onNodeSelect?: (url: string) => void;
}

export default function DirectoryPanel({
  mapLinksData,
  searchQuery,
  selectedUrl,
  onNodeSelect,
}: DirectoryPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["root"])
  );

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };

  // Group URLs by first path segment
  const groups = useMemo<NodeGroup[]>(() => {
    if (!mapLinksData) return [];

    const pathMap: Record<string, GroupedNode[]> = {};

    mapLinksData.forEach((item, idx) => {
      try {
        const urlObj = new URL(item.url);
        const segments = urlObj.pathname.split("/").filter(Boolean);
        const groupKey = segments[0] || "root";
        const nodeId = `NODE-${String(idx + 1).padStart(3, "0")}`;

        if (!pathMap[groupKey]) pathMap[groupKey] = [];
        pathMap[groupKey].push({
          id: nodeId,
          label: segments.slice(1).join("/") || segments[0] || "/",
          url: item.url,
          title: item.title,
          path: urlObj.pathname,
          status: idx % 3 === 0 ? "synced" : idx % 3 === 1 ? "pending" : "synced",
        });
      } catch {
        // skip invalid URLs
      }
    });

    const result: NodeGroup[] = Object.entries(pathMap).map(
      ([key, nodes]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/[-_]/g, " "),
        icon: Globe,
        nodes,
      })
    );

    // Add an "Archived Scrapes" locked section for UX polish
    result.push({
      name: "Archived Scrapes",
      icon: Archive,
      nodes: [],
      isLocked: true,
    });

    return result;
  }, [mapLinksData]);

  // Filter by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    return groups
      .map((group) => ({
        ...group,
        nodes: group.nodes.filter(
          (node) =>
            node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.id.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((group) => group.nodes.length > 0 || group.isLocked);
  }, [groups, searchQuery]);

  const totalNodes = mapLinksData?.length || 0;

  return (
    <div className="flex flex-col h-full min-h-0 bg-card overflow-hidden w-full">
      {/* Directory Header */}
      <div className="p-4 md:p-5 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Folder className="w-4 h-4" />
            </div>
            <span className="text-sm font-black uppercase tracking-wider">
              Main Map Directory
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary tracking-widest">
            {totalNodes} Nodes
          </div>
        </div>
      </div>

      {/* Scrollable Directory List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <div className="p-2 md:p-3 space-y-1">
          {filteredGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.name);

            return (
              <div key={group.name} className="rounded-xl overflow-hidden">
                {/* Group Header */}
                <button
                  onClick={() => !group.isLocked && toggleGroup(group.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer",
                    isExpanded && !group.isLocked
                      ? "bg-accent/50"
                      : "hover:bg-accent/30",
                    group.isLocked &&
                      "opacity-40 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <group.icon className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider truncate">
                      {group.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {group.isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/30" />
                    ) : (
                      <>
                        {group.nodes.length > 0 && (
                          <span className="text-[9px] font-bold text-muted-foreground/40">
                            {group.nodes.length}
                          </span>
                        )}
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 text-muted-foreground/40 transition-transform duration-200",
                            !isExpanded && "-rotate-90"
                          )}
                        />
                      </>
                    )}
                  </div>
                </button>

                {/* Group Items */}
                <AnimatePresence initial={false}>
                  {isExpanded && !group.isLocked && group.nodes.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pr-2 pb-2 space-y-1">
                        {group.nodes.map((node) => (
                          <div
                            key={node.id}
                            onClick={() => onNodeSelect?.(node.url)}
                            className={cn(
                              "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer group/node",
                              selectedUrl === node.url
                                ? "bg-primary/10 ring-1 ring-primary/20 shadow-sm"
                                : "hover:bg-accent/40"
                            )}
                          >
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                                  {node.id}
                                </span>
                                <StatusBadge status={node.status} />
                              </div>
                              <span className="text-[11px] font-medium text-muted-foreground/50 truncate block">
                                {node.url.replace(/^https?:\/\//, "")}
                              </span>
                            </div>
                            <a
                              href={node.url}
                              target="_blank"
                              rel="noopener"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg text-muted-foreground/20 hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover/node:opacity-100"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Card — Spatial Connectivity Map */}
      <div className="p-3 md:p-4 border-t border-border shrink-0">
        <div className="bg-accent/30 border border-border/50 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                Real-Time Visualization
              </div>
              <div className="text-sm font-black uppercase tracking-tight">
                Spatial Connectivity Map
              </div>
            </div>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[10px] font-bold text-primary/70 cursor-pointer hover:text-primary transition-colors">
            Tap to expand node view →
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Small sub-component ─── */

const StatusBadge = ({ status }: { status: "synced" | "pending" | "error" }) => {
  const styles = {
    synced: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    error: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const labels = {
    synced: "SYNCED",
    pending: "PENDING",
    error: "ERROR",
  };

  return (
    <span
      className={cn(
        "px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider border",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
};
