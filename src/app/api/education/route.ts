import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.education.findMany({ orderBy: { sort: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  const item = await prisma.education.create({ data });
  return NextResponse.json(item);
}
