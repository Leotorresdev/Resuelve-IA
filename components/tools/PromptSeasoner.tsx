"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, ArrowRight, Wand2, Lightbulb } from "lucide-react";
import TurpiVoiceButton from "@/components/mascot/TurpiVoiceButton";

interface RecipeExample {
  title: string;
  category: "liceo" | "comercio" | "oficio" | "ciudadano";
  lazyPrompt: string;
  seasonedPrompt: {
    role: string;
    task: string;
    context: string;
    format: string;
  };
  whyItWorks: string;
}

const EXAMPLES: RecipeExample[] = [
  {
    title: "La Exposición Escolar de 20 Puntos 🎒",
    category: "liceo",
    lazyPrompt: "Dame un resumen de la Batalla de Carabobo para exponer.",
    seasonedPrompt: {
      role: "Ponte en el papel de un profesor de historia de bachillerato en Venezuela.",
      task: "Estructura una exposición oral sobre la Batalla de Carabobo para un estudiante de 3er año.",
      context: "El estudiante tiene solo 2 minutos para hablar y los compañeros se aburren rápido.",
      format: "Dame: (1) Un gancho inicial para captar atención, (2) 3 puntos clave para la lámina de papel bond, y (3) Las 2 preguntas difíciles que podría hacerme el profesor con sus respuestas preparadas.",
    },
    whyItWorks: "En vez de darte un texto gigante de Wikipedia que nadie lee, te prepara exactamente para pararte frente al salón y sacar la nota máxima sin memorizar.",
  },
  {
    title: "El Cliente que Pide Rebaja en WhatsApp 🛍️",
    category: "comercio",
    lazyPrompt: "Qué le digo a un cliente que dice que mi producto es muy caro.",
    seasonedPrompt: {
      role: "Actúa como un experto en ventas por WhatsApp en Caracas con trato muy amable.",
      task: "Redacta una respuesta para un cliente que pide rebaja en unos zapatos de $25.",
      context: "No queremos bajar el precio base porque la suela es importada y duradera.",
      format: "En un mensajito de 4 líneas con emojis: saluda con cariño, destaca la garantía y ofrece delivery gratis o 5% de descuento solo si paga de inmediato por Pago Móvil.",
    },
    whyItWorks: "Defiende el dinero de tu negocio, evita que el cliente se vaya a otra tienda y cierra la venta con métodos de pago reales de Venezuela.",
  },
  {
    title: "Presupuesto Técnico sin que el Cliente Huya 🔧",
    category: "oficio",
    lazyPrompt: "Presupuesto para arreglar un aire acondicionado.",
    seasonedPrompt: {
      role: "Actúa como un técnico profesional en refrigeración.",
      task: "Redacta un presupuesto formal de reparación para enviar por WhatsApp.",
      context: "El aire acondicionado split de 12.000 BTU no enfría por fuga en tubería y capacitor dañado. Mano de obra: $35, repuestos: $25.",
      format: "Estructúralo con: diagnóstico claro en lenguaje sencillo, desglose de repuestos con garantía de 3 meses, total y datos de Pago Móvil / Efectivo.",
    },
    whyItWorks: "Un presupuesto formal y desglosado genera 3 veces más confianza que decir 'eso te sale en $60' al aire.",
  },
  {
    title: "Carta de Reclamo Técnico a Cantv / Fibra 🏠",
    category: "ciudadano",
    lazyPrompt: "Carta para reclamar que no tengo internet.",
    seasonedPrompt: {
      role: "Ponte en el papel de un analista legal y de atención al usuario.",
      task: "Redacta una carta formal de reclamo dirigida a la empresa de telecomunicaciones.",
      context: "El servicio de internet en el contrato [0212-XXXXXXX] lleva 12 días sin tono ni conexión. Se han hecho 3 reportes telefónicos sin solución.",
      format: "Carta formal de 3 párrafos: antecedentes con fechas, exigencia de número de ticket de soporte técnico y petición de exoneración de la renta mensual por días sin servicio.",
    },
    whyItWorks: "Las empresas de servicios en Venezuela no responden a quejas informales. Responden a contratos, fechas y solicitudes de tickets formales.",
  },
];

export default function PromptSeasoner() {
  const [selectedExample, setSelectedExample] = useState<RecipeExample>(EXAMPLES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const fullPromptText = `${selectedExample.seasonedPrompt.role} ${selectedExample.seasonedPrompt.task} ${selectedExample.seasonedPrompt.context} ${selectedExample.seasonedPrompt.format}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-2 border-b-4 border-[#e5e5e5] rounded-3xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#1b1c1c] tracking-tight">
              El Sazonador Mágico de Prompts 🪄
            </h3>
            <p className="text-xs text-[#777777] font-semibold">
              Mira la diferencia entre pedirle a la IA como novato vs. como maestro
            </p>
          </div>
        </div>
      </div>

      {/* Preset Category Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.title}
            onClick={() => setSelectedExample(ex)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl border-2 text-xs font-black transition-all ${
              selectedExample.title === ex.title
                ? "bg-purple-50 border-purple-400 text-purple-900 border-b-3"
                : "bg-neutral-50 border-[#e5e5e5] text-[#4b4b4b] hover:border-neutral-300"
            }`}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Before vs After Comparison Card */}
      <div className="space-y-3 pt-1">
        {/* The Lazy Prompt */}
        <div className="bg-rose-50/70 border-2 border-rose-200 p-3.5 rounded-2xl">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#ff4b4b] bg-white px-2 py-0.5 rounded-md border border-rose-200">
            ❌ CÓMO LO PIDE EL 90% DE LA GENTE (PROMPT FLOJO)
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#1b1c1c] mt-1.5 italic">
            "{selectedExample.lazyPrompt}"
          </p>
          <span className="text-[11px] text-[#ff4b4b] font-bold block mt-1">
            Resultado: La IA te da una respuesta fría, genérica o robótica que no te sirve.
          </span>
        </div>

        {/* The Seasoned Prompt with 4 Ingredients */}
        <div className="bg-emerald-50/80 border-2 border-[#58cc02] p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#166534] bg-white px-2 py-0.5 rounded-md border border-emerald-300">
              ✨ SAZONADO CON LA RECETA DE LOS 4 INGREDIENTES
            </span>

            <div className="flex items-center gap-1.5">
              <TurpiVoiceButton
                textToSpeak={`Este es el prompt maestro: ${selectedExample.seasonedPrompt.role}. ${selectedExample.seasonedPrompt.task}. ${selectedExample.seasonedPrompt.context}. ${selectedExample.seasonedPrompt.format}`}
                size="sm"
              />

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
                    <span>Copiar Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-xs sm:text-sm font-semibold text-[#1b1c1c] leading-relaxed space-y-1.5 bg-white/90 p-3 rounded-xl border border-emerald-200">
            <p>
              <span className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded-md font-black text-[11px]">
                1. EL PERSONAJE:
              </span>{" "}
              {selectedExample.seasonedPrompt.role}
            </p>
            <p>
              <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded-md font-black text-[11px]">
                2. EL ENCARGO:
              </span>{" "}
              {selectedExample.seasonedPrompt.task}
            </p>
            <p>
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md font-black text-[11px]">
                3. LOS INGREDIENTES:
              </span>{" "}
              {selectedExample.seasonedPrompt.context}
            </p>
            <p>
              <span className="bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded-md font-black text-[11px]">
                4. LA PRESENTACIÓN:
              </span>{" "}
              {selectedExample.seasonedPrompt.format}
            </p>
          </div>

          <div className="flex items-start gap-2 pt-1 text-xs text-[#166534] font-bold">
            <Lightbulb className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">{selectedExample.whyItWorks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
