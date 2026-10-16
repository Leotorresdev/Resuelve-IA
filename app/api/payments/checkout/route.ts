import { NextResponse } from "next/server";

interface CheckoutRequest {
  paymentMethod: "visa_mastercard" | "tokens" | "pago_movil";
  amountUsd: number;
  items: {
    type: "token_pack" | "bounty_post";
    name: string;
    quantity: number;
    priceUsd: number;
  }[];
  cardDetails?: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvc: string;
  };
}

export async function POST(req: Request) {
  try {
    const body: CheckoutRequest = await req.json();
    const { paymentMethod, amountUsd, items, cardDetails } = body;

    if (!amountUsd || amountUsd <= 0) {
      return NextResponse.json(
        { error: "Monto inválido para procesar el pago" },
        { status: 400 }
      );
    }

    // In a production environment, this is where Stripe / PayPal / Local Gateway is called.
    // E.g.: const paymentIntent = await stripe.paymentIntents.create({...})
    if (paymentMethod === "visa_mastercard") {
      if (!cardDetails) {
        return NextResponse.json(
          { error: "Detalles de tarjeta requeridos" },
          { status: 400 }
        );
      }

      // Basic card sanity validation (clean spaces/dashes)
      const sanitizedNumber = cardDetails.cardNumber.replace(/[\s-]/g, "");
      if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
        return NextResponse.json(
          { error: "Número de tarjeta inválido (debe tener entre 13 y 19 dígitos)" },
          { status: 400 }
        );
      }

      if (!cardDetails.cardHolder || cardDetails.cardHolder.trim().length < 3) {
        return NextResponse.json(
          { error: "Nombre del titular de tarjeta requerido" },
          { status: 400 }
        );
      }

      const cvcClean = cardDetails.cvc.trim();
      if (cvcClean.length < 3 || cvcClean.length > 4) {
        return NextResponse.json(
          { error: "Código de seguridad CVC/CVV inválido" },
          { status: 400 }
        );
      }
    }

    const transactionId = `tx_${paymentMethod === "visa_mastercard" ? "card" : "tok"}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return NextResponse.json({
      success: true,
      transactionId,
      status: "approved",
      amountPaid: amountUsd,
      currency: "USD",
      paymentMethod,
      items,
      message: "Pago procesado exitosamente en entorno seguro de Resuelve IA.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /api/payments/checkout:", error);
    return NextResponse.json(
      { error: "Error interno procesando la pasarela de pagos" },
      { status: 500 }
    );
  }
}
