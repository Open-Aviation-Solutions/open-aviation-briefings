# 0012 — Convert Straight and Level lesson from Slidev to Marp

**Status:** done — all decks + Astro page converted and building clean; asset
provenance resolved (placeholders replaced with public-domain FAA figures or
confirmed licences). Cruise-config numbers intentionally ship as placeholders
(out of scope — instructor to supply). Remaining is an instructor visual pass
only (see end of file).

## Goal

Port Lesson 2 — Straight and Level — from the legacy Slidev project at
`../recreational_pilot_license_slides/` into the Marp + Astro/Starlight system
in this repo, following the conventions that the Effects-of-Controls conversion
(task `0004`, now archived) actually settled on — which differ in several ways
from what `0004` originally planned. This task front-loads those learnings so
the conversion is a mechanical application of known patterns.

Theme work is **out of scope** (already done — use `theme: open-aviation` and
`theme: open-aviation-portrait`).

## Source files

| Slidev file | Migration target |
|---|---|
| `02-straight-and-level.1-pre-lesson-info.md` | Astro page content (pre-lesson info, email, resources) |
| `02-straight-and-level.2-theory.md` | Marp deck: `brief-slides/.../02-straight-and-level/01-theory.md` |
| `02-straight-and-level.3-flight-brief.md` | Marp deck: `…/02-pre-flight-brief.md` |
| `02-straight-and-level.4-in-flight-notes.md` | Marp deck: `…/03-in-flight-notes.md` (portrait) |
| `02-straight-and-level.5-post-flight-debrief.md` | Marp deck: `…/04-post-flight-debrief.md` |

Astro page (flat file, **not** an `index.mdx` in a sub-directory):
`src/content/docs/recreational-pilot-license/02-straight-and-level.mdx`.

### Deck numbering — theory is a *single* deck here

Unlike Lesson 1 (theory split into part 1 / part 2), Lesson 2 theory is one
deck. The four-deck layout is:

```
01-theory.md
02-pre-flight-brief.md
03-in-flight-notes.md
04-post-flight-debrief.md
```

## What changed between the 0004 *plan* and the 0004 *result* — apply these

The archived `0004` plan is a good narrative, but the migration ended up
diverging from it. **These are the conventions to follow** (verified against
the migrated `01-effects-of-controls/` decks and `05-stalling/`):

### 1. Flight-path component is `<briefing-overview>` / `<briefing-topic>`

Not `<flight-path-overview>` / `<fpo-topic>` (those names in the 0004 plan are
stale). Pattern:

- **First instance** (the overview slide) declares the topics and starts the
  timer with `controls-start`:
  ```html
  <briefing-overview plane-position="0" controls-start>
    <briefing-topic label="Learning&#10;Objectives" time="2"></briefing-topic>
    <briefing-topic label="The Four&#10;Forces" time="5"></briefing-topic>
    <briefing-topic label="Stability &amp;&#10;Attitude Flying" time="5"></briefing-topic>
    <briefing-topic label="Power + Attitude&#10;= Performance" time="5"></briefing-topic>
    <briefing-topic label="Recap" time="3"></briefing-topic>
  </briefing-overview>
  ```
- **Subsequent waypoint slides** inherit the topics via shared state and only
  set position + controls:
  ```html
  <briefing-overview plane-position="1" arrival-label="Arrival" controls></briefing-overview>
  ```
- Use `&#10;` for newlines and `&amp;`/`&quot;`/`&apos;`-style entities for
  `&`, `"`, `'` inside attribute values.

### 2. `plane-position` is literal, one waypoint *behind*; instructor clicks Direct-To

The Slidev `:planePosition="N+$clicks"` trick is gone. Each waypoint slide sets
`plane-position` to the index of the **previous** waypoint and relies on
`controls` so the instructor clicks **Direct-To** once to advance the plane to
this slide's waypoint. So the "Waypoint 2 — The Four Forces" slide gets
`plane-position="0"`, "Stability & Attitude Flying" gets `plane-position="1"`,
etc. The overview/cover instance uses `controls-start` and `plane-position="0"`.

`arrival-label` is **per-instance, not shared** — repeat it on each instance.
Use `arrival-label="Arrival"` for theory/brief decks and `arrival-label="Done"`
for the debrief deck (matches the Slidev `arrivalLabel`).

### 3. Per-slide `subtitle:` → deck-level `header:` frontmatter

The Slidev decks repeat `subtitle: Straight and Level Flight` on nearly every
slide. In Marp this became a single deck-level running header in frontmatter,
e.g.:
```yaml
header: "Straight and Level Flight — Pre-flight theory"
```
The lesson *subtitle on the cover/title slide* is rendered as an italic body
line under the `# Title` (see §6).

### 4. Drop all `<v-click>` / `<v-clicks>` and the hidden reveal spans

Show every bullet at once; the instructor talks through them in order. Delete
every `<span v-click style="display:none" />` helper entirely. Where a reveal
is genuinely load-bearing (e.g. the two-stage "Lesson Summary" table in
Lesson 1 that first shows blanks then the answers), split into two slides — the
straight-and-level decks have no such case except the recap, which can stay as
one slide.

### 5. Layout via theme utility classes — not Slidev layouts or `<div>` wrappers

The theme (see `brief-slides/INSTRUCTIONS.md` → "Layout utilities") provides
composable classes. Map the Slidev layouts:

| Slidev | Marp |
|---|---|
| `layout: image-right` + `image:` | `![right medium](…)` (or `large`) at top of slide body |
| `layout: image-left` + `image:` | `![left medium](…)` |
| `<div class="flex justify-right…"><img width="70%"></div>` | `![right large](…)` |
| `<img … class="max-w-xl mx-auto">` | plain `![…](…)` (centred is default); add a size class if needed |
| component `height="320px"` full-width | `<pitch-roll-yaw height="320px"></pitch-roll-yaw>` (add `class="right large"` only if a two-column layout is wanted) |

For **images**, leading directive words in the alt text become classes and the
rest stays as the accessible description:
`![right medium drop-shadow A model of a Piper Warrior](…/piper.png)`.
For **custom components**, add `class="right large"` to the tag.
Drop all Slidev `width=`/`videoClass`/`imageClass`/Tailwind utility attributes.

### 6. Cover slide shape

```markdown
<!-- _class: lead -->

# Straight and Level Flight

_CASA Recreational Pilot License (Aeroplane) — Lesson 2, Pre-flight theory_

All text and presenter notes in this briefing are licensed under [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). [More info](https://openaviation.solutions/licensing)
```

### 7. Frontmatter every deck needs

```yaml
---
marp: true
theme: open-aviation            # open-aviation-portrait for 03-in-flight-notes
title: Straight and Level — <Phase>
license: CC-BY-SA-4.0
header: "Straight and Level Flight — <Phase>"   # landscape decks only
---
```

### 8. Presenter notes & math carry over verbatim

Slidev `<!-- … -->` notes are Marp presenter notes — lift them as-is. KaTeX
(`$L_C$`, `$\rho$`, `$V^2$`, `$S$` in the notes) works in Marp-core by default.
Do **not** use HTML comments for anything other than notes.

## Component inventory — all published, no new local components

This lesson is simpler than Lesson 1: every interactive element is already in
`@open-aviation-solutions/components` and registered in `PUBLISHED_COMPONENTS`
in `marp.config.js`. No new local custom elements are needed.

| Slidev tag | Marp tag | Notes |
|---|---|---|
| `<FlightPathOverview>` | `<briefing-overview>` + `<briefing-topic>` | see §1–2 |
| `<PiperViewer height="320px" />` | `<pitch-roll-yaw height="320px"></pitch-roll-yaw>` | used twice (recap-of-L1 slide, and stability section has the 3D-model prompt) |
| `<FourForces … />` | `<four-forces …></four-forces>` | **attribute names differ — see below** |

### ⚠️ `<four-forces>` attribute names changed

The Slidev source uses `model-path`, `:vne`, `:vno`, `:vs1`, `:cruise-kts`.
The **published web component's observed attributes are**
(`define.es.js`): `height, model-path, model-rotation, model-offset, v_ne,
v_no, v_1, cruise-kts, banking, show-help`. So:

- Drop `model-path` entirely — it defaults to the bundled `aircraft.glb`
  (no need to copy or reference the glb).
- `:vne="188"` → `v_ne="188"`
- `:vno="163"` → `v_no="163"`
- `:vs1="68"` → `v_1="68"`
- `:cruise-kts="110"` → `cruise-kts="110"`

Result:
```html
<four-forces height="360px" v_ne="188" v_no="163" v_1="68" cruise-kts="110"></four-forces>
```
Verify the live render shows the ASI arcs (green/yellow) before relying on it.

## NEW pattern this lesson introduces: looping `<video>`

The theory deck embeds `hand-wing.mp4` twice as an autoplaying, looping,
muted video (Slidev `videoAutoplay/videoLoop` on an `image-right` layout). **No
migrated deck has done an inline mp4 yet**, so this needs a small spike:

- Likely form: a raw HTML `<video>` element with a layout class, e.g.
  ```html
  <video class="right medium" autoplay loop muted playsinline src="/open-aviation-briefings/brief-assets/recreational-pilot-license/02-straight-and-level/hand-wing.mp4"></video>
  ```
- `<video>` is **not** a hyphenated custom element, so the `customElementBlock`
  plugin in `marp.config.js` won't treat it as block-level — confirm
  markdown-it doesn't wrap/escape it (a surrounding blank line usually
  suffices; if not, the tag may need adding to the block-HTML handling).
- Confirm the float utility class applies to `<video>` the same way it does to
  `<img>` and custom elements. If not, fall back to a wrapping element or add a
  rule — but per the repo's "diagnose, don't work around" rule, prefer fixing
  the utility selector to cover `video`.

Note the path uses the `/open-aviation-briefings/` base prefix (see §asset note
on base path below) when referenced from the Astro page, but **within a Marp
deck** asset paths are `/brief-assets/…` (the slides are served at the site
root by Marp's own server and via the `public/brief-assets` symlink). Check how
the migrated 01 decks reference assets — they use bare
`/brief-assets/recreational-pilot-license/01-effects-of-controls/…`. Match that.

## Assets to copy

Copy from `../recreational_pilot_license_slides/public/rpl-a/02/` into
`brief-assets/recreational-pilot-license/02-straight-and-level/`:

| Source file | Action |
|---|---|
| `hand-wing.mp4` | copy (7 MB — the looping video) |
| `lift-weight-thrust-drag-2.jpg` | copy (used by "The Four Forces" slide) |
| `Aerofoil-bernoulli-false.jpg` | copy |
| `Deflection and Lift.svg` | copy **and rename** to `deflection-and-lift.svg` (no spaces) |
| `attitude-flying.png` | copy |

`lift-weight-thrust-drag.png` and `lift-weight-thrust-drag-2.png` exist in the
source but the theory deck only references `-2.jpg`; copy only what's used.

### Shared Lesson-1 assets used by the pre-flight brief

The flight brief reuses `scan-technique.png`, `clock-codes.svg`, and
`ybth-to-training-area.png` (Slidev paths `/rpl-a/01/…`). The first two are
**already migrated** under
`brief-assets/recreational-pilot-license/01-effects-of-controls/`;
`ybth-to-training-area.png` is **not yet migrated** (it's in the source
`rpl-a/01/` but wasn't copied for Lesson 1).

Decide and apply one convention:
- **Preferred:** copy the three into this lesson's own
  `02-straight-and-level/` asset dir so the deck is self-contained (the project
  already duplicates rather than cross-references — e.g. `car-banked` lives
  under 01). Then reference `…/02-straight-and-level/scan-technique.png`.
- Avoid cross-lesson `…/01-effects-of-controls/…` references from a Lesson-2
  deck.

### Attribution sidecars (required)

Every asset has a `<filename>.yaml` attribution sidecar (image/media
attribution system). Each copied asset needs one. Format:
```yaml
source: <origin, e.g. "Wikimedia Commons" / "AI-generated (Google Gemini)" / "Open Aviation Solutions">
source_url: <url or ~>
licence: <e.g. CC-BY-SA-4.0>
figure_ref: ~
accessed: <YYYY-MM-DD>
author: <author or org>
notes: ~
```
Copy the sidecar from Lesson 1 for the shared assets (scan-technique,
clock-codes). For the new `rpl-a/02` assets, the source project has no
sidecars — **ask the instructor for provenance** of `hand-wing.mp4`,
`lift-weight-thrust-drag-2.jpg`, `Aerofoil-bernoulli-false.jpg` (Skybrary?),
`attitude-flying.png`, and the deflection SVG rather than inventing it.
`clear-image-cache` make target exists if the cache needs busting.

## Content TODOs / errors to resolve with the instructor (do not invent)

The Slidev source carries unfinished content. Flag, don't fabricate:

- **Cruise configuration numbers are placeholders.** Theory "Cruise
  Configurations" table and in-flight-notes table have RPM/attitude/speed that
  the source itself marks `TODO: check with Tammy's configuration sheet for the
  Warrior`. Keep them but preserve the TODO, or get the real figures.
- **Corrupted text to fix:** "2 Stages of flap2 Stages of flapitch change on
  extension" (theory + in-flight notes) — should read something like "2 stages
  of flap; note pitch change on extension".
- **In-flight-notes table** has a duplicated `Attitude` column header and empty
  cells — clean up to a single sensible set of columns.
- **"Veritaserum"** in the pre-lesson resources should be **"Veritasium"**.
- **`<style>` block** in the Slidev "Power + Attitude = Performance" slide
  (`.perf-table` last-row highlight) — Marp supports per-slide `<style scoped>`,
  but prefer dropping it or using a theme utility; confirm the highlight is
  worth keeping before porting CSS.
- Post-flight-debrief Astro section in Lesson 1 is still `TODO`; for Lesson 2
  the debrief deck has real content, so wire it up properly (don't copy the
  Lesson-1 TODO placeholder).

## Astro page skeleton

Flat file `src/content/docs/recreational-pilot-license/02-straight-and-level.mdx`.
Import depth is **three** levels (`../../../components/SlideEmbed.astro`), not
four. All `src=`/`pdf=`/link URLs carry the `/open-aviation-briefings/` base
prefix. Single theory deck → one Theory section.

```mdx
---
title: 02 Straight and Level
---

import SlideEmbed from '../../../components/SlideEmbed.astro'

CASA Recreational Pilot License (Aeroplane) — Lesson 2.

<one- or two-sentence aim>

## Theory Brief
<SlideEmbed src="/open-aviation-briefings/brief-slides/recreational-pilot-license/02-straight-and-level/01-theory.html" title="Straight and Level — Theory" />

## Pre-flight brief
<SlideEmbed src="…/02-pre-flight-brief.html" title="Straight and Level — Pre-flight Brief" />

## In-flight notes
<SlideEmbed
  src="…/03-in-flight-notes.html"
  title="Straight and Level — In-flight Notes"
  orientation="portrait"
  float="right"
  pdf="…/03-in-flight-notes.pdf"
/>
<kneeboard description + download link>

## Post-flight debrief
<SlideEmbed src="…/04-post-flight-debrief.html" title="Straight and Level — Post-flight Debrief" />

## Useful resources for students
- Veritasium — How does a wing *actually* work? https://www.youtube.com/watch?v=aFO4PBolwFg
- MinutePhysics / Minute Physics — How do aeroplanes fly? https://www.youtube.com/watch?v=Gg0TXNXgz-w
- FAA PHAK Chapter 4 (aerodynamics) …

## Example email to students before the lesson
> (adapt the Slidev pre-lesson-info email template)
```

`03-in-flight-notes.md` matches the `*-in-flight-notes.md` glob, so
`scripts/build-pdfs.mjs` will export the PDF automatically during
`npm run marp:pdf` / `npm run build`.

## Plan of work

Ordered so each step is testable. Steps 2–5 each depend on step 1.

1. **Copy and attribute assets** into
   `brief-assets/recreational-pilot-license/02-straight-and-level/` (rename the
   deflection SVG; create/copy `.yaml` sidecars; ask the instructor for
   unknown provenance). Verify each resolves at `/brief-assets/…` under
   `npm run dev`.

2. **Migrate the theory deck** → `01-theory.md`. Apply §1–8. Components:
   `<briefing-overview>` (overview + 4 waypoint slides: Four Forces, Stability
   & Attitude, Power+Attitude, Recap, plus Arrival), `<pitch-roll-yaw>` (recap
   of Lesson 1; the stability "3D model" prompt), `<four-forces>` (interactive
   — use the corrected `v_ne/v_no/v_1/cruise-kts` attrs), and the two looping
   `hand-wing.mp4` videos (spike per the NEW-pattern section). Preserve the
   cruise-config TODO.

3. **Migrate the pre-flight brief** → `02-pre-flight-brief.md`. Six
   `<briefing-overview>` waypoints (I'M SAFE/PAVE, See & Avoid, Who has
   control, Today's Flight, Recap and Fly, plus arrival "Cleared to fly!").
   I'M SAFE and PAVE tables. The "See and Avoid" slide used **two** stacked
   images in Slidev (`scan-technique.png`, `clock-codes.svg`) — match the
   migrated Lesson-1 approach (each as a separate `![right …]`/`![left …]`
   image, possibly across two slides if both don't fit). `ybth-to-training-area.png`
   on "Today's Flight".

4. **Migrate the in-flight notes** → `03-in-flight-notes.md` with
   `theme: open-aviation-portrait`. Source is plain markdown headings — convert
   each `##` (and major `###`) section to a slide. Fix the corrupted/duplicated
   table (see content TODOs). No interactive components.

5. **Migrate the post-flight debrief** → `04-post-flight-debrief.md`. Three
   `<briefing-overview>` waypoints (Flight Review, Training Outcomes, Next
   Steps) with `arrival-label="Done"`. Otherwise text-only.

6. **Create the Astro page**
   `src/content/docs/recreational-pilot-license/02-straight-and-level.mdx`
   (flat file, 3-level import, base-path URLs, four `<SlideEmbed>` sections,
   portrait + pdf for in-flight notes, resources, email). Sidebar auto-sorts
   by the `02-` prefix.

7. **Verify end-to-end.** `npm run build` then a manual `npm run dev` pass:
   every `<SlideEmbed>` loads; `<briefing-overview>` advances on Direct-To;
   `<four-forces>` shows the ASI arcs; `<pitch-roll-yaw>` rotates; both videos
   autoplay/loop; every asset resolves; the in-flight-notes PDF downloads;
   presenter notes appear in `npm run marp:serve`.

8. **Cleanup.** Remove any stale `public/brief-slides/.../02-straight-and-level/`
   HTML if decks were renamed mid-flight (Marp build doesn't prune orphans). If
   the `<video>` spike required a `marp.config.js` change, document it in
   `brief-slides/INSTRUCTIONS.md`. Archive this task file when 1–7 are done.

## Progress log

- **Step 1 (assets) — done.** Copied the five `rpl-a/02` assets (renamed
  `Deflection and Lift.svg` → `deflection-and-lift.svg`) plus the three shared
  `rpl-a/01` assets (duplicated into this lesson's dir, confirmed). Attribution
  sidecars created; **provenance still TODO** for `hand-wing.mp4`,
  `lift-weight-thrust-drag-2.jpg`, `attitude-flying.png`,
  `ybth-to-training-area.png`, and confirmation that `deflection-and-lift.svg`
  is an Open Aviation Solutions original. `Aerofoil-bernoulli-false.jpg`
  attributed to Skybrary (licence still to confirm).
- **Steps 2–5 (decks) — done.** `01-theory.md` (21 slides), `02-pre-flight-brief.md`
  (the See-and-Avoid slide split into scan-technique + clock-code), portrait
  `03-in-flight-notes.md` (corrupted table cleaned up), `04-post-flight-debrief.md`.
- **`<four-forces>` attribute fix applied:** `v_ne="188" v_no="163" v_1="68"
  cruise-kts="110"`, `model-path` dropped.
- **`<video>` block fix applied to `marp.config.js`:** `customElementBlock` now
  also treats `video`/`audio` as block-level so the looping `hand-wing.mp4`
  isn't wrapped in `<p>`. Verified in the built HTML (block element, base-path
  prefix applied, float utility class intact).
- **Step 6 (Astro page) — done.** `02-straight-and-level.mdx` (flat file,
  3-level import, base-path URLs, portrait+pdf in-flight notes). Builds and
  appears in the sidebar auto-sorted by the `02-` prefix.
- **Build verification — done.** `marp:build` (18 decks), `marp:pdf`
  (in-flight-notes PDF), and `astro build` all pass clean. No Slidev leftovers
  (`$clicks`, `v-click`, old component names, `/rpl-a/` paths) remain.

### Resolution of the post-conversion items

- **Asset provenance — resolved.** The placeholder/unconfirmed assets were
  either confirmed or replaced with public-domain FAA figures:
  - `hand-wing.mp4` → CC-BY-4.0, self-recorded (Michael Nelson, towing
    sailplanes in a Pawnee PA-25).
  - `deflection-and-lift.svg` → Wikimedia Commons, CC-BY-SA-4.0.
  - `Aerofoil-bernoulli-false.jpg` → SKYbrary, copyright retained (credited on
    the slide, used illustratively as an example of an *incorrect* diagram).
  - `lift-weight-thrust-drag-2.jpg` → **replaced** by
    `four-forces-straight-flight.png` (PHAK Fig 5-1, public domain).
  - `attitude-flying.png` → **replaced** by `attitude-pitch-reference.png`
    (AFH Fig 3-8) and `attitude-bank-reference.png` (AFH Fig 3-16, left/analog
    panel only) — the one attitude slide was split into Pitch and Bank.
  - `ybth-to-training-area.png` → **removed** (matches the later lessons, which
    use a text-only "Today's Flight" slide).
- **`<video>`/`<audio>` block support documented** in
  `brief-slides/INSTRUCTIONS.md` ("Inline video and audio").
- **Cruise-config numbers** (theory + in-flight-notes tables) remain
  placeholders with a `TODO` — out of scope, instructor to supply real Warrior
  figures.

### Remaining (instructor only)

- **Visual pass** (`npm run dev`): confirm `<four-forces>` ASI arcs render,
  `<pitch-roll-yaw>` rotates, both `hand-wing.mp4` videos autoplay/loop and
  float right, and `<briefing-overview>` Direct-To advances the plane through
  the waypoints on each deck.

### Known pre-existing issue (not introduced here)

- **Alt-text leak** when a Marpit native filter keyword (e.g. `drop-shadow`)
  combines with leading layout words (`right`/`medium`) and a description: the
  layout words leak into the rendered `alt`. This is project-wide and predates
  this lesson (lesson 01's `piper_warrior_model` ships `alt="right medium"`).
  Drop-shadow itself renders correctly. A proper fix (run layout extraction
  before Marpit's image-option parser) is a separate task if wanted.

## Out of scope

- Theme styling (already done).
- Real Warrior cruise numbers (instructor to supply; keep the source TODO).
- Promoting any straight-and-level element to a new component — none needed.
- Other lessons (03 climbing/descending, 04 turning) — same pattern, separate
  tasks.
