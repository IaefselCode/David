import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const items = await prisma.hackathon.findMany({
    orderBy: { sort: "desc" },
    include: { links: true },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { links, ...data } = await request.json();
  const item = await prisma.hackathon.create({
    data: {
      ...data,
      links: { create: links || [] },
    },
    include: { links: true },
  });
  revalidatePath("/", "layout");
  return NextResponse.json(item);
}
