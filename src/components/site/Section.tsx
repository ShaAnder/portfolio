import { cn } from "@/lib/utils";
import { BackdropTitle } from "@/components/site/BackdropTitle";

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
				"relative scroll-mt-4 flex min-h-dvh snap-start snap-always flex-col pt-6 pb-12 md:pt-8 md:pb-14",
				className,
			)}
		>
			<div className="shrink-0 pt-4 pb-2 md:pt-6 md:pb-2">
				<h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:sr-only">
					{title}
				</h2>
				<BackdropTitle text={title} className="hidden lg:block" />
				{subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
			</div>
			<div className="flex min-h-0 flex-1 items-center">
				<div className="w-full">{children}</div>
			</div>
		</section>
	);
}
