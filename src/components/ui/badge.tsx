import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
  Badge styling philosophy
  ------------------------
  Badges are small, high-signal UI labels (status, stack tags, etc.).

  Key styling goals:
  - Consistent sizing and typography so they line up nicely in grids.
  - Token-based colors (primary/secondary/muted/etc.) so they adapt to light/dark.
  - Optional icon support (padding adjusts when an icon is present via data attrs).
  - Accessible focus styles for cases where the badge is rendered as a link.
*/

const badgeVariants = cva(
	// Base badge layout + interactions.
	"group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
	{
		variants: {
			variant: {
				// High-emphasis pill.
				default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
				secondary:
					// Lower-emphasis pill for metadata.
					"bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
				destructive:
					// Error status. Softer fill with stronger red ring when focused.
					"bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
				outline:
					// Neutral chip (border only) that works well for tech stack tags.
					"border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
				ghost:
					// Minimal styling; relies on hover.
					"hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
				// Inline text badge (rare, but useful for subtle links).
				link: "text-primary underline-offset-4 hover:underline",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant = "default",
	render,
	...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	// Base UI's `useRender` lets the badge be rendered as different elements
	// (span by default, but can render as link/button/etc. when needed).
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(badgeVariants({ variant }), className),
			},
			props,
		),
		render,
		state: {
			slot: "badge",
			variant,
		},
	});
}

export { Badge, badgeVariants };
