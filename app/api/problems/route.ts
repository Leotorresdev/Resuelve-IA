import { NextResponse } from "next/server";
import { getAllProblems, saveProblem } from "@/lib/db/problems";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  try {
    const problems = await getAllProblems();

    // Compute basic analytics for Admin
    const rubroCounts: Record<string, number> = {};
    problems.forEach((p) => {
      rubroCounts[p.persona] = (rubroCounts[p.persona] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      total: problems.length,
      rubroCounts,
      problems,
    });
  } catch (error) {
    console.error("Error in GET /api/problems:", error);
    return NextResponse.json(
      { error: "Error obteniendo la lista de problemas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { persona, rubroTitle, problemDescription, timeOrMoneyLost, desiredSolution, contact } = body;

    if (!problemDescription || typeof problemDescription !== "string" || !problemDescription.trim()) {
      return NextResponse.json(
        { error: "Por favor describe el problema que deseas solucionar" },
        { status: 400 }
      );
    }

    // Auto-tagging based on keywords
    const lower = `${rubroTitle || ""} ${problemDescription}`.toLowerCase();
    const tags: string[] = [];
    if (/pago m[oó]vil|bcv|banco|transferencia|d[oó]lar/i.test(lower)) tags.push("finanzas_pagos");
    if (/whatsapp|instagram|redes|dm|cliente/i.test(lower)) tags.push("ventas_redes");
    if (/liceo|colegio|tarea|examen|profesor|l[aá]mina/i.test(lower)) tags.push("educacion_liceo");
    if (/presupuesto|cotizaci[oó]n|taller|repuesto|reparaci[oó]n/i.test(lower)) tags.push("servicios_tecnicos");
    if (/cantv|corpoelec|saime|tr[aá]mite|reclamo/i.test(lower)) tags.push("tramites_publicos");
    if (tags.length === 0) tags.push("general");

    // Generate immediate tailored solution with Turpi
    let aiGeneratedPrompt = "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const res = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Eres Turpi, la mascota guía de Resuelve AI en Venezuela. Un usuario te cuenta este problema de su día a día en su rubro (${rubroTitle || persona}):\n"${problemDescription}"\n\nGenera un prompt maestro de 4 ingredientes (Rol + Tarea + Contexto + Formato) que el usuario pueda copiar y pegar en ChatGPT o Gemini HOY MISMO para ahorrarse horas de trabajo. Sé breve, ultra práctico y adaptado a Venezuela.`,
        });
        aiGeneratedPrompt = res.text || "";
      } catch (err) {
        console.warn("Error calling Gemini for problem solver:", err);
      }
    }

    if (!aiGeneratedPrompt) {
      // Heuristic custom prompt solution
      aiGeneratedPrompt = `Actúa como un asesor experto en ${rubroTitle || "productividad"}. Ayúdame a resolver esta situación específica en Venezuela: "${problemDescription.trim()}". Dame una solución en 3 pasos prácticos, con un formato listo para usar o enviar por WhatsApp y sin complicaciones técnicas.`;
    }

    const saved = await saveProblem({
      persona: persona || "otro",
      rubroTitle: rubroTitle || "General",
      problemDescription: problemDescription.trim(),
      timeOrMoneyLost: timeOrMoneyLost?.trim() || "",
      desiredSolution: desiredSolution?.trim() || "",
      contact: contact?.trim() || "",
      aiGeneratedPrompt,
      tags,
    });

    return NextResponse.json({
      success: true,
      problem: saved,
      turpiSolution: aiGeneratedPrompt,
    });
  } catch (error) {
    console.error("Error in POST /api/problems:", error);
    return NextResponse.json(
      { error: "Error guardando el problema en el motor de Resuelve AI" },
      { status: 500 }
    );
  }
}
