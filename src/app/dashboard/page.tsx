"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/data").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <p className="text-muted-foreground">Loading...</p>;

  const sections = [
    { name: "Profile", count: 1, href: "/dashboard/profile" },
    { name: "Skills", count: data.skills?.length || 0, href: "/dashboard/skills" },
    { name: "Work Experience", count: data.work?.length || 0, href: "/dashboard/work" },
    { name: "Education", count: data.education?.length || 0, href: "/dashboard/education" },
    { name: "Projects", count: data.projects?.length || 0, href: "/dashboard/projects" },
    { name: "Hackathons", count: data.hackathons?.length || 0, href: "/dashboard/hackathons" },
    { name: "Social Links", count: data.socialLinks?.length || 0, href: "/dashboard/contact" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link
            key={section.name}
            href={section.href}
            className="border border-border rounded-xl p-5 hover:ring-2 hover:ring-muted transition-all"
          >
            <div className="text-sm text-muted-foreground">{section.name}</div>
            <div className="text-3xl font-semibold mt-1">{section.count}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
