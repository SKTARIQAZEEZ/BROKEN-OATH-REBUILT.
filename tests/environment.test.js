import assert from "node:assert/strict";
import {CHAPTER_ENVIRONMENT_NAMES} from "../src/environments.js";
assert.equal(CHAPTER_ENVIRONMENT_NAMES.length,15);
assert.equal(new Set(CHAPTER_ENVIRONMENT_NAMES).size,15);
console.log("Environment manifest checks passed: 15 distinct chapter spaces.");
