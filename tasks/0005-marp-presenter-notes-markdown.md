# 0005 — Markdown rendering in Marp presenter notes

**Status:** investigation complete, implementation pending

## Goal

Get presenter notes rendered as Markdown (bold, lists, etc.) in Marp's
presenter view, rather than plain text as they appear today.

## Investigation findings

Marp does not support Markdown rendering in presenter notes. This is a known
upstream limitation:

- https://github.com/yhatt/marp/issues/30 — "Speaker notes in presentation mode"
- https://github.com/marp-team/marp-cli/issues/278 — "Generate presenter notes"

### Root cause

marp-cli's presenter view template sets notes via `textContent` (not
`innerHTML`). The `render()` method on `Marp` returns a `result.comments`
array of plain strings — one array of strings per slide. Even if those
strings were pre-rendered to HTML in our custom engine, the template would
escape them. There is no engine-level or plugin-level hook that targets how
notes are displayed in the presenter view.

### Best option

Inject a small inline script via the custom engine's `render()` override in
`marp.config.js` — the same mechanism already used to inject component
scripts. The script would run in the presenter view context, locate the notes
pane in the DOM, and re-render its `textContent` as Markdown HTML using a
minimal inline parser (bold, italic, unordered lists are enough to cover
typical usage).

This approach:
- requires no separate build step or post-processing of emitted files
- is contained entirely within `marp.config.js`
- follows the same pattern as the existing component script injection

### Unknowns before implementing

1. **Presenter view DOM structure** — what selector targets the notes pane in
   marp-cli's presenter view? This is an internal detail that may change
   between marp-cli versions. Needs a quick DOM inspection of the served
   presenter HTML.

2. **Script execution context** — does a script injected into `result.html`
   run in the presenter view window, or only in the slide view? If only in
   the slide view, a different injection point is needed (or a `postMessage`
   bridge).

3. **Markdown parser** — inline a minimal renderer (~30 lines handles bold,
   italic, lists) or reference a small CDN library such as `marked.js`. A
   self-contained inline parser avoids the external dependency.

## Plan of work

1. Run `npm run marp:serve`, open the presenter view, and inspect the DOM to
   confirm the notes pane selector and verify that injected scripts execute
   in that context.
2. Write a minimal inline Markdown renderer (bold, italic, unordered lists).
3. Inject it via `render()` in `marp.config.js`, conditioned on any slide
   having presenter notes (check `result.comments.flat().some(Boolean)`).
4. Smoke-test with a deck that uses bold and list formatting in notes.
5. Document the approach in the root `INSTRUCTIONS.md` under the Marp engine
   section.
