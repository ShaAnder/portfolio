"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

/*
  Separator styling notes
  -----------------------
  A minimal divider that uses tokenized `bg-border` so it adapts to theme.
  Data attributes drive the correct dimension based on orientation:
  - horizontal: `h-px w-full`
  - vertical: `w-px self-stretch`
*/

function Separator({
	className,
	orientation = "horizontal",
	...props
}: SeparatorPrimitive.Props) {
	return (
		<SeparatorPrimitive
			data-slot="separator"
			orientation={orientation}
			className={cn(
				// `shrink-0` prevents collapsing inside flex layouts.
				"shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
				className,
			)}
			{...props}
		/>
	);
}

export { Separator };
