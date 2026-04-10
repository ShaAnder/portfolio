import { clamp } from "@/lib/math";

export type ParticleNetworkTheme = "light" | "dark";

export type ParticleNetworkConfig = {
	/**
	 * Particle density: higher value = fewer particles.
	 * This is based on viewport area so it scales with screen size.
	 */
	areaPerParticle: number;
	minParticles: number;
	maxParticles: number;

	/** Speed in pixels per frame (roughly at 60fps). */
	speed: number;

	/**
	 * Connection distance is derived from the viewport, then clamped.
	 * Smaller distance means fewer lines and less noise.
	 */
	distanceScale: number;
	minDistance: number;
	maxDistance: number;

	maxConnectionsPerParticle: number;

	/** Visual settings */
	dotRadius: number;
	lineWidth: number;
	lineAlpha: number;
	dotAlpha: number;
};

export type Particle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
};

function randSigned() {
	return Math.random() - 0.5;
}

export function defaultParticleNetworkConfig(): ParticleNetworkConfig {
	return {
		areaPerParticle: 32000,
		minParticles: 20,
		maxParticles: 70,

		// Tuned to be noticeable but not "busy".
		speed: 0.68,

		distanceScale: 0.14,
		minDistance: 75,
		maxDistance: 130,

		maxConnectionsPerParticle: 3,

		// Dots are small on purpose; the overall layer opacity does the rest.
		// Requested: 1.5× larger particles.
		dotRadius: 2.7,
		lineWidth: 1.2,

		// These are per-theme (white or black), then alpha applied.
		lineAlpha: 0.1,
		dotAlpha: 0.2,
	};
}

export class ParticleNetworkEngine {
	private ctx: CanvasRenderingContext2D;
	private config: ParticleNetworkConfig;
	private baseDotRadius: number;
	private baseLineWidth: number;
	private theme: ParticleNetworkTheme = "light";
	private width = 1;
	private height = 1;
	private particles: Particle[] = [];
	private lineStyle = "rgba(0,0,0,0.10)";
	private dotStyle = "rgba(0,0,0,0.20)";

	constructor(ctx: CanvasRenderingContext2D, config: ParticleNetworkConfig) {
		this.ctx = ctx;
		this.config = config;
		this.baseDotRadius = config.dotRadius;
		this.baseLineWidth = config.lineWidth;
		this.updateColors();
	}

	/**
	 * Adjust visual size (dots + lines) without changing density, speed, or distances.
	 * Useful for making the network feel appropriately weighted on larger screens.
	 */
	setVisualScale(scale: number) {
		const clamped = clamp(scale, 0.85, 1.5);
		this.config.dotRadius = this.baseDotRadius * clamped;
		this.config.lineWidth = this.baseLineWidth * clamped;
	}

	setTheme(theme: ParticleNetworkTheme) {
		if (this.theme === theme) return;
		this.theme = theme;
		this.updateColors();
	}

	/**
	 * Call this when the canvas element changes size.
	 * The engine will recreate particles so density stays consistent.
	 */
	resize(width: number, height: number) {
		this.width = Math.max(1, Math.floor(width));
		this.height = Math.max(1, Math.floor(height));
		this.resetParticles();
	}

	/** Single animation step: move particles then redraw. */
	step() {
		for (const p of this.particles) {
			p.x += p.vx;
			p.y += p.vy;

			// Bounce off edges so movement feels like it explores the whole screen.
			if (p.x < 0) {
				p.x = 0;
				p.vx *= -1;
			} else if (p.x > this.width) {
				p.x = this.width;
				p.vx *= -1;
			}
			if (p.y < 0) {
				p.y = 0;
				p.vy *= -1;
			} else if (p.y > this.height) {
				p.y = this.height;
				p.vy *= -1;
			}
		}

		this.draw();
	}

	/** Redraw without moving (useful after theme changes). */
	draw() {
		const ctx = this.ctx;
		ctx.clearRect(0, 0, this.width, this.height);

		const maxDistance = clamp(
			Math.min(this.width, this.height) * this.config.distanceScale,
			this.config.minDistance,
			this.config.maxDistance,
		);
		const maxDistanceSq = maxDistance * maxDistance;

		// Lines: we only draw if particles are close enough.
		ctx.lineWidth = this.config.lineWidth;
		ctx.strokeStyle = this.lineStyle;
		for (let i = 0; i < this.particles.length; i++) {
			const a = this.particles[i];
			if (!a) continue;

			let connections = 0;
			for (let j = i + 1; j < this.particles.length; j++) {
				const b = this.particles[j];
				if (!b) continue;

				const dx = a.x - b.x;
				const dy = a.y - b.y;
				const distSq = dx * dx + dy * dy;
				if (distSq > maxDistanceSq) continue;

				const t = 1 - distSq / maxDistanceSq;
				ctx.globalAlpha = 0.75 * t;
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.stroke();

				connections += 1;
				if (connections >= this.config.maxConnectionsPerParticle) break;
			}
		}

		// Dots
		ctx.globalAlpha = 1;
		ctx.fillStyle = this.dotStyle;
		for (const p of this.particles) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, this.config.dotRadius, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	private updateColors() {
		// Explicit colors: white in dark mode, black in light mode.
		const base = this.theme === "dark" ? 255 : 0;

		// Light mode needs more contrast; otherwise the network gets lost on white.
		const lineAlpha =
			this.theme === "light"
				? Math.max(this.config.lineAlpha, 0.18)
				: this.config.lineAlpha;
		const dotAlpha =
			this.theme === "light"
				? Math.max(this.config.dotAlpha, 0.32)
				: this.config.dotAlpha;

		this.lineStyle = `rgba(${base}, ${base}, ${base}, ${lineAlpha})`;
		this.dotStyle = `rgba(${base}, ${base}, ${base}, ${dotAlpha})`;
	}

	private resetParticles() {
		const area = this.width * this.height;
		const count = clamp(
			Math.round(area / this.config.areaPerParticle),
			this.config.minParticles,
			this.config.maxParticles,
		);

		const speed = this.config.speed;
		this.particles = Array.from({ length: count }, () => ({
			x: Math.random() * this.width,
			y: Math.random() * this.height,
			vx: randSigned() * speed,
			vy: randSigned() * speed,
		}));
	}
}
