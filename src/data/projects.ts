export type ProjectStatus = "planned" | "building" | "shipped";

/*
	Projects data model
	-------------------
	This file is the content source for:
	- the homepage Projects grid
	- the statically generated project detail pages (`/projects/[slug]`)
*/

export type ProjectLinks = {
	live?: string;
	github?: string;
	caseStudy?: string;
};

export type ProjectImages = {
	hero: string; // required
	gallery?: string[]; // optional array for carousel
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
		tagline:
			"Mobile workout tracker with streaks & customizable daily reminders",
		description:
			"A clean, modern React Native fitness app for logging workouts, tracking streaks, and staying consistent. Features user-selectable daily reminders, clean UI, and Supabase backend.",
		stack: [
			"React Native",
			"Expo",
			"TypeScript",
			"Tailwind",
			"Supabase",
			"Expo Notifications",
		],
		features: [
			"Workout logging with sets, reps & weight",
			"Streak tracking & calendar",
			"Custom daily reminders (Workout + Streak)",
			"User-selectable reminder times",
			"Secure auth & profile management",
			"Dark mode + accent color themes",
		],
		highlights: [
			"Fully functional mobile app with push notifications",
			"Clean architecture & smooth UX",
			"Production-ready reminder system",
		],
		status: "shipped",
		links: {
			github: "https://github.com/ShaAnder/fitforge",
		},
		images: {
			hero: "/projects/fitforge/home.png", // Main hero image
			gallery: [
				"/projects/fitforge/log-workout.png",
				"/projects/fitforge/settings.png",
				"/projects/fitforge/library.png",
			],
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
			"A small React-first project focused on delightful UI: motion, transitions, responsive layout, and accessible components.",
		stack: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
		features: [
			"Motion-led UI interactions",
			"Reusable component patterns",
			"Responsive layouts tuned per viewport",
			"Accessibility-first focus",
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
			"A travel planning app to build itineraries, save places, track budgets, and share plans with friends.",
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
			hero: "/projects/travelbuddy/hero.png",
		},
	},
	{
		slug: "commercepilot",
		name: "CommercePilot",
		tagline: "E-commerce ops dashboard for products, orders, and fulfillment",
		description:
			"An e-commerce operations dashboard focused on the workflows behind the store.",
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
	return projects.find((p) => p.slug === slug);
}

export const sortedProjects = [...projects].sort((a, b) => {
	const order: Record<ProjectStatus, number> = {
		shipped: 0,
		building: 1,
		planned: 2,
	};
	return order[a.status] - order[b.status];
});
