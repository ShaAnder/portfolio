"use client";

import * as React from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SkillsLegendDialog({ className }: { className?: string }) {
	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button
						variant="ghost"
						size="icon-sm"
						className={className}
						aria-label="How the skill bars work"
					/>
				}
			>
				?
			</DialogTrigger>

			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Skills: colors + scoring</DialogTitle>
					<DialogDescription>
						A quick legend for what the bars mean.
					</DialogDescription>
				</DialogHeader>

				<div className="max-h-[70dvh] space-y-4 overflow-y-auto px-4 pb-4 text-muted-foreground">
					<div className="space-y-2">
						<p className="text-foreground">Color legend</p>
						<ul className="list-disc space-y-1 pl-5">
							<li>
								<span className="bg-linear-to-r from-skill-blue-1 to-skill-blue-2 bg-clip-text font-medium text-transparent">
									Blue
								</span>
								: Language
							</li>
							<li>
								<span className="bg-linear-to-r from-skill-red-1 to-skill-red-2 bg-clip-text font-medium text-transparent">
									Red
								</span>
								: Framework
							</li>
							<li>
								<span className="bg-linear-to-r from-skill-yellow-1 to-skill-yellow-2 bg-clip-text font-medium text-transparent">
									Yellow
								</span>
								: Tool
							</li>
							<li>
								<span className="bg-linear-to-r from-skill-green-1 to-skill-green-2 bg-clip-text font-medium text-transparent">
									Green
								</span>
								: Platform / Ecosystem
							</li>
						</ul>
					</div>

					<div className="space-y-2">
						<p className="text-foreground">How scoring works</p>
						<p>
							Each bar is a blend of baseline experience (lightly weighted) and,
							more heavily, the amount of real project work across my repos. The
							more I build with something in actual projects, the more that
							skill fills.
						</p>
					</div>

					<div className="space-y-2">
						<p className="text-foreground">Level tiers</p>
						<p>
							Levels are milestone thresholds in knowledge and comfort with the
							tech. Early levels come faster, but each higher level typically
							takes longer to earn because it reflects deeper, repeated use.
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
