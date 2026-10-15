"use client";

import { useState, useEffect } from "react";

export type LearningPath = "negocios" | "estudio" | "diario";
export type UserPersona = "liceo" | "comercio" | "oficio" | "ciudadano";
export type UserGoal = "trabajo" | "negocios" | "estudio" | "redes";

export interface UserState {
  name: string;
  phoneOrEmail: string;
  isOnboarded: boolean;
  selectedGoal: UserGoal;
  userPersona: UserPersona;
  experienceLevel: "novato" | "intermedio" | "avanzado";
  dailyGoalMinutes: number;
  streak: number;
  gems: number;
  batteries: number;
  maxBatteries: number;
  hearts: number; // synced alias for batteries
  maxHearts: number;
  xp: number;
  isPro: boolean;
  activePath: LearningPath;
  completedLessons: string[];
  unlockedPrompts: string[];
  lastActiveDate: string;
  isAuthRegistered: boolean;
  hasShownPostLesson1Modal: boolean;
}

const DEFAULT_STATE: UserState = {
  name: "Estudiante",
  phoneOrEmail: "",
  isOnboarded: false,
  selectedGoal: "trabajo",
  userPersona: "liceo",
  experienceLevel: "novato",
  dailyGoalMinutes: 5,
  streak: 1,
  gems: 100,
  batteries: 5,
  maxBatteries: 5,
  hearts: 5,
  maxHearts: 5,
  xp: 0,
  isPro: false,
  activePath: "negocios",
  completedLessons: [],
  unlockedPrompts: ["prompt-base-rtcf"],
  lastActiveDate: new Date().toISOString().split("T")[0],
  isAuthRegistered: false,
  hasShownPostLesson1Modal: false,
};

const STORAGE_KEY = "resuelve_ai_state_v3";

function checkDailyRefresh(state: UserState): UserState {
  const today = new Date().toISOString().split("T")[0];
  if (!state.lastActiveDate || state.lastActiveDate === today) {
    return state;
  }

  // Calculate day difference
  const lastDate = new Date(state.lastActiveDate);
  const currDate = new Date(today);
  const diffTime = currDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  let newStreak = state.streak;
  if (diffDays > 1) {
    // Missed more than 1 day
    newStreak = 1;
  }

  return {
    ...state,
    streak: newStreak,
    batteries: state.maxBatteries || 5,
    hearts: state.maxHearts || 5,
    lastActiveDate: today,
  };
}

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
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("resuelve_ai_state_v2");
        if (saved) {
          const parsed = JSON.parse(saved);
          const merged = { ...DEFAULT_STATE, ...parsed };
          globalState = checkDailyRefresh(merged);
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
    goal?: UserGoal;
    userPersona?: UserPersona;
    name?: string;
    phoneOrEmail?: string;
    experienceLevel?: "novato" | "intermedio" | "avanzado";
    dailyGoalMinutes?: number;
  }) => {
    const goal: UserGoal = data.goal || "trabajo";
    let chosenPath: LearningPath = "negocios";
    if (goal === "estudio") chosenPath = "estudio";
    else if (goal === "trabajo") chosenPath = "diario";
    else if (goal === "negocios" || goal === "redes") chosenPath = "negocios";

    globalState = {
      ...globalState,
      name: data.name?.trim() || globalState.name || "Estudiante",
      phoneOrEmail: data.phoneOrEmail?.trim() || "",
      selectedGoal: goal,
      userPersona: data.userPersona || (goal === "estudio" ? "liceo" : "comercio"),
      experienceLevel: data.experienceLevel || "novato",
      dailyGoalMinutes: data.dailyGoalMinutes || 5,
      activePath: chosenPath,
      isOnboarded: true,
      streak: 1,
      xp: Math.max(globalState.xp, 25), // First 25 XP awarded
      gems: Math.max(globalState.gems, 120),
      batteries: 5,
      hearts: 5,
      lastActiveDate: new Date().toISOString().split("T")[0],
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

  const completeLesson = (
    lessonId: string,
    xpEarned: number,
    gemsEarned: number,
    unlockedPromptId?: string
  ) => {
    const isNew = !globalState.completedLessons.includes(lessonId);
    const newCompleted = isNew
      ? [...globalState.completedLessons, lessonId]
      : globalState.completedLessons;

    const newUnlocked =
      unlockedPromptId && !globalState.unlockedPrompts.includes(unlockedPromptId)
        ? [...globalState.unlockedPrompts, unlockedPromptId]
        : globalState.unlockedPrompts;

    globalState = {
      ...globalState,
      xp: globalState.xp + xpEarned,
      gems: globalState.gems + (isNew ? gemsEarned : Math.floor(gemsEarned / 2)),
      completedLessons: newCompleted,
      unlockedPrompts: newUnlocked,
      lastActiveDate: new Date().toISOString().split("T")[0],
    };
    notify();
  };

  const consumeBattery = (): boolean => {
    if (globalState.isPro) return true;
    if (globalState.batteries <= 0) return false;
    const nextBatteries = Math.max(0, globalState.batteries - 1);
    globalState = {
      ...globalState,
      batteries: nextBatteries,
      hearts: nextBatteries,
    };
    notify();
    return true;
  };

  const loseHeart = () => {
    consumeBattery();
  };

  const refillBatteries = () => {
    globalState = {
      ...globalState,
      batteries: globalState.maxBatteries,
      hearts: globalState.maxHearts,
    };
    notify();
  };

  const refillHearts = () => {
    refillBatteries();
  };

  const buyHeartsWithGems = () => {
    if (globalState.gems >= 50) {
      globalState = {
        ...globalState,
        gems: globalState.gems - 50,
        batteries: globalState.maxBatteries,
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
      batteries: 999,
      maxBatteries: 999,
      hearts: 999,
      maxHearts: 999,
    };
    notify();
  };

  const unlockPrompt = (promptId: string) => {
    if (!globalState.unlockedPrompts.includes(promptId)) {
      globalState = {
        ...globalState,
        unlockedPrompts: [...globalState.unlockedPrompts, promptId],
      };
      notify();
    }
  };

  const saveUserAccount = (data: { name: string; emailOrPhone: string }) => {
    globalState = {
      ...globalState,
      name: data.name.trim() || globalState.name,
      phoneOrEmail: data.emailOrPhone.trim(),
      isAuthRegistered: true,
      hasShownPostLesson1Modal: true,
    };
    notify();
  };

  const setHasShownPostLesson1Modal = (shown: boolean) => {
    globalState = {
      ...globalState,
      hasShownPostLesson1Modal: shown,
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
    consumeBattery,
    loseHeart,
    refillBatteries,
    refillHearts,
    buyHeartsWithGems,
    upgradeToPro,
    unlockPrompt,
    saveUserAccount,
    setHasShownPostLesson1Modal,
    setActivePath,
  };
}
