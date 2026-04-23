import React, { useState, useMemo, useRef } from "react";
import LoadingState from "@/components/LoadingState";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { ScrapeData } from "@/types/scrape";
import { SeoData } from "@/types/seo";
import { ChatResponse } from "@/types/api";
import { getErrorMessage, postJson } from "@/utils/api";
import { 
  RotateCcw,
  Sparkles,
  Download,
  PieChart,
  Copy,
  Check
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { SeoGauge } from "./SeoGauge";
import { TechnicalBreakdown } from "./TechnicalBreakdown";
import { KeywordContext } from "./KeywordContext";
import SocialPreview from "@/components/SocialPreview";

interface SeoTabProps {
  isAnalyzing: boolean;
  seoScoreData: SeoData | null;
  url: string;
  scrapeData?: ScrapeData | null;
  isScraping?: boolean;
  onAnalyzeKeywords?: () => void;
  onReAnalyze?: () => void;
}


type KeywordStat = {
  word: string;
  count: number;
  percentage: string;
};

export default function SeoTab({
  isAnalyzing,
  seoScoreData,
  url,
  scrapeData,
  isScraping,
  onAnalyzeKeywords,
  onReAnalyze
}: SeoTabProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isFetchingAdvice, setIsFetchingAdvice] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAdvice = () => {
    if (!aiAdvice) return;
    navigator.clipboard.writeText(aiAdvice);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const parsedData = useMemo(() => {
    if (!seoScoreData) return null;
    
    const findDetail = (keyword: string) => 
      seoScoreData.details.find(d => d.toLowerCase().includes(keyword.toLowerCase()));
    
    const getStatus = (detail?: string): "passed" | "warning" | "error" => {
      if (!detail) return "error";
      if (detail.includes("✅")) return "passed";
      if (detail.includes("⚠️")) return "warning";
      return "error";
    };

    const titleDetail = findDetail("Title Tag");
    const metaDetail = findDetail("Meta Description");
    const h1Detail = findDetail("H1 Tag");
    const imgDetail = findDetail("Images without alt");

    return {
      title: { 
        content: titleDetail?.split(":")[1]?.trim() || "Missing Title Tag", 
        status: getStatus(titleDetail) 
      },
      meta: { 
        content: metaDetail?.includes("Missing") ? "Meta Description is missing from this page." : metaDetail?.split(":")[1]?.trim() || "Meta Description Issue", 
        status: getStatus(metaDetail) 
      },
      headings: { 
        content: h1Detail?.includes("Missing") ? "H1 Tag is missing" : "Multiple H1/H2 tags detected", 
        status: getStatus(h1Detail) 
      },
      images: { 
        content: imgDetail?.includes("✅") ? "All images have alternative text." : "Some images are missing alt tags.", 
        status: getStatus(imgDetail) 
      }
    };
  }, [seoScoreData]);

  const stats = useMemo(() => {
    if (!seoScoreData) return { passed: 0, warnings: 0, errors: 0 };
    return {
      passed: seoScoreData.details.filter(d => d.includes("✅")).length,
      warnings: seoScoreData.details.filter(d => d.includes("⚠️")).length,
      errors: seoScoreData.details.filter(d => d.includes("❌")).length,
    };
  }, [seoScoreData]);

  const handleGetAiSuggestions = async () => {
    const issues = seoScoreData?.details.filter(d => d.includes("❌") || d.includes("⚠️")) || [];
    if (issues.length === 0) return;
    setIsFetchingAdvice(true); setAiAdvice(null);
    try {
      const prompt = `Act as an Expert Technical SEO Consultant. I ran an audit on ${url} and found these specific issues:\n${issues.join("\n")}\n\nPlease provide a short, highly actionable step-by-step guide on how I can fix these exact issues. Keep it concise, professional, and use bullet points.`;
      const data = await postJson<ChatResponse>("/chat", { url, question: prompt }, "Failed to fetch advice.");
      if (data.status === "success") setAiAdvice(data.bot_reply);
      else throw new Error("Failed to fetch advice");
    } catch (error: unknown) {
      setAiAdvice(getErrorMessage(error, "AI is currently unavailable."));
    } finally { setIsFetchingAdvice(false); }
  };

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 10,
        filename: `SEO-Report-${new URL(url).hostname.replace("www.", "")}.pdf`,
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const }
      };
      await html2pdf().from(reportRef.current).set(opt).save();
    } catch (error) {
      console.error("PDF Export failed:", error);
    } finally { setIsExporting(false); }
  };

  const topKeywords = useMemo<KeywordStat[] | null>(() => {
    if (!scrapeData?.markdown) return null;
    const cleanText = scrapeData.markdown.toLowerCase().replace(/[^a-z\s]/g, " ");
    const words = cleanText.split(/\s+/).filter(w => w.length > 2);
    const stopWords = new Set(["the", "and", "for", "that", "this", "with", "you", "not", "are", "from", "your", "all", "have", "can", "was", "but", "our", "out", "has", "will", "what", "their", "how", "when", "one", "more", "about", "who", "which", "there", "some", "get", "make", "any", "like", "use", "new", "see"]);
    const validWords = words.filter(w => !stopWords.has(w));
    const counts: Record<string, number> = {};
    validWords.forEach(w => counts[w] = (counts[w] || 0) + 1);
    return Object.entries(counts)
      .map(([word, count]) => ({ word, count, percentage: ((count / validWords.length) * 100).toFixed(1) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [scrapeData]);

  if (isAnalyzing) return <LoadingState message="Performing Technical SEO Audit..." />;
  if (!seoScoreData) return (
    <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-accent flex items-center justify-center text-muted-foreground/30">
        <PieChart className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-black uppercase tracking-widest">No SEO Data</h3>
        <p className="text-sm text-muted-foreground/50 max-w-xs">Run a precision analysis to evaluate the technical health of this website.</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-10 py-6 md:py-20 animate-fade-in" ref={reportRef}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-card border border-border p-4 md:p-8 rounded-2xl md:rounded-[40px] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-primary/10" />
        <div className="relative space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Surgical Intelligence</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">SEO Audit Dashboard</h2>
          <p className="text-sm text-muted-foreground/60 max-w-sm">Deep technical analysis of the domain structure and search engine visibility markers.</p>
        </div>

        <div className="relative flex items-center gap-3">
          <button onClick={onReAnalyze} className="flex items-center gap-2 h-12 px-6 bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-wider rounded-2xl hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20">
            <RotateCcw className="w-4 h-4" /> Re-Run Audit
          </button>
          <button onClick={handleExportPdf} disabled={isExporting} className="flex items-center justify-center w-12 h-12 border border-border bg-card rounded-2xl hover:bg-accent transition-all cursor-pointer disabled:opacity-30">
            {isExporting ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" /> : <Download className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Score and Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:h-[500px]">
        <div className="bg-card border border-border p-4 md:p-8 rounded-2xl md:rounded-[40px] flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 shadow-sm h-full">
          <SeoGauge score={seoScoreData.seo_score} />
          <div className="space-y-6 flex-1">
            <div className="space-y-1">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Overall Status</div>
               <div className={cn("text-2xl font-black uppercase", seoScoreData.seo_score >= 80 ? "text-primary" : seoScoreData.seo_score >= 50 ? "text-yellow-500" : "text-red-500")}>
                 {seoScoreData.seo_score >= 80 ? "High Performance" : seoScoreData.seo_score >= 50 ? "Moderate Health" : "Critical Condition"}
               </div>
            </div>
            <p className="text-xs text-muted-foreground/60 leading-relaxed">We detected {stats.errors} critical issues and {stats.warnings} technical warnings.</p>
            <div className="flex gap-4 pt-2">
               <div className="flex flex-col gap-1"><span className="text-[10px] font-black uppercase tracking-widest text-[#22c55e]">Passed</span><span className="text-xl font-black">{stats.passed}</span></div>
               <div className="w-px h-8 bg-border mt-1" /><div className="flex flex-col gap-1"><span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Warnings</span><span className="text-xl font-black">{stats.warnings}</span></div>
               <div className="w-px h-8 bg-border mt-1" /><div className="flex flex-col gap-1"><span className="text-[10px] font-black uppercase tracking-widest text-red-500">Errors</span><span className="text-xl font-black">{stats.errors}</span></div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-4 md:p-8 rounded-2xl md:rounded-[40px] shadow-sm relative overflow-hidden h-full">
          <div className="relative h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0"><Sparkles className="w-4 h-4 md:w-5 md:h-5" /></div>
                <div className="text-[11px] md:text-[13px] font-black uppercase tracking-widest text-foreground">Expert Recommendation</div>
              </div>
              {aiAdvice && !isFetchingAdvice && (
                <button onClick={handleCopyAdvice} className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-accent/80 transition-all cursor-pointer">
                  {isCopied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />} {isCopied ? "Copied" : "Copy Strategy"}
                </button>
              )}
            </div>
            {isFetchingAdvice ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4"><div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" /><span className="text-[11px] font-black uppercase tracking-widest text-indigo-500">Consulting AI...</span></div>
            ) : aiAdvice ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar text-[13px] pr-2"><MarkdownRenderer content={aiAdvice} /></div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <p className="text-xs text-muted-foreground/60 max-w-xs">Generate a surgical precision strategy to resolve identified SEO deficiencies.</p>
                <button onClick={handleGetAiSuggestions} className="bg-indigo-500 hover:bg-indigo-600 text-white font-black text-[11px] uppercase tracking-wider px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 cursor-pointer">Generate AI Strategy</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TechnicalBreakdown parsedData={parsedData} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
         <KeywordContext topKeywords={topKeywords} onAnalyzeKeywords={onAnalyzeKeywords} isScraping={isScraping} />
         <div className="bg-card border border-border p-4 md:p-8 rounded-2xl md:rounded-[40px] shadow-sm">
           <h3 className="text-xl font-black uppercase tracking-[0.1em] flex items-center gap-3 mb-8"><span className="w-1.5 h-6 bg-primary rounded-full" />Social Resonance</h3>
           <SocialPreview url={url} />
         </div>
      </div>
    </div>
  );
}
