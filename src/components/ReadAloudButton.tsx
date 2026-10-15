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
  activeClassName = "bg-accent/10 border-accent/40 text-accent"
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
            ? "p-2 min-w-11 min-h-11 rounded-md text-ink/35 hover:text-accent hover:bg-accent/6"
            : "gap-2 h-9 px-3.5 rounded-md text-ink/75 hover:text-accent border border-ink/15 hover:border-accent/40 text-[13px] font-medium"
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
             {!isMinimal && <span>{isPaused ? "Resume" : "Listen"}</span>}
          </>
        )}
      </button>

      {(isSpeaking || isPaused) && (
        <button
          onClick={stop}
          className={`${isMinimal ? "p-2 min-w-11 min-h-11" : "p-1.5"} flex items-center justify-center shrink-0 rounded-md bg-ink/4 hover:bg-ink/8 text-ink/30 hover:text-ink/60 
                     border border-transparent hover:border-ink/10 transition-colors cursor-pointer`}
          aria-label="Stop reading"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      )}
    </div>
  );
}

