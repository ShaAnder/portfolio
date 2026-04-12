"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { useMediaQuery, useViewportHeight } from "@/lib/hooks/responsive";
import { useAutoPageSize } from "@/lib/hooks/useAutoPageSize";
import { ProjectCard } from "@/features/projects/ProjectCard";
import { ProjectDetailsDialog } from "@/features/projects/ProjectDetailsDialog";
import { Button } from "@/components/ui/button";

export function ProjectHighlights({ className }: { className?: string }) {
	const viewportHeight = useViewportHeight();
	const isDesktop = useMediaQuery("(min-width: 769px)");

	const cardsPerRow = isDesktop ? 2 : 1;
	const maxPageSize = isDesktop ? 4 : 3;

	const { pageSize, frameRef, gridRef, paginationRef } = useAutoPageSize({
		cardsPerRow,
		maxPageSize,
		itemSelector: "[data-project-card]",
		viewportHeight,
	});

	const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
	const pageTransitionMs = 250;

	const [page, setPage] = React.useState(0);
	const [direction, setDirection] = React.useState<1 | -1>(1);

	React.useEffect(() => {
		setPage((current) => Math.min(current, totalPages - 1));
	}, [totalPages]);

	const pageProjects = React.useMemo(() => {
		const start = page * pageSize;
		return projects.slice(start, start + pageSize);
	}, [page, pageSize]);

	const placeholderCount = Math.max(0, pageSize - pageProjects.length);

	const paginateTo = React.useCallback(
		(nextPage: number) => {
			const clamped = Math.max(0, Math.min(totalPages - 1, nextPage));
			if (clamped === page) return;
			setDirection(clamped > page ? 1 : -1);
			setPage(clamped);
		},
		[page, totalPages],
	);

	return (
		<div className={cn("w-full", className)}>
			<div
				ref={frameRef}
				className={cn("relative overflow-hidden", totalPages > 1 && "pb-20")}
			>
				<AnimatePresence initial={false} custom={direction} mode="wait">
					<motion.div
						key={`${page}-${pageSize}`}
						ref={gridRef}
						custom={direction}
						initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
						transition={{
							type: "tween",
							duration: pageTransitionMs / 1000,
							ease: "easeOut",
						}}
						className={cn(
							"grid gap-4",
							"grid-cols-1",
							"min-[769px]:grid-cols-2",
						)}
					>
						{pageProjects.map((project) => (
							<ProjectDetailsDialog
								key={project.slug}
								project={project}
								triggerClassName="block"
							>
								<ProjectCard project={project} />
							</ProjectDetailsDialog>
						))}

						{Array.from({ length: placeholderCount }).map((_, i) => (
							<div
								key={`placeholder-${page}-${pageSize}-${i}`}
								aria-hidden="true"
								className="pointer-events-none select-none opacity-0"
							>
								<ProjectCard project={projects[0] ?? pageProjects[0]!} />
							</div>
						))}
					</motion.div>
				</AnimatePresence>
			</div>

			<div
				ref={paginationRef}
				className={cn(
					"absolute inset-x-0 bottom-8 z-10 flex items-center justify-center gap-2",
					totalPages <= 1 && "pointer-events-none opacity-0",
				)}
			>
				{totalPages > 1 ? (
					<>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => paginateTo(page - 1)}
							disabled={page === 0}
							aria-label="Previous projects"
						>
							<ChevronLeft />
						</Button>

						<span className="min-w-14 text-center text-xs tabular-nums text-muted-foreground">
							{page + 1} / {totalPages}
						</span>

						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => paginateTo(page + 1)}
							disabled={page >= totalPages - 1}
							aria-label="Next projects"
						>
							<ChevronRight />
						</Button>
					</>
				) : null}
			</div>
		</div>
	);
}
