// Centralized Tailwind class "clusters" used across multiple components.
// Keep these as plain strings so they compose cleanly with `cn()` / `twMerge`.

export const FOCUS_RING =
	"focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/10";

export const HOVER_LIFT_RING =
	"transition-transform hover:-translate-y-0.5 hover:scale-[1.02] hover:ring-4 hover:ring-ring/10 motion-reduce:transform-none";
