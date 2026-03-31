import { Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";

/*
	TestimonialCard
	--------------
	Compact testimonial display with a 1–5 star rating.

	Performance note:
	- We use a shared `[0..4]` index array to avoid allocating a new array on every render.
*/

const STAR_INDEXES = [0, 1, 2, 3, 4] as const;

function clampRating(rating: number) {
	if (Number.isNaN(rating)) return 0;
	return Math.max(0, Math.min(5, Math.round(rating)));
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
	const rating = clampRating(testimonial.rating);

	return (
		<Card size="sm">
			<CardHeader className="space-y-2">
				<div className="flex items-start justify-between gap-3">
					<CardTitle className="text-base">{testimonial.name}</CardTitle>
					<div
						className="flex items-center gap-0.5"
						aria-label={`Rating: ${rating} out of 5`}
						role="img"
					>
						{STAR_INDEXES.map((i) => {
							const filled = i < rating;
							return (
								<Star
									key={i}
									className={cn(
										"size-4",
										filled
											? "fill-foreground text-foreground"
											: "text-muted-foreground/60",
									)}
								/>
							);
						})}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm leading-relaxed text-muted-foreground">
					{testimonial.text}
				</p>
			</CardContent>
		</Card>
	);
}
