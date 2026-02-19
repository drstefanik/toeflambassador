import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder, findOrderBySessionId, updateCenterFields, updateOrder } from "@/lib/airtable";
import { env } from "@/lib/config";
import { stripe } from "@/lib/stripe";

const toAmount = (amountTotal: number | null) =>
  typeof amountTotal === "number" ? Number((amountTotal / 100).toFixed(2)) : undefined;

const toCurrency = (currency: string | null) =>
  typeof currency === "string" ? currency.toUpperCase() : undefined;

async function upsertOrderFromCheckoutSession(
  session: Stripe.Checkout.Session,
  status: "PAID" | "EXPIRED" | "FAILED" | "CANCELED"
) {
  const metadata = session.metadata ?? {};
  const fields = {
    Status: status,
    StripeSessionId: session.id,
    StripePaymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : undefined,
    Amount: toAmount(session.amount_total),
    Currency: toCurrency(session.currency),
    Type: metadata.type || undefined,
    CenterUserEmail: metadata.centerUserEmail || undefined,
    CenterId: metadata.centerId || undefined,
    CenterUserId: metadata.centerUserId || undefined,
    StudentEmail: metadata.studentEmail || undefined,
    CreatedAt: new Date().toISOString(),
  };

  const existing = await findOrderBySessionId(session.id);
  if (existing) {
    await updateOrder(existing.id, fields);
    return;
  }

  await createOrder(fields);
}

async function maybeActivateCenter(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {};
  if (metadata.type !== "ACTIVATION_PACK" || !metadata.centerId) {
    return;
  }

  await updateCenterFields(metadata.centerId, {
    ActivationPackStatus: "ACTIVE",
    ActivationPackPaidAt: new Date().toISOString(),
    ActivationPackOrderSessionId: session.id,
  });
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("[stripe.webhook] Invalid signature", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await upsertOrderFromCheckoutSession(session, "PAID");
      await maybeActivateCenter(session);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await upsertOrderFromCheckoutSession(session, "EXPIRED");
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await upsertOrderFromCheckoutSession(session, "FAILED");
    }

    if (event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      await upsertOrderFromCheckoutSession(session, "PAID");
      await maybeActivateCenter(session);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe.webhook] Handler failure", { type: event.type, error });
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
