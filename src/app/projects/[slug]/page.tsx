import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Separator } from "@/components/ui/separator";
import { getProjectBySlug, projects } from "@/data/projects";

/*
	Project detail page styling notes
	--------------------------------
	This page is statically generated (SSG) from the `projects` dataset.

	Styling patterns:
	- Uses a single-column flow with clear section breaks (`Separator`).
	- Hero image is constrained to `aspect-video` to keep a consistent, modern layout.
	- Buttons reuse `buttonVariants` (server-safe import) so we don't pull the client Button
	  implementation into this statically generated route.
*/

export function generateStaticParams() {
	return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Metadata {
	const project = getProjectBySlug(params.slug);
	if (!project) return {};

	return {
		title: project.name,
		description: project.tagline,
		openGraph: {
			title: project.name,
			description: project.tagline,
		},
	};
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
	const project = getProjectBySlug(params.slug);
	if (!project) notFound();

	return (
		<div className="py-10">
			{/* Top row: project heading + quick actions (desktop). */}
			<div className="flex items-center justify-between gap-4">
				<div className="space-y-2">
					<div className="text-sm text-muted-foreground">Project</div>
					<h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
						{project.name}
					</h1>
					<p className="max-w-2xl text-muted-foreground">
						{project.description}
					</p>
					<div className="flex flex-wrap gap-2 pt-1">
						{project.stack.map((item) => (
							<Badge key={item} variant="outline">
								{item}
							</Badge>
						))}
					</div>
				</div>
				<div className="hidden md:flex md:gap-2">
					<Link
						className={buttonVariants({ variant: "outline" })}
						href="/#projects"
					>
						All projects
					</Link>
					{project.links.live ? (
						<a
							className={buttonVariants()}
							href={project.links.live}
							target="_blank"
							rel="noreferrer"
						>
							Live
						</a>
					) : null}
				</div>
			</div>

			<div className="mt-8 overflow-hidden rounded-lg border">
				<div className="relative aspect-video bg-muted">
					{/*
						Hero image
						- `bg-muted` provides a clean placeholder color.
						- `object-cover` keeps composition nice across screen sizes.
					*/}
					<Image
						src={project.images.hero}
						alt={`${project.name} screenshot`}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 900px"
					/>
				</div>
			</div>

			<div className="mt-8 grid gap-8 md:grid-cols-2">
				{/* Two-column content on desktop; stacks naturally on mobile. */}
				<div className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight">Key features</h2>
					<ul className="list-inside list-disc space-y-2 text-muted-foreground">
						{project.features.map((f) => (
							<li key={f}>{f}</li>
						))}
					</ul>
				</div>

				<div className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight">Highlights</h2>
					<ul className="list-inside list-disc space-y-2 text-muted-foreground">
						{project.highlights.map((h) => (
							<li key={h}>{h}</li>
						))}
					</ul>
				</div>
			</div>

			<Separator className="my-10" />

			<div className="flex flex-wrap gap-3">
				{/* Action row: tokenized variants ensure theme-aware surfaces + focus. */}
				<Link
					className={buttonVariants({ variant: "outline" })}
					href="/#projects"
				>
					Back to projects
				</Link>
				{project.links.github ? (
					<a
						className={buttonVariants({ variant: "secondary" })}
						href={project.links.github}
						target="_blank"
						rel="noreferrer"
					>
						View code
					</a>
				) : null}
			</div>
		</div>
	);
}
