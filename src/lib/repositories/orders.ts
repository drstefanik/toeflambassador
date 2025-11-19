import Stripe from "stripe";
import { createOrder, updateOrderByStripeSessionId } from "../airtable";

export async function createOrderFromStripeSession(
  session: Stripe.Checkout.Session,
  type: "center_kit" | "student_voucher",
  options: { centerUserId?: string; centerId?: string; studentId?: string }
) {
  return createOrder({
    StripeSessionId: session.id,
    Status: "pending",
    Type: type,
    CenterUser: options.centerUserId ? [options.centerUserId] : undefined,
    Center: options.centerId ? [options.centerId] : undefined,
    Student: options.studentId ? [options.studentId] : undefined,
    AmountTotal: session.amount_total ?? undefined,
    Currency: session.currency ?? undefined,
  });
}

export async function markOrderPaid(stripeSessionId: string, paymentIntentId?: string) {
  return updateOrderByStripeSessionId(stripeSessionId, {
    Status: "paid",
    StripePaymentIntentId: paymentIntentId,
  });
}
