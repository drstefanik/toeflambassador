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
  if (!tableName) {
    throw new Error("Missing Airtable table name");
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
  contactLeads: env.AIRTABLE_TABLE_LEADS,
};

const CENTER_FIELDS = {
  Slug: "Slug",
  Name: "Name",
  City: "City",
  Address: "Address",
  Phone: "Phone",
  Email: "Email",
  Latitude: "Latitude",
  Longitude: "Longitude",
  Active: "Active",
  HeroImageUrl: "HeroImageUrl",
  CallSectionEnabled: "CallSectionEnabled",
  CallSectionTitle: "CallSectionTitle",
  CallSectionSubtitle: "CallSectionSubtitle",
  CallSectionPhoneLabel: "CallSectionPhoneLabel",
  CallSectionPhoneNumber: "CallSectionPhoneNumber",
  WriteSectionEnabled: "WriteSectionEnabled",
  WriteSectionTitle: "WriteSectionTitle",
  WriteSectionSubtitle: "WriteSectionSubtitle",
  ContactFormEmail: "ContactFormEmail",
  MapEnabled: "MapEnabled",
  AdminEmail: "AdminEmail",
};

const CENTER_USER_FIELDS = {
  Email: "Email",
  PasswordHash: "PasswordHash",
  Center: "Center",
};

const STUDENT_FIELDS = {
  Id: "Id",
  Email: "Email",
  FullName: "FullName",
  PasswordHash: "PasswordHash",
  Country: "Country",
  PreferredCenter: "PreferredCenter",
};

const CENTER_OTP_FIELDS = {
  Code: "Code",
  ExpiresAt: "ExpiresAt",
  Status: "Status",
  UsedAt: "UsedAt",
  Used: "Used",
  Utilizzato: "Utilizzato",
  Email: "Email",
  Center: "Center",
};

const ORDER_FIELDS = {
  StripeSessionId: "StripeSessionId",
  StripePaymentIntentId: "StripePaymentIntentId",
  Status: "Status",
  Type: "Type",
  CenterUser: "CenterUser",
  Center: "Center",
  Student: "Student",
  AmountTotal: "AmountTotal",
  Currency: "Currency",
};

const CONTACT_LEAD_FIELDS = {
  CenterSlug: "CenterSlug",
  CenterName: "CenterName",
  Email: "Email",
  Mobile: "Mobile",
  Subject: "Subject",
  Message: "Message",
  Ip: "IP",
  UserAgent: "UserAgent",
  Status: "Status",
  ResendMessageId: "ResendMessageId",
};

export interface CenterFields {
  Slug?: string;
  Name?: string;
  City?: string;
  Address?: string;
  Phone?: string;
  Email?: string;
  Latitude?: number;
  Longitude?: number;
  Active?: number;
  HeroImageUrl?: string;
  CallSectionEnabled?: boolean;
  CallSectionTitle?: string;
  CallSectionSubtitle?: string;
  CallSectionPhoneLabel?: string;
  CallSectionPhoneNumber?: string;
  WriteSectionEnabled?: boolean;
  WriteSectionTitle?: string;
  WriteSectionSubtitle?: string;
  ContactFormEmail?: string;
  MapEnabled?: boolean;
  AdminEmail?: string;
}

export interface CenterUserFields {
  Email?: string;
  PasswordHash?: string;
  Center?: string;
}

export interface StudentFields {
  Id?: string;
  Email?: string;
  FullName?: string;
  PasswordHash?: string;
  Country?: string;
  PreferredCenter?: string[];
}

export interface CenterOTPFields {
  Code?: string;
  ExpiresAt?: string;
  Status?: string;
  UsedAt?: string;
  Used?: boolean;
  Utilizzato?: boolean;
  Email?: string;
  Center?: string[];
}

export interface OrderFields {
  StripeSessionId?: string;
  StripePaymentIntentId?: string;
  Status?: string;
  Type?: string;
  CenterUser?: string[];
  Center?: string[];
  Student?: string[];
  AmountTotal?: number;
  Currency?: string;
}

export interface ContactLeadFields {
  CenterSlug?: string;
  CenterName?: string;
  Email?: string;
  Mobile?: string;
  Subject?: string;
  Message?: string;
  Ip?: string;
  UserAgent?: string;
  Status?: string;
  ResendMessageId?: string;
}

async function fetchAll<TFields>(tableName: string, params?: QueryParams) {
  const records: AirtableRecord<TFields>[] = [];
  let offset: string | undefined;

  do {
    const data = await airtableRequest<AirtableListResponse<TFields>>(
      tableName,
      "GET",
      undefined,
      { ...params, offset }
    );
    records.push(...(data.records || []));
    offset = data.offset;
  } while (offset);

  return records;
}

export async function getAllCenters() {
  return fetchAll<CenterFields>(tables.centers);
}

export async function getActiveCenters() {
  return fetchAll<CenterFields>(tables.centers, {
    filterByFormula: `{${CENTER_FIELDS.Active}}=1`,
  });
}

const norm = (v: unknown) => String(v ?? "").trim().toLowerCase();
const normalizeEmail = (email: string) => norm(email);
const buildLowercaseFormula = (fieldName: string, value: string) =>
  `LOWER({${fieldName}})='${escapeFormulaValue(value)}'`;
const looksLikeRecordId = (value: string) => /^rec[a-zA-Z0-9]{14}$/.test(value);

async function fetchFirst<TFields>(tableName: string, params?: QueryParams) {
  const data = await airtableRequest<AirtableListResponse<TFields>>(
    tableName,
    "GET",
    undefined,
    { maxRecords: 1, ...params }
  );

  return data.records?.[0] ?? null;
}

async function createRecord<TFields>(tableName: string, fields: Partial<TFields>) {
  const data = await airtableRequest<AirtableListResponse<TFields>>(
    tableName,
    "POST",
    {
      records: [{ fields }],
    }
  );

  const record = data.records?.[0];
  if (!record) {
    throw new Error(`Airtable create failed for ${tableName}`);
  }

  return record;
}

async function updateRecord<TFields>(
  tableName: string,
  recordId: string,
  fields: Partial<TFields>
) {
  return airtableRequest<AirtableRecord<TFields>>(
    `${tableName}/${recordId}`,
    "PATCH",
    { fields }
  );
}

export async function getCenterBySlug(slug: string) {
  const requested = decodeURIComponent(slug ?? "").trim().toLowerCase();

  if (!requested) return null;

  try {
    console.log("[getCenterBySlug] start", { slug });

    const all = await getAllCenters();

    console.log("[getCenterBySlug] centers loaded", {
      count: all.length,
      slugs: all.map((r) => r.fields?.Slug).slice(0, 10),
    });

    const found = all.find((r) => {
      const s = String(r.fields?.Slug ?? "").trim().toLowerCase();
      return s === requested;
    });

    if (found) return normalizeCenter(found);

    const target = slugify(requested);
    const soft = all.find((r) => {
      const f = r.fields || {};
      const candidate = String(f.Slug || f.City || f.Name || "");
      return slugify(candidate) === target;
    });

    if (!soft) console.log("[getCenterBySlug] no match", { requested });

    return soft ? normalizeCenter(soft) : null;
  } catch (e) {
    console.error("[getCenterBySlug] Airtable error:", e);
    throw e;
  }
}

export async function getCenterRecordBySlug(slug: string) {
  const requested = decodeURIComponent(slug ?? "").trim();

  if (!requested) return null;

  return fetchFirst<CenterFields>(tables.centers, {
    filterByFormula: `{${CENTER_FIELDS.Slug}}='${escapeFormulaValue(
      requested
    )}'`,
  });
}

export async function getCenterById(centerId: string) {
  return airtableRequest<AirtableRecord<CenterFields>>(
    `${tables.centers}/${centerId}`,
    "GET"
  );
}

export async function updateCenterFields(
  centerId: string,
  fields: Partial<CenterFields>
) {
  return airtableRequest<AirtableRecord<CenterFields>>(
    `${tables.centers}/${centerId}`,
    "PATCH",
    { fields }
  );
}

export async function createCenterUser(fields: CenterUserFields) {
  const normalizedEmail = fields.Email ? normalizeEmail(fields.Email) : undefined;
  return createRecord<CenterUserFields>(tables.centerUsers, {
    ...fields,
    Email: normalizedEmail ?? fields.Email,
  });
}

export async function createContactLead(fields: ContactLeadFields) {
  return createRecord<ContactLeadFields>(tables.contactLeads, {
    [CONTACT_LEAD_FIELDS.CenterSlug]: fields.CenterSlug,
    [CONTACT_LEAD_FIELDS.CenterName]: fields.CenterName,
    [CONTACT_LEAD_FIELDS.Email]: fields.Email,
    [CONTACT_LEAD_FIELDS.Mobile]: fields.Mobile,
    [CONTACT_LEAD_FIELDS.Subject]: fields.Subject,
    [CONTACT_LEAD_FIELDS.Message]: fields.Message,
    [CONTACT_LEAD_FIELDS.Ip]: fields.Ip,
    [CONTACT_LEAD_FIELDS.UserAgent]: fields.UserAgent,
    [CONTACT_LEAD_FIELDS.Status]: fields.Status,
    [CONTACT_LEAD_FIELDS.ResendMessageId]: fields.ResendMessageId,
  });
}

export async function getCenterUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  return fetchFirst<CenterUserFields>(tables.centerUsers, {
    filterByFormula: buildLowercaseFormula(CENTER_USER_FIELDS.Email, normalizedEmail),
  });
}

export async function updateCenterUser(
  centerUserId: string,
  fields: Partial<CenterUserFields>
) {
  const normalizedEmail = fields.Email ? normalizeEmail(fields.Email) : undefined;
  return updateRecord<CenterUserFields>(tables.centerUsers, centerUserId, {
    ...fields,
    Email: normalizedEmail ?? fields.Email,
  });
}

export async function createStudent(fields: StudentFields) {
  const normalizedEmail = fields.Email ? normalizeEmail(fields.Email) : undefined;
  return createRecord<StudentFields>(tables.students, {
    ...fields,
    Email: normalizedEmail ?? fields.Email,
  });
}

export async function getStudentByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  return fetchFirst<StudentFields>(tables.students, {
    filterByFormula: buildLowercaseFormula(STUDENT_FIELDS.Email, normalizedEmail),
  });
}

export async function getStudentById(studentId: string) {
  if (looksLikeRecordId(studentId)) {
    try {
      return await airtableRequest<AirtableRecord<StudentFields>>(
        `${tables.students}/${studentId}`,
        "GET"
      );
    } catch (error) {
      console.warn("[getStudentById] Airtable record lookup failed, falling back to Id", error);
    }
  }

  const record = await fetchFirst<StudentFields>(tables.students, {
    filterByFormula: `{${STUDENT_FIELDS.Id}}='${escapeFormulaValue(studentId)}'`,
  });

  if (!record) {
    throw new Error("Student not found");
  }

  return record;
}

export async function getCenterOTPByCode(code: string) {
  const normalizedCode = String(code ?? "").trim();
  if (!normalizedCode) {
    return null;
  }

  return fetchFirst<CenterOTPFields>(tables.centerOtps, {
    filterByFormula: `{${CENTER_OTP_FIELDS.Code}}='${escapeFormulaValue(normalizedCode)}'`,
  });
}

export async function updateCenterOTP(otpId: string, fields: Partial<CenterOTPFields>) {
  return updateRecord<CenterOTPFields>(tables.centerOtps, otpId, fields);
}

export async function createOrder(fields: OrderFields) {
  return createRecord<OrderFields>(tables.orders, fields);
}

export async function updateOrderByStripeSessionId(
  stripeSessionId: string,
  fields: Partial<OrderFields>
) {
  const record = await fetchFirst<OrderFields>(tables.orders, {
    filterByFormula: `{${ORDER_FIELDS.StripeSessionId}}='${escapeFormulaValue(
      stripeSessionId
    )}'`,
  });

  if (!record) {
    throw new Error("Order not found for Stripe session");
  }

  return updateRecord<OrderFields>(tables.orders, record.id, fields);
}
