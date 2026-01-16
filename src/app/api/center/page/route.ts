import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { updateCenterFields } from "@/lib/repositories/centers";
import type { CenterFields } from "@/lib/airtable";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "center") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { centerId, fields } = await request.json();
    const targetId = centerId || user.centerId;

    const {
      HeroImageUrl,
      CallSectionEnabled,
      CallSectionTitle,
      CallSectionSubtitle,
      Phone,
      WriteSectionEnabled,
      WriteSectionTitle,
      WriteSectionSubtitle,
      ContactFormEmail,
      MapEnabled,
      Latitude,
      Longitude,
      Address,
    } = (fields ?? {}) as CenterFields;

    const sanitizedFields = Object.fromEntries(
      Object.entries({
        HeroImageUrl,
        CallSectionEnabled,
        CallSectionTitle,
        CallSectionSubtitle,
        Phone,
        WriteSectionEnabled,
        WriteSectionTitle,
        WriteSectionSubtitle,
        ContactFormEmail,
        MapEnabled,
        Latitude,
        Longitude,
        Address,
      }).filter(([, value]) => value !== undefined)
    ) as Partial<CenterFields>;

    const updated = await updateCenterFields(targetId, sanitizedFields);
    return NextResponse.json({ success: true, center: updated });
  } catch (error) {
    console.error("update center page", error);
    return NextResponse.json({ error: "Impossibile salvare le impostazioni" }, { status: 500 });
  }
}
