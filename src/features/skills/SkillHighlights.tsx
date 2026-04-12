"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import { highlightSkills } from "@/data/skills";
import { cn } from "@/lib/utils";
import { FOCUS_RING } from "@/lib/uiClasses";
import { useMediaQuery, useViewportHeight } from "@/lib/hooks/responsive";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type SkillKind = "Language" | "Framework" | "Tool" | "Platform";

type RenderedSkill = {
	key: string;
	name: string;
	category: string;
	percent: number;
	summary: string;
	details: string[];
	kind: SkillKind;
	level: number; // 0..5 (0=default/unscored)
	isLive: boolean;
};

type ApiSkill = {
	key: string;
	percent: number;
	repoCount: number;
};

type ApiLanguage = {
	key: string;
	name: string;
	percent: number;
	repoCount: number;
};

const DEFAULT_BASELINE_PERCENT = 50;
const LIVE_SWITCH_PERCENT = 20;

function canonicalSkillName(name: string) {
	const lower = name.trim().toLowerCase();
	if (lower === "dockerfile") return "docker";
	if (lower === "c++") return "cpp";
	if (lower === "c#") return "csharp";
	return lower;
}

function safePercent(value: number) {
	if (!Number.isFinite(value)) return 0;
	return Math.max(0, Math.min(100, value));
}

function levelFromPercent(percent: number) {
	const p = safePercent(percent);
	if (p < LIVE_SWITCH_PERCENT) return 0;
	if (p >= 100) return 5;
	if (p >= 80) return 4;
	if (p >= 60) return 3;
	if (p >= 40) return 2;
	return 1;
}

function getSkillKind(skill: {
	key: string;
	name: string;
	category?: string;
}): SkillKind {
	const key = skill.key.toLowerCase();
	if (key.startsWith("lang-")) return "Language";

	// Languages
	if (
		key === "typescript" ||
		key === "javascript" ||
		key === "python" ||
		key === "html" ||
		key === "css" ||
		key === "sql"
	) {
		return "Language";
	}

	// Frameworks
	if (
		key === "react" ||
		key === "nextjs" ||
		key === "tailwind" ||
		key === "django" ||
		key === "drf"
	) {
		return "Framework";
	}

	// Platforms / ecosystems
	if (
		key === "supabase" ||
		key === "aws" ||
		key === "postgresql" ||
		key === "postgres" ||
		key === "redis"
	) {
		return "Platform";
	}

	// Tools
	if (
		key === "docker" ||
		key === "kubernetes" ||
		key === "graphql" ||
		key === "websockets" ||
		key === "ci-cd" ||
		key === "cicd" ||
		key === "testing"
	) {
		return "Tool";
	}

	return "Tool";
}

function getSkillGradientClassName(kind: SkillKind) {
	switch (kind) {
		case "Language":
			return "bg-linear-to-r from-skill-blue-1 to-skill-blue-2";
		case "Framework":
			return "bg-linear-to-r from-skill-red-1 to-skill-red-2";
		case "Platform":
			return "bg-linear-to-r from-skill-green-1 to-skill-green-2";
		case "Tool":
		default:
			return "bg-linear-to-r from-skill-yellow-1 to-skill-yellow-2";
	}
}

function SkillSliceBar({
	percent,
	active,
	kind,
	totalBars,
	thick,
}: {
	percent: number;
	active: boolean;
	kind: SkillKind;
	totalBars: number;
	thick: boolean;
}) {
	const safe = Math.max(0, Math.min(100, Math.round(safePercent(percent))));
	const clampedTotalBars = Math.max(1, Math.round(totalBars));
	const filledBars = active
		? Math.min(clampedTotalBars, Math.ceil((safe / 100) * clampedTotalBars))
		: 0;

	const slices = React.useMemo(
		() => Array.from({ length: clampedTotalBars }),
		[clampedTotalBars],
	);
	const gridStyle = React.useMemo(
		() =>
			({
				gridTemplateColumns: `repeat(${clampedTotalBars}, minmax(0, 1fr))`,
			}) as const,
		[clampedTotalBars],
	);
	const filledClassName = React.useMemo(
		() => getSkillGradientClassName(kind),
		[kind],
	);

	return (
		<div
			className="relative"
			role="progressbar"
			aria-label="Skill level"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={safe}
		>
			<div className="grid gap-1" style={gridStyle} aria-hidden="true">
				{slices.map((_, i) => {
					const isFilled = i < filledBars;
					const fillPositionPct =
						clampedTotalBars <= 1 ? 0 : (i / (clampedTotalBars - 1)) * 100;
					return (
						<span
							key={i}
							className={cn(
								"rounded-md transition-colors duration-700 ease-out motion-reduce:transition-none",
								thick ? "h-5" : "h-4",
								"bg-foreground/15",
								isFilled && filledClassName,
							)}
							style={
								isFilled
									? {
											transitionDelay: `${i * 10}ms`,
											backgroundSize: `${clampedTotalBars * 100}% 100%`,
											backgroundPosition: `${fillPositionPct}% 50%`,
										}
									: undefined
							}
						/>
					);
				})}
			</div>
		</div>
	);
}

function SkillHighlightItem({
	skill,
	hasBeenSeen,
	onSeen,
	allowInViewActivation,
	barCount,
	thickBars,
}: {
	skill: RenderedSkill;
	hasBeenSeen: boolean;
	onSeen: (key: string) => void;
	allowInViewActivation: boolean;
	barCount: number;
	thickBars: boolean;
}) {
	const { setRef, hasBeenInView } = useInViewOnce<HTMLButtonElement>({
		threshold: 0.35,
	});

	React.useEffect(() => {
		if (hasBeenSeen) return;
		if (!allowInViewActivation) return;
		if (hasBeenInView) onSeen(skill.key);
	}, [allowInViewActivation, hasBeenInView, hasBeenSeen, onSeen, skill.key]);

	const isActive = hasBeenSeen || (allowInViewActivation && hasBeenInView);

	return (
		<Dialog>
			<DialogTrigger
				render={
					<button
						data-skill-card
						type="button"
						className={cn(
							"group relative w-full h-24 rounded-lg border p-4 text-left transition-colors",
							"hover:bg-muted/20",
							FOCUS_RING,
						)}
						ref={setRef}
						aria-label={`Open details for ${skill.name}`}
					/>
				}
			>
				<ArrowUpRight
					aria-hidden="true"
					className={cn(
						"pointer-events-none absolute right-3 top-3 size-4",
						"text-muted-foreground/70 transition-colors",
						"group-hover:text-foreground/80",
						"group-focus-visible:text-foreground/80",
					)}
				/>

				<div className="flex items-center justify-between gap-2 pr-6">
					<div className="min-w-0 truncate font-medium text-foreground">
						{skill.name}
					</div>
					<div className="shrink-0 text-xs tabular-nums text-muted-foreground">
						Lvl {skill.level}
					</div>
				</div>

				<div className="mt-4">
					<SkillSliceBar
						percent={skill.percent}
						active={isActive}
						kind={skill.kind}
						totalBars={barCount}
						thick={thickBars}
					/>
				</div>
			</DialogTrigger>

			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{skill.name}</DialogTitle>
					<DialogDescription>
						{skill.kind} · Lvl {skill.level} · {Math.round(skill.percent)}%
					</DialogDescription>
				</DialogHeader>

				<div className="max-h-[70dvh] space-y-4 overflow-y-auto px-4 pb-4 text-muted-foreground">
					<p>{skill.summary}</p>
					<div className="space-y-2">
						{skill.details.map((line) => (
							<p key={line}>{line}</p>
						))}
					</div>
					{skill.isLive ? (
						<p className="text-xs">Live score pulled from GitHub.</p>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export function SkillHighlights({ className }: { className?: string }) {
	const viewportHeight = useViewportHeight();
	const isDesktop = useMediaQuery("(min-width: 769px)");
	const isLt320 = useMediaQuery("(max-width: 319px)");
	const isLt425 = useMediaQuery("(max-width: 424px)");
	const isLt768 = useMediaQuery("(max-width: 767px)");

	const barCount = React.useMemo(() => {
		if (isLt320) return 20;
		if (isLt425) return 30;
		if (isLt768) return 45;
		return 50;
	}, [isLt320, isLt425, isLt768]);
	const thickBars = isLt425;

	const gridConfig = React.useMemo(
		() =>
			isDesktop
				? { maxPageSize: 12, cardsPerRow: 2 }
				: { maxPageSize: 6, cardsPerRow: 1 },
		[isDesktop],
	);
	const { maxPageSize, cardsPerRow } = gridConfig;

	const [apiSkills, setApiSkills] = React.useState<Record<string, ApiSkill>>(
		{},
	);
	const [apiLanguages, setApiLanguages] = React.useState<ApiLanguage[]>([]);

	React.useEffect(() => {
		const controller = new AbortController();
		let cancelled = false;

		fetch("/api/github/skills", { signal: controller.signal })
			.then(async (res) => {
				if (!res.ok) return null;
				return (await res.json()) as {
					skills?: Array<{
						key?: string;
						percent?: number;
						repoCount?: number;
					}>;
					languages?: Array<{
						key?: string;
						name?: string;
						percent?: number;
						repoCount?: number;
					}>;
				} | null;
			})
			.then((data) => {
				if (cancelled) return;

				const nextSkills: Record<string, ApiSkill> = {};
				for (const s of data?.skills ?? []) {
					if (!s?.key) continue;
					if (typeof s.percent !== "number") continue;
					if (typeof s.repoCount !== "number") continue;
					nextSkills[s.key] = {
						key: s.key,
						percent: s.percent,
						repoCount: s.repoCount,
					};
				}

				const nextLanguages: ApiLanguage[] = [];
				for (const l of data?.languages ?? []) {
					if (!l?.key || !l.name) continue;
					if (typeof l.percent !== "number") continue;
					if (typeof l.repoCount !== "number") continue;
					nextLanguages.push({
						key: l.key,
						name: l.name,
						percent: l.percent,
						repoCount: l.repoCount,
					});
				}

				setApiSkills(nextSkills);
				setApiLanguages(nextLanguages);
			})
			.catch(() => {
				// Silent fallback to defaults.
			});

		return () => {
			cancelled = true;
			controller.abort();
		};
	}, []);

	const skills: RenderedSkill[] = React.useMemo(() => {
		const languageByCanonicalName = new Map(
			apiLanguages.map((l) => [canonicalSkillName(l.name), l] as const),
		);
		const dockerAlias = languageByCanonicalName.get("docker");

		const base: RenderedSkill[] = highlightSkills.map((skill) => {
			const kind = getSkillKind(skill);
			const apiSkill = apiSkills[skill.key];
			const apiLanguage =
				kind === "Language"
					? languageByCanonicalName.get(canonicalSkillName(skill.name))
					: undefined;
			const apiAlias = skill.key === "docker" ? dockerAlias : undefined;

			const livePercent =
				apiLanguage?.percent ?? apiAlias?.percent ?? apiSkill?.percent;

			// Default behavior:
			// - everything starts at Lvl 0 / 50%
			// - if GitHub score reaches Lvl 1 (20%+), reflect live
			const hasLiveValue = typeof livePercent === "number";
			const shouldUseLive =
				hasLiveValue && safePercent(livePercent) >= LIVE_SWITCH_PERCENT;
			const percent = shouldUseLive
				? safePercent(livePercent)
				: DEFAULT_BASELINE_PERCENT;
			const level = shouldUseLive ? levelFromPercent(livePercent) : 0;

			return {
				...skill,
				percent,
				kind,
				level,
				isLive: shouldUseLive,
			};
		});

		const seenCanonicalNames = new Set(
			base.map((s) => canonicalSkillName(s.name)),
		);
		const seenKeys = new Set(base.map((s) => s.key));

		const languages: RenderedSkill[] = apiLanguages
			.filter((lang) => !seenCanonicalNames.has(canonicalSkillName(lang.name)))
			.filter((lang) => !seenKeys.has(lang.key))
			.map((lang) => {
				const percent = safePercent(lang.percent);
				return {
					key: lang.key,
					name: lang.name,
					category: "Language",
					percent,
					summary: "Detected automatically from your GitHub repos.",
					details: [
						`Mentioned in ${lang.repoCount} repo${lang.repoCount === 1 ? "" : "s"}.`,
					],
					kind: "Language",
					level: levelFromPercent(percent),
					isLive: true,
				};
			});

		return [...base, ...languages];
	}, [apiLanguages, apiSkills]);

	const [autoPageSize, setAutoPageSize] = React.useState<number | null>(null);
	const pageSize = autoPageSize ?? maxPageSize;
	const totalPages = Math.max(1, Math.ceil(skills.length / pageSize));
	const pageTransitionMs = 250;

	const [page, setPage] = React.useState(0);
	const [direction, setDirection] = React.useState<1 | -1>(1);
	const [seenKeys, setSeenKeys] = React.useState<Record<string, true>>({});
	const [isPaginating, setIsPaginating] = React.useState(false);
	const gridFrameRef = React.useRef<HTMLDivElement | null>(null);
	const gridRef = React.useRef<HTMLDivElement | null>(null);
	const computePageSizeRef = React.useRef<(() => void) | null>(null);

	React.useEffect(() => {
		setPage((current) => Math.min(current, totalPages - 1));
	}, [totalPages]);

	React.useLayoutEffect(() => {
		const frame = gridFrameRef.current;
		if (!frame) return;
		const section = frame.closest("section");
		let rafId: number | null = null;

		const compute = () => {
			if (rafId !== null) return;
			rafId = window.requestAnimationFrame(() => {
				rafId = null;
				const availableHeight = Math.max(
					0,
					frame.getBoundingClientRect().height,
				);

				const grid = gridRef.current;
				const firstCard = grid?.querySelector<HTMLElement>("[data-skill-card]");
				const cardHeight = firstCard?.getBoundingClientRect().height ?? 96;
				const computedRowGap = grid
					? Number.parseFloat(window.getComputedStyle(grid).rowGap || "0")
					: 12;
				const rowGap =
					Number.isFinite(computedRowGap) && computedRowGap > 0
						? computedRowGap
						: 12;

				const rowsFit = Math.max(
					1,
					Math.floor((availableHeight + rowGap) / (cardHeight + rowGap)),
				);
				const nextPageSize = Math.max(
					cardsPerRow,
					Math.min(maxPageSize, rowsFit * cardsPerRow),
				);

				setAutoPageSize((current) =>
					current === nextPageSize ? current : nextPageSize,
				);
			});
		};

		compute();
		computePageSizeRef.current = compute;
		window.addEventListener("resize", compute, { passive: true });

		let resizeObserver: ResizeObserver | null = null;
		if (typeof ResizeObserver !== "undefined") {
			resizeObserver = new ResizeObserver(() => compute());
			if (section) resizeObserver.observe(section);
			resizeObserver.observe(frame);
		}

		return () => {
			computePageSizeRef.current = null;
			window.removeEventListener("resize", compute);
			resizeObserver?.disconnect();
			if (rafId !== null) window.cancelAnimationFrame(rafId);
		};
	}, [cardsPerRow, maxPageSize]);

	React.useEffect(() => {
		computePageSizeRef.current?.();
	}, [isDesktop, page, pageSize, viewportHeight]);

	const pageSkills = React.useMemo(() => {
		const start = page * pageSize;
		return skills.slice(start, start + pageSize);
	}, [page, pageSize, skills]);

	const placeholderCount = Math.max(0, pageSize - pageSkills.length);

	const handleSeen = React.useCallback((key: string) => {
		setSeenKeys((current) =>
			current[key] ? current : { ...current, [key]: true },
		);
	}, []);

	const paginateTo = React.useCallback(
		(nextPage: number) => {
			const clamped = Math.max(0, Math.min(totalPages - 1, nextPage));
			if (clamped === page) return;
			setDirection(clamped > page ? 1 : -1);
			setIsPaginating(true);
			setPage(clamped);

			window.setTimeout(() => {
				setIsPaginating(false);
			}, pageTransitionMs + 30);
		},
		[page, pageTransitionMs, totalPages],
	);

	return (
		<div className={cn("flex h-full min-h-0 w-full flex-col", className)}>
			<div
				className="relative min-h-0 flex-1 overflow-hidden"
				ref={gridFrameRef}
			>
				<AnimatePresence initial={false} custom={direction} mode="wait">
					<motion.div
						key={`${page}-${pageSize}`}
						ref={gridRef}
						custom={direction}
						initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
						transition={{
							type: "tween",
							duration: pageTransitionMs / 1000,
							ease: "easeOut",
						}}
						className={cn(
							"grid gap-3",
							"grid-cols-1",
							"min-[769px]:grid-cols-2",
						)}
					>
						{pageSkills.map((skill) => (
							<SkillHighlightItem
								key={skill.key}
								skill={skill}
								hasBeenSeen={Boolean(seenKeys[skill.key])}
								onSeen={handleSeen}
								allowInViewActivation={!isPaginating}
								barCount={barCount}
								thickBars={thickBars}
							/>
						))}

						{Array.from({ length: placeholderCount }).map((_, i) => (
							<div
								key={`placeholder-${page}-${pageSize}-${i}`}
								aria-hidden="true"
								className={cn(
									"h-24 rounded-lg border p-4",
									"pointer-events-none select-none opacity-0",
								)}
							/>
						))}
					</motion.div>
				</AnimatePresence>
			</div>

			<div
				className={cn(
					"mt-3 flex shrink-0 items-center justify-center gap-2",
					totalPages <= 1 && "pointer-events-none opacity-0",
				)}
			>
				{totalPages > 1 ? (
					<>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => paginateTo(page - 1)}
							disabled={page === 0}
							aria-label="Previous skills"
						>
							<ChevronLeft />
						</Button>

						<span className="min-w-14 text-center text-xs tabular-nums text-muted-foreground">
							{page + 1} / {totalPages}
						</span>

						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => paginateTo(page + 1)}
							disabled={page >= totalPages - 1}
							aria-label="Next skills"
						>
							<ChevronRight />
						</Button>
					</>
				) : null}
			</div>
		</div>
	);
}
