---
marp: true
title: Effects of Controls — Theory Part 2
license: CC-BY-SA-4.0
header: Effects of Controls — Theory Part 2
---

<!-- _class: lead -->

# The Effects of the Aeroplane Controls

_CASA Recreational Pilot License (Aeroplane) — Lesson 1, Pre-flight theory part 2: Ancillary controls, power and the slipstream_

<!-- Question: So far we've looked at the main control surfaces of the aeroplane: elevator, ailerons and rudder. Can you list any other controls that we might have in the aeroplane? Remember: Understanding the effects of the aeroplane controls will be the basis of all your safe flying into the future. -->

---

# Theory Lesson Overview

_The effects of the aeroplane controls_

<flight-path-overview id="fpo-overview-pt2" plane-position="0" arrival-label="Arrival" controls></flight-path-overview>

<script>
customElements.whenDefined('flight-path-overview').then(() => {
  document.getElementById('fpo-overview-pt2').topics = [
    { label: 'Learning\nObjectives', time: 2 },
    { label: 'On the Sim or in the plane\nFlap, Trim and Throttle', time: 7 },
    { label: 'Effects of Power\n& slipstream', time: 3 },
    { label: 'Recap', time: 2 }
  ]
})
</script>

<!-- Outline the lesson plan based on the image: we'll jump on the simulator or sitting in the real plane, giving us a chance to see how we control those main surfaces as well as introduce a couple of other controls — flap and trim. These are called "ancillary controls" which just means supporting controls. We'll then focus on how the aeroplane power from the propeller and the slipstream it creates, how that affects aeroplane controls. Recap what we've learned, revisiting our objectives. -->

---

# Learning Objectives for this lesson

_The effects of the aeroplane controls_

By the end of this lesson, our aim is to be able to:

- **Identify three ancillary controls of the aeroplane** such as throttle, flaps and trim
- **Describe the purpose and operation** of those ancillary controls
- **Explain how power and the propeller's slipstream** change the effectiveness of each main control

And then later in our actual flight:

- **Experiment (safely!) with the controls in the aeroplane** — applying trim and flaps to see their effects, as well as testing the effectiveness of the controls at different speeds.

<!-- Use a prop such as the 3d model of the aeroplane to walk through each of these objectives, visually introducing each. -->

---

# Waypoint 1 — On the Sim with Flap and Trim

_The effects of the aeroplane controls_

<flight-path-overview plane-position="0" arrival-label="Arrival" controls></flight-path-overview>

<!-- Click Direct-To to advance to waypoint 1. -->

---

# On the Sim with Flap and Trim — and ancillary controls

_The effects of the aeroplane controls_

First, settle in and play with the main controls, ensuring that each does what you expect (or not!) to control the aeroplane.

Use the control column and pedals to discover and demonstrate how you can:

- control the elevator to pitch the aeroplane around the lateral axis
- control the ailerons to roll the aeroplane around the longitudinal axis
- control the rudder to yaw the aeroplane around the normal axis

You'll also discover that:

- The controls have a **natural sense:** Rotating the control column right rolls the aeroplane right — the movement matches the intended result — except when you're taxiing!
- The pedals don't just control the rudder, they also control the nose-wheel, so we'll be using those to control our direction while taxiing on the ground.

<!-- The student should be seated in front of the simulator or in the actual aeroplane where they can comfortably manipulate the control column and pedals, with the screen displaying the outside of the chosen plane with a good view to see all control surfaces (if on the sim). The idea here is a quick break from the classroom for the first part of the lesson. It could be combined with the daily inspection before moving inside to do the remainder of the theory (slipstream and power). Let the student just feel the main controls and watch how they affect the main control surfaces. Once they're more comfortable, ask them to describe and explain how to manipulate the controls to pitch, roll and yaw etc. -->

---

# Ancillary Controls: Flaps

_The effects of the aeroplane controls_

**Purpose:** Increase lift at lower speed; also increase drag (changes wing camber)

| Flap Setting | Lift | Drag | Typical Use |
|-------------|------|------|-------------|
| 0° (up) | Normal | Normal | Cruise, climb |
| 10° | Increased | Slightly increased | Take-off in some aircraft, initial approach |
| 20° | Increased | Moderately increased | Circuit, approach |
| 40° (full) | Slightly increased | Greatly increased | Before landing, Short-field landing |

> Full flap adds much more drag than lift — useful for a steeper approach or slowing down when landing, but **not for maximising lift**.

---

# Ancillary Controls: Flaps — cont.

_The effects of the aeroplane controls_

**Key points:**

- Flap **"up"** or **"retracted"** means **flush with the wing** — flap does not extend above the wing surface
- Deploying flap typically causes a **pitch change** — direction depends on aircraft type (high-wing tends nose up; low-wing tends nose down) — re-trim after each change
- **White arc** on ASI = flap operating range ($V_{FE}$) — do not extend flaps above this speed
- Raising flap suddenly at low speed causes a **sink** — always retract progressively

---

# Ancillary Controls: Trim

_The effects of the aeroplane controls_

After being shown where the trim wheel is, see if you can spot it moving on the simulator or plane as you manipulate it (it may be harder to spot than the flaps).

**Purpose:** When flying it relieves control pressure — rather than having to keep pulling or pushing the control column while flying, we can adjust the trim to take away that pressure.

**Technique:** trim in the direction of the load you are holding. That is:

- if you are having to push the control column forward to maintain level flight, then roll the trim-wheel forward to relieve that pressure.
- if you having to pull the control column back to maintain level flight, then roll the trim-wheel back to relieve that pressure.

> **Important:** the trim will need to be re-set (adjusted) after changing the aeroplane's power or attitude. **Don't** use the trim to try to change the pitch.

<!-- This is not really clear on the ground, but will be demonstrated later. The main thing to do here is to visually spot the trim and understand how to manipulate it. -->

---

# Waypoint 2 — Effects of Power & Slipstream

_The effects of the aeroplane controls_

<flight-path-overview plane-position="1" arrival-label="Arrival" controls></flight-path-overview>

<!-- Click Direct-To to advance to waypoint 2. -->

---

# Slipstream and Power Effects

_The effects of the aeroplane controls_

![bg right:45%](/brief-assets/recreational-pilot-license/01-effects-of-controls/propeller-slipstream.png)

What is the slipstream?

**Question:** How does the aeroplane move forward when you apply power?

The propeller creates a **Slipstream — a spiral column of air driven back by the propeller**.

This slipstream has two noticeable effects. Can you guess from the diagram what they might be?

---

# Effects of the slipstream

_The effects of the aeroplane controls_

The slipstream has two noticeable effects on the aeroplane controls, mainly when using high or full power:

1. The slipstream spirals around the fuselage to **"hit" the vertical stabilizer**, pushing the tail to the right and causing the aeroplane to yaw to the left. This may need to be corrected by applying right rudder, especially during take-off when the power is at a maximum.
2. The slipstream causes a stronger airflow over the tail of the plane, including the elevator and rudder, but **not** the ailerons.

The **effectiveness of all the control surfaces increases with the airspeed** of the aeroplane, since that means airflow over all controls. But additionally, **the rudder and elevator effectiveness increases with high power (even without high airspeed)** whereas the aileron doesn't.

> Control feel on ailerons does **not** change with power — as the ailerons sit outside the slipstream. The control effectiveness of the ailerons is affected by airspeed only.

<!-- Start with the 3D model again, twisting the propeller and working through the effects. -->

---

# Slipstream and Power Effects — cont.

_The effects of the aeroplane controls_

- **Slipstream** strikes the left side of the vertical fin → **yawing left** at high power.
- Adding or removing **power** (Throttle) affects the **pitch** of the plane.

**Power change effects:**

| Power | Pitch tendency | Yaw tendency |
|-------|--------------|-------------|
| Increase | Nose up | Left |
| Decrease | Nose down | Right |

> **Go-around:** Full power + slow speed + nose up = maximum left yaw tendency — **anticipate with right rudder.**

<!-- Ailerons being outside the slipstream is a key differentiator: aileron effectiveness changes only with airspeed, not power. Elevator and rudder effectiveness change with both. Demonstrate slipstream effect: at constant low airspeed, compare feel of elevator and rudder at full power (climb) vs idle (glide). Student operates all controls and notes the difference. The go-around right-rudder requirement must be explicitly briefed — it is one of the most common causes of loss of control at low level. -->

---

# Waypoint 3 — Recap

_The effects of the aeroplane controls_

<flight-path-overview plane-position="2" arrival-label="Arrival" controls></flight-path-overview>

<!-- Click Direct-To to advance to the recap waypoint. -->

---

# Lesson Summary

_The effects of the aeroplane controls_

**The Effects of the Aeroplane Controls:**

First a re-cap of the main controls and their effects:

| Control | Primary Effect | Around which Axis | Secondary Effect |
|---------|------|---------------|----------------|
| **Elevator** | Pitch | Lateral | Airspeed change |
| **Ailerons** | Roll | Longitudinal | Slip → yaw toward lower wing |
| **Rudder** | Yaw | Normal (Vertical) | Skid → roll in direction of yaw |

**And the new learning — Ancillary controls:**

- **Trim** — relieves control pressure; technique: trim in the direction of the load you are holding
- **Flaps** — increase lift at lower speed; increase drag; cause pitch change; re-trim after each selection

---

# Lesson Summary — cont.

_The effects of the aeroplane controls_

**Slipstream and power:**

- Ailerons are **outside** the slipstream — unaffected by power changes
- High power → left yaw tendency → right rudder required
- Go-around: anticipate strong left yaw with right rudder

**Inertia:** The aircraft has mass — all speed and direction changes are gradual. Anticipate.

---

# Objectives check

_The effects of the aeroplane controls_

**At the start of the lesson, we set out to be able to:**

- **Identify three ancillary controls of the aeroplane**
- **Explain how power and the propeller's slipstream** change the effectiveness of each main control
- **Describe the purpose and operation** of the ancillary controls — throttle, trim and flaps

---

# Arrival

_The effects of the aeroplane controls_

<flight-path-overview plane-position="3" arrival-label="Arrival" controls></flight-path-overview>

<!-- Click Direct-To to advance to arrival. -->

---

# Questions?

_The effects of the aeroplane controls_

Any further questions that we haven't yet asked or addressed?
