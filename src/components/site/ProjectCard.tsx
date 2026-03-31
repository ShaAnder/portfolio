import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/data/projects";

/*
	ProjectCard
	-----------
	A compact, scannable summary card for the Projects grid.

	This component is intentionally presentational.
	The interactive wrapper (e.g. `ProjectDetailsDialog`) should live at the callsite
	so this file remains server-renderable and doesn't pull dialog code into the module.

	Styling choices:
	- Uses the shared `Card` primitive so surface + spacing are consistent.
	- The hero image is locked to `aspect-video` for a uniform grid.
	- Badges use semantic variants so they stay readable in both themes.
	- Footer buttons are simple inline-flex pills (could be refactored to Button/buttonVariants later).
*/

function statusLabel(status: Project["status"]) {
	switch (status) {
		case "planned":
			return "Planned";
		case "building":
			return "In development";
		case "shipped":
			return "Shipped";
		default:
			return status;
	}
}

export function ProjectCard({ project }: { project: Project }) {
	return (
		<Card
			size="sm"
			className="overflow-hidden pt-0 transition-colors group-hover:bg-muted/40"
		>
			{/*
				Hero media area
				- `relative` + `fill` lets Next/Image absolutely position.
				- `bg-muted` is a nice placeholder color while images load.
			*/}
			<div className="relative aspect-21/9 w-full bg-muted">
				<Image
					src={project.images.hero}
					alt={project.name}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 50vw"
					priority={false}
				/>
			</div>
			<CardHeader className="space-y-1">
				<div className="flex items-center justify-between gap-3">
					<CardTitle className="text-base">{project.name}</CardTitle>
					<Badge variant="secondary">{statusLabel(project.status)}</Badge>
				</div>
			</CardHeader>
		</Card>
	);
}
