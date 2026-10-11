"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Heart,
  Gem,
  Zap,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useUserStore } from "@/lib/store";

export default function StoreTab() {
  const store = useUserStore();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [heartRefilled, setHeartRefilled] = useState(false);

  const handleRefillHearts = () => {
    if (store.buyHeartsWithGems()) {
      setHeartRefilled(true);
      setTimeout(() => setHeartRefilled(false), 2500);
    }
  };

  const handleUpgradePro = () => {
    store.upgradeToPro();
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  return (
    <div className="pb-24 pt-3 max-w-xl mx-auto px-4 space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-4 rounded-3xl shadow-md border-b-4 border-amber-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-100">
            <ShoppingBag className="w-4 h-4" />
            <span>Tienda Oficial</span>
          </div>
          <h2 className="text-xl font-black mt-0.5 tracking-tight">
            Tienda & Resuelve PRO
          </h2>
          <p className="text-xs text-amber-50 font-semibold mt-0.5">
            Recarga vidas y desbloquea el poder total de la IA
          </p>
        </div>
        <div className="bg-white/20 p-2.5 rounded-2xl flex-shrink-0">
          <Gem className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Heart Refill Card */}
      <div className="bg-white border-2 border-b-4 border-[#e5e5e5] p-4 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-[#ff4b4b] flex-shrink-0">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#1b1c1c]">
              Recargar Todas las Vidas (5 ❤️)
            </h4>
            <p className="text-xs text-[#777777] font-semibold mt-0.5">
              Recupera tus vidas para seguir practicando sin esperas
            </p>
          </div>
        </div>

        <button
          onClick={handleRefillHearts}
          disabled={store.isPro || store.hearts >= store.maxHearts || store.gems < 50}
          className="btn-3d-blue px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 flex-shrink-0"
        >
          {heartRefilled ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>¡Listo!</span>
            </>
          ) : (
            <>
              <Gem className="w-3.5 h-3.5 fill-current" />
              <span>50 Gemas</span>
            </>
          )}
        </button>
      </div>

      {/* Resuelve PRO Super Subscription Box */}
      <div className="bg-gradient-to-b from-[#1b1c1c] to-[#2d2d2d] text-white p-5 rounded-3xl shadow-xl border-b-4 border-black relative overflow-hidden space-y-4">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#58cc02]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#58cc02] bg-[#58cc02]/20 px-3 py-1 rounded-full border border-[#58cc02]/30">
            MEMBRESÍA EXCLUSIVA 🇻🇪
          </span>
          <span className="text-xs font-black text-amber-400">
            $4.99 / mes
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Resuelve PRO</span>
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          </h3>
          <p className="text-xs text-neutral-300 font-semibold mt-1">
            Diseñado para profesionales, estudiantes y negocios que quieren dominar la IA sin límites.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-2 pt-1 text-xs font-bold text-neutral-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#58cc02] flex-shrink-0" />
            <span>Vidas Infinitas (❤️ ∞) — Nunca te detengas al equivocarte</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#58cc02] flex-shrink-0" />
            <span>Acceso Ilimitado a Gemini 2.5 Flash en Vivo</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#58cc02] flex-shrink-0" />
            <span>Certificados descargables ilimitados con código QR</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#58cc02] flex-shrink-0" />
            <span>Banco de Prompts para Negocios y WhatsApp en Venezuela</span>
          </div>
        </div>

        {/* Payment Methods in Venezuela */}
        <div className="pt-2 border-t border-neutral-700/80">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-2">
            Métodos de Pago Locales Aceptados:
          </span>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
            <div className="flex items-center gap-1 bg-neutral-800/80 px-2.5 py-1 rounded-lg border border-neutral-700">
              <Smartphone className="w-3.5 h-3.5 text-[#58cc02]" />
              <span>Pago Móvil (Tasa BCV)</span>
            </div>
            <div className="flex items-center gap-1 bg-neutral-800/80 px-2.5 py-1 rounded-lg border border-neutral-700">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Binance Pay / USDT</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {store.isPro ? (
          <div className="bg-[#58cc02]/20 border border-[#58cc02] text-[#58cc02] p-3 rounded-2xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>PLAN PRO YA ESTÁ ACTIVO EN TU CUENTA</span>
          </div>
        ) : (
          <button
            onClick={handleUpgradePro}
            className="w-full btn-3d-green py-3.5 rounded-2xl text-base font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
          >
            {paymentSuccess ? (
              <>
                <Check className="w-5 h-5" />
                <span>¡ACTIVADO CON ÉXITO!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-current" />
                <span>ACTIVAR RESUELVE PRO (PAGO MÓVIL / BINANCE)</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
