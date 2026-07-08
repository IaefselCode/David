"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LayoutDashboard, User, Code, Briefcase, GraduationCap, FolderKanban, Trophy, Mail, Settings, Compass } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/skills", label: "Skills", icon: Code },
  { href: "/dashboard/work", label: "Work", icon: Briefcase },
  { href: "/dashboard/education", label: "Education", icon: GraduationCap },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/hackathons", label: "Hackathons", icon: Trophy },
  { href: "/dashboard/contact", label: "Contact", icon: Mail },
  { href: "/dashboard/navigation", label: "Navigation", icon: Compass },
  { href: "/dashboard/account", label: "Account", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => { if (!r.ok) router.push("/login"); else setAuthed(true); })
      .catch(() => router.push("/login"));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen flex">
      <nav className="w-56 border-r border-border bg-card p-4 flex flex-col gap-1 shrink-0">
        <div className="text-lg font-semibold tracking-tight mb-4 px-3">Dashboard</div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        ))}
        <div className="mt-auto pt-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
