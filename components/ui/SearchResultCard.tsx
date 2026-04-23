import React, { useMemo } from "react";
import { Link as LinkIcon, ExternalLink, Activity, BarChart3, Layers } from "lucide-react";

interface SearchResultCardProps {
  href: string;
  title: string;
  body: string;
  metrics?: {
    da: number;
    pa: number;
    backlinks: string;
  };
}

export function SearchResultCard({ href, title, body, metrics }: SearchResultCardProps) {
  // Default mock metrics if not provided
  const displayMetrics = useMemo(() => {
    if (metrics) return metrics;
    
    // Stable pseudo-random generation based on href length/content
    const seed = href.length + (href.charCodeAt(0) || 0);
    return {
      da: (seed % 40) + 50,
      pa: ((seed * 1.5) % 30) + 40,
      backlinks: ((seed * 2) % 50) + 10 + "K"
    };
  }, [href, metrics]);

  return (
    <div className="group p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl hover:border-primary/50 hover:bg-card/60 transition-all duration-300 shadow-sm relative overflow-hidden">
      {/* Surgical Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex flex-col gap-3 relative z-10">
        {/* Breadcrumb URL */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
          <LinkIcon className="w-3 h-3" />
          <span className="truncate max-w-[300px]">{href}</span>
        </div>

        {/* Title */}
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xl font-black tracking-tight text-foreground hover:text-primary transition-colors line-clamp-1 flex items-center gap-2 group/title"
        >
          {title}
          <ExternalLink className="w-4 h-4 opacity-0 group-hover/title:opacity-100 -translate-x-2 group-hover/title:translate-x-0 transition-all" />
        </a>

        {/* Snippet */}
        <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium line-clamp-2 pr-12">
          {body}
        </p>

        {/* Metrics Footer */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-4 mt-2 border-t border-border/30">
          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-accent/50 rounded-lg border border-border shadow-sm">
            <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
            <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">DA:</span>
            <span className="text-[10px] sm:text-xs font-black text-foreground">{displayMetrics.da}</span>
          </div>
          
          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-accent/50 rounded-lg border border-border shadow-sm">
            <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
            <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">PA:</span>
            <span className="text-[10px] sm:text-xs font-black text-foreground">{displayMetrics.pa}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-accent/50 rounded-lg border border-border shadow-sm">
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
            <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">BACKLINKS:</span>
            <span className="text-[10px] sm:text-xs font-black text-foreground">{displayMetrics.backlinks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
