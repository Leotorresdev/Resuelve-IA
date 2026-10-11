"use client";

import { useState, useEffect } from "react";
import { Volume2, Square, Sparkles } from "lucide-react";
import { turpiVoice } from "@/lib/speechEngine";

interface TurpiVoiceButtonProps {
  textToSpeak: string;
  size?: "sm" | "md";
  className?: string;
}

export default function TurpiVoiceButton({
  textToSpeak,
  size = "md",
  className = "",
}: TurpiVoiceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = turpiVoice.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      turpiVoice.stop();
    } else {
      turpiVoice.speak(textToSpeak);
    }
  };

  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 transition-all select-none rounded-xl font-black ${
        isSpeaking
          ? "bg-amber-400 text-neutral-950 border-2 border-amber-500 shadow-sm animate-pulse"
          : "bg-amber-100/80 hover:bg-amber-200/90 text-amber-900 border border-amber-300/80 active:translate-y-0.5"
      } ${
        isSmall
          ? "px-2.5 py-1 text-[11px]"
          : "px-3.5 py-1.5 text-xs shadow-2xs"
      } ${className}`}
      title={isSpeaking ? "Toca para detener la voz" : "Escuchar a Turpi explicar este consejo"}
    >
      {isSpeaking ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Detener Voz</span>
          <span className="flex gap-0.5 items-end h-3 ml-0.5">
            <span className="w-1 bg-neutral-950 h-2 animate-bounce rounded-full" />
            <span className="w-1 bg-neutral-950 h-3 animate-bounce delay-75 rounded-full" />
            <span className="w-1 bg-neutral-950 h-1.5 animate-bounce delay-150 rounded-full" />
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-amber-700" />
          <span>Escuchar a Turpi</span>
        </>
      )}
    </button>
  );
}
