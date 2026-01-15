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
  AdminEmail?: string;
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
    filterByFormula: "{Active}=1",
  });
}

/**
 * ✅ VERSIONE ROBUSTA – NIENTE PIÙ 404
 */
export async function getCenterBySlug(slug: string) {
  const requested = decodeURIComponent(slug ?? "").trim().toLowerCase();

  try {
    const all = await getAllCenters();

    // MATCH HARD sul campo Slug
    const found = all.find((r) => {
      const s = String(r.fields?.Slug ?? "").trim().toLowerCase();
      return s === requested;
    });

    if (found) return normalizeCenter(found);

    // Fallback soft (slugify)
    const target = slugify(requested);
    const soft = all.find((r) => {
      const f = r.fields || {};
      const candidate = String(f.Slug || f.City || f.Name || "");
      return slugify(candidate) === target;
    });

    return soft ? normalizeCenter(soft) : null;
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
