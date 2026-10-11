"use client";

import { useState } from "react";
import { Swords, Flame, Trophy, Award, Sparkles, ArrowRight } from "lucide-react";
import { useUserStore } from "@/lib/store";
import { LESSONS, Lesson } from "@/lib/data/lessonsData";

interface ArenaTabProps {
  onStartLesson: (lesson: Lesson) => void;
}

export default function ArenaTab({ onStartLesson }: ArenaTabProps) {
  const store = useUserStore();

  const battleLessons = LESSONS.filter((l) => l.type === "battle");

  const LEADERBOARD = [
    { rank: 1, name: "María Alejandra", city: "Caracas 🇻🇪", xp: 1420, avatar: "👩‍💼" },
    { rank: 2, name: "Carlos Eduardo", city: "Valencia 🇻🇪", xp: 1290, avatar: "👨‍💻" },
    { rank: 3, name: "Tú", city: "Venezuela 🇻🇪", xp: store.xp, avatar: "🚀", isCurrent: true },
    { rank: 4, name: "Daniela R.", city: "Maracaibo 🇻🇪", xp: 820, avatar: "👩‍🔬" },
    { rank: 5, name: "José Miguel", city: "Barquisimeto 🇻🇪", xp: 640, avatar: "👨‍🏫" },
  ];

  return (
    <div className="pb-24 pt-3 max-w-xl mx-auto px-4 space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#ff9600] to-[#cc7800] text-white p-4 rounded-3xl shadow-md border-b-4 border-[#995a00] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-100">
            <Swords className="w-4 h-4" />
            <span>Arena de Retos Diarios</span>
          </div>
          <h2 className="text-xl font-black mt-0.5 tracking-tight">
            Batalla de Prompts
          </h2>
          <p className="text-xs text-amber-50 font-semibold mt-0.5">
            Compara prompts y escala en la liga de inteligencia artificial
          </p>
        </div>
        <div className="bg-white/20 p-2.5 rounded-2xl flex-shrink-0">
          <Trophy className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Available Daily Battles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#777777]">
            Duelos de Práctica Disponibles
          </span>
          <span className="text-[11px] font-bold text-[#ff9600] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            +{battleLessons.length * 35} XP Posibles
          </span>
        </div>

        <div className="space-y-2.5">
          {battleLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white border-2 border-b-4 border-[#e5e5e5] p-4 rounded-2xl flex items-center justify-between gap-3 hover:border-neutral-300 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-[#ff9600] border border-amber-200 px-2 py-0.5 rounded-md">
                    DUELO
                  </span>
                  <span className="text-xs font-black text-[#58cc02]">
                    +{lesson.xpReward} XP
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-[#1b1c1c] truncate">
                  {lesson.title}
                </h4>
                <p className="text-xs text-[#777777] font-semibold truncate mt-0.5">
                  {lesson.subtitle}
                </p>
              </div>

              <button
                onClick={() => onStartLesson(lesson)}
                className="btn-3d-orange px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 flex-shrink-0"
              >
                <span>RETAR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Venezuelan Prompt Leaderboard */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-black uppercase tracking-wider text-[#777777] block">
          Tabla de Clasificación Nacional 🇻🇪
        </span>

        <div className="bg-white border-2 border-b-4 border-[#e5e5e5] rounded-2xl overflow-hidden divide-y divide-[#efeded]">
          {LEADERBOARD.map((item) => (
            <div
              key={item.name}
              className={`p-3 flex items-center justify-between gap-3 ${
                item.isCurrent ? "bg-amber-50/70" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 text-center text-xs font-black ${
                    item.rank === 1
                      ? "text-amber-500 text-sm"
                      : item.rank === 2
                      ? "text-neutral-400 text-sm"
                      : item.rank === 3
                      ? "text-amber-700 text-sm"
                      : "text-[#777777]"
                  }`}
                >
                  {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : `#${item.rank}`}
                </span>
                <span className="text-lg">{item.avatar}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#1b1c1c]">
                      {item.name}
                    </span>
                    {item.isCurrent && (
                      <span className="text-[10px] bg-[#58cc02] text-white font-black px-1.5 rounded-md">
                        TÚ
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#777777] font-semibold block">
                    {item.city}
                  </span>
                </div>
              </div>

              <span className="text-xs font-black text-[#ff9600]">
                {item.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
