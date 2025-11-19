import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/config";
import { markOrderPaid } from "@/lib/repositories/orders";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook non configurato" }, { status: 400 });
  }

  const body = await request.arrayBuffer();
  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(
      Buffer.from(body),
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Invalid webhook", error);
    return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await markOrderPaid(session.id, session.payment_intent as string | undefined);

    const recipient = session.customer_email;
    if (recipient) {
      await sendEmail({
        to: recipient,
        subject: "Pagamento TOEFL Ambassador confermato",
        html: `<p>Ciao,</p><p>Abbiamo ricevuto il tuo pagamento (${session.metadata?.type}). Ti contatteremo a breve con tutti i dettagli.</p>`,
      });
    }
  }

  return NextResponse.json({ received: true });
}
