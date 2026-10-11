export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://resuelveia.com";

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Resuelve AI",
    "url": baseUrl,
    "description": "La primera micro-app gamificada de Venezuela para aprender Inteligencia Artificial y Prompt Engineering en 3 minutos al día con lecciones estilo Duolingo.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All (Web, iOS, Android)",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "category": "FreeTier",
    },
    "inLanguage": ["es-VE", "es"],
    "author": {
      "@type": "Organization",
      "name": "Resuelve AI",
      "url": baseUrl,
    },
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Curso Práctico de IA y Prompts para Venezuela",
    "description": "Aprende a hablarle a ChatGPT y Gemini para resolver problemas de ventas por WhatsApp, tareas escolares de liceo y trámites cotidianos en Venezuela.",
    "provider": {
      "@type": "Organization",
      "name": "Academia Resuelve AI",
      "sameAs": baseUrl,
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "courseWorkload": "PT3M",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Cómo ayuda Resuelve AI a los estudiantes de liceos y escuelas en Venezuela?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Resuelve AI enseña a los estudiantes a usar la inteligencia artificial como un tutor personal para entender materias difíciles como matemáticas y física, preparar exposiciones orales para láminas de papel bond y evitar el plagio con filtros anti-palabras extrañas.",
        },
      },
      {
        "@type": "Question",
        "name": "¿Qué es la fórmula de los 4 ingredientes de Turpi para hablarle a la IA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Es el método pedagógico desarrollado por Resuelve AI: 1) El Personaje (Rol que asume la IA), 2) El Encargo (Tarea exacta), 3) Los Ingredientes (Contexto venezolano del problema) y 4) La Presentación (Formato exacto y longitud de la respuesta).",
        },
      },
      {
        "@type": "Question",
        "name": "¿Cómo pueden los comerciantes y emprendedores venezolanos usar Resuelve AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Los comerciantes aprenden a redactar respuestas persuasivas para clientes de WhatsApp e Instagram que piden rebaja, cotizaciones de productos, mensajes de cobro amables e instrucciones adaptadas a Pago Móvil a la tasa oficial del BCV.",
        },
      },
      {
        "@type": "Question",
        "name": "¿Qué métodos de pago acepta Resuelve AI en Venezuela para el plan PRO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Resuelve AI ofrece acceso gratuito con vidas diarias y un plan PRO accesible pagadero en bolívares mediante Pago Móvil a la tasa oficial del Banco Central de Venezuela (BCV), así como criptoactivos USDT a través de Binance Pay.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
