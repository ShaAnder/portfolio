import { Construction } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
			return "In development";
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
			data-project-card
			size="sm"
			className="p-0! gap-0 overflow-hidden transition-colors group-hover:bg-muted/40"
		>
			{/*
				Hero media area
				- `relative` + `fill` lets Next/Image absolutely position.
				- `bg-muted` is a nice placeholder color while images load.
			*/}
			<div className="relative aspect-5/2 w-full overflow-hidden bg-muted md:aspect-10/3 lg:aspect-2/1">
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-linear-to-br from-muted via-muted/60 to-muted/30"
				/>
				<div className="relative grid h-full w-full place-items-center px-4 text-center">
					<div className="flex flex-col items-center gap-1.5">
						<Construction className="size-6 text-muted-foreground/70" />
						<div className="text-xs font-medium tracking-wide text-muted-foreground/80">
							Under construction
						</div>
					</div>
				</div>
			</div>
			<CardContent className="flex min-h-11 items-center justify-between gap-3 py-1">
				<CardTitle className="min-w-0 truncate">{project.name}</CardTitle>
				<Badge variant="secondary">{statusLabel(project.status)}</Badge>
			</CardContent>
		</Card>
	);
}
