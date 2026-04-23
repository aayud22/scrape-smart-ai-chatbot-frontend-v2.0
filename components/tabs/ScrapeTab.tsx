import React, { useState, useMemo, Dispatch, SetStateAction } from "react";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import { 
  Copy, 
  Download, 
  ChevronRight, 
  Cpu, 
  FileJson, 
  FileText, 
  Table as TableIcon,
  Maximize2,
  ExternalLink
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { ScrapeData, ScrapeView } from "@/types/scrape";

interface ScrapeTabProps {
  isScraping: boolean;
  scrapeData: ScrapeData | null;
  scrapeView: ScrapeView;
  setScrapeView: Dispatch<SetStateAction<ScrapeView>>;
  handleDownload: (format: "json" | "markdown") => void;
  error: string;
  targetUrl?: string;
}

// --- Internal Components ---

const ConfidenceDots = ({ percentage }: { percentage: number }) => {
  return (
    <div className="flex gap-1 shrink-0">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className={cn(
            "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full",
            percentage > (i * 30) ? "bg-[#22c55e]" : "bg-muted"
          )} 
        />
      ))}
    </div>
  );
};

const DataTable = ({ data }: { data: ScrapeData | null }) => {
  const tableRows = useMemo(() => {
    // Basic extraction of key-value pairs for preview
    // If it's markdown, we try to show some inferred structure or just the sections
    if (!data) return [];
    
    // Simulating structured data from markdown/json
    return [
      { id: "metadata.title", content: "Main Page Title - Surgical Intelligence", confidence: 99 },
      { id: "metadata.desc", content: "Primary meta description for domain visibility...", confidence: 98 },
      { id: "content.h1", content: "Precision Data Extraction for Modern Web", confidence: 99 },
      { id: "content.cta", content: "Start Free Trial →", confidence: 95 },
      { id: "style.primary", content: "Teal (#0D9488) / Dark Shell", confidence: 92 },
    ];
  }, [data]);

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-accent/30 border-b border-border">
              <th className="px-3 sm:px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Field ID</th>
              <th className="px-3 sm:px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Content Preview</th>
              <th className="px-3 sm:px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tableRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-accent/20 transition-colors group">
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black font-mono text-primary group-hover:text-primary transition-colors">{row.id}</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-[11px] font-medium text-foreground/80 truncate max-w-[120px] sm:max-w-[300px]">{row.content}</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                  <div className="flex items-center justify-end gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black">
                    <span className="text-foreground/40">{row.confidence}%</span>
                    <div className="hidden sm:block">
                      <ConfidenceDots percentage={row.confidence} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Extraction Workspace ---

export default function ScrapeTab({
  isScraping,
  scrapeData,
  scrapeView,
  setScrapeView,
  handleDownload,
  error,
  targetUrl
}: ScrapeTabProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = scrapeView === "markdown"
      ? scrapeData?.markdown || ""
      : JSON.stringify(scrapeData, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isScraping) return <LoadingState message="Extracting high-precision data models..." />;
  if (error) return <ErrorState title="Extraction Failed" message={error} />;
  if (!scrapeData) return null;

  const contentLines = (scrapeView === "markdown" ? scrapeData.markdown : JSON.stringify(scrapeData, null, 2))?.split("\n") || [];

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-20 animate-fade-in py-6 md:py-20">
      {/* Workspace Header */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-2 sm:space-y-3">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground/40">
              <span className="hover:text-primary cursor-pointer transition-colors">PROJECT ALPHA</span>
              <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="text-primary font-black">EXTRACTION</span>
            </div>
            
            <div className="flex flex-col xs:flex-row xs:items-center gap-3 sm:gap-4">
              <h2 className="text-base sm:text-lg md:text-2xl font-black uppercase tracking-tight leading-tight">Extraction Workspace</h2>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-[7px] sm:text-[8px] font-black text-primary tracking-widest animate-pulse w-fit">
                <Cpu className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                AI MODEL ACTIVE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-2xl shadow-sm text-[11px] font-bold text-muted-foreground/60">
              <ExternalLink className="w-3.5 h-3.5" />
              {targetUrl?.replace(/^https?:\/\//, "") || "local-host/buffer"}
            </div>
            <button className="p-3 bg-card border border-border rounded-2xl hover:bg-accent transition-all cursor-pointer">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center border-b border-border gap-8 overflow-x-auto custom-scrollbar no-scrollbar scroll-smooth">
          {[
            { id: "markdown", label: "MARKDOWN", shortLabel: "MD", icon: FileText },
            { id: "json", label: "JSON SCHEMATICS", shortLabel: "JSON", icon: FileJson },
            { id: "table", label: "STRUCTURED TABLE", shortLabel: "TABLE", icon: TableIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setScrapeView(tab.id as ScrapeView)}
              className={cn(
                "pb-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest sm:tracking-[0.15em] flex items-center gap-2 transition-all relative cursor-pointer outline-none shrink-0",
                scrapeView === tab.id 
                  ? "text-primary" 
                  : "text-muted-foreground/40 hover:text-foreground/60"
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", scrapeView === tab.id ? "text-primary" : "text-muted-foreground/30")} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
              {scrapeView === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(13,148,136,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className={cn(
          "lg:col-span-12 space-y-8 transition-all duration-500",
          scrapeView === "table" ? "opacity-0 scale-95 pointer-events-none hidden" : "opacity-100 scale-100"
        )}>
           {/* Code Editor Styled Window */}
           <div className="bg-[#0b0c10] border border-border rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col group min-h-[500px]">
              {/* Window Sub-header */}
              <div className="bg-white/5 border-b border-white/5 px-4 sm:px-6 py-3 sm:py-4 flex flex-col xs:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-8 w-full xs:w-auto justify-between xs:justify-start">
                   <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
                   </div>
                   <div className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-white/30 font-mono">
                     BUFFER_ID: EXTRACTION_STREAM_0X24
                   </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 md:justify-end justify-center w-full">
                  <button 
                    onClick={handleCopy}
                    className="w-max flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 h-7 sm:h-8 bg-white/5 hover:bg-white/10 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-white/5"
                  >
                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {isCopied ? "COPIED" : "COPY"}
                  </button>
                  <button 
                    onClick={() => handleDownload(scrapeView as "json" | "markdown")}
                    className="w-max flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 h-7 sm:h-8 bg-primary text-primary-foreground font-black text-[9px] sm:text-[10px] uppercase tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20"
                  >
                    <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    EXPORT
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="flex-1 overflow-auto custom-scrollbar p-6">
                <div className="flex gap-6 font-mono text-[13px] leading-relaxed">
                  {/* Line Numbers Simulation */}
                  <div className="hidden sm:flex flex-col text-right text-white/10 select-none border-r border-white/5 pr-4">
                    {Array.from({ length: Math.max(contentLines.length, 20) }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <pre className="text-white/80 whitespace-pre-wrap wrap-break-word flex-1">
                    {scrapeView === "markdown" 
                      ? scrapeData.markdown 
                      : JSON.stringify(scrapeData, null, 2)}
                  </pre>
                </div>
              </div>
           </div>
        </div>

        {/* Structured Table View (Conditional) */}
        {scrapeView === "table" && (
          <div className="lg:col-span-12 animate-slide-up">
            <DataTable data={scrapeData} />
          </div>
        )}

        {/* Floating Actions for Table Tab */}
        {scrapeView === "table" && (
          <div className="lg:col-span-12 flex flex-col sm:flex-row items-center justify-center md:justify-end gap-3 pt-4">
            <button 
              onClick={() => handleDownload("json")}
              className="w-full sm:w-auto whitespace-nowrap flex items-center justify-center gap-2 px-5 py-2.5 bg-card border border-border text-foreground font-black text-[9px] sm:text-[10px] uppercase tracking-wider rounded-xl hover:bg-accent transition-all cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5" />
              Download Dataset (JSON)
            </button>
            <button 
              onClick={() => handleDownload("markdown")}
              className="w-full sm:w-auto whitespace-nowrap flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-black text-[9px] sm:text-[10px] uppercase tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20"
            >
              <Download className="w-3.5 h-3.5" />
              Full Export (.MD)
            </button>
          </div>
        )}
      </div>

      {/* Data Table Preview at Bottom (Always shown in non-table views) */}
      {scrapeView !== "table" && (
        <div className="space-y-6 pt-10 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TableIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm md:text-lg font-bold tracking-widest whitespace-nowrap">Data Selection</h3>
            </div>
            <button 
              onClick={() => setScrapeView("table")}
              className="text-[9px] md:text-xs font-bold tracking-widest whitespace-nowrap text-primary hover:underline cursor-pointer flex items-center gap-2"
            >
              <span className="hidden md:block">EXPAND FULL VIEW</span>
              <span className="block md:hidden">FULL ALL</span>
              <Maximize2 className="w-2.5 h-2.5" />
            </button>
          </div>
          <DataTable data={scrapeData} />
        </div>
      )}
    </div>
  );
}
