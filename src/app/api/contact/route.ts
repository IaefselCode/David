import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const [profile, socialLinks, navbarItems] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.socialLink.findMany({ orderBy: { sort: "asc" } }),
    prisma.navbarItem.findMany({ orderBy: { sort: "asc" } }),
  ]);
  return NextResponse.json({ email: profile?.email, tel: profile?.tel, socialLinks, navbarItems });
}

export async function PUT(request: Request) {
  const auth = await verifyToken();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { socialLinks, navbarItems, ...profileData } = await request.json();

  const profile = await prisma.profile.findFirst();
  if (profile && Object.keys(profileData).length > 0) {
    await prisma.profile.update({ where: { id: profile.id }, data: profileData });
  }

  if (socialLinks) {
    for (const link of socialLinks) {
      await prisma.socialLink.update({ where: { id: link.id }, data: link });
    }
  }

  if (navbarItems) {
    for (const item of navbarItems) {
      await prisma.navbarItem.update({ where: { id: item.id }, data: item });
    }
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
