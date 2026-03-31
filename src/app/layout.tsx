import type { Metadata } from "next";
import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import {
	WeatherEffects,
	WeatherEffectsToggle,
} from "@/components/site/weather-effects";

/*
	RootLayout
	----------
	App shell for the entire site.

	Responsibilities:
	- Define document metadata.
	- Apply global styles (`globals.css`).
	- Mount ThemeProvider (client) and keep server markup stable.
	- Mount WeatherEffects overlay behind content.
	- Render persistent navigation (SiteHeader) and footer.

	Performance notes:
	- Keep the layout mostly server-rendered; client boundaries are limited to
	  ThemeProvider, theme toggle, and the weather effects feature.
*/

export const metadata: Metadata = {
	title: {
		default: "Shaun Anderton | Portfolio",
		template: "%s | Shaun Anderton",
	},
	description:
		"Junior full stack developer portfolio: React, Next.js, TypeScript, Django, Supabase, and Salesforce (Apex/LWC).",
};

config.autoAddCss = false;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className="scroll-smooth snap-y snap-mandatory motion-reduce:scroll-auto"
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
					// Keeps native controls (scrollbars/forms) aligned with the active theme.
					enableColorScheme
				>
					<WeatherEffects>
						<SiteHeader />

						<div className="fixed top-4 right-4 z-40 flex items-center gap-2">
							<ThemeToggle />
							<WeatherEffectsToggle />
						</div>

						<main className="relative z-10 mx-auto max-w-6xl px-4 pl-20">
							{children}
						</main>
						<div className="relative z-10">
							<SiteFooter />
						</div>
					</WeatherEffects>
				</ThemeProvider>
			</body>
		</html>
	);
}
