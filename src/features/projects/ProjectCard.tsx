import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Project } from "@/data/projects";
import Image from "next/image";
import { useState } from "react";

function statusLabel(status: Project["status"]) {
	switch (status) {
		case "planned":
		case "building":
			return "In development";
		case "shipped":
			return "Shipped";
		default:
			return status;
	}
}

/*
	ProjectCard
	-----------
	A compact, scannable summary card for the Projects grid.

	This component is intentionally presentational.
	The interactive wrapper (e.g. `ProjectDetailsDialog`) should live at the callsite
	so this file remains server-renderable and doesn't pull dialog code into the module.

	Styling choices:
	- Uses the shared `Card` primitive so surface + spacing are consistent.
	- The hero image is locked to `aspect-video` for a uniform grid.
	- Badges use semantic variants so they stay readable in both themes.
	- Footer buttons are simple inline-flex pills (could be refactored to Button/buttonVariants later).
*/

export function ProjectCard({ project }: { project: Project }) {
	const { hero, gallery = [] } = project.images;
	const allImages = [hero, ...gallery];

	const [currentIndex, setCurrentIndex] = useState(0);

	const nextImage = () =>
		setCurrentIndex((prev) => (prev + 1) % allImages.length);
	const prevImage = () =>
		setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

	const isUnderConstruction = project.status !== "shipped";

	return (
		<Card
			data-project-card
			size="sm"
			className="group p-0 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer bg-zinc-950 border-zinc-800"
		>
			{/* Hero Area */}
			<div className="relative aspect-5/2 w-full overflow-hidden bg-zinc-950 md:aspect-10/3 lg:aspect-2/1">
				{isUnderConstruction ? (
					/* Under Construction - Clean & Natural Size */
					<div className="flex h-full w-full items-center justify-center bg-zinc-300">
						<Image
							src="/images/under-construction.svg"
							alt="Under Construction"
							fill
							className="object-contain p-8 opacity-100"
						/>
					</div>
				) : (
					/* Shipped Projects - Carousel */
					<>
						<Image
							src={allImages[currentIndex]}
							alt={`${project.name} screenshot`}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
						/>

						<div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/70" />

						{allImages.length > 1 && (
							<>
								<button
									onClick={(e) => {
										e.stopPropagation();
										prevImage();
									}}
									className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-4xl font-light opacity-0 group-hover:opacity-100 transition-all z-10"
								>
									⟨
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										nextImage();
									}}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-4xl font-light opacity-0 group-hover:opacity-100 transition-all z-10"
								>
									⟩
								</button>

								<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
									{allImages.map((_, idx) => (
										<button
											key={idx}
											onClick={(e) => {
												e.stopPropagation();
												setCurrentIndex(idx);
											}}
											className={`h-1 rounded-full transition-all ${
												idx === currentIndex
													? "w-5 bg-white"
													: "w-1.5 bg-zinc-500 hover:bg-zinc-400"
											}`}
										/>
									))}
								</div>
							</>
						)}
					</>
				)}
			</div>

			<CardContent className="flex items-center justify-between gap-3 py-3 px-4">
				<CardTitle className="text-lg leading-none truncate">
					{project.name}
				</CardTitle>
				<Badge variant={project.status === "shipped" ? "default" : "secondary"}>
					{statusLabel(project.status)}
				</Badge>
			</CardContent>
		</Card>
	);
}
