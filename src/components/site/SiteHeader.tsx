import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";

import { navItems } from "@/components/site/navigation";

/**
 * SiteHeader
 * -----------
 * Left-side navigation rail.
 *
 * Performance notes:
 * - This component is intentionally a Server Component (no "use client").
 * - It only renders links + icons; there is no client state.
 * - It imports `buttonVariants` from the server-safe variants module to avoid
 *   pulling the client-only Button implementation into the server bundle.
 */
export function SiteHeader() {
	return (
		<aside className="fixed inset-y-0 left-0 z-50 hidden w-16 flex-col border-r bg-background/80 backdrop-blur transition-colors duration-300 supports-backdrop-filter:bg-background/60 motion-reduce:transition-none lg:flex">
			<div className="flex flex-col items-center gap-2 px-2 py-4">
				<Link
					href="/"
					className={
						buttonVariants({ variant: "ghost", size: "icon" }) + " rounded-lg"
					}
					aria-label="Home"
				>
					<span className="text-sm font-semibold tracking-tight">SA</span>
					<span className="sr-only">Home</span>
				</Link>
			</div>

			<nav className="flex flex-1 flex-col items-center justify-center gap-12 py-2">
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
							aria-label={item.label}
						>
							<Icon className="size-5.5" />
							<span className="sr-only">{item.label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="px-2 py-4" />
		</aside>
	);
}
