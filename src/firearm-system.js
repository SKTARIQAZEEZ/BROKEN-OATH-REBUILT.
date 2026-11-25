/** Deterministic firearm state: magazines, reserve ammo, reloads and fire cadence. */
export const FIREARMS={
 pistol:{label:"SERVICE PISTOL",magazineSize:12,reserve:60,fireRate:3.2,damage:2,range:48,reloadTime:1.35,pellets:1,spread:.004},
 rifle:{label:"ASSAULT RIFLE",magazineSize:30,reserve:120,fireRate:8.5,damage:1.5,range:72,reloadTime:1.8,pellets:1,spread:.009},
 shotgun:{label:"TACTICAL SHOTGUN",magazineSize:6,reserve:30,fireRate:1.15,damage:1.25,range:24,reloadTime:2.05,pellets:7,spread:.055}
};
export class FirearmSystem{
 constructor(){this.magazines={pistol:12,rifle:30,shotgun:6};this.reserve={pistol:60,rifle:120,shotgun:30};this.cooldown=0;this.reloadRemaining=0;this.reloading=false;this.reloadWeapon=null;this.shotsFired=0}
 update(dt){this.cooldown=Math.max(0,this.cooldown-dt);if(this.reloading){this.reloadRemaining=Math.max(0,this.reloadRemaining-dt);if(this.reloadRemaining===0)this.finishReload()}}
 fire(name){const w=FIREARMS[name];if(!w)return{ok:false,reason:"not-firearm"};if(this.reloading)return{ok:false,reason:"reloading"};if(this.cooldown>0)return{ok:false,reason:"cooldown"};if(this.magazines[name]<=0)return{ok:false,reason:"empty"};this.magazines[name]--;this.cooldown=1/w.fireRate;this.shotsFired++;return{ok:true,ammo:this.magazines[name],reserve:this.reserve[name],weapon:w}}
 reload(name){const w=FIREARMS[name];if(!w)return{ok:false,reason:"not-firearm"};if(this.reloading)return{ok:false,reason:"reloading"};if(this.magazines[name]>=w.magazineSize)return{ok:false,reason:"full"};if(this.reserve[name]<=0)return{ok:false,reason:"no-reserve"};this.reloading=true;this.reloadWeapon=name;this.reloadRemaining=w.reloadTime;return{ok:true,duration:w.reloadTime}}
 finishReload(){const name=this.reloadWeapon,w=FIREARMS[name];if(!w)return;const amount=Math.min(w.magazineSize-this.magazines[name],this.reserve[name]);this.magazines[name]+=amount;this.reserve[name]-=amount;this.reloading=false;this.reloadRemaining=0;this.reloadWeapon=null}
 cancelReload(){this.reloading=false;this.reloadRemaining=0;this.reloadWeapon=null}
 ammo(name){return FIREARMS[name]?{magazine:this.magazines[name],reserve:this.reserve[name],capacity:FIREARMS[name].magazineSize}:null}
}
