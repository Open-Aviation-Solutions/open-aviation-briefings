# 0004 — Migrate Effects of Controls lesson from Slidev to Marp

**Status:** completed

## Goal

Port the full content of Lesson 1 — Effects of Controls — from the legacy
Slidev project at `../recreational_pilot_license_slides/` into the Marp +
Astro/Starlight system in this repo. The existing `02-theory-part-1.md` deck
in `brief-slides/recreational-pilot-license/01-effects-of-controls/` is a
proof-of-concept slice and will be replaced (and renumbered) by this work.

Theme work is **out of scope** — to be handled separately.

## Source files

Slidev source lives in `../recreational_pilot_license_slides/`:

| Slidev file | Migration target |
|---|---|
| `01-effects-of-controls.1-pre-lesson-info.md` | Astro page: extend `src/content/docs/recreational-pilot-license/01-effects-of-controls/index.mdx` |
| `01-effects-of-controls.2-theory-part-1.md` | Marp deck: `brief-slides/.../01-effects-of-controls/01-theory-part-1.md` |
| `01-effects-of-controls.2-theory-part-2.md` | Marp deck: `brief-slides/.../01-effects-of-controls/01-theory-part-2.md` |
| `01-effects-of-controls.3-flight-brief.md` | Marp deck: `brief-slides/.../01-effects-of-controls/02-pre-flight-brief.md` |
| `01-effects-of-controls.4-in-flight-notes.md` | Marp deck: `brief-slides/.../01-effects-of-controls/03-in-flight-notes.md` |
| `01-effects-of-controls.5-post-flight-debrief.md` | Marp deck: `brief-slides/.../01-effects-of-controls/04-post-flight-debrief.md` |

The pre-lesson info becomes the surrounding instructor-page content for the
Astro lesson page; the four flight phases each become a Marp deck embedded
via `<SlideEmbed>` on that page. The slide-deck numbering `01–04` reflects
the four embedded decks (theory has two parts sharing the `01` prefix).

## Component inventory

### Already published in `@open-aviation-solutions/components`

These are usable in Marp today via the auto-injected CDN script — no work needed.

- `<four-forces>` — already used in the PoC theory slide
- `<flight-path-overview>` — used heavily across Slidev decks for waypoint nav
- `<climb-performance>` — not used in this lesson but available

### Already local in this repo

- `<youtube-video>` (in `components/youtube-video.js`) — supports `video-id`
  and `start` attributes; replaces all Slidev `<Youtube>` usages.

### Custom Slidev components NOT yet ported — these block migration

Each is currently a Vue single-file component in
`../recreational_pilot_license_slides/components/`. Each needs to be rewritten
as a framework-agnostic web component.

| Slidev component | Target tag | Where it lives | Used in |
|---|---|---|---|
| `PiperViewer.vue` (560 lines) | `<pitch-roll-yaw>` | published in `@open-aviation-solutions/components` | theory part 1 — three axes of flight |
| `HillClimbDemo.vue` (416 lines) | `<secondary-effect-climb-car>` | local — `components/secondary-effect-climb-car.js` | theory part 1 — secondary effect of elevator (car analogy) |
| `AeroDemo.vue` (381 lines) | `<secondary-effect-elevator>` | local — `components/secondary-effect-elevator.js` | theory part 1 — secondary effect of elevator (aeroplane) |

**`<pitch-roll-yaw>`** is general enough to belong in the published
component library. The port is tracked by a separate task,
`open-aviation-components/tasks/0006-pitch-roll-yaw.md`, which is a hard
blocker for theory-part-1 in this repo. That component reuses the same
`aircraft.glb` model already served by `<four-forces>` — no new 3D asset
work is needed in this repo.

**The other two physics sims are not yet ready to be promoted** — they're
specific to one secondary-effect explanation in one lesson. They live as
local custom elements in this repo's `components/` directory and are
registered in the `LOCAL_COMPONENTS` map in `marp.config.js`, alongside
`youtube-video`. If they later prove reusable, promote them to the
published package then.

## Slidev → Marp feature mapping

The Slidev decks rely on Vue/Slidev features that have no native Marp equivalent.
For each, this task picks the simplest viable approach:

| Slidev feature | Marp approach |
|---|---|
| `<v-click>` / `<v-clicks>` (progressive reveal of arbitrary blocks) | **Drop the progressive reveal.** Show all content on the slide at once; the instructor discusses items in order during the brief. Where the reveal is genuinely load-bearing (e.g. a question/answer), split into two slides. |
| `:planePosition="$clicks"` on `<flight-path-overview>` | Use the visible-control buttons added in `open-aviation-components/tasks/0007-flight-path-overview-instructor-controls.md` — opt in via the `controls` attribute. The instructor clicks **Start flight** (gear-up lever) at departure to begin the timer, and clicks **Direct-To** once per slide to advance the plane to the next waypoint. Soft dependency — slides can fall back to literal `plane-position` attributes (and skip the timer) if 0007 isn't ready in time. |
| `layout: cover` (title slides) | Marp default theme's `<!-- _class: lead -->` directive. |
| `layout: image-right` / `image-left` | Marpit background-image directives, e.g. `![bg right:40%](path)`. Avoid adding new layout CSS unless the result looks wrong; keep the marp.config.js layout footprint small. |
| `subtitle:` per-slide frontmatter (panair theme) | **Keep the subtitle.** Marp has no built-in subtitle directive, so render it as the first body line in italics directly under the `# Title` (e.g. `_The effects of the aeroplane controls_`). When the theme work happens later, it can be promoted into a proper subtitle slot via CSS — keeping the source markup consistent now makes that easy. |
| `imageClick` (image revealed on click N) | Drop or split into two slides if the reveal matters. |
| `<Youtube id="X" :width="W" :height="H" />` | `<youtube-video video-id="X" />` — sizing is handled by the component's CSS (16:9 responsive); remove width/height props. Use `start="N"` for the `?start=N` form. |
| `<FlightPathOverview :topics="[...]" :planePosition="..." arrivalLabel="..." />` | `<flight-path-overview plane-position="0" arrival-label="...">` — the `topics` array becomes `<topic label="..." time="N"></topic>` child elements (verify the published component's API before migrating). |
| KaTeX math (e.g. `$V_{FE}$`) | Marp-core ships with KaTeX enabled by default — works as-is. |
| Slidev `<!-- presenter notes -->` | Marp uses the same `<!-- ... -->` syntax for presenter notes — most notes can be lifted verbatim. |

### Confirmed: `<flight-path-overview>` API gaps

Reading `../open-aviation-components/src/components/FlightPathOverview/index.ts`
and `sharedState.ts`:

- **`plane-position`** is already a supported observed attribute (line 171).
- **`topics`** is a JS-property setter only (line 422). There is no
  attribute or child-element form for declaring topics in markup. Each
  Marp slide that uses an FPO will need an inline `<script>` to set
  `.topics = [...]` until a markup form is added. Flagged as a possible
  follow-up task in the components repo — not blocking this migration.
- **Instructor controls (Start flight, Direct-To)** are tracked separately
  by `open-aviation-components/tasks/0007-flight-path-overview-instructor-controls.md`.
  Soft dependency for this migration.

## Layout / engine changes likely needed

- **Verify** that Marpit's `![bg right:40%](path)` syntax composes cleanly
  with custom-element children before relying on it across all decks. If it
  doesn't, add an `image-right` / `image-left` class to `marp.config.js`
  alongside the existing `interactive` class.
- The existing `interactive` class only registers `four-forces`,
  `flight-path-overview`, `climb-performance`, and `youtube-video` as the
  right-column child. If `<pitch-roll-yaw>`, `<secondary-effect-climb-car>`,
  or `<secondary-effect-elevator>` need the two-column layout, add them to
  the selector list.
- Add `pitch-roll-yaw` to the `PUBLISHED_COMPONENTS` array in
  `marp.config.js` (the existing CDN script tag will then register it).
- Add `secondary-effect-climb-car` and `secondary-effect-elevator` to the
  `LOCAL_COMPONENTS` map, each pointing at
  `/components/<file>.js`, so the script-injection logic loads them when
  used.

## Assets to copy

From `../recreational_pilot_license_slides/public/rpl-a/01/`
to `brief-assets/recreational-pilot-license/01-effects-of-controls/`:

- `aileron-roll.gif`
- `car-banked.jpg`
- `clock-codes.svg`
- `elevator-pitch.gif`
- `piper_warrior_model.jpg`
- `propeller-slipstream.png`
- `reddit-hand-wing.png`
- `rudder-yaw.gif`
- `scan-technique.png`
- `ybth-to-training-area.png`

The existing `forces-on-hand-wing.mp4` already lives in the target directory
and is referenced by the theory deck.

Update all asset references in migrated decks from `/rpl-a/01/<file>`
to `/brief-assets/recreational-pilot-license/01-effects-of-controls/<file>`.

## Plan of work

Steps are ordered so each can be tested before moving to the next. Steps 1–3
can land independently; steps 5–8 each need step 4 done and the relevant
custom components available (per step 2's outcome).

1. **Copy static assets** into `brief-assets/recreational-pilot-license/01-effects-of-controls/`.
   - No dependencies; fast win.
   - Verify via `npm run dev` that any image at `/brief-assets/.../<file>` resolves.

2. **Track the `<pitch-roll-yaw>` port** in the components repo as
   `open-aviation-components/tasks/0006-pitch-roll-yaw.md`. Bump this
   repo's `@open-aviation-solutions/components` dependency once it lands
   and add `pitch-roll-yaw` to `PUBLISHED_COMPONENTS` in `marp.config.js`.
   **Done.** `@open-aviation-solutions/components` bumped to `^0.1.3`,
   `pitch-roll-yaw` registered in `PUBLISHED_COMPONENTS` and added to
   the `interactive` layout selector list in `marp.config.js`.

3. **Port the two local physics components** into `components/` in this repo. **Done.**
   - `components/secondary-effect-climb-car.js` — port of `HillClimbDemo.vue`
     (Matter.js car-on-hill, throttle slider). `matter-js` is loaded from
     `https://esm.sh/matter-js@0.20.0` at first use because the repo has
     no build step for components; if offline use becomes a requirement,
     vendor it locally instead.
   - `components/secondary-effect-elevator.js` — port of `AeroDemo.vue`
     (2D aeroplane with throttle + elevator sliders). No external deps.
   - Both registered in `LOCAL_COMPONENTS` in `marp.config.js` and added
     to the `interactive` layout selector list so they land in the right
     column when a slide opts into `<!-- _class: interactive -->`.
   - Both honour a `height` attribute (default `320px`).
   - **Not yet exercised in any slide** — first end-to-end render will
     happen as part of step 6 (theory part 1). Recommend a quick smoke
     test before relying on them in the full deck: drop each tag into a
     temporary slide, run `npm run marp:build`, open the resulting HTML,
     and confirm the canvas renders and the sliders drive the sim.

4. **Track the `<flight-path-overview>` instructor controls** task at
   `open-aviation-components/tasks/0007-flight-path-overview-instructor-controls.md`
   (Start-flight gear lever + single-shot Direct-To button, opt-in via
   a `controls` attribute). **Done** — shipped in
   `@open-aviation-solutions/components@0.1.3` alongside the
   `pitch-roll-yaw` element. Slides should opt in via `controls` and a
   starting `plane-position`. Topics are now declared via `<fpo-topic>`
   child elements (see lessons learned below) — no inline `<script>` needed.

5. **Migrate the Astro lesson page** (`src/content/docs/recreational-pilot-license/01-effects-of-controls/index.mdx`):
   - Replace placeholder content with pre-lesson-info: documents-to-print,
     example email template, links.
   - Add five `<SlideEmbed>` sections, one per deck, in flight-phase order:
     theory part 1, theory part 2, pre-flight brief, in-flight notes,
     post-flight debrief.
   - Update the page `title:` frontmatter to "Effects of Controls" (drop
     the "Theory Part 1" suffix from the PoC).

6. **Migrate theory part 1** to `brief-slides/.../01-effects-of-controls/01-theory-part-1.md`:
   - Delete the PoC `02-theory-part-1.md` once the new deck builds and
     the Astro page links to the new path.
   - Apply the Slidev → Marp mapping above slide-by-slide.
   - For each `<flight-path-overview>` slide: if the instructor-controls
     enhancement (step 4) has landed, render the FPO with `controls`
     and a starting `plane-position` so the instructor can Direct-To at
     the right moment. Otherwise, set `plane-position` literally and
     omit the timer.

7. **Migrate theory part 2** to `01-theory-part-2.md` — same patterns;
   uses `<flight-path-overview>` 3× and image assets only.

8. **Migrate pre-flight brief** to `02-pre-flight-brief.md` — multiple
   `<flight-path-overview>` waypoints, two image-right slides (scan
   technique, training-area map), no custom physics components.

9. **Migrate in-flight notes** to `03-in-flight-notes.md`. The Slidev
   source for this is plain headings (no Slidev frontmatter); convert
   each `##` section to a slide. This deck has no custom components.

10. **Migrate post-flight debrief** to `04-post-flight-debrief.md` — uses
    `<flight-path-overview>` 3× and is otherwise text-only.

11. **Verify end-to-end** with `npm run build` and a manual pass through
    the Astro page in `npm run dev`: every `<SlideEmbed>` loads, every
    custom element renders, every asset path resolves, and presenter notes
    appear in `npm run marp:serve`.

12. **Cleanup**:
    - Remove the PoC `02-theory-part-1.md` once `01-theory-part-1.md`
      is in place and embedded by the Astro page.
    - If new layout classes were added to `marp.config.js`, document
      them in the root `INSTRUCTIONS.md`.
    - Archive this task file once steps 1–11 are complete.

## Lessons learned — re-use these for future lesson migrations

### Deck-file numbering when theory has multiple parts

If the lesson's pre-flight theory is split into two (or more) parts, both
parts share the `01` slot. The five-deck layout used here is:

```
01-theory-part-1.md
01-theory-part-2.md
02-pre-flight-brief.md
03-in-flight-notes.md
04-post-flight-debrief.md
```

If theory is a single deck, drop one and renumber: `01-theory.md`,
`02-pre-flight-brief.md`, `03-in-flight-notes.md`, `04-post-flight-debrief.md`.

### `<flight-path-overview>` topics — declarative `<fpo-topic>` children

Topics are declared as `<fpo-topic>` child elements. The **first child is
the departure label** (rendered under the left runway); the remaining
children are waypoints. Use `&#10;` for newlines and `&amp;` for `&` inside
attribute values.

```html
<flight-path-overview plane-position="0" arrival-label="Arrival" controls>
  <fpo-topic label="Learning&#10;Objectives" time="2"></fpo-topic>
  <fpo-topic label="Pitch, Roll and Yaw &amp;&#10;the Three axes of aeroplane flight" time="4"></fpo-topic>
  <fpo-topic label="The Primary &amp; Secondary effects&#10;of each main control" time="10"></fpo-topic>
  <fpo-topic label="Recap" time="4"></fpo-topic>
</flight-path-overview>
```

The first FPO instance with `<fpo-topic>` children seeds the shared flight
plan; subsequent instances with no children inherit it automatically via a
`MutationObserver`-backed shared state. Subsequent waypoint slides only need
`plane-position` (and `arrival-label` if non-default — see note below).

**Why the old inline-script approach broke subsequent instances:** The
component's `_renderStructural()` runs once in `connectedCallback`. If
topics are null at that point (as they were when set via a `<script>` that
ran after the element connected), the SVG is hidden with `display:none`.
The shared-state subscription only triggers `_renderTransform()` — not
`_renderStructural()` — so the SVG stayed hidden on all but the first
instance. The declarative child-element form avoids this entirely.

**`arrival-label` — per-instance, not shared.** The default is `ARRIVAL`
(all caps). Set `arrival-label="Arrival"` on each instance that needs the
title-case form; it is not propagated through shared state.

### Published components — served locally, not from CDN

`marp.config.js` no longer injects a jsDelivr CDN URL for `PUBLISHED_COMPONENTS`.
Instead, `public/open-aviation-components` is a symlink to
`node_modules/@open-aviation-solutions/components/dist/lib`, and slides
get `<script type="module" src="/open-aviation-components/define.es.js">`. This makes
slides work offline and removes CDN version-pinning. For local component
development, `npm link ../open-aviation-components` in this repo is enough;
rebuild with `npm run build:lib` in the components repo and then
`npm run marp:build` here.

### `plane-position` per slide — Direct-To convention

For each FPO-bearing slide, set `plane-position` to one waypoint *behind*
the slide's named waypoint and rely on the `controls` attribute to render
the instructor Direct-To button. The instructor clicks Direct-To once per
slide to advance the plane. This preserves the original Slidev
`:planePosition="N + $clicks"` semantics. Use `arrival-label="Arrival"`
for theory/brief decks and `arrival-label="Done"` for the debrief deck.

### Astro page skeleton

Every lesson page should follow the same shape so the sidebar and the
student-handout / email blocks stay consistent. Template:

```mdx
---
title: <Lesson Name>
---

import SlideEmbed from '../../../../components/SlideEmbed.astro'

<one- or two-sentence aim of the lesson>

## Documents to print for the lesson

- <handouts, kneeboard PDFs, etc.>

## Example email to the student before the lesson

> **Subject:** ...
>
> ...

## Theory — Part 1
<SlideEmbed src="..." title="..." />

## Theory — Part 2
<SlideEmbed src="..." title="..." />

## Pre-flight brief
<SlideEmbed src="..." title="..." />

## In-flight notes
<SlideEmbed src="..." title="..." />

## Post-flight debrief
<SlideEmbed src="..." title="..." />
```

### Marp build artefacts are sticky

`npm run marp:build` does **not** clean orphan HTML in `public/brief-slides/`.
If a deck source file is renamed or deleted, manually `rm` the corresponding
HTML — otherwise the dev iframe will keep loading the stale build silently.
Worth doing as the first step when restructuring decks.

### Subtitle pattern (until theme work lands)

Marp has no built-in subtitle directive. Render the lesson subtitle as the
first body line in italics directly under the `# Title` (e.g.
`_The effects of the aeroplane controls_`). Keeping the markup consistent
across all decks makes it trivial to promote into a proper subtitle slot
via CSS once the theme work happens.

## Out of scope

- Theme styling (handled separately by the user).
- Migrating other lessons (02 straight-and-level, 03 climbing-and-descending,
  04 turning) — they will follow the same pattern but as separate tasks.
- Re-implementing `PiperViewer` as `<pitch-roll-yaw>` (tracked as
  `open-aviation-components/tasks/0006-pitch-roll-yaw.md`).
- Adding instructor controls to `<flight-path-overview>` (tracked as
  `open-aviation-components/tasks/0007-flight-path-overview-instructor-controls.md`).
- Adding a markup form for the `<flight-path-overview>` topics array.
  **Done** — shipped in a later version of `@open-aviation-solutions/components`;
  see the `<fpo-topic>` lessons-learned section above.
