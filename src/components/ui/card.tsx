import * as React from "react";

import { cn } from "@/lib/utils";
/*
  Card styling notes
  ------------------
  Cards are used as "content containers" with a consistent surface:
  - `bg-card` / `text-card-foreground` keeps them theme-aware.
  - `ring-1 ring-foreground/10` gives a soft outline that reads modern
    (lighter than a full border in many contexts).
  - The `data-size` attribute allows a compact (`sm`) density mode without
    duplicating components.
	
  The various Card subcomponents are mostly spacing/typography helpers.
*/

function Card({
	className,
	size = "default",
	...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
	return (
		<div
			data-slot="card"
			data-size={size}
			className={cn(
				// Base surface + density rules (driven by data attributes).
				"group/card flex flex-col overflow-hidden rounded-xl bg-card text-sm text-card-foreground",
				"gap-4 py-4 ring-1 ring-foreground/10",
				"has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0",
				"data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0",
				"*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
				className,
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				// Grid header: supports optional action slot (right aligned) and description rows.
				"group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl",
				"px-4 group-data-[size=sm]/card:px-3",
				"has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
				"[.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				// Heading font + size scales down in compact cards.
				"font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
				className,
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				// Footer reads like a secondary surface (muted) and provides separation via border-t.
				"flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
};
