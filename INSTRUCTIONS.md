# open-aviation-briefings

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
| `public/open-aviation-components` | Symlink → `../node_modules/@open-aviation-solutions/components/dist/lib` (Astro serves at `/open-aviation-components/…`) |
| `public/brief-slides/` | Marp build output — gitignored |

### Marp engine (`marp.config.js`)

Custom engine extending `@marp-team/marp-core` with three additions:

1. **`customElementBlock` plugin** — teaches markdown-it to treat hyphenated custom element tags (`<four-forces>`, etc.) as block-level HTML instead of wrapping them in `<p>`.
2. **Script injection** — if a slide deck uses any `PUBLISHED_COMPONENTS` tag (`four-forces`, `briefing-overview`, `climb-performance`, `pitch-roll-yaw`), a `<script type="module" src="/open-aviation-components/define.es.js">` is prepended, served locally via the `public/open-aviation-components` symlink. If a `LOCAL_COMPONENTS` tag (`youtube-video`, `secondary-effect-climb-car`, `secondary-effect-elevator`) appears, the matching `/components/<tag>.js` file is injected.

### Developing `@open-aviation-solutions/components` locally

To iterate on the components package without a publish/install cycle:

```bash
# one-time setup (here)
make local-components-symlink
```

This replaces the installed package in `node_modules` with a direct symlink to `../open-aviation-components`. `npm link` is not used because it requires write access to the global node_modules (`/usr/local/lib/node_modules`).

The `public/open-aviation-components` symlink resolves through `node_modules/`, so after rebuilding the components package (`npm run build:lib` in `open-aviation-components/`) just rebuild the slides here and the changes are picked up automatically.

When finished, restore the published version:

```bash
npm install
```

### Starlight content

Each lesson lives under `src/content/docs/<course>/<lesson-number>-<slug>/index.mdx`. The page imports `SlideEmbed` and embeds the corresponding Marp-built HTML file:

```mdx
import SlideEmbed from '../../../../components/SlideEmbed.astro'

<SlideEmbed
  src="/brief-slides/recreational-pilot-license/01-effects-of-controls/01-theory-part-1.html"
  title="Effects of Controls — Theory Part 1"
/>
```

Import depth: `index.mdx` is four levels below `src/`, so the relative import is `../../../../components/SlideEmbed.astro`.

The Starlight sidebar is auto-generated from the `src/content/docs/` directory tree. Lessons sort correctly because their directory names are prefixed with numbers (`01-`, `02-`, …).
