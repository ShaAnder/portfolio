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
