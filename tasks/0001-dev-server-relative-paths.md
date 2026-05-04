# 0001 — Dev server: static asset paths and root-directory constraint

**Status:** open — current workaround is functional but has a known limitation

## Background

The dev server (`npm run serve`) runs Marp in `--server` mode. Marp's server
uses the path you pass as both the **static file root** (for serving assets
via absolute URL paths like `/open-aviation-components/…`) and the
**markdown discovery directory** (for finding `.md` files to render).

The interactive web components built in `../open-aviation-components` are
served at `/open-aviation-components/assets/<hash>.js`. For these URLs to
resolve, the server root must be the repo root — the directory that contains
the `open-aviation-components/` symlink.

There is no Marp CLI flag to separate the two concerns (static root vs.
discovery directory).

## Current setup

- `npm run serve` runs `marp --server . --config marp.config.js` from the
  repo root.
- `open-aviation-components` at the repo root is a symlink:
  `open-aviation-components -> ../open-aviation-components/dist`
- To view a specific lesson, navigate directly to its URL, e.g.
  `http://localhost:8080/au/recreational-pilot-license/01-effects-of-controls/02-theory-part-1`

**The command must be run from the repo root.** Running it from a subdirectory
(or passing a subdirectory to `--server`) breaks the symlink resolution and
the component scripts return a 404 (served as `text/html`), which the browser
blocks as a MIME type mismatch.

## Known limitation

Serving from `.` causes Marp to recursively discover and list every `.md`
file in the repo. This is cosmetically noisy as lessons accumulate, but is
not a performance problem — Marp compiles files lazily on first access.

## Export / build: same constraint, different character

`npm run build` runs `marp --config marp.config.js --output dist/ .`. The
absolute `/open-aviation-components/assets/…` paths are baked into the output
HTML. The problem is no longer discovery — it is distribution:

- **HTML output** only works if served from a web server root that has
  `open-aviation-components/` at `/`. Opening the HTML as a `file://` URL
  fails. There is no `--base-url` or asset-bundling flag in Marp CLI.
- **PDF / PPTX / image output** uses a headless browser (Puppeteer). The
  browser blocks local file access by default; `--allow-local-files` unblocks
  it, but the injected scripts use absolute paths starting with `/`, so the
  browser tries to load `/open-aviation-components/…` relative to the
  **filesystem root** — which does not exist. The component scripts fail to
  load silently. For PDF this is largely harmless: components render as empty
  elements (same static-snapshot behaviour as Slidev's `slidev export`). For
  PPTX / PNG the same applies.
- **`env` is empty** when marp-cli calls the engine's `render` method
  (confirmed by probe). So there is no `env.filename` to compute relative
  paths from.

## Options to resolve (not yet investigated)

### Dev server
- **Separate static server:** run a second server (e.g. `npx serve . -p 3001`)
  rooted at the repo root just for static assets; change the component script
  URLs in `marp.config.js` to `http://localhost:3001/open-aviation-components/…`.
  Marp's own server could then be pointed at a specific lesson directory.
- **Publish components to a CDN or local registry:** reference the scripts
  from a fixed absolute URL instead of a path relative to the server root.

### HTML export
- **`MARP_BASE_URL` env var in the engine:** modify `marp.config.js` to read
  `process.env.MARP_BASE_URL` (default `''`). Script `src` attributes become
  `${BASE_URL}/open-aviation-components/…`. Set it to a CDN or deployed host
  URL when building for distribution; leave it empty for local-server use.
- **Copy assets post-build:** after the marp export, copy
  `open-aviation-components/` into `dist/`. The absolute paths stay the same
  and work when the dist tree is served from a web server root.

### PDF / PPTX export
- **Separate static server during conversion:** spin up `npx serve . -p 3001`
  before running the export, set `MARP_BASE_URL=http://localhost:3001` so the
  Puppeteer browser can resolve the component scripts.
- **Accept empty components in PDF:** if PDFs are handout-only (no
  interactivity needed), the empty-box rendering is acceptable and no fix is
  required. This is the same outcome as Slidev's `slidev export`.
