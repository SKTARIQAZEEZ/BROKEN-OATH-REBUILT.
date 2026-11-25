import assert from "node:assert/strict";
import {createCharacter,CHARACTER_PRESETS} from "../src/characters.js";
for(const [key,preset] of Object.entries(CHARACTER_PRESETS)){
 const character=createCharacter(preset);
 assert.equal(character.name,preset.name);
 assert.equal(character.userData.limbs.legs.length,2);
 assert.equal(character.userData.limbs.arms.length,2);
 assert.equal(typeof character.userData.setAnimation,"function");
 character.userData.setAnimation("attack");
 character.userData.animate(1/60,1,false);
 assert.equal(character.userData.animation.name,"attack");
}
console.log("Character checks passed: five named presets, limb rig and animation state API.");
