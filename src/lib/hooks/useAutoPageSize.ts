"use client";

import * as React from "react";

type UseAutoPageSizeOptions = {
	cardsPerRow: number;
	maxPageSize: number;
	itemSelector: string;
	viewportHeight: number;
};

export function useAutoPageSize({
	cardsPerRow,
	maxPageSize,
	itemSelector,
	viewportHeight,
}: UseAutoPageSizeOptions) {
	const [autoPageSize, setAutoPageSize] = React.useState<number | null>(null);
	const pageSize = autoPageSize ?? maxPageSize;

	const frameRef = React.useRef<HTMLDivElement | null>(null);
	const gridRef = React.useRef<HTMLDivElement | null>(null);
	const paginationRef = React.useRef<HTMLDivElement | null>(null);
	const computeRef = React.useRef<(() => void) | null>(null);

	React.useLayoutEffect(() => {
		const frame = frameRef.current;
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
				const firstItem = grid?.querySelector<HTMLElement>(itemSelector);
				const itemHeight = firstItem?.getBoundingClientRect().height ?? 120;
				const computedRowGap = grid
					? Number.parseFloat(window.getComputedStyle(grid).rowGap || "0")
					: 12;
				const rowGap =
					Number.isFinite(computedRowGap) && computedRowGap > 0
						? computedRowGap
						: 12;

				const rowsFit = Math.max(
					1,
					Math.floor((availableHeight + rowGap) / (itemHeight + rowGap)),
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
		computeRef.current = compute;
		window.addEventListener("resize", compute, { passive: true });

		let resizeObserver: ResizeObserver | null = null;
		if (typeof ResizeObserver !== "undefined") {
			resizeObserver = new ResizeObserver(() => compute());
			if (section) resizeObserver.observe(section);
			resizeObserver.observe(frame);
		}

		return () => {
			computeRef.current = null;
			window.removeEventListener("resize", compute);
			resizeObserver?.disconnect();
			if (rafId !== null) window.cancelAnimationFrame(rafId);
		};
	}, [cardsPerRow, itemSelector, maxPageSize]);

	React.useEffect(() => {
		computeRef.current?.();
	}, [viewportHeight, pageSize, cardsPerRow, maxPageSize]);

	return {
		pageSize,
		frameRef,
		gridRef,
		paginationRef,
	};
}
