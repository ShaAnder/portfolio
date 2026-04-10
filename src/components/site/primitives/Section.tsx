import { cn } from "@/lib/utils";
import { BackdropTitle } from "@/components/site/primitives/BackdropTitle";

/*
	Section component
	-----------------
	This is a reusable layout wrapper for the homepage sections.

	Styling choices:
	- `scroll-mt-4` for a small offset so anchors don't kiss the top edge.
	- `py-12 md:py-16` for comfortable vertical rhythm that scales with screen size.
	- Title uses tracking-tight + a responsive font size for a modern feel.
*/

type SectionProps = {
	id?: string;
	title: string;
	subtitle?: string;
	className?: string;
	children: React.ReactNode;
};

export function Section({
	id,
	title,
	subtitle,
	className,
	children,
}: SectionProps) {
	return (
		<section
			id={id}
			className={cn(
				"relative scroll-mt-4 flex min-h-dvh snap-start snap-always flex-col pt-10 pb-12 md:pt-12 md:pb-14",
				className,
			)}
		>
			<div className="shrink-0 space-y-1 pt-2 pb-4 text-center md:space-y-1.5 md:pt-4 md:pb-4">
				<h2
					className={cn(
						"font-heading font-semibold leading-none lg:sr-only",
						"text-4xl sm:text-5xl md:text-6xl",
						"text-foreground tracking-[0.06em]",
						"[-webkit-text-stroke:0.75px_currentColor] sm:[-webkit-text-stroke:0.9px_currentColor] md:[-webkit-text-stroke:1px_currentColor]",
						"[-webkit-text-fill-color:transparent]",
					)}
				>
					{title}
				</h2>
				<BackdropTitle text={title} className="hidden lg:block" />
				{subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
			</div>
			<div className="flex min-h-0 flex-1 items-start md:items-center">
				<div className="w-full">{children}</div>
			</div>
		</section>
	);
}
