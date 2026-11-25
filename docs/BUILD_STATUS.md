# BROKEN OATH — Rebuild implementation status

## Systems currently implemented
- Clean Three.js ES-module third-person application with desktop and touch controls.
- Fifteen chronological campaign chapters, typed objectives, checkpoints, retry, save/restore and evidence.
- Fifteen dark procedural environments with chapter-specific set-dressing kits, collision, furnished interiors and deterministic PBR albedo/bump textures.
- Five named procedural characters with layered clothing and facial detail, articulated forearm/knee groups, expression/talking hooks and per-frame NPC/enemy animation.
- Authored dialogue and camera-shot beats across all 15 chapters; opening, reunion and final-battle story sequences are wired into progression.
- Melee combat profiles, visible baton/knife/heavy meshes, equipment switching, swing animation, counters, dodge, block, finishers and phased Devraj boss encounter.
- Guard vision/hearing/search/alarm, A* investigation movement, squad suppress/flank/search roles, reserved cover-seeking, sound propagation and distraction.
- Procedural ambience, gameplay cues and adaptive original synthesized score themes for memory, tension, danger, reunion and finale.
- Stealth infiltration objectives spawn active guards at the mission site; survival objectives create encounter pressure; mission failure opens an explicit retry state.
- Chapter 10 captives remain hidden until rescued; investigation, memory-arena and rooftop spaces have dedicated set dressing.
- Mobile touch-drag camera orbit, mobile-aware rendering/shadows, startup error recovery and schema-1-to-schema-2 save migration are covered by regression tests.
- Automated tests cover campaign progression, systems, chapter environments, character rig APIs, cinematic lifecycle, PBR texture determinism, squad cover assignments and weapon visuals.
- Vite creates a self-contained production bundle with Three.js bundled locally; the game no longer depends on a runtime CDN request.
- Playwright desktop and mobile Chromium smoke tests validate startup, rendering, pause/resume, sound toggle and touch controls with external network requests blocked.
- GitHub Actions runs source tests, production bundling and browser smoke tests before packaging the ZIP artifact.

## Production requirements not yet accepted
- These are still procedural game assets, not licensed/commissioned photorealistic character models, authored environment kits or studio-quality PBR texture sets.
- No motion-captured animation library, full production facial rig, recorded actor voice performances, phoneme-aligned lip-sync or final composed/recorded score and SFX library.
- Browser smoke coverage now exists for desktop and mobile layouts, but no full interactive playthrough of all 15 chapters, manual cinematic review, or PC/physical mobile performance and visual QA has been accepted.
- The current automated campaign simulation does not prove every real-time gameplay path works in-browser.

**Release status: NOT production-complete.** Automated test success and ZIP generation are build milestones only, not a substitute for asset integration and manual acceptance.
