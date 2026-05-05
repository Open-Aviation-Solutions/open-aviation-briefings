# 0003 — Astro/Starlight integration

**Status:** done

## Goal

Add Astro/Starlight as the primary documentation framework alongside the existing
Marp slide pipeline. Starlight provides the lesson system (instructor notes,
navigation, search); Marp generates slide decks that are embedded in and linked
from Starlight pages.

## Proposed directory structure

```
open-aviation-lessons/
  brief-slides/                        ← Marp source (renamed from lessons/)
    recreational-pilot-license/
      01-effects-of-controls/
        02-theory-part-1.md
  brief-assets/                        ← static assets used by briefs (renamed from assets/)
  src/                                 ← Astro/Starlight source
    components/
      SlideEmbed.astro                 ← iframe + full-screen link component
    content/
      docs/                            ← Starlight content (src/content/docs/ is the Starlight default)
        recreational-pilot-license/
          01-effects-of-controls/
            index.mdx                  ← instructor notes, embeds slides via SlideEmbed
  public/
    brief-slides/                      ← Marp build output (gitignored)
    brief-assets -> ../brief-assets    ← symlink; Astro/Vite follows it during dev and build
  astro.config.mjs
  marp.config.js
  package.json
```

`src/content/docs/` is a fixed three-level path: `src/` is Astro's source
convention, `content/` is Astro's content collections system, `docs/` is
Starlight's collection name. All three levels are load-bearing framework
conventions and not worth fighting.

## Build process

Marp must run before Astro so the slide HTML exists in `public/brief-slides/`
when Astro builds (Astro copies `public/` verbatim into `dist/`).

```json
"scripts": {
  "marp:build": "marp --config marp.config.js --input-dir ./brief-slides -o ./public/brief-slides",
  "build": "npm run marp:build && astro build",
  "dev": "npm run marp:build && astro dev"
}
```

For slide authoring with hot reload, run Marp in watch mode in a second terminal:

```bash
marp --config marp.config.js --input-dir ./brief-slides -o ./public/brief-slides --watch
```

The Marp `--server` mode (which includes the presenter view) remains useful for
slide authoring and reviewing presenter notes during development. Run it
separately on its own port when needed:

```bash
marp --server . --config marp.config.js   # presenter view at /presenter
```

Note: `marp --notes` can generate a `.txt` file of presenter notes as a build
artefact, but this is not planned for inclusion in the Astro site — the dev
server presenter view is the preferred workflow for notes.

## Slide embedding in Starlight pages

A reusable `SlideEmbed.astro` component renders the iframe preview and the
full-screen link together. Example usage in a lesson `index.mdx`:

```mdx
---
title: Effects of Controls — Theory Part 1
---

import SlideEmbed from '../../../components/SlideEmbed.astro'

## Brief

<SlideEmbed src="/brief-slides/recreational-pilot-license/01-effects-of-controls/02-theory-part-1.html" title="Effects of Controls — Theory Part 1" />

## Instructor notes

...
```

The component renders:
- An `<iframe>` at 16:9 aspect ratio for the inline preview (keyboard nav works
  within the iframe)
- A "Open slides ↗" link (`target="_blank"`) below the iframe for full-screen
  viewing

## Assets

`brief-assets/` lives at the repo root. This keeps the Marp `--server` presenter
view working (it serves from `.`, so `/brief-assets/...` resolves directly).

`public/brief-assets` is a symlink to `../brief-assets`. Astro/Vite follows
symlinks during both `astro dev` serving and the `astro build` copy into
`dist/`, so `/brief-assets/...` paths work in all contexts without a copy step.
Only `public/brief-slides/` (the Marp HTML output) needs to be gitignored;
`public/brief-assets` is a tracked symlink.

## Decisions

- **Concurrent dev tooling**: keep as separate terminal commands for now.
- **Starlight sidebar**: auto-generated ordering is fine; lesson files are
  already prefixed with numbers (`01-`, `02-`, …). Course-level ordering can be
  revisited once there is more than one course.
- **URL structure**: default mirroring of `brief-slides/` source tree is fine.

## Implementation steps

1. Rename `lessons/` → `brief-slides/` and `assets/` → `brief-assets/`; update
   `marp.config.js` / `package.json` references.
2. Create symlink `public/brief-assets -> ../brief-assets`.
3. Initialise Astro with Starlight in this repo (`npx astro add starlight` or
   `npm create astro` with the Starlight template).
4. Update build scripts as above; add `public/brief-slides/` to `.gitignore`.
5. Build `SlideEmbed.astro` component.
6. Create the first Starlight lesson page (`src/content/docs/recreational-pilot-license/01-effects-of-controls/index.mdx`)
   using `SlideEmbed` and placeholder instructor notes.
7. Verify the full build pipeline end-to-end.
8. Decide on concurrent dev tooling.
