"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sortedProjects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/features/projects/ProjectCard";
import { ProjectDetailsDialog } from "@/features/projects/ProjectDetailsDialog";

// Fixed-size pagination avoids the viewport-measurement issues in the old grid.
const PAGE_SIZE = 4;

export function ProjectHighlights({ className }: { className?: string }) {
  const visibleProjects = sortedProjects.filter(
    (project) => project.status === "building" || project.status === "shipped",
  );
  const [page, setPage] = React.useState(0);
  const totalPages = Math.max(1, Math.ceil(visibleProjects.length / PAGE_SIZE));
  const pageProjects = visibleProjects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  React.useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  return (
    <div className={cn("mx-auto w-full max-w-7xl space-y-5", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "grid grid-flow-row-dense auto-rows-[88px] gap-3",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {pageProjects.map((project) => {
            const isMobile = project.slug === "fitforge";
            return (
              <ProjectDetailsDialog
                key={project.slug}
                project={project}
                triggerClassName={cn(
                  "block min-w-0 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  // Device-specific heights; other projects remain wide enough for screenshots.
                  isMobile ? "row-span-5" : "row-span-3",
                )}
              >
                <ProjectCard project={project} />
              </ProjectDetailsDialog>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <nav aria-label="Project gallery pages" className="flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous project page"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-full border p-2 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            aria-label="Next project page"
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded-full border p-2 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
