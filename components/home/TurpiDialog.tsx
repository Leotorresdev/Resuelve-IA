"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import TurpiVoiceButton from "@/components/mascot/TurpiVoiceButton";

interface TurpiDialogProps {
  message?: string;
  badge?: string;
}

export default function TurpiDialog({
  message = "¡Epa! Hoy vamos a practicar cómo pedirle a Gemini respuestas precisas en 3 minutos. ¡Toca el nivel para empezar!",
  badge = "CONSEJO DE TURPI 🇻🇪",
}: TurpiDialogProps) {
  return (
    <div className="flex items-start gap-3 bg-white border-2 border-b-4 border-[#e5e5e5] p-3.5 rounded-2xl shadow-xs relative">
      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-amber-100/70 border-2 border-amber-300 flex-shrink-0 shadow-2xs">
        <Image
          src="/turpi.png"
          alt="Turpi el Turpial"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#ff9600] fill-[#ff9600]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#ff9600]">
              {badge}
            </span>
          </div>

          <TurpiVoiceButton textToSpeak={message} size="sm" />
        </div>

        <p className="text-xs text-[#1b1c1c] font-bold leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
