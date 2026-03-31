"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/*
	Dialog primitives (Base UI wrapper)
	---------------------------------
	This file adapts Base UI's Dialog primitives into the project's design system.

	Design goals:
	- Provide consistent structure: overlay, content, header/footer, title/description.
	- Use semantic tokens (border/background/foreground) for theme compatibility.
	- Keep animations CSS-only using Base UI data attributes.

	Performance notes:
	- These are thin wrappers; they intentionally do not hold any React state.
	- We use `data-slot` attributes to make styling/testing consistent.
*/

/** Root dialog component (controls open state and context). */
function Dialog({ ...props }: DialogPrimitive.Root.Props) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/** Element that toggles the dialog open/closed. */
function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/** Explicit close trigger (rarely used directly; most callers use the close button in content). */
function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/** Portal wrapper (renders overlay/content at the document root). */
function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * Fullscreen overlay/backdrop.
 * Kept subtle so it reads modern and doesn't crush contrast.
 */
function DialogOverlay({
	className,
	...props
}: DialogPrimitive.Backdrop.Props) {
	return (
		<DialogPrimitive.Backdrop
			data-slot="dialog-overlay"
			className={cn(
				"fixed inset-0 z-50 bg-black/20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	...props
}: DialogPrimitive.Popup.Props & {
	showCloseButton?: boolean;
}) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Popup
				data-slot="dialog-content"
				className={cn(
					"fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-border bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:scale-95 data-starting-style:scale-95",
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					/*
						Close affordance
						- Rendered as a Button to keep consistent hit-area and focus ring.
						- Uses Base UI's `render` prop to control the underlying element.
					*/
					<DialogPrimitive.Close
						data-slot="dialog-close"
						render={
							<Button
								variant="ghost"
								size="icon-sm"
								className="absolute top-3 right-3"
							/>
						}
					>
						<XIcon />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Popup>
		</DialogPortal>
	);
}

/** Standard title/description container with consistent padding. */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-header"
			className={cn("flex flex-col gap-0.5 p-4", className)}
			{...props}
		/>
	);
}

/** Footer row used for action buttons/links. */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"flex flex-col gap-2 p-4 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

/** Dialog heading text; uses the heading font token. */
function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn(
				"font-heading text-base font-medium text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

/** Dialog supporting text. */
function DialogDescription({
	className,
	...props
}: DialogPrimitive.Description.Props) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogTrigger,
	DialogClose,
	DialogPortal,
	DialogOverlay,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
};
