"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

const FALLBACK = "/images/under-construction.svg";

export function ProjectCard({ project }: { project: Project }) {
	const [failed, setFailed] = useState(false);
	const hero = !failed && project.images.hero ? project.images.hero : FALLBACK;
	const portrait = project.displayType === "mobile";

	return (
		<article
			data-project-card
			className="group relative h-full w-full overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition hover:border-ring/50 hover:shadow-lg"
		>
			<Image
				src={hero}
				alt={`${project.name} project preview`}
				fill
				sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 67vw, 67vw"
				className={cn(
					"transition-transform duration-500 group-hover:scale-[1.025]",
					portrait ? "object-contain bg-zinc-950 p-2" : "object-cover",
				)}
				onError={() => setFailed(true)}
			/>
			<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />
			<span className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-xs capitalize text-white backdrop-blur-sm">
				{project.displayType}
			</span>
			<div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
				<div className="flex items-end justify-between gap-2">
					<div className="min-w-0">
						<h3 className="text-base font-semibold sm:text-lg">
							{project.name}
						</h3>
						<p className="mt-1 line-clamp-2 text-xs text-zinc-200">
							{project.tagline}
						</p>
					</div>
					<span className="shrink-0 rounded-full border border-white/25 bg-black/60 px-2 py-1 text-[10px]">
						{project.status === "building" ? "In development" : "Released"}
					</span>
				</div>
			</div>
		</article>
	);
}
