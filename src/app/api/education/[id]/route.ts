import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { deleteFile } from "@/lib/delete-file";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await request.json();

  const existing = await prisma.education.findUnique({ where: { id: parseInt(id) } });
  if (existing && "logoUrl" in data && data.logoUrl !== existing.logoUrl) {
    await deleteFile(existing.logoUrl);
  }

  const item = await prisma.education.update({ where: { id: parseInt(id) }, data });
  revalidatePath("/", "layout");
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const item = await prisma.education.findUnique({ where: { id: parseInt(id) } });
  if (item) await deleteFile(item.logoUrl);
  await prisma.education.delete({ where: { id: parseInt(id) } });
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
