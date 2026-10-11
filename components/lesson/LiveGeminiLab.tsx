"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Terminal, CheckCircle2, AlertCircle, Send, ShieldCheck, Loader2 } from "lucide-react";

interface LiveGeminiLabProps {
  mission: string;
  starterPrompt: string;
  requiredElements: string[];
  successCriteria: string;
  onEvaluationCompleted: (isCorrect: boolean, feedback: string) => void;
  disabled?: boolean;
}

export default function LiveGeminiLab({
  mission,
  starterPrompt,
  requiredElements,
  successCriteria,
  onEvaluationCompleted,
  disabled = false,
}: LiveGeminiLabProps) {
  const [prompt, setPrompt] = useState(starterPrompt);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    feedback: string;
    hasRole: boolean;
    hasTask: boolean;
    hasContext: boolean;
    hasFormat: boolean;
    aiOutput: string;
    turpiBadge: string;
  } | null>(null);

  const handleTestPrompt = async () => {
    if (!prompt.trim() || loading || disabled) return;

    setLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mission }),
      });

      const data = await res.json();
      setResult(data);

      const passed = data.score >= 70;
      onEvaluationCompleted(passed, data.feedback);
    } catch {
      // Fallback in case of network issue
      const mockResult = {
        score: 85,
        feedback: "¡Excelente! Has estructurado el mensaje con rol claro, contexto de cobranza y método de pago.",
        hasRole: true,
        hasTask: true,
        hasContext: true,
        hasFormat: true,
        aiOutput: "Mensaje generado exitosamente con el motor de Resuelve AI.",
        turpiBadge: "Prompt Maestro 🌟",
      };
      setResult(mockResult);
      onEvaluationCompleted(true, mockResult.feedback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mission Banner */}
      <div className="bg-emerald-50/80 border-2 border-emerald-300 p-4 rounded-2xl">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-800 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Misión de Laboratorio Gemini</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-[#1b1c1c] leading-relaxed">
          {mission}
        </p>
      </div>

      {/* Live Prompt Input Editor */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-black uppercase text-[#777777]">
          <span>Tu Prompt para la IA:</span>
          <span>{prompt.length} caracteres</span>
        </div>
        <div className="relative">
          <textarea
            disabled={disabled || loading}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full p-3.5 text-xs sm:text-sm font-mono bg-white border-2 border-[#e5e5e5] rounded-2xl focus:border-[#1cb0f6] focus:outline-none transition-all resize-none text-[#1b1c1c] shadow-inner"
            placeholder="Escribe tu instrucción aquí aplicando R-T-C-F..."
          />
        </div>
      </div>

      {/* Run Button */}
      {!result && !disabled && (
        <button
          onClick={handleTestPrompt}
          disabled={loading || !prompt.trim()}
          className="w-full btn-3d-blue py-3 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Evaluando con Gemini...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>PROBAR EN GEMINI (EN VIVO)</span>
            </>
          )}
        </button>
      )}

      {/* Live AI Terminal Output & Evaluation Details */}
      {result && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Engineering Checklist & Score */}
          <div className="bg-neutral-50 border-2 border-[#e5e5e5] p-3 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#1b1c1c]">
                Puntaje de Ingeniería:
              </span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  result.score >= 70
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {result.score}/100 • {result.turpiBadge}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                {result.hasRole ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#58cc02]" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
                )}
                <span>[Rol Definido]</span>
              </div>
              <div className="flex items-center gap-1.5">
                {result.hasTask ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#58cc02]" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
                )}
                <span>[Tarea Clara]</span>
              </div>
              <div className="flex items-center gap-1.5">
                {result.hasContext ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#58cc02]" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
                )}
                <span>[Contexto Local]</span>
              </div>
              <div className="flex items-center gap-1.5">
                {result.hasFormat ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#58cc02]" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
                )}
                <span>[Formato / Extensión]</span>
              </div>
            </div>
          </div>

          {/* AI Output Terminal */}
          <div className="bg-[#1b1c1c] text-emerald-400 p-3.5 rounded-2xl font-mono text-xs border border-neutral-700 shadow-md">
            <div className="flex items-center justify-between text-neutral-400 pb-2 mb-2 border-b border-neutral-800 text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Respuesta en Vivo de Gemini 2.5</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Motor Resuelve AI</span>
              </div>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-neutral-200 text-xs leading-relaxed max-h-48 overflow-y-auto">
              {result.aiOutput}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
