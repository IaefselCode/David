import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { deleteFile } from "@/lib/delete-file";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { technologies, links, ...data } = await request.json();

  const existing = await prisma.project.findUnique({ where: { id: parseInt(id) } });
  if (existing) {
    if ("image" in data && data.image !== existing.image) await deleteFile(existing.image);
    if ("video" in data && data.video !== existing.video) await deleteFile(existing.video);
  }

  await prisma.projectTechnology.deleteMany({ where: { projectId: parseInt(id) } });
  await prisma.projectLink.deleteMany({ where: { projectId: parseInt(id) } });

  const item = await prisma.project.update({
    where: { id: parseInt(id) },
    data: {
      ...data,
      technologies: { create: technologies.map((t: string) => ({ name: t })) },
      links: { create: links || [] },
    },
    include: { technologies: true, links: true },
  });
  revalidatePath("/", "layout");
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const item = await prisma.project.findUnique({ where: { id: parseInt(id) } });
  if (item) {
    await deleteFile(item.image);
    await deleteFile(item.video);
  }
  await prisma.project.delete({ where: { id: parseInt(id) } });
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
