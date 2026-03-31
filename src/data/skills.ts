export type SkillGroup = {
	title: string;
	skills: string[];
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
