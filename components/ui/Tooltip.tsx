"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/helpers";

import { TooltipSide } from "@/types/common";

interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  side?: TooltipSide;
  sideOffset?: number;
  className?: string;
  delayDuration?: number;
}

export function Tooltip({
  children,
  content,
  side = "right",
  sideOffset = 8,
  className,
  delayDuration = 100,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (side) {
      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + sideOffset;
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - sideOffset;
        break;
      case "top":
        top = rect.top - sideOffset;
        left = rect.left + rect.width / 2;
        break;
      case "bottom":
        top = rect.bottom + sideOffset;
        left = rect.left + rect.width / 2;
        break;
    }

    setCoords({ top, left });
  }, [side, sideOffset]);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delayDuration);
  }, [delayDuration, updatePosition]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  const transformOrigin: Record<TooltipSide, string> = {
    top: "bottom center",
    right: "left center",
    bottom: "top center",
    left: "right center",
  };

  const translateClass: Record<TooltipSide, string> = {
    top: "-translate-x-1/2 -translate-y-full",
    right: "translate-y-[-50%]",
    bottom: "-translate-x-1/2",
    left: "-translate-x-full translate-y-[-50%]",
  };

  // Arrow styles per side
  const arrowClass: Record<TooltipSide, string> = {
    right: "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-foreground",
    left: "absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-4 border-transparent border-l-foreground",
    top: "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-foreground",
    bottom: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full border-4 border-transparent border-b-foreground",
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </div>

      {mounted &&
        isVisible &&
        createPortal(
          <div
            role="tooltip"
            className={cn(
              "fixed z-[9999] pointer-events-none",
              translateClass[side],
              "animate-fade-in"
            )}
            style={{
              top: coords.top,
              left: coords.left,
              transformOrigin: transformOrigin[side],
            }}
          >
            <div
              className={cn(
                "relative bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap",
                className
              )}
            >
              {content}
              <div className={arrowClass[side]} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
