/*
	weather-effects module
	----------------------
	Barrel exports to keep imports clean in app/layout and other callsites.

	This is the intended public API for the weather effects feature.
*/

export { WeatherEffects } from "@/components/site/weather-effects/WeatherEffects";
export { WeatherEffectsProvider } from "@/components/site/weather-effects/WeatherEffectsProvider";
export { WeatherEffectsBackground } from "@/components/site/weather-effects/WeatherEffectsBackground";
export { WeatherEffectsToggle } from "@/components/site/weather-effects/WeatherEffectsToggle";
export { useWeatherEffects } from "@/components/site/weather-effects/WeatherEffectsProvider";
