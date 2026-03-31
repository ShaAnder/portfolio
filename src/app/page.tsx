import Link from "next/link";
import { Download, FolderKanban, Mail } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGithub,
	faLinkedinIn,
	faXTwitter,
	faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import { ProjectCard } from "@/components/site/ProjectCard";
import { ProjectDetailsDialog } from "@/components/site/ProjectDetailsDialog";
import { Section } from "@/components/site/Section";
import { AboutReadMoreDialog } from "@/components/site/AboutReadMoreDialog";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { testimonials } from "@/data/testimonials";

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

export default function Home() {
	return (
		<div>
			<section className="relative flex min-h-dvh snap-start snap-always flex-col justify-center py-12 md:py-16">
				<div className="relative z-10 space-y-4">
					<h1 className="text-5xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
						Shaun Anderton
					</h1>
					<div className="max-w-2xl space-y-2 md:text-lg">
						<p className="font-medium text-foreground">
							Junior Full Stack Developer
						</p>
						<p className="text-muted-foreground">
							Open to UK &amp; Ireland roles - remote or hybrid.
						</p>
						<p className="text-muted-foreground">
							Focused on modern frontend development with React, Next.js, and
							TypeScript, paired with Django and Supabase on the backend.
							Currently gaining valuable experience with Salesforce (Apex +
							LWC).
						</p>
					</div>

					{/* CTA row: wraps naturally on small screens. */}
					<div className="flex flex-wrap gap-3 pt-2">
						<a
							data-icon="inline-start"
							className={buttonVariants({
								variant: "outline",
								size: "lg",
								className: "h-10 px-4 text-base rounded-full",
							})}
							href="#projects"
						>
							<FolderKanban className="size-4" />
							View projects
						</a>
						<a
							data-icon="inline-start"
							className={buttonVariants({
								variant: "outline",
								size: "lg",
								className: "h-10 px-4 text-base rounded-full",
							})}
							href="/ShaunAndertonCV.pdf"
							target="_blank"
							rel="noreferrer"
						>
							<Download className="size-4" />
							Download CV
						</a>
						<a
							data-icon="inline-start"
							className={buttonVariants({
								variant: "outline",
								size: "lg",
								className: "h-10 px-4 text-base rounded-full",
							})}
							href="#contact"
						>
							<Mail className="size-4" />
							Get in touch
						</a>
					</div>

					<div className="flex flex-wrap items-center gap-4">
						<Link
							className={buttonVariants({
								variant: "ghost",
								size: "icon-lg",
								className: "size-11 rounded-full! border border-border!",
							})}
							href="/"
							aria-label="GitHub"
						>
							<FontAwesomeIcon icon={faGithub} className="size-5! md:size-6!" />
						</Link>
						<Link
							className={buttonVariants({
								variant: "ghost",
								size: "icon-lg",
								className: "size-11 rounded-full! border border-border!",
							})}
							href="/"
							aria-label="LinkedIn"
						>
							<FontAwesomeIcon
								icon={faLinkedinIn}
								className="size-5! md:size-6!"
							/>
						</Link>
						<Link
							className={buttonVariants({
								variant: "ghost",
								size: "icon-lg",
								className: "size-11 rounded-full! border border-border!",
							})}
							href="/"
							aria-label="Twitter"
						>
							<FontAwesomeIcon
								icon={faXTwitter}
								className="size-5! md:size-6!"
							/>
						</Link>
						<Link
							className={buttonVariants({
								variant: "ghost",
								size: "icon-lg",
								className: "size-11 rounded-full! border border-border!",
							})}
							href="/"
							aria-label="YouTube"
						>
							<FontAwesomeIcon
								icon={faYoutube}
								className="size-5! md:size-6!"
							/>
						</Link>
					</div>
				</div>
			</section>

			<Section id="about" title="About">
				<div className="max-w-3xl space-y-4 text-muted-foreground">
					<p>
						Based in Ireland, targeting remote/hybrid junior roles across
						Ireland and the UK.
					</p>
					<p>
						This portfolio intentionally showcases only four new,
						production-style builds (no older betas).
					</p>
					<div className="pt-2">
						<AboutReadMoreDialog />
					</div>
				</div>
			</Section>

			<Section id="skills" title="Skills">
				<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
					{skillGroups.map((group) => (
						<div key={group.title} className="rounded-lg border p-3">
							{/*
								Skill group card
								- `border` uses tokenized border color
								- rounded + padding matches overall component language
							*/}
							<div className="font-medium">{group.title}</div>
							<div className="mt-3 flex flex-wrap gap-2">
								{group.skills.map((skill) => (
									<Badge key={skill} variant="outline">
										{skill}
									</Badge>
								))}
							</div>
						</div>
					))}
				</div>
			</Section>

			<Section id="projects" title="Projects">
				<div className="grid gap-4 md:grid-cols-2">
					{projects.map((project) => (
						<ProjectDetailsDialog
							key={project.slug}
							project={project}
							triggerClassName="block"
						>
							<ProjectCard project={project} />
						</ProjectDetailsDialog>
					))}
				</div>
			</Section>

			<Section id="testimonials" title="Testimonials">
				<div className="grid gap-4 md:grid-cols-2">
					{testimonials.map((t) => (
						<TestimonialCard key={t.name} testimonial={t} />
					))}
				</div>
			</Section>

			<Section id="contact" title="Contact">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div className="text-muted-foreground">
						<div>Email: you@example.com</div>
					</div>
					<div className="flex flex-wrap gap-3">
						<a
							className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
							href="mailto:you@example.com?subject=Portfolio%20Inquiry"
						>
							Email me
						</a>
						<Link
							className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium"
							href="/#projects"
						>
							Start with JobTrackr
						</Link>
					</div>
				</div>
			</Section>
		</div>
	);
}
