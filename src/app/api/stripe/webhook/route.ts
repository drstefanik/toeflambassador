import Stripe from "stripe";
import { NextResponse } from "next/server";
import { upsertOrderBySession, activateCenter } from "@/lib/airtable";

function getStripeClient() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return null;
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = getStripeClient();

    if (!stripe || !sig || !webhookSecret) {
      console.error("[stripe.webhook] Missing Stripe configuration", {
        hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
        hasWebhookSignature: Boolean(sig),
        hasWebhookSecret: Boolean(webhookSecret),
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const sessionId = session.id;
      const amount = (session.amount_total ?? 0) / 100;
      const currency = (session.currency ?? "eur").toUpperCase();
      const meta = session.metadata || {};
      const centerId = meta.centerId || "";

      await upsertOrderBySession(sessionId, {
        Status: "PAID",
        Amount: amount,
        Currency: currency,
      });

      if (centerId) {
        await activateCenter(centerId, sessionId);
      }

      console.log("[stripe.webhook] checkout.session.completed OK", { sessionId, centerId, amount, currency });
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await upsertOrderBySession(session.id, { Status: "EXPIRED" });
      console.log("[stripe.webhook] checkout.session.expired", { sessionId: session.id });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    // DO NOT return redirects. Still respond 200 to Stripe to stop retries if signature fails in prod.
    console.error("[stripe.webhook] ERROR", err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
