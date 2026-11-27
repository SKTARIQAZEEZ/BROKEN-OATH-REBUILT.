# BROKEN OATH — Player Test Checklist

Use this checklist for the first hands-on acceptance pass. Automated tests cover code-level behavior, but they do not replace this playthrough.

## Launch

- Open the packaged game in a modern desktop browser or mobile Chromium browser.
- Wait for the world to finish loading.
- Confirm Chapter 01, the player, HUD, objective marker and minimap appear.
- If the opening cinematic is shown, use CONTINUE to skip it or let it play.
- Confirm movement and camera controls respond after the intro.

## Desktop controls

| Action | Control |
|---|---|
| Move | WASD / arrow keys |
| Orbit camera | Drag mouse on world |
| Interact | E |
| Melee attack | Space |
| Equip melee profiles | 1–4 |
| Equip firearms | 5–7 |
| Aim / fire | Right mouse / left mouse |
| Reload | R |
| Block / dodge / counter / finisher | F / Shift / Q / G |
| Distraction | T |
| Crouch | C |
| Enter / exit vehicle | V |
| Brake while driving | Space |
| Pause | Escape |
| GPS guidance | N |
| Open map | MAP button |

## Mobile controls

- Drag the world area to orbit the camera.
- Use the on-screen movement pad to walk.
- Test FIRE / ATTACK, AIM, RELOAD, BLOCK, DODGE, COUNTER, DISTRACT and NEXT WEAPON.
- Test VEHICLE and BRAKE near a spawned vehicle.
- Check that HUD panels and touch controls do not cover essential objectives.

## Gameplay acceptance checklist

- [ ] Player movement and camera remain responsive.
- [ ] Player cannot walk through walls, house shells, cover, fences or large props.
- [ ] House entry doorway is traversable; interior furniture blocks movement.
- [ ] Football ground pitch, goals, fencing, bleachers and lights render in its chapter.
- [ ] NPCs appear in their assigned chapters and contextual interaction works.
- [ ] Hostile guards detect/search/attack and can be defeated.
- [ ] Melee attack, block, dodge, counter, stagger and finisher work.
- [ ] Pistol, rifle and shotgun equip, aim, fire, consume ammo and reload.
- [ ] Bullets do not damage targets through blocking environment geometry.
- [ ] Vehicle can be entered/exited, steered, reversed, braked and stopped by obstacles.
- [ ] Vehicle does not pass through buildings, walls or registered obstacles.
- [ ] Mission objectives, evidence/interaction triggers and chapter transitions progress.
- [ ] Save, reload and restart chapter behave as expected.
- [ ] Pause/resume and sound toggle work.
- [ ] GPS can be toggled without preventing free roaming.

## Report a problem

For each issue, note:
1. Chapter and exact location.
2. Desktop or mobile, browser and device.
3. Steps to reproduce.
4. Expected result and what actually happened.
5. Screenshot or short screen recording, if possible.

## Known limits

- This is a playable development build, not a production-certified release.
- Procedural environment and vehicle geometry remain in use; realistic bespoke asset polish, advanced vehicle physics/damage, mocap animation and recorded voice acting are not complete.
- The browser smoke tests are automated startup/control checks, not a complete 15-chapter interactive playthrough.
