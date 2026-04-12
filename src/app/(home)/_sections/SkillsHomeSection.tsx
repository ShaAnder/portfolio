import { SkillHighlights } from "@/features/skills/SkillHighlights";
import { Section } from "@/components/site/primitives/Section";
import { SkillsLegendDialog } from "@/components/site/SkillsLegendDialog";

export function SkillsHomeSection() {
	return (
		<Section
			id="skills"
			title="Skills"
			className="min-h-0 h-dvh pb-4 md:pb-6 [&>div:last-child]:items-start [&>div:last-child>div]:h-full [&>div:last-child>div]:min-h-0"
		>
			<div className="flex h-full min-h-0 flex-col gap-4">
				<div className="mx-auto w-full max-w-3xl pb-3 text-center">
					<p className="text-pretty text-sm text-muted-foreground md:text-base">
						I build modern, production-ready web apps end-to-end, from UI to
						APIs and databases.
					</p>
					<p className="mt-2 text-pretty text-sm text-muted-foreground md:text-base">
						Core stack: React · Next.js · TypeScript · Tailwind · Django · DRF ·
						PostgreSQL · Supabase.
					</p>
					<p className="mt-2 text-pretty text-sm text-muted-foreground md:text-base">
						Tap a skill bar to see details and related projects.
						<SkillsLegendDialog className="ml-2 inline-flex size-5 items-center justify-center rounded-full border bg-muted/20 text-xs text-muted-foreground" />
					</p>
				</div>
				<SkillHighlights className="min-h-0 flex-1" />
			</div>
		</Section>
	);
}
