export type LessonType = "battle" | "puzzle" | "hallucination" | "lab";

export interface BattleOption {
  id: "A" | "B";
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface PuzzleBlock {
  id: string;
  category: "Rol" | "Tarea" | "Contexto" | "Formato";
  text: string;
  colorClass: string;
}

export interface HallucinationSentence {
  id: string;
  text: string;
  isHallucination: boolean;
  correction?: string;
}

export interface Lesson {
  id: string;
  pathId: "negocios" | "estudio" | "diario";
  title: string;
  subtitle: string;
  type: LessonType;
  xpReward: number;
  gemsReward: number;
  turpiAdvice: string;
  // Specific data depending on type
  battleData?: {
    scenario: string;
    targetAi: string;
    optionA: BattleOption;
    optionB: BattleOption;
    turpiTip: string;
  };
  puzzleData?: {
    goal: string;
    formula: string;
    availableBlocks: PuzzleBlock[];
    correctOrderIds: string[];
    turpiTip: string;
  };
  hallucinationData?: {
    topic: string;
    aiResponseSnippet: string;
    sentences: HallucinationSentence[];
    turpiTip: string;
  };
  labData?: {
    mission: string;
    starterPrompt: string;
    requiredElements: string[];
    successCriteria: string;
    exampleGoodPrompt: string;
  };
}

export const PATHS = [
  {
    id: "negocios" as const,
    title: "Ventas y Negocio",
    shortTitle: "Negocios 💼",
    icon: "Briefcase",
    description: "Ventas por WhatsApp, atención en Instagram, ofertas y cobranzas en Venezuela.",
    badge: "Más Popular en VE 🇻🇪",
  },
  {
    id: "estudio" as const,
    title: "Tareas y Estudio",
    shortTitle: "Estudio 🎓",
    icon: "GraduationCap",
    description: "Explicaciones sin plagio, resúmenes críticos y preparación de exámenes.",
    badge: "Estudiantes & Universitarios",
  },
  {
    id: "diario" as const,
    title: "Vida Diaria y Trámites",
    shortTitle: "Cotidiano 🏠",
    icon: "Home",
    description: "Cartas formales, finanzas familiares multimoneda y solución de problemas diarios.",
    badge: "Práctico & Rápido",
  },
];

export const LESSONS: Lesson[] = [
  // RUTA 1: NEGOCIOS
  {
    id: "negocios-1",
    pathId: "negocios",
    title: "Batalla: El Cliente que Pide Rebaja",
    subtitle: "Aprende a instruir a la IA para cerrar ventas reales sin perder margen",
    type: "battle",
    xpReward: 35,
    gemsReward: 15,
    turpiAdvice: "¡Epale! Un prompt vago te da respuestas frías. Dale a Gemini el contexto del negocio y una estrategia de cierre.",
    battleData: {
      scenario: "Un cliente de Instagram te escribe al DM por unos zapatos de $30 y te dice: 'Hermano, ¿cuánto es lo último? ¿Me dejas una rebaja?'. ¿Cuál prompt le da a la IA la mejor instrucción para responder?",
      targetAi: "Gemini 2.5 Flash",
      optionA: {
        id: "A",
        text: "Escribe una respuesta para un cliente que me está pidiendo rebaja en Instagram y no quiero bajar el precio.",
        isCorrect: false,
        explanation: "Demasiado genérico. La IA no sabe qué vendes, qué tono usas ni qué alternativa ofrecerle al cliente para retenerlo.",
      },
      optionB: {
        id: "B",
        text: "Actúa como un asesor de ventas por WhatsApp en Caracas. Un cliente pide rebaja por zapatos de $30. Respóndele con tono cordial y cercano. Defiende el precio destacando la garantía y suela antideslizante, pero ofrece envío gratis en Caracas o 5% de descuento si paga de inmediato por Pago Móvil.",
        isCorrect: true,
        explanation: "¡Excelente! Este prompt tiene Rol (Asesor en Caracas), Contexto (Zapatos $30), Objeción defendida y una contraoferta con Pago Móvil local.",
      },
      turpiTip: "Truco Turpi: Los clientes en Venezuela valoran la rapidez y la claridad con métodos de pago locales (Pago Móvil / Zelle / Efectivo). Siempre incluye el método de pago en el prompt.",
    },
  },
  {
    id: "negocios-2",
    pathId: "negocios",
    title: "Rompecabezas: La Fórmula R-T-C-F",
    subtitle: "Ensambla los 4 bloques maestros de la ingeniería de prompts",
    type: "puzzle",
    xpReward: 45,
    gemsReward: 20,
    turpiAdvice: "Todo prompt profesional sigue la fórmula mágica: Rol + Tarea + Contexto + Formato. ¡Arma los bloques en el orden correcto!",
    puzzleData: {
      goal: "Construir un prompt para generar un post de Instagram que venda desayunos y empanadas a ejecutivos en Las Mercedes.",
      formula: "Rol ➔ Tarea ➔ Contexto ➔ Formato",
      availableBlocks: [
        {
          id: "b-rol",
          category: "Rol",
          text: "[Rol] Actúa como un redactor publicitario gastronómico.",
          colorClass: "bg-blue-50 border-blue-400 text-blue-900",
        },
        {
          id: "b-tarea",
          category: "Tarea",
          text: "[Tarea] Escribe un post persuasivo de Instagram para vender combos de empanadas gourmet.",
          colorClass: "bg-green-50 border-green-400 text-green-900",
        },
        {
          id: "b-contexto",
          category: "Contexto",
          text: "[Contexto] Público de oficinas y trabajadores con poco tiempo para desayunar.",
          colorClass: "bg-amber-50 border-amber-400 text-amber-900",
        },
        {
          id: "b-formato",
          category: "Formato",
          text: "[Formato] Titular gancho, 3 líneas con emojis, precio y llamado al link de WhatsApp.",
          colorClass: "bg-purple-50 border-purple-400 text-purple-900",
        },
      ],
      correctOrderIds: ["b-rol", "b-tarea", "b-contexto", "b-formato"],
      turpiTip: "Si te saltas el Formato, la IA te escribirá 4 párrafos gigantes que nadie lee en redes sociales. ¡Limítale siempre la longitud!",
    },
  },
  {
    id: "negocios-3",
    pathId: "negocios",
    title: "Caza-Alucinaciones: La Tasa y Finanzas",
    subtitle: "Aprende a detectar cuándo la IA inventa datos con total seguridad",
    type: "hallucination",
    xpReward: 50,
    gemsReward: 25,
    turpiAdvice: "¡Alerta con mis lentes inteligentes! Los modelos de lenguaje a veces 'alucinan' inventando leyes o tasas cuando no las conocen. Toca la afirmación falsa.",
    hallucinationData: {
      topic: "Resumen de normativa cambiaria generado por IA",
      aiResponseSnippet: "Un emprendedor le preguntó a la IA cómo facturar legalmente en divisas y bolívares en su negocio.",
      sentences: [
        {
          id: "s-1",
          text: "En Venezuela, los comercios pueden aceptar pagos en divisas extranjeras, bolívares o criptoactivos de común acuerdo con el cliente.",
          isHallucination: false,
        },
        {
          id: "s-2",
          text: "Para operaciones comerciales, la tasa de referencia legal establecida en la normativa vigente es la publicada por el Banco Central de Venezuela (BCV).",
          isHallucination: false,
        },
        {
          id: "s-3",
          text: "El BCV cobra automáticamente una comisión del 18% en dólares retenida de cada transferencia de Pago Móvil que supere los 50 bolívares.",
          isHallucination: true,
          correction: "¡FALSO! El BCV no retiene un 18% en dólares por Pago Móvil. Las alucinaciones financieras son peligrosas: nunca aceptes datos de impuestos o comisiones sin verificar la gaceta oficial.",
        },
        {
          id: "s-4",
          text: "Es recomendable emitir la factura reflejando el monto en bolívares a la tasa oficial del día de la transacción.",
          isHallucination: false,
        },
      ],
      turpiTip: "Regla de oro de Resuelve AI: Siempre pide a la IA: 'Si no estás 100% seguro de una ley o cifra exacta, adviértemelo en vez de inventar'.",
    },
  },
  {
    id: "negocios-4",
    pathId: "negocios",
    title: "Laboratorio Gemini: Tu Asistente en Vivo",
    subtitle: "Escribe tu propio prompt y pruébalo en tiempo real contra el motor de IA",
    type: "lab",
    xpReward: 60,
    gemsReward: 30,
    turpiAdvice: "¡Es tu turno de ser el piloto! Escribe un prompt que le pida a Gemini cobrar una cuenta pendiente con cortesía y firmeza.",
    labData: {
      mission: "Crear un mensaje de cobranza por WhatsApp para un cliente que debe un servicio desde hace 10 días, sin que se sienta ofendido pero logrando que pague hoy.",
      starterPrompt: "Actúa como encargado de administración. Escribe un mensaje de WhatsApp para el cliente Carlos recordándole el pago pendiente de $40 por el diseño de su logo entregado hace 10 días. Sé muy educado pero incluye los datos de Pago Móvil para que liquide hoy.",
      requiredElements: ["Rol o tono cordial", "Monto o detalle del servicio", "Llamado a la acción (Pago Móvil o cuenta)"],
      successCriteria: "Tu prompt debe incluir al menos un rol, la situación clara y el método de pago para que la IA genere un mensaje listo para enviar.",
      exampleGoodPrompt: "Actúa como asesor administrativo amable pero firme. Redacta un WhatsApp para un cliente que debe $40. Menciona que cerramos conciliación bancaria hoy y adjunta opción de Pago Móvil y Binance.",
    },
  },
  {
    id: "negocios-5",
    pathId: "negocios",
    title: "Batalla: Catálogo de WhatsApp que Vende Solo",
    subtitle: "Aprende a instruir a la IA para resumir tu catálogo con ganchos persuasivos",
    type: "battle",
    xpReward: 40,
    gemsReward: 20,
    turpiAdvice: "¡Nadie lee listas gigantescas en WhatsApp! El secreto es pedirle a la IA que use viñetas cortas, beneficios claros y el precio visible.",
    battleData: {
      scenario: "Tienes una tienda de ropa y accesorios. Te llega un lote nuevo y quieres enviar un mensaje a tu lista de difusión en WhatsApp para vender antes del fin de semana.",
      targetAi: "Gemini 2.5 Flash",
      optionA: {
        id: "A",
        text: "Escribe un mensaje de difusión diciendo que nos llegó mercancía nueva con fotos y que nos escriban al privado.",
        isCorrect: false,
        explanation: "Muy flojo y genérico. No genera urgencia, no dice qué productos llegaron ni da un llamado a la acción concreto.",
      },
      optionB: {
        id: "B",
        text: "Actúa como redactor de ventas directas para tiendas de moda en Venezuela. Redacta un mensaje para lista de difusión de WhatsApp (máximo 6 líneas). Menciona que llegaron franelas oversize ($12) y jeans stretch ($22). Incluye gancho con emojis, oferta 'Lleva 2 por $20 hoy', método de entrega en Caracas y datos de Pago Móvil para apartar tu talla.",
        isCorrect: true,
        explanation: "¡Espectacular! Contiene Rol, Formato corto para móvil, Precios claros, Oferta gancho y el llamado directo al Pago Móvil.",
      },
      turpiTip: "En Venezuela las decisiones de compra en WhatsApp se toman en menos de 10 segundos. Si el precio no está claro, el cliente no pregunta.",
    },
  },
  {
    id: "negocios-6",
    pathId: "negocios",
    title: "Rompecabezas: El Cobro Elegante",
    subtitle: "Ensambla un recordatorio de deuda que cobre sin dañar la relación",
    type: "puzzle",
    xpReward: 45,
    gemsReward: 20,
    turpiAdvice: "Cobrar da pena si no tienes un sistema. Con la fórmula mágica, el mensaje suena formal, respetuoso y efectivo.",
    puzzleData: {
      goal: "Crear un mensaje para cobrar una factura vencida de $60 por un trabajo de repostería entregado hace una semana.",
      formula: "Rol ➔ Tarea ➔ Contexto ➔ Formato",
      availableBlocks: [
        {
          id: "b-rol",
          category: "Rol",
          text: "[Rol] Actúa como un asistente administrativo empático y profesional.",
          colorClass: "bg-blue-50 border-blue-400 text-blue-900",
        },
        {
          id: "b-tarea",
          category: "Tarea",
          text: "[Tarea] Redacta un recordatorio cordial de balance pendiente de $60.",
          colorClass: "bg-green-50 border-green-400 text-green-900",
        },
        {
          id: "b-contexto",
          category: "Contexto",
          text: "[Contexto] Para un cliente frecuente cuyo pedido de torta se entregó el sábado pasado.",
          colorClass: "bg-amber-50 border-amber-400 text-amber-900",
        },
        {
          id: "b-formato",
          category: "Formato",
          text: "[Formato] Saludo cálido, recordatorio de cierre contable hoy y datos de Pago Móvil a tasa BCV.",
          colorClass: "bg-purple-50 border-purple-400 text-purple-900",
        },
      ],
      correctOrderIds: ["b-rol", "b-tarea", "b-contexto", "b-formato"],
      turpiTip: "Usar 'cierre contable' o 'conciliación de banco del día' quita la carga personal y hace que el cobro parezca un proceso natural de oficina.",
    },
  },
  {
    id: "negocios-7",
    pathId: "negocios",
    title: "Caza-Alucinaciones: Envíos y Agencias",
    subtitle: "Aprende a verificar las políticas logísticas antes de prometer cosas a tus clientes",
    type: "hallucination",
    xpReward: 50,
    gemsReward: 25,
    turpiAdvice: "¡Cuidado con inventar en logística! Toca la frase que contiene información falsa sobre envíos en Venezuela.",
    hallucinationData: {
      topic: "Condiciones de envío nacional para e-commerce en Venezuela",
      aiResponseSnippet: "Un comerciante le pidió a la IA que le redactara los términos y condiciones de envío para su tienda online.",
      sentences: [
        {
          id: "s-1",
          text: "Los envíos nacionales se realizan habitualmente cobro a destino a través de agencias autorizadas como MRW, Zoom o Tealca.",
          isHallucination: false,
        },
        {
          id: "s-2",
          text: "El tiempo estimado de entrega suele oscilar entre 24 y 72 horas hábiles según la ciudad destino.",
          isHallucination: false,
        },
        {
          id: "s-3",
          text: "Todas las empresas de encomienda en Venezuela están obligadas por ley nacional a indemnizar en efectivo el 100% del valor de cualquier paquete perdido sin necesidad de haber contratado seguro previo.",
          isHallucination: true,
          correction: "¡FALSO! Las agencias solo indemnizan el valor total si el cliente declaró el valor y pagó el seguro correspondiente. Siempre aclara este término a tus compradores.",
        },
        {
          id: "s-4",
          text: "Una vez entregado el número de guía (tracking), el comprador puede rastrear el estatus del bulto directamente en el portal web de la empresa.",
          isHallucination: false,
        },
      ],
      turpiTip: "Nunca dejes que la IA asuma garantías legales o políticas de seguros sin que tú le des las condiciones exactas en el prompt.",
    },
  },
  {
    id: "negocios-8",
    pathId: "negocios",
    title: "Laboratorio Gemini: Oferta Relámpago",
    subtitle: "Diseña un copy con escasez y llamado a Pago Móvil para liquidar stock",
    type: "lab",
    xpReward: 60,
    gemsReward: 30,
    turpiAdvice: "¡Hora de vender en vivo! Formula un prompt para que Gemini cree una oferta de 24 horas irresistible.",
    labData: {
      mission: "Crear un post y estado de WhatsApp anunciando una liquidación relámpago de 24 horas por cierre de mes, con Pago Móvil o divisas.",
      starterPrompt: "Actúa como estratega de ventas. Redacta un mensaje para WhatsApp ofreciendo 30% de descuento solo por hoy en nuestro inventario de zapatos deportivos. Destaca que quedan solo 5 pares en Caracas y coloca los datos de Pago Móvil para apartar de inmediato.",
      requiredElements: ["Rol de ventas", "Sentido de urgencia / tiempo límite", "Precio o descuento", "Método de pago (Pago Móvil)"],
      successCriteria: "El prompt debe combinar la técnica de urgencia con llamada a la acción directa de pago.",
      exampleGoodPrompt: "Actúa como redactor publicitario comercial. Crea una oferta flash para WhatsApp de 24 horas. Producto: combos de hamburguesas $10. Urgencia: solo 15 combos disponibles hoy. Cierre con Pago Móvil a tasa oficial.",
    },
  },

  // RUTA 2: ESTUDIO
  {
    id: "estudio-1",
    pathId: "estudio",
    title: "Batalla: Resúmenes sin Alucinaciones",
    subtitle: "Consigue que la IA te enseñe como un tutor en lugar de darte respuestas flojas",
    type: "battle",
    xpReward: 35,
    gemsReward: 15,
    turpiAdvice: "Si le pides a la IA 'hazme la tarea', no aprendes nada y los profesores se dan cuenta al instante. ¡Pídele que sea tu tutor!",
    battleData: {
      scenario: "Tienes que estudiar la Ley de Ohm para un examen de física. ¿Cuál prompt te ayuda a dominar el tema de verdad?",
      targetAi: "Gemini 2.5 Flash",
      optionA: {
        id: "A",
        text: "Escríbeme todo sobre la Ley de Ohm para un examen.",
        isCorrect: false,
        explanation: "Te arrojará un bloque de texto denso que no te ayudará a razonar ni a resolver problemas prácticos.",
      },
      optionB: {
        id: "B",
        text: "Actúa como un profesor de física paciente. Explícame la Ley de Ohm usando una analogía cotidiana con tuberías de agua. Luego, dame 2 ejercicios prácticos paso a paso y 1 pregunta de opción múltiple para probar si entendí.",
        isCorrect: true,
        explanation: "¡Brillante! Conviertes a la IA en un profesor particular interactivo con analogías y evaluación formativa.",
      },
      turpiTip: "Pide siempre 'analogías con la vida cotidiana'. La memoria retiene un 80% más cuando relacionas conceptos abstractos con cosas visibles.",
    },
  },
  {
    id: "estudio-2",
    pathId: "estudio",
    title: "Rompecabezas: El Analista Literario",
    subtitle: "Organiza el análisis de textos complejos sin perderte",
    type: "puzzle",
    xpReward: 45,
    gemsReward: 20,
    turpiAdvice: "Para literatura e historia, estructura el análisis en partes lógicas.",
    puzzleData: {
      goal: "Analizar Doña Bárbara de Rómulo Gallegos destacando el conflicto Civilización vs. Barbarie.",
      formula: "Rol ➔ Tarea ➔ Contexto ➔ Formato",
      availableBlocks: [
        {
          id: "b-rol",
          category: "Rol",
          text: "[Rol] Actúa como un profesor de literatura venezolana.",
          colorClass: "bg-blue-50 border-blue-400 text-blue-900",
        },
        {
          id: "b-tarea",
          category: "Tarea",
          text: "[Tarea] Analiza el simbolismo de Santos Luzardo y Doña Bárbara.",
          colorClass: "bg-green-50 border-green-400 text-green-900",
        },
        {
          id: "b-contexto",
          category: "Contexto",
          text: "[Contexto] Para un estudiante de bachillerato que prepara una exposición oral.",
          colorClass: "bg-amber-50 border-amber-400 text-amber-900",
        },
        {
          id: "b-formato",
          category: "Formato",
          text: "[Formato] 3 puntos clave con citas y una conclusión de 2 minutos para hablar.",
          colorClass: "bg-purple-50 border-purple-400 text-purple-900",
        },
      ],
      correctOrderIds: ["b-rol", "b-tarea", "b-contexto", "b-formato"],
      turpiTip: "Especificar el tiempo de presentación ('para una exposición de 2 minutos') hace que la IA no te dé un texto kilométrico.",
    },
  },
  {
    id: "estudio-3",
    pathId: "estudio",
    title: "Caza-Alucinaciones: Fechas Patrias de Venezuela",
    subtitle: "Detecta cuándo la IA confunde personajes o cronologías de nuestra historia",
    type: "hallucination",
    xpReward: 50,
    gemsReward: 25,
    turpiAdvice: "Las IAs globales a menudo confunden la historia latinoamericana. Revisa estas 4 frases y detecta el error histórico.",
    hallucinationData: {
      topic: "Resumen histórico sobre la Independencia de Venezuela",
      aiResponseSnippet: "Un estudiante le pidió a la IA una cronología para su exposición de Historia de Venezuela.",
      sentences: [
        {
          id: "s-1",
          text: "El 19 de abril de 1810 se dio el primer paso hacia la emancipación venezolana con la destitución del Capitán General Vicente Emparan en Caracas.",
          isHallucination: false,
        },
        {
          id: "s-2",
          text: "La Batalla de Carabobo se libró el 24 de junio de 1821, sellando militarmente la independencia de Venezuela bajo el mando del Libertador Simón Bolívar.",
          isHallucination: false,
        },
        {
          id: "s-3",
          text: "El Acta de la Independencia fue firmada solemnemente el 5 de julio de 1811 en la ciudad de Maracaibo durante el Congreso de Angostura.",
          isHallucination: true,
          correction: "¡FALSO! El Acta del 5 de julio de 1811 se firmó en Caracas (en la Capilla Santa Rosa de Lima). El Congreso de Angostura ocurrió en 1819 en Ciudad Bolívar (antigua Santo Tomé de Angostura).",
        },
        {
          id: "s-4",
          text: "Generalmente se reconoce a próceres como José Antonio Páez, Antonio José de Sucre y Rafael Urdaneta entre las figuras clave de las campañas independentistas.",
          isHallucination: false,
        },
      ],
      turpiTip: "Para temas históricos o de geografía nacional, indícale a la IA: 'Usa exclusivamente fuentes oficiales del Ministerio de Educación de Venezuela o la Academia Nacional de la Historia'.",
    },
  },
  {
    id: "estudio-4",
    pathId: "estudio",
    title: "Laboratorio Gemini: Tu Tutor Socrático",
    subtitle: "Consigue que la IA te evalúe haciéndote preguntas como un profesor real",
    type: "lab",
    xpReward: 60,
    gemsReward: 30,
    turpiAdvice: "El mejor uso de la IA para estudiar no es que te dé resúmenes, sino que te haga un examen de prueba antes del de verdad.",
    labData: {
      mission: "Pedirle a Gemini que actúe como profesor examinador de Química, haciéndote preguntas de opción múltiple una a una.",
      starterPrompt: "Actúa como un profesor de química de 4to año de bachillerato. Hazme una pregunta sobre la Tabla Periódica y los enlaces covalentes. No me des la respuesta todavía; espera a que yo responda y luego explícame si acerté o por qué me equivoqué.",
      requiredElements: ["Rol de profesor evaluador", "Tema específico", "Instrucción de no dar la respuesta de inmediato", "Formato de interacción paso a paso"],
      successCriteria: "Tu prompt debe pedir explícitamente que la IA espere tu respuesta antes de dar la retroalimentación.",
      exampleGoodPrompt: "Actúa como jurado de historia de bachillerato. Hazme 3 preguntas desafiantes sobre la Guerra Federal una por una. Corrige mis respuestas como si fuera un examen oral.",
    },
  },
  {
    id: "estudio-5",
    pathId: "estudio",
    title: "Batalla: Explicador de Ciencias con Ejemplos Reales",
    subtitle: "Aprende a desarmar fórmulas difíciles con analogías de la vida diaria",
    type: "battle",
    xpReward: 40,
    gemsReward: 20,
    turpiAdvice: "Las fórmulas son letras frías hasta que las imaginas en acción. Mira cómo un buen prompt transforma la física.",
    battleData: {
      scenario: "Tienes examen de cinemática y no logras entender la diferencia entre 'Velocidad' y 'Aceleración'. ¿Cuál prompt le pide a la IA la mejor explicación?",
      targetAi: "Gemini 2.5 Flash",
      optionA: {
        id: "A",
        text: "Dime la definición de velocidad y aceleración y sus fórmulas matemáticas.",
        isCorrect: false,
        explanation: "Te dará definiciones enciclopédicas con fórmulas algebraicas complejas sin conexión intuitiva.",
      },
      optionB: {
        id: "B",
        text: "Actúa como un profesor de física divertido. Explica la diferencia entre velocidad y aceleración usando la analogía de un carrito por puesto en una avenida despejada versus cuando arranca en un semáforo. Incluye un ejemplo numérico sencillo y una pregunta para comprobar si entendí.",
        isCorrect: true,
        explanation: "¡Genial! Relacionar el concepto con una situación tangible y cotidiana hace que el cerebro grabe la idea de forma permanente.",
      },
      turpiTip: "Pide siempre analogías mecánicas o cotidianas: un carro en subida, una tubería de agua, o un teléfono cargándose.",
    },
  },
  {
    id: "estudio-6",
    pathId: "estudio",
    title: "Rompecabezas: La Lámina de Papel Bond Perfecta",
    subtitle: "Sintetiza tu exposición escolar sin saturar de texto la cartelera",
    type: "puzzle",
    xpReward: 45,
    gemsReward: 20,
    turpiAdvice: "Una lámina llena de texto es aburrida y te bajan puntos. Arma el prompt para que la IA aplique la regla de oro: ideas clave y dibujos.",
    puzzleData: {
      goal: "Crear el esquema para una lámina de papel bond sobre el Ciclo del Agua para una exposición de 5 minutos.",
      formula: "Rol ➔ Tarea ➔ Contexto ➔ Formato",
      availableBlocks: [
        {
          id: "b-rol",
          category: "Rol",
          text: "[Rol] Actúa como un tutor pedagógico visual.",
          colorClass: "bg-blue-50 border-blue-400 text-blue-900",
        },
        {
          id: "b-tarea",
          category: "Tarea",
          text: "[Tarea] Diseña la estructura esquemática de una lámina escolar sobre el Ciclo del Agua.",
          colorClass: "bg-green-50 border-green-400 text-green-900",
        },
        {
          id: "b-contexto",
          category: "Contexto",
          text: "[Contexto] Para una exposición en grupo donde el profesor penaliza láminas saturadas de párrafos.",
          colorClass: "bg-amber-50 border-amber-400 text-amber-900",
        },
        {
          id: "b-formato",
          category: "Formato",
          text: "[Formato] Título grande, 4 pasos con máximo 6 palabras cada uno e indicación de qué dibujo va en el centro.",
          colorClass: "bg-purple-50 border-purple-400 text-purple-900",
        },
      ],
      correctOrderIds: ["b-rol", "b-tarea", "b-contexto", "b-formato"],
      turpiTip: "La regla 6x6 dice: máximo 6 viñetas y máximo 6 palabras por viñeta. Lo demás lo defiendes hablando.",
    },
  },
  {
    id: "estudio-7",
    pathId: "estudio",
    title: "Batalla: El Filtro Anti-Plagio y Tono Humano",
    subtitle: "Aprende a quitar el estilo robótico y modismos extranjeros de tus trabajos",
    type: "battle",
    xpReward: 40,
    gemsReward: 20,
    turpiAdvice: "Palabras como 'en resumidas cuentas', 'es imperativo destacar' o modismos de otros países delatan a la IA de inmediato.",
    battleData: {
      scenario: "Le pediste a la IA un ensayo sobre el impacto ambiental de los plásticos y te devolvió un texto acartonado lleno de frases clichés como 'es crucial recalcar' y 'en conclusión'. ¿Cómo le pides corregirlo?",
      targetAi: "Gemini 2.5 Flash",
      optionA: {
        id: "A",
        text: "Haz que suene más natural y que no parezca que lo hizo una inteligencia artificial.",
        isCorrect: false,
        explanation: "Muy impreciso. La IA no sabe qué palabras eliminar ni a qué estilo referirse.",
      },
      optionB: {
        id: "B",
        text: "Reescribe este texto con la voz de un estudiante venezolano reflexivo. Elimina clichés robóticos como 'es crucial', 'en el tapiz de' o 'en resumen'. Usa oraciones directas, voz activa, ejemplos reales de basura en playas de nuestras costas y mantén un tono académico pero fresco.",
        isCorrect: true,
        explanation: "¡Perfecto! Lista negra de clichés prohibidos, contexto local (playas venezolanas) y especificación clara del estilo.",
      },
      turpiTip: "Dile a la IA: 'Prohibido usar palabras como crucial, fascinante, en resumidas cuentas o imperativo'. Verás el cambio radical.",
    },
  },
  {
    id: "estudio-8",
    pathId: "estudio",
    title: "Laboratorio Gemini: Simulacro de Preguntas del Jurado",
    subtitle: "Prepara la defensa oral anticipando los dardos del profesor más estricto",
    type: "lab",
    xpReward: 60,
    gemsReward: 30,
    turpiAdvice: "¡En las exposiciones la nota se gana en las preguntas finales! Haz que Gemini te ponga contra las cuerdas para practicar.",
    labData: {
      mission: "Pedirle a Gemini que se ponga en el papel del profesor más exigente y te formule las 3 preguntas trampa de tu tema.",
      starterPrompt: "Actúa como un profesor universitario muy exigente. Mi exposición es sobre 'El Petróleo en Venezuela y la Ley de Hidrocarburos'. Hazme las 3 preguntas más difíciles que un jurado me haría para probar si domino el tema, junto a sugerencias de cómo defenderlas.",
      requiredElements: ["Rol de jurado o profesor exigente", "Tema de la exposición", "Solicitud de preguntas trampa o difíciles", "Claves para argumentar"],
      successCriteria: "El prompt debe entrenarte para la defensa oral del tema.",
      exampleGoodPrompt: "Actúa como profesor de biología evaluador. Voy a defender mi tesis sobre cultivo hidropónico. Hazme 3 preguntas desafiantes sobre costo, plagas y pH que pondrían a dudar a un estudiante promedio.",
    },
  },

  // RUTA 3: DIARIO
  {
    id: "diario-1",
    pathId: "diario",
    title: "Batalla: La Carta Formal de Reclamo",
    subtitle: "Haz que las empresas te presten atención con una redacción asertiva",
    type: "battle",
    xpReward: 35,
    gemsReward: 15,
    turpiAdvice: "Cuando se cae el internet o falla un servicio, un reclamo educado y con datos técnicos tiene 3 veces más prioridad.",
    battleData: {
      scenario: "Llevas 4 días sin servicio de fibra óptica y necesitas redactar una carta formal al proveedor para exigir ajuste en la factura.",
      targetAi: "Gemini 2.5 Flash",
      optionA: {
        id: "A",
        text: "Escribe una queja diciendo que son unos irresponsables y que me arreglen el internet ya.",
        isCorrect: false,
        explanation: "Un reclamo agresivo sin datos técnicos suele terminar archivado o en respuestas automáticas.",
      },
      optionB: {
        id: "B",
        text: "Redacta una carta formal de reclamo dirigida al departamento de soporte técnico de una empresa de telecomunicaciones. Incluye: número de contrato [XXXX], fecha de inicio de la avería, solicitud de número de ticket y petición formal de compensación en la próxima facturación según la ley de telecomunicaciones.",
        isCorrect: true,
        explanation: "¡Exacto! El reclamo incluye todos los datos que los analistas de soporte necesitan para tramitar la orden de inmediato.",
      },
      turpiTip: "Las empresas se mueven por números de contrato, fechas exactas y peticiones claras. La IA estructura la formalidad perfecta en segundos.",
    },
  },
  {
    id: "diario-2",
    pathId: "diario",
    title: "Rompecabezas: Presupuesto de Taller y Reparaciones",
    subtitle: "Estructura presupuestos claros que eviten reclamos de clientes difíciles",
    type: "puzzle",
    xpReward: 45,
    gemsReward: 20,
    turpiAdvice: "Tanto para mecánicos como para refrigeración o carpintería, un presupuesto con garantía y vigencia evita disgustos.",
    puzzleData: {
      goal: "Redactar un presupuesto formal para el cambio de compresor y mantenimiento de un aire acondicionado de 12.000 BTU.",
      formula: "Rol ➔ Tarea ➔ Contexto ➔ Formato",
      availableBlocks: [
        {
          id: "b-rol",
          category: "Rol",
          text: "[Rol] Actúa como un técnico en refrigeración profesional y ordenado.",
          colorClass: "bg-blue-50 border-blue-400 text-blue-900",
        },
        {
          id: "b-tarea",
          category: "Tarea",
          text: "[Tarea] Elabora una cotización formal de servicio técnico y repuestos.",
          colorClass: "bg-green-50 border-green-400 text-green-900",
        },
        {
          id: "b-contexto",
          category: "Contexto",
          text: "[Contexto] Para el cliente Carlos Pérez: cambio de compresor 12.000 BTU, gas refrigerante y mano de obra.",
          colorClass: "bg-amber-50 border-amber-400 text-amber-900",
        },
        {
          id: "b-formato",
          category: "Formato",
          text: "[Formato] Tabla con desglose de repuestos, mano de obra, validez de 3 días y garantía de 30 días con firma.",
          colorClass: "bg-purple-50 border-purple-400 text-purple-900",
        },
      ],
      correctOrderIds: ["b-rol", "b-tarea", "b-contexto", "b-formato"],
      turpiTip: "En Venezuela los presupuestos siempre deben incluir 'Validez: 3 a 5 días' para protegerte de la variación de precios de repuestos.",
    },
  },
  {
    id: "diario-3",
    pathId: "diario",
    title: "Caza-Alucinaciones: Voltajes y Electrodomésticos",
    subtitle: "Evita daños costosos verificando especificaciones técnicas de energía",
    type: "hallucination",
    xpReward: 50,
    gemsReward: 25,
    turpiAdvice: "¡La energía eléctrica en Venezuela tiene variaciones frecuentes! Aprende a identificar consejos erróneos de la IA.",
    hallucinationData: {
      topic: "Instalación de protectores de voltaje y electrodomésticos en Venezuela",
      aiResponseSnippet: "Un usuario le preguntó a la IA cómo proteger su nevera inverter y aire acondicionado de 220V.",
      sentences: [
        {
          id: "s-1",
          text: "En Venezuela, los protectores de voltaje desconectan el equipo cuando detectan picos altos o caídas por debajo del rango seguro y esperan un tiempo de retardo antes de reconectar.",
          isHallucination: false,
        },
        {
          id: "s-2",
          text: "Los equipos como aires acondicionados centrales y cocinas de inducción de 220V requieren una conexión bifásica con breaker independiente en el tablero principal.",
          isHallucination: false,
        },
        {
          id: "s-3",
          text: "Los protectores de voltaje comunes almacenan 500 Watts de energía interna en baterías de litio capaces de mantener la nevera encendida hasta 3 horas durante un corte de luz.",
          isHallucination: true,
          correction: "¡FALSO! Los protectores de voltaje NO son UPS ni tienen baterías; únicamente cortan el paso de corriente ante fluctuaciones para evitar quemar la tarjeta electrónica.",
        },
        {
          id: "s-4",
          text: "Para mantener equipos encendidos durante apagones prolongados se requiere un sistema de inversor con banco de baterías o una planta eléctrica a gasolina/gas.",
          isHallucination: false,
        },
      ],
      turpiTip: "No confundas 'Protector de sobrevoltaje' con 'UPS / Inversor'. La IA a veces los mezcla si no especificas el tipo de equipo.",
    },
  },
  {
    id: "diario-4",
    pathId: "diario",
    title: "Laboratorio Gemini: Reporte de Avería con Código NIC",
    subtitle: "Redacta cartas y reportes técnicos con datos que aceleren la atención",
    type: "lab",
    xpReward: 60,
    gemsReward: 30,
    turpiAdvice: "Un reclamo con el número de poste, código de contrato o NIC se atiende mucho más rápido. Redacta tu carta oficial.",
    labData: {
      mission: "Crear una carta formal de solicitud de reconexión y revisión técnica de transformador eléctrico para Corpoelec o Cantv.",
      starterPrompt: "Actúa como representante de una junta de vecinos. Redacta una carta formal dirigida al departamento técnico de Corpoelec. Explica que en la calle Miranda hay una falla de fase desde hace 72 horas. Incluye campos para el código NIC [XXXXX], número de poste [XXXX] y solicita número de reporte oficial para seguimiento.",
      requiredElements: ["Rol de vocero o usuario", "Identificación técnica (NIC o poste)", "Descripción del impacto", "Solicitud de número de ticket o reporte"],
      successCriteria: "El prompt debe guiar a la IA para redactar un documento formal con encabezado legal y datos técnicos precisos.",
      exampleGoodPrompt: "Redacta una carta formal para Cantv solicitando restitución de línea telefónica e internet. Incluye número de reporte previo, tiempo sin servicio y solicitud de ajuste en factura por días sin conexión.",
    },
  },
  {
    id: "diario-5",
    pathId: "diario",
    title: "Batalla: El Presupuesto Familiar Multimoneda",
    subtitle: "Aprende a instruir a la IA para organizar gastos en bolívares y divisas",
    type: "battle",
    xpReward: 40,
    gemsReward: 20,
    turpiAdvice: "Manejar ingresos en bolívares por Pago Móvil y efectivo en divisas marea a cualquiera si no tienes una plantilla clara.",
    battleData: {
      scenario: "Cobras tu salario o ventas en bolívares por Pago Móvil y algunos pagos en efectivo de $20. Quieres que la IA te organice un presupuesto mensual con gastos fijos e imprevistos.",
      targetAi: "Gemini 2.5 Flash",
      optionA: {
        id: "A",
        text: "Hazme un presupuesto mensual con mis gastos de comida y servicios.",
        isCorrect: false,
        explanation: "No sabe tus montos, no separa monedas ni incluye la inflación o tasa oficial del BCV.",
      },
      optionB: {
        id: "B",
        text: "Actúa como un asesor financiero familiar en Venezuela. Diseña una tabla de presupuesto mensual para un ingreso mixto: $150 en bolívares y $100 en efectivo. Distribuye: 50% mercado básico, 20% servicios (luz, gas, internet), 15% transporte y un 15% como fondo de emergencia en divisas para imprevistos médicos o del hogar.",
        isCorrect: true,
        explanation: "¡Excelente! Desglosa fuentes de ingreso en ambas monedas, define porcentajes racionales y crea un fondo de reserva vital.",
      },
      turpiTip: "Siempre reserva al menos 10% a 15% en divisas para imprevistos. En Venezuela tener ese fondo te salva de urgencias médicas o mecánicas.",
    },
  },
  {
    id: "diario-6",
    pathId: "diario",
    title: "Rompecabezas: Solicitud de Constancia de Trabajo",
    subtitle: "Estructura una solicitud laboral asertiva para trámites bancarios",
    type: "puzzle",
    xpReward: 45,
    gemsReward: 20,
    turpiAdvice: "Para abrir cuentas bancarias o solicitar créditos, una constancia de trabajo bien pedida sale en 24 horas.",
    puzzleData: {
      goal: "Redactar un correo electrónico para Recursos Humanos solicitando una constancia de trabajo con sello húmedo para el banco.",
      formula: "Rol ➔ Tarea ➔ Contexto ➔ Formato",
      availableBlocks: [
        {
          id: "b-rol",
          category: "Rol",
          text: "[Rol] Actúa como un empleado respetuoso y puntual.",
          colorClass: "bg-blue-50 border-blue-400 text-blue-900",
        },
        {
          id: "b-tarea",
          category: "Tarea",
          text: "[Tarea] Redacta una solicitud formal de constancia de trabajo dirigida a Recursos Humanos.",
          colorClass: "bg-green-50 border-green-400 text-green-900",
        },
        {
          id: "b-contexto",
          category: "Contexto",
          text: "[Contexto] Se requiere con sello húmedo y desglose de sueldo integral para consignar en una apertura de cuenta bancaria.",
          colorClass: "bg-amber-50 border-amber-400 text-amber-900",
        },
        {
          id: "b-formato",
          category: "Formato",
          text: "[Formato] Asunto claro con número de cédula, saludo formal, datos del solicitante y agradecimiento cordial.",
          colorClass: "bg-purple-50 border-purple-400 text-purple-900",
        },
      ],
      correctOrderIds: ["b-rol", "b-tarea", "b-contexto", "b-formato"],
      turpiTip: "Incluye siempre tu número de cédula y cargo en el asunto del correo: 'Solicitud Constancia - [Tu Nombre] - C.I. [V-XXXXXXX]'. Facilita el trabajo a RRHH.",
    },
  },
];
