"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import styles from "./CityscapeParallax.module.css";
import {
	bucketForWidth,
	generateBuildings,
	type BuildingSpec,
	type SizeBucket,
} from "./buildings";

/*
	CityscapeParallax
	-----------------
	Full-viewport cityscape background used on the home page.

	How it mounts:
	- This component portals its DOM into a fixed background mount node
	  (e.g. `#home-bg-city` declared in the root layout) so it is not constrained
	  by the centered <main> container.

	How it animates:
	- We compute a scroll progress value (0..1) based on the home hero section’s
	  position relative to the viewport.
	- The progress is written to a CSS variable (`--cs-p`) on the root element.
	- Each building derives its own local fall-away progress from `--cs-p`.

	Performance notes:
	- requestAnimationFrame throttling.
	- IntersectionObserver gates work to when the hero is on screen.
	- Disables itself under `prefers-reduced-motion: reduce`.
*/

function clamp01(value: number) {
	return Math.max(0, Math.min(1, value));
}

type BuildingStyle = React.CSSProperties & {
	"--b-x": number;
	"--b-w": number;
	"--b-h": number;
	"--b-start": number;
	"--b-fall": string;
	"--b-rot": string;
	"--b-band1": number;
	"--b-band2": number;
	"--b-band3": number;
	"--b-win-op": number;
};

function styleForBuilding(b: BuildingSpec): BuildingStyle {
	return {
		"--b-x": b.x,
		"--b-w": b.w,
		"--b-h": b.h,
		"--b-start": b.start,
		"--b-fall": `${b.fallPx}px`,
		"--b-rot": `${b.rotDeg}deg`,
		"--b-band1": b.band1,
		"--b-band2": b.band2,
		"--b-band3": b.band3,
		"--b-win-op": b.winOpacity,
	};
}

export function CityscapeParallax({
	className,
	heroId = "home-hero",
	mountId = "home-bg",
}: {
	className?: string;
	heroId?: string;
	mountId?: string;
}) {
	const pathname = usePathname();
	const isHomeRoute = pathname === "/";

	const rootRef = React.useRef<HTMLDivElement | null>(null);
	const frameRef = React.useRef<number | null>(null);
	const activeRef = React.useRef(false);
	const lastProgressRef = React.useRef(-1);
	const heroRetryFramesRef = React.useRef(0);
	const [isClient, setIsClient] = React.useState(false);
	const [heroRetryKey, setHeroRetryKey] = React.useState(0);

	// Important for hydration: keep the initial render deterministic.
	// We update this on the client after mount.
	const [bucket, setBucket] = React.useState<SizeBucket>("lg");
	const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);

	const buildings = React.useMemo(() => generateBuildings(bucket), [bucket]);
	const farBuildings = React.useMemo(
		() => buildings.filter((b) => b.layer === "layer3"),
		[buildings],
	);
	const midBuildings = React.useMemo(
		() => buildings.filter((b) => b.layer === "layer2"),
		[buildings],
	);
	const nearBuildings = React.useMemo(
		() => buildings.filter((b) => b.layer === "layer1"),
		[buildings],
	);

	React.useEffect(() => {
		setIsClient(true);
		setMountNode(document.getElementById(mountId));
	}, [mountId]);

	React.useEffect(() => {
		if (!isClient || !mountNode) return;
		const root = rootRef.current;
		if (!root) return;

		// If we're not on the home route, keep the skyline hidden and fully "fallen".
		// This avoids showing it behind other pages and ensures it reverses when
		// you navigate back.
		if (!isHomeRoute) {
			activeRef.current = false;
			root.style.setProperty("--cs-p", "1");
			lastProgressRef.current = 1;
			heroRetryFramesRef.current = 0;
			return;
		}

		const heroEl = document.getElementById(heroId);
		if (!heroEl) {
			// On route transitions, the layout-level component can render before
			// the page subtree has committed. Retry briefly so we reliably attach.
			root.style.setProperty("--cs-p", "1");
			lastProgressRef.current = 1;
			if (heroRetryFramesRef.current < 12) {
				heroRetryFramesRef.current++;
				const raf = window.requestAnimationFrame(() => {
					setHeroRetryKey((k) => k + 1);
				});
				return () => window.cancelAnimationFrame(raf);
			}
			return;
		}
		heroRetryFramesRef.current = 0;
		const rootEl = root;
		const heroSectionEl = heroEl;

		const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (mql.matches) return;

		function update() {
			frameRef.current = null;
			if (!activeRef.current) return;

			const rect = heroSectionEl.getBoundingClientRect();
			const height = rect.height || 1;
			const progress = clamp01((0 - rect.top) / height);

			if (Math.abs(progress - lastProgressRef.current) < 0.002) return;

			rootEl.style.setProperty("--cs-p", progress.toFixed(4));
			lastProgressRef.current = progress;
		}

		function requestUpdate() {
			if (!activeRef.current) return;
			if (frameRef.current !== null) return;
			frameRef.current = window.requestAnimationFrame(update);
		}

		function updateBucket() {
			setBucket(bucketForWidth(window.innerWidth));
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				activeRef.current = Boolean(entry?.isIntersecting);
				if (activeRef.current) requestUpdate();
				else {
					rootEl.style.setProperty("--cs-p", "1");
					lastProgressRef.current = 1;
				}
			},
			{ root: null, threshold: 0.01 },
		);

		observer.observe(heroSectionEl);
		window.addEventListener("scroll", requestUpdate, { passive: true });

		let resizeRaf = 0;
		const onResize = () => {
			cancelAnimationFrame(resizeRaf);
			resizeRaf = requestAnimationFrame(() => {
				updateBucket();
				requestUpdate();
			});
		};
		window.addEventListener("resize", onResize);

		updateBucket();
		requestUpdate();

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", requestUpdate);
			window.removeEventListener("resize", onResize);
			cancelAnimationFrame(resizeRaf);
			if (frameRef.current !== null) {
				window.cancelAnimationFrame(frameRef.current);
				frameRef.current = null;
			}
		};
	}, [heroId, isClient, mountNode, isHomeRoute, heroRetryKey]);

	// Avoid SSR markup for this effect layer; it portals into a fixed background
	// node and depends on client-only measurements.
	if (!isClient || !mountNode) return null;

	const rootStyle = {
		"--cs-visible": isHomeRoute ? 1 : 0,
	} as React.CSSProperties;

	const content = (
		<div
			ref={rootRef}
			className={cn(styles.root, className)}
			style={rootStyle}
			aria-hidden="true"
		>
			<div className={styles.atmosphere} />

			<div className={cn(styles.layer, styles.layer3)} role="presentation">
				{farBuildings.map((b) => (
					<span
						key={b.id}
						className={styles.building}
						style={styleForBuilding(b)}
					/>
				))}
			</div>

			<div className={cn(styles.layer, styles.layer2)} role="presentation">
				{midBuildings.map((b) => (
					<span
						key={b.id}
						className={styles.building}
						style={styleForBuilding(b)}
					/>
				))}
			</div>

			<div className={cn(styles.layer, styles.layer1)} role="presentation">
				{nearBuildings.map((b) => (
					<span
						key={b.id}
						className={styles.building}
						style={styleForBuilding(b)}
					/>
				))}
			</div>

			<div className={styles.groundHaze} />
		</div>
	);

	return createPortal(content, mountNode);
}
