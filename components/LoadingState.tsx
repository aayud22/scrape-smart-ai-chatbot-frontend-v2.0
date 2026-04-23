import React from "react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Processing your request..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in w-full">
      <div className="relative flex justify-center items-center mb-6">
        <div className="absolute animate-ping w-12 h-12 rounded-full bg-blue-100 opacity-75" />
        <div className="relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
      <p className="text-slate-500 font-medium animate-pulse">{message}</p>
    </div>
  );
}
