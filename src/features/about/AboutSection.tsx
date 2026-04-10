"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useMediaQuery, useViewportHeight } from "@/lib/hooks/responsive";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button-variants";

const ABOUT_PARAGRAPHS = [
	"I’m Shaun, a junior full stack developer based in Ireland, currently looking for remote or hybrid roles across Ireland and the UK.",
	"I’ve always loved building things. That started with learning to solder when I was younger and turned into a long-running interest in IT, which naturally led me into software development.",
	"I’m most at home with React, Next.js, and TypeScript, and I’m comfortable working end-to-end with Django and Supabase. I’m also gaining hands-on experience with Salesforce (Apex + LWC).",
	"I enjoy building production-style web apps where the experience feels calm and intentional: clean UI, accessible patterns, and code that’s straightforward to maintain.",
	"I’m the kind of developer who cares about the “last 10%” too: responsive layout, performance, and the small interactions that make a product feel polished.",
	"This portfolio showcases current industry knowledge, portfolio pieces, freelance work as well as experimental projects. Please browse until your heart is content.",
];

export function AboutSection({ className }: { className?: string }) {
	// Used as a reactive "tick" for recalculating overflow when the visual viewport changes
	// (e.g. mobile address bar collapsing/expanding).
	const viewportHeight = useViewportHeight();
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const isTallViewport = viewportHeight >= 820;
	const contentRef = React.useRef<HTMLDivElement | null>(null);
	const [isOverflowing, setIsOverflowing] = React.useState(false);
	const [textBlockHeight, setTextBlockHeight] = React.useState<number | null>(
		null,
	);
	const bodyTextSizeClass =
		isDesktop || isTallViewport ? "text-base" : "text-sm";

	React.useLayoutEffect(() => {
		const node = contentRef.current;
		if (!node) return;

		const compute = () => {
			setIsOverflowing(node.scrollHeight > node.clientHeight + 1);
			if (isDesktop) {
				setTextBlockHeight(Math.round(node.getBoundingClientRect().height));
			} else {
				setTextBlockHeight(null);
			}
		};

		compute();
		let observer: ResizeObserver | null = null;
		if (typeof ResizeObserver !== "undefined") {
			observer = new ResizeObserver(() => compute());
			observer.observe(node);
		}

		return () => observer?.disconnect();
	}, [viewportHeight, isDesktop, bodyTextSizeClass]);

	return (
		<div
			className={cn(
				"flex h-full min-h-0 flex-col",
				"lg:flex-row lg:items-start lg:gap-10",
				className,
			)}
		>
			{/* Large-screen image column (image on the left, opposite the Hero layout). */}
			<div className="hidden lg:block">
				<div
					className="relative w-[min(22rem,28vw)] overflow-hidden rounded-xl border border-border bg-card lg:h-72"
					style={
						textBlockHeight ? { height: `${textBlockHeight}px` } : undefined
					}
				>
					<Image
						src="/images/about.jpg"
						alt="About Shaun"
						fill
						className="object-cover"
						sizes="(min-width: 1280px) 352px, (min-width: 1024px) 28vw"
					/>
				</div>
			</div>

			<div className="flex h-full min-h-0 flex-1 flex-col lg:h-auto">
				<div
					ref={contentRef}
					className={cn(
						"relative max-w-3xl flex-1 min-h-0 space-y-4 text-muted-foreground leading-relaxed",
						bodyTextSizeClass,
						"lg:flex-none lg:min-h-fit",
						"overflow-hidden",
					)}
				>
					{ABOUT_PARAGRAPHS.map((text) => (
						<p key={text}>{text}</p>
					))}

					{isOverflowing ? (
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-b from-transparent to-background"
						/>
					) : null}
				</div>

				{isOverflowing ? (
					<div className="flex justify-end pt-3">
						<Dialog>
							<DialogTrigger
								render={
									<button
										type="button"
										className={cn(
											buttonVariants({ variant: "outline", size: "sm" }),
											"rounded-full",
										)}
									/>
								}
							>
								Read more
							</DialogTrigger>

							<DialogContent className="max-w-3xl">
								<DialogHeader>
									<DialogTitle>About</DialogTitle>
								</DialogHeader>

								<div
									className={cn(
										"max-h-[70dvh] space-y-4 overflow-y-auto px-4 pb-4 text-muted-foreground leading-relaxed",
										bodyTextSizeClass,
									)}
								>
									{ABOUT_PARAGRAPHS.map((text) => (
										<p key={text}>{text}</p>
									))}

									<div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-card">
										<Image
											src="/images/about.jpg"
											alt="About Shaun"
											fill
											className="object-cover"
											sizes="(min-width: 1024px) 768px, 90vw"
										/>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				) : null}

				{/* Tablet-only image at the bottom (cropped). */}
				<div className="hidden md:block lg:hidden">
					<div className="relative mt-4 h-64 w-full shrink-0 overflow-hidden rounded-xl border border-border bg-card">
						<Image
							src="/images/about.jpg"
							alt="About Shaun"
							fill
							className="object-cover object-[50%_40%]"
							sizes="(min-width: 768px) 100vw, 0vw"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
