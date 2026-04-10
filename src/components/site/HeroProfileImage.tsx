"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type HeroProfileImageProps = {
	className?: string;
	imageSizes: string;
};

function hashStringToUint32(input: string) {
	// FNV-1a 32-bit
	let hash = 2166136261;
	for (let i = 0; i < input.length; i++) {
		hash ^= input.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

function mulberry32(seed: number) {
	let t = seed >>> 0;
	return function next() {
		t += 0x6d2b79f5;
		let r = Math.imul(t ^ (t >>> 15), 1 | t);
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
	};
}

function createDashArray(rng: () => number) {
	// Create an irregular dash pattern (dash + gap pairs) that repeats around the circle.
	// Values are in SVG user units (viewBox 0..100), tuned to look like "random breaks".
	const pairs = 10;
	const segments: number[] = [];
	for (let i = 0; i < pairs; i++) {
		const dash = 4 + rng() * 10; // 4..14
		const gap = 3 + rng() * 12; // 3..15
		segments.push(dash, gap);
	}
	return segments.map((n) => n.toFixed(2)).join(" ");
}

function seededDashArray(seed: string) {
	return createDashArray(mulberry32(hashStringToUint32(seed)));
}

export function HeroProfileImage({
	className,
	imageSizes,
}: HeroProfileImageProps) {
	const reduceMotion = useReducedMotion();
	const dashArray = React.useMemo(
		() => seededDashArray("hero-profile-ring"),
		[],
	);

	return (
		<div
			className={cn(
				"relative isolate mx-auto size-40 rounded-full min-[769px]:size-64 lg:size-80 xl:size-96",
				className,
			)}
		>
			{/* Decorative ring: uses currentColor for theme-aware contrast. */}
			<motion.svg
				aria-hidden="true"
				viewBox="0 0 100 100"
				className="pointer-events-none absolute z-10 -inset-4 min-[769px]:-inset-5 lg:-inset-6 text-foreground/45"
				animate={
					reduceMotion
						? undefined
						: {
								rotate: 360,
							}
				}
				transition={
					reduceMotion
						? undefined
						: { duration: 16, repeat: Infinity, ease: "linear" }
				}
			>
				<motion.circle
					cx="50"
					cy="50"
					r="48"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
					strokeDasharray={dashArray}
					animate={
						reduceMotion
							? undefined
							: {
									// ~2πr for r=48 in viewBox units (≈301.6) for a near-seamless loop.
									strokeDashoffset: [0, -302],
								}
					}
					transition={
						reduceMotion
							? undefined
							: { duration: 10, repeat: Infinity, ease: "linear" }
					}
				/>
			</motion.svg>

			<div className="relative z-0 size-full overflow-hidden rounded-full border border-border">
				<Image
					src="/images/profile.jpg"
					alt="Shaun Anderton"
					fill
					priority
					className="object-cover object-[50%_10%] scale-[1.12]"
					sizes={imageSizes}
				/>
			</div>
		</div>
	);
}
