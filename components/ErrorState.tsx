import React from "react";
import { X } from "lucide-react";

interface ErrorStateProps {
    title?: string;
    message: string;
    onClose?: () => void;
}

export default function ErrorState({
    title = "Something went wrong",
    message,
    onClose
}: ErrorStateProps) {
    return (
        <div
            className="relative rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 shadow-lg backdrop-blur-md animate-fade-in"
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-black uppercase tracking-widest text-destructive mb-1">{title}</p>
                    <div className="max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                        <p className="text-xs font-medium text-destructive/80 leading-relaxed wrap-break-word whitespace-pre-wrap">
                            {message}
                        </p>
                    </div>
                </div>
                
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-destructive/10 rounded-lg transition-colors text-destructive/50 hover:text-destructive cursor-pointer shrink-0"
                        title="Dismiss error"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
