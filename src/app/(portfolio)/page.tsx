/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import TopNav from "@/components/top-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPortfolioData, type PortfolioData } from "@/lib/portfolio";
import Link from "next/link";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import SkillsSection from "@/components/section/skills-section";
import { getIcon } from "@/lib/icons-map";
import GitHubActivity from "@/components/github-activity";
import { ArrowUpRight, MapPin, Mail, Globe, FileDown } from "lucide-react";

export const dynamic = "force-dynamic";

const BLUR_FADE_DELAY = 0.04;

function extractYear(dates: string): string | null {
  const match = dates.match(/(\d{4})/);
  return match ? match[1] : null;
}

export default async function Page() {
  let data: PortfolioData;
  try {
    data = await getPortfolioData();
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">Could not load data. Make sure the database is running and seeded.</p>
          <a href="/login" className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Go to Login</a>
        </div>
      </div>
    );
  }

  const profile = data.profile;
  const skills = data.skills || [];

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio not set up yet</h1>
          <p className="text-muted-foreground">Run <code className="text-sm bg-muted px-1.5 py-0.5 rounded">pnpm seed</code> to seed the database, or log in to the dashboard to add content.</p>
          <a href="/login" className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Go to Login</a>
        </div>
      </div>
    );
  }
  const education = data.education || [];
  const projects = data.projects || [];
  const hackathons = data.hackathons || [];
  const work = data.work || [];
  const socialLinks = data.socialLinks || [];

  const visibleSections = [
    ...(profile.summary ? [{ id: "about", label: "About" }] : []),
    ...(work.length > 0 ? [{ id: "work", label: "Work" }] : []),
    ...(education.length > 0 ? [{ id: "education", label: "Education" }] : []),
    ...(skills.length > 0 ? [{ id: "skills", label: "Skills" }] : []),
    ...(projects.length > 0 ? [{ id: "projects", label: "Projects" }] : []),
    ...(hackathons.length > 0 ? [{ id: "hackathons", label: "Hackathons" }] : []),
    ...(socialLinks.length > 0 ? [{ id: "contact", label: "Contact" }] : []),
  ];

  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <TopNav sections={visibleSections} />
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${profile.name.split(" ")[0]}`}
              />
              <BlurFadeText
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={BLUR_FADE_DELAY}
                text={profile.description}
              />
              <BlurFade delay={BLUR_FADE_DELAY} className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {profile.locationLink ? (
                      <Link href={profile.locationLink} target="_blank" rel="noopener noreferrer" className="hover:underline">{profile.location}</Link>
                    ) : (
                      profile.location
                    )}
                  </span>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-1 hover:underline">
                    <Mail className="size-3.5" />
                    {profile.email}
                  </a>
                )}
                {profile.url && (
                  <Link href={profile.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                    <Globe className="size-3.5" />
                    {new URL(profile.url).hostname}
                  </Link>
                )}
              </BlurFade>
              {profile.cvUrl && (
                <BlurFade delay={BLUR_FADE_DELAY} className="mt-2">
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <FileDown className="size-4" />
                    Download CV
                  </a>
                </BlurFade>
              )}
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2 flex flex-col items-center gap-2">
              <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted">
                <AvatarImage alt={profile.name} src={profile.avatarUrl} />
                <AvatarFallback>{profile.initials}</AvatarFallback>
              </Avatar>
              {profile.initials && (
                <span className="text-xs text-muted-foreground font-medium">{profile.initials}</span>
              )}
            </BlurFade>
          </div>
        </div>
      </section>
      {profile.summary && (
        <section id="about">
          <div className="flex min-h-0 flex-col gap-y-4">
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <h2 className="text-xl font-bold">About</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
                <Markdown rehypePlugins={[rehypeRaw]}>
                  {profile.summary}
                </Markdown>
              </div>
            </BlurFade>
          </div>
        </section>
      )}
      {profile.githubUsername && (
        <section id="github">
          <div className="flex min-h-0 flex-col gap-y-4">
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <h2 className="text-xl font-bold">GitHub Activity</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <GitHubActivity username={profile.githubUsername} />
            </BlurFade>
          </div>
        </section>
      )}
      {work.length > 0 && (
        <section id="work">
          <div className="flex min-h-0 flex-col gap-y-6">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <h2 className="text-xl font-bold">Work Experience</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
              <WorkSection work={work} />
            </BlurFade>
          </div>
        </section>
      )}
      {education.length > 0 && (
        <section id="education">
          <div className="flex min-h-0 flex-col gap-y-6">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <h2 className="text-xl font-bold">Education</h2>
            </BlurFade>
            <div className="flex flex-col gap-8">
              {education.map((edu, index) => (
                <BlurFade
                  key={edu.school}
                  delay={BLUR_FADE_DELAY * 8 + index * 0.05}
                >
                  <Link
                    href={edu.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-x-3 justify-between group"
                  >
                    <div className="flex items-center gap-x-3 flex-1 min-w-0">
                      {edu.logoUrl ? (
                        <img
                          src={edu.logoUrl}
                          alt={edu.school}
                          className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
                        />
                      ) : (
                        <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
                      )}
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="font-semibold leading-none flex items-center gap-2">
                          {edu.school}
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                        </div>
                        <div className="font-sans text-sm text-muted-foreground">
                          {edu.degree}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                      <span>
                        {edu.start} - {edu.end}
                      </span>
                    </div>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
      )}
      {skills.length > 0 && (
        <section id="skills">
          <div className="flex min-h-0 flex-col gap-y-4">
            <BlurFade delay={BLUR_FADE_DELAY * 9}>
              <h2 className="text-xl font-bold">Skills</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 10}>
              <SkillsSection skills={skills} />
            </BlurFade>
          </div>
        </section>
      )}
      {projects.length > 0 && (
        <section id="projects">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <ProjectsSection projects={projects} />
          </BlurFade>
        </section>
      )}
      {hackathons.length > 0 && (
        <section id="hackathons">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <HackathonsSection hackathons={hackathons} />
          </BlurFade>
        </section>
      )}
      {socialLinks.length > 0 && (
        <section id="contact">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <ContactSection socialLinks={socialLinks} calLink={profile.calLink} />
          </BlurFade>
        </section>
      )}

    </main>
  );
}
