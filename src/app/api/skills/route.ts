import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: { sort: "asc" } });
  return NextResponse.json(skills);
}

export async function POST(request: Request) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const skill = await prisma.skill.create({ data });
  revalidatePath("/", "layout");
  return NextResponse.json(skill);
}

export async function PUT(request: Request) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await request.json();
  for (const item of items) {
    await prisma.skill.update({ where: { id: item.id }, data: item });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
