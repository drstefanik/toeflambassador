import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createOrder, findOrderBySessionId, updateCenterFields, updateOrder } from "@/lib/airtable";
import { stripe } from "@/lib/stripe";

async function upsertPaidOrder(params: {
  sessionId: string;
  amountTotal: number;
  currency: string;
  paymentIntent: string | null;
  centerId?: string;
  centerUserId?: string;
  centerUserEmail?: string;
}) {
  const {
    sessionId,
    amountTotal,
    currency,
    paymentIntent,
    centerId,
    centerUserId,
    centerUserEmail,
  } = params;

  try {
    const existing = await findOrderBySessionId(sessionId);

    if (existing) {
      await updateOrder(existing.id, {
        Status: "PAID",
        Amount: Number((amountTotal / 100).toFixed(2)),
        Currency: currency,
        StripePaymentIntentId: paymentIntent ?? undefined,
      });
      return;
    }

    await createOrder({
      Status: "PAID",
      StripeSessionId: sessionId,
      StripePaymentIntentId: paymentIntent ?? undefined,
      Amount: Number((amountTotal / 100).toFixed(2)),
      Currency: currency,
      CenterId: centerId,
      CenterUserId: centerUserId,
      CenterUserEmail: centerUserEmail,
      CreatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[airtable] order upsert failed", err);
  }
}

async function activateCenter(centerId: string | undefined, sessionId: string) {
  if (!centerId) {
    return;
  }

  try {
    await updateCenterFields(centerId, {
      ActivationPackStatus: "ACTIVE",
      ActivationPackPaidAt: new Date().toISOString(),
      ActivationPackOrderSessionId: sessionId,
    });
  } catch (err) {
    console.error("[airtable] center activation update failed", err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe.webhook] invalid signature", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const sessionId = session.id;
    const amountTotal = session.amount_total ?? 0;
    const currency = (session.currency ?? "eur").toUpperCase();
    const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : null;

    const meta = session.metadata || {};
    const centerId = meta.centerId;
    const centerUserId = meta.centerUserId;
    const centerUserEmail = meta.centerUserEmail;

    console.log("[stripe.webhook] completed", { sessionId, centerId, amountTotal, currency });

    await upsertPaidOrder({
      sessionId,
      amountTotal,
      currency,
      paymentIntent,
      centerId,
      centerUserId,
      centerUserEmail,
    });

    await activateCenter(centerId, sessionId);
  }

  return Response.json({ received: true });
}
