"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * ProjectDetailsDialog
 * -------------------
 * Client component that provides an accessible, keyboard-friendly details dialog
 * for an individual project.
 *
 * Usage patterns:
 * - Wrap a presentational card/list item in this component to make it clickable.
 * - Or omit `children` to render a default "Details" button trigger.
 *
 * Performance notes:
 * - `buttonVariants` is imported from the server-safe variants module to keep
 *   variant generation decoupled from the client Button implementation.
 */

function statusLabel(status: Project["status"]) {
	switch (status) {
		case "planned":
			return "Planned";
		case "building":
			return "Building";
		case "shipped":
			return "Shipped";
		default:
			return status;
	}
}

export function ProjectDetailsDialog({
	project,
	children,
	triggerClassName,
}: {
	project: Project;
	children?: React.ReactNode;
	triggerClassName?: string;
}) {
	return (
		<Dialog>
			{children ? (
				<DialogTrigger
					nativeButton={false}
					render={
						<div
							tabIndex={0}
							className={cn("group cursor-pointer", triggerClassName)}
						/>
					}
				>
					{children}
				</DialogTrigger>
			) : (
				<DialogTrigger render={<Button size="sm" />}>Details</DialogTrigger>
			)}
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<div className="flex items-start justify-between gap-3 pr-10">
						<DialogTitle>{project.name}</DialogTitle>
						<Badge variant="secondary">{statusLabel(project.status)}</Badge>
					</div>
					<DialogDescription>{project.tagline}</DialogDescription>
				</DialogHeader>

				<div className="max-h-[70dvh] space-y-5 overflow-y-auto px-4 pb-4">
					<p className="text-muted-foreground">{project.description}</p>

					<div className="flex flex-wrap gap-2">
						{project.stack.map((item) => (
							<Badge key={item} variant="outline">
								{item}
							</Badge>
						))}
					</div>

					<div>
						<div className="font-medium">Key features</div>
						<ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
							{project.features.map((f) => (
								<li key={f}>{f}</li>
							))}
						</ul>
					</div>

					<div>
						<div className="font-medium">Highlights</div>
						<ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
							{project.highlights.map((h) => (
								<li key={h}>{h}</li>
							))}
						</ul>
					</div>
				</div>

				<DialogFooter>
					{project.links.live ? (
						<a
							className={buttonVariants({ variant: "secondary", size: "sm" })}
							href={project.links.live}
							target="_blank"
							rel="noreferrer"
						>
							Live demo
						</a>
					) : null}
					{project.links.github ? (
						<a
							className={buttonVariants({ variant: "outline", size: "sm" })}
							href={project.links.github}
							target="_blank"
							rel="noreferrer"
						>
							Repo
						</a>
					) : null}
					{!project.links.live && !project.links.github ? (
						<div className="text-sm text-muted-foreground">
							Repo/live links can be added later.
						</div>
					) : null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
