import React from "react";
import { cn } from "@/utils/helpers";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  variant?: "table" | "minimal";
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalRecords,
  recordsPerPage,
  onPageChange,
  className,
  variant = "table"
}) => {
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startRecord = totalRecords > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  if (totalPages <= 1 && totalRecords <= recordsPerPage) {
    if (variant === "minimal") return null;
    return (
      <div className={cn("px-8 py-6 bg-accent/10 border-t border-border flex items-center justify-between", className)}>
        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
          Showing {totalRecords} records
        </div>
      </div>
    );
  }

  const getPageRange = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPageRange();

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center gap-3 py-10", className)}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-3 bg-card border border-border rounded-xl text-muted-foreground hover:text-primary transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-6 py-3 bg-accent/30 rounded-full border border-border/50 backdrop-blur-md">
          {pages.map((p, i) => (
            <React.Fragment key={i}>
              {p === "..." ? (
                <span className="text-[10px] font-black text-muted-foreground/20 px-1 select-none">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(p as number)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-[10px] font-black transition-all cursor-pointer",
                    currentPage === p 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                      : "text-muted-foreground/40 hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-3 bg-card border border-border rounded-xl text-muted-foreground hover:text-primary transition-all group active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 px-6"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Next</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("px-4 sm:px-8 py-3 sm:py-6 bg-accent/10 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-4", className)}>
      {/* Showing records count - hidden on ultra-small mobiles */}
      <div className="hidden xs:block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-widest text-muted-foreground/50 text-center sm:text-left">
        Showing <span className="text-foreground tracking-normal">{startRecord}-{endRecord}</span> of <span className="text-foreground tracking-normal">{totalRecords}</span> records
      </div>

      {/* Responsive Pagination Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:gap-2 sm:px-4 sm:py-2 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Compact design for mobile */}
        <div className="flex sm:hidden items-center gap-2 text-[11px] font-black font-mono">
          <span className="text-primary">{currentPage}</span>
          <span className="text-muted-foreground/20">/</span>
          <span className="text-muted-foreground/40">{totalPages}</span>
        </div>

        {/* Full numbered design for desktop */}
        <div className="hidden sm:flex items-center gap-1.5 mx-2">
          {pages.map((p, i) => (
            <React.Fragment key={i}>
              {p === "..." ? (
                <span className="text-[10px] font-black text-muted-foreground/20 px-1">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(p as number)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-[10px] font-black transition-all cursor-pointer",
                    currentPage === p 
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10" 
                      : "bg-card border border-border text-muted-foreground hover:bg-accent"
                  )}
                >
                  {p}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:gap-2 sm:px-4 sm:py-2 bg-primary sm:bg-card text-primary-foreground sm:text-foreground border border-border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-accent sm:hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer group"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
