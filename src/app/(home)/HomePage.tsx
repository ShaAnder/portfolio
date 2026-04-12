import { HeroSection } from "@/features/home/HeroSection";

import { AboutHomeSection } from "./_sections/AboutHomeSection";
import { ContactHomeSection } from "./_sections/ContactHomeSection";
import { ProjectsHomeSection } from "./_sections/ProjectsHomeSection";
import { SkillsHomeSection } from "./_sections/SkillsHomeSection";
import { TestimonialsHomeSection } from "./_sections/TestimonialsHomeSection";

/*
	Home page styling notes
	-----------------------
	This is a single-page, section-based layout.

	General patterns:
	- Spacing is driven by a consistent vertical rhythm (`py-10`, section padding via <Section />).
	- Headings use `tracking-tight` + a responsive font size for a modern look.
	- Buttons are implemented as "button-like links" using semantic tokens.
	- `Separator` uses theme-aware border tokens for subtle section breaks.
*/

export function HomePage() {
	return (
		<div>
			<HeroSection />
			<AboutHomeSection />
			<SkillsHomeSection />
			<ProjectsHomeSection />
			<TestimonialsHomeSection />
			<ContactHomeSection />
		</div>
	);
}
