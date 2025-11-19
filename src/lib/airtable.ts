import { env } from "./config";

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
  students: env.AIRTABLE_TABLE_STUDENTS,
  orders: env.AIRTABLE_TABLE_ORDERS,
};

export interface CenterFields {
  Name?: string;
  City?: string;
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
  Center?: string[];
  OTP?: string;
  OTPUsed?: boolean;
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
  const data = await airtableRequest<AirtableListResponse<CenterFields>>(
    tables.centers,
    "GET",
    undefined,
    {
      filterByFormula: `{Slug}='${escapeFormulaValue(slug)}'`,
      maxRecords: 1,
    }
  );
  return data.records[0] ?? null;
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
