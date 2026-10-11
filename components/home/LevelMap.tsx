"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Check, Lock, Play, Award, Zap, Wand2, Sparkles, Lightbulb } from "lucide-react";
import { useUserStore } from "@/lib/store";
import { LESSONS, Lesson, PATHS } from "@/lib/data/lessonsData";
import AnimatedTurpi from "@/components/mascot/AnimatedTurpi";
import TurpiVideoAvatar from "@/components/mascot/TurpiVideoAvatar";
import PromptSeasoner from "@/components/tools/PromptSeasoner";

interface LevelMapProps {
  onStartLesson: (lesson: Lesson) => void;
  onOpenRadar?: () => void;
}

export default function LevelMap({ onStartLesson, onOpenRadar }: LevelMapProps) {
  const store = useUserStore();
  const [showSeasoner, setShowSeasoner] = useState(false);

  const currentPathLessons = LESSONS.filter(
    (lesson) => lesson.pathId === store.activePath
  );

  const activePathInfo =
    PATHS.find((p) => p.id === store.activePath) || PATHS[0];

  const offsets = [0, -38, 38, -25, 25, 0];

  return (
    <div className="pb-24 pt-3 max-w-xl mx-auto px-4 space-y-5">
      {/* Unit Header Card */}
      <div className="bg-gradient-to-r from-[#58cc02] to-[#2b6c00] text-white p-4 rounded-3xl shadow-md border-b-4 border-[#1f5100] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-100">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Nivel 1 • {activePathInfo.title}</span>
          </div>
          <h2 className="text-lg font-black mt-0.5 tracking-tight">
            Fundamentos del Prompting en Venezuela
          </h2>
          <p className="text-xs text-emerald-50/90 font-semibold mt-0.5">
            Domina las instrucciones directas para Gemini y ChatGPT
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur-xs p-2.5 rounded-2xl flex-shrink-0">
          <Award className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Mascot Animated Card */}
      <div className="bg-white border-2 border-b-4 border-[#e5e5e5] p-4 rounded-3xl shadow-xs flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#ff9600] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            TURPI GUÍA OFICIAL 🇻🇪
          </span>
          <h3 className="text-sm font-black text-[#1b1c1c] mt-1 leading-snug">
            ¡Hola, {store.name}!
          </h3>
          <p className="text-xs text-[#777777] font-semibold mt-0.5 leading-snug">
            Cada lección dura 3 minutos. Toca a Turpi para escuchar sus consejos o toca el nodo iluminado para resolver.
          </p>

          <button
            onClick={() => setShowSeasoner(!showSeasoner)}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-black text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-colors shadow-2xs"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-600" />
            <span>{showSeasoner ? "Ocultar Sazonador" : "Probar Sazonador Mágico 🪄"}</span>
          </button>
        </div>

        <div className="flex-shrink-0">
          <TurpiVideoAvatar size="md" className="border-3 border-amber-300 shadow-md" />
        </div>
      </div>

      {/* Embedded Prompt Seasoner if toggled */}
      {showSeasoner && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <PromptSeasoner />
        </div>
      )}

      {/* Radar de Problemas Interactive Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#1b1c1c] text-white p-4 rounded-3xl shadow-lg border-2 border-purple-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/30 w-fit">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>RADAR DE PROBLEMAS • TURPI TE RESUELVE</span>
            </div>
            <h3 className="text-sm font-black tracking-tight text-white">
              ¿Tienes una tarea o problema difícil hoy?
            </h3>
            <p className="text-xs text-purple-200/90 font-medium leading-snug">
              Cuéntaselo a Turpi y te generará el prompt maestro exacto al instante.
            </p>
          </div>
          {onOpenRadar && (
            <button
              onClick={onOpenRadar}
              className="btn-3d-purple px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 shadow-md whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>ABRIR RADAR 💡</span>
            </button>
          )}
        </div>
      </div>

      {/* The Winding Path */}
      <div className="py-4 flex flex-col items-center space-y-7 relative">
        {currentPathLessons.map((lesson, index) => {
          const isCompleted = store.completedLessons.includes(lesson.id);
          const prevCompleted =
            index === 0 ||
            store.completedLessons.includes(currentPathLessons[index - 1].id);
          const isActive = !isCompleted && prevCompleted;
          const isLocked = !isCompleted && !isActive;

          const xOffset = offsets[index % offsets.length];

          return (
            <div
              key={lesson.id}
              style={{ transform: `translateX(${xOffset}px)` }}
              className="flex flex-col items-center relative group transition-transform"
            >
              {/* Turpi Avatar Callout pointing to the Active Node */}
              {isActive && (
                <div className="absolute -top-12 z-20 flex flex-col items-center animate-bounce">
                  <div className="bg-white border-2 border-b-3 border-[#58cc02] px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 text-[11px] font-black text-[#58cc02] whitespace-nowrap">
                    <span>¡EMPIEZA AQUÍ!</span>
                  </div>
                  <div className="w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-[#58cc02] transform rotate-45 -mt-1.5" />
                </div>
              )}

              {/* Interactive Node Button */}
              <button
                disabled={isLocked}
                onClick={() => onStartLesson(lesson)}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all select-none ${
                  isCompleted
                    ? "bg-[#58cc02] border-b-6 border-[#46a302] text-white hover:brightness-105 active:translate-y-1 active:border-b-2"
                    : isActive
                    ? "bg-[#1cb0f6] border-b-6 border-[#1899d6] text-white ring-8 ring-sky-100 hover:brightness-105 active:translate-y-1 active:border-b-2"
                    : "bg-[#e5e5e5] border-b-6 border-[#afafaf] text-[#a0a0a0] cursor-not-allowed"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-8 h-8 stroke-[3.5px]" />
                ) : isActive ? (
                  <Play className="w-8 h-8 fill-current ml-1" />
                ) : (
                  <Lock className="w-7 h-7 stroke-[2.5px]" />
                )}

                {/* Star Accent Badge */}
                {isCompleted && (
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white rounded-full p-1 border-2 border-white shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                )}
              </button>

              {/* Title label underneath */}
              <div className="mt-2 text-center max-w-[150px]">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1b1c1c] block truncate">
                  {lesson.title.split(":")[0]}
                </span>
                <span className="text-[10px] text-[#777777] font-bold block truncate">
                  {lesson.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
