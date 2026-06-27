# open-aviation-briefings

Aviation instructor lesson system. Marp generates slide decks (briefs); Astro/Starlight provides the instructor documentation site that embeds those slides.

## Before committing

Always run `make check` before committing to catch Vale prose lint errors early.

## Commands

```bash
npm run dev          # Marp build + PDF export → Astro dev server (primary workflow)
npm run build        # Marp build + PDF export → Astro static build → dist/
npm run marp:build   # Marp-only: brief-slides/ → public/brief-slides/ (HTML)
npm run marp:pdf     # PDF export: *-in-flight-notes.md → public/brief-slides/**/*.pdf
npm run marp:serve   # Marp server from repo root (presenter view + notes)
```

For slide hot-reload during authoring, run two terminals in parallel:
```bash
# terminal 1
npx marp --config marp.config.js --input-dir ./brief-slides -o ./public/brief-slides --watch
# terminal 2
npx astro dev
```

### Running without a local Node toolchain

`make dev`, `make build` and `make check` work whether or not Node is installed
on the host:

- If `npm` is on `PATH`, the Make targets run it directly.
- If not, they fall back to a container built from `Dockerfile` (Node 22 +
  Chromium for Marp's PDF export, plus the Vale prose linter and the en_AU
  Hunspell dictionary `make check` needs). The image is built automatically on
  first use. Either `podman` or `docker` is detected; override with
  `CONTAINER_RUNTIME=docker` or force the container path with
  `make dev USE_CONTAINER=1`.

The Vale version baked into the image (`VALE_VERSION` ARG in `Dockerfile`) is
kept in sync with the `VALE_VERSION` env var in `.github/workflows/ci.yml`,
which is how CI installs Vale on the runner directly.

The container bind-mounts the repo (so edits and `node_modules` live on the
host as usual) and forwards the Astro dev server on port **4324**. Rootless
podman keeps host file ownership automatically; under rootful docker the
container runs as the host user for the same reason. The image rebuilds
automatically when the `Dockerfile` changes (tracked via a `.image.stamp`
file); `touch Dockerfile` forces a rebuild.

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
| `src/components/SlideEmbed.astro` | iframe embed component; shows "Open slides ↗" by default, or "Download PDF ↓" when a `pdf` prop is passed |
| `scripts/build-pdfs.mjs` | Finds all `*-in-flight-notes.md` files and exports them as PDFs alongside the HTML in `public/brief-slides/` |
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

## Discoverability and social cards

This site is one of several that share a single GitHub Pages origin,
`open-aviation-solutions.github.io`, each served under its own base path
(here, `/open-aviation-briefings`). That shared-origin layout drives a few
SEO decisions:

- **Sitemap** — generated by `@astrojs/sitemap` (in the integrations array).
  `astro build` emits `sitemap-index.xml` + `sitemap-0.xml` at the site root,
  with absolute URLs under this site's base path. Each sub-site has its own
  sitemap; there is no combined one.
- **`robots.txt` does *not* belong here.** A `robots.txt` placed in `public/`
  would be served at `/open-aviation-briefings/robots.txt`, which crawlers
  ignore — `robots.txt` is only honoured at the origin *root*
  (`open-aviation-solutions.github.io/robots.txt`). That root is owned by a
  separate `project-websites-root` deploy, which is where the shared
  `robots.txt` (advertising every sub-site's sitemap) lives. Do not add one
  here.
- **Social card (`og:image`)** — `public/og-image.png` is the Open Aviation
  Solutions brand card (1200×630), with the canonical copy in the `website`
  repo. The `og:image` / `twitter:image` tags in `astro.config.mjs` point at
  it via this site's absolute base-path URL. If the brand card is redesigned,
  update it in the `website` repo first, then copy it here.
- Starlight emits per-page `og:title`, `og:description`, `og:type`, and
  `twitter:card` from page frontmatter by default — no extra config needed.
