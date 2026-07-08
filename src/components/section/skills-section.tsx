"use client";
import { useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { skillIconMap } from "@/lib/icons-map";
import { getSkillIconUrl } from "@/lib/skill-icons";

const BLUR_FADE_DELAY = 0.04;
const SHOW_LIMIT = 12;

export default function SkillsSection({ skills }: { skills: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? skills : skills.slice(0, SHOW_LIMIT);

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((skill, id) => (
        <BlurFade key={skill.id} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
          <div className="border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2">
            {skill.icon && (skillIconMap[skill.icon] || <img src={getSkillIconUrl(skill.icon)} alt={skill.icon} className="size-5" />)}
            <span className="text-foreground text-sm font-medium">{skill.name}</span>
          </div>
        </BlurFade>
      ))}
      {skills.length > SHOW_LIMIT && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 px-4 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {showAll ? "Show less" : `Show more (${skills.length - SHOW_LIMIT}+)`}
        </button>
      )}
    </div>
  );
}
