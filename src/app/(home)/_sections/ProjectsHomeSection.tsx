import { Section } from "@/components/site/primitives/Section";
import { ProjectHighlights } from "@/features/projects/ProjectHighlights";

export function ProjectsHomeSection() {
  return (
    <Section
      id="projects"
      title="Projects"
      className="min-h-dvh h-auto pb-12 md:pb-16 [&>div:last-child]:items-start"
    >
      <div className="py-4 md:py-8">
        <ProjectHighlights />
      </div>
    </Section>
  );
}
