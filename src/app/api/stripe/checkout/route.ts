import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/airtable";
import { getUserFromRequest } from "@/lib/auth";
import { env } from "@/lib/config";
import { stripe } from "@/lib/stripe";

interface CheckoutPayload {
  type: "ACTIVATION_PACK";
  studentEmail?: string;
}

const FALLBACK_URL = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CheckoutPayload;
    if (payload?.type !== "ACTIVATION_PACK") {
      return NextResponse.json({ error: "Invalid checkout type" }, { status: 400 });
    }

    if (!env.TOEFL_Ambassador_Activation_Pack_PRICE_ID) {
      return NextResponse.json({ error: "Missing Stripe price id for ACTIVATION_PACK" }, { status: 500 });
    }

    const user = await getUserFromRequest(request);
    if (!user || user.role !== "center") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const centerUserEmail = user.email;
    const centerUserId = user.centerUserId;
    const centerId = user.centerId;
    const studentEmail = payload.studentEmail?.trim() || "";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || FALLBACK_URL;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: env.TOEFL_Ambassador_Activation_Pack_PRICE_ID, quantity: 1 }],
      success_url: `${appUrl}/center/dashboard?success=1`,
      cancel_url: `${appUrl}/center/dashboard?canceled=1`,
      metadata: {
        type: "ACTIVATION_PACK",
        centerId,
        centerUserId,
        centerUserEmail,
        studentEmail,
      },
      customer_email: centerUserEmail,
    });

    try {
      await createOrder({
        Status: "CREATED",
        StripeSessionId: session.id,
        CenterUserEmail: centerUserEmail,
        CenterId: centerId,
        CenterUserId: centerUserId,
        StudentEmail: studentEmail || undefined,
        CreatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[stripe.checkout] Failed to create Airtable order (continuing)", {
        stripeSessionId: session.id,
        error,
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe.checkout] Failed to create checkout session", error);
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
}
