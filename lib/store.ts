"use client";

import { useState, useEffect } from "react";
import { Bounty, BountyCategory, WalletTransaction, SEED_BOUNTIES } from "@/lib/data/bountiesData";

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
  // Billetera & Misiones
  tokenBalance: number; // 1 Token = $1.00 USD para publicar tareas
  earningsUsd: number; // Saldo ganado por resolver ($0.30/tarea)
  platformRevenueUsd: number; // Comisión acumulada de Resuelve IA ($0.70/tarea)
  bounties: Bounty[];
  myPostedBountyIds: string[];
  mySolvedBountyIds: string[];
  transactions: WalletTransaction[];
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
  // Billetera inicial: 2 tokens de cortesía para pruebas inmediatas
  tokenBalance: 2,
  earningsUsd: 0.0,
  platformRevenueUsd: 0.0,
  bounties: SEED_BOUNTIES,
  myPostedBountyIds: [],
  mySolvedBountyIds: [],
  transactions: [
    {
      id: "tx-welcome-tokens",
      type: "token_purchase",
      amountTokens: 2,
      amountUsd: 2.0,
      description: "Tokens de bienvenida para publicar tu primer trabajo 🎓",
      date: new Date().toISOString(),
      status: "completed",
    },
  ],
};

const STORAGE_KEY = "resuelve_ai_state_v4";

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

  // Wallet & Tokens Actions
  const addTokens = (amount: number, description: string = "Compra de Tokens", paymentTxId?: string) => {
    const tx: WalletTransaction = {
      id: paymentTxId || `tx_${Date.now()}`,
      type: "token_purchase",
      amountTokens: amount,
      amountUsd: amount,
      description,
      date: new Date().toISOString(),
      status: "completed",
    };
    globalState = {
      ...globalState,
      tokenBalance: (globalState.tokenBalance || 0) + amount,
      transactions: [tx, ...(globalState.transactions || [])],
    };
    notify();
  };

  const postBounty = (data: {
    title: string;
    category: BountyCategory;
    categoryLabel?: string;
    description: string;
    requirements: string[];
    expectedFormat: string;
    authorName?: string;
    authorRole?: string;
    paymentMethod: "token" | "card";
  }): { success: boolean; bountyId: string } => {
    const newId = `bounty_${Date.now()}`;
    const categoryLabels: Record<BountyCategory, string> = {
      liceo: "🎓 Liceo / Bachillerato",
      universidad: "🏛️ Universidad",
      trabajo: "💼 Trabajo / Oficina",
      negocio: "🚀 Negocio / Ventas",
    };

    const newBounty: Bounty = {
      id: newId,
      title: data.title.trim(),
      category: data.category,
      categoryLabel: data.categoryLabel || categoryLabels[data.category] || "Tarea",
      authorName: data.authorName?.trim() || globalState.name || "Tú (Estudiante)",
      authorRole: data.authorRole?.trim() || "Estudiante",
      description: data.description.trim(),
      requirements: data.requirements,
      expectedFormat: data.expectedFormat,
      rewardUsd: 0.30,
      priceUsd: 1.00,
      platformFeeUsd: 0.70,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    const tx: WalletTransaction = {
      id: `tx_post_${Date.now()}`,
      type: data.paymentMethod === "card" ? "direct_payment" : "task_posted",
      amountTokens: data.paymentMethod === "token" ? 1 : 0,
      amountUsd: 1.00,
      description: `Publicación de tarea: "${data.title.substring(0, 32)}..."`,
      date: new Date().toISOString(),
      status: "completed",
    };

    const nextTokens = data.paymentMethod === "token"
      ? Math.max(0, (globalState.tokenBalance || 0) - 1)
      : (globalState.tokenBalance || 0);

    globalState = {
      ...globalState,
      tokenBalance: nextTokens,
      bounties: [newBounty, ...(globalState.bounties || [])],
      myPostedBountyIds: [newId, ...(globalState.myPostedBountyIds || [])],
      transactions: [tx, ...(globalState.transactions || [])],
    };
    notify();

    return { success: true, bountyId: newId };
  };

  const completeBountySolve = (
    bountyId: string,
    solverPrompt: string,
    deliverable: string,
    score: number
  ): { success: boolean; rewardUsd: number; xp: number } => {
    const rewardUsd = 0.30;
    const platformFeeUsd = 0.70;
    const xpReward = 50;

    const updatedBounties = (globalState.bounties || []).map((b) => {
      if (b.id === bountyId) {
        return {
          ...b,
          status: "solved" as const,
          solverPrompt,
          generatedDeliverable: deliverable,
          solvedAt: new Date().toISOString(),
          solverName: globalState.name || "Solucionador Pro",
          score,
        };
      }
      return b;
    });

    const earningTx: WalletTransaction = {
      id: `tx_earn_${Date.now()}`,
      type: "task_solved_earning",
      amountUsd: rewardUsd,
      description: `Recompensa por resolver tarea: +$0.30 USD (+50 XP)`,
      date: new Date().toISOString(),
      status: "completed",
    };

    globalState = {
      ...globalState,
      bounties: updatedBounties,
      earningsUsd: Number(((globalState.earningsUsd || 0) + rewardUsd).toFixed(2)),
      platformRevenueUsd: Number(((globalState.platformRevenueUsd || 0) + platformFeeUsd).toFixed(2)),
      xp: (globalState.xp || 0) + xpReward,
      mySolvedBountyIds: [bountyId, ...(globalState.mySolvedBountyIds || [])],
      transactions: [earningTx, ...(globalState.transactions || [])],
    };
    notify();

    return { success: true, rewardUsd, xp: xpReward };
  };

  const redeemEarnings = (
    amountUsd: number,
    method: "tokens" | "payout",
    destination?: string
  ): { success: boolean; message: string } => {
    if ((globalState.earningsUsd || 0) < amountUsd) {
      return { success: false, message: "Saldo insuficiente para esta operación." };
    }

    if (method === "tokens") {
      const tokensToAdd = Math.floor(amountUsd);
      const nextEarnings = Number(((globalState.earningsUsd || 0) - tokensToAdd).toFixed(2));
      const tx: WalletTransaction = {
        id: `tx_redeem_${Date.now()}`,
        type: "token_purchase",
        amountTokens: tokensToAdd,
        amountUsd: tokensToAdd,
        description: `Canje de ganancias a Tokens (${tokensToAdd} Tokens)`,
        date: new Date().toISOString(),
        status: "completed",
      };

      globalState = {
        ...globalState,
        earningsUsd: nextEarnings,
        tokenBalance: (globalState.tokenBalance || 0) + tokensToAdd,
        transactions: [tx, ...(globalState.transactions || [])],
      };
      notify();
      return { success: true, message: `¡Canjeaste exitosamente $${tokensToAdd} USD por ${tokensToAdd} Tokens!` };
    } else {
      const nextEarnings = Number(((globalState.earningsUsd || 0) - amountUsd).toFixed(2));
      const tx: WalletTransaction = {
        id: `tx_payout_${Date.now()}`,
        type: "payout_request",
        amountUsd: amountUsd,
        description: `Solicitud de retiro a ${destination || "cuenta bancaria / billetera"}`,
        date: new Date().toISOString(),
        status: "pending",
      };

      globalState = {
        ...globalState,
        earningsUsd: nextEarnings,
        transactions: [tx, ...(globalState.transactions || [])],
      };
      notify();
      return { success: true, message: `¡Solicitud de retiro por $${amountUsd.toFixed(2)} USD enviada! Procesando en 24 horas.` };
    }
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
    addTokens,
    postBounty,
    completeBountySolve,
    redeemEarnings,
  };
}
