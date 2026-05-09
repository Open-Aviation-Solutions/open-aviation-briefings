# brief-slides

Marp slide source for aviation flight briefs. Each `.md` file compiles to a self-contained HTML slide deck via `npm run marp:build`.

## Frontmatter

Every brief slide file must include the following frontmatter fields:

```yaml
---
marp: true
title: <human-readable title of the brief>
license: CC-BY-SA-4.0
---
```

- `marp: true` — required for Marp to process the file
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

The default theme (`open-aviation`) is a 1280×720 landscape deck. In-flight training notes use `open-aviation-portrait` instead, which inherits all branding from the base theme but renders at A4 portrait (210×297 mm) for display on an instructor's portrait tablet or printing.

Set the theme per-file in frontmatter:

```yaml
---
marp: true
theme: open-aviation-portrait
title: Effects of Controls — In-Flight Notes
license: CC-BY-SA-4.0
---
```

The default theme (`open-aviation`) applies when no `theme` key is set.

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
