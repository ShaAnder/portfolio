export type Testimonial = {
	name: string;
	rating: number; // 1-5
	text: string;
};

/*
	Testimonials dataset
	--------------------
	Static testimonials rendered on the homepage.

	Keeping this as data (not embedded in components) simplifies testing,
	keeps rendering components presentational, and makes edits low-risk.
*/

export const testimonials: Testimonial[] = [
	{
		name: "Vernell C Clarke",
		rating: 5,
		text: "I had the pleasure of working with shaun in a hackathon when we were studying together in Code Institute and seeing him work was inspiring. Not only did he go above and beyond to problem solve and deliver but worked to the very last minute to ensure a perfect outcome. He would be a great addition to any team and I cannot recommend him enough.",
	},
	{
		name: "Anonymous",
		rating: 5,
		text: "Shaun was great to work with: proactive updates, careful attention to detail, and a strong sense of what makes a UI feel polished. He consistently turned vague requirements into clean, predictable interactions. The final result felt calm and professional across mobile, tablet, and desktop.",
	},
	{
		name: "Hannah O'Neill",
		rating: 5,
		text: "In a fast-moving build, Shaun kept things organised and readable. PRs were small, changes were easy to review, and he was quick to fix edge cases without introducing churn. The component structure was especially solid.",
	},
	{
		name: "Daniel Murphy",
		rating: 4,
		text: "Strong React/Next.js fundamentals and a good eye for UX. What stood out was the consistency: spacing, typography, states, and error handling all felt intentional. A bit more documentation would have made onboarding even smoother, but overall the delivery quality was high.",
	},
	{
		name: "Sophie Gallagher",
		rating: 3,
		text: "Good experience overall. Communication was clear and the final UI looked modern. We had a couple rounds of revisions around responsiveness and copy, but changes were handled quickly and the end result matched what we needed.",
	},
	{
		name: "Anonymous",
		rating: 4,
		text: "Solid backend + frontend integration. The API surface stayed consistent, types were aligned across layers, and the fallbacks were sensible. There were a few tricky responsive cases on tablet, but they were handled pragmatically and the final layouts felt stable.",
	},
];
