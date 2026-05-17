# Task 0009 — ATSB report linking for briefing topics

**Status:** research pending

## Goal

Make it easy to surface relevant ATSB (Australian Transport Safety Bureau)
accident/incident reports alongside a briefing topic — e.g. linking to a real
stall-related occurrence when teaching stalls. A direct link to an authoritative
local investigation grounds abstract concepts in something tangible for students.

The end deliverable is a skill in the repository (accessible to agents via a
symlink) that can be invoked while editing a briefing to find and insert links
to relevant ATSB reports for the current topic.

## Research questions

1. Does the ATSB publish a public API?
2. If no API, does their site support useful query-string search that could be
   scripted or linked directly (e.g. `atsb.gov.au/publications/search?…`)?
3. Is there a bulk data export (JSON, CSV, XML) of occurrence reports?
4. What metadata do reports carry — at minimum: title, occurrence type/category,
   aircraft type, date, direct URL? Is there enough to build a local index?

## Candidate approaches (to be evaluated during research)

### A — API integration
If the ATSB exposes a REST/GraphQL API: query it at build time (or on demand)
from an Astro integration or a Makefile target, embedding matched links into
the MDX pages automatically.

### B — Static index from bulk export
If a bulk export exists: download it once, index by occurrence category/keyword,
and commit a trimmed `brief-assets/atsb-index.json`. A build step or a small
Astro component queries the local index and renders a sidebar list of matched
reports. The index can be refreshed periodically.

### C — Web-search fallback
If no structured data source exists: use web search constrained to
`site:atsb.gov.au` with topic keywords at research time, then manually add
curated links into the briefing MDX frontmatter. Less automated but still
valuable; the process could be documented as a recurring task in `Makefile`.

### D — Hybrid
Use the ATSB search URL as a "See more on ATSB ↗" link with pre-filled
query terms derived from the lesson slug — no index needed, user clicks
through to live ATSB results.

## Plan of work

1. Visit `atsb.gov.au`, check for a developer/API page and `robots.txt`.
2. Search for ATSB bulk data or API on GitHub and data.gov.au.
3. Inspect ATSB search page for query-string parameters suitable for deep-linking.
4. Evaluate the four approaches above and pick the best fit.
5. Update this task with findings and a concrete implementation plan.
6. (Separate task) Implement the chosen approach.
