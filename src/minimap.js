const NS="http://www.w3.org/2000/svg";
const el=(tag,attrs={},text)=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n};
export function createMiniMap({onOpenMap=()=>{}}={}){
 const root=document.createElement("section");root.id="miniMap";root.setAttribute("aria-label","Local minimap");
 const style=document.createElement("style");style.textContent=`
 #miniMap{position:absolute;z-index:6;left:18px;bottom:18px;width:164px;height:164px;border:1px solid rgba(201,155,94,.75);border-radius:50%;overflow:hidden;background:rgba(5,11,15,.88);box-shadow:0 8px 28px #000a;backdrop-filter:blur(5px);pointer-events:none}
 #miniMap svg{width:100%;height:100%;display:block}
 #miniMap .mini-road{fill:none;stroke:#777a73;stroke-width:2.4;stroke-linecap:round}
 #miniMap .mini-road-edge{fill:none;stroke:#242d30;stroke-width:4.2;stroke-linecap:round}
 #miniMap .mini-objective{fill:#e6b66f;stroke:#fff0ce;stroke-width:1.1;filter:drop-shadow(0 0 3px #e6b66f)}
 #miniMap .mini-player{fill:#d8e8ef;stroke:#0b141a;stroke-width:1.4}
 #miniMap .mini-label{font:6px Arial;fill:#e8d7bd;letter-spacing:.8px}
 #miniMap .mini-top{position:absolute;top:8px;left:0;right:0;text-align:center;font:700 8px Arial;letter-spacing:2px;color:#d5b17b;text-shadow:0 1px 3px #000}
 #miniMap .mini-north{position:absolute;top:23px;left:0;right:0;text-align:center;font:7px Arial;color:#9eabb0}
 #miniMap .mini-map-open{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font:700 8px Arial;letter-spacing:1px;color:#e8d7bd;white-space:nowrap}
 @media(max-width:760px){#miniMap{width:124px;height:124px;left:8px;bottom:82px}#miniMap .mini-top{font-size:7px}#miniMap .mini-north{top:19px}}
 @media(max-height:540px){#miniMap{width:108px;height:108px;bottom:8px}}
 `;document.head.append(style);
 const svg=el("svg",{viewBox:"0 0 100 100",role:"img","aria-label":"Local streets, player position and active mission marker"});
 svg.append(el("circle",{cx:50,cy:50,r:49,fill:"#142229",stroke:"#56636a","stroke-width":".8"}));
 svg.append(el("path",{d:"M-5 28 Q25 20 48 34 T105 25 M-5 70 Q25 62 50 72 T105 62 M22 -5 Q30 25 43 48 T35 105 M72 -5 Q65 24 76 50 T68 105",class:"mini-road-edge"}));
 svg.append(el("path",{d:"M-5 28 Q25 20 48 34 T105 25 M-5 70 Q25 62 50 72 T105 62 M22 -5 Q30 25 43 48 T35 105 M72 -5 Q65 24 76 50 T68 105",class:"mini-road"}));
 for(let y=34;y<68;y+=9)for(let x=33;x<70;x+=9)svg.append(el("rect",{x,y,width:5,height:4,rx:.5,fill:"#3b4848",stroke:"#69716b","stroke-width":".35"}));
 const route=el("polyline",{points:"",fill:"none",stroke:"#e6b66f","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","stroke-dasharray":"2.2 1.4",opacity:".95"});
 const objective=el("circle",{cx:50,cy:50,r:3.5,class:"mini-objective"}),player=el("path",{d:"M50 43 L45 56 L50 53 L55 56 Z",class:"mini-player"});
 svg.append(route,objective,player);root.append(svg);
 const distance=document.createElement("div");distance.className="mini-north";distance.style.top="auto";distance.style.bottom="22px";distance.textContent="";root.append(distance);
 const top=document.createElement("div");top.className="mini-top";top.textContent="LOCAL MAP";root.append(top);
 const north=document.createElement("div");north.className="mini-north";north.textContent="N ↑";root.append(north);
 const open=document.createElement("div");open.className="mini-map-open";open.textContent="M · FULL MAP";root.append(open);
 root.addEventListener("click",()=>onOpenMap());root.style.pointerEvents="auto";root.style.cursor="pointer";root.title="Open campaign map";
 function update(position,target,yaw,chapter){const px=50+Math.max(-40,Math.min(40,position.x*1.25)),py=50+Math.max(-40,Math.min(40,position.z*1.25));player.setAttribute("transform",`translate(${px-50} ${py-50}) rotate(${(yaw||0)*180/Math.PI} 50 50)`);if(target){const tx=50+Math.max(-40,Math.min(40,(target.x-position.x)*1.25)),ty=50+Math.max(-40,Math.min(40,(target.z-position.z)*1.25));objective.setAttribute("cx",tx);objective.setAttribute("cy",ty);objective.style.display="";}else objective.style.display="none";top.textContent="CH "+String(chapter+1).padStart(2,"0")+" · LOCAL MAP"}
 function updateRoute(path=[],meters=null,origin={x:0,z:0}){const pts=[origin,...(path||[])].map(p=>`${50+Math.max(-40,Math.min(40,p.x*1.25))},${50+Math.max(-40,Math.min(40,p.z*1.25))}`);route.setAttribute("points",pts.join(" "));distance.textContent=Number.isFinite(meters)?(meters<1000?Math.round(meters)+" M":(meters/1000).toFixed(1)+" KM"):"";distance.style.display=meters===null?"none":""}
 return {element:root,update,updateRoute};
}
