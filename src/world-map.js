const NODES=[
 ["01","The Days Before","Childhood neighbourhood","homes",8,10],
 ["02","Love and Friendship","School & football ground","sports",23,7],
 ["03","The Promise","Rooftop & departure","rooftop",38,10],
 ["04","Beyond the Lines","Operation perimeter","industrial",54,8],
 ["05","The Night of Fire","Burned family home","ruins",70,10],
 ["06","The Lie","Devraj compound","compound",84,15],
 ["07","A City of Shadows","Controlled city","street",70,27],
 ["08","The Investigation","Evidence district","investigation",53,31],
 ["09","The Truth","Memory arena","arena",36,29],
 ["10","The Reunion","Warehouse prison","warehouse",19,33],
 ["11","The Broken Brotherhood","Broken brotherhood","arena",8,49],
 ["12","The Revelation","Records archive","interior",24,57],
 ["13","Together Again","Safehouse district","safehouse",43,55],
 ["14","The Final Battle","Devraj headquarters","fortress",65,57],
 ["15","The Promise Fulfilled","Wedding courtyard","ceremony",84,49]
];
const ns="http://www.w3.org/2000/svg";
const el=(tag,attrs={},text="")=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text)n.textContent=text;return n};
export function createWorldMap({getChapter=()=>0,onClose=()=>{}}={}){
 const overlay=document.createElement("section");overlay.id="worldMap";overlay.className="world-map hide";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-label","Campaign world map");
 const panel=document.createElement("div");panel.className="world-map-panel";overlay.append(panel);
 const head=document.createElement("header");head.className="world-map-head";head.innerHTML='<div><small> BROKEN OATH / CAMPAIGN ATLAS </small><h2>THE WORLD MAP</h2><p>Follow the story route across all 15 chapters</p></div><button type="button" aria-label="Close map">CLOSE ✕</button>';panel.append(head);head.querySelector("button").addEventListener("click",()=>{overlay.classList.add("hide");onClose()});
 const svg=el("svg",{viewBox:"0 0 100 68",role:"img","aria-label":"Schematic campaign route map"});
 svg.append(el("defs"));
 const coast=el("path",{d:"M2 17 Q13 4 29 12 T58 8 T96 17 L96 62 Q80 67 66 63 T37 65 T3 54 Z",fill:"#19252a",stroke:"#52616a","stroke-width":".45"});
 svg.append(coast);
 for(let i=0;i<7;i++)svg.append(el("path",{d:`M${4+i*14} 4 Q${10+i*13} 25 ${4+i*14} 66`,stroke:"#29383d","stroke-width":".28",fill:"none"}));
 for(let i=0;i<6;i++)svg.append(el("path",{d:`M3 ${13+i*9} Q48 ${8+i*10} 97 ${13+i*9}`,stroke:"#29383d","stroke-width":".28",fill:"none"}));
 const pts=NODES.map(n=>n[4]+","+n[5]).join(" ");
 svg.append(el("polyline",{points:pts,fill:"none",stroke:"#c99b5e","stroke-width":".65","stroke-dasharray":"1.4 1.05","stroke-linecap":"round","stroke-linejoin":"round"}));
 const labels=el("g",{class:"map-nodes"});
 NODES.forEach((n,i)=>{
  const [num,title,place,type,x,y]=n,group=el("g",{class:"map-node","data-chapter":i,tabindex:"0",role:"button","aria-label":`Chapter ${num}: ${title}, ${place}`});
  group.append(el("circle",{cx:x,cy:y,r:"2.25",class:"map-node-halo"}),el("circle",{cx:x,cy:y,r:"1.55",class:"map-node-dot"}),el("text",{x:x,y:y+.55,"text-anchor":"middle",class:"map-node-num"},num));
  const tx=x>75?x-2.6:x+2.6,anchor=x>75?"end":"start";
  group.append(el("text",{x:tx,y:y-1.6,"text-anchor":anchor,class:"map-node-label"},title));
  group.addEventListener("click",()=>select(i));group.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(i)}});
  labels.append(group);
 });svg.append(labels);panel.append(svg);
 const foot=document.createElement("footer");foot.className="world-map-foot";foot.innerHTML='<span>● CURRENT CHAPTER</span><span>— STORY ROUTE</span><span>15 LOCATIONS · CHRONOLOGICAL CAMPAIGN</span>';panel.append(foot);
 function select(index){const nodes=labels.querySelectorAll(".map-node");nodes.forEach((node,i)=>node.classList.toggle("current",i===index));const n=NODES[index];foot.querySelector("span:last-child").textContent="CHAPTER "+n[0]+" · "+n[2].toUpperCase()}
 function open(){overlay.classList.remove("hide");select(Math.max(0,Math.min(14,getChapter())));head.querySelector("button").focus()}
 function close(){overlay.classList.add("hide");onClose()}
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.classList.contains("hide"))close()});
 return {element:overlay,open,close,select};
}
