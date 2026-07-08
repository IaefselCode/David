import "server-only";
import { prisma } from "@/lib/db";

export interface PortfolioData {
  profile: Awaited<ReturnType<typeof prisma.profile.findFirst>>;
  skills: Awaited<ReturnType<typeof prisma.skill.findMany>>;
  work: Awaited<ReturnType<typeof prisma.work.findMany>>;
  education: Awaited<ReturnType<typeof prisma.education.findMany>>;
  projects: Awaited<ReturnType<typeof prisma.project.findMany<{ include: { technologies: true; links: true } }>>>;
  hackathons: Awaited<ReturnType<typeof prisma.hackathon.findMany<{ include: { links: true } }>>>;
  socialLinks: Awaited<ReturnType<typeof prisma.socialLink.findMany>>;
  navbarItems: Awaited<ReturnType<typeof prisma.navbarItem.findMany>>;
}

export async function getPortfolioData(): Promise<PortfolioData> {
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

  return { profile, skills, work, education, projects, hackathons, socialLinks, navbarItems };
}

