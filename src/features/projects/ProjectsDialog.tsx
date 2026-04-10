"use client";

import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ProjectDetailsDialog } from "@/features/projects/ProjectDetailsDialog";
import { projects } from "@/data/projects";

/**
 * ProjectsDialog
 * ------------
 * Modal that lists all projects with a nested ProjectDetailsDialog per item.
 *
 * Performance notes:
 * - `projects` is static data (imported), so rendering cost is predictable.
 * - The dialog body is scrollable to avoid layout thrash when content overflows.
 */

export function ProjectsDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Projects</DialogTitle>
					<DialogDescription>
						A few production-style builds (details + links).
					</DialogDescription>
				</DialogHeader>

				<div className="max-h-[70dvh] space-y-6 overflow-y-auto px-4 pb-4">
					{projects.map((project) => (
						<ProjectDetailsDialog
							key={project.slug}
							project={project}
							triggerClassName="block"
						>
							<div className="rounded-lg border p-4 transition-colors group-hover:bg-muted/40">
								<div className="flex items-start justify-between gap-3">
									<div>
										<div className="font-medium">{project.name}</div>
										<div className="mt-1 text-sm text-muted-foreground">
											{project.tagline}
										</div>
									</div>
									<Badge variant="secondary">{project.status}</Badge>
								</div>

								<p className="mt-3 text-sm text-muted-foreground">
									{project.description}
								</p>

								<div className="mt-4 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100 dark:text-foreground">
									<span className="inline-flex items-center rounded-md bg-foreground/60 px-2 py-1 dark:bg-background/60">
										Click for more info
									</span>
								</div>
							</div>
						</ProjectDetailsDialog>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
