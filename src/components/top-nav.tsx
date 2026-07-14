"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { motion, useSpring } from "motion/react";

export default function TopNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const indicatorLeft = useSpring(0, { stiffness: 300, damping: 30 });
  const indicatorWidth = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    const elements: HTMLElement[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    });

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [sections]);

  useEffect(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector(
      `[data-section="${activeSection}"]`
    ) as HTMLElement | null;
    if (activeEl) {
      indicatorLeft.set(activeEl.offsetLeft);
      indicatorWidth.set(activeEl.offsetWidth);
    }
  }, [activeSection, indicatorLeft, indicatorWidth]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  if (sections.length === 0) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <nav
        ref={navRef}
        className="pointer-events-auto relative flex items-center gap-0.5 px-2 py-1.5 rounded-2xl border border-border/40 bg-background/60 backdrop-blur-2xl shadow-[0_0_30px_5px] shadow-primary/5"
      >
        <motion.div
          ref={indicatorRef}
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-primary/10 border border-primary/20"
          style={{
            left: indicatorLeft,
            width: indicatorWidth,
          }}
        />
        {sections.map(({ id, label }, index) => (
          <a
            key={id}
            data-section={id}
            href={`#${id}`}
            onClick={(e) => handleClick(e, id)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "relative z-10 text-xs font-medium px-3 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer select-none",
              activeSection === id
                ? "text-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            )}
            style={{
              transform:
                hoveredIndex === index && activeSection !== id
                  ? "scale(1.05)"
                  : "scale(1)",
              transition: "transform 0.2s ease",
            }}
          >
            <span
              className={cn(
                "inline-block transition-transform duration-200",
                activeSection === id && "scale-[1.02]"
              )}
            >
              {label}
            </span>
            {activeSection === id && (
              <motion.div
                layoutId="activeDot"
                className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </a>
        ))}
      </nav>
    </div>
  );
}
