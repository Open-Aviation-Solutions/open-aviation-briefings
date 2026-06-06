---
marp: true
theme: open-aviation
title: Straight and Level — Theory
license: CC-BY-SA-4.0
header: "Straight and Level Flight — Pre-flight theory"
---

<!-- _class: lead -->

# Straight and Level Flight

_CASA Recreational Pilot License (Aeroplane) — Lesson 2, Pre-flight theory_

All text and presenter notes in this briefing are licensed under [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). [More info](https://openaviation.solutions/licensing)

<!--

- In our first lesson we learned the effects of the controls — what each surface does when we move it.
- In this lesson we take the next step: we learn how to *use* those controls to keep the aeroplane doing exactly what we want — flying straight and level.
- By the end of today we'll understand the four forces that act on the aeroplane, and the one equation that governs all of flying.

-->

---

# Why is flying straight and level important to us?

Sounds **pretty boring** — why is being able to fly "straight and level" fundamental?

Take a minute to name some of the other tasks (other than flying the plane) that we need to contend with in the air.

- When we talk about flying "straight and level", it implicitly means being able to **set up the plane to fly straight and level with minimal input from us**
- What do you expect happens to these other tasks if you're not able to fly straight and level with your hands off?

Flying straight and level is all about **setting up the plane to fly itself straight and level**, without too much input from us, giving us **more head-space to handle the other pilot duties**!

<!--

- Looking out for other traffic
- Navigating (both looking for landmarks and checking maps)
- Monitoring, responding and transmitting on the radio
- CLEAR-OFF checks or other checks.

-->

---

# A quick recap of last week's lesson

_On the effects of the aeroplane controls_

<pitch-roll-yaw height="460px" show-help="false"></pitch-roll-yaw>

<!--

Click on the "random waggle" button (top-right) and have the student guess before mousing-over and confirming the correct axis and movement.

Use the physical 3D model if available to touch on:
- what controls (point them out and name them)
- the primary and secondary effects of each demonstrated with model
- ancillary controls of throttle, flaps and trim

Trim is a good segue to straight and level flight.
-->

---

# Theory Lesson Overview

<briefing-overview plane-position="0" arrival-label="Arrival" controls-start>
  <briefing-topic label="Learning&#10;Objectives" time="2"></briefing-topic>
  <briefing-topic label="The Four&#10;Forces" time="5"></briefing-topic>
  <briefing-topic label="Stability &amp;&#10;Attitude Flying" time="5"></briefing-topic>
  <briefing-topic label="Power + Attitude&#10;= Performance" time="5"></briefing-topic>
  <briefing-topic label="Recap" time="3"></briefing-topic>
</briefing-overview>

<!--
Outline the lesson plan:
- We start with the four aerodynamic forces — the 'why' behind everything.
- Then stability and attitude flying — the foundation of all visual flying.
- The performance formula ties it together: Power + Attitude = Performance.
- Then the practical techniques for straight and level at various speeds.
-->

---

# Learning Objectives for this lesson

By the end of this lesson, our aim is to be able to:

- **Identify the four forces** acting on the aeroplane in flight
- **Explain, in simple terms, how lift is generated** by a wing aerofoil
- **Describe attitude flying** — using visual references outside the cockpit to control flight path
- **Identify the cruise configurations** of our aeroplane including the power/attitude required for each

In our flight later on we'll be experimenting with these different aeroplane configurations (basically different power settings) to note how many fingers we are below the horizon for each power setting.

<!--
These objectives map to MOS A3.2. Cover them now so the student knows what 'success' looks like. Return to these at the recap.
-->

---

# The Four Forces

<briefing-overview plane-position="0" arrival-label="Arrival" controls></briefing-overview>

<!-- Click Direct-To when ready to advance to the Four Forces waypoint. -->

---

# The Four Forces on our hand

<video class="right medium" autoplay loop muted playsinline src="/brief-assets/recreational-pilot-license/02-straight-and-level/hand-wing.mp4"></video>

Last lesson we used the analogy of our hand out of the car window. We're going to continue with that analogy today to **identify and begin to understand the four forces affecting an aeroplane**.

What forces do you see at play in this video?

There's two that you can see and two that aren't so visible.

<!--
Encourage the learner to think back, even hold their hand out if necessary to experience the gravity.

Relate those feelings to Drag, Weight (gravity), Lift, and the one that will be harder to relate here is thrust.
-->

---

# The Four Forces

![right medium drop-shadow The four forces — lift, weight, thrust and drag — acting on an aeroplane in straight and level flight](/brief-assets/recreational-pilot-license/02-straight-and-level/four-forces-straight-flight.png)

Four forces act on the aeroplane whenever it is in flight.

- **Lift** — acts upward, perpendicular to the relative airflow; generated by the wings
- **Weight** — acts downward through the centre of gravity; the pull of gravity on the aircraft mass
- **Thrust** — acts forward, produced by the engine and propeller
- **Drag** — acts backward, opposing the direction of motion through the air

> In straight and level flight at constant speed: **Lift = Weight** and **Thrust = Drag**

<!--
Key point: the aeroplane is constantly in dynamic balance. Changes to one force ripple through the others — which is why we need to re-trim when we change power or configuration.

The lift/weight forces are around **10 times** stronger than the thrust and drag forces. Hence the need for the downward force of the tailplane.

Note the effect this arrangement has on adding or removing thrust/power.
-->

---

# The Four Forces — interactive

<four-forces height="420px" v_ne="188" v_no="163" v_1="68" cruise-kts="110"></four-forces>

<!--
Hand the controls to the student. Ask them to:
1. Set power to 0% — what happens to thrust and VSI?
2. Bring power back to 60% — what happens?
3. Increase attitude to +15° — why does drag also increase when lift increases?
4. Decrease the attitude to -15 and note the component of weight opposing lift and the component of weight in the direction of flight.
The goal is to build an intuition for force balance before moving to the performance formula.
-->

---

# Generation of Lift

![right medium drop-shadow A SKYbrary aerofoil diagram showing the Bernoulli-only explanation of lift](/brief-assets/recreational-pilot-license/02-straight-and-level/Aerofoil-bernoulli-false.jpg)

But **how does the wing actually generate lift?**

As confusing as it is, it's worth noting that there's a lot of **incomplete and sometimes incorrect** information about lift, even in textbooks, or [modern websites like SKYbrary](https://skybrary.aero/articles/bernoullis-principle).

Can you see any issue with this diagram?

_Aerofoil image © [SKYbrary](https://skybrary.aero/articles/bernoullis-principle), used illustratively._

---

# Generation of Lift

![right medium drop-shadow A SKYbrary aerofoil diagram showing the Bernoulli-only explanation of lift](/brief-assets/recreational-pilot-license/02-straight-and-level/Aerofoil-bernoulli-false.jpg)

_What is wrong with this diagram's explanation?_

- The diagram and its explanation involve only a pressure difference created by the airflow around the aerofoil moving faster over the top than the bottom (this is **Bernoulli's principle** which we'll learn more about in a later lesson).
- It implies that the related pressure difference _only_ is resulting in upward lift.
- Note that, on its own, this explanation **does *not* explain how your hand outside the car window feels the lift forces**. It's missing a simple detail.

The actual root cause of the lift is much simpler...

_Aerofoil image © [SKYbrary](https://skybrary.aero/articles/bernoullis-principle), used illustratively._

<!--
All of those statements of what is happening are true (air travelling faster, lower pressure, higher pressure). But it's the implication that you can have lift without deflecting air downwards.

Newton's laws still hold — for the force on the wing upwards, it must push air downwards.

Key connection: airspeed = lift. If we slow down, we must increase angle of attack to maintain the same lift. This is why attitude changes when we change speed.
-->

---

# Generation of Lift — simplified

Just like your hand, the wing **deflects a mass of air downwards** resulting in an **equal and opposite force upwards**.

![right large A diagram showing a wing deflecting air downwards to generate lift](/brief-assets/recreational-pilot-license/02-straight-and-level/deflection-and-lift.svg)

You can see more detail about this in the 3-minute Veritasium episode [How does a wing *actually* work?](https://www.youtube.com/watch?v=aFO4PBolwFg)

<!--

**Key point**: An aerofoil generates lift by **pushing air downwards** — just like your hand.

If there's time, it may be worth thinking through together the factors that affect lift:

- the angle of attack ($C_L$)
- the density of the fluid ($\rho$) — imagine your hand in water instead
- the speed of the airflow ($V^2$)
- the surface area of the wing ($S$) — imagine a board attached to your hand
-->

---

# An Equation for lift?

<video class="right medium" autoplay loop muted playsinline src="/brief-assets/recreational-pilot-license/02-straight-and-level/hand-wing.mp4"></video>

- We're not going to get **scared off** by looking at the lift equation in any detail yet.
- But it is worth thinking through **what factors directly affect the lift** of a wing (or a hand).
- This will give us an **intuition** into the lift equation when we do (later) look at the Lift Equation.

So... **what factors change the strength of the lift force** experienced by your hand?

<!--
If there's time, it may be worth thinking through together the factors that affect lift:

- the angle of attack ($C_L$)
- the density of the fluid ($\rho$) — imagine your hand in water instead
- the speed of the airflow ($V^2$)
- the surface area of the wing ($S$) — imagine a board attached to your hand
-->

---

# Stability & Attitude Flying

<briefing-overview plane-position="1" arrival-label="Arrival" controls></briefing-overview>

<!-- Click Direct-To when ready to advance to the Stability & Attitude Flying waypoint. -->

---

# Stability

The aeroplane is designed to be **inherently stable** — it tends to return to level flight if disturbed.

This ability is very dependent on the **centre of gravity** of the aeroplane, which is why it's very important to ensure the **weight and balance** of the aircraft is correct.

Let's take a few minutes to use our 3D model to discover how the plane manages to return to level flight if disturbed.

- **Yaw stability**: the vertical stabiliser keeps the nose aligned with the airflow.
- **Pitch stability**: if the nose pitches up and speed reduces, the nose returns to level
- **Roll stability**: a dihedral wing design tends to roll back to wings level after a disturbance

> Stability means the aeroplane *helps* us fly straight and level — but we still need to actively manage it, setting our attitude and adjusting the trim as conditions change.

<!--
Use the physical model aeroplane to demonstrate each, showing the tendency to return to level after a gentle pitch disturbance. Note that a stable aeroplane requires *less* physical effort from the pilot.

This concept reinforces why we can trim and let go — the aeroplane will hold the attitude by itself for a short time.

**What is this "attitude" we keep talking about?**
-->

---

# Attitude Flying — Pitch

![right drop-shadow h:560px Three cockpit views showing nose-high, nose-level and nose-low pitch attitudes against a fixed natural-horizon reference point](/brief-assets/recreational-pilot-license/02-straight-and-level/attitude-pitch-reference.png)

**We fly by looking outside — not at the instruments.**

- **Attitude** is the relationship between the aircraft and the natural horizon
- The **position of the horizon** relative to the nose of the aeroplane tells us our **pitch attitude** — nose high, level, or low against a fixed reference point
- We hold the attitude constant with the control column, then trim to take the pressure off

> The **attitude indicator** (artificial horizon) is a back-up, not the primary reference.

<!--
**Have the student think back to the finger-height-above-horizon reference we set in our flight for Lesson 1**. That is attitude flying. Today we will formalise that reference.
-->

---

# Attitude Flying — Bank

![right medium drop-shadow A banked external view with the wing-to-horizon reference angle alongside the attitude indicator](/brief-assets/recreational-pilot-license/02-straight-and-level/attitude-bank-reference.png)

- The **angle of the horizon** relative to the aeroplane tells us our **bank (roll) attitude**
- Set the attitude with reference to the **natural horizon and wingtip** outside, then **check the attitude indicator** to confirm
- Hold the attitude constant, keep the aeroplane **in balance**, and **trim** to take the pressure off

> The **attitude indicator** (artificial horizon) is a back-up, not the primary reference.

<!--
Reinforce: if the attitude is correct and the aeroplane is in balance and properly trimmed, performance (altitude, heading, airspeed) follows automatically.
-->

---

# Power + Attitude = Performance

<briefing-overview plane-position="2" arrival-label="Arrival" controls></briefing-overview>

<!-- Click Direct-To when ready to advance to the Power + Attitude = Performance waypoint. -->

---

# Power + Attitude = Performance

This formula underlies all of our flying.

| Variable | Meaning | We control it by… |
|----------|---------|-------------------|
| **Power** | Engine thrust (RPM / manifold pressure) | Throttle |
| **Attitude** | Nose position relative to horizon (measure with fingers) | Elevator |
| **Performance** | Airspeed — the result of power and attitude | Monitor; re-adjust power or attitude as needed |

> Set **power** → set **attitude** → **performance** follows — then **trim** for hands-off

<!--
Work through a concrete example with the student:
- Normal cruise: 2400 RPM, nose level → what airspeed do we get?
- Then: what if we want slow cruise? Reduce power → raise nose slightly → trim → check speed

This formula is the single most important concept in the theory of flight. Return to it every lesson.
-->

---

# Cruise Configurations

We will practise straight and level flight at four configurations today (**Note**: example values only - adjust to your aeroplane.

| Configuration | Power (approx) | Attitude | Speed | Notes |
|---------------|---------------|----------|-------|-------|
| Normal cruise | 2400 RPM | 4 fingers | 100 KIAS | Reference attitude for this aeroplane |
| Fast cruise | 2600 RPM | 5 fingers | 110 KIAS | |
| Slow cruise | 2200 RPM | 2 fingers | 80 KIAS | Aeroplane feels 'mushy' — more back-pressure |
| Precautionary cruise | 2200 RPM | 4 fingers | 80 KIAS | 2 stages of flap; pitch change on extension |

<!--
TODO: confirm the correct RPM, attitude and speed figures for the Warrior against Tammy's configuration sheet — the numbers above are placeholders.

Key point: in each configuration, the sequence is the same — power, attitude, configuration → trim → cross-check performance.
-->

---

# Recap

<briefing-overview plane-position="3" arrival-label="Arrival" controls></briefing-overview>

<!-- Click Direct-To when ready to advance to the Recap waypoint. -->

---

# Lesson 2 Recap

By the end of this lesson, we aimed to be able to:

- **Identify the four forces** acting on the aeroplane in flight
- **Explain, in simple terms, how lift is generated** by a wing aerofoil
- **Describe attitude flying** — what visual reference do we use to measure our pitch and bank?
- **Identify the cruise configurations** of our aeroplane and the power/attitude required for each

See if you can identify, explain or describe each point above.

<!--

Prompt and question as necessary to help reenforce the learning, even bringing in the 3D physical model again as necessary.

-->

---

# Arrival

<briefing-overview plane-position="4" arrival-label="Arrival" controls></briefing-overview>

<!-- Click Direct-To to advance to arrival. -->
