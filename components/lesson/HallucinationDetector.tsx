"use client";

import { useState } from "react";
import Image from "next/image";
import { Glasses, AlertTriangle, CheckCircle2 } from "lucide-react";
import { HallucinationSentence } from "@/lib/data/lessonsData";
import { sounds } from "@/lib/soundEffects";

interface HallucinationDetectorProps {
  topic: string;
  aiResponseSnippet: string;
  sentences: HallucinationSentence[];
  turpiTip: string;
  onSentenceSelected: (isCorrect: boolean, explanation: string) => void;
  disabled?: boolean;
}

export default function HallucinationDetector({
  topic,
  aiResponseSnippet,
  sentences,
  turpiTip,
  onSentenceSelected,
  disabled = false,
}: HallucinationDetectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectSentence = (sentence: HallucinationSentence) => {
    if (disabled) return;
    sounds.playTap();
    setSelectedId(sentence.id);

    if (sentence.isHallucination) {
      onSentenceSelected(
        true,
        sentence.correction ||
          "¡Cazaste la alucinación! Ese dato fue inventado por la IA con total seguridad ficticia."
      );
    } else {
      onSentenceSelected(
        false,
        "Esa afirmación es real y verdadera. Sigue buscando con los lentes de Turpi: hay otra frase que contiene un dato inventado o exagerado."
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Turpi Detective Card */}
      <div className="bg-amber-50/80 border-2 border-amber-300 p-4 rounded-2xl flex items-start gap-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-amber-200 border border-amber-400 flex-shrink-0">
          <Image
            src="/turpi.png"
            alt="Turpi Detective"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-800 mb-0.5">
            <Glasses className="w-4 h-4 text-amber-600" />
            <span>Turpi Caza-Mentiras</span>
          </div>
          <p className="text-xs font-bold text-[#1b1c1c] leading-relaxed">
            {aiResponseSnippet}
          </p>
        </div>
      </div>

      <div className="text-center">
        <span className="text-xs font-black uppercase tracking-wider text-[#ff4b4b] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          🔍 Toca la afirmación FALSA inventada por la IA:
        </span>
      </div>

      {/* Interactive Sentences Stack */}
      <div className="space-y-2.5">
        {sentences.map((sent, index) => {
          const isSelected = selectedId === sent.id;

          return (
            <button
              key={sent.id}
              disabled={disabled}
              onClick={() => handleSelectSentence(sent)}
              className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 select-none ${
                isSelected
                  ? sent.isHallucination
                    ? "bg-emerald-50 border-[#58cc02] border-b-4 text-[#166534]"
                    : "bg-rose-50 border-[#ff4b4b] border-b-4 text-[#991b1b]"
                  : "bg-white border-[#e5e5e5] border-b-4 hover:border-neutral-300 text-[#1b1c1c] active:translate-y-0.5"
              }`}
            >
              <span className="text-[11px] font-black text-[#777777] bg-neutral-100 rounded-md px-1.5 py-0.5 flex-shrink-0 mt-0.5">
                #{index + 1}
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed flex-1">
                {sent.text}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
