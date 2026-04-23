"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/helpers";
import { 
  Bell, 
  Settings, 
  User, 
  Sun, 
  Moon,
  Globe,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { SidebarItemType } from "@/types/common";
import { Dispatch, SetStateAction } from "react";

interface DashboardShellProps {
  children: React.ReactNode;
  activeTab: SidebarItemType;
  setActiveTab: Dispatch<SetStateAction<SidebarItemType>>;
  headerContent?: string;
  isAppActive?: boolean;
  onBack?: () => void;
  targetUrl?: string;
}

export function DashboardShell({
  children,
  activeTab,
  setActiveTab,
  headerContent,
  isAppActive = true,
  onBack,
  targetUrl,
}: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div 
      className="flex min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden font-sans"
      suppressHydrationWarning
    >
      {/* Sidebar for Desktop */}
      <AnimatePresence>
        {isAppActive && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="hidden md:block shrink-0 relative"
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              onNewExtraction={onBack}
            />
            {/* Collapse Toggle — rendered OUTSIDE the sidebar's overflow-hidden */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-foreground dark:bg-background border border-border flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-all z-50 shadow-sm"
            >
              {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Sticky Header */}
        <AnimatePresence>
          {isAppActive && (
            <motion.header
              initial={{ y: -64, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-16 flex items-center px-6 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 shrink-0"
            >
              <div className="flex-1 flex items-center justify-center relative h-full">
                {/* Center URL Pill */}
                <div 
                  onClick={onBack}
                  className="flex items-center h-9 pl-4 pr-3 bg-accent/50 hover:bg-accent rounded-full border border-border transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <Globe className="w-3.5 h-3.5 text-primary group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-muted-foreground/60">URL:</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (targetUrl) window.open(targetUrl, '_blank');
                      }}
                      className="text-foreground hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4"
                    >
                      {headerContent || 'ACTIVE_SESSION'}
                    </button>
                    <div className="w-px h-3 bg-border mx-1" />
                    <RefreshCw className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary group-hover:rotate-180 transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="absolute right-6 flex items-center gap-4">
                <div className="hidden md:flex items-center gap-1 bg-accent/50 p-1 rounded-lg border border-border">
                   <button 
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-1.5 hover:bg-accent rounded-md text-muted-foreground transition-colors cursor-pointer"
                   >
                     {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                   </button>
                   <button className="p-1.5 hover:bg-accent rounded-md text-muted-foreground transition-colors cursor-pointer">
                     <Bell className="w-4 h-4" />
                   </button>
                   <button className="p-1.5 hover:bg-accent rounded-md text-muted-foreground transition-colors cursor-pointer">
                     <Settings className="w-4 h-4" />
                   </button>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground group hover:border-primary/50 transition-colors cursor-pointer">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Scrollable Content Container */}
        <div className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-background pb-20 md:pb-0",
          isAppActive ? "" : "p-0",
          (activeTab === "map" || activeTab === "chat") && "overflow-hidden pb-0 flex flex-col" // Force flex to ensure h-full children fill space
        )}>
          <div 
            suppressHydrationWarning
            className={cn(
              "mx-auto w-full flex-1 flex flex-col min-h-0", 
              isAppActive && activeTab !== "map" ? "max-w-7xl px-4 sm:px-6 lg:px-8" : "max-w-none"
            )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isAppActive ? activeTab : "landing"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <AnimatePresence>
        {isAppActive && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="md:hidden"
          >
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
