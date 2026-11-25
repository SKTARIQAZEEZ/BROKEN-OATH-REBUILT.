# BROKEN OATH real character assets

Install the supplied character and NPC archives with:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-character-assets.ps1 -CharacterZip .\BROKEN_OATH_CHARACTER_PACK_v001.zip -NpcZip .\BROKEN_OATH_NPC_PACK_V001.zip
```

The installer copies the eight named/adolescent models, twelve gang variants, and all NPC/guard/mini-boss/worker models into the exact public paths used by the runtime. The main cast and gang GLBs are loaded by `src/main.js` through `attachCharacterAsset`; the child versions are selected for the early childhood chapters.

The supplied GLBs are real rigged glTF binary assets. The named cast exports contain a skin and 21 animation clips. The random gang exports contain a skin but no embedded clips; the runtime can use the shared Azeez animation library when the updated shared-clip loader is installed. NPC archive models are provided for subsequent roster wiring.

Do not rename the GLBs or flatten the `Gang_Members` directory: runtime URLs depend on these names.
