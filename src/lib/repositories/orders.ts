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
  options: {
    centerUserId?: string;
    centerId?: string;
    studentEmail?: string;
  }
) {
  const fields: OrderFields = {
    StripeSessionId: session.id,
    Status: "pending",
    Type: type,
    AmountTotal: session.amount_total ?? undefined,
    Currency: session.currency ?? undefined,
  };

  if (options.centerUserId) {
    fields.CenterUser = [options.centerUserId];
  }

  if (options.centerId) {
    fields.Center = [options.centerId];
  }

  if (options.studentEmail) {
    fields.StudentEmail = options.studentEmail;
  }

  const cleanedFields = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined)
  ) as OrderFields;

  console.log("[orders.createOrderFromStripeSession] Creating order with fields", {
    fieldNames: Object.keys(cleanedFields),
  });

  try {
    return await createOrder(cleanedFields);
  } catch (error) {
    console.error("[orders.createOrderFromStripeSession] Airtable create order failed", {
      fields: cleanedFields,
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
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
