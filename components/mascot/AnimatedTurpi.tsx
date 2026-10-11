"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";

export type TurpiMood = "happy" | "thinking" | "celebrating" | "teaching" | "waving";

interface AnimatedTurpiProps {
  mood?: TurpiMood;
  size?: "sm" | "md" | "lg" | "xl";
  speech?: string;
  accessory?: "glasses" | "backpack" | "calculator" | "detective";
  interactive?: boolean;
}

const CHIRPS = [
  "¡Epa vale! ¡Dale que hoy sí resuelves con IA! 🇻🇪",
  "¡Recuerda siempre la fórmula de los 4 ingredientes!",
  "¡Si la IA te habla raro, pídele que hable claro y sin palabras gringas!",
  "¡A romperla hoy en el liceo y en el negocio! 🚀",
  "¡Aquí estamos para no dejarnos engañar por alucinaciones! 🔍",
];

export default function AnimatedTurpi({
  mood = "happy",
  size = "md",
  speech,
  interactive = true,
}: AnimatedTurpiProps) {
  const [currentSpeech, setCurrentSpeech] = useState<string | null>(speech || null);
  const [chirpIndex, setChirpIndex] = useState(0);

  const handleTap = () => {
    if (!interactive) return;
    const nextMsg = CHIRPS[chirpIndex % CHIRPS.length];
    setChirpIndex((prev) => prev + 1);
    setCurrentSpeech(nextMsg);
    setTimeout(() => {
      if (!speech) setCurrentSpeech(null);
    }, 4000);
  };

  const sizeMap = {
    sm: "w-14 h-14",
    md: "w-20 h-20",
    lg: "w-28 h-28",
    xl: "w-36 h-36",
  };

  const moodVariants = {
    happy: {
      y: [0, -6, 0],
      rotate: [0, 1.5, -1.5, 0],
      transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
    },
    thinking: {
      rotate: [-4, 4, -4],
      y: [0, -3, 0],
      transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
    },
    celebrating: {
      y: [0, -14, 0],
      scale: [1, 1.08, 1],
      rotate: [-3, 3, -3],
      transition: { duration: 0.9, repeat: Infinity, ease: "easeOut" },
    },
    teaching: {
      x: [0, 4, 0],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
    },
    waving: {
      rotate: [0, -6, 6, -6, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Speech Bubble */}
      <AnimatePresence>
        {(currentSpeech || speech) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="mb-2 max-w-xs bg-white border-2 border-b-3 border-[#58cc02] px-3.5 py-2 rounded-2xl shadow-md text-xs font-bold text-[#1b1c1c] text-center relative z-20"
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-black uppercase text-[#58cc02] mb-0.5">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Turpi dice:</span>
            </div>
            {currentSpeech || speech}
            <div className="w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-[#58cc02] transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Animated Body */}
      <motion.button
        type="button"
        onClick={handleTap}
        variants={moodVariants as any}
        animate={mood}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className={`relative ${sizeMap[size]} rounded-3xl overflow-hidden bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-100 border-3 border-amber-400 shadow-md flex items-center justify-center cursor-pointer`}
      >
        <Image
          src="/turpi.png"
          alt="Turpi el Turpial"
          fill
          className="object-cover pointer-events-none"
          priority
        />

        {/* Glasses Cyber Glow Reflection */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-transparent pointer-events-none"
        />
      </motion.button>
    </div>
  );
}
