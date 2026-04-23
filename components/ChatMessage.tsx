"use client";

import { cn } from "@/utils/helpers";
import { User, Cpu } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatMessageProps {
  message: {
    role: "user" | "bot";
    text: string;
    timestamp: number;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "w-full flex mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex max-w-[95%] sm:max-w-[85%] md:max-w-[70%] gap-2 sm:gap-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className="shrink-0">
          {isUser ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn(
          "space-y-1 min-w-0",
          isUser ? "items-end" : "items-start"
        )}>
          <div className={cn(
            "text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-1 mb-1",
            isUser ? "text-right" : "text-left"
          )}>
            {isUser ? "Operator" : "Surgical Intelligence"}
          </div>
          
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3.5 text-[12px] sm:text-[13px] leading-relaxed transition-colors",
              isUser
                ? "bg-accent text-foreground border border-border rounded-tr-none shadow-sm"
                : "bg-card text-foreground border border-border rounded-tl-none"
            )}
          >
            {message?.role === "bot" ? (
              <div className="prose-sm prose-invert max-w-full overflow-x-auto">
                <MarkdownRenderer content={message?.text} />
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words">
                {message?.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
