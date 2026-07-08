import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPortfolioData } from "@/lib/portfolio";
import { getIcon } from "@/lib/icons-map";
import { HomeIcon, MailIcon } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  home: <HomeIcon className="size-full rounded-sm overflow-hidden object-contain" />,
};

export default async function Navbar() {
  const data = await getPortfolioData();
  const navbarItems = data.navbarItems?.filter((i) => i.label.toLowerCase() !== "blog") || [];
  const socialLinks = data.socialLinks || [];
  const profile = data.profile;

  const shownSocials = socialLinks.filter((s) => s.navbar);

  const btnClass = "rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors";

  function DockBtn({ href, icon, label, external }: { href: string; icon: React.ReactNode; label: string; external?: boolean }) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
            <DockIcon className={btnClass}>{icon}</DockIcon>
          </a>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <p>{label}</p>
          <TooltipArrow className="fill-primary" />
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
      <Dock className="z-50 pointer-events-auto relative h-14 p-2 w-fit mx-auto flex gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
        {navbarItems.map((item) => (
          <DockBtn key={item.href} href={item.href} icon={iconMap[item.icon] || getIcon(item.icon, { className: "size-full rounded-sm overflow-hidden object-contain" })} label={item.label} external={item.href.startsWith("http")} />
        ))}
        {shownSocials.map((social) => (
          <DockBtn key={social.id} href={social.url} icon={getIcon(social.icon, { className: "size-full rounded-sm overflow-hidden object-contain" }) || getIcon("globe", { className: "size-full rounded-sm overflow-hidden object-contain" })} label={social.name} external />
        ))}
        {profile?.tel && (
          <DockBtn href={`https://wa.me/${profile.tel.replace(/\D/g, "")}`} icon={getIcon("whatsapp", { className: "size-full rounded-sm overflow-hidden object-contain" })} label="WhatsApp" external />
        )}
        {profile?.email && (
          <DockBtn href={`mailto:${profile.email}`} icon={<MailIcon className="size-full rounded-sm overflow-hidden object-contain" />} label="Email" />
        )}
        <Separator orientation="vertical" className="h-2/3 m-auto w-px bg-border" />
        <Tooltip>
          <TooltipTrigger asChild>
            <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
              <ModeToggle className="size-full cursor-pointer" />
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
          >
            <p>Theme</p>
            <TooltipArrow className="fill-primary" />
          </TooltipContent>
        </Tooltip>
      </Dock>
    </div>
  );
}
