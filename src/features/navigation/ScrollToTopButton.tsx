"use client";

import * as React from "react";
import { ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HOVER_LIFT_RING } from "@/lib/uiClasses";

type Props = {
	className?: string;
	showAfterPx?: number;
};

export function ScrollToTopButton({ className, showAfterPx = 240 }: Props) {
	const [isVisible, setIsVisible] = React.useState(false);

	React.useEffect(() => {
		let rafId: number | null = null;

		const update = () => {
			rafId = null;
			setIsVisible(window.scrollY > showAfterPx);
		};

		const onScroll = () => {
			if (rafId !== null) return;
			rafId = window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (rafId !== null) window.cancelAnimationFrame(rafId);
		};
	}, [showAfterPx]);

	const scrollToTop = React.useCallback(() => {
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		window.scrollTo({
			top: 0,
			behavior: prefersReducedMotion ? "auto" : "smooth",
		});
	}, []);

	return (
		<div
			className={cn(
				"fixed bottom-4 right-4 z-40 lg:hidden",
				!isVisible && "pointer-events-none opacity-0",
				isVisible && "opacity-100",
				"transition-opacity motion-reduce:transition-none",
				className,
			)}
		>
			<Button
				type="button"
				variant="outline"
				size="icon"
				aria-label="Scroll to top"
				onClick={scrollToTop}
				className={cn(
					"rounded-full",
					HOVER_LIFT_RING,
					"bg-background/80 backdrop-blur",
				)}
			>
				<ChevronUp className="size-4" aria-hidden="true" />
			</Button>
		</div>
	);
}
