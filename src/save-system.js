const SAVE_KEY="broken-oath-rebuilt-save";
const SAVE_SCHEMA=2;
const clamp=(value,min,max,fallback)=>Number.isFinite(value)?Math.min(max,Math.max(min,value)):fallback;

export class SaveSystem {
  save(state){
    const payload={
      ...state,
      schema:SAVE_SCHEMA,
      updatedAt:new Date().toISOString(),
      chapter:clamp(Number(state.chapter),0,14,0),
      step:clamp(Number(state.step),0,99,0),
      health:clamp(Number(state.health),0,100,100),
      player:state.player&&Number.isFinite(Number(state.player.x))&&Number.isFinite(Number(state.player.z))?{x:clamp(Number(state.player.x),-28,28,0),z:clamp(Number(state.player.z),-28,28,0)}:null
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
        player:data.player&&Number.isFinite(Number(data.player.x))&&Number.isFinite(Number(data.player.z))?{x:clamp(Number(data.player.x),-28,28,0),z:clamp(Number(data.player.z),-28,28,0)}:null,
        mission
      };
    }catch{return null}
  }
  clear(){localStorage.removeItem(SAVE_KEY)}
}
