import {STORY_CINEMATICS} from "./campaign-cinematics.js";

/** Returns the authored cinematic beats that belong to a chapter transition. */
export function chapterTransitionSequence(fromChapterIndex,toChapterIndex){
 if(fromChapterIndex===9&&toChapterIndex===10)return [...STORY_CINEMATICS.CH10_REUNION,...STORY_CINEMATICS.CH11_BROTHERHOOD];
 if(toChapterIndex===9)return [];
 return [...(STORY_CINEMATICS[Object.keys(STORY_CINEMATICS)[toChapterIndex]]||[])];
}
export function isFamilyReunionTransition(fromChapterIndex,toChapterIndex){return fromChapterIndex===9&&toChapterIndex===10}
