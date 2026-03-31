"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

/*
	AboutReadMoreDialog
	-------------------
	Uncontrolled dialog (internal open state) used on the homepage.

	Implementation detail:
	- Base UI's DialogTrigger supports a `render` prop, letting us provide a styled
	  Button primitive while keeping the trigger semantics correct.
*/

export function AboutReadMoreDialog() {
	return (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" size="sm" />}>
				Read more
			</DialogTrigger>
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
