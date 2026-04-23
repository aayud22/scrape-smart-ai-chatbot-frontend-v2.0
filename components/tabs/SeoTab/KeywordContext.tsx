import React from "react";

interface KeywordStat {
  word: string;
  count: number;
  percentage: string;
}

interface KeywordContextProps {
  topKeywords: KeywordStat[] | null;
  onAnalyzeKeywords?: () => void;
  isScraping?: boolean;
}

export const KeywordContext = ({ topKeywords, onAnalyzeKeywords, isScraping }: KeywordContextProps) => {
  return (
    <div className="bg-card border border-border p-4 md:p-8 rounded-2xl md:rounded-[40px] shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black uppercase tracking-[0.1em] flex items-center gap-3">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          Keyword Context
        </h3>
      </div>
      
      {!topKeywords ? (
        <div className="py-12 flex flex-col items-center text-center space-y-6">
          <p className="text-xs text-muted-foreground/50 max-w-xs">Extract domain content to identify the primary semantic markers seen by search engines.</p>
          <button 
            onClick={onAnalyzeKeywords}
            disabled={isScraping}
            className="bg-primary hover:brightness-110 text-primary-foreground font-black text-[11px] uppercase tracking-wider px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-30"
          >
            {isScraping ? "Analyzing..." : "Analyze Context"}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {topKeywords.map((kw, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-20 text-[11px] font-black uppercase text-muted-foreground/60 truncate text-right">{kw.word}</div>
              <div className="flex-1 h-2.5 bg-accent rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000" 
                  style={{ width: `${(parseFloat(kw.percentage) * 10)}%` }}
                />
              </div>
              <div className="w-10 text-[11px] font-black text-right">{kw.percentage}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
