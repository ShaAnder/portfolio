"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sortedProjects, type Project } from "@/data/projects";
import { ProjectCard } from "@/features/projects/ProjectCard";
import { ProjectDetailsDialog } from "@/features/projects/ProjectDetailsDialog";
import { cn } from "@/lib/utils";

type Tile = { project: Project; col: number; row: number };
type Page = Tile[];
const COLUMNS = 3;
const ROWS = 2;

function dimensions(project: Project): [width: number, height: number] {
	switch (project.displayType) {
		case "desktop":
			return [2, 1];
		case "mobile":
			return [1, 2];
		default:
			return [1, 1];
	}
}

// First-fit placement, scanning the earlier pages first. Filtering reruns packing,
// so hidden items don't leave holes in the visible gallery.
export function packProjectPages(projects: Project[]): Page[] {
	const pages: Page[] = [];
	const occupancy: boolean[][][] = [];

	for (const project of projects) {
		const [width, height] = dimensions(project);
		let placed = false;
		for (let pageIndex = 0; !placed; pageIndex++) {
			if (!occupancy[pageIndex]) {
				occupancy.push(
					Array.from({ length: ROWS }, () =>
						Array<boolean>(COLUMNS).fill(false),
					),
				);
				pages.push([]);
			}
			const cells = occupancy[pageIndex];
			for (let row = 0; row <= ROWS - height && !placed; row++) {
				for (let col = 0; col <= COLUMNS - width && !placed; col++) {
					let fits = true;
					for (let y = row; y < row + height; y++) {
						for (let x = col; x < col + width; x++) {
							if (cells[y][x]) fits = false;
						}
					}
					if (!fits) continue;
					for (let y = row; y < row + height; y++) {
						for (let x = col; x < col + width; x++) cells[y][x] = true;
					}
					pages[pageIndex].push({ project, col, row });
					placed = true;
				}
			}
		}
	}
	return pages;
}

const COLUMN_CLASSES = ["lg:col-start-1", "lg:col-start-2", "lg:col-start-3"];
const ROW_CLASSES = ["lg:row-start-1", "lg:row-start-2"];

export function ProjectHighlights({ className }: { className?: string }) {
	const [filter, setFilter] = React.useState<
		"all" | "desktop" | "tablet" | "mobile"
	>("all");
	const [page, setPage] = React.useState(0);
	const visibleProjects = React.useMemo(
		() =>
			sortedProjects.filter(
				(p) =>
					p.status !== "planned" &&
					(filter === "all" || p.displayType === filter),
			),
		[filter],
	);
	const pages = React.useMemo(
		() => packProjectPages(visibleProjects),
		[visibleProjects],
	);
	const totalPages = Math.max(1, pages.length);
	const currentPage = Math.min(page, totalPages - 1);

	React.useEffect(
		() => setPage((p) => Math.min(p, totalPages - 1)),
		[totalPages],
	);

	return (
		<div className={cn("mx-auto w-full max-w-7xl space-y-3", className)}>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div
					className="flex flex-wrap gap-1"
					role="group"
					aria-label="Filter projects"
				>
					{(["all", "desktop", "tablet", "mobile"] as const).map((value) => (
						<button
							key={value}
							type="button"
							aria-pressed={filter === value}
							onClick={() => {
								setFilter(value);
								setPage(0);
							}}
							className={cn(
								"rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
								filter === value
									? "bg-foreground text-background"
									: "bg-card hover:bg-muted",
							)}
						>
							{value === "all" ? "All projects" : value}
						</button>
					))}
				</div>
				<span className="text-xs text-muted-foreground">
					{visibleProjects.length} projects
				</span>
			</div>

			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={`${filter}-${currentPage}`}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.2 }}
					className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[repeat(2,clamp(260px,30vh,350px))]"
				>
					{(pages[currentPage] ?? []).map(({ project, col, row }) => (
						<div
							key={project.slug}
							className={cn(
								"min-w-0 lg:min-h-0",
								COLUMN_CLASSES[col],
								ROW_CLASSES[row],
								project.displayType === "desktop" && "lg:col-span-2",
								project.displayType === "mobile" && "lg:row-span-2",
								project.displayType === "mobile"
									? "h-90 sm:h-105 lg:h-auto"
									: "h-57.5 sm:h-62.5 lg:h-auto",
							)}
						>
							<ProjectDetailsDialog
								project={project}
								triggerClassName="block h-full w-full"
							>
								<ProjectCard project={project} />
							</ProjectDetailsDialog>
						</div>
					))}
				</motion.div>
			</AnimatePresence>
			{visibleProjects.length === 0 && (
				<p className="py-10 text-center text-sm text-muted-foreground">
					No projects in this category yet.
				</p>
			)}
			{totalPages > 1 && (
				<nav
					className="flex items-center justify-center gap-4 pt-1"
					aria-label="Project gallery pages"
				>
					<button
						type="button"
						aria-label="Previous project page"
						disabled={currentPage === 0}
						onClick={() => setPage((p) => Math.max(0, p - 1))}
						className="rounded-full border p-2 disabled:opacity-40 hover:bg-muted"
					>
						<ChevronLeft className="size-4" />
					</button>
					<span className="text-sm tabular-nums">
						{currentPage + 1} / {totalPages}
					</span>
					<button
						type="button"
						aria-label="Next project page"
						disabled={currentPage === totalPages - 1}
						onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
						className="rounded-full border p-2 disabled:opacity-40 hover:bg-muted"
					>
						<ChevronRight className="size-4" />
					</button>
				</nav>
			)}
		</div>
	);
}
