import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { deleteFile } from "@/lib/delete-file";

export async function PUT(request: Request) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const profile = await prisma.profile.findFirst();
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if ("avatarUrl" in data && data.avatarUrl !== profile.avatarUrl) {
    await deleteFile(profile.avatarUrl);
  }
  if ("cvUrl" in data && data.cvUrl !== profile.cvUrl) {
    await deleteFile(profile.cvUrl);
  }

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data,
  });
  return NextResponse.json(updated);
}
