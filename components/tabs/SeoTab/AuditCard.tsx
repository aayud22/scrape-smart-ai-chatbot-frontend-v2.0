import React from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/utils/helpers";

import { AuditStatus } from "@/types/seo";

interface AuditCardProps {
  icon: React.ElementType;
  title: string;
  content: string;
  status: AuditStatus;
  extra?: string;
}

export const AuditCard = ({ 
  icon: Icon, 
  title, 
  content, 
  status, 
  extra 
}: AuditCardProps) => {
  const statusStyles = {
    passed: { 
      bg: "bg-primary/10", 
      border: "border-primary/20", 
      text: "text-primary", 
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: "PASSED"
    },
    warning: { 
      bg: "bg-yellow-500/10", 
      border: "border-yellow-500/20", 
      text: "text-yellow-500", 
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: "WARNING"
    },
    error: { 
      bg: "bg-red-500/10", 
      border: "border-red-500/20", 
      text: "text-red-500", 
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: "MISSING"
    }
  };

  const style = statusStyles[status];

  return (
    <div className="bg-card border border-border rounded-3xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <div className={cn("px-3 py-1 rounded-full text-[9px] font-black tracking-widest flex items-center gap-1.5", style.bg, style.text, "border", style.border)}>
          {style.icon}
          {style.label}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{title}</div>
        <div className="text-[13px] font-bold text-foreground leading-snug line-clamp-2">{content}</div>
        {extra && <div className="text-[11px] font-medium text-muted-foreground/70">{extra}</div>}
      </div>

      <div className="mt-auto pt-2">
        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline cursor-pointer">
          Fix and Optimize →
        </button>
      </div>
    </div>
  );
};
