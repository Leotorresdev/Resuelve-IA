"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  PlusCircle,
  FileCheck,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Coins,
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Briefcase,
  GraduationCap,
  Store,
  Download,
  X,
} from "lucide-react";
import { Bounty, BountyCategory } from "@/lib/data/bountiesData";
import { useUserStore } from "@/lib/store";
import BountySolverModal from "@/components/bounties/BountySolverModal";
import { sounds } from "@/lib/soundEffects";
import confetti from "canvas-confetti";

interface BountiesTabProps {
  onOpenWallet: () => void;
}

export default function BountiesTab({ onOpenWallet }: BountiesTabProps) {
  const store = useUserStore();

  const [activeSubTab, setActiveSubTab] = useState<"solve" | "post" | "my_tasks">("solve");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeBountyForSolving, setActiveBountyForSolving] = useState<Bounty | null>(null);

  // Deliverable view modal for completed tasks
  const [viewDeliverableBounty, setViewDeliverableBounty] = useState<Bounty | null>(null);
  const [copiedDeliverable, setCopiedDeliverable] = useState(false);

  // Post Task Form State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState<BountyCategory>("liceo");
  const [taskAuthor, setTaskAuthor] = useState(store.name || "Estudiante");
  const [taskAuthorRole, setTaskAuthorRole] = useState("Estudiante de Bachillerato");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskRequirements, setTaskRequirements] = useState("");
  const [taskFormat, setTaskFormat] = useState("Informe estructurado con portada ficticia, subtítulos y conclusión");
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccessMessage, setPostSuccessMessage] = useState<string | null>(null);

  // Filter open bounties for the "solve" tab
  const openBounties = store.bounties.filter((b) => {
    if (selectedCategory === "all") return true;
    return b.category === selectedCategory;
  });

  // Handle Post Bounty
  const handlePostBounty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDescription.trim() || !taskRequirements.trim()) {
      alert("Por favor completa el título, descripción y requisitos de la tarea.");
      return;
    }

    if (store.tokenBalance < 1) {
      // Prompt user to buy tokens
      alert("No tienes suficientes Tokens. Te abriremos la billetera para recargar 1 Token ($1.00 USD) o pagar con tarjeta Visa/Mastercard.");
      onOpenWallet();
      return;
    }

    setIsPosting(true);
    setPostSuccessMessage(null);

    // Split requirements by newlines or commas
    const reqArray = taskRequirements
      .split(/\n|,/)
      .map((r) => r.trim())
      .filter((r) => r.length > 5);

    const categoryLabels: Record<BountyCategory, string> = {
      liceo: "🎓 Liceo / Bachillerato",
      universidad: "🏛️ Universidad",
      trabajo: "💼 Trabajo / Oficina",
      negocio: "🚀 Negocio / Ventas",
    };

    setTimeout(() => {
      const newBounty = store.postBounty({
        title: taskTitle.trim(),
        category: taskCategory,
        categoryLabel: categoryLabels[taskCategory],
        authorName: taskAuthor.trim(),
        authorRole: taskAuthorRole.trim(),
        description: taskDescription.trim(),
        requirements: reqArray.length > 0 ? reqArray : [taskRequirements.trim()],
        expectedFormat: taskFormat.trim(),
        paymentMethod: "token",
      });

      setIsPosting(false);
      sounds.playCelebration();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      setPostSuccessMessage(
        `¡Tarea publicada con éxito! Descontamos 1 Token ($1.00 USD). Los solucionadores de la comunidad ya pueden verla.`
      );

      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setTaskRequirements("");
      setActiveSubTab("my_tasks");
    }, 400);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDeliverable(true);
    setTimeout(() => setCopiedDeliverable(false), 2000);
  };

  const handleDownloadFile = (title: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/[^a-zA-Z0-9_\u00C0-\u017F\s]/g, "").replace(/\s+/g, "_")}_resuelto.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Top Marketplace Banner & Wallet Quick Pill */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="bg-white/20 backdrop-blur-xs text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              Misiones Reales • Marketplace
            </span>
            <button
              type="button"
              onClick={onOpenWallet}
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-xs flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
            >
              <span>🪙 {store.tokenBalance} Tokens</span>
              <span className="border-l border-amber-600/40 pl-1">💵 ${store.earningsUsd.toFixed(2)}</span>
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Resuelve Tareas y Gana Dinero 💵
          </h1>

          <p className="text-xs text-emerald-100 font-medium leading-relaxed">
            Un marketplace bilateral donde estudiantes pagan <strong>$1.00 USD</strong> y los aprendices de IA ganan <strong>$0.30 USD + 50 XP</strong> por misión resolviéndola con el mejor prompt.
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-emerald-200">
            <span>Reparto: 30% Solucionador</span>
            <span>•</span>
            <span>70% Resuelve IA</span>
          </div>
        </div>
      </div>

      {/* Subtabs Switcher */}
      <div className="flex bg-neutral-200/80 p-1 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab("solve")}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "solve"
              ? "bg-white text-[#1b1c1c] shadow-xs"
              : "text-[#777777] hover:text-[#1b1c1c]"
          }`}
        >
          <span>🔥 Resolver y Ganar</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-md">
            $0.30
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("post")}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "post"
              ? "bg-white text-[#1b1c1c] shadow-xs"
              : "text-[#777777] hover:text-[#1b1c1c]"
          }`}
        >
          <span>📝 Pedir Tarea</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-md">
            $1.00
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("my_tasks")}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "my_tasks"
              ? "bg-white text-[#1b1c1c] shadow-xs"
              : "text-[#777777] hover:text-[#1b1c1c]"
          }`}
        >
          <span>💼 Mis Tareas</span>
        </button>
      </div>

      {/* SUBTAB 1: RESOLVER Y GANAR */}
      {activeSubTab === "solve" && (
        <div className="space-y-3">
          {/* Category Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "Todas" },
              { id: "liceo", label: "🎓 Liceo" },
              { id: "universidad", label: "🏛️ Universidad" },
              { id: "trabajo", label: "💼 Trabajo" },
              { id: "negocio", label: "🚀 Negocios" },
            ].map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#58cc02] border-[#58cc02] text-white shadow-2xs"
                    : "bg-white border-[#e5e5e5] text-[#777777] hover:border-neutral-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Bounties List */}
          <div className="space-y-3">
            {openBounties.map((bounty) => {
              const isSolvedByMe = store.mySolvedBountyIds.includes(bounty.id);

              return (
                <div
                  key={bounty.id}
                  className="bg-white border-2 border-[#e5e5e5] rounded-3xl p-4 sm:p-5 shadow-2xs hover:border-neutral-300 transition-all space-y-3"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="bg-amber-100 text-amber-800 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
                      {bounty.categoryLabel}
                    </span>
                    <span className="text-xs text-[#777777] font-semibold">
                      Publicado por <strong>{bounty.authorName}</strong> ({bounty.authorRole})
                    </span>
                  </div>

                  {/* Card Title & Description */}
                  <div>
                    <h3 className="text-base font-black text-[#1b1c1c] leading-tight">
                      {bounty.title}
                    </h3>
                    <p className="text-xs text-[#555555] mt-1.5 line-clamp-3 leading-relaxed">
                      {bounty.description}
                    </p>
                  </div>

                  {/* Requirements Snippet */}
                  <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200 space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#777777] tracking-wider block">
                      Requisitos clave ({bounty.requirements.length}):
                    </span>
                    <ul className="text-[11px] text-[#333333] space-y-0.5 font-medium">
                      {bounty.requirements.slice(0, 3).map((req, i) => (
                        <li key={i} className="truncate">
                          • {req}
                        </li>
                      ))}
                      {bounty.requirements.length > 3 && (
                        <li className="text-[#777777] font-bold text-[10px]">
                          + {bounty.requirements.length - 3} requisitos más en la misión
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Footer & CTA */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-[#58cc02]" />
                      <span>Recompensa: +${bounty.rewardUsd.toFixed(2)} USD</span>
                      <span className="text-[#1cb0f6]">• +50 XP</span>
                    </div>

                    {isSolvedByMe ? (
                      <button
                        type="button"
                        onClick={() => setViewDeliverableBounty(bounty)}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-[#58cc02]" />
                        Ver Entrega
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveBountyForSolving(bounty)}
                        className="bg-[#58cc02] hover:bg-[#46a302] active:translate-y-0.5 text-white font-black text-xs uppercase px-4 py-2.5 rounded-xl shadow-[0_3px_0_0_#46a302] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Resolver Misión 🎯
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PEDIR UNA TAREA ($1.00) */}
      {activeSubTab === "post" && (
        <div className="bg-white border-2 border-[#e5e5e5] rounded-3xl p-4 sm:p-6 shadow-2xs space-y-4">
          <div className="pb-2 border-b border-neutral-100">
            <h2 className="text-base font-black text-[#1b1c1c] tracking-tight">
              Pide que te Resuelvan una Tarea o Trabajo
            </h2>
            <p className="text-xs text-[#777777] font-semibold mt-0.5">
              Publica tu tarea por $1.00 USD (o 1 Token). Un miembro de la comunidad diseñará el prompt ideal y la IA generará el trabajo completo listo para entregar.
            </p>
          </div>

          {postSuccessMessage && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 text-xs text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{postSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handlePostBounty} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-black uppercase text-[#555555] block mb-1">
                Título de la Tarea / Trabajo
              </label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Ej: Trabajo de Biología sobre la Mitosis y Meiosis para 4to año de liceo"
                className="w-full px-3 py-2.5 border-2 border-[#e5e5e5] rounded-xl text-xs sm:text-sm font-semibold text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase text-[#555555] block mb-1">
                  Categoría
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as BountyCategory)}
                  className="w-full px-3 py-2.5 border-2 border-[#e5e5e5] rounded-xl text-xs font-bold text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden bg-white"
                >
                  <option value="liceo">🎓 Liceo / Bachillerato</option>
                  <option value="universidad">🏛️ Universidad</option>
                  <option value="trabajo">💼 Trabajo / Oficina</option>
                  <option value="negocio">🚀 Negocio / Ventas</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-[#555555] block mb-1">
                  Tu Rol / Nivel
                </label>
                <input
                  type="text"
                  required
                  value={taskAuthorRole}
                  onChange={(e) => setTaskAuthorRole(e.target.value)}
                  placeholder="Ej: Estudiante 4to año, Pasante..."
                  className="w-full px-3 py-2.5 border-2 border-[#e5e5e5] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden"
                >
                </input>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-[#555555] block mb-1">
                ¿Qué pidió el profesor o jefe? (Descripción detallada)
              </label>
              <textarea
                rows={3}
                required
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Describe el contexto general, para cuándo es, qué temas debe abarcar..."
                className="w-full px-3 py-2.5 border-2 border-[#e5e5e5] rounded-xl text-xs font-medium text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-[#555555] block mb-1">
                Requisitos Obligatorios (1 por línea)
              </label>
              <textarea
                rows={3}
                required
                value={taskRequirements}
                onChange={(e) => setTaskRequirements(e.target.value)}
                placeholder={`1. Explicar las 4 fases de la mitosis\n2. Cuadro comparativo con 5 diferencias clave\n3. Conclusión reflexiva y bibliografía`}
                className="w-full px-3 py-2.5 border-2 border-[#e5e5e5] rounded-xl text-xs font-medium text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-[#555555] block mb-1">
                Formato de Entrega Deseado
              </label>
              <input
                type="text"
                value={taskFormat}
                onChange={(e) => setTaskFormat(e.target.value)}
                placeholder="Ej: Informe estructurado con portada ficticia, subtítulos y cuadro comparativo"
                className="w-full px-3 py-2.5 border-2 border-[#e5e5e5] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden"
              />
            </div>

            {/* Cost Breakdown & Payment Summary */}
            <div className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-[#1b1c1c]">
                <span>Costo de Publicación:</span>
                <span className="text-[#58cc02] text-sm font-black">$1.00 USD (o 1 Token 🪙)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#777777] font-semibold">
                <span>Tu saldo actual:</span>
                <span className="font-bold text-[#1b1c1c]">
                  {store.tokenBalance} Token(s) disponibles
                </span>
              </div>
            </div>

            {/* Post CTA */}
            {store.tokenBalance >= 1 ? (
              <button
                type="submit"
                disabled={isPosting}
                className="w-full bg-[#58cc02] hover:bg-[#46a302] active:translate-y-1 text-white font-black text-xs sm:text-sm uppercase py-3.5 rounded-2xl shadow-[0_4px_0_0_#46a302] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Coins className="w-4 h-4" />
                Publicar Tarea usando 1 Token 🪙
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenWallet}
                className="w-full bg-[#1cb0f6] hover:bg-[#1899d6] active:translate-y-1 text-white font-black text-xs sm:text-sm uppercase py-3.5 rounded-2xl shadow-[0_4px_0_0_#1899d6] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Pagar $1.00 USD con Tarjeta y Publicar
              </button>
            )}
          </form>
        </div>
      )}

      {/* SUBTAB 3: MIS TAREAS */}
      {activeSubTab === "my_tasks" && (
        <div className="space-y-4">
          {/* Posted by me */}
          <div>
            <h3 className="text-xs font-black uppercase text-[#555555] tracking-wider mb-2">
              Tareas que has pedido ({store.myPostedBountyIds.length})
            </h3>
            {store.myPostedBountyIds.length === 0 ? (
              <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 text-center text-xs text-[#777777] font-semibold">
                No has pedido ninguna tarea todavía. Ve a &quot;Pedir Tarea&quot; para publicar una.
              </div>
            ) : (
              <div className="space-y-2.5">
                {store.bounties
                  .filter((b) => store.myPostedBountyIds.includes(b.id))
                  .map((bounty) => (
                    <div
                      key={bounty.id}
                      className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                          {bounty.categoryLabel}
                        </span>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-full ${
                            bounty.status === "solved"
                              ? "bg-emerald-100 text-[#58cc02]"
                              : "bg-sky-100 text-[#1cb0f6]"
                          }`}
                        >
                          {bounty.status === "solved" ? "✅ Resuelta" : "⏳ Buscando Solucionador"}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-[#1b1c1c]">{bounty.title}</h4>
                      {bounty.status === "solved" && bounty.generatedDeliverable && (
                        <button
                          type="button"
                          onClick={() => setViewDeliverableBounty(bounty)}
                          className="w-full mt-2 bg-[#58cc02] text-white font-black text-xs py-2 rounded-xl flex items-center justify-center gap-1 shadow-xs hover:bg-[#46a302] transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Ver y Descargar mi Trabajo Resuelto
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Solved by me */}
          <div>
            <h3 className="text-xs font-black uppercase text-[#555555] tracking-wider mb-2">
              Tareas que has resuelto ({store.mySolvedBountyIds.length})
            </h3>
            {store.mySolvedBountyIds.length === 0 ? (
              <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 text-center text-xs text-[#777777] font-semibold">
                Aún no has resuelto ninguna misión. ¡Visita la pestaña &quot;Resolver y Ganar&quot; para ganar $0.30 USD por cada una!
              </div>
            ) : (
              <div className="space-y-2.5">
                {store.bounties
                  .filter((b) => store.mySolvedBountyIds.includes(b.id))
                  .map((bounty) => (
                    <div
                      key={bounty.id}
                      className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          +{bounty.rewardUsd.toFixed(2)} USD Ganados 💵
                        </span>
                        <span className="text-xs font-black text-[#58cc02]">
                          Nota: {bounty.score || 95}/100 🌟
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-[#1b1c1c]">{bounty.title}</h4>
                      <button
                        type="button"
                        onClick={() => setViewDeliverableBounty(bounty)}
                        className="w-full mt-1 bg-neutral-100 hover:bg-neutral-200 text-[#1b1c1c] font-black text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-[#58cc02]" />
                        Ver Solución Entregada
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Solver Workspace Modal */}
      {activeBountyForSolving && (
        <BountySolverModal
          bounty={activeBountyForSolving}
          isOpen={true}
          onClose={() => setActiveBountyForSolving(null)}
          onSuccess={() => {
            setActiveBountyForSolving(null);
            setActiveSubTab("my_tasks");
          }}
        />
      )}

      {/* Deliverable Reader Modal */}
      {viewDeliverableBounty && viewDeliverableBounty.generatedDeliverable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl border-2 border-[#e5e5e5] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in duration-200">
            <div className="px-5 py-3.5 border-b-2 border-[#e5e5e5] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#1b1c1c]">
                  {viewDeliverableBounty.title}
                </h3>
                <span className="text-xs text-[#777777] font-semibold">
                  Solución generada con Resuelve IA
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewDeliverableBounty(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-[#777777]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500">
                  Formato: Markdown Académico
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(viewDeliverableBounty.generatedDeliverable || "")}
                    className="flex items-center gap-1 text-xs font-bold text-[#58cc02] bg-emerald-50 px-2.5 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
                  >
                    {copiedDeliverable ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copiar
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadFile(
                        viewDeliverableBounty.title,
                        viewDeliverableBounty.generatedDeliverable || ""
                      )
                    }
                    className="flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1.5 rounded-xl hover:bg-sky-100 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar .md
                  </button>
                </div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs sm:text-sm text-neutral-800 font-sans whitespace-pre-wrap leading-relaxed">
                {viewDeliverableBounty.generatedDeliverable}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
