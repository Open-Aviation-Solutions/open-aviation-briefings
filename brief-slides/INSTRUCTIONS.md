# brief-slides

Marp slide source for aviation flight briefs. Each `.md` file compiles to a self-contained HTML slide deck via `npm run marp:build`.

## Frontmatter

Every brief slide file must include the following frontmatter fields:

```yaml
---
marp: true
theme: open-aviation
title: <human-readable title of the brief>
license: CC-BY-SA-4.0
---
```

- `marp: true` — required for Marp to process the file
- `theme` — `open-aviation` for the standard 1280×720 landscape deck, or `open-aviation-portrait` for A4 portrait in-flight notes (see [Themes](#themes))
- `title` — used by the browser tab and presenter view
- `license` — all brief content is licensed under Creative Commons Attribution-ShareAlike 4.0 International (see [LICENSE-CC-BY-SA](../LICENSE-CC-BY-SA))

Two optional fields:

- `pdf: true` — opts the deck in to PDF export (`npm run marp:pdf`, via `scripts/build-pdfs.mjs`). The PDF is written alongside the HTML in `public/brief-slides/`. Used for printable documents such as in-flight notes; typically paired with the portrait theme.
- `draft: true` — renders a faint diagonal "DRAFT" watermark across every slide, to flag a brief that is still a work in progress. The watermark carries through to the Starlight instructor-notes page via the embedded slide iframe. Omit the field (the default) for finished briefs.

## Directory structure

Briefs are organised by course, mirroring the Astro content tree under `src/content/docs/`:

```
brief-slides/
  <course-slug>/
    <lesson-number>-<lesson-slug>/
      <slide-number>-<brief-slug>.md
```

Example: `brief-slides/recreational-pilot-license/01-effects-of-controls/02-theory-part-1.md`

## Themes

Two themes are available:

- `open-aviation` — 1280×720 landscape, used for the standard briefing decks.
- `open-aviation-portrait` — A4 portrait (210×297 mm) for in-flight notes displayed on a portrait tablet or printed. Inherits all branding from the base theme.

The `theme` key must be set explicitly in frontmatter; there is no implicit default. Marp CLI's `theme` config option behaves as an override (forcing every deck to one theme) rather than a default, so it isn't set in `marp.config.js`.

Example for in-flight notes:

```yaml
---
marp: true
theme: open-aviation-portrait
title: Effects of Controls — In-Flight Notes
license: CC-BY-SA-4.0
---
```

### Whiteboard planning page (portrait theme)

The portrait theme provides a planning-page layout for printable briefing notes: a page where the instructor sketches their whiteboard plan and fills in their own running order. Apply `<!-- _class: planning -->` to the slide; the `.sketch-area` (bordered, faint grid) then fills all remaining page height. Optionally pair it with a ruled `.running-order` column inside `.planning-columns`:

```markdown
<!-- _class: planning -->

# Plan your whiteboard

<div class="planning-columns">

<div class="running-order">

### My running order

</div>

<div class="sketch-area"></div>

</div>
```

The blank lines inside the `<div>`s are required so the inner content is still parsed as markdown. Omit the `.planning-columns` wrapper and use a bare `<div class="sketch-area"></div>` for a full-width sketch area.

## Layout utilities

The theme provides composable utility classes for positioning and sizing any element — images or custom components.

**Direction** (sets float, adds margin):

| class | effect |
|-------|--------|
| `right` | float right |
| `left` | float left |

**Size** (sets width; height scales naturally, or set explicitly):

| class | width |
|-------|-------|
| `small` | 25% |
| `medium` | 40% |
| `large` | 55% |

**Effect:**

| class | effect |
|-------|--------|
| `drop-shadow` | soft drop shadow |

Classes compose freely. For custom components, add `class=` to the element tag:

```html
<pitch-roll-yaw class="right medium" height="400px" …></pitch-roll-yaw>
```

For images, leading layout directive words in the alt text are applied as classes automatically — the rest of the alt text is preserved as the accessible description:

```markdown
![right medium A diagram of the four forces](diagram.png)
![left small](checklist.png)
```

Marp's own image directives (`drop-shadow`, `w:`, `h:`, etc.) still work and can be combined freely:

```markdown
![right medium drop-shadow A diagram of the four forces](diagram.png)
```

### Inline video and audio

`<video>` and `<audio>` are treated as block-level elements (like the hyphenated
custom components) and accept the same layout classes via `class=`. This lets a
looping clip float alongside slide text:

```html
<video class="right medium" autoplay loop muted playsinline
  src="/brief-assets/<course>/<lesson>/clip.mp4"></video>
```

Leave a blank line above and below the tag so it's parsed as a block rather than
wrapped in a paragraph. (markdown-it doesn't treat `video`/`audio` as block-level
by default; the `customElementBlock` plugin in `marp.config.js` adds them.)

## Presenter notes

HTML comments within a slide become presenter notes, visible in `npm run marp:serve`:

```markdown
<!-- Instructor: Ask students to name the four forces before revealing the list. -->
```

Do not use HTML comments for any other purpose (e.g. license headers) as they will appear as presenter notes.
