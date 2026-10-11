"use client";

import { useState } from "react";
import { PuzzleBlock } from "@/lib/data/lessonsData";
import { Layers, ArrowDown, RotateCcw } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

interface PromptPuzzleProps {
  goal: string;
  formula: string;
  availableBlocks: PuzzleBlock[];
  correctOrderIds: string[];
  turpiTip: string;
  onAnswerChecked: (isCorrect: boolean, explanation: string) => void;
  disabled?: boolean;
}

export default function PromptPuzzle({
  goal,
  formula,
  availableBlocks,
  correctOrderIds,
  turpiTip,
  onAnswerChecked,
  disabled = false,
}: PromptPuzzleProps) {
  const [selectedBlocks, setSelectedBlocks] = useState<PuzzleBlock[]>([]);
  const [poolBlocks, setPoolBlocks] = useState<PuzzleBlock[]>(availableBlocks);

  const handleAddBlock = (block: PuzzleBlock) => {
    if (disabled) return;
    sounds.playTap();
    setSelectedBlocks((prev) => [...prev, block]);
    setPoolBlocks((prev) => prev.filter((b) => b.id !== block.id));
  };

  const handleRemoveBlock = (block: PuzzleBlock) => {
    if (disabled) return;
    sounds.playTap();
    setPoolBlocks((prev) => [...prev, block]);
    setSelectedBlocks((prev) => prev.filter((b) => b.id !== block.id));
  };

  const handleReset = () => {
    if (disabled) return;
    sounds.playTap();
    setSelectedBlocks([]);
    setPoolBlocks(availableBlocks);
  };

  const checkOrder = () => {
    const currentIds = selectedBlocks.map((b) => b.id);
    const isCorrect =
      currentIds.length === correctOrderIds.length &&
      currentIds.every((id, idx) => id === correctOrderIds[idx]);

    const explanation = isCorrect
      ? "¡Excelente ensamblaje! Cada bloque cumple su función: Rol, Tarea, Contexto y Formato."
      : "El orden no es el óptimo para la IA. Recuerda la fórmula: primero defines el [Rol], luego la [Tarea], luego el [Contexto] y finalmente el [Formato].";

    onAnswerChecked(isCorrect, explanation);
  };

  return (
    <div className="space-y-4">
      {/* Objective Card */}
      <div className="bg-purple-50/70 border-2 border-purple-200 p-4 rounded-2xl">
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-purple-800">
            <Layers className="w-3.5 h-3.5" />
            <span>Fórmula: {formula}</span>
          </div>
          {selectedBlocks.length > 0 && !disabled && (
            <button
              onClick={handleReset}
              className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reiniciar
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm font-bold text-[#1b1c1c] leading-relaxed">
          {goal}
        </p>
      </div>

      {/* Assembly Tray */}
      <div className="bg-neutral-100/90 border-2 border-dashed border-neutral-300 rounded-2xl p-3 min-h-[140px] flex flex-col justify-start gap-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#777777] mb-1">
          Bandeja de Construcción (Toca un bloque para retirarlo):
        </span>

        {selectedBlocks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-[#777777] font-semibold italic py-6">
            Toca los bloques de abajo en orden para construir el prompt...
          </div>
        ) : (
          selectedBlocks.map((block, idx) => (
            <button
              key={block.id}
              disabled={disabled}
              onClick={() => handleRemoveBlock(block)}
              className={`text-left p-3 rounded-xl border-2 border-b-3 transition-all flex items-center justify-between gap-2 shadow-xs ${block.colorClass} hover:opacity-85`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-black/10 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold leading-snug">
                  {block.text}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded-md flex-shrink-0">
                {block.category}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Available Blocks Pool */}
      {poolBlocks.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#777777] block">
            Bloques Disponibles (Toca para agregar):
          </span>
          <div className="grid grid-cols-1 gap-2">
            {poolBlocks.map((block) => (
              <button
                key={block.id}
                disabled={disabled}
                onClick={() => handleAddBlock(block)}
                className={`text-left p-3 rounded-xl border-2 border-b-3 transition-all flex items-center justify-between gap-2 shadow-xs bg-white border-[#e5e5e5] hover:border-neutral-300 active:translate-y-0.5`}
              >
                <span className="text-xs font-bold text-[#1b1c1c] leading-snug">
                  {block.text}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-neutral-100 text-[#4b4b4b] px-2 py-0.5 rounded-md flex-shrink-0">
                  {block.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trigger Verify Button if all blocks chosen and not yet answered */}
      {selectedBlocks.length === availableBlocks.length && !disabled && (
        <button
          onClick={checkOrder}
          className="w-full btn-3d-green py-3 rounded-xl text-sm font-black uppercase tracking-wider shadow-sm mt-2"
        >
          COMPROBAR ENSAMBLAJE
        </button>
      )}
    </div>
  );
}
