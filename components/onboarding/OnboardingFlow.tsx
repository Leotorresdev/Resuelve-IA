"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Briefcase,
  TrendingUp,
  GraduationCap,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Flame,
  Battery,
  ShieldCheck,
} from "lucide-react";
import { useUserStore, UserGoal } from "@/lib/store";
import AnimatedTurpi from "@/components/mascot/AnimatedTurpi";
import TurpiVideoAvatar from "@/components/mascot/TurpiVideoAvatar";
import { sounds } from "@/lib/soundEffects";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const store = useUserStore();

  const [step, setStep] = useState<number>(1);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal>("trabajo");
  const [trialAnswered, setTrialAnswered] = useState<boolean>(false);
  const [trialSelectedOption, setTrialSelectedOption] = useState<"A" | "B" | null>(null);

  const totalSteps = 3;

  const GOALS = [
    {
      id: "trabajo" as const,
      icon: Briefcase,
      title: "Ahorrar tiempo en mi trabajo",
      desc: "Redactar correos formales, reportes y automatizar tareas repetitivas.",
      badge: "Más Rápido ⚡",
      accent: "border-blue-400 bg-blue-50/60 text-blue-900",
    },
    {
      id: "negocios" as const,
      icon: TrendingUp,
      title: "Vender más en mi negocio",
      desc: "Cerrar ventas por WhatsApp, responder objeciones y crear ofertas flash.",
      badge: "Popular 🛍️",
      accent: "border-emerald-400 bg-emerald-50/60 text-emerald-900",
    },
    {
      id: "estudio" as const,
      icon: GraduationCap,
      title: "Estudiar e investigar más rápido",
      desc: "Entender fórmulas y materias difíciles con analogías cotidianas.",
      badge: "Estudiantes 🎓",
      accent: "border-amber-400 bg-amber-50/60 text-amber-900",
    },
    {
      id: "redes" as const,
      icon: Smartphone,
      title: "Crear contenido para redes sociales",
      desc: "Ganchos virales para TikTok, copies para Instagram y guiones de video.",
      badge: "Creadores 📱",
      accent: "border-purple-400 bg-purple-50/60 text-purple-900",
    },
  ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#58cc02", "#1cb0f6", "#ff9600", "#ffc800"],
    });
  };

  const handleTrialOption = (option: "A" | "B") => {
    setTrialSelectedOption(option);
    if (option === "B") {
      sounds.playCorrect();
      setTrialAnswered(true);
      triggerConfetti();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleFinish = () => {
    sounds.playCelebration();
    triggerConfetti();
    store.finishOnboarding({
      goal: selectedGoal,
    });
    onComplete();
  };

  const currentGoalInfo = GOALS.find((g) => g.id === selectedGoal) || GOALS[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#fbf9f8] flex flex-col justify-between overflow-y-auto select-none">
      {/* Top Progress Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-[#e5e5e5] px-4 py-3 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex-1 bg-[#efeded] h-3 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="bg-[#58cc02] h-full rounded-full"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs font-black text-[#777777]">
            Paso {step} de {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Step Body */}
      <div className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center my-auto">
        <AnimatePresence mode="wait">
          {/* PASO 1: SELECCIÓN DE OBJETIVO */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4 text-center"
            >
              <div className="flex flex-col items-center justify-center mb-1">
                <TurpiVideoAvatar size="md" className="border-3 border-amber-300 shadow-lg" />
                <div className="mt-2.5 bg-white border-2 border-b-3 border-[#58cc02] px-3.5 py-1.5 rounded-2xl shadow-xs text-xs font-bold text-[#1b1c1c] text-center max-w-xs">
                  <span className="text-[#58cc02] font-black uppercase text-[10px] block">
                    ¡HOLA! SOY TURPI 🇻🇪
                  </span>
                  Te enseñaré a sacarle el jugo a la IA en 3 minutos al día.
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1b1c1c] tracking-tight">
                  ¿Para qué quieres usar la IA hoy?
                </h2>
                <p className="text-xs text-[#777777] font-semibold mt-0.5">
                  Personalizaremos tus ejercicios para tu meta principal
                </p>
              </div>

              <div className="space-y-2.5 text-left pt-1">
                {GOALS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedGoal === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setSelectedGoal(item.id);
                      }}
                      className={`w-full p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${
                        isSelected
                          ? `border-[#58cc02] border-b-4 bg-emerald-50/70 shadow-xs scale-[1.01]`
                          : "border-[#e5e5e5] border-b-4 bg-white hover:border-neutral-300 active:scale-98"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-xl border ${
                            isSelected
                              ? "bg-[#58cc02] text-white border-[#46a302]"
                              : "bg-neutral-100 text-[#4b4b4b] border-neutral-200"
                          }`}
                        >
                          <Icon className="w-5 h-5 stroke-[2.2px]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-black text-[#1b1c1c]">
                              {item.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#777777] font-semibold line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-[#4b4b4b] border border-neutral-200">
                          {item.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* PASO 2: MICRO-RETO INSTANTÁNEO DE 1 MINUTO */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4 text-center"
            >
              <div className="flex justify-center mb-1">
                <AnimatedTurpi
                  mood={trialAnswered ? "celebrating" : "teaching"}
                  size="md"
                  speech={
                    trialAnswered
                      ? "¡Exacto! Un prompt con los 4 ingredientes le da superpoderes a la IA."
                      : "La IA no es un buscador, es un asistente. ¿Cuál prompt dará un mejor resultado?"
                  }
                />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1cb0f6] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                  RETO EXPRESS • 1 MINUTO
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#1b1c1c] mt-1.5">
                  Detecta el Prompt Maestro
                </h2>
                <p className="text-xs text-[#777777] font-semibold mt-0.5">
                  Toca la opción que le da instrucciones claras a ChatGPT o Gemini
                </p>
              </div>

              <div className="space-y-3 text-left pt-1">
                {/* Opción A */}
                <button
                  type="button"
                  onClick={() => handleTrialOption("A")}
                  className={`w-full p-3.5 rounded-2xl border-2 transition-all text-xs font-bold ${
                    trialSelectedOption === "A" && !trialAnswered
                      ? "border-rose-400 bg-rose-50 text-rose-900 border-b-4"
                      : "border-[#e5e5e5] border-b-4 bg-white text-[#4b4b4b] hover:border-neutral-300"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase block text-[#777777] mb-1">
                    OPCIÓN A:
                  </span>
                  ❌ "Escribe algo para vender en WhatsApp y que la gente me compre rápido."
                  {trialSelectedOption === "A" && (
                    <span className="text-[11px] text-rose-600 block mt-1 font-extrabold">
                      Demasiado vago. La IA no sabe qué vendes, a qué precio ni con qué tono.
                    </span>
                  )}
                </button>

                {/* Opción B */}
                <button
                  type="button"
                  onClick={() => handleTrialOption("B")}
                  className={`w-full p-3.5 rounded-2xl border-2 transition-all text-xs font-bold ${
                    trialAnswered
                      ? "border-[#58cc02] border-b-4 bg-emerald-50 text-[#166534] shadow-md"
                      : "border-[#e5e5e5] border-b-4 bg-white text-[#1b1c1c] hover:border-emerald-300"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase block text-[#58cc02] mb-1">
                    OPCIÓN B:
                  </span>
                  ✅ "Actúa como un asesor comercial. Redacta un mensaje para WhatsApp de 4 líneas con gancho directo, precio visible y llamado a la acción con datos de pago."
                </button>
              </div>

              {trialAnswered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-2xl text-xs font-black text-emerald-900 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 fill-current" />
                  <span>¡Acabas de ganar tus primeros +25 XP y 1 Día de Racha!</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PASO 3: CONFIRMACIÓN Y ENTRADA DIRECTA (SIN REGISTRO OBLIGATORIO) */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4 text-center"
            >
              <div className="flex justify-center mb-1">
                <AnimatedTurpi
                  mood="celebrating"
                  size="lg"
                  speech="¡Todo listo! Tu ruta personalizada está creada y tienes 5 baterías listas."
                />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#58cc02] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  ¡BIENVENIDO A BORDO!
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#1b1c1c] mt-1.5 tracking-tight">
                  Tu Ruta: {currentGoalInfo.title}
                </h2>
                <p className="text-xs text-[#777777] font-semibold mt-0.5">
                  Micro-lecciones de 3 minutos adaptadas para ti. Aprende jugando.
                </p>
              </div>

              {/* Startup Inventory Cards */}
              <div className="bg-white border-2 border-b-4 border-[#e5e5e5] p-4 rounded-2xl space-y-2.5 text-left">
                <div className="flex items-center justify-between text-xs font-black">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#ff9600] fill-current" />
                    <span className="text-[#1b1c1c]">Racha Activa:</span>
                  </div>
                  <span className="text-[#ff9600]">1 Día Consecutivo</span>
                </div>

                <div className="flex items-center justify-between text-xs font-black border-t border-[#efeded] pt-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#1cb0f6] fill-current" />
                    <span className="text-[#1b1c1c]">Puntos Iniciales:</span>
                  </div>
                  <span className="text-[#1cb0f6]">25 XP</span>
                </div>

                <div className="flex items-center justify-between text-xs font-black border-t border-[#efeded] pt-2">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-[#58cc02] fill-current" />
                    <span className="text-[#1b1c1c]">Baterías Diarias:</span>
                  </div>
                  <span className="text-[#58cc02]">5 / 5 Disponibles</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full btn-3d-green py-4 rounded-2xl text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>ENTRAR AL MAPA DE LECCIONES</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#777777] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#58cc02]" />
                <span>Sin registros complicados. Juega y aprende al instante.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Action Footer */}
      {step < 3 && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t-2 border-[#e5e5e5] p-4">
          <div className="max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              disabled={step === 2 && !trialAnswered}
              className={`w-full py-4 rounded-2xl text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md ${
                step === 2 && !trialAnswered
                  ? "bg-[#e5e5e5] text-[#a0a0a0] cursor-not-allowed border-b-4 border-[#afafaf]"
                  : "btn-3d-green"
              }`}
            >
              <span>{step === 2 ? "¡CONTINUAR!" : "CONTINUAR"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
