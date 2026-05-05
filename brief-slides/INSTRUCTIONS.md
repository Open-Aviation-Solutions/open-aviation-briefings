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

## Presenter notes

HTML comments within a slide become presenter notes, visible in `npm run marp:serve`:

```markdown
<!-- Instructor: Ask students to name the four forces before revealing the list. -->
```

Do not use HTML comments for any other purpose (e.g. license headers) as they will appear as presenter notes.
