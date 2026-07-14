import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { deleteFile } from "@/lib/delete-file";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { links, ...data } = await request.json();

  const existing = await prisma.hackathon.findUnique({ where: { id: parseInt(id) } });
  if (existing && "image" in data && data.image !== existing.image) {
    await deleteFile(existing.image);
  }

  await prisma.hackathonLink.deleteMany({ where: { hackathonId: parseInt(id) } });

  const item = await prisma.hackathon.update({
    where: { id: parseInt(id) },
    data: {
      ...data,
      links: { create: links || [] },
    },
    include: { links: true },
  });
  revalidatePath("/", "layout");
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const item = await prisma.hackathon.findUnique({ where: { id: parseInt(id) } });
  if (item) await deleteFile(item.image);
  await prisma.hackathon.delete({ where: { id: parseInt(id) } });
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
