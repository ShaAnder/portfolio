import { TestimonialWall } from "@/features/testimonials/TestimonialWall";
import { Section } from "@/components/site/primitives/Section";

export function TestimonialsHomeSection() {
	return (
		<Section
			id="testimonials"
			title="Testimonials"
			className="min-h-0 h-dvh pb-4 md:pb-6 [&>div:last-child>div]:h-full [&>div:last-child>div]:min-h-0"
		>
			<TestimonialWall />
		</Section>
	);
}
