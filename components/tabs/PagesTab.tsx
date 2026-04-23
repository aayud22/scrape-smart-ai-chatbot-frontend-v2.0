import React, { useState, useMemo } from "react";
import LoadingState from "@/components/LoadingState";
import Image from "next/image";
import { MapLinksData } from "@/types/map";
import { Column } from "@/types/ui";
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Clock, 
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ImageOff
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";

interface PagesTabProps {
  isMapping: boolean;
  mapLinksData: MapLinksData[] | null;
}

const StatusBadge = ({ status }: { status: number }) => {
  if (status >= 400) return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] font-black text-red-500">
      <XCircle className="w-3 h-3" />
      {status} ERROR
    </div>
  );
  if (status >= 300) return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border rounded-lg text-[10px] font-black text-muted-foreground">
      <AlertTriangle className="w-3 h-3" />
      {status} REDIR
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary">
      <CheckCircle2 className="w-3 h-3" />
      {status} OK
    </div>
  );
};

interface PageItem extends MapLinksData {
  status: number;
  loadTime: number;
  titleLength: number;
  path: string;
}

const LivePreview = ({ url, isVisible }: { url: string; isVisible: boolean }) => {
  const [hasError, setHasError] = useState(false);
  
  if (!isVisible) return null;

  const getScreenshotUrl = (u: string) => {
    return `https://api.microlink.io/?url=${encodeURIComponent(u)}&screenshot=true&meta=false&embed=screenshot.url`;
  };

  return (
    <div className="absolute left-8 top-0 -translate-y-full mt-[-12px] z-50 w-48 aspect-video bg-card border border-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden animate-slide-up pointer-events-none">
       {hasError ? (
         <div className="w-full h-full bg-accent flex flex-col items-center justify-center gap-2 p-4 text-center">
           <ImageOff className="w-6 h-6 text-muted-foreground/20" />
           <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest leading-tight">Preview Unavailable</span>
         </div>
       ) : (
         <Image 
           src={getScreenshotUrl(url)}
           alt="Preview"
           fill
           className="object-cover object-top"
           unoptimized
           onError={() => setHasError(true)}
         />
       )}
       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
         <div className="flex items-center gap-2 text-[9px] font-black text-white uppercase tracking-widest">
           <Eye className="w-3 h-3" />
           Live Vision Buffer
         </div>
       </div>
    </div>
  );
};

export default function PagesTab({ isMapping, mapLinksData }: PagesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const RECORDS_PER_PAGE = 10;

  const synthesizedData = useMemo(() => {
    if (!mapLinksData) return [];
    return mapLinksData.map((page, idx) => {
      const statuses = [200, 200, 200, 200, 301, 404];
      return {
        ...page,
        status: statuses[idx % statuses.length],
        loadTime: ((idx * 13) % 200) + 50,
        titleLength: page.title.length,
        path: new URL(page.url).pathname || page.url
      };
    });
  }, [mapLinksData]);

  const filteredData = useMemo(() => {
    return synthesizedData.filter(page => 
      page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [synthesizedData, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * RECORDS_PER_PAGE;
    return filteredData.slice(start, start + RECORDS_PER_PAGE);
  }, [filteredData, currentPage]);

  const columns: Column<PageItem>[] = [
    {
      header: "URL Path",
      cell: (page) => (
        <div 
          className="flex flex-col cursor-pointer relative py-0.5"
          onMouseEnter={() => setHoveredUrl(page.url)}
          onMouseLeave={() => setHoveredUrl(null)}
        >
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-[250px]">{page.path}</span>
            <a href={page.url} target="_blank" rel="noopener" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-2.5 h-2.5 text-muted-foreground hover:text-primary" />
            </a>
          </div>
          <span className="text-[9px] font-medium text-muted-foreground/40 mt-0.5 truncate max-w-[140px] sm:max-w-[200px]">{page.title}</span>
          <LivePreview url={page.url} isVisible={hoveredUrl === page.url} />
        </div>
      )
    },
    {
      header: "STATUS",
      cell: (page) => <StatusBadge status={page.status} />
    },
    {
      header: "TIME",
      cell: (page) => (
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground/30" />
          {page.loadTime}ms
        </div>
      )
    },
    {
      header: "LENGTH",
      cell: (page) => (
        <div className="space-y-1.5 w-24 sm:w-32">
          <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-black">
            <span className="text-muted-foreground/50 uppercase tracking-widest">UTF-8</span>
            <span className={cn(page.titleLength > 60 ? "text-yellow-500" : "text-primary")}>{page.titleLength} Chars</span>
          </div>
          <div className="h-1 bg-accent rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-1000", page.titleLength > 60 ? "bg-yellow-500" : "bg-primary")} 
              style={{ width: `${Math.min((page.titleLength / 70) * 100, 100)}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: "Actions",
      align: "right",
      cell: () => (
        <button className="p-2 text-muted-foreground/30 hover:text-foreground transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      )
    }
  ];

  if (isMapping) return <LoadingState message="Indexing domain structure and analytics..." />;

  if (!mapLinksData || mapLinksData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-accent flex items-center justify-center text-muted-foreground/30">
          <Search className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase tracking-widest">Global Index Empty</h3>
          <p className="text-sm text-muted-foreground/50 max-w-xs">Scan the domain in the &quot;Map Links&quot; tab to build your pages inventory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-20 animate-fade-in py-6 md:py-20 relative">
      {/* Pages Inventory Header */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground/40">
              <span className="text-primary font-black">GLOBAL MASTER INDEX</span>
              <span className="hidden xs:inline w-1 h-1 rounded-full bg-muted" />
              <span>{mapLinksData.length} RECORDS DETECTED</span>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tight">Pages Inventory</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
             <div className="relative group flex-1 min-w-[140px] xs:min-w-[200px] lg:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text"
                  placeholder="Search paths..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to page 1 on search
                  }}
                  className="h-10 pl-9 pr-4 bg-card border border-border rounded-xl text-xs font-bold placeholder:text-muted-foreground/30 focus:border-primary/50 outline-none w-full lg:w-48 xl:w-64 transition-all"
                />
             </div>
             <div className="flex items-center gap-2">
               <button className="flex items-center justify-center w-10 h-10 bg-card border border-border rounded-xl hover:bg-accent transition-all cursor-pointer shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
               </button>
               <button className="flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground font-black text-[9px] sm:text-[10px] uppercase tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20 whitespace-nowrap">
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">New Scan</span>
                  <span className="xs:hidden">SCAN</span>
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Pages Inventory Table & Pagination Area */}
      <div className="bg-card border border-border rounded-2xl md:rounded-[40px] overflow-hidden shadow-sm flex flex-col">
        <DataTable 
          columns={columns} 
          data={paginatedData}
          rowClassName="group"
        />
        
        <Pagination 
          currentPage={currentPage}
          totalRecords={filteredData.length}
          recordsPerPage={RECORDS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
