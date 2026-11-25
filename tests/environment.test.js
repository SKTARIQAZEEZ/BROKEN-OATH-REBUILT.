import assert from "node:assert/strict";
import {CHAPTER_ENVIRONMENT_NAMES,CHAPTER_ENVIRONMENT_KINDS} from "../src/environments.js";
assert.equal(CHAPTER_ENVIRONMENT_NAMES.length,15);
assert.equal(new Set(CHAPTER_ENVIRONMENT_NAMES).size,15);
assert.equal(CHAPTER_ENVIRONMENT_KINDS.length,15);
assert.ok(CHAPTER_ENVIRONMENT_KINDS.includes("warehouse"));
assert.ok(CHAPTER_ENVIRONMENT_KINDS.includes("ceremony"));
console.log("Environment manifest checks passed: 15 distinct chapter spaces and environment profiles.");
