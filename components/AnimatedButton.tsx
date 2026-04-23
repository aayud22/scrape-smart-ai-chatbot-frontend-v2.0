"use client";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
  title?: string;
}

export default function AnimatedButton({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  title
}: AnimatedButtonProps) {
  const baseClasses = "relative overflow-hidden transition-all duration-300 ease-out";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:shadow-md hover:-translate-y-1 active:scale-95",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:shadow-sm hover:-translate-y-1 active:scale-95"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-2xl"
  };

  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-md active:scale-100" 
    : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Ripple effect overlay */}
      {!disabled && (
        <span className="absolute inset-0 bg-white/20 rounded-inherit scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
      )}
    </button>
  );
}
