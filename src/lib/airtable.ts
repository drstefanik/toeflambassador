import { env } from "./config";
import { normalizeCenter } from "./normalize-center";
import { slugify } from "./slugify";

type Method = "GET" | "POST" | "PATCH";

type QueryParams = Record<string, string | number | undefined>;

export interface AirtableRecord<T> {
  id: string;
  createdTime: string;
  fields: T;
}

interface AirtableListResponse<T> {
  records: AirtableRecord<T>[];
  offset?: string;
}

const AIRTABLE_BASE_URL = env.AIRTABLE_BASE_ID
  ? `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/`
  : "";

const escapeFormulaValue = (value: string) => value.replace(/'/g, "\\'");

const withAuthHeaders = () => {
  if (!env.AIRTABLE_PERSONAL_TOKEN) {
    throw new Error("Missing AIRTABLE_PERSONAL_TOKEN");
  }

  return {
    Authorization: `Bearer ${env.AIRTABLE_PERSONAL_TOKEN}`,
    "Content-Type": "application/json",
  };
};

export async function airtableRequest<T>(
  tableName: string,
  method: Method,
  body?: unknown,
  params?: QueryParams
): Promise<T> {
  if (!AIRTABLE_BASE_URL) {
    throw new Error("Missing AIRTABLE_BASE_ID");
  }

  const url = new URL(`${AIRTABLE_BASE_URL}${tableName}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: withAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable request failed: ${error}`);
  }

  return response.json();
}

const tables = {
  centers: env.AIRTABLE_TABLE_CENTERS,
  centerUsers: env.AIRTABLE_TABLE_CENTER_USERS,
  centerOtps: env.AIRTABLE_TABLE_CENTER_OTPS,
  students: env.AIRTABLE_TABLE_STUDENTS,
  orders: env.AIRTABLE_TABLE_ORDERS,
};

export interface CenterFields {
  Name?: string;
  City?: string;
  "Città"?: string;
  Slug?: string;
  Active?: number;
  HeroImageUrl?: string;
  CallSectionEnabled?: boolean;
  CallSectionTitle?: string;
  CallSectionSubtitle?: string;
  CallSectionPhoneLabel?: string;
  CallSectionPhoneNumber?: string;
  ContactFormEmail?: string;
  WriteSectionEnabled?: boolean;
  WriteSectionTitle?: string;
  WriteSectionSubtitle?: string;
  MapEnabled?: boolean;
  Latitude?: number;
  Longitude?: number;
  Address?: string;
  AdminEmail?: string;
}

export interface StudentFields {
  Email?: string;
  FullName?: string;
  PasswordHash?: string;
  Country?: string;
  PreferredCenter?: string[];
}

export interface CenterUserFields {
  Email?: string;
  PasswordHash?: string;
  Center?: string;
}

export interface CenterOTPFields {
  OTP?: string;
  Center?: string[];
  Status?: string;
  ExpiresAt?: string;
  UsedAt?: string;
}

export interface OrderFields {
  StripeSessionId?: string;
  StripePaymentIntentId?: string;
  Status?: string;
  Type?: string;
  Student?: string[];
  CenterUser?: string[];
  Center?: string[];
  AmountTotal?: number;
  Currency?: string;
}

export async function getAllCenters() {
  const data = await airtableRequest<AirtableListResponse<CenterFields>>(
    tables.centers,
    "GET"
  );
  return data.records;
}

export async function getCenters() {
  return getAllCenters();
}

export async function getActiveCenters() {
  const data = await airtableRequest<AirtableListResponse<CenterFields>>(
    tables.centers,
    "GET",
    undefined,
    { filterByFormula: "{Active}=1" }
  );
  return data.records;
}

export async function getCenterBySlug(slug: string) {
  const normalized = slugify(decodeURIComponent(slug ?? "")).trim();

  // Airtable formula strings use double quotes; escape any that might appear (defensive).
  const esc = (s: string) => s.replace(/"/g, '\"');

  try {
    // 1) Lookup by stored Slug (preferred)
    const bySlug = await airtableRequest<AirtableListResponse<CenterFields>>(
      tables.centers,
      "GET",
      undefined,
      { maxRecords: 1, filterByFormula: `{Slug} = "${esc(normalized)}"` }
    );
    if (bySlug.records?.length) return normalizeCenter(bySlug.records[0]);

    // 2) Fallback: match by City
    const byCity = await airtableRequest<AirtableListResponse<CenterFields>>(
      tables.centers,
      "GET",
      undefined,
      { maxRecords: 1, filterByFormula: `LOWER({City}) = "${esc(normalized)}"` }
    );
    if (byCity.records?.length) return normalizeCenter(byCity.records[0]);

    // 3) Fallback: match by Città (legacy/IT column)
    const byCitta = await airtableRequest<AirtableListResponse<CenterFields>>(
      tables.centers,
      "GET",
      undefined,
      { maxRecords: 1, filterByFormula: `LOWER({Città}) = "${esc(normalized)}"` }
    );
    if (byCitta.records?.length) return normalizeCenter(byCitta.records[0]);

    return null;
  } catch (e) {
    console.error("[getCenterBySlug] Airtable error:", e);
    throw e;
  }
}

export async function getCenterById(centerId: string) {
  return airtableRequest<AirtableRecord<CenterFields>>(
    `${tables.centers}/${centerId}`,
    "GET"
  );
}

export async function updateCenterFields(centerId: string, fields: Partial<CenterFields>) {
  return airtableRequest<AirtableRecord<CenterFields>>(
    `${tables.centers}/${centerId}`,
    "PATCH",
    { fields }
  );
}

export async function createStudent(fields: StudentFields) {
  return airtableRequest<AirtableRecord<StudentFields>>(tables.students, "POST", {
    fields,
  });
}

export async function getStudentByEmail(email: string) {
  const data = await airtableRequest<AirtableListResponse<StudentFields>>(
    tables.students,
    "GET",
    undefined,
    {
      filterByFormula: `LOWER({Email})='${escapeFormulaValue(email.toLowerCase())}'`,
      maxRecords: 1,
    }
  );
  return data.records[0] ?? null;
}

export async function getStudentById(studentId: string) {
  return airtableRequest<AirtableRecord<StudentFields>>(
    `${tables.students}/${studentId}`,
    "GET"
  );
}

export async function createCenterUser(fields: CenterUserFields) {
  return airtableRequest<AirtableRecord<CenterUserFields>>(
    tables.centerUsers,
    "POST",
    { fields }
  );
}

export async function getCenterUserByEmail(email: string) {
  const data = await airtableRequest<AirtableListResponse<CenterUserFields>>(
    tables.centerUsers,
    "GET",
    undefined,
    {
      filterByFormula: `LOWER({Email})='${escapeFormulaValue(email.toLowerCase())}'`,
      maxRecords: 1,
    }
  );
  return data.records[0] ?? null;
}

export async function updateCenterUser(centerUserId: string, fields: Partial<CenterUserFields>) {
  return airtableRequest<AirtableRecord<CenterUserFields>>(
    `${tables.centerUsers}/${centerUserId}`,
    "PATCH",
    { fields }
  );
}

export async function getCenterOTPByCode(otp: string) {
  const data = await airtableRequest<AirtableListResponse<CenterOTPFields>>(
    tables.centerOtps,
    "GET",
    undefined,
    {
      filterByFormula: `AND({OTP}='${escapeFormulaValue(otp)}',{Status}='active')`,
      maxRecords: 1,
    }
  );
  return data.records[0] ?? null;
}

export async function updateCenterOTP(centerOtpId: string, fields: Partial<CenterOTPFields>) {
  return airtableRequest<AirtableRecord<CenterOTPFields>>(
    `${tables.centerOtps}/${centerOtpId}`,
    "PATCH",
    { fields }
  );
}

export async function createOrder(fields: OrderFields) {
  return airtableRequest<AirtableRecord<OrderFields>>(tables.orders, "POST", {
    fields,
  });
}

export async function updateOrderByStripeSessionId(
  stripeSessionId: string,
  fields: Partial<OrderFields>
) {
  const data = await airtableRequest<AirtableListResponse<OrderFields>>(
    tables.orders,
    "GET",
    undefined,
    {
      filterByFormula: `{StripeSessionId}='${escapeFormulaValue(stripeSessionId)}'`,
      maxRecords: 1,
    }
  );

  if (!data.records.length) {
    return null;
  }

  const recordId = data.records[0].id;
  return airtableRequest<AirtableRecord<OrderFields>>(
    `${tables.orders}/${recordId}`,
    "PATCH",
    { fields }
  );
}
