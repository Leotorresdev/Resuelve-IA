"use client";

import { Map, Swords, FlaskConical, Award, ShoppingBag } from "lucide-react";

export type NavTab = "learn" | "arena" | "lab" | "profile" | "store";

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export default function BottomNav({ currentTab, onSelectTab }: BottomNavProps) {
  const tabs = [
    { id: "learn" as const, label: "Aprender", icon: Map },
    { id: "arena" as const, label: "Retos", icon: Swords },
    { id: "lab" as const, label: "Laboratorio", icon: FlaskConical },
    { id: "profile" as const, label: "Perfil", icon: Award },
    { id: "store" as const, label: "Tienda", icon: ShoppingBag },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#e5e5e5] pb-safe pt-1.5 transition-all">
      <div className="max-w-xl mx-auto flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all select-none ${
                isActive
                  ? "text-[#58cc02]"
                  : "text-[#777777] hover:text-[#1b1c1c] active:scale-95"
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-all ${
                  isActive ? "bg-emerald-50 scale-105" : ""
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                  }`}
                />
              </div>
              <span
                className={`text-[11px] font-black uppercase tracking-wider mt-0.5 ${
                  isActive ? "text-[#58cc02]" : "text-[#777777]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
