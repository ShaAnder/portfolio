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
		title: "Salesforce",
		skills: ["Apex", "Lightning Web Components (LWC)", "SOQL", "Flows (basic)"],
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
		key: "lwc",
		name: "Lightning Web Components (LWC)",
		category: "Salesforce",
		percent: 58,
		summary:
			"Learning Salesforce UI development by building real components and flows.",
		details: [
			"Comfortable with component structure and data wiring patterns.",
			"Focus on maintainability and clear UI state.",
			"Growing experience through hands-on work.",
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
];
