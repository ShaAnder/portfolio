import { cn } from "@/lib/utils";

type BackdropTitleProps = {
	text: string;
	className?: string;
};

/**
 * BackdropTitle
 * ------------
 * Large decorative section title used on desktop.
 *
 * Accessibility:
 * - Marked `aria-hidden` because it duplicates the real heading.
 */
export function BackdropTitle({ text, className }: BackdropTitleProps) {
	return (
		<div aria-hidden className={cn("select-none opacity-35", className)}>
			<div
				className={cn(
					"leading-none font-semibold uppercase text-foreground",
					"tracking-[0.08em]",
					"text-[clamp(3.375rem,9vw,7.5rem)]",
					"[-webkit-text-stroke:1.5px_currentColor]",
					"[-webkit-text-fill-color:transparent]",
				)}
			>
				{text}
			</div>
		</div>
	);
}
