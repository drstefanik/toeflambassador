import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ role: null }, { status: 200 });
  }

  return NextResponse.json({ role: user.role }, { status: 200 });
}
