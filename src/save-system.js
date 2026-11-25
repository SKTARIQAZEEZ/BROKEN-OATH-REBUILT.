const SAVE_KEY="broken-oath-rebuilt-save";
const SAVE_SCHEMA=2;
const clamp=(value,min,max,fallback)=>Number.isFinite(value)?Math.min(max,Math.max(min,value)):fallback;

export class SaveSystem {
  save(state){
    const payload={
      schema:SAVE_SCHEMA,
      updatedAt:new Date().toISOString(),
      ...state,
      chapter:clamp(Number(state.chapter),0,14,0),
      step:clamp(Number(state.step),0,99,0),
      health:clamp(Number(state.health),0,100,100)
    };
    localStorage.setItem(SAVE_KEY,JSON.stringify(payload));
    return payload;
  }
  load(){
    try{
      const raw=localStorage.getItem(SAVE_KEY);
      if(!raw)return null;
      const data=JSON.parse(raw);
      if(!data||![1,SAVE_SCHEMA].includes(data.schema))return null;
      const mission=data.mission&&[1,2].includes(data.mission.schema)?data.mission:null;
      // Schema 1 saves are migrated in memory; their mission snapshot remains compatible
      // with MissionManager.restore(), which accepts both schema 1 and schema 2.
      return {
        ...data,
        schema:SAVE_SCHEMA,
        chapter:clamp(Number(data.chapter),0,14,0),
        step:clamp(Number(data.step),0,99,0),
        health:clamp(Number(data.health),0,100,100),
        mission
      };
    }catch{return null}
  }
  clear(){localStorage.removeItem(SAVE_KEY)}
}
