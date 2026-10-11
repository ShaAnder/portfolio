"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

const FALLBACK = "/images/under-construction.svg";

export function ProjectDetailsDialog({
	project,
	children,
	triggerClassName,
}: {
	project: Project;
	children?: React.ReactNode;
	triggerClassName?: string;
}) {
	const images = [
		project.images.hero,
		...(project.images.gallery ?? []),
	].filter(Boolean);
	const [index, setIndex] = React.useState(0);
	const [failed, setFailed] = React.useState<Record<string, true>>({});
	const [open, setOpen] = React.useState(false);
	const image = images[index] ?? FALLBACK;
	const isMobile = project.slug === "fitforge";
	const imageSource = failed[image] ? FALLBACK : image;

	React.useEffect(() => {
		if (open) setIndex(0);
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				nativeButton={false}
				render={
					<div
						role="button"
						tabIndex={0}
						className={cn("outline-none", triggerClassName)}
						aria-label={`View ${project.name} project details`}
						onKeyDown={(event) => {
							if (event.key === "Enter" || event.key === " ") {
								event.preventDefault();
								setOpen(true);
							}
						}}
					/>
				}
			>
				{children ?? <span className="underline">View {project.name}</span>}
			</DialogTrigger>

			<DialogContent className="flex max-h-[90dvh] w-[min(96vw,1150px)] max-w-none flex-col overflow-hidden p-0 md:w-[92vw] lg:flex-row">
				<div className="relative flex min-h-57.5 shrink-0 flex-col bg-zinc-950 lg:w-[56%] lg:min-h-155">
					<div className="relative min-h-57.5 flex-1 lg:min-h-0">
						<Image
							key={imageSource}
							src={imageSource}
							alt={`${project.name} screenshot ${index + 1}`}
							fill
							sizes="(max-width: 1023px) 96vw, 56vw"
							className={cn("object-contain", isMobile ? "p-5" : "p-2")}
							onError={() => setFailed((prev) => ({ ...prev, [image]: true }))}
						/>
					</div>
					{images.length > 1 && (
						<div className="flex items-center justify-center gap-3 border-t border-white/15 px-4 py-3 text-white">
							<button
								type="button"
								aria-label="Previous screenshot"
								className="rounded-full p-2 hover:bg-white/15"
								onClick={() =>
									setIndex((i) => (i - 1 + images.length) % images.length)
								}
							>
								<ChevronLeft className="size-5" />
							</button>
							<span className="text-xs tabular-nums">
								{index + 1} / {images.length}
							</span>
							<button
								type="button"
								aria-label="Next screenshot"
								className="rounded-full p-2 hover:bg-white/15"
								onClick={() => setIndex((i) => (i + 1) % images.length)}
							>
								<ChevronRight className="size-5" />
							</button>
						</div>
					)}
				</div>

				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 sm:p-7 lg:p-8">
					<DialogHeader className="space-y-3 pr-6 text-left">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="secondary">
								{project.status === "building"
									? "In development"
									: project.status === "shipped"
										? "Released"
										: "Planned"}
							</Badge>
							<Badge variant="outline">
								{isMobile ? "Android" : "Browser"}
							</Badge>
						</div>
						<DialogTitle className="text-2xl sm:text-3xl">
							{project.name}
						</DialogTitle>
						<DialogDescription className="text-sm">
							{project.tagline}
						</DialogDescription>
					</DialogHeader>

					<p className="mt-5 text-sm leading-7 text-muted-foreground">
						{project.description}
					</p>
					<div className="mt-5 flex flex-wrap gap-2">
						{project.stack.map((tech) => (
							<Badge key={tech} variant="outline">
								{tech}
							</Badge>
						))}
					</div>
					<section className="mt-7">
						<h3 className="font-semibold">Key features</h3>
						<ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-muted-foreground">
							{project.features.map((feature) => (
								<li key={feature}>{feature}</li>
							))}
						</ul>
					</section>
					<section className="mt-7">
						<h3 className="font-semibold">Engineering highlights</h3>
						<ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-muted-foreground">
							{project.highlights.map((highlight) => (
								<li key={highlight}>{highlight}</li>
							))}
						</ul>
					</section>
					{isMobile && (
						<p className="mt-5 rounded-lg border border-border bg-muted/40 p-3 text-xs leading-5 text-muted-foreground">
							FitForge runs as an installed Android app, not a browser demo. For
							emulator authentication redirects, open the provided URL inside
							the emulator browser.
						</p>
					)}
					<div className="mt-auto flex flex-wrap gap-3 pt-7">
						{project.links.github && (
							<a
								href={project.links.github}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
							>
								<Code2 className="size-4" /> GitHub
							</a>
						)}
						{project.links.live && (
							<a
								href={project.links.live}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
							>
								<ExternalLink className="size-4" /> Live demo
							</a>
						)}
						{isMobile && (
							<a
								href="https://github.com/ShaAnder/fitforge/releases/tag/v0.3"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
							>
								<ExternalLink className="size-4" /> Android APK
							</a>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
