import type { Metadata, Viewport } from "next";
import { Nunito_Sans, JetBrains_Mono } from "next/font/google";
import JsonLd from "@/components/seo/JsonLd";
import "./globals.css";

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://resuelveia.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Resuelve AI • Aprende Inteligencia Artificial en 3 Minutos al Día 🇻🇪",
    template: "%s | Resuelve AI",
  },
  description:
    "La micro-app gamificada de Venezuela para dominar la Inteligencia Artificial. Aprende a hablarle a ChatGPT y Gemini con lecciones prácticas estilo Duolingo para ventas por WhatsApp, tareas de liceo y trámites cotidianos.",
  keywords: [
    "aprender inteligencia artificial venezuela",
    "como usar chatgpt para tareas de liceo",
    "ingenieria de prompts para principiantes",
    "prompts para vender por whatsapp venezuela",
    "gemini ia gratis venezuela",
    "resuelve ai",
    "turpi inteligencia artificial",
    "pago movil bcv ia",
    "curso inteligencia artificial venezuela",
    "duolingo de inteligencia artificial",
  ],
  authors: [{ name: "Resuelve AI", url: baseUrl }],
  creator: "Resuelve AI",
  publisher: "Academia Resuelve AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Resuelve AI • Aprende Inteligencia Artificial en 3 Minutos al Día 🇻🇪",
    description:
      "Aprende a hablarle a la IA con micro-lecciones interactivas. Ideal para comerciantes, estudiantes de liceo y profesionales en Venezuela.",
    url: baseUrl,
    siteName: "Resuelve AI",
    images: [
      {
        url: "/turpi.png",
        width: 512,
        height: 512,
        alt: "Turpi - Mascota Oficial de Resuelve AI Venezuela",
      },
    ],
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resuelve AI • Aprende Inteligencia Artificial en 3 Minutos al Día",
    description:
      "La app estilo Duolingo adaptada a Venezuela para dominar la IA sin palabras raras.",
    images: ["/turpi.png"],
    creator: "@resuelveia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/turpi.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icon-192.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#58cc02",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${nunito.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full bg-[#fbf9f8] text-[#1b1c1c] antialiased flex flex-col font-sans selection:bg-[#58cc02]/20">
        {children}
      </body>
    </html>
  );
}
