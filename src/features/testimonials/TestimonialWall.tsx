"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMediaQuery, useViewportHeight } from "@/lib/hooks/responsive";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";
import { TestimonialCard } from "@/features/testimonials/TestimonialCard";

export function TestimonialWall({ className }: { className?: string }) {
	const viewportHeight = useViewportHeight();
	const isMd = useMediaQuery("(min-width: 768px)");
	const isLg = useMediaQuery("(min-width: 1024px)");

	const columnCount = isLg ? 3 : isMd ? 2 : 1;
	const rowGapPx = 16;

	const [pages, setPages] = React.useState<number[][][]>([]);
	const totalPages = Math.max(1, pages.length || 1);
	const pageTransitionMs = 250;

	const [page, setPage] = React.useState(0);
	const [direction, setDirection] = React.useState<1 | -1>(1);

	const frameRef = React.useRef<HTMLDivElement | null>(null);
	const measureRef = React.useRef<HTMLDivElement | null>(null);

	const [frameSize, setFrameSize] = React.useState({ width: 0, height: 0 });
	const [measuredHeights, setMeasuredHeights] = React.useState<number[]>([]);

	React.useEffect(() => {
		setPage((current) => Math.min(current, totalPages - 1));
	}, [totalPages]);

	React.useEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;
		const rect = frame.getBoundingClientRect();
		setFrameSize((current) => {
			const next = {
				width: Math.round(rect.width),
				height: Math.round(rect.height),
			};
			return current.width === next.width && current.height === next.height
				? current
				: next;
		});
	}, [viewportHeight, columnCount]);

	const pageColumns = React.useMemo(() => {
		if (!pages.length) {
			return [testimonials.map((_, i) => i)];
		}
		return pages[page] ?? pages[0] ?? [testimonials.map((_, i) => i)];
	}, [page, pages]);

	const isReady = pages.length > 0;

	const paginateTo = React.useCallback(
		(nextPage: number) => {
			const clamped = Math.max(0, Math.min(totalPages - 1, nextPage));
			if (clamped === page) return;
			setDirection(clamped > page ? 1 : -1);
			setPage(clamped);
		},
		[page, totalPages],
	);

	React.useLayoutEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;
		let rafId: number | null = null;

		const compute = () => {
			if (rafId !== null) return;
			rafId = window.requestAnimationFrame(() => {
				rafId = null;
				const rect = frame.getBoundingClientRect();
				setFrameSize((current) => {
					const next = {
						width: Math.round(rect.width),
						height: Math.round(rect.height),
					};
					return current.width === next.width && current.height === next.height
						? current
						: next;
				});
			});
		};

		compute();
		window.addEventListener("resize", compute, { passive: true });

		let resizeObserver: ResizeObserver | null = null;
		if (typeof ResizeObserver !== "undefined") {
			resizeObserver = new ResizeObserver(() => compute());
			resizeObserver.observe(frame);
		}

		return () => {
			window.removeEventListener("resize", compute);
			resizeObserver?.disconnect();
			if (rafId !== null) window.cancelAnimationFrame(rafId);
		};
	}, []);

	const columnWidth = React.useMemo(() => {
		if (frameSize.width <= 0) return 0;
		const gaps = rowGapPx * Math.max(0, columnCount - 1);
		return Math.max(0, Math.floor((frameSize.width - gaps) / columnCount));
	}, [columnCount, frameSize.width, rowGapPx]);

	React.useLayoutEffect(() => {
		const measureNode = measureRef.current;
		if (!measureNode) return;
		let rafId: number | null = null;

		const compute = () => {
			if (rafId !== null) return;
			rafId = window.requestAnimationFrame(() => {
				rafId = null;
				const nodes = measureNode.querySelectorAll<HTMLElement>(
					"[data-measure-index]",
				);
				if (!nodes.length) return;

				const next: number[] = Array.from({ length: testimonials.length });
				for (const el of nodes) {
					const idx = Number(el.dataset.measureIndex);
					if (!Number.isFinite(idx)) continue;
					if (idx < 0 || idx >= testimonials.length) continue;
					next[idx] = Math.round(el.getBoundingClientRect().height);
				}

				setMeasuredHeights((current) => {
					let changed = current.length !== next.length;
					if (!changed) {
						for (let i = 0; i < next.length; i++) {
							if (current[i] !== next[i]) {
								changed = true;
								break;
							}
						}
					}
					return changed ? next : current;
				});
			});
		};

		compute();
		let observer: ResizeObserver | null = null;
		if (typeof ResizeObserver !== "undefined") {
			observer = new ResizeObserver(() => compute());
			observer.observe(measureNode);
		}

		return () => {
			observer?.disconnect();
			if (rafId !== null) window.cancelAnimationFrame(rafId);
		};
	}, [columnWidth]);

	React.useLayoutEffect(() => {
		const availableHeight = frameSize.height;
		if (!(availableHeight > 0)) return;
		if (testimonials.length === 0) return;
		if (measuredHeights.length !== testimonials.length) return;

		const fallbackHeight = 140;
		const heights = measuredHeights.map((h) => (h > 0 ? h : fallbackHeight));

		const buildPages = () => {
			const nextPages: number[][][] = [];
			let index = 0;
			while (index < testimonials.length) {
				const cols: number[][] = Array.from({ length: columnCount }, () => []);
				const used: number[] = Array.from({ length: columnCount }, () => 0);
				let col = 0;

				while (index < testimonials.length) {
					const h = heights[index] ?? fallbackHeight;
					const required = h + (used[col] > 0 ? rowGapPx : 0);
					if (used[col] + required <= availableHeight) {
						cols[col].push(index);
						used[col] += required;
						index++;
						continue;
					}

					col++;
					if (col >= columnCount) break;

					// Place into the new column if possible.
					if (h <= availableHeight) {
						cols[col].push(index);
						used[col] = h;
						index++;
						continue;
					}

					// If a single card is taller than the frame, we still show it (it may clip).
					cols[col].push(index);
					used[col] = h;
					index++;
				}

				nextPages.push(cols);
			}

			return nextPages;
		};

		const next = buildPages();
		setPages((current) => {
			if (current.length === next.length) {
				let same = true;
				for (let p = 0; p < next.length; p++) {
					for (let c = 0; c < next[p].length; c++) {
						const a = current[p]?.[c] ?? [];
						const b = next[p]?.[c] ?? [];
						if (a.length !== b.length) {
							same = false;
							break;
						}
						for (let i = 0; i < a.length; i++) {
							if (a[i] !== b[i]) {
								same = false;
								break;
							}
						}
						if (!same) break;
					}
					if (!same) break;
				}
				if (same) return current;
			}
			return next;
		});
	}, [columnCount, frameSize.height, measuredHeights, rowGapPx]);

	return (
		<div
			className={cn("relative flex h-full min-h-0 w-full flex-col", className)}
		>
			<div className="min-h-0 flex-1 overflow-hidden" ref={frameRef}>
				<AnimatePresence initial={false} custom={direction} mode="wait">
					<motion.div
						key={`${page}-${totalPages}-${columnCount}`}
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
							"flex h-full items-start gap-4",
							!isReady && "opacity-0",
						)}
					>
						{Array.from({ length: columnCount }).map((_, colIdx) => {
							const indices = isReady ? (pageColumns[colIdx] ?? []) : [];
							return (
								<div key={colIdx} className="min-w-0 flex-1">
									<div className="flex flex-col gap-4">
										{indices.map((idx) => {
											const t = testimonials[idx];
											if (!t) return null;
											return (
												<div key={idx} className="w-full">
													<TestimonialCard testimonial={t} />
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</motion.div>
				</AnimatePresence>
			</div>

			<div className="pointer-events-none absolute inset-0 h-0 overflow-hidden opacity-0">
				<div ref={measureRef}>
					<div style={{ width: columnWidth || undefined }}>
						{testimonials.map((t, i) => (
							<div
								key={`${t.name}-${i}`}
								data-measure-index={i}
								className="w-full"
							>
								<TestimonialCard testimonial={t} />
							</div>
						))}
					</div>
				</div>
			</div>

			<div
				className={cn(
					"mt-3 flex shrink-0 items-center justify-center gap-2",
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
							aria-label="Previous testimonials"
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
							aria-label="Next testimonials"
						>
							<ChevronRight />
						</Button>
					</>
				) : null}
			</div>
		</div>
	);
}
