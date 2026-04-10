export function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

export function clamp01(value: number) {
	return clamp(value, 0, 1);
}

export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}
