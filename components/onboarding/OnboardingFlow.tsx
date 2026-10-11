"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  GraduationCap,
  ShoppingBag,
  Wrench,
  Home,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Flame,
  ShieldCheck,
  Smartphone,
  Lock,
} from "lucide-react";
import { useUserStore, UserPersona } from "@/lib/store";
import AnimatedTurpi, { TurpiMood } from "@/components/mascot/AnimatedTurpi";
import TurpiVideoAvatar from "@/components/mascot/TurpiVideoAvatar";
import { sounds } from "@/lib/soundEffects";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const store = useUserStore();

  const [step, setStep] = useState<number>(1);
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>("liceo");
  const [selectedLevel, setSelectedLevel] = useState<"novato" | "intermedio" | "avanzado">("novato");
  const [selectedGoal, setSelectedGoal] = useState<number>(5);
  const [trialAnswered, setTrialAnswered] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phoneOrEmail, setPhoneOrEmail] = useState<string>("");

  const totalSteps = 5;

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#58cc02", "#1cb0f6", "#ff9600", "#ffc800"],
    });
  };

  const handleTrialOption = (isCorrect: boolean) => {
    if (isCorrect) {
      sounds.playCorrect();
      setTrialAnswered(true);
      triggerConfetti();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCelebration();
    store.finishOnboarding({
      name: name.trim() || "Estudiante",
      phoneOrEmail: phoneOrEmail.trim(),
      userPersona: selectedPersona,
      experienceLevel: selectedLevel,
      dailyGoalMinutes: selectedGoal,
    });
    triggerConfetti();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#fbf9f8] flex flex-col justify-between overflow-y-auto select-none">
      {/* Top Progress Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-[#e5e5e5] px-4 py-3 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex-1 bg-[#efeded] h-3.5 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="bg-[#58cc02] h-full rounded-full"
              initial={{ width: "20%" }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs font-black text-[#777777]">
            {step} de {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Step Body */}
      <div className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* PASO 1: PERSONA / RUBRO */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 text-center"
            >
              <div className="flex flex-col items-center justify-center mb-2">
                <TurpiVideoAvatar size="lg" className="border-4 border-amber-300 shadow-xl" />
                <div className="mt-2.5 bg-white border-2 border-b-3 border-[#58cc02] px-4 py-2 rounded-2xl shadow-xs text-xs font-bold text-[#1b1c1c] text-center max-w-xs">
                  <span className="text-[#58cc02] font-black uppercase text-[10px] block mb-0.5">
                    ¡HOLA! SOY TURPI 🇻🇪
                  </span>
                  Te enseñaré a sacarle el jugo a la IA en 3 minutos al día. ¿Para qué la necesitas?
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-[#1b1c1c] tracking-tight">
                  ¿Quién eres o qué quieres resolver?
                </h2>
                <p className="text-xs text-[#777777] font-bold mt-1">
                  Personalizaremos tus ejercicios para tu día a día
                </p>
              </div>

              <div className="space-y-2.5 text-left pt-1">
                {[
                  {
                    id: "liceo" as const,
                    title: "Liceo, Colegio o Universidad 🎒",
                    desc: "Aprobar exámenes, preparar exposiciones y hacer tareas sin copiar y pegar.",
                    icon: GraduationCap,
                    accent: "border-blue-300 bg-blue-50/50",
                  },
                  {
                    id: "comercio" as const,
                    title: "Ventas, Negocio o Emprendimiento 🛍️",
                    desc: "Vender por WhatsApp, responder a clientes de Instagram y cobrar rápido.",
                    icon: ShoppingBag,
                    accent: "border-emerald-300 bg-emerald-50/50",
                  },
                  {
                    id: "oficio" as const,
                    title: "Oficios, Talleres o Servicios Técnicos 🔧",
                    desc: "Presupuestos claros, mensajes formales y ganarte la confianza del cliente.",
                    icon: Wrench,
                    accent: "border-amber-300 bg-amber-50/50",
                  },
                  {
                    id: "ciudadano" as const,
                    title: "Vida Diaria, Familia y Trámites 🏠",
                    desc: "Cartas a Cantv/Corpoelec, finanzas familiares multimoneda y organizar tu día.",
                    icon: Home,
                    accent: "border-purple-300 bg-purple-50/50",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedPersona === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPersona(item.id)}
                      className={`w-full p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 select-none ${
                        isSelected
                          ? "border-[#58cc02] border-b-4 bg-emerald-50 text-[#1b1c1c] shadow-xs"
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
                        <span className="font-extrabold text-sm block">
                          {item.title}
                        </span>
                        <span className="text-xs text-[#777777] font-semibold block mt-0.5 leading-snug">
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* PASO 2: NIVEL DE EXPERIENCIA */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 text-center"
            >
              <div className="flex justify-center mb-1">
                <AnimatedTurpi
                  mood="thinking"
                  size="lg"
                  speech="Tranquilo, aquí nadie te hablará en chino ni con términos gringos raros."
                />
              </div>

              <div>
                <h2 className="text-2xl font-black text-[#1b1c1c] tracking-tight">
                  ¿Cuánto sabes de Inteligencia Artificial?
                </h2>
                <p className="text-xs text-[#777777] font-bold mt-1">
                  Adaptaremos las explicaciones a tu nivel
                </p>
              </div>

              <div className="space-y-3 text-left">
                {[
                  {
                    id: "novato" as const,
                    title: "🟢 Soy novato total",
                    desc: "Solo he escuchado de ChatGPT o nunca le he pedido nada a una IA.",
                  },
                  {
                    id: "intermedio" as const,
                    title: "🟡 He probado un poco",
                    desc: "Le he pedido cosas, pero a veces me da respuestas raras o muy largas.",
                  },
                  {
                    id: "avanzado" as const,
                    title: "🔵 La uso con frecuencia",
                    desc: "La uso seguido pero quiero aprender a sacarle el jugo de verdad sin perder tiempo.",
                  },
                ].map((lvl) => {
                  const isSelected = selectedLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all flex items-start gap-3 select-none ${
                        isSelected
                          ? "border-[#1cb0f6] border-b-4 bg-sky-50 text-[#006590] shadow-xs"
                          : "border-[#e5e5e5] border-b-4 hover:border-neutral-300 bg-white text-[#1b1c1c]"
                      }`}
                    >
                      <div className="flex-1">
                        <span className="font-extrabold text-sm block">
                          {lvl.title}
                        </span>
                        <span className="text-xs text-[#777777] font-semibold block mt-0.5">
                          {lvl.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* PASO 3: META DIARIA */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 text-center"
            >
              <div className="flex justify-center mb-1">
                <AnimatedTurpi
                  mood="teaching"
                  size="lg"
                  speech="¡3 o 5 minutos al día son suficientes para crear el hábito y no olvidar!"
                />
              </div>

              <div>
                <h2 className="text-2xl font-black text-[#1b1c1c] tracking-tight">
                  ¿Cuál será tu meta diaria?
                </h2>
                <p className="text-xs text-[#777777] font-bold mt-1">
                  Puedes cambiarla cuando quieras
                </p>
              </div>

              <div className="space-y-3 text-left">
                {[
                  {
                    minutes: 3,
                    title: "⚡ 3 minutos al día",
                    desc: "Relajado • 1 lección corta diaria para aprender sin estrés.",
                  },
                  {
                    minutes: 5,
                    title: "🔥 5 minutos al día (Recomendado)",
                    desc: "Normal • 2 lecciones prácticas y 1 duelo de prompts.",
                  },
                  {
                    minutes: 10,
                    title: "🚀 10 minutos al día",
                    desc: "Intenso • Para los que quieren dominar la IA esta misma semana.",
                  },
                ].map((goal) => {
                  const isSelected = selectedGoal === goal.minutes;
                  return (
                    <button
                      key={goal.minutes}
                      type="button"
                      onClick={() => setSelectedGoal(goal.minutes)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between select-none ${
                        isSelected
                          ? "border-[#ff9600] border-b-4 bg-amber-50 text-[#1b1c1c] shadow-xs"
                          : "border-[#e5e5e5] border-b-4 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-sm block">
                          {goal.title}
                        </span>
                        <span className="text-xs text-[#777777] font-semibold block mt-0.5">
                          {goal.desc}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#ff9600] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* PASO 4: EL MICRO-RETO INTERACTIVO ("AHA!" MOMENT) */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 text-center"
            >
              <div className="flex justify-center mb-1">
                <AnimatedTurpi
                  mood={trialAnswered ? "celebrating" : "happy"}
                  size="lg"
                  speech={
                    trialAnswered
                      ? "¡BRUTAL! 🎉 ¡Viste lo fácil que es cuando usas los 4 ingredientes!"
                      : "¡Vamos a probarlo en vivo! Resuelve tu primera pregunta conmigo."
                  }
                />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#58cc02] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  TU PRIMER RETO EN VIVO 🇻🇪
                </span>
                <h2 className="text-xl font-black text-[#1b1c1c] mt-2 leading-tight">
                  Un cliente te escribe en WhatsApp: "¿Cuánto es lo último?".
                </h2>
                <p className="text-xs text-[#777777] font-bold mt-1">
                  Si le pides a la IA "dame una respuesta", te dará un texto robótico. ¿Cuál es el truco correcto?
                </p>
              </div>

              <div className="space-y-2.5 text-left pt-1">
                <button
                  type="button"
                  onClick={() => handleTrialOption(false)}
                  disabled={trialAnswered}
                  className="w-full p-3.5 rounded-2xl border-2 border-b-4 border-[#e5e5e5] bg-white text-xs sm:text-sm font-semibold hover:border-neutral-300 select-none"
                >
                  ❌ Escribirle a la IA en mayúsculas: "CONTESTALE RAPIDO QUE ESTA MUY CARO".
                </button>

                <button
                  type="button"
                  onClick={() => handleTrialOption(true)}
                  disabled={trialAnswered}
                  className={`w-full p-3.5 rounded-2xl border-2 transition-all text-xs sm:text-sm font-bold select-none ${
                    trialAnswered
                      ? "border-[#58cc02] border-b-4 bg-emerald-50 text-[#166534] shadow-md"
                      : "border-[#e5e5e5] border-b-4 bg-white hover:border-emerald-300 text-[#1b1c1c]"
                  }`}
                >
                  ✅ Aplicar los 4 Ingredientes: darle Rol de vendedor, explicar que vendes a $20 y ofrecer 5% de descuento por Pago Móvil hoy.
                </button>
              </div>

              {trialAnswered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-2xl text-xs font-black text-emerald-900 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 fill-current" />
                  <span>¡Acabas de ganar tus primeros +25 XP y 1 Día de Racha!</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PASO 5: REGISTRO / INICIO DE SESIÓN GAMIFICADO */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 text-center"
            >
              <div className="flex justify-center mb-1">
                <AnimatedTurpi
                  mood="celebrating"
                  size="lg"
                  speech="¡Crea tu perfil en 10 segundos para no perder tu racha de hoy!"
                />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#ff9600] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  PASO FINAL • GUARDA TU CUENTA
                </span>
                <h2 className="text-2xl font-black text-[#1b1c1c] mt-2">
                  ¡Crea tu cuenta en Resuelve AI!
                </h2>
                <p className="text-xs text-[#777777] font-bold mt-1">
                  Guarda tu racha de 1 día 🔥, tus 25 XP y tus diplomas oficiales
                </p>
              </div>

              <form onSubmit={handleFinish} className="space-y-3 text-left pt-1">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#4b4b4b] block mb-1">
                    Tu Nombre o Apodo:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Carlos Gómez"
                    className="w-full p-3.5 text-sm bg-white border-2 border-[#e5e5e5] rounded-2xl focus:border-[#58cc02] focus:outline-none transition-all font-bold text-[#1b1c1c]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#4b4b4b] block mb-1">
                    Teléfono (+58) o Correo Electrónico:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      placeholder="0412-1234567 o micorreo@gmail.com"
                      className="w-full p-3.5 text-sm bg-white border-2 border-[#e5e5e5] rounded-2xl focus:border-[#58cc02] focus:outline-none transition-all font-bold text-[#1b1c1c]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full btn-3d-green py-4 rounded-2xl text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>GUARDAR Y ENTRAR A LA APP</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-[11px] text-[#777777] font-semibold text-center mt-2">
                  Al continuar aceptas nuestros términos sencillos de uso educativo para Venezuela.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Footer for Steps 1 to 4 */}
      {step < 5 && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t-2 border-[#e5e5e5] p-4">
          <div className="max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              disabled={step === 4 && !trialAnswered}
              className={`w-full py-4 rounded-2xl text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md ${
                step === 4 && !trialAnswered
                  ? "bg-[#e5e5e5] text-[#a0a0a0] cursor-not-allowed border-b-4 border-[#afafaf]"
                  : "btn-3d-green"
              }`}
            >
              <span>{step === 4 ? "¡GUARDAR MI RACHA!" : "CONTINUAR"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
