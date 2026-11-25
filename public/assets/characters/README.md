# BROKEN OATH authored character assets

The runtime loader expects these exact files:

- `public/assets/characters/Azeez.glb`
- `public/assets/characters/Ranvir.glb`
- `public/assets/characters/Ananya.glb`
- `public/assets/characters/Anjali.glb`
- `public/assets/characters/Devraj.glb`

Copy the five GLB files from the PowerShell export ZIP into this folder. Do not rename them. The loader scales each model to its authored character height, preserves the actor's gameplay root and weapon mount, and plays the embedded Idle, Walk, Run, Punch, Fighting stance, and kick/block clips. If a file is absent or fails to load, the existing procedural stand-in remains visible.

The GLBs are intentionally not duplicated into source code. Keep the original exports as the source of truth and commit the five binary files to this folder (or use Git LFS if repository size limits require it).
