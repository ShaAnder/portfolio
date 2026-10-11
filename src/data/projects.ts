export type ProjectDisplayType = "desktop" | "tablet" | "mobile";

export type ProjectStatus = "planned" | "building" | "shipped";

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
	displayType: ProjectDisplayType;
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
		slug: "ping-me",
		displayType: "desktop",
		name: "Ping Me",
		tagline: "Real-time messaging built with React and TypeScript",
		description:
			"A messaging application with Supabase authentication, PostgreSQL-backed content, real-time message updates and automated tests. The current implementation uses Supabase; a previous Django-based backend is retained as legacy work.",
		stack: ["React", "TypeScript", "Vite", "Supabase", "PostgreSQL", "Vitest"],
		features: [
			"Authentication and session handling",
			"Message create, edit and delete",
			"Realtime message subscriptions",
			"Server and channel management",
		],
		highlights: [
			"Auth-state race condition investigated and corrected",
			"Vitest and React Testing Library coverage",
			"GitHub Actions lint, build and test workflow",
		],
		status: "shipped",
		links: { github: "https://github.com/ShaAnder/ping-me-web" },
		images: {
			hero: "/projects/ping-me/home.png",
			gallery: [
				"/projects/ping-me/Create.png",
				"/projects/ping-me/Dash.png",
				"/projects/ping-me/Server.png",
			],
		},
	},
	{
		slug: "relic-hunter-online",
		displayType: "desktop",
		name: "Relic Hunter Online",
		tagline: "Browser-based strategy RPG and renderer, under development",
		description:
			"An evolving TypeScript game project with client, shared and server workspaces. Current work explores isometric rendering, tile elevation, visibility, pathing and modular gameplay architecture; multiplayer is not presented as finished.",
		stack: ["TypeScript", "PixiJS", "Vite", "Node.js"],
		features: [
			"Isometric tile rendering and elevation",
			"Fog of war and occlusion",
			"Pathing and turn-based systems",
			"Shared TypeScript domain code",
		],
		highlights: [
			"Separation of client, shared and server concerns",
			"Renderer and game-system architecture",
			"Active work in progress with unfinished multiplayer scope",
			"Featured gallery artwork is a concept mockup, not an in-game screenshot",
		],
		status: "building",
		links: { github: "https://github.com/ShaAnder/relic-hunter-online" },
		images: {
			hero: "/projects/relic-hunter-online/rho-concept.png",
			gallery: [
				"/projects/relic-hunter-online/maps.png",
				"/projects/relic-hunter-online/tutorial.png",
				"/projects/relic-hunter-online/Character.png",
			],
		},
	},
	{
		slug: "fitforge",
		displayType: "mobile",
		name: "FitForge",
		tagline: "Mobile fitness app with authentication, data flows and testing",
		description:
			"A React Native/Expo fitness application using TypeScript and Supabase, with React Query data handling, form validation and mobile-focused testing. Public shipping status should be verified before claiming a store release.",
		stack: [
			"React Native",
			"Expo",
			"TypeScript",
			"Supabase",
			"React Query",
			"Jest",
		],
		features: [
			"Authentication and session handling",
			"Fitness data and async queries",
			"Forms and validation",
			"Automated component tests",
		],
		highlights: [
			"Expo Router application structure",
			"React Query and Supabase integration",
			"Jest and React Native Testing Library",
		],
		status: "shipped",
		links: { github: "https://github.com/ShaAnder/fitforge" },
		images: {
			hero: "/projects/fitforge/home.png",
			gallery: [
				"/projects/fitforge/log-workout.png",
				"/projects/fitforge/settings.png",
				"/projects/fitforge/library.png",
			],
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
