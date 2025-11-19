import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { env } from "@/lib/config";
import { createOrderFromStripeSession } from "@/lib/repositories/orders";
import { stripe } from "@/lib/stripe";

const FALLBACK_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "center") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    if (!env.TOEFL_Ambassador_Activation_Pack_ID) {
      return NextResponse.json({ error: "ID prodotto non configurato" }, { status: 500 });
    }

    const origin = request.headers.get("origin") ?? FALLBACK_URL;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: env.TOEFL_Ambassador_Activation_Pack_ID,
          quantity: 1,
        },
      ],
      success_url: `${origin}/center/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/center/dashboard?canceled=1`,
      metadata: {
        type: "center_kit",
        centerUserId: user.centerUserId,
        centerId: user.centerId,
      },
      customer_email: user.email,
    });

    await createOrderFromStripeSession(session, "center_kit", {
      centerUserId: user.centerUserId,
      centerId: user.centerId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("checkout center kit", error);
    return NextResponse.json({ error: "Impossibile creare la sessione" }, { status: 500 });
  }
}
