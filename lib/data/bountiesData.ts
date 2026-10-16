export type BountyCategory = "liceo" | "universidad" | "trabajo" | "negocio";

export interface Bounty {
  id: string;
  title: string;
  category: BountyCategory;
  categoryLabel: string;
  authorName: string;
  authorRole: string;
  description: string;
  requirements: string[];
  expectedFormat: string;
  rewardUsd: number; // $0.30 to solver (30%)
  priceUsd: number; // $1.00 paid by student
  platformFeeUsd: number; // $0.70 retained by Resuelve IA (70%)
  status: "open" | "solved";
  createdAt: string;
  solverPrompt?: string;
  generatedDeliverable?: string;
  solvedAt?: string;
  solverName?: string;
  score?: number;
}

export interface WalletTransaction {
  id: string;
  type: "token_purchase" | "direct_payment" | "task_posted" | "task_solved_earning" | "platform_fee" | "payout_request";
  amountTokens?: number;
  amountUsd?: number;
  description: string;
  date: string;
  status: "completed" | "pending";
}

export const SEED_BOUNTIES: Bounty[] = [
  {
    id: "bounty-seed-1",
    title: "Trabajo de Biología: Estructura celular, Mitosis vs. Meiosis y Fases",
    category: "liceo",
    categoryLabel: "🎓 Liceo / Bachillerato",
    authorName: "Alejandro M.",
    authorRole: "Estudiante 4to Año Liceo",
    description:
      "El profesor de biología pidió un informe escrito de 4 páginas sobre la división celular. Debe explicar el ciclo celular, las 4 fases de la mitosis (Profase, Metafase, Anafase, Telofase), cómo ocurre la meiosis I y II, y un cuadro comparativo con 5 diferencias fundamentales. Lenguaje claro pero formal para entregar el lunes.",
    requirements: [
      "Definición clara del ciclo celular e interfase (G1, S, G2)",
      "Explicación detallada de las 4 fases de la Mitosis",
      "Explicación de Meiosis I y Meiosis II (reducción cromosómica)",
      "Cuadro comparativo con 5 diferencias entre Mitosis y Meiosis",
      "Conclusión reflexiva sobre la importancia genética y bibliografía",
    ],
    expectedFormat:
      "Informe estructurado con portada ficticia, introducción, subtítulos por sección, cuadro comparativo y conclusión",
    rewardUsd: 0.30,
    priceUsd: 1.00,
    platformFeeUsd: 0.70,
    status: "open",
    createdAt: "2026-10-15T10:00:00Z",
  },
  {
    id: "bounty-seed-2",
    title: "Ensayo Crítico de Historia Económica: El auge petrolero en la Venezuela del siglo XX",
    category: "universidad",
    categoryLabel: "🏛️ Universidad",
    authorName: "Valeria S.",
    authorRole: "Estudiante de Economía UCV",
    description:
      "Necesito un ensayo crítico de aproximadamente 1.200 palabras que analice cómo el descubrimiento del petróleo transformó la economía agraria tradicional en un modelo rentista entre 1920 y 1970. Debe incluir citas conceptuales sobre 'la siembra del petróleo' de Arturo Úslar Pietri y el fenómeno de la Enfermedad Holandesa.",
    requirements: [
      "Tesis central en la introducción sobre el rentismo petrolero",
      "Transición socioeconómica: éxodo campesino a campos petroleros y ciudades",
      "Análisis crítico de la tesis de 'Sembrar el petróleo' de Úslar Pietri",
      "Impacto de la sobrevaluación de la moneda en la producción agrícola nacional",
      "Conclusiones fundamentadas sobre diversificación económica",
    ],
    expectedFormat:
      "Ensayo académico formal en tono universitario, citas en formato APA y conclusiones argumentadas",
    rewardUsd: 0.30,
    priceUsd: 1.00,
    platformFeeUsd: 0.70,
    status: "open",
    createdAt: "2026-10-15T09:30:00Z",
  },
  {
    id: "bounty-seed-3",
    title: "Playbook Completo de Ventas por WhatsApp y Catálogo para Tienda de Calzado",
    category: "negocio",
    categoryLabel: "🚀 Negocio / Ventas",
    authorName: "Marcos G.",
    authorRole: "Dueño de Tienda de Calzado en Caracas",
    description:
      "Tengo una tienda de calzado deportivo y casual. Muchos clientes escriben 'precio' o 'información' y dejan en visto. Necesito un guión completo para WhatsApp Business: saludo con gancho en menos de 10 segundos, catálogo en texto con 3 combos de zapatos, manejo de objeción '¿cuánto es lo último?' y cierre con Pago Móvil a tasa BCV y Binance Pay.",
    requirements: [
      "Mensaje de bienvenida cálido que invite a responder inmediatamente",
      "Presentación de catálogo persuasivo con emojis, precios y beneficios de suela/material",
      "Respuesta estratégica a la objeción '¿me dejas una rebaja o cuánto es lo último?'",
      "Garantía clara de cambio de talla sin complicaciones",
      "Plantilla de cierre de venta con datos para Pago Móvil y Binance Pay",
    ],
    expectedFormat:
      "Guión / Playbook listo para copiar y pegar en las respuestas rápidas de WhatsApp",
    rewardUsd: 0.30,
    priceUsd: 1.00,
    platformFeeUsd: 0.70,
    status: "open",
    createdAt: "2026-10-15T08:45:00Z",
  },
  {
    id: "bounty-seed-4",
    title: "Informe Didáctico de Química: Enlaces Covalentes vs. Iónicos con Ejemplos Cotidianos",
    category: "liceo",
    categoryLabel: "🎓 Liceo / Bachillerato",
    authorName: "Camila R.",
    authorRole: "Estudiante 3er Año Bachillerato",
    description:
      "Trabajo de Química para exponer el lunes. El profesor nos pidió explicar cómo se combinan los elementos químicos. Debe definir qué es la electronegatividad, la regla del octeto de Lewis, cómo se forma un enlace iónico (ej. cloruro de sodio / sal común) y un enlace covalente (ej. agua H2O) usando analogías de la vida real.",
    requirements: [
      "Definición accesible de electrón de valencia y regla del octeto",
      "Mecanismo del enlace iónico (transferencia de electrones) con ejemplo de la sal",
      "Mecanismo del enlace covalente (compartición de electrones) con ejemplo del agua",
      "Tabla comparativa de propiedades físicas (puntos de fusión, solubilidad, conductividad)",
      "Cuestionario de 3 preguntas de autoevaluación con respuestas explicadas",
    ],
    expectedFormat:
      "Informe escolar ordenado con analogías pedagógicas, cuadro comparativo y cuestionario",
    rewardUsd: 0.30,
    priceUsd: 1.00,
    platformFeeUsd: 0.70,
    status: "open",
    createdAt: "2026-10-15T08:00:00Z",
  },
];
