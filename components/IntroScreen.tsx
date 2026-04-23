"use client";

import React from "react";
import { Icons } from "@/components/Icons";

interface IntroScreenProps {
  protocol: string;
  setProtocol: (protocol: string) => void;
  domainInput: string;
  setDomainInput: (value: string) => void;
  urlError: string;
  setUrlError: (error: string) => void;
  handleStartAnalysis: () => void;
  normalizeDomainInput: (value: string) => { cleanValue: string; nextProtocol: "http://" | "https://" | null };
}

export function IntroScreen({
  protocol,
  setProtocol,
  domainInput,
  setDomainInput,
  urlError,
  setUrlError,
  handleStartAnalysis,
  normalizeDomainInput,
}: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 mt-10">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
        <Icons.Link className="text-primary w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Analyze Any Website
      </h1>
      <p className="max-w-md text-muted-foreground text-lg">
        Enter a URL to run a technical SEO audit, scrape content, and chat with
        the website data.
      </p>

      <div className="flex flex-col w-full max-w-md gap-4 mt-4">
        <div className="flex flex-col gap-1 text-left">
          <div
            className={`flex w-full rounded-xl border bg-card overflow-hidden shadow-sm transition-shadow ${
              urlError
                ? "border-destructive focus-within:ring-destructive"
                : "border-border focus-within:ring-2 focus-within:ring-primary"
            }`}
          >
            <select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              className="bg-muted border-r border-border px-3 py-3 text-sm text-foreground font-medium outline-none cursor-pointer hover:bg-accent transition-colors"
            >
              <option value="https://">https://</option>
              <option value="http://">http://</option>
            </select>

            <input
              type="text"
              placeholder="example.com"
              value={domainInput}
              onChange={(e) => {
                const { cleanValue, nextProtocol } = normalizeDomainInput(e.target.value);

                if (nextProtocol) {
                  setProtocol(nextProtocol);
                }

                setDomainInput(cleanValue);
                setUrlError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleStartAnalysis()}
              className="flex-1 px-4 py-3 outline-none text-foreground bg-transparent w-full placeholder-muted-foreground"
            />
          </div>
          {urlError && (
            <p className="text-destructive text-sm px-1 animate-fade-in">
              {urlError}
            </p>
          )}
        </div>
        <button
          onClick={handleStartAnalysis}
          disabled={!domainInput.trim() || !!urlError}
          className="w-full py-4 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          Analyze Website
        </button>
      </div>
    </div>
  );
}
