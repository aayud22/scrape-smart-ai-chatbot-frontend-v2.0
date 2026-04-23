"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ChevronDown,
  Cpu,
  Check,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { useTheme } from "next-themes";
import { signIn } from "next-auth/react";

interface LandingHeroProps {
  protocol: string;
  setProtocol: (protocol: string) => void;
  domainInput: string;
  setDomainInput: (value: string) => void;
  urlError: string;
  setUrlError: (error: string) => void;
  handleStartAnalysis: () => void;
  normalizeDomainInput: (value: string) => { cleanValue: string; nextProtocol: "http://" | "https://" | null };
}

export function LandingHero({
  protocol,
  setProtocol,
  domainInput,
  setDomainInput,
  urlError,
  setUrlError,
  handleStartAnalysis,
  normalizeDomainInput,
}: LandingHeroProps) {
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProtocolOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500 overflow-x-hidden pt-20">
      {/* Decorative Radial Glow (Dark Mode Only) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] dark:opacity-100 opacity-30" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-background/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">ScrapeSmart <span className="text-primary">AI</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Platform", "Solutions", "Developers", "Pricing"].map((link) => (
            <a key={link} href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl cursor-pointer border border-border hover:bg-accent transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <div className="w-5 h-5" />
            ) : theme === "dark" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          <button 
            onClick={() => signIn("google")}
            className="hidden sm:block text-sm font-bold hover:text-primary transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={() => signIn("google")}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto w-full pb-20 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Title */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] text-balance">
            Extract Intelligence. <br />
            <span className="text-primary glowing-text">Surgical Precision.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
            Deploy AI-driven scrapers that adapt to site changes instantly. <br className="hidden md:block" />
            No code required. Enterprise scale ready.
          </p>

          {/* Command Bar Area */}
          <div className="w-full max-w-3xl mx-auto space-y-6 pt-4">
            <div className={cn(
              "group relative z-20 flex flex-col md:flex-row items-stretch p-2 rounded-2xl border bg-card transition-all duration-300 shadow-2xl",
              urlError ? "border-destructive ring-1 ring-destructive" : "border-border focus-within:border-primary/50"
            )}>
              {/* Protocol Dropdown */}
              <div 
                ref={dropdownRef}
                className="relative flex items-center px-5 border-r border-border h-14 cursor-pointer group/proto hover:bg-accent/50 rounded-l-xl transition-colors"
                onClick={() => setIsProtocolOpen(!isProtocolOpen)}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="text-muted-foreground opacity-50">{protocol}</span>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isProtocolOpen && "rotate-180")} />
                </div>
                
                <AnimatePresence>
                  {isProtocolOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-[72px] -left-2 w-32 bg-card border border-border rounded-xl shadow-2xl z-100 overflow-hidden py-1"
                    >
                      {["https://", "http://"].map((p) => (
                        <button 
                          key={p}
                          onClick={(e) => { e.stopPropagation(); setProtocol(p as "https://" | "http://"); setIsProtocolOpen(false); inputRef.current?.focus(); }}
                          className={cn("w-full text-left px-4 py-2 text-sm font-bold transition-colors", protocol === p ? "text-primary" : "hover:bg-accent")}
                        >
                          {p}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter target URL (e.g., example.com/data)"
                value={domainInput}
                onChange={(e) => {
                  const { cleanValue, nextProtocol } = normalizeDomainInput(e.target.value);
                  if (nextProtocol) setProtocol(nextProtocol);
                  setDomainInput(cleanValue);
                  setUrlError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleStartAnalysis()}
                className="flex-1 px-6 py-4 bg-transparent outline-none text-lg font-medium w-full placeholder:text-muted-foreground/50"
              />

              {/* Action Button */}
              <button
                onClick={handleStartAnalysis}
                disabled={!domainInput.trim() || !!urlError}
                className="h-14 md:h-auto px-8 bg-primary hover:brightness-110 text-primary-foreground rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 group/btn disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Analyze Website
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Error Message */}
            {urlError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-sm font-bold text-center"
              >
                {urlError}
              </motion.p>
            )}

            {/* Feature Toggles */}
            <div className="flex flex-wrap justify-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-foreground/80">
                <Check className="w-4 h-4 text-primary" />
                <span>Auto-Bypass Captcha</span>
              </div>

              <div className="flex items-center gap-2 text-[13px] font-bold text-foreground/80">
                <Check className="w-4 h-4 text-primary" />
                <span>Proxy Rotation</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between border-t border-white/5 opacity-50">
        <div className="flex items-center gap-3 mb-6 md:mb-0">
          <span className="text-sm font-bold">ScrapeSmart AI</span>
          <span className="text-xs text-muted-foreground">© 2026 ScrapeSmart AI. Built for Surgical Accuracy.</span>
        </div>
        <div className="flex items-center gap-8">
          {["Privacy Policy", "Terms of Service", "Security", "Status"].map((link) => (
            <a key={link} href="#" className="text-xs font-bold hover:text-primary transition-colors">
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
