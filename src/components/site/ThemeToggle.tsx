"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/*
	ThemeToggle
	-----------
	This is a dedicated day/night mode control designed to feel "alive":
	- The thumb slides (translate) rather than snapping.
	- The sun/moon icons crossfade + rotate/scale to suggest a state change.
	- We avoid hydration mismatches by waiting until mount before reading `resolvedTheme`.
*/

export function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);
	const [optimisticTheme, setOptimisticTheme] = React.useState<
		"light" | "dark" | null
	>(null);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const effectiveTheme =
		optimisticTheme ?? (mounted ? resolvedTheme : undefined);
	const isDark = effectiveTheme === "dark";

	React.useEffect(() => {
		if (!mounted) return;
		if (optimisticTheme && resolvedTheme === optimisticTheme) {
			setOptimisticTheme(null);
		}
	}, [mounted, optimisticTheme, resolvedTheme]);

	const handleToggle = React.useCallback(() => {
		const nextTheme = isDark ? "light" : "dark";
		setOptimisticTheme(nextTheme);

		// Persist immediately so refreshes keep the choice even if React updates are delayed.
		try {
			localStorage.setItem("theme", nextTheme);
		} catch {
			// Ignore if storage is unavailable.
		}

		// Prefer a single compositor-driven transition to avoid "jitter" from lots of
		// individual element transitions when CSS variables flip.
		const startViewTransition = (
			document as unknown as {
				startViewTransition?: (callback: () => void) => void;
			}
		).startViewTransition?.bind(document);

		const applyDomTheme = () => {
			// Apply the theme synchronously to avoid a "halfway" hitch.
			document.documentElement.classList.toggle("dark", nextTheme === "dark");
		};

		if (startViewTransition) {
			startViewTransition(applyDomTheme);

			// next-themes applies the class in an effect; syncing it after the transition
			// avoids a second DOM update in the middle of the animation.
			window.setTimeout(() => setTheme(nextTheme), 260);
			return;
		}

		applyDomTheme();
		setTheme(nextTheme);
	}, [isDark, setTheme]);

	return (
		<Button
			variant="outline"
			size="icon-sm"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			aria-pressed={isDark}
			onClick={handleToggle}
			className={cn(
				// "Pill" track. Slight transparency keeps it sleek over the blurred header.
				"relative w-12 justify-start overflow-hidden rounded-full border-border bg-background/60 p-0 transition-colors duration-300",
				"hover:bg-muted",
				"focus-visible:ring-3 focus-visible:ring-ring/50",
				className,
			)}
		>
			<span
				aria-hidden="true"
				className={cn(
					// The thumb is a simple circle; we animate only transform for smoothness.
					"absolute top-1 left-1 size-5 rounded-full bg-background transition-transform duration-300 ease-in-out",
					isDark && "translate-x-5",
				)}
			/>

			<SunIcon
				aria-hidden="true"
				className={cn(
					// When switching to dark, "sun" tucks away with a little flourish.
					"absolute left-1.5 top-1.5 size-4 transition-all duration-300",
					isDark && "opacity-0 -rotate-90 scale-75",
				)}
			/>
			<MoonIcon
				aria-hidden="true"
				className={cn(
					// When switching to light, "moon" tucks away with the opposite flourish.
					"absolute right-1.5 top-1.5 size-4 transition-all duration-300",
					!isDark && "opacity-0 rotate-90 scale-75",
				)}
			/>
		</Button>
	);
}
