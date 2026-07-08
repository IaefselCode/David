import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [
    profile,
    skills,
    work,
    education,
    projects,
    hackathons,
    socialLinks,
    navbarItems,
  ] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.skill.findMany({ orderBy: { sort: "asc" } }),
    prisma.work.findMany({ orderBy: { sort: "asc" } }),
    prisma.education.findMany({ orderBy: { sort: "asc" } }),
    prisma.project.findMany({
      orderBy: { sort: "asc" },
      include: { technologies: true, links: true },
    }),
    prisma.hackathon.findMany({
      orderBy: { sort: "asc" },
      include: { links: true },
    }),
    prisma.socialLink.findMany({ orderBy: { sort: "asc" } }),
    prisma.navbarItem.findMany({ orderBy: { sort: "asc" } }),
  ]);

  return NextResponse.json({
    profile,
    skills,
    work,
    education,
    projects,
    hackathons,
    socialLinks,
    navbarItems,
  });
}
