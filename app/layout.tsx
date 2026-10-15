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
    default: "Resuelve IA • Domina la Inteligencia Artificial en 3 Minutos al Día 🇻🇪",
    template: "%s | Resuelve IA",
  },
  description:
    "Aprende ingeniería de prompts y cómo hablarle a ChatGPT y Gemini con micro-lecciones interactivas estilo Duolingo. Diseñado para ahorrar tiempo en tu trabajo, vender más en tu negocio y estudiar sin estrés.",
  keywords: [
    "aprender inteligencia artificial",
    "ingenieria de prompts",
    "duolingo de inteligencia artificial",
    "como hablarle a chatgpt",
    "gemini ia gratis",
    "prompts para vender por whatsapp",
    "resuelve ia",
    "turpi inteligencia artificial",
    "ia para estudiantes",
    "ia para negocios",
  ],
  authors: [{ name: "Resuelve IA", url: baseUrl }],
  creator: "Resuelve IA",
  publisher: "Academia Resuelve IA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Resuelve IA • Domina la Inteligencia Artificial en 3 Minutos al Día 🇻🇪",
    description:
      "Micro-lecciones estilo Duolingo con Turpi para aprender prompts profesionales de IA. Vende más, ahorra horas de trabajo y estudia más rápido.",
    url: baseUrl,
    siteName: "Resuelve IA",
    images: [
      {
        url: "/turpi.png",
        width: 512,
        height: 512,
        alt: "Turpi - Mascota Oficial de Resuelve IA",
      },
      {
        url: "/flyer.jpg",
        width: 1080,
        height: 1920,
        alt: "Resuelve IA - Aprende IA jugando",
      },
    ],
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resuelve IA • Domina la IA en 3 Minutos al Día 🇻🇪",
    description:
      "Aprende a hablarle a la IA con micro-lecciones estilo Duolingo con Turpi. 100% práctico y sin tecnicismos.",
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Resuelve IA",
  },
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
  viewportFit: "cover",
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
