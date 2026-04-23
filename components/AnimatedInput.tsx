"use client";

import { useState } from "react";

interface AnimatedInputProps {
  value: string;
  onChange: (value: string) => void;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  type?: "text" | "url" | "email";
  label?: string;
}

export default function AnimatedInput({
  value,
  onChange,
  onInput,
  placeholder,
  disabled = false,
  error,
  className = "",
  type = "text",
  label
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = "transition-all duration-300 ease-out flex items-center flex-col gap-3";
  const inputClasses = `
    w-full px-4 py-3 bg-slate-50 border-2 rounded-xl
    outline-none transition-all duration-300 ease-out
    text-slate-900 placeholder-slate-400
    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
    focus:bg-white
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500 animate-shake' : 'border-slate-200'}
    ${isFocused ? 'shadow-lg shadow-blue-500/20 -translate-y-1' : 'shadow-sm'}
  `;

  return (
    <div className={`${baseClasses} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 transition-colors duration-300">
          {label}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onInput?.(e);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={inputClasses}
      />
      
      {/* Error message with animation */}
      {error && (
        <div className="text-xs text-red-500 animate-slide-up">
          {error}
        </div>
      )}
    </div>
  );
}
