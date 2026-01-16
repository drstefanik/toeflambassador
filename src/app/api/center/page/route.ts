import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { updateCenterFields } from "@/lib/repositories/centers";
import type { CenterFields } from "@/lib/airtable";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "center") {
      return NextResponse.json(
        { ok: false, error: "Non autorizzato" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const targetId = body?.centerId || user.centerId;
    const rawFields = (body?.fields ?? {}) as Record<string, unknown>;

    const sanitizeString = (value: unknown) => {
      if (value === undefined || value === null) return undefined;
      const trimmed = String(value).trim();
      return trimmed === "" ? "" : trimmed;
    };

    const sanitizeBoolean = (value: unknown) => {
      if (value === undefined || value === null) return undefined;
      if (typeof value === "boolean") return value;
      if (typeof value === "string") {
        const lowered = value.trim().toLowerCase();
        if (lowered === "true") return true;
        if (lowered === "false") return false;
      }
      if (typeof value === "number") return value !== 0;
      return Boolean(value);
    };

    const sanitizeNumber = (value: unknown, label: string) => {
      if (value === undefined || value === null || value === "") return undefined;
      const num = typeof value === "number" ? value : Number.parseFloat(String(value));
      if (Number.isNaN(num)) {
        throw new Error(`${label} deve essere un numero valido.`);
      }
      return num;
    };

    const fieldsToUpdate: Partial<CenterFields> = {
      HeroImageUrl: sanitizeString(rawFields.HeroImageUrl),
      CallSectionEnabled: sanitizeBoolean(rawFields.CallSectionEnabled),
      CallSectionTitle: sanitizeString(rawFields.CallSectionTitle),
      CallSectionSubtitle: sanitizeString(rawFields.CallSectionSubtitle),
      Phone: sanitizeString(rawFields.Phone),
      WriteSectionEnabled: sanitizeBoolean(rawFields.WriteSectionEnabled),
      WriteSectionTitle: sanitizeString(rawFields.WriteSectionTitle),
      WriteSectionSubtitle: sanitizeString(rawFields.WriteSectionSubtitle),
      ContactFormEmail: sanitizeString(rawFields.ContactFormEmail),
      MapEnabled: sanitizeBoolean(rawFields.MapEnabled),
      Latitude: sanitizeNumber(rawFields.Latitude, "Latitude"),
      Longitude: sanitizeNumber(rawFields.Longitude, "Longitude"),
      Address: sanitizeString(rawFields.Address),
    };

    const sanitizedFields = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([, value]) => value !== undefined)
    ) as Partial<CenterFields>;

    if (Object.keys(sanitizedFields).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Nessun campo valido da aggiornare." },
        { status: 400 }
      );
    }

    await updateCenterFields(targetId, sanitizedFields);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    let status = 500;
    let airtable: { type?: string; message?: string } | undefined;
    let message = "Impossibile salvare le impostazioni";

    if (raw.includes("Airtable request failed:")) {
      const payload = raw.split("Airtable request failed:")[1]?.trim();
      if (payload) {
        try {
          const parsed = JSON.parse(payload);
          airtable = {
            type: parsed?.error?.type,
            message: parsed?.error?.message,
          };
          if (airtable.message) {
            message = airtable.message;
          }
          if (airtable.type === "UNKNOWN_FIELD_NAME" || airtable.type === "INVALID_RECORD_DATA") {
            status = 422;
          } else {
            status = 400;
          }
        } catch {
          status = 400;
        }
      }
    } else if (raw.includes("deve essere un numero valido")) {
      status = 400;
      message = raw;
    } else if (raw.toLowerCase().includes("json")) {
      status = 400;
      message = "Payload JSON non valido.";
    }

    console.error("update center page", error);
    return NextResponse.json(
      {
        ok: false,
        error: message || "Impossibile salvare le impostazioni",
        airtable,
      },
      { status }
    );
  }
}
