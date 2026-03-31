"use client";

import * as React from "react";

import { WeatherEffectsProvider } from "@/components/site/weather-effects/WeatherEffectsProvider";
import { WeatherEffectsBackground } from "@/components/site/weather-effects/WeatherEffectsBackground";

/**
 * WeatherEffects
 * -------------
 * Convenience wrapper used by the app shell.
 *
 * It mounts:
 * - WeatherEffectsProvider (localStorage-backed enabled state)
 * - WeatherEffectsBackground (the fixed, behind-content animation layer)
 */
export function WeatherEffects({ children }: { children: React.ReactNode }) {
	return (
		<WeatherEffectsProvider>
			<WeatherEffectsBackground />
			{children}
		</WeatherEffectsProvider>
	);
}
