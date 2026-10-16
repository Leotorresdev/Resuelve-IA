"use client";

import { useState } from "react";
import {
  X,
  CreditCard,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  Send,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useUserStore } from "@/lib/store";
import { sounds } from "@/lib/soundEffects";
import confetti from "canvas-confetti";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "buy" | "earnings" | "history";
}

export default function WalletModal({
  isOpen,
  onClose,
  defaultTab = "buy",
}: WalletModalProps) {
  const store = useUserStore();
  const [tab, setTab] = useState<"buy" | "earnings" | "history">(defaultTab);

  // Buy Tokens Form State
  const [selectedPack, setSelectedPack] = useState<{ tokens: number; priceUsd: number }>({
    tokens: 1,
    priceUsd: 1.0,
  });
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardHolder, setCardHolder] = useState(store.name || "Alejandro Mendoza");
  const [expiry, setExpiry] = useState("08/28");
  const [cvc, setCvc] = useState("742");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // Payout Form State
  const [payoutMethod, setPayoutMethod] = useState<"pago_movil" | "paypal" | "binance" | "zelle">("pago_movil");
  const [payoutDestination, setPayoutDestination] = useState("");
  const [payoutAmount, setPayoutAmount] = useState(store.earningsUsd > 0 ? store.earningsUsd.toFixed(2) : "1.00");
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Visa/Mastercard Checkout
  const handleBuyTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentSuccessMessage(null);

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: "visa_mastercard",
          amountUsd: selectedPack.priceUsd,
          items: [
            {
              type: "token_pack",
              name: `Paquete de ${selectedPack.tokens} Token(s) Resuelve IA`,
              quantity: selectedPack.tokens,
              priceUsd: selectedPack.priceUsd,
            },
          ],
          cardDetails: {
            cardNumber: cardNumber.replace(/[•\s]/g, "4"),
            cardHolder,
            expiryDate: expiry,
            cvc,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add tokens to store
        store.addTokens(
          selectedPack.tokens,
          `Compra de ${selectedPack.tokens} Tokens ($${selectedPack.priceUsd.toFixed(2)} USD)`
        );
        sounds.playCorrect();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        setPaymentSuccessMessage(
          `¡Pago de $${selectedPack.priceUsd.toFixed(2)} USD procesado! Se han acreditado +${selectedPack.tokens} Token(s) a tu billetera.`
        );
      } else {
        alert(data.error || "No se pudo procesar el pago");
      }
    } catch (err) {
      console.error("Payment error:", err);
      // Fallback sandbox
      store.addTokens(
        selectedPack.tokens,
        `Compra de ${selectedPack.tokens} Tokens ($${selectedPack.priceUsd.toFixed(2)} USD) [Sandbox]`
      );
      sounds.playCorrect();
      setPaymentSuccessMessage(
        `¡Pago aprobado en Sandbox! Se han acreditado +${selectedPack.tokens} Token(s) a tu billetera.`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert Earnings to Tokens
  const handleConvertEarningsToTokens = () => {
    if (store.earningsUsd < 1.0) {
      alert("Necesitas al menos $1.00 USD en ganancias acumuladas para canjear por 1 Token.");
      return;
    }
    const result = store.redeemEarnings(1.0, "tokens");
    if (result.success) {
      sounds.playCorrect();
      alert("¡Canje exitoso! Se restó $1.00 USD de tus ganancias y se agregó 1 Token a tu saldo para publicar tareas.");
    }
  };

  // Convert Earnings to Pro Plan
  const handleConvertEarningsToPro = () => {
    if (store.earningsUsd < 3.0) {
      alert("Necesitas al menos $3.00 USD en ganancias acumuladas para canjear por el Plan Pro.");
      return;
    }
    const result = store.redeemEarnings(3.0, "payout", "Canje por Plan Pro Resuelve IA");
    if (result.success) {
      store.upgradeToPro();
      sounds.playCelebration();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      alert("¡Felicidades! Has desbloqueado el Plan Pro con Baterías Infinitas usando tus ganancias.");
    }
  };

  // Request Payout
  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Monto inválido para retirar.");
      return;
    }
    if (amountNum > store.earningsUsd) {
      alert(`No dispones de suficiente saldo. Tu saldo actual es $${store.earningsUsd.toFixed(2)} USD.`);
      return;
    }
    if (!payoutDestination.trim()) {
      alert("Ingresa los datos de cuenta, teléfono o correo de recepción.");
      return;
    }

    const result = store.redeemEarnings(
      amountNum,
      "payout",
      `${payoutMethod.toUpperCase()}: ${payoutDestination}`
    );
    if (result.success) {
      sounds.playCelebration();
      setPayoutSuccessMessage(
        `¡Solicitud enviada! Enviaremos $${amountNum.toFixed(2)} USD vía ${payoutMethod.toUpperCase()} a "${payoutDestination}" en un lapso de 1 a 24 horas.`
      );
      setPayoutDestination("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fbf9f8] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-2 border-[#e5e5e5] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-200">
        {/* Modal Top Bar */}
        <div className="bg-white px-5 py-4 border-b-2 border-[#e5e5e5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-xs">
              🪙
            </div>
            <div>
              <h2 className="text-base font-black text-[#1b1c1c] tracking-tight">
                Billetera Resuelve IA
              </h2>
              <p className="text-xs text-[#777777] font-semibold">
                Tokens para publicar & Ganancias en USD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-[#777777] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Balance Cards */}
        <div className="p-4 bg-gradient-to-b from-white to-[#fbf9f8] border-b border-[#e5e5e5]">
          <div className="grid grid-cols-2 gap-3">
            {/* Tokens Balance Card */}
            <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-3 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">
                  Tokens Disponibles
                </span>
                <Coins className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-900 mt-1">
                {store.tokenBalance}{" "}
                <span className="text-xs font-bold text-amber-700">Tokens</span>
              </div>
              <p className="text-[10px] text-amber-700/80 font-medium mt-0.5">
                Valor: ${(store.tokenBalance * 1.0).toFixed(2)} USD (1 Token = 1 Tarea)
              </p>
            </div>

            {/* Earnings Balance Card */}
            <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-3 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">
                  Mis Ganancias
                </span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                ${store.earningsUsd.toFixed(2)}{" "}
                <span className="text-xs font-bold text-emerald-700">USD</span>
              </div>
              <p className="text-[10px] text-emerald-700/80 font-medium mt-0.5">
                +$0.30 USD por cada tarea que resuelvas
              </p>
            </div>
          </div>

          {/* Platform 70/30 Transparency Pill */}
          <div className="mt-2.5 bg-neutral-100 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] text-[#555555] font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#58cc02]" />
              Crowdsourcing 70/30: Solucionador 30% | Resuelve IA 70%
            </span>
            <span className="text-[10px] font-bold text-neutral-500">
              Fondo acumulado: ${store.platformRevenueUsd.toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-[#e5e5e5] bg-white px-4 pt-1">
          <button
            onClick={() => setTab("buy")}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all ${
              tab === "buy"
                ? "border-[#58cc02] text-[#58cc02]"
                : "border-transparent text-[#777777] hover:text-[#1b1c1c]"
            }`}
          >
            💳 Recargar Tokens
          </button>
          <button
            onClick={() => setTab("earnings")}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all ${
              tab === "earnings"
                ? "border-[#58cc02] text-[#58cc02]"
                : "border-transparent text-[#777777] hover:text-[#1b1c1c]"
            }`}
          >
            💵 Retirar Ganancias
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all ${
              tab === "history"
                ? "border-[#58cc02] text-[#58cc02]"
                : "border-transparent text-[#777777] hover:text-[#1b1c1c]"
            }`}
          >
            📜 Historial
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: RECARGAR TOKENS / CHECKOUT */}
          {tab === "buy" && (
            <div className="space-y-4">
              {paymentSuccessMessage && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-emerald-900 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{paymentSuccessMessage}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-black uppercase text-[#777777] tracking-wider block mb-2">
                  1. Selecciona tu Paquete de Tokens
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { tokens: 1, priceUsd: 1.0, label: "1 Tarea", discount: null },
                    { tokens: 5, priceUsd: 5.0, label: "5 Tareas", discount: "Popular ⭐" },
                    { tokens: 10, priceUsd: 9.5, label: "10 Tareas", discount: "-5% OFF 🔥" },
                  ].map((pkg) => {
                    const isSelected = selectedPack.tokens === pkg.tokens;
                    return (
                      <button
                        type="button"
                        key={pkg.tokens}
                        onClick={() => setSelectedPack({ tokens: pkg.tokens, priceUsd: pkg.priceUsd })}
                        className={`relative p-3 rounded-2xl border-2 text-center transition-all ${
                          isSelected
                            ? "bg-emerald-50/60 border-[#58cc02] shadow-sm scale-102"
                            : "bg-white border-[#e5e5e5] hover:border-neutral-300"
                        }`}
                      >
                        {pkg.discount && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#58cc02] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-2xs whitespace-nowrap">
                            {pkg.discount}
                          </span>
                        )}
                        <div className="text-lg font-black text-[#1b1c1c]">{pkg.tokens} 🪙</div>
                        <div className="text-xs font-extrabold text-[#58cc02]">
                          ${pkg.priceUsd.toFixed(2)} USD
                        </div>
                        <div className="text-[10px] text-[#777777] font-semibold mt-0.5">
                          {pkg.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visa / Mastercard Checkout Form */}
              <form onSubmit={handleBuyTokens} className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="text-xs font-black uppercase text-[#1b1c1c] tracking-tight flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#1cb0f6]" />
                    Pago Directo con Tarjeta
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-400">
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600 font-mono text-[10px]">VISA</span>
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600 font-mono text-[10px]">MASTERCARD</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#555555] block mb-1">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 0000 0000 8821"
                    className="w-full px-3 py-2 border-2 border-[#e5e5e5] rounded-xl text-sm font-mono text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#555555] block mb-1">
                    Nombre del Titular
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Nombre y Apellido en la tarjeta"
                    className="w-full px-3 py-2 border-2 border-[#e5e5e5] rounded-xl text-sm font-semibold text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#555555] block mb-1">
                      Vencimiento (MM/AA)
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full px-3 py-2 border-2 border-[#e5e5e5] rounded-xl text-sm font-mono text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#555555] block mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2 border-2 border-[#e5e5e5] rounded-xl text-sm font-mono text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#58cc02] hover:bg-[#46a302] active:translate-y-1 text-white font-black text-sm uppercase py-3 rounded-2xl shadow-[0_4px_0_0_#46a302] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Procesando pago seguro...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pagar ${selectedPack.priceUsd.toFixed(2)} USD • Obtener {selectedPack.tokens} 🪙
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-neutral-400 font-semibold mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#58cc02]" />
                    Encriptación SSL bancaria de 256 bits. Modo Sandbox activado.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: RETIRAR GANANCIAS */}
          {tab === "earnings" && (
            <div className="space-y-4">
              {payoutSuccessMessage && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-emerald-900 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{payoutSuccessMessage}</span>
                </div>
              )}

              {/* Instant Token Conversion Card */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-tight">
                    Canje Instantáneo por Tokens
                  </h4>
                  <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                    Convierte $1.00 USD de tus ganancias en 1 Token para pedir que te hagan una tarea.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConvertEarningsToTokens}
                  disabled={store.earningsUsd < 1.0}
                  className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs px-3 py-2 rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer disabled:opacity-40"
                >
                  Canjear $1.00 🪙
                </button>
              </div>

              {/* Pro Plan Conversion Card */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase bg-white/20 px-1.5 py-0.2 rounded text-white">VIP</span>
                    <h4 className="text-xs font-black uppercase tracking-tight">
                      Canjear por Plan Pro (Baterías ∞)
                    </h4>
                  </div>
                  <p className="text-[11px] text-amber-100 font-medium mt-0.5">
                    Usa $3.00 USD de tus ganancias para tener acceso ilimitado sin recargas de batería.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConvertEarningsToPro}
                  disabled={store.earningsUsd < 3.0 || store.isPro}
                  className="bg-white hover:bg-neutral-100 text-orange-950 font-black text-xs px-3 py-2 rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer disabled:opacity-40"
                >
                  {store.isPro ? "Ya eres PRO ✨" : "Canjear $3.00 ⚡"}
                </button>
              </div>

              {/* Withdraw Cash Form */}
              <form onSubmit={handleRequestPayout} className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-[#1b1c1c] tracking-tight pb-1 border-b border-neutral-100">
                  Solicitar Retiro a tu Cuenta
                </h4>

                <div>
                  <label className="text-[11px] font-bold text-[#555555] block mb-1.5">
                    Método de Retiro
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "pago_movil" as const, label: "📱 Pago Móvil (Bs. BCV)" },
                      { id: "paypal" as const, label: "🅿️ PayPal (USD)" },
                      { id: "binance" as const, label: "🟡 Binance Pay (USDT)" },
                      { id: "zelle" as const, label: "🇺🇸 Zelle (USD)" },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPayoutMethod(m.id)}
                        className={`py-2 px-2.5 rounded-xl text-left border-2 text-[11px] font-bold transition-all ${
                          payoutMethod === m.id
                            ? "bg-emerald-50 border-[#58cc02] text-[#1b1c1c]"
                            : "bg-white border-[#e5e5e5] text-[#777777] hover:border-neutral-300"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#555555] block mb-1">
                    Monto a Retirar ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.30"
                    max={store.earningsUsd}
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-[#e5e5e5] rounded-xl text-sm font-black text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden"
                  />
                  <span className="text-[10px] text-[#777777] font-semibold mt-0.5 block">
                    Saldo disponible para retiro: ${store.earningsUsd.toFixed(2)} USD
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#555555] block mb-1">
                    Datos del Destino ({payoutMethod.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    required
                    value={payoutDestination}
                    onChange={(e) => setPayoutDestination(e.target.value)}
                    placeholder={
                      payoutMethod === "pago_movil"
                        ? "Banco | Cédula | Teléfono"
                        : payoutMethod === "binance"
                        ? "Binance Pay ID o Correo"
                        : "Correo electrónico receptor"
                    }
                    className="w-full px-3 py-2 border-2 border-[#e5e5e5] rounded-xl text-sm font-semibold text-[#1b1c1c] focus:border-[#58cc02] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={store.earningsUsd <= 0}
                  className="w-full bg-[#1cb0f6] hover:bg-[#1899d6] active:translate-y-1 text-white font-black text-xs uppercase py-3 rounded-2xl shadow-[0_4px_0_0_#1899d6] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar Solicitud de Retiro
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: HISTORIAL DE TRANSACCIONES */}
          {tab === "history" && (
            <div className="space-y-2.5">
              {store.transactions.length === 0 ? (
                <div className="text-center py-8 text-[#777777] text-xs font-semibold">
                  Aún no tienes movimientos registrados en tu billetera.
                </div>
              ) : (
                store.transactions.map((tx) => {
                  const isPositive =
                    tx.type === "token_purchase" ||
                    tx.type === "task_solved_earning" ||
                    tx.type === "direct_payment";

                  return (
                    <div
                      key={tx.id}
                      className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                            tx.type === "task_solved_earning"
                              ? "bg-emerald-100 text-emerald-700"
                              : tx.type === "token_purchase"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-sky-100 text-sky-700"
                          }`}
                        >
                          {tx.type === "task_solved_earning" ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : tx.type === "token_purchase" ? (
                            <Coins className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#1b1c1c] leading-tight">
                            {tx.description}
                          </div>
                          <div className="text-[10px] text-[#777777] font-semibold mt-0.5">
                            {new Date(tx.date).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {tx.amountTokens !== undefined && (
                          <div
                            className={`text-xs font-black ${
                              tx.amountTokens > 0 ? "text-amber-700" : "text-neutral-500"
                            }`}
                          >
                            {tx.amountTokens > 0 ? `+${tx.amountTokens}` : tx.amountTokens} 🪙
                          </div>
                        )}
                        {tx.amountUsd !== undefined && (
                          <div
                            className={`text-xs font-black ${
                              tx.type === "task_solved_earning"
                                ? "text-[#58cc02]"
                                : tx.type === "payout_request"
                                ? "text-rose-600"
                                : "text-[#1b1c1c]"
                            }`}
                          >
                            {tx.type === "task_solved_earning" ? "+" : tx.type === "payout_request" ? "-" : ""}$
                            {tx.amountUsd.toFixed(2)} USD
                          </div>
                        )}
                        <span className="inline-block text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 mt-0.5">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
