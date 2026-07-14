import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const items = await prisma.project.findMany({
    orderBy: { sort: "desc" },
    include: { technologies: true, links: true },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { technologies, links, ...data } = await request.json();
  const item = await prisma.project.create({
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
