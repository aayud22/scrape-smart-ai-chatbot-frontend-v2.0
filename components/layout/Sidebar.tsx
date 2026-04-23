"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Network,
  Image,
  Search,
  Sun,
  Moon,
  LogOut,
  Plus,
  HelpCircle,
  Cpu,
  PieChart,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/utils/helpers";
import { Tooltip } from "@/components/ui/Tooltip";

import { SidebarItemType } from "@/types/common";
import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  activeTab: SidebarItemType;
  setActiveTab: Dispatch<SetStateAction<SidebarItemType>>;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onNewExtraction?: () => void;
}

const SIDEBAR_ITEMS = [
  { id: "chat", label: "CHAT AI", icon: MessageSquare },
  { id: "seo", label: "SEO AUDIT", icon: PieChart },
  { id: "scrape", label: "SCRAPE", icon: FileText },
  { id: "map", label: "MAP LINKS", icon: Network },
  { id: "pages", label: "PAGES", icon: Image },
  { id: "search", label: "WEB SEARCH", icon: Search },
] as const;

/** Wraps children in a Tooltip only when the sidebar is collapsed */
const ConditionalTooltip = ({
  show,
  label,
  children,
}: {
  show: boolean;
  label: string;
  children: React.ReactElement;
}) => {
  if (!show) return children;
  return (
    <Tooltip content={label} side="right" sideOffset={12}>
      {children}
    </Tooltip>
  );
};

export function Sidebar({ activeTab, setActiveTab, isCollapsed, onNewExtraction }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className={cn(
        "hidden md:flex flex-col h-screen bg-card border-r border-border sticky top-0 z-40 transition-colors duration-300 overflow-hidden",
        isCollapsed ? "items-center" : "items-stretch"
      )}
    >
      {/* Brand Logo Area */}
      <div className={cn("px-6 pt-8 pb-4 transition-opacity duration-300", isCollapsed ? "opacity-0" : "opacity-100")}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-black tracking-tight leading-none">ScrapeSmart</span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">AI</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="px-3 pb-6">
        <ConditionalTooltip show={isCollapsed} label="New Extraction">
          <button 
            onClick={onNewExtraction}
            className={cn(
              "flex items-center gap-2 bg-primary hover:brightness-110 text-primary-foreground font-black text-[11px] uppercase tracking-wider rounded-lg transition-all w-full cursor-pointer justify-center shadow-lg shadow-primary/20",
              isCollapsed ? "h-12 w-12" : "h-11 px-4"
            )}
          >
            <Plus className={cn("w-4 h-4", !isCollapsed && "stroke-3")} />
            {!isCollapsed && <span>New Extraction</span>}
          </button>
        </ConditionalTooltip>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ConditionalTooltip key={item.id} show={isCollapsed} label={item.label}>
              <button
                onClick={() => setActiveTab(item.id as SidebarItemType)}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full cursor-pointer",
                  isActive
                    ? "bg-accent text-foreground shadow-sm"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-accent/50"
                )}
              >
                <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary opacity-100" : "opacity-50")} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] font-black uppercase tracking-wider"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 w-0.5 h-4 bg-primary rounded-r-full"
                  />
                )}
              </button>
            </ConditionalTooltip>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-1">
        <ConditionalTooltip show={isCollapsed} label="Help">
          <button
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground/50 hover:text-foreground transition-all w-full cursor-pointer",
              isCollapsed && "justify-center"
            )}
          >
            <HelpCircle className="w-4 h-4" />
            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-wider">Help</span>}
          </button>
        </ConditionalTooltip>

        <ConditionalTooltip show={isCollapsed} label={theme === "dark" ? "Light Mode" : "Dark Mode"}>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground/50 hover:text-foreground transition-all w-full cursor-pointer",
              isCollapsed && "justify-center"
            )}
          >
            {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-wider">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>
        </ConditionalTooltip>

        <ConditionalTooltip show={isCollapsed} label="Logout">
          <button
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground/50 hover:text-destructive transition-all w-full cursor-pointer",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-wider">Logout</span>}
          </button>
        </ConditionalTooltip>
      </div>

    </motion.aside>
  );
}
