# BROKEN OATH rebuild roadmap

## Active production status

### 1. Missions, triggers and playtesting
- [x] 15 canon-ordered chapters with typed objectives
- [x] Mission state, checkpoints, retry, save/restore and evidence flags
- [x] Proximity auto-trigger for reach objectives
- [x] Reusable trigger conditions, deadlines, damage limits and failure callbacks
- [ ] Define and wire authored trigger volumes and failure rules for every individual objective
- [ ] Complete automated chapter simulation and full browser playthrough of all 15 chapters

### 2. Environments and navigation
- [x] Fifteen distinct dark procedural environment blockouts
- [x] Registered collision blockers, player collision resolution and cover line-of-sight checks
- [ ] Detailed building exteriors, interiors, bespoke props, destructible set dressing and traversal routes
- [ ] Navigation mesh/pathfinding for guards and full collision edge-case tests
- [ ] Visual acceptance review for every chapter

### 3. Characters and animation
- [x] Five named procedural character placeholders and role variants
- [x] Basic procedural idle, walk, guard, attack and hit poses
- [ ] Production-quality approved 3D models, topology, UVs, materials and clothing
- [ ] Rigging, facial blendshapes, facial animation, mocap/author-authored clips and lip-sync

### 4. Combat and enemy AI
- [x] Melee attacks, combo scaling, stamina, block and dodge state logic
- [x] Guard vision, cover-aware sight, investigate and timed search states
- [x] Alarm escalation state and last-known-player-position memory
- [ ] Integrate all combat states with authored player/enemy animation and readable hit reactions
- [ ] Weapon classes, counters, finishers, boss phases, enemy squad tactics and balancing
- [ ] Sound propagation, distraction objects, takedowns and alarm response behavior

### 5. Campaign and cinematics
- [x] Canon-ordered 15-chapter objective data
- [x] Initial authored dialogue beats for childhood, promise, betrayal, reunion, truth and finale
- [ ] Fully authored mission-by-mission dialogue, branching story state and continuity validation
- [ ] Directed in-engine camera work, staging, flashback gameplay sequences and complete cutscenes
- [ ] Fully playable final battle, family rescue, Ranvir redemption and wedding epilogue

### 6. Audio
- [x] Procedural UI and impact tones
- [x] Procedural ambience and footstep sound hooks
- [ ] Professionally produced/original score, location-specific ambience and complete SFX library
- [ ] Recorded voice performances, editing, mixing, subtitles and lip-sync integration

### 7. Release and acceptance
- [ ] Passing CI for all source checks and gameplay tests
- [ ] Browser QA of all chapters, save/load, controls, combat, stealth and failure/retry
- [ ] PC and physical mobile performance/accessibility acceptance
- [ ] Package all licensed/created assets and verify final `BROKEN_OATH_COMPLETE_GAME.zip`

**Release gate:** Procedural systems, placeholder geometry, synthesized test tones and text captions are not substitutes for realistic art, rigged animation, recorded dialogue or full chapter playtesting. The project is not complete until every unchecked acceptance item is implemented and verified.
