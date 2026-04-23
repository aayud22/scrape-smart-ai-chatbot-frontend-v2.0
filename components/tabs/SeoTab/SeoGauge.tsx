import React from "react";
import { cn } from "@/utils/helpers";

interface SeoGaugeProps {
  score: number;
}

export const SeoGauge = ({ score }: SeoGaugeProps) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  let color = "text-red-500";
  if (score >= 80) color = "text-primary";
  else if (score >= 50) color = "text-yellow-500";

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="12"
          className="text-muted-foreground/10"
        />
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(color, "transition-all duration-1000 ease-out")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black">{score}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Health Score</span>
      </div>
    </div>
  );
};
