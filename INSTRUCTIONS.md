# open-aviation-lessons

Aviation instructor lesson system. Marp generates slide decks (briefs); Astro/Starlight provides the instructor documentation site that embeds those slides.

## Commands

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

## Architecture

### Two pipelines

**Marp** compiles slide source markdown in `brief-slides/` into self-contained HTML files in `public/brief-slides/` (gitignored). **Astro/Starlight** builds the instructor documentation site from `src/content/docs/`, with Marp's output embedded via iframes.

Marp must run before Astro in both `dev` and `build` scripts so the slide HTML exists when Astro processes the `<SlideEmbed>` pages.

### Directory layout

| Path | Purpose |
|------|---------|
| `brief-slides/` | Marp slide source (`.md` with `marp: true` frontmatter) |
| `brief-assets/` | Static assets referenced in slides (video, images) |
| `components/` | Local custom elements (`youtube-video.js`) |
| `src/content/docs/` | Starlight instructor notes pages (`.mdx`) |
| `src/components/SlideEmbed.astro` | iframe embed + "Open slides ↗" link component |
| `src/content.config.ts` | Astro 6 content layer config — wires Starlight's `docsLoader` |
| `public/brief-assets` | Symlink → `../brief-assets` (Astro serves at `/brief-assets/…`) |
| `public/components` | Symlink → `../components` (Astro serves at `/components/…`) |
| `public/brief-slides/` | Marp build output — gitignored |

### Marp engine (`marp.config.js`)

Custom engine extending `@marp-team/marp-core` with three additions:

1. **`customElementBlock` plugin** — teaches markdown-it to treat hyphenated custom element tags (`<four-forces>`, etc.) as block-level HTML instead of wrapping them in `<p>`.
2. **Script injection** — if a slide deck uses any `PUBLISHED_COMPONENTS` tag (`four-forces`, `flight-path-overview`, `climb-performance`), a `<script type="module">` is prepended pointing to the CDN-pinned `@open-aviation-solutions/components` lib. If a `LOCAL_COMPONENTS` tag (`youtube-video`) appears, `/components/youtube-video.js` is injected. Version for the CDN URL is read from `node_modules/@open-aviation-solutions/components/package.json` at build time.
3. **`.interactive` layout CSS** — two-column grid (text left, component right) scoped with Marpit's high-specificity selector prefix. Applied by adding `<!-- _class: interactive -->` to a slide.

### Starlight content

Each lesson lives under `src/content/docs/<course>/<lesson-number>-<slug>/index.mdx`. The page imports `SlideEmbed` and embeds the corresponding Marp-built HTML file:

```mdx
import SlideEmbed from '../../../../components/SlideEmbed.astro'

<SlideEmbed
  src="/brief-slides/recreational-pilot-license/01-effects-of-controls/02-theory-part-1.html"
  title="Effects of Controls — Theory Part 1"
/>
```

Import depth: `index.mdx` is four levels below `src/`, so the relative import is `../../../../components/SlideEmbed.astro`.

The Starlight sidebar is auto-generated from the `src/content/docs/` directory tree. Lessons sort correctly because their directory names are prefixed with numbers (`01-`, `02-`, …).
