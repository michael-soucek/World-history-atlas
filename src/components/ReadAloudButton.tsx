"use client";

import { useReadAloud } from "@/hooks/useReadAloud";
import { Volume2, Play, Pause, Square } from "lucide-react";

interface ReadAloudButtonProps {
  text: string;
  className?: string;
  variant?: "full" | "minimal";
  activeClassName?: string;
}

/**
 * A toggle button that reads the provided text aloud using the Web Speech API.
 * Includes play/pause and stop controls.
 */
export function ReadAloudButton({ 
  text, 
  className = "", 
  variant = "full",
  activeClassName = "bg-ancient/20 border-ancient/30 shadow-md ring-1 ring-ancient/10"
}: ReadAloudButtonProps) {
  const { isSpeaking, isPaused, play, pause, stop } = useReadAloud(text);

  if (!text) return null;

  const isMinimal = variant === "minimal";

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        onClick={isSpeaking ? pause : play}
        className={`flex items-center justify-center transition-all duration-200 group active:scale-95 cursor-pointer
          ${isMinimal 
            ? "p-2 rounded-lg bg-ancient/5 hover:bg-ancient/10 text-ancient/60 hover:text-ancient border border-ancient/5 hover:border-ancient/15" 
            : "gap-2 px-3 py-1.5 rounded-full bg-ancient/5 hover:bg-ancient/15 text-ancient border border-ancient/10 hover:border-ancient/20 text-xs font-semibold shadow-sm"
          }
          ${(isSpeaking || isPaused) ? activeClassName : ""}
        `}
        aria-label={isSpeaking ? "Pause reading" : isPaused ? "Resume reading" : "Read aloud"}
      >
        {isSpeaking ? (
          <>
            <Pause className={`${isMinimal ? "w-4 h-4" : "w-3.5 h-3.5"} fill-current`} />
            {!isMinimal && <span>Pause</span>}
          </>
        ) : (
          <>
             <Volume2 className={`${isMinimal ? "w-4 h-4" : "w-3.5 h-3.5"} ${isPaused ? "animate-pulse" : ""}`} />
             {!isMinimal && <span>{isPaused ? "Resume" : "Read Aloud"}</span>}
          </>
        )}
      </button>

      {(isSpeaking || isPaused) && (
        <button
          onClick={stop}
          className={`${isMinimal ? "p-2" : "p-1.5"} rounded-full bg-ink/[0.04] hover:bg-ink/[0.08] text-ink/30 hover:text-ink/60 
                     border border-transparent hover:border-ink/10 transition-colors cursor-pointer`}
          aria-label="Stop reading"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      )}
    </div>
  );
}

