import { AboutSection } from "@/features/about/AboutSection";
import { Section } from "@/components/site/primitives/Section";

export function AboutHomeSection() {
	return (
		<Section
			id="about"
			title="About"
			className="min-h-0 h-dvh [&>div:last-child]:items-start lg:[&>div:last-child]:items-center [&>div:last-child>div]:h-full [&>div:last-child>div]:min-h-0"
		>
			<AboutSection />
		</Section>
	);
}
