import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import { SiteHeader } from "@/features/navigation/SiteHeader";
import { MobileNav } from "@/features/navigation/MobileNav";
import { ScrollToTopButton } from "@/features/navigation/ScrollToTopButton";
import { ParticleNetworkBackground } from "@/features/particle-network/ParticleNetworkBackground";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { ThemeProvider } from "@/features/theme/ThemeProvider";

const fontSans = Manrope({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
	weight: ["300", "400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
	display: "swap",
	weight: ["400", "500", "600"],
});

/*
	RootLayout
	----------
	App shell for the entire site.

	Responsibilities:
	- Define document metadata.
	- Apply global styles (`globals.css`).
	- Mount ThemeProvider (client) and keep server markup stable.
	- Render persistent navigation (SiteHeader) and footer.

	Performance notes:
	- Keep the layout mostly server-rendered; client boundaries are limited to
	  ThemeProvider, theme toggle, and the particle network background.
*/

export const metadata: Metadata = {
	title: {
		default: "Shaun Anderton | Portfolio",
		template: "%s | Shaun Anderton",
	},
	description:
		"Junior full stack developer portfolio: React, Next.js, TypeScript, Django, Supabase, and PostgreSQL.",
};

config.autoAddCss = false;

const enableParticleNetwork = true;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${fontSans.variable} ${fontMono.variable} scroll-smooth snap-y snap-mandatory motion-reduce:scroll-auto`}
		>
			{/*
				`suppressHydrationWarning` is used because the theme class is applied client-side.
				We also add `transition-colors` so the theme change reads as an animation.
			*/}
			<body className="min-h-dvh overflow-x-clip bg-background text-foreground antialiased transition-colors duration-300 motion-reduce:transition-none">
				<ThemeProvider
					// next-themes will toggle a `dark` class on <html>.
					attribute="class"
					// Default to OS preference, but allow explicit user override.
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					// Keeps native controls (scrollbars/forms) aligned with the active theme.
					enableColorScheme
				>
					<div
						aria-hidden="true"
						className="pointer-events-none fixed inset-0 z-0"
					>
						<div className="absolute inset-0 bg-linear-to-b from-muted/25 via-background to-background" />
						<div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-muted/20 blur-3xl sm:top-20 sm:h-96 sm:w-96" />
						{enableParticleNetwork ? <ParticleNetworkBackground /> : null}
					</div>

					<div className="relative z-10">
						<SiteHeader />
						<MobileNav />

						<div className="fixed top-4 right-4 z-40 flex items-center gap-2">
							<ThemeToggle />
						</div>
						<ScrollToTopButton />

						<main className="mx-auto w-full max-w-6xl px-4 lg:pl-24 lg:pr-8 xl:max-w-7xl 2xl:max-w-screen-2xl 2xl:pl-28 2xl:pr-12">
							{children}
						</main>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
