# BROKEN OATH — Production acceptance

## Implemented in the repository

### Missions
- [x] 15 canon-ordered chapters and typed objectives
- [x] Checkpoints, retry, save/restore, evidence and chapter unlocks
- [x] Objective-scoped trigger registration, stealth-compromise failure, optional authored deadlines and damage limits
- [x] Automated campaign progression simulation across every objective type

### Environments and navigation
- [x] 15 distinct dark procedural chapter blockouts
- [x] Collision blockers, line-of-sight obstruction and player collision resolution
- [x] Furnished interior room kits in warehouse, archive, fortress, compound and safehouse-style locations
- [x] Residential house facades with pitched roof silhouettes, doors, windows, porches and physical collision
- [x] Drivable chapter vehicles with enter/exit, throttle, reverse, steering, follow camera, speed HUD and environment collision
- [x] Collision blockers for cover crates, barrels, utility poles, street lamps, planters, rooftop equipment and structural props
- [x] Chapter-specific set dressing: industrial pipe/cable runs, drums, pallets, crates, barriers, utility poles/wires, street furniture, burned debris, ceremony lights and planters
- [x] Deterministic procedural PBR albedo and bump maps for asphalt, concrete, stone, metal, wood, burnt surfaces and fabric
- [x] Grid-based A* navigation used by guards during search/investigation
- [x] Environment construction, collision-data and disposal tests

### Characters and cinematics
- [x] Five named procedural character meshes with layered clothing, facial detail, hair silhouettes and accessory dressing
- [x] Procedural fabric PBR albedo/bump materials, articulated forearm and knee rig groups, and per-frame NPC/enemy animation
- [x] Procedural facial expressions and dialogue-driven mouth motion hooks
- [x] Authored dialogue beats and directed shot types for all 15 chapters
- [x] Reunion dialogue is staged after the final captive rescue, followed by the brotherhood truth sequence
- [x] Cinematic camera staging and sequence lifecycle callbacks
- [ ] Production-quality realistic character models, topology, UVs, materials and clothing
- [ ] Full facial rigs, recorded voice, phoneme-aligned lip-sync and authored/mocap animation clips
- [ ] Browser review of every camera shot, actor position, continuity and subtitle timing

### Combat and AI
- [x] Weapon profiles: unarmed, baton, knife and heavy melee
- [x] Combo/stamina, block, dodge, timed counter, stagger and finisher logic
- [x] Multi-phase Devraj boss controller and final battle sequence
- [x] Guard vision, sound-based investigation, search, alarm and A* movement
- [x] Squad role assignments, sound propagation and player-triggered bottle distraction
- [x] Squad cover-seeking role with reserved cover positions derived from level collision geometry and A* steering
- [x] Visible baton, knife and heavy melee weapon meshes, equipment switching and swing animation
- [ ] Animation-authored hit reactions, weapon-specific clips, polished boss telegraphs and combat balancing
- [ ] Full squad coordination with path-aware flanking, cover selection, takedown animations and group alarm response

### Audio
- [x] Procedural ambience, footsteps, UI and impact tones
- [x] Named objective, failure, chapter-transition and boss audio cues with ambience switching
- [x] Adaptive procedural score themes for memory, tension, danger, reunion and finale, switched on chapter transitions
- [ ] Original composed score, recorded dialogue performances, final SFX library, mixing and mastering

## Remaining production and verification gates

- [ ] Replace procedural character placeholders with licensed/created production models and rigs
- [ ] Replace remaining blockout geometry with detailed bespoke environments, interiors, props and final materials
- [ ] Replace procedural gameplay vehicles with authored production vehicle models and tune advanced suspension/damage physics
- [ ] Complete animation, recorded voice and audio asset integration
- [ ] Full interactive browser playthrough of all 15 chapters, including every failure/retry path and save/load transition
- [ ] Manual visual QA of lighting, collision, navigation, combat, cutscenes and accessibility
- [ ] PC and physical mobile performance testing
- [ ] Final packaging and verify `BROKEN_OATH_COMPLETE_GAME.zip`

**Release rule:** Unit tests and automated campaign simulation are not a substitute for interactive playtesting or production art/audio. The game is not release-complete while any production or manual QA gate remains unchecked.
