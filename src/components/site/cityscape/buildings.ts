/*
	Cityscape building generation
	----------------------------
	This module owns *only* the data generation for the CityscapeParallax skyline.

	Important constraint:
	- Keep generation deterministic and stable so building positions do not change
	  across refreshes unless the algorithm itself is intentionally changed.
	- Visual/scroll behavior remains in the React component.
*/

export type SizeBucket = "sm" | "md" | "lg" | "xl";

// Depth layers:
// - 1 is closest (thickest)
// - 3 is furthest (thinnest)
export type LayerName = "layer1" | "layer2" | "layer3";

export type BuildingSpec = {
	id: string;
	layer: LayerName;
	x: number; // vw
	w: number; // vw
	h: number; // vh
	start: number; // 0..1
	fallPx: number; // px
	rotDeg: number; // deg
	band1: number; // 0..100 (window band positions)
	band2: number;
	band3: number;
	winOpacity: number; // 0..1
};

function clamp01(value: number) {
	return Math.max(0, Math.min(1, value));
}

export function bucketForWidth(width: number): SizeBucket {
	if (width >= 1280) return "xl";
	if (width >= 1024) return "lg";
	if (width >= 768) return "md";
	return "sm";
}

function mulberry32(seed: number) {
	return function next() {
		let t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function randBetween(rng: () => number, min: number, max: number) {
	return min + (max - min) * rng();
}

export function generateBuildings(bucket: SizeBucket): BuildingSpec[] {
	// Deterministic per bucket so the skyline doesn't reshuffle on refresh.
	// (We still use pseudo-randomness for variety, but it remains stable.)
	const seedBase =
		bucket === "sm" ? 11 : bucket === "md" ? 22 : bucket === "lg" ? 33 : 44;

	const dialBack = (count: number) => Math.max(1, Math.round(count * 0.6));
	const counts: Record<SizeBucket, Record<LayerName, number>> = {
		sm: { layer1: dialBack(14), layer2: dialBack(12), layer3: dialBack(10) },
		md: { layer1: dialBack(18), layer2: dialBack(16), layer3: dialBack(14) },
		lg: { layer1: dialBack(24), layer2: dialBack(20), layer3: dialBack(18) },
		xl: { layer1: dialBack(30), layer2: dialBack(24), layer3: dialBack(22) },
	};

	const buildings: BuildingSpec[] = [];

	type PlacedInterval = { start: number; end: number; w: number };
	function overlapLength(a: PlacedInterval, b: PlacedInterval) {
		return Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));
	}

	function pickSpacedX({
		index,
		count,
		w,
		rng,
		placed,
		jitterFactor = 0.35,
		maxHeavyOverlaps = 1,
	}: {
		index: number;
		count: number;
		w: number;
		rng: () => number;
		placed: PlacedInterval[];
		jitterFactor?: number;
		maxHeavyOverlaps?: number;
	}) {
		// Stratified placement: each building gets its own slice of the screen.
		// This guarantees we use the full width and avoids clumping.
		const segmentWidth = 100 / Math.max(1, count);
		const segmentStart = index * segmentWidth;
		const segmentEnd = (index + 1) * segmentWidth;
		const centerBase = (segmentStart + segmentEnd) / 2;

		for (let attempt = 0; attempt < 8; attempt++) {
			const jitter = (rng() * 2 - 1) * segmentWidth * jitterFactor;
			const center = centerBase + jitter;
			let x = center - w / 2;
			x = Math.max(0.5, Math.min(99 - w, x));

			const candidate: PlacedInterval = { start: x, end: x + w, w };
			let heavyOverlaps = 0;
			for (const other of placed) {
				const ol = overlapLength(candidate, other);
				// "Heavy" overlap means two buildings substantially covering each other.
				if (ol > Math.min(candidate.w, other.w) * 0.35) heavyOverlaps++;
				if (heavyOverlaps > maxHeavyOverlaps) break;
			}
			if (heavyOverlaps <= maxHeavyOverlaps) return x;
		}

		// Fallback: no jitter.
		const x = centerBase - w / 2;
		return Math.max(0.5, Math.min(99 - w, x));
	}

	const layers: Array<LayerName> = ["layer3", "layer2", "layer1"]; // back to front for natural overlap
	for (const layer of layers) {
		const count = counts[bucket][layer];
		const raw: Array<Omit<BuildingSpec, "start">> = [];
		const placed: PlacedInterval[] = [];
		const layerSalt =
			layer === "layer1" ? 0xa1 : layer === "layer2" ? 0xb2 : 0xc3;
		const layerRng = mulberry32((seedBase ^ layerSalt) >>> 0);

		for (let i = 0; i < count; i++) {
			// Thickness: closer buildings are wider.
			const w =
				layer === "layer1"
					? randBetween(layerRng, 4.2, 10.2)
					: layer === "layer2"
						? randBetween(layerRng, 2.8, 7.2)
						: randBetween(layerRng, 1.9, 5.4);

			const x = pickSpacedX({
				index: i,
				count,
				w,
				rng: layerRng,
				placed,
				jitterFactor:
					layer === "layer1" ? 0.33 : layer === "layer2" ? 0.28 : 0.24,
				maxHeavyOverlaps: layer === "layer1" ? 1 : layer === "layer2" ? 1 : 0,
			});

			const h =
				layer === "layer1"
					? randBetween(layerRng, 26, 50)
					: layer === "layer2"
						? randBetween(layerRng, 22, 44)
						: randBetween(layerRng, 18, 38);

			const fallPx =
				layer === "layer1"
					? randBetween(layerRng, 380, 600)
					: layer === "layer2"
						? randBetween(layerRng, 300, 520)
						: randBetween(layerRng, 240, 460);

			const rotDeg =
				layer === "layer1"
					? randBetween(layerRng, -16, 16)
					: layer === "layer2"
						? randBetween(layerRng, -14, 14)
						: randBetween(layerRng, -12, 12);

			const band1 = randBetween(layerRng, 18, 40);
			const band2 = Math.min(80, band1 + randBetween(layerRng, 18, 30));
			const band3 = Math.min(92, band2 + randBetween(layerRng, 14, 22));

			const winOpacity =
				layer === "layer1"
					? randBetween(layerRng, 0.16, 0.3)
					: layer === "layer2"
						? randBetween(layerRng, 0.12, 0.24)
						: randBetween(layerRng, 0.08, 0.2);

			raw.push({
				id: `${layer}-${bucket}-${i}`,
				layer,
				x,
				w,
				h,
				fallPx,
				rotDeg,
				band1,
				band2,
				band3,
				winOpacity,
			});

			placed.push({ start: x, end: x + w, w });
		}

		// Sequential fall-away:
		// 1) Each layer has its own “fall window” in the overall scroll progress.
		// 2) Within that window, buildings fall in order (left-to-right).
		const baseStart =
			layer === "layer1" ? 0.05 : layer === "layer2" ? 0.18 : 0.32;
		const span = layer === "layer1" ? 0.36 : layer === "layer2" ? 0.3 : 0.24;
		const ordered = [...raw].sort((a, b) => a.x - b.x);
		for (let i = 0; i < ordered.length; i++) {
			const t = ordered.length <= 1 ? 0 : i / (ordered.length - 1);
			buildings.push({
				...ordered[i],
				start: clamp01(baseStart + span * t),
			});
		}
	}

	return buildings;
}
