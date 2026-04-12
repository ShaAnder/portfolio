"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, FolderKanban, Mail } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGithub,
	faLinkedinIn,
	faXTwitter,
	faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import { cn } from "@/lib/utils";
import { HOVER_LIFT_RING } from "@/lib/uiClasses";
import {
	useMediaQuery,
	useViewportDensity,
	useViewportHeight,
} from "@/lib/hooks/responsive";
import { buttonVariants } from "@/components/ui/button-variants";

export function HeroSection() {
	const viewportHeight = useViewportHeight();
	const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
	const isTabletOrBelow = useMediaQuery("(max-width: 1023px)");
	const isLaptopUp = useMediaQuery("(min-width: 1024px)");
	const [showGoalMore, setShowGoalMore] = React.useState(false);

	const contentRef = React.useRef<HTMLDivElement | null>(null);
	const viewportDensity = useViewportDensity({
		enabled: isTabletOrBelow,
		viewportHeight,
		contentRef,
		// Tablet has a bit more room and tends to look better when we let it breathe.
		spaciousEnterPx: isTablet ? 260 : 220,
		spaciousExitPx: isTablet ? 150 : 120,
	});
	const density = isLaptopUp ? "spacious" : viewportDensity;
	const isCompact = isTabletOrBelow && density === "compact";

	const sectionStyle = React.useMemo(() => {
		if (!isTabletOrBelow || viewportHeight <= 0) return undefined;
		return {
			minHeight: `${viewportHeight}px`,
			height: `${viewportHeight}px`,
		} as const;
	}, [isTabletOrBelow, viewportHeight]);

	const sectionPyClassName = isLaptopUp
		? "py-24"
		: density === "compact"
			? "py-8"
			: density === "spacious"
				? "py-16"
				: "py-12";

	const sectionClassName = cn(
		"relative flex snap-start snap-always flex-col",
		"min-h-dvh",
		"justify-center",
		// Laptop+ stays consistent; mobile/tablet adapts based on real content fit.
		sectionPyClassName,
	);

	const mobileImageSizeByDensity = {
		mobile: {
			compact: "size-32",
			regular: "size-40",
			spacious: "size-44",
		},
		tablet: {
			compact: "size-44",
			regular: "size-52",
			spacious: "size-56",
		},
	} as const;

	const mobileImageSizeClassName = (
		isTablet ? mobileImageSizeByDensity.tablet : mobileImageSizeByDensity.mobile
	)[density];
	const imageSizeClassName = cn(
		mobileImageSizeClassName,
		"lg:size-[17rem] xl:size-80 2xl:size-[26rem]",
	);

	const spacingByDensity = {
		compact: {
			bodyTextMt: "mt-4",
			statusTextMt: "mt-6",
			ctaRowMt: "mt-8",
			socialsMt: "mt-4",
			ctaGap: "gap-2",
		},
		regular: {
			bodyTextMt: "mt-6",
			statusTextMt: "mt-8",
			ctaRowMt: "mt-12",
			socialsMt: "mt-6",
			ctaGap: "gap-3 lg:gap-4",
		},
		spacious: {
			bodyTextMt: "mt-7",
			statusTextMt: "mt-9",
			ctaRowMt: "mt-14",
			socialsMt: "mt-7",
			ctaGap: "gap-3 lg:gap-4",
		},
	} as const;

	const { bodyTextMt, statusTextMt, ctaRowMt, socialsMt, ctaGap } =
		spacingByDensity[density];
	const ctaContainerClassName = cn(
		ctaRowMt,
		// Always: 2x2 CTA grid.
		"grid w-full max-w-md grid-cols-2 2xl:max-w-lg",
		ctaGap,
		"mx-auto lg:mx-0",
	);
	const ctaItemClassName = "w-full justify-center";
	const ctaButtonSizeClassName =
		density === "spacious"
			? "h-11 px-5 text-base"
			: density === "compact"
				? "h-9 px-3 text-sm"
				: "h-10 px-4 text-base";
	const ctaButtonClassName = cn(
		ctaButtonSizeClassName,
		"rounded-full",
		HOVER_LIFT_RING,
	);

	const socialButtonClassName =
		"size-11 rounded-full! border border-border! transition-transform hover:-translate-y-0.5 hover:scale-[1.04] hover:ring-4 hover:ring-ring/10 motion-reduce:transform-none";
	const socialIconClassName = "size-5! md:size-6!";

	return (
		<section id="home-hero" className={sectionClassName} style={sectionStyle}>
			<div className="relative z-10 mx-auto w-full max-w-6xl lg:px-10 xl:max-w-7xl 2xl:max-w-none 2xl:px-20">
				<div
					ref={contentRef}
					className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14 2xl:gap-24"
				>
					<div className="order-1 flex w-full justify-center lg:order-2 lg:w-auto">
						<div
							className={cn(
								"relative mx-auto rounded-full",
								imageSizeClassName,
							)}
						>
							<div
								aria-hidden="true"
								className="absolute -inset-3 rounded-full bg-black/27 blur-xl transition-colors duration-700 dark:bg-white/13 lg:bg-black/30 lg:dark:bg-white/15"
							/>

							<div className="relative size-full overflow-hidden rounded-full border border-border">
								<Image
									src="/images/profile.jpg"
									alt="Shaun Anderton"
									fill
									priority
									className="object-cover object-[50%_10%] scale-[1.12]"
									sizes="(min-width: 1280px) 384px, (min-width: 1024px) 320px, (min-width: 769px) 256px, 160px"
								/>
							</div>
						</div>
					</div>

					<div className="order-2 flex w-full max-w-2xl flex-col items-center text-center lg:order-1 lg:items-start lg:text-left 2xl:max-w-3xl">
						<div className="space-y-3 md:space-y-4">
							<h1 className="text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-5xl md:text-6xl 2xl:text-7xl">
								Hi, I&apos;m{" "}
								<span className="bg-linear-to-r from-destructive to-sidebar-primary bg-clip-text text-transparent">
									Shaun
								</span>
							</h1>

							<h2 className="text-balance text-2xl font-medium leading-[1.15] tracking-tight text-muted-foreground sm:text-3xl md:text-4xl 2xl:text-5xl">
								Junior Full Stack Developer
							</h2>
						</div>

						<p
							className={cn(
								bodyTextMt,
								"max-w-xl text-pretty text-base text-muted-foreground md:text-lg lg:text-base xl:text-lg 2xl:max-w-2xl 2xl:text-xl",
							)}
						>
							{isCompact && !showGoalMore ? (
								<>
									My goal is to build sustainable, scalable web experiences that
									feel fast and effortless.{" "}
									<button
										type="button"
										className="font-medium underline underline-offset-4 hover:text-foreground"
										onClick={() => setShowGoalMore(true)}
									>
										Read more
									</button>
								</>
							) : (
								<>
									My goal is to build sustainable, scalable, and clean web
									experiences that feel fast, distinctive, and effortless to
									use.
								</>
							)}
						</p>

						<p
							className={cn(
								statusTextMt,
								"font-semibold leading-snug tracking-tight text-foreground",
							)}
						>
							Open to UK &amp; Ireland roles (remote or hybrid).
						</p>

						<div className={ctaContainerClassName}>
							<a
								data-icon="inline-start"
								className={buttonVariants({
									variant: "outline",
									size: "lg",
									className: cn(ctaButtonClassName, ctaItemClassName),
								})}
								href="#projects"
							>
								<FolderKanban className="size-4" />
								View projects
							</a>

							<a
								className={buttonVariants({
									variant: "outline",
									size: "lg",
									className: cn(ctaButtonClassName, ctaItemClassName),
								})}
								href="#testimonials"
							>
								Testimonials
							</a>

							<a
								data-icon="inline-start"
								className={buttonVariants({
									variant: "outline",
									size: "lg",
									className: cn(ctaButtonClassName, ctaItemClassName),
								})}
								href="/ShaunAndertonCV.pdf"
								target="_blank"
								rel="noreferrer"
							>
								<Download className="size-4" />
								Download CV
							</a>

							<a
								data-icon="inline-start"
								className={buttonVariants({
									variant: "outline",
									size: "lg",
									className: cn(ctaButtonClassName, ctaItemClassName),
								})}
								href="#contact"
							>
								<Mail className="size-4" />
								Get in touch
							</a>
						</div>

						<div
							className={cn(
								socialsMt,
								"flex flex-wrap items-center justify-center gap-4 lg:justify-start",
							)}
						>
							<Link
								className={buttonVariants({
									variant: "ghost",
									size: "icon-lg",
									className: socialButtonClassName,
								})}
								href="/"
								aria-label="GitHub"
							>
								<FontAwesomeIcon
									icon={faGithub}
									className={socialIconClassName}
								/>
							</Link>
							<Link
								className={buttonVariants({
									variant: "ghost",
									size: "icon-lg",
									className: socialButtonClassName,
								})}
								href="/"
								aria-label="LinkedIn"
							>
								<FontAwesomeIcon
									icon={faLinkedinIn}
									className={socialIconClassName}
								/>
							</Link>
							<Link
								className={buttonVariants({
									variant: "ghost",
									size: "icon-lg",
									className: socialButtonClassName,
								})}
								href="/"
								aria-label="Twitter"
							>
								<FontAwesomeIcon
									icon={faXTwitter}
									className={socialIconClassName}
								/>
							</Link>
							<Link
								className={buttonVariants({
									variant: "ghost",
									size: "icon-lg",
									className: socialButtonClassName,
								})}
								href="/"
								aria-label="YouTube"
							>
								<FontAwesomeIcon
									icon={faYoutube}
									className={socialIconClassName}
								/>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
