"use client";

import { Check, X, Briefcase, GraduationCap, Home } from "lucide-react";
import { useUserStore, LearningPath } from "@/lib/store";
import { PATHS } from "@/lib/data/lessonsData";

interface PathSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PathSelector({ isOpen, onClose }: PathSelectorProps) {
  const store = useUserStore();

  if (!isOpen) return null;

  const iconMap = {
    Briefcase,
    GraduationCap,
    Home,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border-2 border-b-6 border-[#e5e5e5] rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#777777] hover:text-[#1b1c1c] p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <span className="text-xs font-black uppercase tracking-wider text-[#58cc02] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Rutas de Aprendizaje 🇻🇪
          </span>
          <h3 className="text-xl font-black text-[#1b1c1c] mt-2">
            ¿Qué quieres resolver hoy?
          </h3>
          <p className="text-xs text-[#777777] font-semibold mt-1">
            Cambia de ruta en cualquier momento sin perder tu progreso
          </p>
        </div>

        <div className="space-y-3">
          {PATHS.map((path) => {
            const isSelected = store.activePath === path.id;
            const Icon = iconMap[path.icon as keyof typeof iconMap] || Briefcase;

            return (
              <button
                key={path.id}
                onClick={() => {
                  store.setActivePath(path.id);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? "border-[#58cc02] border-b-4 bg-emerald-50/50"
                    : "border-[#e5e5e5] border-b-4 hover:border-neutral-300 bg-white"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl flex-shrink-0 ${
                    isSelected ? "bg-[#58cc02] text-white" : "bg-neutral-100 text-[#4b4b4b]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-sm text-[#1b1c1c]">
                      {path.title}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-black text-[#58cc02] bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                        <Check className="w-3 h-3 stroke-[3px]" /> Activa
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#777777] font-semibold mt-0.5 line-clamp-2">
                    {path.description}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    {path.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
