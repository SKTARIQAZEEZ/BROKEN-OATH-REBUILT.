# BROKEN OATH rebuild roadmap

## Milestones 1–3 — implementation status

### 1. Mission framework
- [x] 15-chapter ordered campaign data and unique chapter IDs
- [x] Mission manager with objective progression and chapter unlocks
- [x] Objective event validation for reach, collect, defeat, interact, stealth, survive, rescue and evidence objective types
- [x] Checkpoint snapshots, failure/retry state, evidence flags and campaign serialization
- [x] Mission state persisted with local save and restored on load
- [x] Campaign and mission-manager automated tests
- [x] Canon-ordered typed objective definitions for all 15 chapters (reach, interact, collect, defeat, stealth, survive, rescue, evidence)\n- [x] Runtime objective validation wired to interaction and combat events\n- [ ] Full objective-specific trigger volumes, AI encounter gating and mission failure conditions across every mission
- [ ] End-to-end browser playthrough of all 15 chapters

### 2. Environments
- [x] 15 distinct chapter environment profiles and generated spaces
- [x] Themed blockout geometry for neighbourhood, sports ground, rooftop, operation zone, ruins, compound, city, investigation district, memory arena, warehouse, archive, safehouse, fortress and wedding courtyard
- [x] Dark cinematic lighting, fog, building facades, props and chapter landmarks
- [ ] Final high-detail art, interiors, bespoke set dressing and unique traversal/combat layouts
- [x] Player collision resolution against registered environment blockers\n- [ ] Navigation mesh/pathfinding, collision edge-case validation and per-chapter visual acceptance

### 3. Characters and animation foundation
- [x] Named procedural character presets for Azeez, Ranvir, Ananya, Anjali and Devraj
- [x] Procedural body, clothing, hair, facial placeholder details and role-specific gang/leader variants
- [x] Basic procedural idle/walk limb animation
- [ ] Final approved rigged 3D character models, facial rigs, clothing variants and authored animation clips
- [ ] Combat, stealth, interaction, cinematic and lip-sync animation sets

## Remaining milestones
### 4. Gameplay production
- [ ] Full stealth loop: patrol routes, vision cones, sound propagation, cover, takedowns, search and alarm escalation
- [ ] Advanced combat: combos, block, counter, dodge, weapons, boss phases and hit reactions
- [x] Objective-specific enemy wave spawning and full-wave completion checks\n- [ ] Enemy group tactics, navigation and encounter balancing

### 5. Campaign production
- [ ] Distinct mission scripts, encounter waves, checkpoints, story interactions and mission-specific mechanics for all chapters
- [ ] Ranvir flashbacks in canon order; two distinct confrontations; warehouse rescue; final battle and wedding
- [ ] Directed cinematics, dialogue branching and story-state continuity

### 6. Audio, UX and optimization
- [ ] Recorded dialogue, original score, ambience, footsteps, combat and UI SFX
- [ ] Settings/accessibility, robust save migration, PC/mobile control options
- [ ] Desktop and physical mobile performance profiling

### 7. Release
- [ ] Full browser gameplay QA and regression across all chapters
- [ ] PC/mobile acceptance testing
- [ ] Verified release ZIP with all assets, source and instructions

**Honest status:** the three foundations now have substantial implementation in source. Environment and character work is procedural blockout/placeholder quality, and the 15 missions are not yet individually authored and browser-playtested. Do not call these production-complete until those acceptance items are done.
