const SAVE_KEY="broken-oath-rebuilt-save";
export class SaveSystem {
  save(state){const payload={schema:1,updatedAt:new Date().toISOString(),...state};localStorage.setItem(SAVE_KEY,JSON.stringify(payload));return payload}
  load(){try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;const data=JSON.parse(raw);if(data.schema!==1)return null;return data}catch{return null}}
  clear(){localStorage.removeItem(SAVE_KEY)}
}
