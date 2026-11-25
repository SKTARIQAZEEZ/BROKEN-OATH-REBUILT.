import assert from "node:assert/strict";
import * as THREE from "three";
import {applyVisualPolish} from "../src/visual-polish.js";

globalThis.window = {devicePixelRatio: 1};
const scene = new THREE.Scene();
const hemi = new THREE.HemisphereLight(0xffffff, 0x111111, 1.5);
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
scene.add(hemi, sun);
const calls = [];
const renderer = {
  setPixelRatio: value => calls.push(["pixelRatio", value]),
  outputColorSpace: null, toneMapping: null, toneMappingExposure: 1,
  shadowMap: {}
};
const polish = applyVisualPolish(scene, renderer, {mobile: true});
assert.ok(scene.fog instanceof THREE.FogExp2);
assert.ok(hemi.intensity <= 0.9);
assert.ok(sun.intensity <= 1.65);
assert.equal(renderer.shadowMap.enabled, true);
assert.deepEqual(calls[0], ["pixelRatio", 1]);
const dust = scene.children.find(child => child.isPoints);
assert.ok(dust, "atmospheric dust should be added");
polish.update(0.016, new THREE.Vector3(4, 0, -3));
assert.equal(dust.position.x, 4);
assert.equal(dust.position.z, -3);
polish.dispose();
assert.ok(!scene.children.includes(dust));
console.log("visual polish tests passed");
