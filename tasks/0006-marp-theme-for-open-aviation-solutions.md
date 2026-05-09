# Task 0006 — Marp theme for Open Aviation Solutions

## Decisions

| # | Decision | Resolution |
|---|----------|------------|
| 1 | Mark variant on header | Header bar is a CSS gradient `#1a5fb4 → #000` (left to right). `mark-dark.svg` sits on the right (dark) end — its blue circles merge into the dark and the white aircraft silhouette reads clearly. No new mark variant needed. |
| 2 | Right-side header content | Mark + two-line text: "Open Aviation" (white) / "Solutions" (`#4a8be8` — OAS blue-hi for dark surfaces). Composed into a single SVG lockup `brief-assets/oas-header-brand.svg`. |
| 3 | Asset reference in CSS | Absolute path (`/brief-assets/oas-header-brand.svg`) — always served correctly in both the Marp dev server and Astro prod. |
| 4 | Font bundling | `@fontsource/barlow` npm package. `public/fonts` symlinks to `../node_modules/@fontsource/barlow/files` (same pattern as `public/open-aviation-components → ../node_modules/@open-aviation-solutions/components/dist/lib`). `@font-face` rules in theme CSS reference `/fonts/barlow-*.woff2`. |
| 5 | Lead/title slide bg | OAS blue `#1a5fb4` — to be improved later. |
| 6 | Theme adoption | Engine default — add `theme: 'open-aviation'` to the top-level config object in `marp.config.js`. No per-deck `theme:` frontmatter required. |

---

## Reference material

### Design system tokens
`.claude/skills/open-aviation-design-system/colors_and_type.css` — the canonical source for all OAS colours, type scale, spacing, and radii. The typography table and colour values in this task are drawn from there; use the file directly rather than relying on the values copied here.

### Marp theme CSS model
`marp-theme-css.md` (repo root) — local reference covering the Marp/Marpit HTML structure (`<section>` = slide viewport), required `/* @theme name */` metadata, `:root` vs `section` selector precedence, header/footer positioning, pagination pseudo-element, and the `<style scoped>` tweak mechanism. Read this before writing the CSS.

### Example themes
`/home/michael/dev/3rdparty/marp-core/themes/` contains `default.scss`, `gaia.scss`, and `uncover.scss`. Useful for seeing how Marp themes handle header/footer absolute positioning (`gaia.scss`), the `lead` class pattern (`gaia.scss`), font imports, and the `section::after` pagination style.

---

## Source assets

`mark-dark.svg` lives at:
```
.claude/skills/open-aviation-design-system/assets/mark-dark.svg
```

**Mark geometry** (viewBox `0 0 175 175`): the three circles are deliberately off-centre to the left — outermost cx=87.5, middle cx=55, innermost cx=30 (r=28). The aircraft silhouette sits inside the innermost circle. The visual content spans roughly x=0–175 but the "weight" is in the left ~115px. When composing the lockup, scale the full viewBox to ~40×40 px so the mark renders at its designed proportions.

---

## Header branding lockup (`brief-assets/oas-header-brand.svg`)

A new composed asset (not a mark variant). Contents:

- The full mark from `mark-dark.svg` (all three circles + aircraft), scaled to 40×40 px (embed via `<image>` or inline the elements)
- "Open Aviation" in white, Barlow 600, ~15px
- "Solutions" in `#4a8be8`, Barlow 600, ~15px, on the line below
- Overall SVG viewBox e.g. `0 0 180 40`; the mark occupies the left ~44px, the text the remaining width

After creating this file, render a static HTML preview at `tasks/preview-oas-header-brand.html` and tell the user the path so they can open it in a browser. Do not proceed to step 3 until the user approves.

---

## `marp.config.js` changes

Current file has `themeSet: []` and `engine: class extends Marp { ... }`. Two changes:

```js
export default {
  html: true,
  theme: 'open-aviation',                        // add — sets engine default
  themeSet: ['./themes/open-aviation.css'],       // change from []
  engine: class extends Marp { ... }
}
```

The CLI `theme` key sets the fallback theme for any deck that doesn't specify one in frontmatter. Decks can still override with `theme:` in their own frontmatter.

---

## `themes/open-aviation.css` — key implementation notes

### Font faces

After installing `@fontsource/barlow`, check the actual filenames in `node_modules/@fontsource/barlow/files/` — they follow the pattern `barlow-latin-{weight}-normal.woff2`. Write `@font-face` rules for weights 400, 600, 700 pointing to `/fonts/barlow-latin-{weight}-normal.woff2`.

### Header CSS

In Marp the `<header>` element is absolutely positioned inside `<section>` with no default style. To split header text left and lockup right:

```css
header {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 56px;
  background: linear-gradient(to right, #1a5fb4, #000);
  display: flex;
  align-items: center;
  padding: 0 16px 0 24px;
  box-sizing: border-box;
}
header::after {
  content: '';
  display: block;
  width: 180px;   /* match lockup SVG aspect ratio */
  height: 40px;
  background: url('/brief-assets/oas-header-brand.svg') no-repeat center / contain;
  flex-shrink: 0;
}
```

The header's text content (from `header:` frontmatter) is a text node — it becomes the left flex child naturally. `::after` is the right flex child.

### Section padding

With the 56px header using `position: absolute`, the section content needs `padding-top: 72px` (56px bar + 16px gap) to clear it. Total padding: `72px 48px 40px`.

### `.interactive` class

Do NOT add any `.interactive` rules to the theme CSS. The `LAYOUT_CSS` block in `marp.config.js` appends those rules separately (with the required Marpit selector prefix) — duplicating them here would fight with that.

---

## Slide layout (16:9, 1280 × 720 px)

```
┌─────────────────────────────────────────────────────────────┐  56 px header bar
│  Lesson title / topic                gradient→ [Mark lockup]│  #1a5fb4 → #000
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Content area  (#f0f0eb bg)                                │  ≈ 624 px
│   padding-top: 16px (72px from slide top)                   │
│   padding sides: 48px  padding-bottom: 40px                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                                                  [pagination] bottom-right, muted
```

### Typography

| Element | Size | Weight | Colour |
|---------|------|--------|--------|
| Body | 28 px | 400 | `#2e2e3a` |
| h1 | 1.7 em | 600 | `#1a5fb4` |
| h2 | 1.35 em | 600 | `#1a1a26` |
| h3 | 1.1 em | 600 | `#1a1a26` |
| Header bar text | 17 px | 600 | `rgba(255,255,255,0.95)` |
| Pagination | 22 px | 400 | `rgba(0,0,0,0.4)` |

### `lead` class (title slides)

`<!-- _class: lead -->` — full blue background `#1a5fb4`, white text, content centred. h1 white. To be refined later.

---

## Files to create / change

| File | Action |
|------|--------|
| `brief-assets/oas-header-brand.svg` | New — mark + wordmark lockup (reviewed before anything else ships) |
| `tasks/preview-oas-header-brand.html` | Throwaway preview page — delete after approval |
| `themes/open-aviation.css` | New — Marp theme CSS |
| `marp.config.js` | Add `theme: 'open-aviation'` and change `themeSet` |
| `package.json` / `package-lock.json` | Add `@fontsource/barlow` |
| `public/fonts` | New symlink → `../node_modules/@fontsource/barlow/files` |

---

## Build sequence

1. `npm install @fontsource/barlow`; create `public/fonts` symlink; verify woff2 filenames
2. **Create `brief-assets/oas-header-brand.svg`**; write `tasks/preview-oas-header-brand.html`; tell the user the path — **stop and wait for approval before continuing**
3. Write `themes/open-aviation.css`
4. Update `marp.config.js`
5. `npm run marp:build` — open a rendered slide and confirm the header, fonts, and content area look correct
