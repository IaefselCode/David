import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const links = await prisma.socialLink.findMany({ orderBy: { sort: "asc" } });
  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const link = await prisma.socialLink.create({ data });
  revalidatePath("/", "layout");
  return NextResponse.json(link);
}
