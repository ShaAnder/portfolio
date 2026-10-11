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
		name: "Daniel Murphy",
		rating: 4,
		text: "Strong React/Next.js fundamentals and a good eye for UX. What stood out was the consistency: spacing, typography, states, and error handling all felt intentional. A bit more documentation would have made onboarding even smoother, but overall the delivery quality was high.",
	},
	{
		name: "Anonymous",
		rating: 4,
		text: "Solid backend + frontend integration. The API surface stayed consistent, types were aligned across layers, and the fallbacks were sensible. There were a few tricky responsive cases on tablet, but they were handled pragmatically and the final layouts felt stable.",
	},
];
