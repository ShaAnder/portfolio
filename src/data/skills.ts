export type SkillGroup = {
	title: string;
	skills: string[];
};

export type HighlightSkill = {
	key: string;
	name: string;
	category: string;
	percent: number; // 0..100
	summary: string;
	details: string[];
};

/*
	Skills data model
	-----------------
	Used on the homepage to render grouped skill chips.
	
	Why structured like this:
	- UI can map over groups without repeating layout code.
	- Easy to reorder/add skills with minimal component changes.
*/

export const skillGroups: SkillGroup[] = [
	{
		title: "Frontend",
		skills: [
			"React",
			"Next.js (App Router)",
			"TypeScript",
			"Tailwind CSS",
			"shadcn/ui",
			"TanStack Query",
		],
	},
	{
		title: "Backend",
		skills: [
			"Django",
			"Django REST Framework",
			"Supabase",
			"PostgreSQL",
			"REST APIs",
		],
	},
	{
		title: "Tools",
		skills: [
			"Git/GitHub",
			"Vercel",
			"Render/Railway",
			"Stripe",
			"Testing basics",
		],
	},
];

/*
	Highlighted skills
	------------------
	A curated, top-10 set used for the Skills section “meter + modal” UI.
	These are intentionally easy to tweak: update percents/copy without touching components.
*/

export const highlightSkills: HighlightSkill[] = [
	{
		key: "react",
		name: "React",
		category: "Frontend",
		percent: 82,
		summary:
			"My default tool for building UI that stays readable and easy to extend.",
		details: [
			"Built multi-section pages and reusable component patterns.",
			"Comfortable with state, derived UI, and component composition.",
			"Focus on accessibility and predictable interactions.",
		],
	},
	{
		key: "nextjs",
		name: "Next.js (App Router)",
		category: "Frontend",
		percent: 78,
		summary:
			"I use Next.js for real-world structure: routing, layouts, SEO, and performance.",
		details: [
			"Comfortable with App Router conventions and component boundaries.",
			"Prefer server-first rendering where it fits, with client UI where it matters.",
			"Careful with hydration pitfalls and smooth UX.",
		],
	},
	{
		key: "typescript",
		name: "TypeScript",
		category: "Frontend",
		percent: 75,
		summary:
			"I like TypeScript for confidence and clarity when a project grows.",
		details: [
			"Use types to document intent and reduce regressions.",
			"Prefer simple types and good naming over cleverness.",
			"Comfortable typing component props and shared data models.",
		],
	},
	{
		key: "tailwind",
		name: "Tailwind CSS",
		category: "Frontend",
		percent: 72,
		summary:
			"I move fast with Tailwind while keeping spacing and hierarchy consistent.",
		details: [
			"Build responsive layouts without fighting cascade issues.",
			"Lean on design tokens for theme-safe styling.",
			"Prefer reusable patterns over one-off styling.",
		],
	},
	{
		key: "django",
		name: "Django",
		category: "Backend",
		percent: 70,
		summary: "My go-to for building reliable backends with clear structure.",
		details: [
			"Comfortable with models, admin, auth patterns, and clean app structure.",
			"Prefer pragmatic design: simple, secure defaults.",
			"Used alongside modern frontends for end-to-end builds.",
		],
	},
	{
		key: "drf",
		name: "Django REST Framework",
		category: "Backend",
		percent: 66,
		summary: "I use DRF for clean, predictable APIs that stay easy to evolve.",
		details: [
			"Comfortable with serializers, viewsets, permissions, and pagination.",
			"Focus on consistent responses and good error states.",
			"Prefer a clear API surface over over-engineering.",
		],
	},
	{
		key: "supabase",
		name: "Supabase",
		category: "Backend",
		percent: 72,
		summary:
			"A great choice for shipping quickly with auth, database, and storage.",
		details: [
			"Comfortable with auth flows and using Postgres effectively.",
			"Prefer secure defaults and clear separation of responsibilities.",
			"Used in production-style portfolio builds.",
		],
	},
	{
		key: "postgresql",
		name: "PostgreSQL",
		category: "Backend",
		percent: 64,
		summary: "I focus on practical database design that supports the product.",
		details: [
			"Comfortable with relationships, indexing basics, and query thinking.",
			"Prefer a clean schema over complicated workarounds.",
			"Used via Django ORM and Supabase.",
		],
	},
	{
		key: "git",
		name: "Git/GitHub",
		category: "Tools",
		percent: 80,
		summary:
			"I use Git daily for clean history, safe iteration, and collaboration.",
		details: [
			"Comfortable with branches, pull requests, and resolving conflicts.",
			"Prefer small commits and descriptive messages.",
			"Use issues and checklists to keep work structured.",
		],
	},
	{
		key: "javascript",
		name: "JavaScript",
		category: "Frontend",
		percent: 50,
		summary: "Core language for modern web apps and UI logic.",
		details: [
			"Used across React/Next.js projects.",
			"Comfortable with async flows and API integration.",
		],
	},
	{
		key: "html",
		name: "HTML",
		category: "Frontend",
		percent: 50,
		summary: "Semantic markup for accessible, maintainable UI.",
		details: [
			"Focus on structure, accessibility, and clean hierarchy.",
			"Works alongside component-driven UI patterns.",
		],
	},
	{
		key: "css",
		name: "CSS",
		category: "Frontend",
		percent: 50,
		summary: "Styling fundamentals alongside Tailwind utilities.",
		details: [
			"Comfortable with layout, responsive behavior, and UI polish.",
			"Prefer token-driven, theme-safe styling.",
		],
	},
	{
		key: "python",
		name: "Python",
		category: "Backend",
		percent: 50,
		summary: "Backend language used for APIs and data-driven systems.",
		details: [
			"Used heavily with Django + DRF.",
			"Prefer readable, pragmatic code and clear structure.",
		],
	},
	{
		key: "sql",
		name: "SQL",
		category: "Backend",
		percent: 50,
		summary: "Practical query thinking to support product needs.",
		details: [
			"Used with PostgreSQL via ORM and direct querying when needed.",
			"Comfortable with joins, filtering, and indexing basics.",
		],
	},
	{
		key: "aws",
		name: "AWS",
		category: "Tools",
		percent: 50,
		summary:
			"Cloud platform familiarity for hosting and infrastructure basics.",
		details: [
			"Comfortable with the fundamentals and learning services as needed.",
			"Focus on pragmatic, production-friendly setups.",
		],
	},
	{
		key: "docker",
		name: "Docker",
		category: "Tools",
		percent: 50,
		summary: "Container basics for consistent local dev and deployments.",
		details: [
			"Comfortable with images, containers, and dev workflows.",
			"Use when a project benefits from reproducible environments.",
		],
	},
	{
		key: "kubernetes",
		name: "Kubernetes",
		category: "Tools",
		percent: 50,
		summary: "Orchestration basics and cluster concepts.",
		details: [
			"Learning core primitives and deployment patterns.",
			"Focus on practical understanding over buzzwords.",
		],
	},
	{
		key: "redis",
		name: "Redis",
		category: "Backend",
		percent: 50,
		summary: "Caching and background-job patterns for snappy, scalable apps.",
		details: [
			"Used for caching, queues, and shared state when needed.",
			"Focus on pragmatic performance improvements.",
		],
	},
	{
		key: "websockets",
		name: "WebSockets",
		category: "Backend",
		percent: 50,
		summary: "Real-time updates for dashboards, chats, and live UI.",
		details: [
			"Comfortable with event-driven UI and realtime data flows.",
			"Used alongside APIs for hybrid realtime + request/response apps.",
		],
	},
	{
		key: "graphql",
		name: "GraphQL",
		category: "Backend",
		percent: 50,
		summary: "API schema thinking and client-driven data fetching.",
		details: [
			"Used when it improves data fetching ergonomics and DX.",
			"Prefer clear schemas and predictable client usage.",
		],
	},
	{
		key: "cicd",
		name: "CI/CD",
		category: "Tools",
		percent: 50,
		summary: "Automation to keep builds, tests, and deploys repeatable.",
		details: [
			"Comfortable with basic pipelines and deployment workflows.",
			"Prefer simple, reliable automation.",
		],
	},
	{
		key: "testing",
		name: "Testing",
		category: "Tools",
		percent: 50,
		summary: "Practical testing habits to reduce regressions.",
		details: [
			"Focus on core user flows and critical logic.",
			"Prefer pragmatic coverage over brittle tests.",
		],
	},
];
