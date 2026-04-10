import Link from "next/link";
import Image from "next/image";
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
			<section
				id="home-hero"
				className="relative flex min-h-dvh snap-start snap-always flex-col justify-center py-16 md:py-24"
			>
				<div className="relative z-10 mx-auto w-full max-w-5xl">
					<div className="flex flex-col items-center gap-10 min-[769px]:flex-row min-[769px]:items-center min-[769px]:justify-between min-[769px]:gap-14">
						<div className="order-1 flex w-full justify-center min-[769px]:order-2 min-[769px]:w-auto">
							<div className="relative mx-auto size-40 rounded-full min-[769px]:size-64 lg:size-80 xl:size-96">
								<div
									aria-hidden="true"
									className="absolute -inset-3 rounded-full bg-black/30 blur-xl transition-colors duration-700 delay-1000 dark:bg-white/15"
								/>

								<div className="relative size-full overflow-hidden rounded-full border border-border">
									<Image
										src="/images/profile.jpg"
										alt="Shaun Anderton"
										fill
										priority
										className="object-cover object-[50%_10%] scale-[1.12]"
										sizes="(min-width: 1280px) 384px, (min-width: 1024px) 320px, (min-width: 769px) 256px, 160px"
									/>
								</div>
							</div>
						</div>

						<div className="order-2 flex w-full max-w-2xl flex-col items-center text-center min-[769px]:order-1 min-[769px]:items-start min-[769px]:text-left">
							<div className="space-y-3 md:space-y-4">
								<h1 className="text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-5xl md:text-6xl">
									Hi, I&apos;m{" "}
									<span className="bg-linear-to-r from-destructive to-sidebar-primary bg-clip-text text-transparent">
										Shaun
									</span>
								</h1>

								<h2 className="text-balance text-2xl font-medium leading-[1.15] tracking-tight text-muted-foreground sm:text-3xl md:text-4xl">
									Junior Full Stack Developer
								</h2>
							</div>

							<p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
								My goal is to build sustainable, scalable, and clean web
								experiences that feel fast, distinctive, and effortless to use.
							</p>

							<p className="mt-8 font-semibold leading-snug tracking-tight text-foreground">
								Open to UK &amp; Ireland roles (remote or hybrid).
							</p>

							{/* CTA row: wraps naturally on small screens. */}
							<div className="mt-12 flex flex-wrap justify-center gap-3 min-[769px]:justify-start min-[769px]:gap-4">
								<a
									data-icon="inline-start"
									className={buttonVariants({
										variant: "default",
										size: "lg",
										className:
											"h-10 px-4 text-base rounded-full transition-transform hover:-translate-y-0.5 hover:scale-[1.02] hover:ring-4 hover:ring-ring/10 motion-reduce:transform-none",
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
										className:
											"h-10 px-4 text-base rounded-full transition-transform hover:-translate-y-0.5 hover:scale-[1.02] hover:ring-4 hover:ring-ring/10 motion-reduce:transform-none",
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
										className:
											"h-10 px-4 text-base rounded-full transition-transform hover:-translate-y-0.5 hover:scale-[1.02] hover:ring-4 hover:ring-ring/10 motion-reduce:transform-none",
									})}
									href="#contact"
								>
									<Mail className="size-4" />
									Get in touch
								</a>
							</div>

							<div className="mt-6 flex flex-wrap items-center justify-center gap-4 min-[769px]:justify-start">
								<Link
									className={buttonVariants({
										variant: "ghost",
										size: "icon-lg",
										className:
											"size-11 rounded-full! border border-border! transition-transform hover:-translate-y-0.5 hover:scale-[1.04] hover:ring-4 hover:ring-ring/10 motion-reduce:transform-none",
									})}
									href="/"
									aria-label="GitHub"
								>
									<FontAwesomeIcon
										icon={faGithub}
										className="size-5! md:size-6!"
									/>
								</Link>
								<Link
									className={buttonVariants({
										variant: "ghost",
										size: "icon-lg",
										className:
											"size-11 rounded-full! border border-border! transition-transform hover:-translate-y-0.5 hover:scale-[1.04] hover:ring-4 hover:ring-ring/10 motion-reduce:transform-none",
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
										className:
											"size-11 rounded-full! border border-border! transition-transform hover:-translate-y-0.5 hover:scale-[1.04] hover:ring-4 hover:ring-ring/10 motion-reduce:transform-none",
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
										className:
											"size-11 rounded-full! border border-border! transition-transform hover:-translate-y-0.5 hover:scale-[1.04] hover:ring-4 hover:ring-ring/10 motion-reduce:transform-none",
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
					</div>

					<div
						aria-hidden="true"
						className="mt-10 hidden h-px w-24 bg-border/60 min-[769px]:block min-[769px]:mt-12"
					/>
				</div>
			</section>

			<Section id="about" title="About">
				<div className="max-w-3xl space-y-4 text-muted-foreground">
					<p>
						Based in Ireland, targeting remote/hybrid junior roles across
						Ireland and the UK.
					</p>
					<p className="text-sm font-medium tracking-wide">
						React • Next.js • TypeScript • Django • Supabase • Salesforce
					</p>
					<p>
						Focused on modern frontend development with React, Next.js, and
						TypeScript, paired with Django and Supabase on the backend.
						Currently gaining valuable experience with Salesforce (Apex + LWC).
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
