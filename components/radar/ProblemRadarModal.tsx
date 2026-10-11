"use client";

import { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  Lightbulb,
  GraduationCap,
  ShoppingBag,
  Wrench,
  Utensils,
  Home,
  Clock,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { sounds } from "@/lib/soundEffects";
import TurpiVoiceButton from "@/components/mascot/TurpiVoiceButton";

interface ProblemRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RUBROS = [
  { id: "comercio", title: "Ventas / Tienda / WhatsApp 🛍️", persona: "comercio" as const },
  { id: "liceo", title: "Liceo / Colegio / Universidad 🎒", persona: "liceo" as const },
  { id: "comida", title: "Comida / Repostería 🧁", persona: "comercio" as const },
  { id: "oficio", title: "Taller / Técnico / Reparaciones 🔧", persona: "oficio" as const },
  { id: "ciudadano", title: "Trámites / Oficina / Hogar 🏠", persona: "ciudadano" as const },
];

export default function ProblemRadarModal({
  isOpen,
  onClose,
}: ProblemRadarModalProps) {
  const [rubro, setRubro] = useState(RUBROS[0].title);
  const [persona, setPersona] = useState<any>(RUBROS[0].persona);
  const [problemDescription, setProblemDescription] = useState("");
  const [timeOrMoneyLost, setTimeOrMoneyLost] = useState("2 a 4 horas semanales");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDescription.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona,
          rubroTitle: rubro,
          problemDescription,
          timeOrMoneyLost,
          contact,
        }),
      });

      const data = await res.json();
      if (data.success && data.turpiSolution) {
        sounds.playCelebration();
        confetti({
          particleCount: 50,
          spread: 65,
          origin: { y: 0.6 },
          colors: ["#58cc02", "#1cb0f6", "#ff9600", "#ffc800"],
        });
        setSolution(data.turpiSolution);
      }
    } catch {
      sounds.playCorrect();
      setSolution(
        "Actúa como un asesor experto. Ayúdame con esta situación en mi negocio en Venezuela: " +
          problemDescription +
          ". Dame una solución en 3 pasos con formato listo para WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border-2 border-b-6 border-[#e5e5e5] rounded-3xl max-w-lg w-full p-5 sm:p-6 relative shadow-2xl my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#777777] hover:text-[#1b1c1c] p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!solution ? (
          <div>
            {/* Modal Header */}
            <div className="text-center space-y-1 mb-5">
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                RADAR DE PROBLEMAS • TURPI TE RESUELVE 🇻🇪
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#1b1c1c] pt-1">
                ¿Qué tarea difícil te quita tiempo?
              </h2>
              <p className="text-xs text-[#777777] font-semibold">
                Cuéntale a Turpi tu problema real y te daremos un prompt personalizado al instante mientras creamos una solución de software para ti.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Step 1: Rubro */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#4b4b4b] block mb-1.5">
                  1. ¿En qué rubro o actividad estás?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RUBROS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setRubro(r.title);
                        setPersona(r.persona);
                      }}
                      className={`text-left p-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                        rubro === r.title
                          ? "border-[#58cc02] border-b-3 bg-emerald-50 text-[#1b1c1c]"
                          : "border-[#e5e5e5] bg-neutral-50 text-[#4b4b4b] hover:border-neutral-300"
                      }`}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: The Pain Point */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#4b4b4b] block mb-1">
                  2. Describe la tarea o problema que te da dolores de cabeza:
                </label>
                <textarea
                  required
                  rows={4}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Ej: Tengo una tienda y tardo horas cuadrando las capturas de Pago Móvil con el banco para ver quién pagó y quién no..."
                  className="w-full p-3 text-xs sm:text-sm bg-neutral-50 border-2 border-[#e5e5e5] rounded-xl focus:border-[#58cc02] focus:outline-none transition-all resize-none text-[#1b1c1c] font-semibold"
                />
              </div>

              {/* Step 3: Time Lost & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#4b4b4b] block mb-1">
                    Tiempo que pierdes:
                  </label>
                  <select
                    value={timeOrMoneyLost}
                    onChange={(e) => setTimeOrMoneyLost(e.target.value)}
                    className="w-full p-2.5 text-xs bg-neutral-50 border-2 border-[#e5e5e5] rounded-xl font-bold text-[#1b1c1c] focus:outline-none"
                  >
                    <option value="1 a 2 horas semanales">1 a 2 horas semanales</option>
                    <option value="3 a 6 horas semanales">3 a 6 horas semanales</option>
                    <option value="Más de 10 horas semanales">Más de 10 horas semanales</option>
                    <option value="Pierdo clientes y dinero">Pierdo clientes y dinero</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#4b4b4b] block mb-1">
                    Tu WhatsApp / Teléfono:
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="0412-0000000"
                    className="w-full p-2.5 text-xs bg-neutral-50 border-2 border-[#e5e5e5] rounded-xl font-bold text-[#1b1c1c] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !problemDescription.trim()}
                  className="w-full btn-3d-green py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analizando con Turpi...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>RESOLVER CON TURPI Y GUARDAR CASO 🚀</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success & Tailored Instant Solution Screen */
          <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-[#58cc02] mx-auto flex items-center justify-center text-[#58cc02]">
              <Sparkles className="w-8 h-8 fill-current" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#58cc02] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ¡CASO REGISTRADO CON ÉXITO! 🎉
              </span>
              <h3 className="text-xl font-black text-[#1b1c1c] mt-2">
                Aquí tienes tu solución inmediata con IA:
              </h3>
              <p className="text-xs text-[#777777] font-semibold mt-0.5">
                Copia este prompt maestro y pégalo hoy mismo en ChatGPT o Gemini para resolver tu tarea.
              </p>
            </div>

            {/* Prompt Output Card */}
            <div className="bg-emerald-50/70 border-2 border-[#58cc02] p-4 rounded-2xl text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#166534] bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                  PROMPT PERSONALIZADO POR TURPI
                </span>
                <div className="flex items-center gap-1">
                  <TurpiVoiceButton textToSpeak={solution} size="sm" />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] font-black text-[#166534] bg-white px-2.5 py-1 rounded-xl border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#58cc02]" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs sm:text-sm font-semibold text-[#1b1c1c] leading-relaxed max-h-48 overflow-y-auto font-sans">
                {solution}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#166534] font-bold pt-1">
                <ShieldCheck className="w-4 h-4 text-[#58cc02] flex-shrink-0" />
                <span>
                  Tu caso quedó guardado en el laboratorio de Resuelve AI para desarrollar herramientas que automaticen esto en Venezuela.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSolution(null);
                setProblemDescription("");
                onClose();
              }}
              className="w-full btn-3d-green py-3 rounded-xl text-sm font-black uppercase tracking-wider"
            >
              ¡ENTENDIDO, VOLVER A LA APP!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
