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

## Presenter notes

HTML comments within a slide become presenter notes, visible in `npm run marp:serve`:

```markdown
<!-- Instructor: Ask students to name the four forces before revealing the list. -->
```

Do not use HTML comments for any other purpose (e.g. license headers) as they will appear as presenter notes.
