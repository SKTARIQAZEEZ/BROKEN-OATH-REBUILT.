# BROKEN OATH — Rebuilt Project

A clean-room third-person 3D action-adventure development line. It does not depend on v051 and preserves the established 15-chapter story canon.

## Run locally

Serve this directory over HTTP (ES modules require a local server), then open `http://localhost:8000`. Example: `python -m http.server 8000`.

## Controls

- **WASD / arrow keys:** move
- **Mouse drag:** orbit camera
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
- Touch movement/action controls are provided for mobile browsers.

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

## Verification and known production gaps

`npm test` runs source checks, system tests, chapter progression simulation, cinematic coverage validation, environment construction/disposal checks and gameplay-system unit tests. GitHub Actions runs the same verification.

This is **not yet a production-complete game**. The current character art and environment geometry are procedural placeholders rather than realistic authored assets. Full facial rigs, mocap-quality clips, production animation, recorded voice acting, original score, complete SFX library, richer bespoke environments, physical mobile QA and full interactive browser playthroughs remain release gates. Passing automated tests does not prove those production requirements.
