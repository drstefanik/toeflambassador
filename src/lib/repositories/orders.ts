import Stripe from "stripe";
import { env } from "../config";
import { airtableRequest, createOrder, OrderFields, updateOrderByStripeSessionId } from "../airtable";

interface AirtableRecord<T> {
  id: string;
  fields: T;
}

interface AirtableListResponse<T> {
  records: AirtableRecord<T>[];
  offset?: string;
}

export interface CenterOrder {
  StripeSessionId: string;
  Amount: number | null;
  Currency: string | null;
  Status: string | null;
  CreatedAt: string | null;
  Type: string | null;
}

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

export async function listCenterOrders(centerUserId: string, centerId: string) {
  const tableName = env.AIRTABLE_TABLE_ORDERS;
  const filterByFormula = `OR({CenterUserId}="${centerUserId}",{CenterId}="${centerId}")`;

  const records: AirtableRecord<OrderFields>[] = [];
  let offset: string | undefined;

  do {
    const response = await airtableRequest<AirtableListResponse<OrderFields>>(
      tableName,
      "GET",
      undefined,
      {
        filterByFormula,
        sort: JSON.stringify([{ field: "CreatedAt", direction: "desc" }]),
        offset,
      }
    );

    records.push(...(response.records ?? []));
    offset = response.offset;
  } while (offset);

  return records.map((record) => ({
    StripeSessionId: record.fields.StripeSessionId ?? "",
    Amount: record.fields.Amount ?? record.fields.AmountTotal ?? null,
    Currency: record.fields.Currency ?? null,
    Status: record.fields.Status ?? null,
    CreatedAt: record.fields.CreatedAt ?? null,
    Type: record.fields.Type ?? null,
  } satisfies CenterOrder));
}
