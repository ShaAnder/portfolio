"use client";

import * as React from "react";

export function useInViewOnce<T extends Element>(
	options?: IntersectionObserverInit,
) {
	const [hasBeenInView, setHasBeenInView] = React.useState(false);
	const elementRef = React.useRef<T | null>(null);

	const setRef = React.useCallback((node: T | null) => {
		elementRef.current = node;
	}, []);

	React.useEffect(() => {
		if (hasBeenInView) return;
		const node = elementRef.current;
		if (!node) return;

		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					setHasBeenInView(true);
					observer.disconnect();
					break;
				}
			}
		}, options);

		observer.observe(node);
		return () => observer.disconnect();
	}, [hasBeenInView, options]);

	return { setRef, hasBeenInView };
}
