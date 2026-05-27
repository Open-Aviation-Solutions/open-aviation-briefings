# Task 0009 — ATSB report linking for briefing topics

**Status:** research complete — implementation pending

## Goal

Make it easy to surface relevant ATSB (Australian Transport Safety Bureau)
accident/incident reports alongside a briefing topic — e.g. linking to a real
stall-related occurrence when teaching stalls. A direct link to an authoritative
local investigation grounds abstract concepts in something tangible for students.

The end deliverable is a skill in the repository (accessible to agents via a
symlink) that can be invoked while editing a briefing to find and insert links
to relevant ATSB reports for the current topic.

## Research findings

### 1. No public API

The ATSB does not publish a REST or GraphQL API. The National Aviation
Occurrence Database (NAOD) is accessible through a form-based web interface
at `data.atsb.gov.au` (standard, advanced, detailed and quick-counts searches)
but this appears to be an older system and was connection-refused during
research. There is no documented programmatic access.

### 2. Query-string search on the main site

The main ATSB publications site (`atsb.gov.au`) runs on Drupal. Confirmed
URL parameters for the safety investigation reports listing:

```
https://www.atsb.gov.au/publications/safety-investigation-reports/
  ?allowModeSelect=true
  &reportStatus=Pending,Preliminary,Interim+Factual
  &investigationStatus=Active,Reactivated
```

Occurrence briefs (shorter reports):
```
https://www.atsb.gov.au/occurrence-briefs?field_mode_of_transport_target_id=1
```
(`field_mode_of_transport_target_id=1` = aviation)

A keyword/title search parameter was not confirmed from URL inspection alone
(the ATSB site timed out on all direct fetches). However, ATSB publications
are well-indexed by Google, making `site:atsb.gov.au` + topic keywords a
reliable search approach.

### 3. No free bulk data export

The ATSB explicitly limits full export of the NAOD, citing the need to
preserve confidentiality and support ongoing data cleaning. Annual aviation
occurrence statistics are published as summary spreadsheets (updated yearly)
but these contain aggregate counts, not individual occurrence records with URLs.
There is no JSON/CSV/XML dump of all reports.

### 4. Report metadata and URL structure

Individual investigation report URL pattern:
```
https://www.atsb.gov.au/publications/investigation_reports/{pub-year}/{type}/{occurrence-id}
```

Examples (stall / loss-of-control related):
- `https://www.atsb.gov.au/publications/investigation_reports/2024/report/ao-2023-011`
  — Cirrus SR22 stall/bank angle, Bankstown, 17 Mar 2023
- `https://www.atsb.gov.au/publications/investigation_reports/2026/report/ao-2024-058`
  — Morgan Cougar stall knowledge gap, Victoria, 16 Nov 2024
- `https://www.atsb.gov.au/publications/investigation_reports/2021/aair/ao-2021-016`
  — Cessna R172K loss of control, Sutton NSW, 13 Apr 2021

Metadata available per report: full descriptive title (aircraft type, location,
date), occurrence ID (e.g. `AO-2023-011`), year of publication, and a stable
direct URL. Report pages contain detailed findings, contributing factors, and
safety messages.

### 5. Occurrence taxonomy

The ATSB uses the CICTT (Commercial Aviation Safety Team / ICAO Common
Taxonomy Team) occurrence category taxonomy. Relevant categories include:
- **LOCI** — Loss of Control, Inflight
- **STALL** — Stall Warnings
- **ARC** — Abnormal Runway Contact
- **CFIT** — Controlled Flight Into Terrain

Full taxonomy at: `https://www.atsb.gov.au/avdata/terminology`

## Approach evaluation

| | Approach | Verdict |
|---|---|---|
| A | REST/GraphQL API | ✗ Not available |
| B | Bulk export → local index | ✗ ATSB restricts full export |
| C | Web-search fallback (site:atsb.gov.au + keywords) | ✓ Works well; Google indexes all reports |
| D | Hybrid deep-link (pre-filled search URL) | ✓ Viable for "see more" link |

## Recommended implementation: C + D

**Approach C** for finding reports during skill invocation: use the WebSearch
tool constrained to `site:atsb.gov.au` with keywords derived from the lesson
topic (e.g. "stall", "loss of control") to return a ranked list of relevant
investigation reports. The instructor reviews the list and selects which to
embed.

**Approach D** as a supplementary "see more" link: construct a Google search
URL pre-filtered to ATSB reports for the topic, so instructors and students
can browse further without leaving the briefing.

## Implementation

Skill at `~/.claude/skills/atsb-link/SKILL.md`.

Input: free-text topic description (prompted if not supplied as an argument).

Uses `WebSearch` constrained to `site:atsb.gov.au` to find relevant
`investigation_reports` and `occurrence-briefs`, then presents them as a
numbered list with title, URL, and a one-line note on relevance. No file
modification — the instructor copies links into the lesson MDX by hand.
