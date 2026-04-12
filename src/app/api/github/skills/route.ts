export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour

type Repo = {
	owner: { login: string };
	name: string;
	archived: boolean;
	fork: boolean;
	size: number;
	private: boolean;
	default_branch: string;
};

type SkillSpec = {
	key:
		| "react"
		| "nextjs"
		| "typescript"
		| "tailwind"
		| "django"
		| "drf"
		| "supabase"
		| "postgresql"
		| "redis"
		| "websockets";
	level: 1 | 2 | 3 | 4;
	npm?: string[];
	pip?: string[];
	files?: string[];
};

const SKILL_SPECS: SkillSpec[] = [
	{ key: "react", level: 2, npm: ["react"] },
	{ key: "nextjs", level: 2, npm: ["next"] },
	{ key: "typescript", level: 3, npm: ["typescript"] },
	{ key: "tailwind", level: 2, npm: ["tailwindcss"] },
	{ key: "django", level: 2, pip: ["django"] },
	// DRF is distinct from Django; match both the canonical package and common shorthand.
	{ key: "drf", level: 2, pip: ["djangorestframework", "drf"] },
	{
		key: "supabase",
		level: 3,
		npm: ["@supabase/supabase-js"],
		pip: ["supabase"],
	},
	{
		key: "postgresql",
		level: 3,
		npm: ["pg"],
		pip: ["psycopg2", "psycopg", "asyncpg"],
	},
	{ key: "redis", level: 3, npm: ["redis", "ioredis"], pip: ["redis"] },
	{
		key: "websockets",
		level: 3,
		npm: ["ws", "socket.io"],
		pip: ["channels", "websockets"],
	},
];

const LEVEL_TO_PERCENT_PER_REPO = {
	1: 25,
	2: 10,
	3: 5,
	4: 1,
} as const;

function roundToOneDecimal(value: number) {
	return Math.round(value * 10) / 10;
}

function percentFromRepoCount(repoCount: number, level: 1 | 2 | 3 | 4) {
	const perRepo = LEVEL_TO_PERCENT_PER_REPO[level];
	return Math.min(100, roundToOneDecimal(repoCount * perRepo));
}

function slugifyLanguageName(languageName: string) {
	const lower = languageName.trim().toLowerCase();
	if (!lower) return "unknown";
	if (lower === "c++") return "cpp";
	if (lower === "c#") return "csharp";
	return lower
		.replace(/\+/g, "plus")
		.replace(/#/g, "sharp")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function buildGitHubHeaders(token: string) {
	return {
		"Accept": "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
		"Authorization": `Bearer ${token}`,
	};
}

async function githubJson<T>(url: string, token: string): Promise<T> {
	const response = await fetch(url, {
		headers: buildGitHubHeaders(token),
	});

	if (!response.ok) {
		const text = await response.text().catch(() => "");
		throw new Error(
			`GitHub API error ${response.status} ${response.statusText}: ${text}`,
		);
	}

	return (await response.json()) as T;
}

async function githubMaybeTextFile(
	owner: string,
	repo: string,
	path: string,
	token: string,
): Promise<string | null> {
	const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
		path,
	)}`;

	const response = await fetch(apiUrl, {
		headers: buildGitHubHeaders(token),
	});

	if (response.status === 404) return null;
	if (!response.ok) {
		const text = await response.text().catch(() => "");
		throw new Error(
			`GitHub contents error ${response.status} ${response.statusText}: ${text}`,
		);
	}

	const data = (await response.json()) as {
		type?: "file" | "dir";
		encoding?: string;
		content?: string;
		download_url?: string;
	};

	if (data.type !== "file") return null;

	if (data.content && data.encoding === "base64") {
		return Buffer.from(data.content, "base64").toString("utf8");
	}

	if (data.download_url) {
		const raw = await fetch(data.download_url, {
			headers: buildGitHubHeaders(token),
		});
		if (!raw.ok) return null;
		return await raw.text();
	}

	return null;
}

function parsePackageJsonDependencies(fileText: string): Set<string> {
	try {
		const parsed = JSON.parse(fileText) as {
			dependencies?: Record<string, string>;
			devDependencies?: Record<string, string>;
			peerDependencies?: Record<string, string>;
			optionalDependencies?: Record<string, string>;
		};

		const all = {
			...(parsed.dependencies ?? {}),
			...(parsed.devDependencies ?? {}),
			...(parsed.peerDependencies ?? {}),
			...(parsed.optionalDependencies ?? {}),
		};

		return new Set(Object.keys(all).map((k) => k.toLowerCase()));
	} catch {
		return new Set();
	}
}

function parseRequirementsTxt(fileText: string): Set<string> {
	const set = new Set<string>();
	for (const rawLine of fileText.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) continue;
		if (line.startsWith("-")) continue; // -e, -r, etc.
		const match = /^([a-z0-9_.-]+)/i.exec(line);
		if (match?.[1]) set.add(match[1].toLowerCase());
	}
	return set;
}

function textIncludesDependency(fileText: string, name: string) {
	const haystack = fileText.toLowerCase();
	const needle = name.toLowerCase();
	return haystack.includes(needle);
}

export async function GET(request: Request) {
	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		return Response.json(
			{
				error:
					"Missing GITHUB_TOKEN. Add it to your environment to enable GitHub dependency scanning.",
			},
			{ status: 500 },
		);
	}

	const url = new URL(request.url);
	const limitParam = url.searchParams.get("limit");
	const limit =
		limitParam && Number.isFinite(Number(limitParam))
			? Math.max(1, Math.min(100, Number(limitParam)))
			: 30;

	const includeForks = url.searchParams.get("includeForks") === "1";
	const includeArchived = url.searchParams.get("includeArchived") === "1";

	const repos = await githubJson<Repo[]>(
		`https://api.github.com/user/repos?per_page=${limit}&sort=updated&affiliation=owner&visibility=all`,
		token,
	);

	const filteredRepos = repos.filter((repo) => {
		if (!includeForks && repo.fork) return false;
		if (!includeArchived && repo.archived) return false;
		if (repo.size <= 0) return false;
		return true;
	});

	const counts: Record<string, number> = Object.fromEntries(
		SKILL_SPECS.map((s) => [s.key, 0]),
	);
	const languageRepoCounts: Record<string, number> = {};
	const languageByteTotals: Record<string, number> = {};

	for (const repo of filteredRepos) {
		const owner = repo.owner.login;

		const [packageJsonText, requirementsText, pyprojectText, languageBytes] =
			await Promise.all([
				githubMaybeTextFile(owner, repo.name, "package.json", token),
				githubMaybeTextFile(owner, repo.name, "requirements.txt", token),
				githubMaybeTextFile(owner, repo.name, "pyproject.toml", token),
				githubJson<Record<string, number>>(
					`https://api.github.com/repos/${owner}/${repo.name}/languages`,
					token,
				).catch(() => null),
			]);

		if (languageBytes) {
			for (const [languageName, bytes] of Object.entries(languageBytes)) {
				if (!bytes || bytes <= 0) continue;
				languageRepoCounts[languageName] =
					(languageRepoCounts[languageName] ?? 0) + 1;
				languageByteTotals[languageName] =
					(languageByteTotals[languageName] ?? 0) + bytes;
			}
		}

		const npmDeps = packageJsonText
			? parsePackageJsonDependencies(packageJsonText)
			: new Set<string>();

		const pipDeps = new Set<string>([
			...(requirementsText ? parseRequirementsTxt(requirementsText) : []),
		]);

		// For TOML, use a simple substring check so we don't need a TOML parser.
		const pyprojectLower = pyprojectText?.toLowerCase() ?? "";

		for (const spec of SKILL_SPECS) {
			let detected = false;

			if (spec.npm?.some((pkg) => npmDeps.has(pkg.toLowerCase()))) {
				detected = true;
			}

			if (
				!detected &&
				spec.pip?.some((pkg) => pipDeps.has(pkg.toLowerCase()))
			) {
				detected = true;
			}

			if (!detected && spec.pip && pyprojectLower) {
				detected = spec.pip.some((pkg) =>
					textIncludesDependency(pyprojectLower, pkg),
				);
			}

			if (!detected && spec.files?.length) {
				const existsList = await Promise.all(
					spec.files.map((file) =>
						githubMaybeTextFile(owner, repo.name, file, token).then(
							(result) => result !== null,
						),
					),
				);
				detected = existsList.some(Boolean);
			}

			if (detected) counts[spec.key] += 1;
		}
	}

	const skills = SKILL_SPECS.map((spec) => {
		const repoCount = counts[spec.key] ?? 0;
		if (repoCount <= 0) return null;
		return {
			key: spec.key,
			percent: percentFromRepoCount(repoCount, spec.level),
			repoCount,
			level: spec.level,
		};
	}).filter(Boolean);

	// Languages are aggregated from GitHub's /languages endpoint.
	// Use the same level model (defaulting languages to level 3).
	const languages = Object.entries(languageRepoCounts)
		.map(([name, repoCount]) => {
			if (!repoCount || repoCount <= 0) return null;
			const level: 1 | 2 | 3 | 4 = 3;
			return {
				key: `lang-${slugifyLanguageName(name)}`,
				name,
				percent: percentFromRepoCount(repoCount, level),
				repoCount,
				level,
				bytes: languageByteTotals[name] ?? 0,
			};
		})
		.filter(Boolean)
		.sort((a, b) => {
			if (!a || !b) return 0;
			if (b.repoCount !== a.repoCount) return b.repoCount - a.repoCount;
			if (b.bytes !== a.bytes) return b.bytes - a.bytes;
			return a.name.localeCompare(b.name);
		});

	return Response.json({
		generatedAt: new Date().toISOString(),
		scannedRepos: filteredRepos.length,
		skills,
		languages,
	});
}
