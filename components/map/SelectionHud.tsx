import React from "react";
import { X, Target, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { SelectedNode } from "@/types/map";

interface SelectionHudProps {
  selectedNodes: SelectedNode[];
  onClear: () => void;
}

const SelectionHud = ({ selectedNodes, onClear }: SelectionHudProps) => {
  if (selectedNodes.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-100 w-full max-w-2xl px-4 pointer-events-none"
      >
        <div className="bg-card/80 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] shadow-2xl p-6 pointer-events-auto ring-1 ring-white/10 overflow-hidden relative">
          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest leading-none">Sector Intelligence</h3>
                <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-wider">
                  {selectedNodes.length} {selectedNodes.length === 1 ? 'Node' : 'Nodes'} Identified
                </p>
              </div>
            </div>
            <button 
              onClick={onClear}
              className="p-2 hover:bg-accent rounded-full transition-all text-muted-foreground/40 hover:text-primary group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {selectedNodes.map((node) => (
              <div 
                key={node.id}
                className="flex items-center justify-between p-4 bg-muted/30 border border-border/30 rounded-2xl group/item hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                    /{node.data.label}
                  </span>
                  <p className="text-xs font-bold truncate">
                    {node.data.title || node.data.label}
                  </p>
                </div>
                <a 
                  href={node.data.url} 
                  target="_blank" 
                  rel="noopener"
                  className="p-2 hover:bg-primary/10 rounded-xl text-muted-foreground/40 hover:text-primary transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectionHud;
