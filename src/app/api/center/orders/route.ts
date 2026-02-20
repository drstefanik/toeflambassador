import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { listCenterOrders } from "@/lib/repositories/orders";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "center") {
      return NextResponse.json(
        { ok: false, error: "Non autorizzato" },
        { status: 401 }
      );
    }

    const orders = await listCenterOrders(user.centerUserId, user.centerId);

    return NextResponse.json({ ok: true, orders }, { status: 200 });
  } catch (error) {
    console.error("list center orders", error);
    return NextResponse.json(
      { ok: false, error: "Impossibile recuperare gli ordini" },
      { status: 500 }
    );
  }
}
