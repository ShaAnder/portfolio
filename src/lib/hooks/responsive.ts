"use client";

import * as React from "react";

function getViewportHeightSnapshot() {
	if (typeof window === "undefined") return 0;
	return Math.round(window.visualViewport?.height ?? window.innerHeight);
}

export function useViewportHeight() {
	return React.useSyncExternalStore(
		(onStoreChange) => {
			if (typeof window === "undefined") return () => {};

			let lastHeight = getViewportHeightSnapshot();
			let rafId: number | null = null;

			const notifyIfChanged = () => {
				if (rafId !== null) return;
				rafId = window.requestAnimationFrame(() => {
					rafId = null;
					const nextHeight = getViewportHeightSnapshot();
					if (nextHeight === lastHeight) return;
					lastHeight = nextHeight;
					onStoreChange();
				});
			};

			window.addEventListener("resize", notifyIfChanged, { passive: true });
			const visualViewport = window.visualViewport;
			visualViewport?.addEventListener("resize", notifyIfChanged, {
				passive: true,
			});
			// Some mobile browsers emit scroll events on visualViewport when the URL bar
			// collapses/expands. Guard against re-render spam by checking height changes.
			visualViewport?.addEventListener("scroll", notifyIfChanged, {
				passive: true,
			});

			return () => {
				window.removeEventListener("resize", notifyIfChanged);
				visualViewport?.removeEventListener("resize", notifyIfChanged);
				visualViewport?.removeEventListener("scroll", notifyIfChanged);
				if (rafId !== null) window.cancelAnimationFrame(rafId);
			};
		},
		getViewportHeightSnapshot,
		() => 0,
	);
}

export function useMediaQuery(query: string) {
	return React.useSyncExternalStore(
		(onStoreChange) => {
			if (typeof window === "undefined") return () => {};
			const mediaQueryList = window.matchMedia(query);
			const handler = () => onStoreChange();
			mediaQueryList.addEventListener("change", handler);
			return () => mediaQueryList.removeEventListener("change", handler);
		},
		() =>
			typeof window !== "undefined" ? window.matchMedia(query).matches : false,
		() => false,
	);
}

export type ViewportDensity = "compact" | "regular" | "spacious";

type UseViewportDensityOptions = {
	enabled?: boolean;
	viewportHeight: number;
	contentRef: React.RefObject<HTMLElement | null>;
	/**
	 * How much spare space (in px) is required before upgrading density.
	 * Larger values reduce oscillation at the cost of being less eager.
	 */
	spaciousEnterPx?: number;
	spaciousExitPx?: number;
	compactEnterPx?: number;
	compactExitPx?: number;
};

export function useViewportDensity({
	enabled = true,
	viewportHeight,
	contentRef,
	spaciousEnterPx = 220,
	spaciousExitPx = 120,
	compactEnterPx = -40,
	compactExitPx = 80,
}: UseViewportDensityOptions): ViewportDensity {
	const [density, setDensity] = React.useState<ViewportDensity>("regular");
	const lastMeasuredHeight = React.useRef(0);

	const measure = React.useCallback(() => {
		if (!enabled) return;
		const el = contentRef.current;
		if (!el) return;
		lastMeasuredHeight.current = Math.round(el.getBoundingClientRect().height);
	}, [enabled, contentRef]);

	React.useLayoutEffect(() => {
		if (!enabled) return;
		const el = contentRef.current;
		if (!el) return;

		let rafId: number | null = null;
		const scheduleMeasure = () => {
			if (rafId !== null) return;
			rafId = window.requestAnimationFrame(() => {
				rafId = null;
				measure();
			});
		};

		measure();
		const resizeObserver = new ResizeObserver(scheduleMeasure);
		resizeObserver.observe(el);

		window.addEventListener("resize", scheduleMeasure, { passive: true });
		window.visualViewport?.addEventListener("resize", scheduleMeasure, {
			passive: true,
		});
		window.visualViewport?.addEventListener("scroll", scheduleMeasure, {
			passive: true,
		});

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", scheduleMeasure);
			window.visualViewport?.removeEventListener("resize", scheduleMeasure);
			window.visualViewport?.removeEventListener("scroll", scheduleMeasure);
			if (rafId !== null) window.cancelAnimationFrame(rafId);
		};
	}, [enabled, contentRef, measure]);

	React.useEffect(() => {
		if (!enabled) {
			setDensity("regular");
			return;
		}
		const contentHeight = lastMeasuredHeight.current;
		if (viewportHeight <= 0 || contentHeight <= 0) return;

		const sparePx = viewportHeight - contentHeight;
		setDensity((prev) => {
			if (prev === "spacious") {
				if (sparePx < spaciousExitPx) return "regular";
				return prev;
			}

			if (prev === "compact") {
				if (sparePx > compactExitPx) return "regular";
				return prev;
			}

			// prev === "regular"
			if (sparePx > spaciousEnterPx) return "spacious";
			if (sparePx < compactEnterPx) return "compact";
			return prev;
		});
	}, [
		enabled,
		viewportHeight,
		spaciousEnterPx,
		spaciousExitPx,
		compactEnterPx,
		compactExitPx,
	]);

	return enabled ? density : "regular";
}
