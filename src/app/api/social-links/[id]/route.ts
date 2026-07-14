import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await request.json();
  const link = await prisma.socialLink.update({ where: { id: parseInt(id) }, data });
  revalidatePath("/", "layout");
  return NextResponse.json(link);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.socialLink.delete({ where: { id: parseInt(id) } });
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
