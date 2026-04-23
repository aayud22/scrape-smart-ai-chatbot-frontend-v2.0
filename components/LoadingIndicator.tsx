"use client";

import { Cpu } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
}

export default function LoadingIndicator({ 
  message = "analyzing site", 
  className = "" 
}: LoadingIndicatorProps) {
  return (
    <div className={`flex w-full justify-start items-center gap-3 ${className} animate-pulse`}>
      {/* Avatar Container */}
      <div className="shrink-0 relative">
        <div className="w-8 h-8 bg-[#00D1FF] rounded-lg flex items-center justify-center shadow-lg shadow-[#00D1FF]/20">
          <Cpu className="w-4 h-4 text-black" />
        </div>
        
        {/* Pulsing Ring */}
        <div className="absolute inset-0 w-8 h-8 bg-[#00D1FF] rounded-lg animate-ping opacity-20" />
      </div>

      {/* Message Container */}
      <div className="flex flex-col gap-1">
        {/* Typing Dots Container */}
        <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-2xl rounded-tl-none shadow-sm">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full animate-bounce [animation-duration:1s]" />
            <div className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]" />
          </div>
        </div>
        
        {/* Status Text */}
        <div className="text-[10px] font-black uppercase tracking-widest text-[#00D1FF]/50 ml-1">
          {message}
        </div>
      </div>
    </div>
  );
}
