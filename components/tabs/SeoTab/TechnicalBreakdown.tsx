import React from "react";
import { BarChart3, Type, FileText, Layout, Image as ImageIcon } from "lucide-react";
import { AuditCard } from "./AuditCard";

import { TechnicalData } from "@/types/seo";

interface TechnicalBreakdownProps {
  parsedData: TechnicalData | null;
}

export const TechnicalBreakdown = ({ parsedData }: TechnicalBreakdownProps) => {
  if (!parsedData) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-black uppercase tracking-widest">Technical Breakdown</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <AuditCard 
          icon={Type} 
          title="Title Tag" 
          content={parsedData.title.content} 
          status={parsedData.title.status}
          extra={`${parsedData.title.content.length} characters`}
        />
        <AuditCard 
          icon={FileText} 
          title="Meta Description" 
          content={parsedData.meta.content} 
          status={parsedData.meta.status}
        />
        <AuditCard 
          icon={Layout} 
          title="Headings Structure" 
          content={parsedData.headings.content} 
          status={parsedData.headings.status}
        />
        <AuditCard 
          icon={ImageIcon} 
          title="Image Optimization" 
          content={parsedData.images.content} 
          status={parsedData.images.status}
        />
      </div>
    </div>
  );
};
