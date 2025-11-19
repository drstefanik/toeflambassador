import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { updateCenterFields } from "@/lib/repositories/centers";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "center") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { fields } = await request.json();
    const targetId = user.centerId;

    if (!targetId) {
      return NextResponse.json({ error: "Centro non trovato" }, { status: 400 });
    }

    const updated = await updateCenterFields(targetId, fields);
    return NextResponse.json({ success: true, center: updated });
  } catch (error) {
    console.error("update center page", error);
    return NextResponse.json({ error: "Impossibile salvare le impostazioni" }, { status: 500 });
  }
}
