"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

const FALLBACK = "/images/under-construction.svg";

export function ProjectCard({ project }: { project: Project }) {
  const isMobile = project.slug === "fitforge";
  const [imageFailed, setImageFailed] = useState(false);
  const hero = !imageFailed && project.images?.hero ? project.images.hero : FALLBACK;

  return (
    <div
      data-project-card
      className={cn(
        "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border/60",
        "bg-card text-card-foreground shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-ring/50 hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-zinc-950">
        <Image
          src={hero}
          alt={`${project.name} application preview`}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
          className={cn(
            "transition-transform duration-500 group-hover:scale-[1.035]",
            isMobile ? "object-contain p-3" : "object-cover",
          )}
          onError={() => setImageFailed(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {isMobile ? "Android app" : project.slug === "relic-hunter-online" ? "Browser game" : "Web app"}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold">{project.name}</h3>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-200">{project.tagline}</p>
          </div>
          <span className="shrink-0 rounded-full border border-white/25 bg-black/40 px-2 py-1 text-[10px]">
            {project.status === "building" ? "In development" : project.status === "shipped" ? "Released" : "Planned"}
          </span>
        </div>
      </div>
    </div>
  );
}
