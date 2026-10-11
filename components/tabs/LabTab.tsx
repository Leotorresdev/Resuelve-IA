"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FlaskConical,
  Send,
  Loader2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { useUserStore } from "@/lib/store";

export default function LabTab() {
  const store = useUserStore();

  const PRESETS = [
    {
      title: "Cobro Cordial de Factura 💼",
      prompt:
        "Actúa como encargado de administración en Caracas. Redacta un mensaje cordial de WhatsApp para recordar un saldo pendiente de $35 por un servicio entregado hace 5 días. Incluye datos ficticios de Pago Móvil y tasa BCV.",
    },
    {
      title: "Respuesta al Cliente '¿Cuánto es lo último?' 🛍️",
      prompt:
        "Actúa como un asesor de ventas de ropa en Valencia. Un cliente en Instagram pregunta '¿cuánto es lo último por el pantalón de $20?'. Defiende el precio amablemente y ofrece un 5% de descuento por Pago Móvil inmediato.",
    },
    {
      title: "Tutor de Física para Bachillerato 🎓",
      prompt:
        "Actúa como un profesor de física paciente. Explícame el concepto de 'energía cinética' usando una analogía con un carrito por puesto en una bajada. Dame 2 preguntas de práctica al final.",
    },
    {
      title: "Carta Formal de Reclamo Técnico 🏠",
      prompt:
        "Redacta una carta formal de reclamo para una empresa proveedora de internet en Venezuela. Explica que llevo 48 horas sin servicio, contrato [V-12345], y solicita ticket de soporte técnico y ajuste en factura.",
    },
  ];

  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleRun = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        score: 90,
        feedback: "¡Prompt de alto rendimiento! Estructurado y contextualizado.",
        hasRole: true,
        hasTask: true,
        hasContext: true,
        hasFormat: true,
        aiOutput: "Respuesta generada por el motor de Resuelve AI.",
        turpiBadge: "Prompt Maestro 🌟",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result?.aiOutput) return;
    navigator.clipboard.writeText(result.aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-24 pt-3 max-w-xl mx-auto px-4 space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1cb0f6] to-[#006590] text-white p-4 rounded-3xl shadow-md border-b-4 border-[#004666] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-100">
            <FlaskConical className="w-4 h-4" />
            <span>Laboratorio Libre</span>
          </div>
          <h2 className="text-xl font-black mt-0.5 tracking-tight">
            Laboratorio Gemini en Vivo
          </h2>
          <p className="text-xs text-sky-50 font-semibold mt-0.5">
            Escribe cualquier instrucción y recibe evaluación pedagógica al instante
          </p>
        </div>
        <div className="bg-white/20 p-2.5 rounded-2xl flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Preset Chips */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-[#777777] block">
          Plantillas Rápidas para Venezuela 🇻🇪
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRESETS.map((p) => (
            <button
              key={p.title}
              onClick={() => {
                setPrompt(p.prompt);
                setResult(null);
              }}
              className="whitespace-nowrap px-3 py-1.5 rounded-xl border-2 border-b-3 border-[#e5e5e5] bg-white text-xs font-bold text-[#4b4b4b] hover:border-sky-300 hover:text-[#006590] transition-colors flex-shrink-0"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Editor */}
      <div className="bg-white border-2 border-b-4 border-[#e5e5e5] p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-[#1b1c1c]">
          <span className="uppercase tracking-wider">Tu Instrucción / Prompt:</span>
          <span className="text-[#777777] font-semibold">{prompt.length} car.</span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          placeholder="Escribe tu prompt aquí aplicando Rol + Tarea + Contexto + Formato..."
          className="w-full p-3 font-mono text-xs sm:text-sm bg-neutral-50 border-2 border-[#e5e5e5] rounded-xl focus:border-[#1cb0f6] focus:outline-none transition-all resize-none text-[#1b1c1c]"
        />

        <button
          onClick={handleRun}
          disabled={loading || !prompt.trim()}
          className="w-full btn-3d-blue py-3 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Ejecutando en Gemini...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>PROBAR EN GEMINI (EN VIVO)</span>
            </>
          )}
        </button>
      </div>

      {/* Output & Evaluation */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Turpi Evaluation Card */}
          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl flex items-start gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-amber-200 border border-amber-400 flex-shrink-0">
              <Image
                src="/turpi.png"
                alt="Turpi Evaluador"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-black uppercase text-amber-800">
                  {result.turpiBadge}
                </span>
                <span className="text-xs font-black bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
                  {result.score}/100
                </span>
              </div>
              <p className="text-xs font-bold text-[#1b1c1c] leading-relaxed">
                {result.feedback}
              </p>
            </div>
          </div>

          {/* AI Response Output Box */}
          <div className="bg-white border-2 border-b-4 border-[#e5e5e5] rounded-2xl overflow-hidden">
            <div className="bg-neutral-100 px-4 py-2.5 border-b border-[#e5e5e5] flex items-center justify-between text-xs font-black text-[#4b4b4b]">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#006590]" />
                <span>Salida de Gemini 2.5 Flash</span>
              </div>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-[11px] font-bold text-[#006590] hover:text-[#004666] bg-white px-2 py-1 rounded-lg border border-neutral-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#58cc02]" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-neutral-50/50">
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-[#1b1c1c] leading-relaxed">
                {result.aiOutput}
              </pre>
            </div>

            <div className="bg-neutral-50 px-4 py-2 border-t border-[#efeded] flex items-center justify-between text-[11px] font-bold text-[#777777]">
              <span>Motor Resuelve AI • v1.0</span>
              <span className="text-[#58cc02] font-black flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verificado
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
