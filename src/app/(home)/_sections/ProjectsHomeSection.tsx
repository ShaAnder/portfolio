import { ProjectHighlights } from "@/features/projects/ProjectHighlights";
import { Section } from "@/components/site/primitives/Section";

export function ProjectsHomeSection() {
	return (
		<Section
			id="projects"
			title="Projects"
			className="min-h-0 h-dvh pb-4 md:pb-6 [&>div:last-child]:items-start md:[&>div:last-child]:items-start md:[&>div:last-child>div]:my-auto"
		>
			<div className="pt-3 md:pt-0">
				<ProjectHighlights />
			</div>
		</Section>
	);
}
