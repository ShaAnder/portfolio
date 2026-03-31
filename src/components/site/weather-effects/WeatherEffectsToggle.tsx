"use client";

import * as React from "react";
import { CloudRain } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWeatherEffects } from "@/components/site/weather-effects/WeatherEffectsProvider";

/**
 * WeatherEffectsToggle
 * -------------------
 * UI control that enables/disables the background weather animation.
 *
 * Hydration notes:
 * - We disable the button until `mounted` is true so localStorage-backed state
 *   can be read safely without hydration mismatch.
 *
 * Accessibility:
 * - Uses `aria-pressed` to communicate toggle state.
 */
export function WeatherEffectsToggle({ className }: { className?: string }) {
	const { enabled, setEnabled, mounted } = useWeatherEffects();
	const isEnabled = mounted && enabled;

	return (
		<Button
			variant="outline"
			size="icon-sm"
			aria-label={
				isEnabled
					? "Disable background animation"
					: "Enable background animation"
			}
			aria-pressed={isEnabled}
			disabled={!mounted}
			onClick={() => setEnabled((prev) => !prev)}
			className={cn(
				"relative w-12 justify-start overflow-hidden rounded-full border-border bg-background/60 p-0 transition-colors duration-300",
				"hover:bg-muted",
				"focus-visible:ring-3 focus-visible:ring-ring/50",
				className,
			)}
		>
			<span
				aria-hidden="true"
				className={cn(
					"absolute top-1 left-1 size-5 rounded-full bg-background transition-transform duration-300 ease-in-out",
					isEnabled && "translate-x-5",
				)}
			/>

			{/* OFF = greyed icon on left, ON = bright icon on right */}
			<CloudRain
				aria-hidden="true"
				className={cn(
					"absolute left-1.5 top-1.5 size-4 transition-all duration-300",
					isEnabled ? "opacity-0 scale-90" : "opacity-40 scale-100",
				)}
			/>
			<CloudRain
				aria-hidden="true"
				className={cn(
					"absolute right-1.5 top-1.5 size-4 transition-all duration-300",
					isEnabled ? "opacity-100 scale-100" : "opacity-0 scale-90",
				)}
			/>

			<span className="sr-only">
				{isEnabled ? "Animation enabled" : "Animation disabled"}
			</span>
		</Button>
	);
}
