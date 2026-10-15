"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Flame, Zap, Battery, BatteryCharging, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { useUserStore } from "@/lib/store";
import { PATHS } from "@/lib/data/lessonsData";
import { sounds } from "@/lib/soundEffects";

interface HeaderProps {
  onOpenStore: () => void;
  onOpenPathSelector: () => void;
}

export default function Header({ onOpenStore, onOpenPathSelector }: HeaderProps) {
  const store = useUserStore();
  const currentPath = PATHS.find((p) => p.id === store.activePath) || PATHS[0];
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(sounds.getMuted());
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#e5e5e5] px-4 py-2.5 transition-all">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Active Path Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#58cc02] shadow-xs flex-shrink-0 bg-amber-50">
            <Image
              src="/turpi.png"
              alt="Turpi - Resuelve IA"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-[17px] tracking-tight text-[#1b1c1c] leading-none">
                Resuelve<span className="text-[#58cc02]">IA</span>
              </span>
              {store.isPro && (
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  PRO
                </span>
              )}
            </div>
            <button
              onClick={onOpenPathSelector}
              className="flex items-center gap-1 text-[11px] font-bold text-[#777777] hover:text-[#1b1c1c] transition-colors mt-0.5"
            >
              <span className="truncate max-w-[110px]">{currentPath.shortTitle}</span>
              <ChevronDown className="w-3 h-3 text-[#777777]" />
            </button>
          </div>
        </div>

        {/* Telemetry Stats: Racha 🔥, XP ⚡, Baterías 🔋 */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-black">
          {/* Streak Flame */}
          <div
            title="Días de racha consecutiva activa"
            className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-[#ff9600] px-2.5 py-1 rounded-full shadow-2xs"
          >
            <Flame className="w-4 h-4 fill-[#ff9600] text-[#ff9600] animate-pulse" />
            <span>{store.streak}</span>
          </div>

          {/* XP ⚡ */}
          <div
            title="Puntos de Experiencia acumulados"
            className="flex items-center gap-1 bg-sky-50 border border-sky-200 text-[#1cb0f6] px-2.5 py-1 rounded-full shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 fill-[#1cb0f6] text-[#1cb0f6]" />
            <span>{store.xp}</span>
          </div>

          {/* Baterías 🔋 */}
          <button
            onClick={onOpenStore}
            title={store.isPro ? "Baterías infinitas activas" : "Baterías restantes. Toca para recargar."}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border shadow-2xs transition-transform active:scale-95 ${
              store.isPro
                ? "bg-emerald-50 border-emerald-200 text-[#58cc02]"
                : (store.batteries ?? 5) <= 1
                ? "bg-rose-50 border-rose-300 text-[#ff4b4b] animate-bounce"
                : "bg-emerald-50 border-emerald-200 text-[#58cc02]"
            }`}
          >
            {store.isPro ? (
              <BatteryCharging className="w-4 h-4 text-[#58cc02]" />
            ) : (
              <Battery className="w-4 h-4 fill-current" />
            )}
            <span>{store.isPro ? "∞" : store.batteries ?? 5}</span>
          </button>

          {/* Sound Effects Mute Toggle */}
          <button
            onClick={() => setMuted(sounds.toggleMute())}
            title={muted ? "Activar audio" : "Silenciar audio"}
            className="p-1.5 rounded-full text-[#777777] hover:text-[#1b1c1c] hover:bg-neutral-100 transition-colors"
          >
            {muted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#58cc02]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
