# BROKEN OATH — Rebuilt Project

A clean-room third-person 3D action-adventure development line. It does not depend on v051 and preserves the established 15-chapter story canon.

## Run locally

Install dependencies with `npm install`, then run `npm run dev` and open the local Vite URL. For a production bundle, run `npm run build`; the generated `dist/` directory includes the Three.js runtime and does not require a CDN. You can serve `dist/` with any static HTTP server (for example, `cd dist && python -m http.server 8000`).

## Controls

- **V**: Enter or exit a nearby vehicle. While driving, use **WASD** to accelerate, reverse and steer, **Space** to brake; the camera follows the vehicle and the speed HUD shows km/h. Touch users can use the **VEHICLE** action button.

- **WASD / arrow keys:** move
- **Mouse drag / touch drag on the world:** orbit camera
- **E:** interact with mission objects and nearby characters
- **Space:** melee attack
- **1–4:** equip unarmed, baton, knife or heavy melee profile
- **F:** block
- **Shift:** dodge
- **Q:** timed counter
- **G:** finisher on a staggered nearby enemy
- **T:** throw a sound distraction
- **C:** crouch
- **Escape:** pause
- Touch controls include movement, interaction, attack, block, dodge, counter, distraction and weapon switching. Mobile rendering uses a reduced pixel ratio and shadow map to lower GPU cost.
- Save data is versioned and legacy schema 1 saves migrate to schema 2 when loaded.

## Campaign

The campaign is authored in chronological order across 15 chapters: childhood, love and friendship, the promise, operation, the attack, betrayal, return, investigation, truth, reunion, broken brotherhood, revelation, together again, final battle and wedding epilogue.

Story beats include directed camera shot types, dialogue captions, procedural facial expressions and mouth motion. The final boss uses phase changes; the post-fight sequence stages Anjali protecting Ranvir. Dialogue remains text-based—there are no recorded voice performances yet.

## Implemented gameplay foundations

- Typed mission objectives, chapter progression, evidence, checkpoints, save/restore, retry and objective-specific stealth failure triggers.
- Fifteen procedural chapter spaces, collision blockers, furnished interior rooms in indoor locations and grid-based A* guard search.
- Procedural character meshes with basic body animation, facial expression controls and dialogue-driven mouth motion.
- Melee weapon profiles, combo/stamina/block/dodge, timed counters, stagger and finishers; phased Devraj encounter.
- Guard vision/hearing/search/alarm, sound propagation, bottle distraction and squad role assignment.
- Procedural ambience, footsteps and UI/impact tones.

## Visual and runtime polish

- Cinematic scene grade with restrained fog, softer shadow tuning, reduced harsh highlights and lightweight drifting dust particles around the player.
- Responsive HUD refinement, clearer pause presentation, keyboard focus states, reduced-motion support and improved mobile touch feedback.
- Audio mute now also prevents ambience from restarting; ambience nodes are disconnected when stopped. Pausing clears held movement/block inputs, and page exit releases visual, audio and vehicle resources.

## Verification and known production gaps

`npm test` runs source checks, system tests, chapter progression simulation, cinematic coverage validation, environment construction/disposal checks and gameplay-system unit tests. `npm run test:e2e` runs Playwright desktop and mobile Chromium smoke tests against the production build, with external network requests blocked to verify offline bundling. GitHub Actions runs both suites before packaging.

This is **not yet a production-complete game**. The current character art and environment geometry are procedural placeholders rather than realistic authored assets. Full facial rigs, mocap-quality clips, production animation, recorded voice acting, original score, complete SFX library, richer bespoke environments, physical mobile QA, full interactive 15-chapter browser playthroughs and production art/audio remain release gates. Passing automated tests does not prove those production requirements.


## Combat and weapon controls

- **1–4:** unarmed, baton, knife, heavy melee weapons.
- **5–7:** service pistol, assault rifle, tactical shotgun.
- **Right mouse button:** aim; **left mouse button:** fire while a firearm is equipped.
- **R:** reload. The HUD shows magazine and reserve ammunition.
- **Space:** melee attack when a melee weapon is equipped.
- On touch devices, use **AIM**, **FIRE / ATTACK**, and **RELOAD**.
- Firearms use weapon-specific fire rates, damage, range, spread, magazine sizes, reserve ammunition and reload times. Shots use camera-centred hit detection and environment line-of-sight checks.
