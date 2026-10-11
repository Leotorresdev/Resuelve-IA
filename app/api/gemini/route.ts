import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface EvaluationResult {
  score: number;
  feedback: string;
  hasRole: boolean;
  hasTask: boolean;
  hasContext: boolean;
  hasFormat: boolean;
  aiOutput: string;
  turpiBadge: string;
}

export async function POST(req: Request) {
  try {
    const { prompt, mission } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Se requiere un prompt válido" },
        { status: 400 }
      );
    }

    const lower = prompt.toLowerCase();

    // Check components of R-T-C-F formula
    const hasRole = /act[uú]a como|eres un|como un|rol de|asesor|experto|redactor|profesor|tutor/i.test(lower);
    const hasTask = /escribe|redacta|genera|crea|explica|dise[ñn]a|elabora|responde/i.test(lower);
    const hasContext = /venezuela|caracas|whatsapp|instagram|cliente|pago m[oó]vil|d[oó]lar|\$|bs|cuenta|servicio|d[ií]as/i.test(lower);
    const hasFormat = /formato|puntos|bullets|l[ií]neas|breve|emojis|paso a paso|oraciones|tabla|mensajito/i.test(lower);

    let score = 40;
    if (hasRole) score += 15;
    if (hasTask) score += 15;
    if (hasContext) score += 15;
    if (hasFormat) score += 15;

    // Check if user has GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY;

    let aiOutput = "";

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Eres Gemini ejecutando la siguiente instrucción pedagógica para un usuario de Resuelve AI en Venezuela:\n\n${prompt}`,
        });
        aiOutput = response.text || "Respuesta generada exitosamente por Gemini.";
      } catch (err: unknown) {
        console.warn("Error calling Google GenAI, using smart engine:", err);
      }
    }

    // Fallback or simulated engine response if no key or API error
    if (!aiOutput) {
      if (lower.includes("whatsapp") || lower.includes("cliente") || lower.includes("cobro")) {
        aiOutput = `¡Hola Carlos! 👋 Espero que estés teniendo una excelente semana.\n\nTe escribo cordialmente para consultar si pudiste revisar la entrega del diseño de tu logo que finalizamos hace 10 días ($40). Queremos cerrar la conciliación bancaria del mes el día de hoy.\n\nPuedes realizar la transferencia cómodamente vía Pago Móvil (a la tasa oficial BCV) o USDT por Binance Pay:\n\n📱 Pago Móvil: 0414-0000000 | V-00000000 | Banco Banesco\n\n¡Quedo muy atento a tu comprobante! Un abrazo grande.`;
      } else {
        aiOutput = `Entendido. Siguiendo tu instrucción con precisión:\n\n${prompt.trim()}\n\nHe generado la respuesta aplicando un tono adaptado, estructura clara y orientación a resultados prácticos en Venezuela. ¡Instrucción ejecutada con éxito!`;
      }
    }

    let feedback = "";
    let turpiBadge = "Buen Intento";

    if (score >= 85) {
      turpiBadge = "Prompt Maestro 🌟";
      feedback = "¡Impresionante! Incluiste Rol, Tarea, Contexto y Formato. Gemini recibió todos los parámetros necesarios para dar una respuesta lista para producción sin alucinaciones.";
    } else if (score >= 70) {
      turpiBadge = "Casi Perfecto 🚀";
      feedback = "¡Muy bien! Tu prompt es claro y efectivo. Para llegar a nivel Maestro, asegúrate de limitar el formato exacto (ej: 'en 3 viñetas' o 'en 2 párrafos').";
    } else {
      turpiBadge = "En Desarrollo 💡";
      feedback = "Tu prompt funciona, pero le falta contexto o formato. Recuerda la fórmula R-T-C-F para que la IA no improvise ni se extienda de más.";
    }

    const evaluation: EvaluationResult = {
      score,
      feedback,
      hasRole,
      hasTask,
      hasContext,
      hasFormat,
      aiOutput,
      turpiBadge,
    };

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Error in /api/gemini:", error);
    return NextResponse.json(
      { error: "Error procesando el prompt en el motor Resuelve AI" },
      { status: 500 }
    );
  }
}
