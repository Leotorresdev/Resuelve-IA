"use client";

import { useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Zap, Gem, Flame, Award, ArrowRight } from "lucide-react";
import TurpiVideoAvatar from "@/components/mascot/TurpiVideoAvatar";

interface LessonCelebrationProps {
  xpEarned: number;
  gemsEarned: number;
  streak: number;
  onFinish: () => void;
}

export default function LessonCelebration({
  xpEarned,
  gemsEarned,
  streak,
  onFinish,
}: LessonCelebrationProps) {
  useEffect(() => {
    // Trigger festive confetti cannons
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#58cc02", "#1cb0f6", "#ff9600", "#ffc800"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#58cc02", "#1cb0f6", "#ff9600", "#ffc800"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="py-6 px-4 text-center space-y-6 animate-in zoom-in-95 duration-200">
      {/* Mascot Hero Video Celebration */}
      <div className="relative inline-block">
        <TurpiVideoAvatar size="md" className="mx-auto border-4 border-amber-400 shadow-xl" />
        <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2 rounded-full border-2 border-white shadow-md z-10">
          <Award className="w-5 h-5 fill-current" />
        </div>
      </div>

      <div>
        <span className="text-xs font-black uppercase tracking-widest text-[#58cc02] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          ¡LECCIÓN COMPLETADA!
        </span>
        <h2 className="text-2xl font-black text-[#1b1c1c] mt-2">
          ¡Resolviste con éxito!
        </h2>
        <p className="text-xs text-[#777777] font-bold mt-1">
          Has dominado una nueva técnica para hablar con la IA
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
        {/* XP Card */}
        <div className="bg-emerald-50/70 border-2 border-emerald-200 p-3 rounded-2xl flex flex-col items-center">
          <Zap className="w-5 h-5 text-[#58cc02] fill-[#58cc02] mb-1" />
          <span className="text-base font-black text-[#1b1c1c]">+{xpEarned}</span>
          <span className="text-[10px] font-black uppercase text-[#58cc02]">
            EXP
          </span>
        </div>

        {/* Gems Card */}
        <div className="bg-sky-50/70 border-2 border-sky-200 p-3 rounded-2xl flex flex-col items-center">
          <Gem className="w-5 h-5 text-[#1cb0f6] fill-[#1cb0f6] mb-1" />
          <span className="text-base font-black text-[#1b1c1c]">+{gemsEarned}</span>
          <span className="text-[10px] font-black uppercase text-[#1cb0f6]">
            GEMAS
          </span>
        </div>

        {/* Streak Card */}
        <div className="bg-amber-50/70 border-2 border-amber-200 p-3 rounded-2xl flex flex-col items-center">
          <Flame className="w-5 h-5 text-[#ff9600] fill-[#ff9600] mb-1" />
          <span className="text-base font-black text-[#1b1c1c]">{streak} DÍAS</span>
          <span className="text-[10px] font-black uppercase text-[#ff9600]">
            RACHA
          </span>
        </div>
      </div>

      <div className="pt-4 max-w-sm mx-auto">
        <button
          onClick={onFinish}
          className="w-full btn-3d-green py-3.5 rounded-2xl text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
        >
          <span>CONTINUAR</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
