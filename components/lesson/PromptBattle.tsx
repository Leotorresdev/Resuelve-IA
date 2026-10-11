"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { BattleOption } from "@/lib/data/lessonsData";
import { sounds } from "@/lib/soundEffects";
import TurpiVoiceButton from "@/components/mascot/TurpiVoiceButton";

interface PromptBattleProps {
  scenario: string;
  targetAi: string;
  optionA: BattleOption;
  optionB: BattleOption;
  turpiTip: string;
  onAnswerSelected: (isCorrect: boolean, explanation: string) => void;
  disabled?: boolean;
}

export default function PromptBattle({
  scenario,
  targetAi,
  optionA,
  optionB,
  turpiTip,
  onAnswerSelected,
  disabled = false,
}: PromptBattleProps) {
  const [selectedId, setSelectedId] = useState<"A" | "B" | null>(null);

  const handleSelect = (option: BattleOption) => {
    if (disabled) return;
    sounds.playTap();
    setSelectedId(option.id);
    onAnswerSelected(option.isCorrect, option.explanation);
  };

  return (
    <div className="space-y-4">
      {/* Target Scenario Box */}
      <div className="bg-sky-50/70 border-2 border-sky-200 p-4 rounded-2xl">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#006590] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Misión de Prompt • {targetAi}</span>
        </div>
        <p className="text-sm font-bold text-[#1b1c1c] leading-relaxed">
          {scenario}
        </p>
      </div>

      <div className="text-center">
        <span className="text-xs font-black uppercase tracking-wider text-[#777777]">
          Selecciona el prompt más efectivo:
        </span>
      </div>

      {/* Options Stack */}
      <div className="space-y-3">
        {[optionA, optionB].map((opt) => {
          const isSelected = selectedId === opt.id;

          return (
            <button
              key={opt.id}
              disabled={disabled}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 select-none ${
                isSelected
                  ? "bg-sky-50 border-[#1cb0f6] border-b-4 text-[#006590]"
                  : "bg-white border-[#e5e5e5] border-b-4 hover:border-neutral-300 text-[#1b1c1c] active:translate-y-1 active:border-b-2"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? "bg-[#1cb0f6] text-white"
                    : "bg-neutral-100 text-[#4b4b4b]"
                }`}
              >
                {opt.id}
              </div>

              <div className="flex-1">
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  "{opt.text}"
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
