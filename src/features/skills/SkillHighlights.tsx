"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { highlightSkills } from "@/data/skills";
import { cn } from "@/lib/utils";
import { useMediaQuery, useViewportHeight } from "@/lib/hooks/responsive";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function SkillSliceBar({
	percent,
	active,
}: {
	percent: number;
	active: boolean;
}) {
	const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
	const totalBars = 50;
	const filledBars = active
		? Math.min(totalBars, Math.ceil((safePercent / 100) * totalBars))
		: 0;

	const slices = React.useMemo(() => Array.from({ length: totalBars }), []);
	const gridStyle = React.useMemo(
		() =>
			({
				gridTemplateColumns: `repeat(${totalBars}, minmax(0, 1fr))`,
			}) as const,
		[],
	);

	return (
		<div
			className="relative"
			role="progressbar"
			aria-label="Skill level"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={safePercent}
		>
			<div className="grid gap-1" style={gridStyle} aria-hidden="true">
				{slices.map((_, i) => {
					const isFilled = i < filledBars;
					return (
						<span
							key={i}
							className={cn(
								"h-4 rounded-md transition-colors duration-700 ease-out motion-reduce:transition-none",
								// Empty bar styling matches filled bar geometry and stays theme-safe.
								"bg-foreground/15",
								isFilled &&
									"bg-foreground/55 group-hover:bg-linear-to-r group-hover:from-destructive group-hover:to-sidebar-primary",
							)}
							style={isFilled ? { transitionDelay: `${i * 10}ms` } : undefined}
						/>
					);
				})}
			</div>
		</div>
	);
}

function SkillHighlightItem({
	skill,
	hasBeenSeen,
	onSeen,
	allowInViewActivation,
}: {
	skill: (typeof highlightSkills)[number];
	hasBeenSeen: boolean;
	onSeen: (key: string) => void;
	allowInViewActivation: boolean;
}) {
	const { setRef, hasBeenInView } = useInViewOnce<HTMLButtonElement>({
		threshold: 0.35,
	});

	React.useEffect(() => {
		if (hasBeenSeen) return;
		if (!allowInViewActivation) return;
		if (hasBeenInView) onSeen(skill.key);
	}, [allowInViewActivation, hasBeenInView, hasBeenSeen, onSeen, skill.key]);

	const isActive = hasBeenSeen || (allowInViewActivation && hasBeenInView);

	return (
		<Dialog>
			<DialogTrigger
				render={
					<button
						data-skill-card
						type="button"
						className={cn(
							"group w-full h-24 rounded-lg border p-4 text-left transition-colors",
							"hover:bg-muted/20",
							"focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/10",
						)}
						ref={setRef}
						aria-label={`Open details for ${skill.name}`}
					/>
				}
			>
				<div className="min-w-0 truncate font-medium text-foreground">
					{skill.name}
				</div>

				<div className="mt-4">
					<SkillSliceBar percent={skill.percent} active={isActive} />
				</div>
			</DialogTrigger>

			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{skill.name}</DialogTitle>
					<DialogDescription>
						{skill.category} · {skill.percent}%
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 px-4 pb-4 text-muted-foreground">
					<p>{skill.summary}</p>
					<div className="space-y-2">
						{skill.details.map((line) => (
							<p key={line}>{line}</p>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export function SkillHighlights({ className }: { className?: string }) {
	const viewportHeight = useViewportHeight();
	const isDesktop = useMediaQuery("(min-width: 769px)");
	const maxPageSize = isDesktop ? 8 : 6;
	const cardsPerRow = isDesktop ? 2 : 1;
	const [autoPageSize, setAutoPageSize] = React.useState<number | null>(null);
	const pageSize = autoPageSize ?? maxPageSize;
	const totalPages = Math.max(1, Math.ceil(highlightSkills.length / pageSize));
	const pageTransitionMs = 250;

	const [page, setPage] = React.useState(0);
	const [direction, setDirection] = React.useState<1 | -1>(1);
	const [seenKeys, setSeenKeys] = React.useState<Record<string, true>>({});
	const [isPaginating, setIsPaginating] = React.useState(false);
	const gridFrameRef = React.useRef<HTMLDivElement | null>(null);
	const gridRef = React.useRef<HTMLDivElement | null>(null);
	const paginationRef = React.useRef<HTMLDivElement | null>(null);
	const computePageSizeRef = React.useRef<(() => void) | null>(null);

	React.useEffect(() => {
		setPage((current) => Math.min(current, totalPages - 1));
	}, [totalPages]);

	React.useLayoutEffect(() => {
		const frame = gridFrameRef.current;
		const pagination = paginationRef.current;
		if (!frame || !pagination) return;
		const section = frame.closest("section");
		let rafId: number | null = null;

		const compute = () => {
			if (rafId !== null) return;
			rafId = window.requestAnimationFrame(() => {
				rafId = null;
				const frameTop = frame.getBoundingClientRect().top;
				const paginationTop = pagination.getBoundingClientRect().top;
				const availableHeight = Math.max(0, paginationTop - frameTop);

				const grid = gridRef.current;
				const firstCard = grid?.querySelector<HTMLElement>("[data-skill-card]");
				const cardHeight = firstCard?.getBoundingClientRect().height ?? 96;
				const computedRowGap = grid
					? Number.parseFloat(window.getComputedStyle(grid).rowGap || "0")
					: 12;
				const rowGap =
					Number.isFinite(computedRowGap) && computedRowGap > 0
						? computedRowGap
						: 12;

				const rowsFit = Math.max(
					1,
					Math.floor((availableHeight + rowGap) / (cardHeight + rowGap)),
				);
				const nextPageSize = Math.max(
					cardsPerRow,
					Math.min(maxPageSize, rowsFit * cardsPerRow),
				);

				setAutoPageSize((current) =>
					current === nextPageSize ? current : nextPageSize,
				);
			});
		};

		compute();
		computePageSizeRef.current = compute;
		window.addEventListener("resize", compute, { passive: true });

		let resizeObserver: ResizeObserver | null = null;
		if (typeof ResizeObserver !== "undefined") {
			resizeObserver = new ResizeObserver(() => compute());
			if (section) resizeObserver.observe(section);
			resizeObserver.observe(frame);
		}

		return () => {
			computePageSizeRef.current = null;
			window.removeEventListener("resize", compute);
			resizeObserver?.disconnect();
			if (rafId !== null) window.cancelAnimationFrame(rafId);
		};
	}, [cardsPerRow, maxPageSize]);

	React.useEffect(() => {
		computePageSizeRef.current?.();
	}, [isDesktop, page, pageSize, viewportHeight]);

	const pageSkills = React.useMemo(() => {
		const start = page * pageSize;
		return highlightSkills.slice(start, start + pageSize);
	}, [page, pageSize]);

	const placeholderCount = Math.max(0, pageSize - pageSkills.length);

	const handleSeen = React.useCallback((key: string) => {
		setSeenKeys((current) =>
			current[key] ? current : { ...current, [key]: true },
		);
	}, []);

	const paginateTo = React.useCallback(
		(nextPage: number) => {
			const clamped = Math.max(0, Math.min(totalPages - 1, nextPage));
			if (clamped === page) return;
			setDirection(clamped > page ? 1 : -1);
			setIsPaginating(true);
			setPage(clamped);

			window.setTimeout(() => {
				setIsPaginating(false);
			}, pageTransitionMs + 30);
		},
		[page, pageTransitionMs, totalPages],
	);

	return (
		<div className={cn("w-full", className)}>
			<div
				className={cn("relative overflow-hidden", totalPages > 1 && "pb-20")}
				ref={gridFrameRef}
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
							"grid gap-3",
							"grid-cols-1",
							"min-[769px]:grid-cols-2",
						)}
					>
						{pageSkills.map((skill) => (
							<SkillHighlightItem
								key={skill.key}
								skill={skill}
								hasBeenSeen={Boolean(seenKeys[skill.key])}
								onSeen={handleSeen}
								allowInViewActivation={!isPaginating}
							/>
						))}

						{Array.from({ length: placeholderCount }).map((_, i) => (
							<div
								key={`placeholder-${page}-${pageSize}-${i}`}
								aria-hidden="true"
								className={cn(
									"h-24 rounded-lg border p-4",
									"pointer-events-none select-none opacity-0",
								)}
							/>
						))}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Keep an anchor mounted for measurement even if controls are hidden. */}
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
							aria-label="Previous skills"
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
							aria-label="Next skills"
						>
							<ChevronRight />
						</Button>
					</>
				) : null}
			</div>
		</div>
	);
}
