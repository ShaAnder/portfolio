import { Section } from "@/components/site/primitives/Section";
import { ProjectHighlights } from "@/features/projects/ProjectHighlights";

export function ProjectsHomeSection() {
	return (
		<Section
			id="projects"
			title="Projects"
			className="min-h-dvh h-auto pt-4 pb-8 md:pt-5 md:pb-10 [&>div:first-child]:pt-0 [&>div:first-child]:pb-1 md:[&>div:first-child]:pb-2 [&>div:first-child>h2]:text-3xl md:[&>div:first-child>h2]:text-4xl [&>div:last-child]:items-start"
		>
			<div className="pt-0 pb-2">
				<ProjectHighlights />
			</div>
		</Section>
	);
}
