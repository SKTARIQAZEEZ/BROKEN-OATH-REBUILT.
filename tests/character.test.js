import assert from "node:assert/strict";
import {createCharacter,CHARACTER_PRESETS} from "../src/characters.js";
for(const [key,preset] of Object.entries(CHARACTER_PRESETS)){
 const character=createCharacter(preset);
 assert.equal(character.name,preset.name);
 assert.equal(character.userData.limbs.legs.length,2);
 assert.equal(character.userData.limbs.arms.length,2);
 assert.ok(character.children.some(o=>o.name==="chest-panel"||o.name==="shawl-fold"),"named character must receive detailed clothing geometry");
 assert.ok(character.userData.detailMaterials.length>=8);
 assert.equal(typeof character.userData.setAnimation,"function");
 assert.equal(typeof character.userData.setExpression,"function");
 assert.equal(typeof character.userData.setTalking,"function");
 character.userData.setExpression("angry");character.userData.setTalking(true);character.userData.animate(1/60,1,false);
 assert.ok(character.userData.face.mouth.scale.y>.22);character.userData.setTalking(false);
 character.userData.setAnimation("attack");
 character.userData.animate(1/60,1,false);
 assert.equal(character.userData.animation.name,"attack");
 character.userData.animate(.5,1.1,false);
 assert.equal(character.userData.animation.name,"idle","one-shot attack animation must return to idle");
 for(const action of ["counter","dodge","finisher","hit"]){
  character.userData.setAnimation(action);
  character.userData.animate(1.1,2,false);
  assert.equal(character.userData.animation.name,"idle",action+" animation must recover");
 }
}
console.log("Character checks passed: five named presets, limb rig and animation state API.");
