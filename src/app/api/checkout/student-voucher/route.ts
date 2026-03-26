import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { createOrderFromStripeSession } from "@/lib/repositories/orders";
import { stripe } from "@/lib/stripe";

const FALLBACK_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const voucherPriceId = process.env.TOEFL_iBT_Voucher_PRICE_ID;
    if (!voucherPriceId) {
      console.error("[checkout student voucher] Missing TOEFL_iBT_Voucher_PRICE_ID environment variable");
      return NextResponse.json({ error: "Prezzo voucher non configurato" }, { status: 500 });
    }

    const origin = request.headers.get("origin") ?? FALLBACK_URL;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: voucherPriceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/student/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/student/dashboard?canceled=1`,
      metadata: {
        type: "student_voucher",
        studentId: user.studentId,
      },
      customer_email: user.email,
    });

    await createOrderFromStripeSession(session, "student_voucher", {
      studentEmail: user.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("checkout student voucher", error);
    return NextResponse.json({ error: "Impossibile creare la sessione" }, { status: 500 });
  }
}
