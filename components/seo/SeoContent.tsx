"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, BookOpen, ShoppingBag, ShieldCheck, HelpCircle } from "lucide-react";

export default function SeoContent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer className="w-full max-w-xl mx-auto px-4 pt-6 pb-28 text-left border-t border-[#efeded] mt-8">
      {/* Collapsible FAQ & SEO Guide Drawer */}
      <div className="bg-white border-2 border-[#e5e5e5] rounded-3xl p-5 shadow-xs">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#58cc02]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#1b1c1c]">
              Guía Educativa & Preguntas Frecuentes (FAQ) 🇻🇪
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#777777] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-4 space-y-5 text-xs text-[#4b4b4b] font-semibold border-t border-[#f0f0f0] pt-4 animate-in fade-in duration-150">
            {/* SEO Section 1: Intro */}
            <article>
              <h1 className="text-sm font-black text-[#1b1c1c] mb-1">
                Resuelve AI: Aprende a Usar Inteligencia Artificial en Venezuela
              </h1>
              <p className="leading-relaxed text-[#777777]">
                <strong>Resuelve AI</strong> es la primera plataforma gamificada estilo Duolingo diseñada para enseñar a personas comunes, comerciantes y estudiantes de Venezuela a dominar herramientas de IA como ChatGPT y Gemini en micro-lecciones de 3 minutos al día.
              </p>
            </article>

            {/* SEO Section 2: Method */}
            <article>
              <h2 className="text-xs font-black text-[#1b1c1c] uppercase tracking-wider mb-1 flex items-center gap-1.5 text-[#58cc02]">
                <Sparkles className="w-3.5 h-3.5" />
                La Fórmula de los 4 Ingredientes de Turpi
              </h2>
              <p className="leading-relaxed text-[#777777]">
                Para obtener respuestas profesionales de la IA sin que alucine ni hable con modismos extraños, enseñamos la metodología R-T-C-F adaptada al contexto venezolano:
              </p>
              <ul className="list-disc pl-4 space-y-1 mt-1 text-[#4b4b4b]">
                <li><strong>1. El Personaje (Rol):</strong> Quién es la IA (ej. Asesor de ventas en Caracas o profesor de física).</li>
                <li><strong>2. El Encargo (Tarea):</strong> La acción concreta que debe ejecutar.</li>
                <li><strong>3. Los Ingredientes (Contexto):</strong> Datos reales (precios en dólares, tasa oficial BCV, Pago Móvil).</li>
                <li><strong>4. La Presentación (Formato):</strong> Longitud exacta, emojis, puntos clave o guión de exposición.</li>
              </ul>
            </article>

            {/* SEO Section 3: School */}
            <article>
              <h2 className="text-xs font-black text-[#1b1c1c] uppercase tracking-wider mb-1 flex items-center gap-1.5 text-[#1cb0f6]">
                <BookOpen className="w-3.5 h-3.5" />
                Para Estudiantes de Escuelas y Liceos
              </h2>
              <p className="leading-relaxed text-[#777777]">
                Resuelve AI ayuda a los estudiantes de bachillerato a usar la IA como un tutor personal para preparar exposiciones en láminas de papel bond, comprender materias difíciles (química, matemáticas y física) y evitar que los profesores sospechen de plagio por palabras traducidas.
              </p>
            </article>

            {/* SEO Section 4: Business */}
            <article>
              <h2 className="text-xs font-black text-[#1b1c1c] uppercase tracking-wider mb-1 flex items-center gap-1.5 text-[#ff9600]">
                <ShoppingBag className="w-3.5 h-3.5" />
                Para Negocios y Emprendedores
              </h2>
              <p className="leading-relaxed text-[#777777]">
                Aprende a redactar respuestas automáticas para retener clientes indecisos en Instagram y WhatsApp, presupuestos formales para talleres y mensajes de cobranza respetuosos listos para enviar.
              </p>
            </article>

            <div className="pt-2 text-[10px] text-[#777777] border-t border-[#f5f5f5] flex items-center justify-between">
              <span>© 2026 Resuelve AI • Todos los derechos reservados</span>
              <span className="flex items-center gap-1 text-[#58cc02] font-black">
                <ShieldCheck className="w-3.5 h-3.5" /> SEO Optimizado para Venezuela
              </span>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
