"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Copy,
  Check,
  Award,
  ChevronRight,
  HelpCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
} from "lucide-react";
import { Bounty } from "@/lib/data/bountiesData";
import { useUserStore } from "@/lib/store";
import { sounds } from "@/lib/soundEffects";
import confetti from "canvas-confetti";

interface BountySolverModalProps {
  bounty: Bounty;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BountySolverModal({
  bounty,
  isOpen,
  onClose,
  onSuccess,
}: BountySolverModalProps) {
  const store = useUserStore();

  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    feedback: string;
    deliverable?: string | null;
    rewardUsd: number;
    platformFeeUsd: number;
    xpEarned: number;
    breakdown?: {
      hasRole: boolean;
      hasTask: boolean;
      hasContext: boolean;
      hasFormat: boolean;
    };
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [viewDeliverableTab, setViewDeliverableTab] = useState<"deliverable" | "prompt">("deliverable");

  if (!isOpen) return null;

  const handleInsertHelper = (snippet: string) => {
    setPrompt((prev) => (prev ? `${prev}\n${snippet}` : snippet));
  };

  const handleSubmitEvaluation = async () => {
    if (!prompt.trim() || prompt.length < 20) {
      alert("Por favor escribe un prompt con al menos 20 caracteres que especifique el Rol, Tarea, Contexto y Formato.");
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/bounties/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId: bounty.id,
          solverPrompt: prompt,
          taskTitle: bounty.title,
          taskCategory: bounty.category,
          taskRequirements: bounty.requirements,
          expectedFormat: bounty.expectedFormat,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);

        if (data.passed) {
          sounds.playCelebration();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.5 },
          });
        } else {
          sounds.playIncorrect();
        }
      } else {
        alert(data.error || "Error al evaluar el prompt");
      }
    } catch (err) {
      console.error("Error solving bounty:", err);
      alert("Ocurrió un error al conectar con el motor de evaluación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelivery = () => {
    if (!result || !result.passed || !result.deliverable) return;

    store.completeBountySolve(bounty.id, prompt, result.deliverable, result.score);
    sounds.playCorrect();
    onSuccess();
    onClose();
  };

  const handleCopyDeliverable = () => {
    if (!result?.deliverable) return;
    navigator.clipboard.writeText(result.deliverable);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDeliverable = () => {
    if (!result?.deliverable) return;
    const blob = new Blob([result.deliverable], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${bounty.title.replace(/[^a-zA-Z0-9_\u00C0-\u017F\s]/g, "").replace(/\s+/g, "_")}_solucion.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fbf9f8] w-full max-w-xl rounded-t-3xl sm:rounded-3xl border-2 border-[#e5e5e5] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-200">
        {/* Modal Top Header */}
        <div className="bg-white px-5 py-3.5 border-b-2 border-[#e5e5e5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
              {bounty.categoryLabel}
            </span>
            <span className="text-xs font-bold text-[#777777]">
              Por {bounty.authorName} ({bounty.authorRole})
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-[#777777] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Title & Reward Banner */}
        <div className="p-4 bg-gradient-to-b from-white to-[#fbf9f8] border-b border-[#e5e5e5]">
          <h2 className="text-base sm:text-lg font-black text-[#1b1c1c] leading-tight">
            {bounty.title}
          </h2>

          <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2">
            {/* Reward Pill */}
            <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-300 rounded-2xl px-3 py-1.5 shadow-2xs">
              <span className="text-sm font-black text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#58cc02]" />
                Ganas: +$0.30 USD & +50 XP
              </span>
              <span className="text-[10px] text-emerald-700/80 font-bold border-l border-emerald-200 pl-2">
                Paga total: $1.00 USD
              </span>
            </div>

            {/* Platform 70/30 Fee Pill */}
            <div className="text-[10px] font-bold text-[#777777] bg-neutral-100 px-2.5 py-1 rounded-xl">
              Comisión Resuelve IA: $0.70 USD (70%)
            </div>
          </div>
        </div>

        {/* Body Container (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: SOLVER PROMPT WORKSPACE (If not yet approved) */}
          {!result?.passed && (
            <>
              {/* Requirements Card */}
              <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1b1c1c] tracking-tight">
                  <FileText className="w-4 h-4 text-[#1cb0f6]" />
                  Requisitos que exigió el estudiante:
                </div>
                <p className="text-xs text-[#555555] italic leading-relaxed">
                  &quot;{bounty.description}&quot;
                </p>
                <div className="space-y-1.5 pt-1">
                  {bounty.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-[#1b1c1c]">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#58cc02] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
                {bounty.expectedFormat && (
                  <div className="mt-2 text-[11px] bg-neutral-50 rounded-xl p-2 border border-neutral-200 text-neutral-600 font-semibold">
                    📐 <strong>Formato esperado:</strong> {bounty.expectedFormat}
                  </div>
                )}
              </div>

              {/* Turpi Pedagogical Tip */}
              <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-3 flex items-start gap-3">
                <div className="relative w-10 h-10 shrink-0">
                  <Image src="/turpi.png" alt="Turpi" fill className="object-contain" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-900 tracking-tight">
                    💡 Consejo de Turpi para ganar tus $0.30 USD:
                  </h4>
                  <p className="text-[11px] text-amber-800 font-semibold leading-relaxed mt-0.5">
                    No hagas la tarea tú mismo a mano. Escribe el <strong>Prompt Maestro</strong> con la fórmula <strong>R-T-C-F</strong> (Rol, Tarea, Contexto y Formato) para que la IA genere el trabajo perfecto con tablas, subtítulos y bibliografía.
                  </p>
                </div>
              </div>

              {/* Prompt Quick Helpers */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-black uppercase text-[#777777] self-center mr-1">
                  Atajos R-T-C-F:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertHelper(
                      "Actúa como un profesor y especialista en la materia con más de 10 años de experiencia académica."
                    )
                  }
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold px-2 py-1 rounded-lg border border-neutral-300 transition-colors"
                >
                  + [Rol de Profesor]
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertHelper(
                      "Elabora un informe estructurado y exhaustivo que cubra punto por punto todos los requisitos solicitados."
                    )
                  }
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold px-2 py-1 rounded-lg border border-neutral-300 transition-colors"
                >
                  + [Tarea Completa]
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertHelper(
                      "Formato de entrega: Portada formal, introducción pedagógica, subtítulos, cuadro comparativo en tabla Markdown y conclusiones."
                    )
                  }
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold px-2 py-1 rounded-lg border border-neutral-300 transition-colors"
                >
                  + [Formato con Tabla]
                </button>
              </div>

              {/* Prompt Input Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-[#1b1c1c] tracking-tight">
                    Tu Prompt Maestro para resolver la tarea:
                  </label>
                  <span className="text-[11px] font-bold text-[#777777]">
                    {prompt.length} caracteres
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Ejemplo:\nActúa como un profesor universitario de Biología. Redacta un informe completo para un estudiante de 4to año de bachillerato sobre el ciclo celular...\n\nIncluye:\n1. Fases de la mitosis en detalle\n2. Cuadro comparativo de mitosis vs meiosis...\n3. Formato académico con portada ficticia y bibliografía.`}
                  className="w-full p-3.5 border-2 border-[#e5e5e5] rounded-2xl text-xs sm:text-sm font-mono text-[#1b1c1c] leading-relaxed focus:border-[#58cc02] focus:outline-hidden bg-white shadow-2xs resize-none"
                />
              </div>

              {/* Failed Attempt Banner if score < 80 */}
              {result && !result.passed && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-tight">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    Calificación: {result.score}/100 • Necesitas al menos 80 pts
                  </div>
                  <p className="text-xs text-rose-900 font-semibold leading-relaxed">
                    {result.feedback}
                  </p>
                  <p className="text-[11px] text-rose-700 font-medium">
                    Corrige tu prompt agregando las partes faltantes e inténtalo de nuevo sin costo alguno.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmitEvaluation}
                disabled={isSubmitting || prompt.trim().length < 20}
                className="w-full bg-[#58cc02] hover:bg-[#46a302] active:translate-y-1 text-white font-black text-sm uppercase py-3.5 rounded-2xl shadow-[0_4px_0_0_#46a302] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {isSubmitting ? (
                  <span>Turpi está evaluando y generando el trabajo...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Evaluar Prompt y Generar Trabajo (+$0.30 USD)
                  </>
                )}
              </button>
            </>
          )}

          {/* STEP 2: CELEBRATION & DELIVERABLE PREVIEW (If approved score >= 80) */}
          {result && result.passed && result.deliverable && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom">
              {/* Victory Card */}
              <div className="bg-gradient-to-r from-emerald-500 to-[#58cc02] text-white p-4 rounded-3xl shadow-md text-center space-y-1.5">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-xs text-2xl mb-1">
                  🎉
                </div>
                <h3 className="text-lg font-black tracking-tight">
                  ¡Misión Aprobada con {result.score}/100 Puntos!
                </h3>
                <p className="text-xs font-semibold text-white/90 max-w-md mx-auto">
                  Tu prompt cumplió con todos los criterios de excelencia. La solución ha sido generada exitosamente.
                </p>

                {/* Earnings breakdown banner */}
                <div className="pt-2 flex items-center justify-center gap-3">
                  <div className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-black">
                    +$0.30 USD para ti 💵
                  </div>
                  <div className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-black">
                    +50 XP ⚡
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-xl text-[11px] font-bold">
                    Tarifa Resuelve IA: $0.70
                  </div>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex border-b border-[#e5e5e5] bg-white rounded-xl px-2">
                <button
                  type="button"
                  onClick={() => setViewDeliverableTab("deliverable")}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all ${
                    viewDeliverableTab === "deliverable"
                      ? "border-[#58cc02] text-[#58cc02]"
                      : "border-transparent text-[#777777]"
                  }`}
                >
                  📄 Trabajo Completo Generado
                </button>
                <button
                  type="button"
                  onClick={() => setViewDeliverableTab("prompt")}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all ${
                    viewDeliverableTab === "prompt"
                      ? "border-[#58cc02] text-[#58cc02]"
                      : "border-transparent text-[#777777]"
                  }`}
                >
                  💡 Tu Prompt Maestro
                </button>
              </div>

              {/* Deliverable Document Preview */}
              {viewDeliverableTab === "deliverable" ? (
                <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                    <span className="text-xs font-black uppercase text-[#1b1c1c] tracking-tight">
                      Entrega para {bounty.authorName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopyDeliverable}
                        className="flex items-center gap-1 text-xs font-bold text-[#58cc02] hover:text-[#46a302] transition-colors bg-emerald-50 px-2.5 py-1 rounded-lg"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> ¡Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copiar Texto
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadDeliverable}
                        className="flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800 transition-colors bg-sky-50 px-2.5 py-1 rounded-lg"
                      >
                        <Download className="w-3.5 h-3.5" /> Descargar .md
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-sans text-neutral-800 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto p-2 bg-neutral-50 rounded-xl border border-neutral-200">
                    {result.deliverable}
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs max-h-60 overflow-y-auto leading-relaxed border border-neutral-800">
                  {prompt}
                </div>
              )}

              {/* Confirm & Claim Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmDelivery}
                  className="w-full bg-[#58cc02] hover:bg-[#46a302] active:translate-y-1 text-white font-black text-sm uppercase py-4 rounded-2xl shadow-[0_4px_0_0_#46a302] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-5 h-5" />
                  Confirmar Entrega y Cobrar $0.30 USD
                </button>
                <p className="text-[11px] text-center text-[#777777] font-semibold mt-2">
                  El trabajo quedará guardado para el estudiante y se sumarán $0.30 USD a tus ganancias.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
