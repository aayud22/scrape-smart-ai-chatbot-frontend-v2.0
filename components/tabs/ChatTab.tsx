import React, { RefObject } from "react";
import ChatMessage from "@/components/ChatMessage";
import LoadingIndicator from "@/components/LoadingIndicator";
import { MessageSquarePlus } from "lucide-react";

import { ChatRole, ChatItem } from "@/types/chat";

interface ChatTabProps {
  chatHistory: ChatItem[];
  isLoading: boolean;
  suggestedQuestions: string[];
  handleAskQuestion: (q: string) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function ChatTab({
  chatHistory,
  isLoading,
  suggestedQuestions,
  handleAskQuestion,
  messagesEndRef,
}: ChatTabProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      {chatHistory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in max-w-4xl mx-auto px-4 md:px-0 w-full">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D1FF] mb-4">
            <MessageSquarePlus className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-foreground transition-colors">How can I assist?</h2>
            <p className="text-sm text-muted-foreground/60 max-w-sm mx-auto font-medium">Ask anything about the target website to extract insights or perform analysis.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl px-4 pt-6">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleAskQuestion(q)}
                className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-accent/20 border border-border hover:border-primary/50 hover:bg-accent/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md active:scale-95"
              >
                <div className="text-[11px] font-bold text-center leading-relaxed group-hover:text-primary transition-colors">
                  {q}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-4xl mx-auto px-4 md:px-0 w-full">
            {chatHistory.map((chat) => (
              <ChatMessage key={chat.timestamp} message={chat} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                 <LoadingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
