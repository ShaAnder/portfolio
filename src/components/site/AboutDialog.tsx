"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

/*
	AboutDialog
	----------
	Controlled ("open" prop) dialog version of the About content.

	This is used when a parent component owns the open/close state (e.g. a menu item).
*/

export function AboutDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>About</DialogTitle>
					<DialogDescription>
						Quick background and what I build.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 px-4 pb-4 text-muted-foreground">
					<p>
						Based in Ireland, targeting remote/hybrid junior roles across
						Ireland and the UK.
					</p>
					<p>
						This portfolio intentionally showcases only four new,
						production-style builds (no older betas).
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
