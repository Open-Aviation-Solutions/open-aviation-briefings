# Lesson 24 — Precautionary Search and Landing

RPL(A) sample syllabus lesson 24. Source files: workbook (`00`), theory brief (`01`), pre-flight briefing notes (`02`), in-flight notes (`03`).

## Timing the inspection pass is technique, not a CASA element

CASA's only related element is A6.4(f), "landing area length adequate for landing". The sample syllabus does not say how to assess length, so the timing method is standard practice that this lesson teaches, not something to cite as a CASA requirement.

The method used here:

- Fly trimmed at **80 kt** and count the seconds from threshold to threshold **twice** — on the 1000 ft downwind after the crosswind join, and again on the wider 500 ft pass — then average the two (or use the GNSS groundspeed instead of averaging).
- 1 kt is about 0.5 m/s, so 80 kt is about 40 m/s. Count × 40 gives metres: **10 s ≈ 400 m, 20 s ≈ 800 m**.
- The speed that matters is **groundspeed**. The downwind and the 500 ft pass are flown in opposite directions (tailwind, then headwind), so averaging the two timings cancels most of the wind effect.
- At least 400 m is wanted for most small aeroplanes, but compare the result with the aircraft's own short-field landing distance for the day from its flight manual, with a margin.

80 kt is the instructor's preferred search speed. Check it suits the aircraft type's recommended search speed and configuration before using it live. The same figures appear in the theory brief's "Flying the inspection" and "Timing the pass" slides and their presenter notes, and in the in-flight notes' Inspect step, so update all three together.

## Inspection sequence

Order of events: PAN call to ATC and passenger brief, then the crosswind join (1000 ft, trimmed for 80 kt) and timed downwind, a wider 500 ft pass (second timing, WOSSSSET re-assessed), the 200 ft pass, and the 50–100 ft pass. Both low passes apply full power two-thirds of the way along the runway as a safety margin; the timed 500 ft pass does not, as it would spoil the timing. The vital-actions list, recap and in-flight notes all put Communicate and Prepare *before* Inspect for this reason; keep them in that order. After the timed 500 ft pass the aeroplane stays configured and every later circuit is flown at 500 ft (the CASA practice standard), so the low passes climb back only to 500 ft. In a real event the height depends on the situation — terrain might argue for 1000 ft, a low cloud base for staying at or below 500 ft. The diagram's pass offsets (500 ft pass 300 m, low passes 100 m) are illustrative.

## Workbook: landing distance

Workbook topic 6 has the student work out the landing distance for today's temperature and area QNH from their own aircraft's POH. There is deliberately no answer key, because it is type-specific — the instructor checks it against the POH at the pre-flight brief (the aim section has the prompt). It feeds the 400 m / POH comparison on the theory deck's "Timing the field" slide.

## Workbook: the student's own checklist

Workbook topic 7 has the student draft their own checklist for the vital-actions sequence, including the precautionary cruise configuration numbers from their POH. It came from feedback that a checklist helps a student through procedural lessons, and it is deliberately self-made rather than supplied: the student writes it, the instructor checks it at the pre-flight brief and fills gaps on the whiteboard, and the student keeps it for the flight. There is no model checklist. The whiteboard walk-through's cruise configuration line should agree with it.

## Theory deck layout

- The inspection pattern diagram slide has no heading, so the component can use the full slide height (`height="620px"`). With a heading and text underneath it clips. Keep the step-by-step text on the following slides (join and 500 ft pass, timing, low passes).
- The opening is a staged scenario poll (Steps 1–4) ending in the "options vs time" chart (`brief-assets/recreational-pilot-license/24-precautionary-search-and-landing/options-vs-time.svg`). The scenario figures are invented for the story and deliberately avoid quoting VFR minima.

## Theory deck waypoints

The overview follows the vital-actions order: Vital Actions → Search and Select → Communicate and Prepare → Inspect → Land → Recap (plus the Learning Objectives start). Each `plane-position` is the waypoint's zero-based index after Learning Objectives (Vital Actions is 0, Arrival is 6), so inserting or removing a waypoint means renumbering every later `plane-position`. The Land waypoint is short-field revision only, since the approach is already flown in the Inspect waypoint's last diagram path.
