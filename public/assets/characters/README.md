# BROKEN OATH real character assets

Install the supplied character and NPC archives with:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-character-assets.ps1 -CharacterZip .\BROKEN_OATH_CHARACTER_PACK_v001.zip -NpcZip .\BROKEN_OATH_NPC_PACK_V001.zip
```

The installer validates GLB headers and copies eight named/child cast models, twelve gang variants, and all nineteen NPC/guard/mini-boss/worker models into their runtime asset folders. The main cast and gang GLBs are loaded by `src/main.js` through `attachCharacterAsset`; child versions are selected for the early childhood chapters.

The supplied files are rigged GLB assets. The named cast exports contain embedded animation clips. The twelve gang variants have a skin but no embedded clips; `src/character-assets.js` now loads the shared Azeez animation library once and applies its clips to those matching character rigs. The nineteen NPC models are installed under `public/assets/npcs`; they are not yet assigned to mission actors.

Do not rename the GLBs or flatten the `Gang_Members` directory: runtime URLs depend on these names. The archives must be installed and the resulting `public/assets` files committed for deployed builds to serve the real models.
