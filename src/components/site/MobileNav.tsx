"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { navItems } from "@/components/site/navigation";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function MobileNav() {
	const [open, setOpen] = React.useState(false);
	const [reveal, setReveal] = React.useState(false);
	const year = new Date().getFullYear();

	React.useEffect(() => {
		if (!open) {
			setReveal(false);
			return;
		}

		// Force a two-step state change so the text transition runs on open.
		setReveal(false);
		const id = requestAnimationFrame(() => setReveal(true));
		return () => cancelAnimationFrame(id);
	}, [open]);

	return (
		<div className="fixed top-4 left-4 z-50 lg:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					render={
						<Button
							variant="ghost"
							size="icon-lg"
							className="rounded-full border border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60"
							aria-label="Open navigation"
						>
							<Menu className="size-5.5" />
						</Button>
					}
				/>

				<SheetContent
					side="left"
					className="bg-background/95 p-0 data-[side=left]:w-2/3 data-[side=left]:sm:w-1/2 data-[side=left]:sm:max-w-[18rem]"
				>
					<div className="flex h-full flex-col">
						<div className="px-3 pt-5">
							<Link
								href="/#home-hero"
								onClick={() => setOpen(false)}
								className={cn(
									buttonVariants({ variant: "ghost", size: "lg" }),
									"w-full justify-start gap-3 rounded-xl px-3",
								)}
							>
								<span className="inline-flex size-10 items-center justify-center">
									<span className="text-sm font-semibold tracking-tight">
										SA
									</span>
								</span>
							</Link>
						</div>

						<div className="flex flex-1 items-center">
							<nav className="flex w-full flex-col justify-center gap-4 px-3">
								{navItems.map((item, index) => {
									const Icon = item.icon;

									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={() => setOpen(false)}
											className={cn(
												buttonVariants({ variant: "ghost", size: "lg" }),
												"h-12 w-full justify-start gap-4 rounded-xl px-3",
											)}
										>
											<span
												className={cn(
													"inline-flex size-10 items-center justify-center transition-[opacity,transform] duration-300 ease-out",
													reveal
														? "translate-x-0 opacity-100"
														: "-translate-x-2 opacity-0",
												)}
												style={{
													transitionDelay: reveal
														? `${120 + index * 70}ms`
														: "0ms",
												}}
											>
												<Icon className="size-6" />
											</span>

											<span
												className={cn(
													"overflow-hidden whitespace-nowrap text-base font-medium tracking-tight transition-[max-width,opacity,transform] duration-300 ease-out",
													reveal
														? "max-w-48 translate-x-0 opacity-100"
														: "max-w-0 -translate-x-2 opacity-0",
												)}
												style={{
													transitionDelay: reveal
														? `${320 + index * 110}ms`
														: "0ms",
												}}
											>
												{item.label}
											</span>
										</Link>
									);
								})}
							</nav>
						</div>

						<div className="px-4 pb-5 text-center text-xs text-muted-foreground">
							© {year} Shaun Anderton
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
