import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import * as bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.adminUser.findUnique({ where: { id: auth.userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ username: user.username });
}

export async function PUT(request: Request) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username, currentPassword, newPassword } = await request.json();

  const user = await prisma.adminUser.findUnique({ where: { id: auth.userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (username && username !== user.username) {
    const existing = await prisma.adminUser.findUnique({ where: { username } });
    if (existing) return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required to set a new password" }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  const data: Record<string, string> = {};
  if (username) data.username = username;
  if (newPassword) data.passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.adminUser.update({ where: { id: auth.userId }, data });

  return NextResponse.json({ success: true });
}
