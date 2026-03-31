"use client";

import * as React from "react";

const STORAGE_KEY = "portfolio.weatherEffects.enabled";
const LEGACY_STORAGE_KEY = "portfolio.fallingRain.enabled";

type WeatherEffectsContextValue = {
	enabled: boolean;
	setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
	mounted: boolean;
};

const WeatherEffectsContext =
	React.createContext<WeatherEffectsContextValue | null>(null);

/**
 * WeatherEffectsProvider
 * ---------------------
 * Client-side state + persistence for the background weather layer.
 *
 * Responsibilities:
 * - Persist `enabled` to localStorage.
 * - Provide a `mounted` flag so consumers can avoid hydration mismatches.
 * - Read a legacy key once for migration.
 *
 * Performance notes:
 * - We keep the context value memoized to avoid needless re-renders.
 * - Reads/writes are wrapped in try/catch to tolerate privacy modes.
 */
export function WeatherEffectsProvider({
	children,
	defaultEnabled = true,
}: {
	children: React.ReactNode;
	defaultEnabled?: boolean;
}) {
	const [enabled, setEnabled] = React.useState(defaultEnabled);
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw !== null) {
				setEnabled(raw === "true");
				return;
			}
			const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
			if (legacy !== null) {
				setEnabled(legacy === "true");
			}
		} catch {
			// Ignore storage read failures.
		}
	}, []);

	React.useEffect(() => {
		if (!mounted) return;
		try {
			window.localStorage.setItem(STORAGE_KEY, String(enabled));
		} catch {
			// Ignore storage write failures.
		}
	}, [enabled, mounted]);

	const value = React.useMemo<WeatherEffectsContextValue>(
		() => ({ enabled, setEnabled, mounted }),
		[enabled, mounted],
	);

	return (
		<WeatherEffectsContext.Provider value={value}>
			{children}
		</WeatherEffectsContext.Provider>
	);
}

/**
 * useWeatherEffects
 * ----------------
 * Accessor for WeatherEffectsProvider state.
 * Throws a clear error when used outside of the provider.
 */
export function useWeatherEffects() {
	const ctx = React.useContext(WeatherEffectsContext);
	if (!ctx) {
		throw new Error(
			"useWeatherEffects must be used within WeatherEffectsProvider",
		);
	}
	return ctx;
}
