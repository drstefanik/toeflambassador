import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/airtable";
import { env } from "@/lib/config";
import { stripe } from "@/lib/stripe";

type CheckoutType = "ACTIVATION_PACK" | "IBT_VOUCHER";

interface CheckoutPayload {
  type: CheckoutType;
  centerUserEmail?: string;
  studentEmail?: string;
}

const FALLBACK_URL = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const getPriceIdByType = (type: CheckoutType) => {
  if (type === "ACTIVATION_PACK") {
    return env.TOEFL_Ambassador_Activation_Pack_PRICE_ID;
  }

  return env.TOEFL_iBT_Voucher_PRICE_ID;
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CheckoutPayload;
    const type = payload?.type;

    if (type !== "ACTIVATION_PACK" && type !== "IBT_VOUCHER") {
      return NextResponse.json({ error: "Invalid checkout type" }, { status: 400 });
    }

    const priceId = getPriceIdByType(type);
    if (!priceId) {
      return NextResponse.json({ error: `Missing Stripe price id for ${type}` }, { status: 500 });
    }

    const origin = request.headers.get("origin") ?? FALLBACK_URL;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?canceled=1`,
      metadata: {
        type,
        centerUserEmail: payload.centerUserEmail ?? "",
        studentEmail: payload.studentEmail ?? "",
      },
      customer_email: payload.centerUserEmail || payload.studentEmail,
    });

    await createOrder({
      Status: "CREATED",
      StripeSessionId: session.id,
      Type: type,
      CenterUserEmail: payload.centerUserEmail,
      StudentEmail: payload.studentEmail,
      CreatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe.checkout] Failed to create checkout session", error);
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
}
