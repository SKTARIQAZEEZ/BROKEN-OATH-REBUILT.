# Authored world asset placement

The chapter environment loader uses an authored-asset placement manifest in
`src/world-assets.js`. It preserves procedural chapter geometry as a fallback
and loads local GLBs from `public/assets/world/`.

The current asset pack contains 19 local models:
- suburban-family-house.glb
- black-and-white-police-car.glb
- blue-pickup-truck.glb
- oak-tree-stump.glb
- cartoon-stylized-tree.glb
- city-transit-bus.glb
- dead-leafless-tree.glb
- fallen-wooden-log.glb
- low-poly-grey-rock.glb
- red-fire-truck.glb
- red-sports-car.glb
- red-wooden-barn.glb
- apartment-block.glb
- apartment-room.glb
- bald-cypress.glb
- corner-shop.glb
- delivery-scooter.glb
- dirt-bike.glb
- football-goal.glb

The following URL assets remain external:
- Red cottage — `https://tevy.dev/models/red-cottage/v2/lod0.glb`
- Football — `https://tevy.dev/models/football/v1/lod0.glb`
- Football pitch — `https://tevy.dev/models/football-pitch/v1/lod0.glb`

## Install the uploaded model files

Extract `BROKEN_OATH_WORLD_ASSETS_INSTALL_v2.zip` into the project root. It contains the 19 GLB files under `public/assets/world/`.

```text
D:\\final\\BROKEN-OATH\\public\\assets\\world\\
```

Create the `world` folder if it does not exist. Keep the filenames exactly as
listed above. Then run:

```powershell
git add public/assets/world
git commit -m "Add authored world environment GLBs"
git push origin main
npm run dev
```

## Placement

The placement manifest distributes houses and foliage through residential
chapters; police, pickup, bus and sports vehicles through city/industrial
chapters; and dead trees, stumps, logs and rocks around ruined and perimeter
areas. The fire truck is placed at the burned-home perimeter. Model dimensions
are normalized at load time. Vehicle and obstacle bounds are added to the
chapter collision list. The house collision is split into perimeter walls so
the entrance and interior remain accessible.

## Verification status

The source-side loader and story placement manifest are committed. The GLB binaries are packaged separately and must be extracted and pushed to the repository. The procedural environment remains active as a fallback. Visual placement, model scale, and collision still require an in-browser playtest after the binaries are present.
