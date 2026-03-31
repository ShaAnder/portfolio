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
];
