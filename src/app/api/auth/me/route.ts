import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const payload = await verifyToken();
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
