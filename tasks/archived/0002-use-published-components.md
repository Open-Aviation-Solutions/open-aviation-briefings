# 0002 — Use published components package via CDN

**Status:** done

## Background

`marp.config.js` currently injects per-component scripts from a local symlink
(`open-aviation-components -> ../open-aviation-components/dist`). The symlink
exists only for quick iteration during local development; the package is already
published to npm as `@open-aviation-solutions/components`. The goal is to
remove the symlink and treat the components as a normal external dependency,
referencing the published build via a CDN URL.

## Dependency

This task depends on **`open-aviation-components` repo, task 0004** (separate
registration from class exports, fix Three.js externalisation). The right CDN
URL and import pattern to use here depends on which build artefact that work
produces:

- If task 0004 ships a dedicated `dist/lib/define.es.js` (the CDN drop-in with
  Three.js bundled), use that URL here.
- If Three.js ends up external in all builds, a `<script type="module">`
  approach requires either an import map or a bundled variant — this task
  cannot be completed cleanly until that is settled.

Until task 0004 is resolved, the pragmatic interim setup is a `file:` devDependency
pointing at the local sibling repo (see Development setup below).

## Key findings

### Selective import is not possible with the current lib

All three custom elements (`four-forces`, `climb-performance`,
`flight-path-overview`) are registered at the **module top level** via
`customElements.define(...)` in the lib bundle. Loading the module registers
all three, unconditionally. `open-aviation-components` task 0004 addresses
this by separating the registration side effect into a dedicated entry point.

The lib is currently self-contained at ~189KB because Three.js is bundled
inline in the ES output (inconsistently — the UMD externalises it).
`open-aviation-components` task 0004 will make this intentional or correct it.

### One script tag replaces the COMPONENT_SCRIPTS map

The current approach maintains a `COMPONENT_SCRIPTS` map of hashed Vite
app-build filenames and injects only the scripts used in each deck. With
the published lib, a single `<script type="module" src="CDN_URL">` registers
all components. The per-component map and injection logic can be replaced with
one unconditional (or presence-guarded) injection.

CDN URLs (pin to a specific version — exact path depends on task 0004 outcome):

```
https://cdn.jsdelivr.net/npm/@open-aviation-solutions/components@VERSION/dist/lib/define.es.js
```

The version could be read dynamically from
`node_modules/@open-aviation-solutions/components/package.json` at build time
to avoid hardcoding.

### Asset paths (`.glb` model, images)

The components load a `.glb` aircraft model. In the current setup it is served
from the symlinked path. When using the CDN lib, the component must resolve the
model URL relative to the CDN — verify that the published lib either bundles
the model as a data URL or fetches it from a CDN-relative path, and that this
still works in a Marp HTML context.

## Development setup (interim, pre-CDN)

Replace the manual symlink with a `file:` devDependency so the local sibling
repo is tracked and reproducible for all contributors:

```bash
git rm open-aviation-components          # remove the manual symlink
```

In `package.json`:
```json
"devDependencies": {
  "@open-aviation-solutions/components": "file:../open-aviation-components"
}
```

```bash
npm install
```

npm v7+ creates a symlink in `node_modules` rather than copying, so live edits
in the sibling repo are reflected immediately. Asset paths in `marp.config.js`
move from `/open-aviation-components/assets/...` to
`/node_modules/@open-aviation-solutions/components/assets/...`.

Before committing a release, swap the `file:` entry for the pinned npm version
and regenerate the lockfile.

## Plan (CDN migration, pending task 0004)

1. `git rm open-aviation-components` to remove the symlink (or transition from
   `file:` devDependency if that interim step was done first).
2. Rewrite `marp.config.js` to inject a single CDN script tag for the lib,
   keyed on whether any component tag appears in the markdown.
3. Verify the `.glb` model loads from the CDN context in both dev server and
   HTML export.
4. Test all three components in the dev server and in a PDF export.
5. Update task 0001 — once the symlink is gone, the dev server root constraint
   is reduced (no longer needs to serve the symlink target), though the base-URL
   question for export remains.
