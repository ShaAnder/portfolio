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
	salesforceDemo?: string;
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
		tagline:
			"Job application CRM with analytics + Salesforce (Apex/LWC) showcase",
		description:
			"Track job applications through a pipeline, capture notes and follow-ups, and visualize your funnel. Includes a native Salesforce implementation to demonstrate Apex + Lightning Web Components.",
		stack: [
			"Next.js",
			"TypeScript",
			"Tailwind",
			"shadcn/ui",
			"Supabase",
			"PostgreSQL",
			"Salesforce",
			"Apex",
			"LWC",
		],
		features: [
			"Auth + user dashboard",
			"Application pipeline (Applied → Interview → Offer)",
			"Notes, deadlines, and reminders",
			"Analytics (funnel + win rate)",
			"CSV export",
		],
		highlights: [
			"Same domain implemented in modern web + native Salesforce",
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
];

export function getProjectBySlug(slug: string): Project | undefined {
	// Small helper to keep routing/pages clean.
	return projects.find((p) => p.slug === slug);
}
