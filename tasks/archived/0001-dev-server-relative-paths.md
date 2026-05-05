# 0001 — Dev server: static asset paths and root-directory constraint

**Status:** resolved — running from repo root is the accepted approach

## Resolution

- `npm run serve` renamed to `npm run dev` for clarity and consistency.
- Running `npm run dev` from the repo root is the accepted workflow. Marp
  discovers all `.md` files recursively (cosmetically noisy) but compiles
  lazily, so there is no performance concern.
- Local static assets live in `assets/` at the repo root and are served at
  `/assets/…` by the dev server.
- `npm run build` copies `assets/` into `dist/` so the built tree is
  self-contained when served from a web root.
- The `open-aviation-components` symlink constraint is tracked separately in
  task 0002.

## Background

The dev server (`npm run dev`) runs Marp in `--server` mode. Marp's server
uses the path you pass as both the **static file root** (for serving assets
via absolute URL paths like `/open-aviation-components/…`) and the
**markdown discovery directory** (for finding `.md` files to render).

The interactive web components built in `../open-aviation-components` are
served at `/open-aviation-components/assets/<hash>.js`. For these URLs to
resolve, the server root must be the repo root — the directory that contains
the `open-aviation-components/` symlink.

There is no Marp CLI flag to separate the two concerns (static root vs.
discovery directory).

## Original setup (for reference)

- `npm run dev` runs `marp --server . --config marp.config.js` from the
  repo root.
- `open-aviation-components` at the repo root is a symlink:
  `open-aviation-components -> ../open-aviation-components/dist`
- To view a specific lesson, navigate directly to its URL, e.g.
  `http://localhost:8080/lessons/recreational-pilot-license/01-effects-of-controls/02-theory-part-1`

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

## Remaining open question

Distribution of `open-aviation-components/` scripts in the built `dist/` tree
(HTML, PDF, PPTX export) is tracked in task 0002.
