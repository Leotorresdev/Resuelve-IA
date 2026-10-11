"use client";

import { useState, useEffect } from "react";

export type LearningPath = "negocios" | "estudio" | "diario";
export type UserPersona = "liceo" | "comercio" | "oficio" | "ciudadano";

export interface UserState {
  name: string;
  phoneOrEmail: string;
  isOnboarded: boolean;
  userPersona: UserPersona;
  experienceLevel: "novato" | "intermedio" | "avanzado";
  dailyGoalMinutes: number;
  streak: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  xp: number;
  isPro: boolean;
  activePath: LearningPath;
  completedLessons: string[];
  lastActiveDate: string;
}

const DEFAULT_STATE: UserState = {
  name: "Estudiante",
  phoneOrEmail: "",
  isOnboarded: false, // Starts in onboarding like Duolingo!
  userPersona: "liceo",
  experienceLevel: "novato",
  dailyGoalMinutes: 5,
  streak: 1,
  gems: 100,
  hearts: 5,
  maxHearts: 5,
  xp: 0,
  isPro: false,
  activePath: "estudio",
  completedLessons: [],
  lastActiveDate: new Date().toISOString().split("T")[0],
};

const STORAGE_KEY = "resuelve_ai_state_v2";

let globalState: UserState = DEFAULT_STATE;
const listeners = new Set<(state: UserState) => void>();

function notify() {
  listeners.forEach((listener) => listener(globalState));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch {
      // Ignore quota errors
    }
  }
}

export function useUserStore() {
  const [state, setState] = useState<UserState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          globalState = { ...DEFAULT_STATE, ...JSON.parse(saved) };
          return globalState;
        }
      } catch {
        // fallback
      }
    }
    return globalState;
  });

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const finishOnboarding = (data: {
    name: string;
    phoneOrEmail: string;
    userPersona: UserPersona;
    experienceLevel: "novato" | "intermedio" | "avanzado";
    dailyGoalMinutes: number;
  }) => {
    let chosenPath: LearningPath = "estudio";
    if (data.userPersona === "comercio") chosenPath = "negocios";
    else if (data.userPersona === "oficio" || data.userPersona === "ciudadano")
      chosenPath = "diario";

    globalState = {
      ...globalState,
      name: data.name.trim() || "Estudiante",
      phoneOrEmail: data.phoneOrEmail.trim(),
      userPersona: data.userPersona,
      experienceLevel: data.experienceLevel,
      dailyGoalMinutes: data.dailyGoalMinutes,
      activePath: chosenPath,
      isOnboarded: true,
      streak: 1,
      xp: 25, // First bonus XP earned during micro-trial!
      gems: 120,
    };
    notify();
  };

  const resetOnboarding = () => {
    globalState = {
      ...globalState,
      isOnboarded: false,
    };
    notify();
  };

  const completeLesson = (lessonId: string, xpEarned: number, gemsEarned: number) => {
    const isNew = !globalState.completedLessons.includes(lessonId);
    globalState = {
      ...globalState,
      xp: globalState.xp + xpEarned,
      gems: globalState.gems + (isNew ? gemsEarned : Math.floor(gemsEarned / 2)),
      completedLessons: isNew
        ? [...globalState.completedLessons, lessonId]
        : globalState.completedLessons,
    };
    notify();
  };

  const loseHeart = () => {
    if (globalState.isPro) return;
    globalState = {
      ...globalState,
      hearts: Math.max(0, globalState.hearts - 1),
    };
    notify();
  };

  const refillHearts = () => {
    globalState = {
      ...globalState,
      hearts: globalState.maxHearts,
    };
    notify();
  };

  const buyHeartsWithGems = () => {
    if (globalState.gems >= 50) {
      globalState = {
        ...globalState,
        gems: globalState.gems - 50,
        hearts: globalState.maxHearts,
      };
      notify();
      return true;
    }
    return false;
  };

  const upgradeToPro = () => {
    globalState = {
      ...globalState,
      isPro: true,
      hearts: 999,
      maxHearts: 999,
    };
    notify();
  };

  const setActivePath = (path: LearningPath) => {
    globalState = {
      ...globalState,
      activePath: path,
    };
    notify();
  };

  return {
    ...state,
    finishOnboarding,
    resetOnboarding,
    completeLesson,
    loseHeart,
    refillHearts,
    buyHeartsWithGems,
    upgradeToPro,
    setActivePath,
  };
}
