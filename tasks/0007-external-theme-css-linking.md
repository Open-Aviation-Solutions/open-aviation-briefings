# Task 0007 — External theme CSS linking (avoid inlining)

## Background

Marp inlines all theme CSS into every generated HTML file at build time. This is fine for
static distribution but prevents runtime theme switching (e.g. swapping a `<link>` href in
the browser). It also means theme assets like fonts and images must be resolved at build time
or via absolute URLs served at runtime.

As of this task, the theme is organised as:

| File | Purpose |
|------|---------|
| `themes/open-aviation-solutions/style.css` | Marp theme source — read at build time, inlined into HTML |
| `themes/open-aviation-solutions/header-brand.svg` | Header lockup — served at runtime via `/themes/open-aviation-solutions/header-brand.svg` |
| `public/themes` | Symlink → `../themes` — makes all theme assets available to Marp dev server and Astro |

`marp.config.js` registers the CSS via `themeSet` and sets it as the engine default via
`theme: 'open-aviation'`.

## What we learned about Marp's CSS model

- **No native option** exists to link an external stylesheet instead of inlining.
- `marp.render()` (marp-core) returns `{ html, css }` separately, but marp-cli always
  writes inlined output — there is no CLI flag to change this.
- Marp's *base* CSS (slide layout infrastructure — `section` sizing, bespoke presenter
  scaffolding) is always inlined regardless of theme configuration. Only the *theme* CSS
  can be made external.

## Proposed approach

Since the `render()` method is already overridden in `marp.config.js` to inject `<script>`
tags, the same pattern can inject a `<link>` tag instead of inlining the theme.

1. **Remove the theme from `themeSet`** — don't register any theme, so Marp inlines nothing
   for the theme layer. Marp's own base styles still inline (this is fine).
2. **Add a custom global directive** `external-theme` via Marpit's directive system:
   ```js
   this.customDirectives.global.externalTheme = ({ externalTheme }) => ({ externalTheme })
   ```
3. **In `render()`**, detect the directive and prepend a `<link>` to the HTML:
   ```js
   render(markdown, env) {
     const result = super.render(markdown, env)
     if (env.externalTheme) {
       result.html = `<link rel="stylesheet" href="${env.externalTheme}">\n` + result.html
     }
     return result
   }
   ```
4. **Slide frontmatter** uses the directive instead of `theme:`:
   ```yaml
   ---
   marp: true
   external-theme: /themes/open-aviation-solutions/style.css
   ---
   ```
5. The CSS lives in `public/themes/open-aviation-solutions/style.css` (served at
   `/themes/open-aviation-solutions/style.css` by both Marp dev server and Astro).

## Notes

- With the theme CSS external, runtime theme switching becomes possible: inject a small
  `<script>` that exposes a `setTheme(href)` function swapping the `<link>` href.
- The `/* @theme name */` comment in the CSS is only needed by Marp's themeSet resolver.
  If we stop using themeSet, it can be removed.
- Per-deck override is natural: each slide deck specifies its own `external-theme` URL,
  so multiple themes can coexist across decks without any build-time config change.
