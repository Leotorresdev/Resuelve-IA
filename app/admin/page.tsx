"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Search,
  MessageCircle,
  Tag,
  Clock,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

interface ProblemSubmission {
  id: string;
  createdAt: string;
  persona: string;
  rubroTitle: string;
  problemDescription: string;
  timeOrMoneyLost?: string;
  contact?: string;
  aiGeneratedPrompt?: string;
  status: string;
  tags: string[];
}

export default function AdminPage() {
  const [problems, setProblems] = useState<ProblemSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/problems");
      const data = await res.json();
      if (data.success && data.problems) {
        setProblems(data.problems);
      }
    } catch (err) {
      console.error("Error fetching problems:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const filtered = problems.filter((p) => {
    const matchesSearch =
      p.problemDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.rubroTitle.toLowerCase().includes(search.toLowerCase()) ||
      (p.contact || "").includes(search);
    const matchesTag = !selectedTag || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[#fbf9f8] p-4 sm:p-8 selection:bg-[#58cc02]/20 text-[#1b1c1c]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-black text-[#58cc02] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Resuelve AI</span>
          </Link>

          <span className="text-[10px] font-black uppercase tracking-wider bg-neutral-200/70 text-neutral-700 px-2.5 py-1 rounded-full">
            Panel Privado de Oportunidades SaaS 🇻🇪
          </span>
        </div>

        {/* Header Hero */}
        <div className="bg-gradient-to-r from-[#1b1c1c] to-[#303030] text-white p-6 rounded-3xl shadow-xl flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#58cc02] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Radar de Problemas • Business Intelligence</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Fábrica de Micro-SaaS por Demanda
            </h1>
            <p className="text-xs text-neutral-300 font-semibold mt-1 max-w-xl">
              Aquí ves exactamente qué le duele a la gente en Venezuela, cuántas horas pierden y su contacto para validar software antes de programarlo.
            </p>
          </div>

          <button
            onClick={fetchProblems}
            disabled={loading}
            className="btn-3d-green p-3 rounded-2xl flex items-center gap-1.5 text-xs font-black"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border-2 border-[#e5e5e5] p-4 rounded-2xl">
            <span className="text-xs font-bold text-[#777777]">Casos Recibidos</span>
            <div className="text-2xl font-black text-[#1b1c1c] mt-0.5">
              {problems.length}
            </div>
          </div>

          <div className="bg-white border-2 border-[#e5e5e5] p-4 rounded-2xl">
            <span className="text-xs font-bold text-[#777777]">Comercio y Ventas</span>
            <div className="text-2xl font-black text-[#58cc02] mt-0.5">
              {problems.filter((p) => p.persona === "comercio").length}
            </div>
          </div>

          <div className="bg-white border-2 border-[#e5e5e5] p-4 rounded-2xl">
            <span className="text-xs font-bold text-[#777777]">Liceo y Estudio</span>
            <div className="text-2xl font-black text-[#1cb0f6] mt-0.5">
              {problems.filter((p) => p.persona === "liceo").length}
            </div>
          </div>

          <div className="bg-white border-2 border-[#e5e5e5] p-4 rounded-2xl">
            <span className="text-xs font-bold text-[#777777]">Con Teléfono / WhatsApp</span>
            <div className="text-2xl font-black text-[#ff9600] mt-0.5">
              {problems.filter((p) => Boolean(p.contact)).length}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border-2 border-[#e5e5e5] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por problema, rubro o teléfono..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl font-bold focus:outline-none focus:border-[#58cc02]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedTag === null
                  ? "bg-[#1b1c1c] text-white"
                  : "bg-neutral-100 text-[#777777]"
              }`}
            >
              Todos ({problems.length})
            </button>
            {["finanzas_pagos", "ventas_redes", "educacion_liceo", "servicios_tecnicos"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedTag === tag
                      ? "bg-[#58cc02] text-white"
                      : "bg-neutral-100 text-[#777777]"
                  }`}
                >
                  {tag.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>

        {/* List of Problems */}
        {filtered.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#e5e5e5] rounded-3xl p-12 text-center text-[#777777] space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-neutral-400" />
            <h4 className="text-sm font-black text-[#1b1c1c]">
              No hay problemas registrados aún
            </h4>
            <p className="text-xs">
              Cuando los usuarios envíen sus dolores de cabeza a través del Radar en la app, aparecerán aquí para que planifiques los próximos softwares.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-b-4 border-[#e5e5e5] p-5 rounded-2xl space-y-3 hover:border-neutral-300 transition-all text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-neutral-100 px-2.5 py-1 rounded-lg">
                      {item.rubroTitle}
                    </span>
                    <span className="text-[10px] text-[#777777] font-bold">
                      {new Date(item.createdAt).toLocaleDateString("es-VE", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {item.contact ? (
                    <a
                      href={`https://wa.me/${item.contact.replace(/\D/g, "")}?text=Hola,%20te%20escribo%20del%20equipo%20de%20Resuelve%20AI%20sobre%20el%20caso%20que%20registraste.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-300 hover:bg-emerald-100 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{item.contact}</span>
                    </a>
                  ) : (
                    <span className="text-[10px] text-[#777777] italic font-semibold">
                      Sin contacto
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#1b1c1c] leading-relaxed">
                    "{item.problemDescription}"
                  </h3>
                  {item.timeOrMoneyLost && (
                    <div className="flex items-center gap-1 text-xs text-[#ff9600] font-bold mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Impacto: {item.timeOrMoneyLost}</span>
                    </div>
                  )}
                </div>

                {/* AI Generated Prompt Provided to User */}
                {item.aiGeneratedPrompt && (
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs">
                    <span className="text-[10px] font-black uppercase text-[#777777] block mb-1">
                      Solución inmediata otorgada al usuario:
                    </span>
                    <p className="text-[#4b4b4b] font-mono leading-relaxed line-clamp-3">
                      {item.aiGeneratedPrompt}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
