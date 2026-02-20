import Stripe from "stripe";
import { NextResponse } from "next/server";
import { activateCenter, upsertOrderBySession } from "@/lib/airtable";

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }

  return new Stripe(key, {
    apiVersion: "2025-11-17.clover",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const stripe = getStripeClient();

    if (!stripe || !sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("[stripe.webhook] missing Stripe configuration");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const sessionId = session.id;
      const amount = (session.amount_total ?? 0) / 100;
      const currency = (session.currency ?? "eur").toUpperCase();
      const meta = session.metadata || {};

      await upsertOrderBySession(sessionId, {
        Status: "PAID",
        Amount: amount,
        Currency: currency,
      });

      if (meta.centerId) {
        await activateCenter(meta.centerId, sessionId);
      }

      console.log("[stripe.webhook] SUCCESS", sessionId);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[stripe.webhook] ERROR", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 200 });
  }
}
