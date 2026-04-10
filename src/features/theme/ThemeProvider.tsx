"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/*
	ThemeProvider
	-------------
	Thin wrapper around `next-themes` so the rest of the app can stay clean.

	Key behaviors we enable where used (see `app/layout.tsx`):
	- `attribute="class"`: toggles `dark` class on <html>
	- `defaultTheme="system"`: respects OS preference on first load
	- persistence: next-themes stores preference in localStorage
*/

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
