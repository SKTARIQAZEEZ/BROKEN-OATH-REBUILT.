# Authored world asset placement

The chapter environment loader now has an authored-asset placement manifest in
`src/world-assets.js`. It preserves the procedural chapter geometry as a
fallback and attempts to load the following GLBs from `public/assets/world/`:

- `suburban-family-house.glb`
- `black-and-white-police-car.glb`
- `blue-pickup-truck.glb`
- `oak-tree-stump.glb`
- `cartoon-stylized-tree.glb`
- `city-transit-bus.glb`
- `dead-leafless-tree.glb`
- `fallen-wooden-log.glb`
- `low-poly-grey-rock.glb`
- `red-fire-truck.glb`
- `red-sports-car.glb`
- `red-wooden-barn.glb`\n\nThe following five additional models are loaded directly from the URLs you supplied:\n\n- Red cottage — `https://tevy.dev/models/red-cottage/v2/lod0.glb`\n- Apartment block — `https://tevy.dev/models/apartment-block/v2/lod0.glb`\n- Apartment room — `https://tevy.dev/models/apartment-room/v2/lod0.glb`\n- Bald cypress — `https://tevy.dev/models/bald-cypress/v1/lod0.glb`\n- Dirt bike — `https://tevy.dev/models/dirt-bike/v1/lod0.glb`

## Install the uploaded model files

Copy the 12 original GLB files into:

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

The source-side loader and placement manifest are committed. The GLB binaries
are not included in this repository yet, so the authored models will not appear
until the files are copied into the folder above. The procedural environment
remains active as a fallback. Visual placement, model scale, and collision
still require an in-browser playtest after the binaries are present.
