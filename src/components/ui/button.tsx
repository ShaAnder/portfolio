"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";

/*
  Button styling philosophy
  -------------------------
  This is a shadcn-style Button:
  - The look is driven by design tokens (bg-background, text-foreground, border-border, ring-ring, etc.)
    which ultimately come from CSS variables in `globals.css`.
  - `cva` gives us a single source of truth for variants + sizes.
  - We include careful focus styles (ring + border) and small interaction affordances (active translate).
	
  Note: the long "base" class string is intentionally comprehensive so every button variant inherits
  consistent hit area, typography, and accessibility behaviors.
*/

function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	// `ButtonPrimitive` gives us correct button semantics + Base UI behavior;
	// `buttonVariants` provides the styling contract.
	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
