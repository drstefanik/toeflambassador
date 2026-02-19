import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { findOrderBySessionId, updateOrder } from "@/lib/airtable";
import { env } from "@/lib/config";
import { stripe } from "@/lib/stripe";

const updateStatusBySessionId = async (
  sessionId: string,
  fields: { Status: "PAID" | "EXPIRED" | "FAILED"; StripePaymentIntentId?: string; Amount?: number; Currency?: string }
) => {
  const orderRecord = await findOrderBySessionId(sessionId);
  if (!orderRecord) {
    console.warn("[stripe.webhook] Order not found", { sessionId, fields });
    return;
  }

  await updateOrder(orderRecord.id, fields);
};

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("[stripe.webhook] Invalid signature", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateStatusBySessionId(session.id, {
        Status: "PAID",
        StripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : undefined,
        Amount:
          typeof session.amount_total === "number" ? Number((session.amount_total / 100).toFixed(2)) : undefined,
        Currency: session.currency ? session.currency.toUpperCase() : undefined,
      });
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateStatusBySessionId(session.id, { Status: "EXPIRED" });
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const checkoutSessionId = typeof paymentIntent.metadata?.checkout_session_id === "string"
        ? paymentIntent.metadata.checkout_session_id
        : undefined;

      if (checkoutSessionId) {
        await updateStatusBySessionId(checkoutSessionId, { Status: "FAILED" });
      } else {
        console.warn("[stripe.webhook] payment_failed missing checkout_session_id", {
          paymentIntentId: paymentIntent.id,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe.webhook] Handler failure", { type: event.type, error });
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
