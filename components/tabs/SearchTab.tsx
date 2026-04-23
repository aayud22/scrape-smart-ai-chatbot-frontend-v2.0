import React, { useState, useMemo, useRef, useEffect } from "react";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import { getErrorMessage, getJson } from "@/utils/api";
import { Search, Globe, ChevronDown, LayoutGrid, Newspaper, Image as ImageIcon, Video, Cpu } from "lucide-react";
import { cn } from "@/utils/helpers";
import { SearchResultCard } from "../ui/SearchResultCard";
import { motion, AnimatePresence } from "framer-motion";
import { Pagination } from "../ui/Pagination";

import { SearchResult, SearchResponse } from "@/types/api";
import { SearchCategory } from "@/types/common";
const ENGINES = ["Google SERP", "Bing Search", "DuckDuckGo", "Brave Search"];

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("ALL");
  const [selectedEngine, setSelectedEngine] = useState(ENGINES[0]);
  const [isEngineOpen, setIsEngineOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const RECORDS_PER_PAGE = 10;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEngineOpen(false);
      }
    };
    if (isEngineOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEngineOpen]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setError("");
    setCurrentPage(1);

    try {
      const data = await getJson<SearchResponse>(`/search?query=${encodeURIComponent(query)}`, "Failed to fetch search results.");
      if (data.status === "success") setResults(data.results);
      else throw new Error("Search failed");
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to fetch search results. Backend might be down."));
    } finally { setIsSearching(false); }
  };

  const paginatedResults = useMemo(() => {
    if (!results) return [];
    const start = (currentPage - 1) * RECORDS_PER_PAGE;
    return results.slice(start, start + RECORDS_PER_PAGE);
  }, [results, currentPage]);

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto py-6">
      {/* ... Header & Search Bar ... */}
      <div className="flex flex-col items-center text-center gap-2 px-4">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-2 sm:mb-4">
          <Cpu className="w-3.5 h-3.5" /> Neural OS Search
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase leading-tight">Web Search</h1>
        <p className="text-[10px] sm:text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.15em] sm:tracking-widest leading-relaxed max-w-2xl">Scour the internet for real-time intelligence & site authority metrics</p>
      </div>

      <div className="relative z-40 group/search max-w-4xl mx-auto w-full px-4 sm:px-0">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl sm:rounded-[2.5rem] p-1.5 sm:p-2 sm:pr-4 shadow-2xl transition-all duration-500 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 ring-1 ring-white/5">
          <div className="flex items-center flex-1">
            <div className="pl-4 sm:pl-6 pr-2 sm:pr-4 text-muted-foreground/40 group-focus-within/search:text-primary transition-colors">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search intelligence sector..."
              className="flex-1 bg-transparent border-none outline-none text-base sm:text-lg font-black text-foreground placeholder:text-muted-foreground/20 h-12 sm:h-16"
            />
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <div className="hidden xs:flex items-center gap-3 sm:pl-4 sm:border-l border-border/30 relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsEngineOpen(!isEngineOpen)}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 h-10 sm:h-12 bg-accent/50 hover:bg-accent rounded-xl sm:rounded-2xl border border-border/50 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                <span className="hidden sm:inline">{selectedEngine}</span>
                <span className="sm:hidden">{selectedEngine.split(' ')[0]}</span>
                <ChevronDown className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform", isEngineOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {isEngineOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full sm:top-full mb-3 sm:mt-3 right-0 w-48 sm:w-56 bg-background backdrop-blur-xl border border-border p-2 rounded-2xl shadow-2xl z-50 ring-1 ring-white/10 overflow-hidden">
                    {ENGINES?.map(engine => (
                      <button key={engine} type="button" onClick={() => { setSelectedEngine(engine); setIsEngineOpen(false); }} className="w-full px-4 py-3 text-left text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground rounded-xl transition-all cursor-pointer">{engine}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button type="submit" disabled={isSearching || !query.trim()} className="flex-1 sm:flex-none h-10 sm:h-14 px-6 sm:px-10 bg-primary text-primary-foreground rounded-xl sm:rounded-full font-black tracking-tighter uppercase text-xs sm:text-sm hover:translate-x-1 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 cursor-pointer">
              {isSearching ? "..." : "Search"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-start sm:justify-center gap-2 p-1 bg-accent/30 backdrop-blur-md rounded-2xl sm:rounded-full border border-border/50 max-w-full sm:max-w-fit mx-auto overflow-x-auto no-scrollbar scroll-smooth px-2">
        {[
          { id: "ALL", icon: LayoutGrid, label: "All" },
          { id: "NEWS", icon: Newspaper, label: "News" },
          { id: "IMAGES", icon: ImageIcon, label: "Images" },
          { id: "VIDEOS", icon: Video, label: "Videos" }
        ].map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id as SearchCategory)} className={cn("flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap", activeCategory === cat.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-accent text-muted-foreground/60")}>
            <cat.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {isSearching ? (
          <LoadingState message="Neural processing search vector matrices..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : results && results.length > 0 ? (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {paginatedResults?.map((result, index) => (
              <SearchResultCard key={index} {...result} />
            ))}

            <Pagination
              currentPage={currentPage}
              totalRecords={results.length}
              recordsPerPage={RECORDS_PER_PAGE}
              onPageChange={setCurrentPage}
              variant="minimal"
              className="py-12"
            />
          </div>
        ) : results && results.length === 0 ? (
          <div className="text-center py-24 bg-card/30 rounded-[3rem] border border-dashed border-border/50">
            <h3 className="text-xl font-black text-muted-foreground/20 uppercase tracking-tighter italic">Zero matches detected in local sector archives</h3>
            <p className="text-xs font-bold text-muted-foreground/10 uppercase tracking-widest mt-2 font-mono">Query: &quot;{query}&quot;</p>
          </div>
        ) : (
          <div className="text-center py-24 group">
            <div className="inline-flex flex-col items-center gap-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-muted-foreground flex items-center justify-center"><Search className="w-10 h-10" /></div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">Global Registry Ready</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Initialize network search to begin analysis</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
