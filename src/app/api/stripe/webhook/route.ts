import Stripe from "stripe";
import { NextResponse } from "next/server";
import { upsertOrderBySession, activateCenter } from "@/lib/airtable";

const ALLOWED_STATUS_VALUES = new Set(["CREATED", "PAID", "EXPIRED"]);

class AirtableWebhookError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AirtableWebhookError";
  }
}

function getStripeClient() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return null;
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
  });
}

function normalizeTypeValue(type: string | undefined) {
  if (!type) {
    return undefined;
  }

  return type === "ACTIVATION_PACK" ? "ACTIVATION PACK" : type;
}

function normalizeStatusValue(status: string) {
  return ALLOWED_STATUS_VALUES.has(status) ? status : "CREATED";
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
      const typeValue = normalizeTypeValue(meta.type);
      const statusValue = normalizeStatusValue("PAID");

      console.log("[webhook] metadata", session.metadata);

      try {
        await upsertOrderBySession(sessionId, {
          StripeSessionId: sessionId,
          Status: statusValue,
          Amount: amount,
          Currency: currency,
          Type: typeValue,
          CenterId: meta.centerId || undefined,
          CenterUserId: meta.centerUserId || undefined,
          CenterUserEmail: meta.centerUserEmail || undefined,
        });

        if (centerId) {
          await activateCenter(centerId, sessionId);
        }
      } catch (error) {
        console.error("[webhook] airtable update failed", error);
        throw new AirtableWebhookError("Airtable update failed", { cause: error });
      }

      console.log("[webhook] completed", {
        sessionId,
        centerId: meta.centerId,
        amount,
        currency,
      });
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        await upsertOrderBySession(session.id, { Status: normalizeStatusValue("EXPIRED") });
      } catch (error) {
        console.error("[webhook] airtable update failed", error);
        throw new AirtableWebhookError("Airtable update failed", { cause: error });
      }

      console.log("[stripe.webhook] checkout.session.expired", { sessionId: session.id });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[stripe.webhook] ERROR", err);

    if (err instanceof AirtableWebhookError) {
      return NextResponse.json({ error: "airtable failed" }, { status: 500 });
    }

    // Keep 200 for non-Airtable failures to avoid unnecessary Stripe retries.
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
