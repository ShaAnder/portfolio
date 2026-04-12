export type ProjectStatus = "planned" | "building" | "shipped";

/*
	Projects data model
	-------------------
	This file is the content source for:
	- the homepage Projects grid
	- the statically generated project detail pages (`/projects/[slug]`)

	Keeping it as typed data (instead of hard-coded in components) makes the UI
	consistent, easier to update, and easier to validate with TypeScript.
*/

export type ProjectLinks = {
	live?: string;
	github?: string;
	caseStudy?: string;
};

export type ProjectImages = {
	hero: string;
	gallery?: string[];
};

export type Project = {
	slug: string;
	name: string;
	tagline: string;
	description: string;
	stack: string[];
	features: string[];
	highlights: string[];
	status: ProjectStatus;
	links: ProjectLinks;
	images: ProjectImages;
};

export const projects: Project[] = [
	{
		slug: "jobtrackr",
		name: "JobTrackr",
		tagline: "Job application CRM with analytics and a clean pipeline workflow",
		description:
			"Track job applications through a pipeline, capture notes and follow-ups, and visualize your funnel.",
		stack: [
			"Next.js",
			"TypeScript",
			"Tailwind",
			"shadcn/ui",
			"Supabase",
			"PostgreSQL",
		],
		features: [
			"Auth + user dashboard",
			"Application pipeline (Applied → Interview → Offer)",
			"Notes, deadlines, and reminders",
			"Analytics (funnel + win rate)",
			"CSV export",
		],
		highlights: [
			"Pipeline UX designed for quick daily updates",
			"Clear data modeling and role-based access patterns",
		],
		status: "planned",
		links: {
			caseStudy: "/projects/jobtrackr",
		},
		images: {
			hero: "/projects/jobtrackr/hero.png",
		},
	},
	{
		slug: "fitforge",
		name: "FitForge",
		tagline: "Fitness + habit tracking with charts and calendar logging",
		description:
			"A polished, mobile-first fitness tracker to log workouts and habits, set goals, and visualize progress over time.",
		stack: [
			"Next.js",
			"TypeScript",
			"Tailwind",
			"shadcn/ui",
			"Supabase",
			"PostgreSQL",
		],
		features: [
			"Workout logging (sets/reps/weight)",
			"Habit streak calendar",
			"Progress charts",
			"Goals and weekly targets",
		],
		highlights: ["Frontend-heavy UI patterns: forms, calendar, charts"],
		status: "planned",
		links: {
			caseStudy: "/projects/fitforge",
		},
		images: {
			hero: "/projects/fitforge/hero.png",
		},
	},
	{
		slug: "shopswift",
		name: "ShopSwift",
		tagline: "Mini e-commerce with Django REST + Stripe checkout",
		description:
			"A small e-commerce store demonstrating a real backend: product management, orders, and a checkout flow using Stripe (test mode).",
		stack: [
			"Next.js",
			"TypeScript",
			"Tailwind",
			"shadcn/ui",
			"Django",
			"DRF",
			"PostgreSQL",
			"Stripe",
		],
		features: [
			"Product catalog with search + filters",
			"Cart + wishlist",
			"Stripe checkout (test mode)",
			"Order history",
			"Admin product management",
		],
		highlights: ["Backend-heavy focus: models, APIs, and integrations"],
		status: "planned",
		links: {
			caseStudy: "/projects/shopswift",
		},
		images: {
			hero: "/projects/shopswift/hero.png",
		},
	},
	{
		slug: "teamflow",
		name: "TeamFlow",
		tagline: "Realtime Kanban board with drag-and-drop collaboration",
		description:
			"A Trello-style board with real-time updates and smooth drag-and-drop interactions to demonstrate multi-user state synchronization.",
		stack: [
			"Next.js",
			"TypeScript",
			"Tailwind",
			"shadcn/ui",
			"Supabase Realtime",
			"PostgreSQL",
			"dnd-kit",
		],
		features: [
			"Boards, columns, and cards",
			"Drag-and-drop",
			"Realtime updates for collaborators",
			"Comments and due dates",
		],
		highlights: ["Realtime + optimistic UI patterns"],
		status: "planned",
		links: {
			caseStudy: "/projects/teamflow",
		},
		images: {
			hero: "/projects/teamflow/hero.png",
		},
	},
	{
		slug: "reactdiver",
		name: "ReactDiver",
		tagline: "React playground for motion, UI polish, and micro-interactions",
		description:
			"A small React-first project focused on delightful UI: motion, transitions, responsive layout, and accessible components. Built as a sandbox to iterate quickly and ship clean patterns.",
		stack: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
		features: [
			"Motion-led UI interactions",
			"Reusable component patterns",
			"Responsive layouts tuned per viewport",
			"Accessibility-first focus (keyboard + reduced motion)",
		],
		highlights: [
			"Designed to demonstrate frontend craft and detail",
			"Built for fast iteration with production-friendly structure",
		],
		status: "planned",
		links: {
			caseStudy: "/projects/reactdiver",
		},
		images: {
			hero: "/images/under-construction.svg",
		},
	},
	{
		slug: "travelbuddy",
		name: "Travel Buddy",
		tagline:
			"Trip planning companion with itineraries, maps, and shared checklists",
		description:
			"A travel planning app to build itineraries, save places, track budgets, and share plans with friends. Focuses on clean UX, real-world data modeling, and mobile-friendly flows.",
		stack: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "PostgreSQL"],
		features: [
			"Trips with day-by-day itineraries",
			"Saved places + notes",
			"Shared checklists and packing lists",
			"Budget tracking per trip",
		],
		highlights: [
			"Real-world CRUD with great mobile UX",
			"Good showcase for schema design and thoughtful flows",
		],
		status: "planned",
		links: {
			caseStudy: "/projects/travelbuddy",
		},
		images: {
			hero: "/images/under-construction.svg",
		},
	},
	{
		slug: "commercepilot",
		name: "CommercePilot",
		tagline: "E-commerce ops dashboard for products, orders, and fulfillment",
		description:
			"An e-commerce operations dashboard focused on the workflows behind the store: order triage, fulfillment statuses, inventory notes, and customer support tooling.",
		stack: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL"],
		features: [
			"Order list + detail views",
			"Fulfillment status workflows",
			"Inventory notes and low-stock flags",
			"Customer timeline and support notes",
		],
		highlights: [
			"Complements ShopSwift by focusing on admin workflows",
			"Great for showcasing dashboards, tables, and data UX",
		],
		status: "planned",
		links: {
			caseStudy: "/projects/commercepilot",
		},
		images: {
			hero: "/images/under-construction.svg",
		},
	},
	{
		slug: "tbd",
		name: "???",
		tagline: "Next project coming soon",
		description:
			"A new project is in the works — details will be added once the scope is ready to share.",
		stack: ["Next.js", "TypeScript", "Tailwind"],
		features: ["To be announced"],
		highlights: ["More details coming soon"],
		status: "planned",
		links: {
			caseStudy: "/projects/tbd",
		},
		images: {
			hero: "/images/under-construction.svg",
		},
	},
];

export function getProjectBySlug(slug: string): Project | undefined {
	// Small helper to keep routing/pages clean.
	return projects.find((p) => p.slug === slug);
}
