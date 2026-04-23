"use client";

import React from "react";
import {
  MessageSquare,
  BarChart3,
  FileText,
  Network,
  Image,
  Search,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { SidebarItemType } from "@/types/common";
import { Dispatch, SetStateAction } from "react";

interface BottomNavProps {
  activeTab: SidebarItemType;
  setActiveTab: Dispatch<SetStateAction<SidebarItemType>>;
}

const NAV_ITEMS = [
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "seo", icon: BarChart3, label: "SEO" },
  { id: "scrape", icon: FileText, label: "Scrape" },
  { id: "map", icon: Network, label: "Map" },
  { id: "pages", icon: Image, label: "Pages" },
  { id: "search", icon: Search, label: "Search" },
] as const;

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-2 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex items-center justify-around shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as SidebarItemType)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-200 min-w-12 cursor-pointer",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
            <span className="text-[10px] font-semibold">{item.label}</span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
