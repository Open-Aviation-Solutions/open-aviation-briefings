# open-aviation-briefings

Aviation instructor lesson system. Marp generates slide decks (briefs); Astro/Starlight provides the instructor documentation site that embeds those slides.

## Licensing

This repository uses two licenses depending on file type:

| Files | License |
|-------|---------|
| Code and configuration (`.js`, `.ts`, `.astro`, `.json`, config files) | [Mozilla Public License 2.0](LICENSE) |
| Brief content (`brief-slides/**/*.md`, `src/content/docs/**/*.mdx`) | [Creative Commons Attribution-ShareAlike 4.0](LICENSE-CC-BY-SA) |

All brief slide files (`brief-slides/**/*.md`) must include `license: CC-BY-SA-4.0` in their YAML frontmatter. See [brief-slides/INSTRUCTIONS.md](brief-slides/INSTRUCTIONS.md).

## Usage

```bash
npm run dev          # Marp build → Astro dev server (primary workflow)
npm run build        # Marp build → Astro static build → dist/
npm run marp:build   # Marp-only: brief-slides/ → public/brief-slides/
npm run marp:serve   # Marp server from repo root (presenter view + notes)
```

For slide hot-reload during authoring, run two terminals in parallel:

```bash
# terminal 1
npx marp --config marp.config.js --input-dir ./brief-slides -o ./public/brief-slides --watch
# terminal 2
npx astro dev
```
