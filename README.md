# open-aviation-briefings

Aviation instructor lesson system. Marp generates slide decks (briefs); Astro/Starlight provides the instructor documentation site that embeds those slides.

## Licensing

This repository uses two licenses depending on file type:

| Files | License |
|-------|---------|
| Code and configuration (`.js`, `.ts`, `.astro`, `.json`, config files) | [Mozilla Public License 2.0](LICENSE) |
| Brief content (`brief-slides/**/*.md`, `src/content/docs/**/*.mdx`) | [Creative Commons Attribution-ShareAlike 4.0](LICENSE-CC-BY-SA) |

All brief slide files (`brief-slides/**/*.md`) must include `license: CC-BY-SA-4.0` in their YAML frontmatter. See [brief-slides/INSTRUCTIONS.md](brief-slides/INSTRUCTIONS.md).

## Getting started

```bash
make dev             # Build slides and start dev server at localhost:4321
make build           # Build slides and site to ./dist/
make check           # Run all checks (prose linting etc.)
```
