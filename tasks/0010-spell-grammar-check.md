# Task 0010 — Automatic spell and grammar checking for slides

**Status:** research pending

## Goal

Catch spelling and grammar errors in slide content automatically — either in CI,
as a pre-commit hook, or as a `make` target — so errors don't reach published
briefs. Aviation briefings contain a lot of domain-specific vocabulary (HASELL,
VSO, AOA, ATIS, VNE, …) so any tool must support a custom project dictionary.

## Scope

Files to check:
- `brief-slides/**/*.md` — slide source (markdown with Marp frontmatter)
- `src/content/docs/**/*.mdx` — Astro/Starlight instructor pages

Content types within those files that need different treatment:
- Slide body text — primary target
- HTML comments `<!-- … -->` used as presenter notes — also check
- YAML frontmatter (`marp`, `title`, `header`, …) — skip
- Custom element tags (`<four-forces>`, `<youtube-video>`, …) — skip
- URLs and code spans — skip

## Candidate approaches

### A — cspell

A spell-only checker designed for code+prose repos. Parses markdown natively,
skips code fences, URLs, and frontmatter. Driven by a JSON config with an
`ignoreWords` / custom dictionary file. Fast, zero runtime deps (npm package),
integrates cleanly with a `make spell` target and pre-commit hooks.

**Strengths:** lightest weight; understands markdown structure out of the box;
widely used in open-source projects.

**Weaknesses:** spell-only — no grammar or style checking.

### B — Vale

A prose linter that goes beyond spelling: enforces writing style rules
(readability level, passive voice, weak hedges, repeated words). Supports
multiple built-in style guides (Microsoft, Google, write-good). Understands
Markdown and MDX, can be scoped to specific file sections.

Requires a `.vale.ini` config and a custom vocabulary file (`accept.txt`) for
aviation terms.

**Strengths:** catches grammar and style issues cspell misses; highly
configurable; single binary install.

**Weaknesses:** heavier config upfront; style rules need tuning to avoid false
positives in a technical/instructional register.

### C — LanguageTool

The most capable open-source grammar checker (also detects agreement errors,
confused words, and punctuation). Available as:
- a public REST API (free tier: 20 req/min, text size limits), or
- a self-hosted Java server (heavy, ~200 MB download).

Would need a thin wrapper script that strips Marp frontmatter and custom
elements before submitting text.

**Strengths:** best grammar detection of the three.

**Weaknesses:** requires network (API) or a JVM (self-hosted); slower;
API rate limits make it awkward in CI for many files.

### D — Hybrid: cspell + Vale

Run cspell for fast spell-checking on every commit, and Vale on demand (or in
CI) for grammar and style review before publishing a lesson. Each tool does
what it's best at; both share the same custom aviation vocabulary file.

## Evaluation criteria

1. **Accuracy with aviation vocabulary** — how well does it support a project
   dictionary for domain terms?
2. **Markdown/MDX awareness** — does it natively skip frontmatter, code spans,
   and element tags, or does preprocessing add friction?
3. **Integration effort** — how much config is needed to get a working
   `make spell` / `make lint-prose` target?
4. **CI suitability** — is it fast and dependency-light enough for a GitHub
   Actions step?
5. **Grammar coverage** — does it catch more than spelling errors?

## Plan of work

1. Trial cspell on the existing slides: `npx cspell "brief-slides/**/*.md"` and
   record false positives to size the custom dictionary effort.
2. Trial Vale with default config on the same files; note which rules produce
   useful signal vs. noise in a flight-instruction register.
3. Decide between approach A, B, or D based on the trial results.
4. Add a project dictionary for aviation terms (drawn from false-positive list).
5. Add a `make spell` (and optionally `make lint-prose`) target to `Makefile`.
6. Add a pre-commit hook or GitHub Actions step so checks run automatically.
7. Update this task with the chosen approach and close it.
