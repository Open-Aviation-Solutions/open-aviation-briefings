# 0013 — Convert pre-flight briefs to whiteboard briefing notes (portrait PDF)

**Status:** in progress — steps 1 (PDF-export generalisation) and 2
(planning-page theme utilities) done and verified; steps 3–7 remaining

## Goal

Replace the pre-flight briefing *slide decks* with portrait **whiteboard
briefing notes** — a printable instructor planning document, like the
in-flight notes — starting with Lesson 2 as the pattern-setter.

## Motivation

Experience from other instructors shows the pre-flight brief works poorly as
a slide deck, especially when it immediately follows the theory slides. The
recommended practice is an interactive whiteboard session stepping through
the flight plan, risk assessment, and other steps — and, critically, the
instructor should plan and rehearse the whiteboard themselves before the
lesson. The drawn content varies per airport and per flight, so it should
**not** be baked into saved slides. What the project should provide instead
is a planning document: prompts, reference material, blanks for local
details, and a page for the instructor to sketch their own whiteboard plan.

## Design decisions (agreed)

1. **Format: portrait printable**, `theme: open-aviation-portrait`, exported
   to PDF like the in-flight notes and embedded on the lesson page with the
   `pdf` prop on `<SlideEmbed>`. The HTML build is kept (it's free).
2. **Voice shift: "prepare and run this", not "present this".** The current
   presenter notes (hidden HTML comments) hold the real briefing guidance —
   promote that guidance into the visible document. There is no hidden notes
   layer in a printout.
3. **Core components, not a fixed sequence.** The old slide flow (aim → risk
   → lookout → control → today's flight → recap) was Lesson 1 slide-deck
   thinking, not a template every briefing should follow. Each lesson's notes
   contain a small stable core — **aim · today's flight (the whiteboard
   walk-through) · threats & how we'll manage them · lesson-specific
   airmanship emphasis · questions → fly** — presented as components whose
   order the instructor chooses. The airmanship emphasis varies by lesson
   (lookout/handover early on; HASELL by stalling; radio/traffic by
   circuits). No formal "recap" section — "any questions, let's go" closes a
   whiteboard session naturally. The interactive `<briefing-overview>`
   waypoint slides are dropped entirely (screen-only; wasted pages in print).
   Where a lesson has a real reason to prefer an order, the notes may
   *suggest* it (e.g. Lesson 2: threats *after* the flight plan, when they're
   concrete — crosswind, traffic — rather than abstract), phrased as a
   suggestion only.
4. **Sketch/planning page at the front.** A "Plan your whiteboard" page —
   bordered blank area (optionally a faint grid) plus a short blank **"my
   running order"** column (sequence + timings for the instructor to fill in)
   — placed at the front of the document so the instructor's own plan leads,
   with a reference link to the matching NZ CAA whiteboard example for
   inspiration (link only, no download). Ordering the briefing is an explicit
   planning act here, not something the document implies.
5. **"Draw / Ask / Expect" structure per section** — what to sketch on the
   whiteboard, what questions to ask the student (Socratic: "what does PAVE
   stand for?" rather than reading the table), and what answers or gaps to
   listen for.
6. **Blanks for local detail** — training area, altitudes, runway, CTAF, who
   taxis: fill-in fields rather than baked-in figures (remove e.g. the
   hardcoded "climb to 4500 ft").
7. **Repeated boilerplate referenced, not repeated.** The I'M SAFE and PAVE
   tables are duplicated verbatim across every lesson's pre-flight brief.
   Trim to a one-line reference plus the lesson-specific risk angle (e.g.
   TEAM introduction, get-there-itis emphasis). Standalone printable
   posters/reference sheets for I'M SAFE and PAVE are a possible follow-up —
   **not part of this task**.
8. **Not a polished script.** The document is a *planning worksheet*, not a
   handout to read from. Prompts + blanks + sketch page preserve instructor
   ownership of the briefing — that ownership is the actual point of the
   feedback this task responds to.

## Pipeline changes

### PDF export — generalise `scripts/build-pdfs.mjs`

The script currently hardcodes the glob `/-in-flight-notes\.md$/`. Generalise
it to select decks by a frontmatter flag, e.g.:

```yaml
pdf: true
```

Read each candidate `.md`'s frontmatter (cheap regex or a tiny YAML parse on
the leading `---` block — no new dependency needed) and export any deck with
`pdf: true`. Add the flag to all existing `*-in-flight-notes.md` files so
behaviour is unchanged for them, then to the new briefing-notes file. Update
`brief-slides/INSTRUCTIONS.md` frontmatter docs accordingly.

### Naming

Rename (with `git mv`) to signal the new nature:

```
02-pre-flight-brief.md  →  02-pre-flight-briefing-notes.md
```

Update the corresponding Astro page links/embeds. The Marp build does not
prune orphans — remove the stale
`public/brief-slides/.../02-pre-flight-brief.html` locally after renaming.

### Sketch page styling

The blank sketch area will likely need a small utility in
`themes/open-aviation-solutions/portrait.css` (e.g. a `.sketch-area` bordered
box filling the remaining page height). Prefer a theme utility over per-slide
`<style scoped>` so later lessons reuse it. Verify it renders correctly in
**both** the HTML build and the Chromium PDF export.

## Plan of work

Pilot on **Lesson 2 (straight-and-level)** only; evaluate before rolling out.

1. **Generalise the PDF export** to the `pdf: true` frontmatter flag; add the
   flag to the four existing in-flight-notes files; confirm `npm run marp:pdf`
   output is unchanged. Document the flag in `brief-slides/INSTRUCTIONS.md`.
2. **Add the sketch-area utility** to `portrait.css`; verify in HTML + PDF.
3. **Convert Lesson 2's pre-flight brief** → `02-pre-flight-briefing-notes.md`
   (`git mv`, then rewrite): portrait theme, `pdf: true`, cover,
   sketch/planning page at the front (sketch area + blank running-order
   column), the core component sections with Draw/Ask/Expect, promoted
   presenter-note guidance, local-detail blanks, I'M SAFE/PAVE trimmed to
   references + the TEAM lesson-specific angle, cruise-exercise sequence and
   reference table retained as instructor reference. Suggest (don't impose)
   threats-after-flight-plan ordering for this lesson.
4. **Update the Astro page**
   (`src/content/docs/recreational-pilot-license/02-straight-and-level.mdx`):
   rename the section (e.g. "Pre-flight briefing notes"), switch the embed to
   `orientation="portrait"` + `pdf=` like the in-flight notes, and add a
   sentence explaining the whiteboard approach and that the instructor should
   prepare their own whiteboard plan before the lesson.
5. **Verify end-to-end:** `npm run build` clean; embed loads; PDF downloads;
   sketch page prints with usable blank space; no orphan HTML.
6. **Update the `scaffold-lesson-plan` skill**
   (`~/dev/personal/agent-skills/scaffold-lesson-plan/SKILL.md`) so future
   lessons scaffold the briefing-notes format (and naming) directly instead
   of the slide-deck pre-flight brief.
7. **Evaluate with the instructor** (print it, ideally use it for a real
   briefing), then decide on rolling out to lessons 01, 05 and 06 — that
   rollout is a follow-up task, not this one.

## Progress log

- **Step 1 — done.** `scripts/build-pdfs.mjs` now scans all
  `brief-slides/**/*.md` and exports any deck whose frontmatter contains
  `pdf: true` (regex on the leading `---` block, no new dependency). The
  flag added to all four existing `03-in-flight-notes.md` files; documented
  in `brief-slides/INSTRUCTIONS.md` ("One optional field"). Verified:
  `npm run marp:pdf` exports exactly the same four PDFs as before. (The
  "some local files are missing" marp warnings are pre-existing — absolute
  `/brief-assets/…` paths during file-based conversion — not introduced
  here.)

- **Step 2 — done.** Planning-page utilities added to
  `themes/open-aviation-solutions/portrait.css`: `section.planning` (flex
  column), `.planning-columns` (flex row filling remaining height),
  `.running-order` (30% wide, ruled lines via repeating gradient), and
  `.sketch-area` (bordered, faint 10 mm grid, fills remaining space —
  works full-width or inside the columns). Markup pattern documented in
  `brief-slides/INSTRUCTIONS.md` ("Whiteboard planning page") — note the
  blank lines inside the `<div>`s are required for inner markdown parsing.
  Verified with a temporary test deck in both built HTML and exported PDF
  (also confirming `pdf: true` picks up new decks); test files removed.

## Out of scope

- Converting lessons 01, 05, 06 (pending evaluation of the Lesson 2 pilot).
- I'M SAFE / PAVE standalone posters or reference sheets (possible follow-up).
- Theory, in-flight notes, and post-flight debrief decks — unchanged.
- Theme work beyond the sketch-area utility.
