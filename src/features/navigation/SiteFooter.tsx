/*
	SiteFooter
	----------
	Simple, server-rendered site footer.

	Note:
	- `new Date().getFullYear()` is intentionally computed at render time.
	  In SSG contexts this becomes the build year; in SSR it stays current.
*/

export function SiteFooter() {
	return (
		<footer className="border-t">
			{/*
				Footer styling
				- `border-t` mirrors the header's border for visual balance.
				- Muted text keeps it present but not competing with content.
			*/}
			<div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-10 text-sm text-muted-foreground">
				<p>Built with Next.js, TypeScript, Tailwind, and shadcn/ui.</p>
				<p>© {new Date().getFullYear()} Shaun Anderton</p>
			</div>
		</footer>
	);
}
