"use client";

import * as React from "react";

import {
	defaultParticleNetworkConfig,
	ParticleNetworkEngine,
	type ParticleNetworkTheme,
} from "@/lib/particleNetwork";

type ParticleNetworkBackgroundProps = {
	className?: string;
};

export function ParticleNetworkBackground({
	className,
}: ParticleNetworkBackgroundProps) {
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

	React.useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// If the user asked for reduced motion, we keep the background static.
		const reduceMotion = window.matchMedia?.(
			"(prefers-reduced-motion: reduce)",
		).matches;

		let animationFrameId = 0;
		const config = defaultParticleNetworkConfig();
		const engine = new ParticleNetworkEngine(ctx, config);

		const computeVisualScale = (width: number) => {
			// Target scaling:
			// - small screens: ~1.0
			// - "medium" screens: ~1.25
			// - large/desktop: ~1.5
			if (width <= 768) return 1;

			const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
			const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

			// 769 -> 1024 ramps 1.0 -> 1.25
			if (width <= 1024) {
				return lerp(1, 1.25, clamp01((width - 769) / (1024 - 769)));
			}

			// 1025 -> 1536 ramps 1.25 -> 1.5
			return lerp(1.25, 1.5, clamp01((width - 1025) / (1536 - 1025)));
		};

		const setTheme = () => {
			const theme: ParticleNetworkTheme =
				document.documentElement.classList.contains("dark") ? "dark" : "light";
			engine.setTheme(theme);
		};

		const resize = () => {
			// We use the element size, not window size, so it works in any layout.
			const rect = canvas.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;
			const width = Math.max(1, Math.floor(rect.width));
			const height = Math.max(1, Math.floor(rect.height));

			engine.setVisualScale(computeVisualScale(width));

			// This keeps the canvas crisp without going overboard on high-DPI screens.
			const clampedDpr = Math.min(2, Math.max(1, dpr));
			canvas.width = Math.floor(width * clampedDpr);
			canvas.height = Math.floor(height * clampedDpr);
			ctx.setTransform(clampedDpr, 0, 0, clampedDpr, 0, 0);

			engine.resize(width, height);
		};

		setTheme();
		resize();
		engine.draw();

		const onResize = () => {
			resize();
			engine.draw();
		};
		window.addEventListener("resize", onResize, { passive: true });

		// Theme changes happen by toggling a class on <html>. We listen for that.
		const observer = new MutationObserver(() => {
			setTheme();
			engine.draw();
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "style"],
		});

		if (!reduceMotion) {
			const tick = () => {
				engine.step();
				animationFrameId = window.requestAnimationFrame(tick);
			};
			animationFrameId = window.requestAnimationFrame(tick);
		}

		return () => {
			window.removeEventListener("resize", onResize);
			observer.disconnect();
			if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<div
			aria-hidden="true"
			className={
				"pointer-events-none absolute inset-0 opacity-60 " + (className ?? "")
			}
		>
			<canvas ref={canvasRef} className="block h-full w-full" />
		</div>
	);
}
