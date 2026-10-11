"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Award,
  Flame,
  Zap,
  BookOpen,
  Download,
  CheckCircle2,
  Lock,
  Share2,
} from "lucide-react";
import { useUserStore } from "@/lib/store";

export default function ProfileTab() {
  const store = useUserStore();
  const [showCertificate, setShowCertificate] = useState(false);

  const BADGES = [
    {
      id: "streak-3",
      title: "Racha de 3 Días 🔥",
      description: "Constancia diaria aprendiendo a resolver con IA.",
      unlocked: store.streak >= 3,
      icon: "🔥",
    },
    {
      id: "first-battle",
      title: "Primer Duelo Ganado ⚔️",
      description: "Superaste tu primera batalla de prompts.",
      unlocked: store.completedLessons.length >= 1,
      icon: "⚔️",
    },
    {
      id: "hallucination-hunter",
      title: "Caza-Mentiras 🔍",
      description: "Detectaste alucinaciones ficticias en respuestas de IA.",
      unlocked: store.completedLessons.some((id) => id.includes("3")),
      icon: "🔍",
    },
    {
      id: "pro-master",
      title: "Resuelve PRO 🚀",
      description: "Acceso ilimitado y motor de IA desbloqueado.",
      unlocked: store.isPro,
      icon: "🚀",
    },
  ];

  return (
    <div className="pb-24 pt-3 max-w-xl mx-auto px-4 space-y-5">
      {/* Profile Header */}
      <div className="bg-white border-2 border-b-4 border-[#e5e5e5] p-5 rounded-3xl text-center relative space-y-3">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-amber-50 border-3 border-[#58cc02] mx-auto shadow-md relative">
            <Image
              src="/turpi.png"
              alt="Avatar del Usuario"
              fill
              className="object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 bg-[#58cc02] text-white p-1 rounded-full border-2 border-white">
            <CheckCircle2 className="w-4 h-4 fill-current" />
          </span>
        </div>

        <div>
          <h2 className="text-xl font-black text-[#1b1c1c] tracking-tight">
            {store.name}
          </h2>
          <span className="text-xs font-bold text-[#777777] block mt-0.5">
            Academia Resuelve AI • Estudiante Activo 🇻🇪
          </span>
          {store.isPro && (
            <span className="inline-block mt-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              MEMBRESÍA PRO ACTIVA
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#efeded]">
          <div className="p-2 bg-neutral-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-[#ff9600]">
              <Flame className="w-4 h-4 fill-current" />
              <span className="text-base font-black text-[#1b1c1c]">
                {store.streak}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#777777] uppercase block mt-0.5">
              Días Racha
            </span>
          </div>

          <div className="p-2 bg-neutral-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-[#58cc02]">
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-base font-black text-[#1b1c1c]">
                {store.xp}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#777777] uppercase block mt-0.5">
              Total XP
            </span>
          </div>

          <div className="p-2 bg-neutral-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-[#1cb0f6]">
              <BookOpen className="w-4 h-4" />
              <span className="text-base font-black text-[#1b1c1c]">
                {store.completedLessons.length}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#777777] uppercase block mt-0.5">
              Lecciones
            </span>
          </div>
        </div>
      </div>

      {/* Diplomas & Official Certificate Preview */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-5 rounded-3xl shadow-lg border-b-4 border-teal-950 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
              CERTIFICACIÓN OFICIAL 🎓
            </span>
            <h3 className="text-lg font-black mt-1">
              Certificado en Fundamentos de IA
            </h3>
            <p className="text-xs text-emerald-100 font-semibold mt-0.5">
              Avalado por la Academia Resuelve AI con código de verificación.
            </p>
          </div>
          <Award className="w-10 h-10 text-amber-300 flex-shrink-0" />
        </div>

        <button
          onClick={() => setShowCertificate(!showCertificate)}
          className="w-full bg-white text-emerald-900 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Award className="w-4 h-4" />
          <span>{showCertificate ? "OCULTAR DIPLOMA" : "VER MI DIPLOMA OFICIAL"}</span>
        </button>

        {showCertificate && (
          <div className="bg-white text-[#1b1c1c] p-5 rounded-2xl border-4 border-amber-300/80 shadow-inner space-y-3 text-center animate-in zoom-in-95 duration-200">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#58cc02]">
              REPÚBLICA BOLIVARIANA DE VENEZUELA
            </span>
            <h4 className="text-base font-black text-[#1b1c1c]">
              ACADEMIA RESUELVE AI
            </h4>
            <p className="text-xs text-[#777777] italic">
              Otorga el presente reconocimiento a:
            </p>
            <div className="text-lg font-black text-[#006590] border-b-2 border-neutral-300 pb-1 max-w-xs mx-auto">
              {store.name}
            </div>
            <p className="text-[11px] text-[#4b4b4b] leading-relaxed">
              Por haber completado con excelencia los módulos prácticos de{" "}
              <strong>Ingeniería de Prompts y Solución de Problemas con IA</strong>.
            </p>
            <div className="flex items-center justify-between text-[9px] text-[#777777] font-mono border-t pt-2">
              <span>ID: VE-RAI-2026-9812</span>
              <span>VERIFICADO POR RESUELVE ENGINE</span>
            </div>
          </div>
        )}
      </div>

      {/* Badges Stack */}
      <div className="space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#777777] block">
          Medallas y Logros Obtenidos
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-start gap-1.5 ${
                b.unlocked
                  ? "bg-white border-[#e5e5e5] border-b-4 text-[#1b1c1c]"
                  : "bg-neutral-100/70 border-neutral-200 opacity-60 text-[#777777]"
              }`}
            >
              <div className="text-2xl">{b.icon}</div>
              <div>
                <span className="text-xs font-black leading-tight block">
                  {b.title}
                </span>
                <span className="text-[10px] text-[#777777] font-semibold leading-tight block mt-0.5">
                  {b.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Replay Onboarding Button */}
      <div className="pt-2 text-center">
        <button
          onClick={() => store.resetOnboarding()}
          className="text-xs font-bold text-[#777777] hover:text-[#1b1c1c] underline underline-offset-4 py-2 transition-colors"
        >
          Volver a ver el Tutorial de Inicio (Paso a Paso)
        </button>
      </div>
    </div>
  );
}
