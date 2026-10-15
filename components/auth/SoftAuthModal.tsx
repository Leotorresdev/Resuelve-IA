"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Flame,
  Zap,
  Battery,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Mail,
  Smartphone,
  Lock,
} from "lucide-react";
import { useUserStore } from "@/lib/store";
import { sounds } from "@/lib/soundEffects";
import AnimatedTurpi from "@/components/mascot/AnimatedTurpi";

interface SoftAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SoftAuthModal({ isOpen, onClose }: SoftAuthModalProps) {
  const store = useUserStore();
  const [mode, setMode] = useState<"quick" | "form">("quick");
  const [name, setName] = useState(store.name || "");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    sounds.playTap();

    // Hook preparado para conectar Supabase Auth:
    // const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    setTimeout(() => {
      store.saveUserAccount({
        name: store.name || "Estudiante Pro",
        emailOrPhone: "google-user@resuelveia.com",
      });
      sounds.playCelebration();
      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !emailOrPhone.trim()) return;

    setIsSubmitting(true);
    sounds.playTap();

    // Hook preparado para Supabase Magic Link o OTP SMS:
    setTimeout(() => {
      store.saveUserAccount({
        name: name.trim(),
        emailOrPhone: emailOrPhone.trim(),
      });
      sounds.playCelebration();
      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 500);
  };

  const handleSkip = () => {
    sounds.playTap();
    store.setHasShownPostLesson1Modal(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="bg-white border-2 border-b-6 border-[#e5e5e5] rounded-3xl max-w-sm w-full p-5 relative shadow-2xl my-6 text-center space-y-4">
        {/* Close / Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-[#777777] hover:text-[#1b1c1c] p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
          title="Continuar como invitado"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-6 space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-[#58cc02] mx-auto flex items-center justify-center text-[#58cc02]">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5px]" />
            </div>
            <h3 className="text-xl font-black text-[#1b1c1c]">
              ¡Progreso Asegurado! 🎉
            </h3>
            <p className="text-xs text-[#777777] font-bold">
              Tu racha activa y tus XP quedaron sincronizados con éxito.
            </p>
          </div>
        ) : (
          <>
            {/* Header Mascot */}
            <div className="flex justify-center pt-2">
              <AnimatedTurpi
                mood="celebrating"
                size="md"
                speech="¡No pierdas tu racha! Asegura tu avance para sincronizar en cualquier dispositivo."
              />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ff9600] bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                LOGRO DE LECCIÓN 1 • RESUELVE IA
              </span>
              <h2 className="text-xl font-black text-[#1b1c1c] mt-1.5 tracking-tight">
                ¡Guarda tu Racha de Hoy!
              </h2>
              <p className="text-xs text-[#777777] font-semibold mt-0.5">
                Crea tu cuenta gratuita en 5 segundos y sigue jugando sin límites.
              </p>
            </div>

            {/* Stats badges pill */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-[#ff9600] px-2.5 py-1 rounded-full text-xs font-black">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{store.streak} DÍA</span>
              </div>
              <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 text-[#1cb0f6] px-2.5 py-1 rounded-full text-xs font-black">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>+{store.xp} XP</span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-[#58cc02] px-2.5 py-1 rounded-full text-xs font-black">
                <Battery className="w-3.5 h-3.5 fill-current" />
                <span>{store.batteries}/5</span>
              </div>
            </div>

            {mode === "quick" ? (
              <div className="space-y-2.5 pt-1">
                {/* Google One-Click CTA */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGoogleAuth}
                  className="w-full bg-white hover:bg-neutral-50 text-[#1b1c1c] border-2 border-[#e5e5e5] border-b-4 hover:border-neutral-300 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 shadow-xs transition-all active:translate-y-1 active:border-b-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>CONTINUAR CON GOOGLE</span>
                </button>

                {/* Email / WhatsApp Option */}
                <button
                  type="button"
                  onClick={() => setMode("form")}
                  className="w-full btn-3d-green py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>REGISTRAR CON CORREO</span>
                </button>

                {/* Skip link */}
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-xs font-bold text-[#777777] hover:text-[#1b1c1c] underline underline-offset-2 pt-1 transition-colors block mx-auto"
                >
                  Continuar como invitado (hacerlo después)
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3 text-left pt-1">
                <div>
                  <label className="text-[11px] font-black uppercase text-[#4b4b4b] block mb-1">
                    Tu Nombre o Apodo:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Daniel R."
                    className="w-full p-2.5 text-xs bg-neutral-50 border-2 border-[#e5e5e5] rounded-xl font-bold text-[#1b1c1c] focus:outline-none focus:border-[#58cc02]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-[#4b4b4b] block mb-1">
                    Correo o WhatsApp:
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="correo@ejemplo.com o 0412-1234567"
                    className="w-full p-2.5 text-xs bg-neutral-50 border-2 border-[#e5e5e5] rounded-xl font-bold text-[#1b1c1c] focus:outline-none focus:border-[#58cc02]"
                  />
                </div>

                <div className="pt-1 space-y-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-3d-green py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>GUARDAR MI PROGRESO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("quick")}
                    className="w-full text-[11px] font-bold text-[#777777] hover:text-[#1b1c1c] text-center block"
                  >
                    Volver a opciones
                  </button>
                </div>
              </form>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#777777] font-semibold pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#58cc02]" />
              <span>Sin contraseñas complicadas ni spam. 100% seguro.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
