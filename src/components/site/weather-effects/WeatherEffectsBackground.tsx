"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { useWeatherEffects } from "@/components/site/weather-effects/WeatherEffectsProvider";
import styles from "@/components/site/weather-effects/WeatherEffects.module.css";

type DropSpec = {
	impactXvw: number;
	durationMs: number;
	lengthPx: number;
	opacity: number;
};

type DropInstance = {
	id: string;
	dropEl: HTMLSpanElement;
	rippleEl: HTMLSpanElement;
	removeTimer: number;
};

function rand(min: number, max: number) {
	return min + Math.random() * (max - min);
}

function createDrop(): DropSpec {
	return {
		impactXvw: rand(4, 96),
		durationMs: rand(900, 1700),
		lengthPx: rand(45, 140),
		opacity: rand(0.18, 0.5),
	};
}

type RenderState = "on" | "stopping" | "off";

/**
 * WeatherEffectsBackground
 * -----------------------
 * Renders the rain-like streaks + bottom ripples.
 *
 * Performance design:
 * - We intentionally do NOT store drops in React state.
 *   Each spawn would otherwise re-render and reconcile up to `maxDrops` nodes.
 * - Instead, we imperatively create/remove DOM nodes inside a fixed overlay.
 * - The only React-driven updates are: mount, enabled/disabled, and maxDrops.
 *
 * Accessibility:
 * - Entire layer is `aria-hidden`.
 * - Automatically disables itself under `prefers-reduced-motion: reduce`.
 */

export function WeatherEffectsBackground({
	maxDrops = 180,
	mountId,
	layer = "front",
}: {
	maxDrops?: number;
	mountId?: string;
	layer?: "front" | "back";
}) {
	const { enabled, mounted } = useWeatherEffects();
	const rootRef = React.useRef<HTMLDivElement | null>(null);
	const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);
	const instancesRef = React.useRef<DropInstance[]>([]);

	const spawnTimerRef = React.useRef<number | null>(null);
	const clearLayerTimerRef = React.useRef<number | null>(null);
	// Rain density is controlled by maxDrops + spawn cadence.
	// (Both layers share these defaults unless overridden via props.)
	const spawnIntervalRef = React.useRef(72);
	const phaseRef = React.useRef<RenderState>("off");
	const stoppingSpawnsRef = React.useRef(0);
	const stoppingStartedAtRef = React.useRef<number | null>(null);
	const reducedMotionRef = React.useRef(false);
	const visibilityRef = React.useRef<"visible" | "hidden">(
		typeof document === "undefined" ? "visible" : document.visibilityState,
	);

	// Resolve portal mount node (for back-rain) after mount.
	// The mount element can appear later in the tree than this component.
	React.useEffect(() => {
		if (!mounted || !mountId) return;
		let raf = 0;
		let tries = 0;

		const find = () => {
			const node = document.getElementById(mountId);
			if (node) {
				setMountNode(node);
				return;
			}
			tries += 1;
			if (tries > 30) return;
			raf = requestAnimationFrame(find);
		};

		find();
		return () => cancelAnimationFrame(raf);
	}, [mounted, mountId]);

	/** Clears and nulls the active spawn timer. */
	const clearSpawnTimer = React.useCallback(() => {
		if (spawnTimerRef.current === null) return;
		window.clearTimeout(spawnTimerRef.current);
		spawnTimerRef.current = null;
	}, []);

	/** Clears and nulls the "clear layer" timer. */
	const clearLayerClearTimer = React.useCallback(() => {
		if (clearLayerTimerRef.current === null) return;
		window.clearTimeout(clearLayerTimerRef.current);
		clearLayerTimerRef.current = null;
	}, []);

	/**
	 * Removes a specific instance from the DOM and internal queue.
	 * (Used by both maxDrops trimming and natural timeout cleanup.)
	 */
	const removeInstance = React.useCallback((id: string) => {
		const idx = instancesRef.current.findIndex((i) => i.id === id);
		if (idx === -1) return;
		const inst = instancesRef.current[idx];
		window.clearTimeout(inst.removeTimer);
		inst.dropEl.remove();
		inst.rippleEl.remove();
		instancesRef.current.splice(idx, 1);
	}, []);

	/**
	 * Clears all instances from the layer.
	 * We do this imperatively to avoid React setState churn.
	 */
	const clearLayerNow = React.useCallback(() => {
		for (const inst of instancesRef.current) {
			window.clearTimeout(inst.removeTimer);
			inst.dropEl.remove();
			inst.rippleEl.remove();
		}
		instancesRef.current = [];
		const root = rootRef.current;
		if (root) root.dataset.state = "off";
	}, []);

	/** Schedules a full layer clear after a delay to allow existing animations to finish. */
	const scheduleLayerClear = React.useCallback(
		(ms: number) => {
			clearLayerClearTimer();
			clearLayerTimerRef.current = window.setTimeout(() => {
				clearLayerNow();
				phaseRef.current = "off";
			}, ms);
		},
		[clearLayerClearTimer, clearLayerNow],
	);

	/**
	 * Spawns a single drop + ripple pair.
	 * We clamp the number of live instances to `maxDrops`.
	 */
	const spawnOne = React.useCallback(() => {
		const root = rootRef.current;
		if (!root) return;

		const spec = createDrop();
		const id =
			typeof crypto !== "undefined" && "randomUUID" in crypto
				? crypto.randomUUID()
				: String(Date.now()) + Math.random().toString(16);

		const dropEl = document.createElement("span");
		dropEl.className = styles.drop;
		dropEl.style.setProperty("--we-impact-x", String(spec.impactXvw));
		dropEl.style.setProperty(
			"--we-dur-ms",
			String(Math.round(spec.durationMs)),
		);
		dropEl.style.setProperty("--we-len", `${Math.round(spec.lengthPx)}px`);
		dropEl.style.setProperty("--we-opacity", String(spec.opacity));
		dropEl.dataset.weId = id;

		const rippleEl = document.createElement("span");
		rippleEl.className = styles.ripple;
		rippleEl.style.setProperty("--we-impact-x", String(spec.impactXvw));
		rippleEl.style.setProperty(
			"--we-dur-ms",
			String(Math.round(spec.durationMs)),
		);
		rippleEl.style.setProperty("--we-opacity", String(spec.opacity));
		rippleEl.dataset.weId = id;

		// Append is fine because z-index controls stacking.
		root.append(dropEl, rippleEl);

		// Natural cleanup: remove shortly after the CSS animations finish.
		const removeTimer = window.setTimeout(
			() => {
				removeInstance(id);
			},
			Math.round(spec.durationMs) + 250,
		);

		instancesRef.current.push({ id, dropEl, rippleEl, removeTimer });

		// Enforce a hard cap: remove oldest instances first.
		while (instancesRef.current.length > maxDrops) {
			const oldest = instancesRef.current.shift();
			if (!oldest) break;
			window.clearTimeout(oldest.removeTimer);
			oldest.dropEl.remove();
			oldest.rippleEl.remove();
		}
	}, [maxDrops, removeInstance]);

	/**
	 * The spawn scheduler.
	 *
	 * Behavior:
	 * - When enabled: interval ramps down (more frequent spawns) to "ramp up" intensity.
	 * - When stopping: interval gradually ramps up (less frequent) to "wind down".
	 */
	const scheduleNextSpawn = React.useCallback(() => {
		clearSpawnTimer();

		function tick() {
			const phase = phaseRef.current;
			// Hard stop when the layer is off or motion should be reduced.
			if (phase === "off" || reducedMotionRef.current) {
				clearSpawnTimer();
				return;
			}
			// When the tab is hidden, pause completely to save CPU.
			// (We resume from the `visibilitychange` listener.)
			if (visibilityRef.current === "hidden") {
				clearSpawnTimer();
				return;
			}

			spawnOne();

			if (phase === "on") {
				spawnIntervalRef.current = Math.max(
					20,
					Math.floor(spawnIntervalRef.current * 0.95),
				);
				spawnTimerRef.current = window.setTimeout(
					tick,
					spawnIntervalRef.current,
				);
				return;
			}

			stoppingSpawnsRef.current += 1;
			const startedAt = stoppingStartedAtRef.current;
			const elapsed = startedAt ? Date.now() - startedAt : 0;
			if (elapsed > 5600) {
				spawnIntervalRef.current = Math.min(
					10400,
					Math.floor(spawnIntervalRef.current * 1.25),
				);
			}

			if (stoppingSpawnsRef.current >= 48 || spawnIntervalRef.current >= 9600) {
				phaseRef.current = "off";
				clearSpawnTimer();
				scheduleLayerClear(20000);
				return;
			}

			spawnTimerRef.current = window.setTimeout(tick, spawnIntervalRef.current);
		}

		spawnTimerRef.current = window.setTimeout(tick, spawnIntervalRef.current);
	}, [clearSpawnTimer, scheduleLayerClear, spawnOne]);

	// Track reduced-motion and page visibility so we can pause work aggressively.
	React.useEffect(() => {
		if (!mounted) return;
		const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
		reducedMotionRef.current = mql.matches;

		function onMotionChange(e: MediaQueryListEvent) {
			reducedMotionRef.current = e.matches;
			if (e.matches) {
				clearSpawnTimer();
				scheduleLayerClear(0);
			} else if (phaseRef.current !== "off") {
				scheduleNextSpawn();
			}
		}

		function onVisibilityChange() {
			visibilityRef.current = document.visibilityState;
			if (visibilityRef.current === "hidden") {
				clearSpawnTimer();
				return;
			}
			if (!reducedMotionRef.current && phaseRef.current !== "off") {
				scheduleNextSpawn();
			}
		}

		mql.addEventListener("change", onMotionChange);
		document.addEventListener("visibilitychange", onVisibilityChange);

		return () => {
			mql.removeEventListener("change", onMotionChange);
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, [clearSpawnTimer, mounted, scheduleLayerClear, scheduleNextSpawn]);

	React.useEffect(() => {
		if (!mounted) return;
		if (reducedMotionRef.current) return;

		// Cancel any pending timers before responding to the new enabled/maxDrops state.
		clearSpawnTimer();
		clearLayerClearTimer();

		// Enforce the drop cap even if maxDrops decreases (no spawn needed).
		while (instancesRef.current.length > maxDrops) {
			const oldest = instancesRef.current.shift();
			if (!oldest) break;
			window.clearTimeout(oldest.removeTimer);
			oldest.dropEl.remove();
			oldest.rippleEl.remove();
		}

		const root = rootRef.current;
		if (root) root.dataset.state = phaseRef.current;

		if (enabled) {
			phaseRef.current = "on";
			if (root) root.dataset.state = "on";
			stoppingSpawnsRef.current = 0;
			stoppingStartedAtRef.current = null;
			spawnIntervalRef.current = 58;
			scheduleNextSpawn();
			return () => {
				clearSpawnTimer();
				clearLayerClearTimer();
			};
		}

		// Transition ON -> STOPPING. If already OFF, just schedule a cleanup.
		phaseRef.current =
			phaseRef.current === "on" ? "stopping" : phaseRef.current;
		if (root) root.dataset.state = phaseRef.current;
		if (phaseRef.current === "stopping") {
			stoppingSpawnsRef.current = 0;
			stoppingStartedAtRef.current = Date.now();
			spawnIntervalRef.current = Math.max(spawnIntervalRef.current, 120);
			scheduleNextSpawn();
			return () => {
				clearSpawnTimer();
				clearLayerClearTimer();
			};
		}

		clearSpawnTimer();
		if (instancesRef.current.length > 0) scheduleLayerClear(20000);

		return () => {
			clearSpawnTimer();
			clearLayerClearTimer();
		};
	}, [
		enabled,
		maxDrops,
		mounted,
		clearLayerClearTimer,
		clearSpawnTimer,
		scheduleLayerClear,
		scheduleNextSpawn,
	]);

	// Render a single inert container; all children are spawned imperatively.
	if (!mounted) return null;

	const rootClassName =
		layer === "back" ? `${styles.root} ${styles.rootBack}` : styles.root;

	const layerEl = (
		<div
			ref={rootRef}
			className={rootClassName}
			data-state="off"
			aria-hidden="true"
		/>
	);

	if (mountId) {
		if (!mountNode) return null;
		return createPortal(layerEl, mountNode);
	}

	return layerEl;
}
