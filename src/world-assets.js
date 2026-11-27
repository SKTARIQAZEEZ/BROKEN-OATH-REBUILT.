import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * Optional authored world dressing. The procedural environment remains the
 * fallback until the GLB files exist at these public paths.
 */
const ROOT = "/assets/world/";
const ASSETS = {
  house: "suburban-family-house.glb",
  police: "black-and-white-police-car.glb",
  pickup: "blue-pickup-truck.glb",
  stump: "oak-tree-stump.glb",
  tree: "cartoon-stylized-tree.glb",
  bus: "city-transit-bus.glb",
  deadTree: "dead-leafless-tree.glb",
  log: "fallen-wooden-log.glb",
  rock: "low-poly-grey-rock.glb",
  fireTruck: "red-fire-truck.glb",
  sportsCar: "red-sports-car.glb",
  barn: "red-wooden-barn.glb",
  cottage: "https://tevy.dev/models/red-cottage/v2/lod0.glb",
  apartment: "apartment-block.glb",
  apartmentRoom: "apartment-room.glb",
  cypress: "bald-cypress.glb",
  dirtBike: "dirt-bike.glb",
  cornerShop: "corner-shop.glb",
  scooter: "delivery-scooter.glb",
  footballGoal: "football-goal.glb"
};

const PLACEMENTS = {
  homes: [
    ["house",-22, -10, 8], ["house",22,-10,8],
    ["tree",-25,-18,5], ["tree",25,-18,5], ["stump",-24,5,1.4],
    ["rock",24,6,1.8], ["cypress",-19,12,7]
  ],
  sports: [
    ["tree",-21,-18,5], ["tree",21,-18,5], ["tree",-21,10,5],
    ["rock",21,10,1.8], ["stump",-20,2,1.4], ["log",20,2,1.4], ["footballGoal",0,-15,4.5]
  ],
  rooftop: [["rock",-22,18,1.6],["stump",22,18,1.2]],
  industrial: [
    ["pickup",19,15,4.7], ["deadTree",-22,-20,5],
    ["log",-20,8,1.5], ["rock",21,-18,1.8],
    ["barn",-17,-18,9], ["dirtBike",12,8,3.5]
  ],
  ruins: [
    ["deadTree",-18,-14,5], ["stump",-16,-2,1.4],
    ["log",17,-4,1.6], ["rock",18,-15,2],
    ["fireTruck",20,15,5]
  ],
  compound: [
    ["police",19,15,4.8], ["deadTree",-22,-20,5],
    ["rock",-21,10,1.8], ["log",21,-12,1.5]
  ],
  street: [
    ["police",-20,16,4.8], ["bus",0,16,8],
    ["sportsCar",20,16,4.8], ["pickup",10,-4,4.8],
    ["tree",-24,-18,5], ["tree",24,-18,5], ["cornerShop",-20,-8,8], ["scooter",8,8,2.8], ["apartment",22,-14,14]
  ],
  investigation: [
    ["police",19,15,4.8], ["pickup",-20,15,4.8],
    ["deadTree",-22,-18,5], ["rock",22,-16,1.8], ["scooter",8,8,2.8], ["cornerShop",-20,-8,8]
  ],
  arena: [
    ["tree",-23,-20,5], ["tree",23,-20,5],
    ["stump",-22,12,1.4], ["log",22,12,1.5], ["rock",0,23,2]
  ],
  warehouse: [
    ["pickup",20,15,4.8], ["police",-20,15,4.8],
    ["deadTree",-22,-20,5], ["rock",22,-18,2]
  ],
  interior: [["apartmentRoom",0,-2,16]],
  safehouse: [
    ["house",-22,-10,8], ["house",22,-10,8],
    ["tree",-25,-18,5], ["tree",25,-18,5], ["pickup",20,15,4.8], ["cypress",-19,12,7]
  ],
  fortress: [
    ["police",20,15,4.8], ["fireTruck",-20,15,5],
    ["deadTree",-23,-20,5], ["rock",23,-18,2]
  ],
  ceremony: [
    ["tree",-22,7,5], ["tree",22,7,5],
    ["stump",-20,-22,1.4], ["rock",20,-22,1.8]
  ]
};

function disposeObject(root) {
  root.traverse(o => {
    o.geometry?.dispose();
    if (o.material) {
      for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
        m.map?.dispose();
        m.dispose();
      }
    }
  });
}

export function addAuthoredWorldAssets({ group, kind, colliders }) {
  const placements = PLACEMENTS[kind] || [];
  const loader = new GLTFLoader();
  let disposed = false;
  const pending = [];
  for (const [key,x,z,targetSize] of placements) {
    const assetPath = ASSETS[key];
    const path = /^https?:\\/\\//i.test(assetPath) ? assetPath : ROOT + assetPath;
    const promise = new Promise(resolve => {
      loader.load(path, gltf => {
        const model = gltf.scene;
        if (disposed) { disposeObject(model); resolve(false); return; }
        model.name = "world-asset-" + key;
        model.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const horizontal = Math.max(size.x, size.z, .001);
        const scale = targetSize / horizontal;
        model.scale.setScalar(scale);
        model.updateMatrixWorld(true);
        const fitted = new THREE.Box3().setFromObject(model);
        model.position.set(x, -fitted.min.y, z);
        model.traverse(o => {
          if (!o.isMesh) return;
          o.castShadow = true;
          o.receiveShadow = true;
        });
        group.add(model);
        const finalSize = fitted.getSize(new THREE.Vector3());
        const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
        if (key !== "tree" && key !== "deadTree" && key !== "cypress" && key !== "house" && key !== "cottage" && key !== "apartment" && key !== "apartmentRoom" && key !== "barn" && key !== "cornerShop") {
          colliders.push({
            x: center.x, z: center.z,
            halfX: Math.max(.25, finalSize.x * .46),
            halfZ: Math.max(.25, finalSize.z * .46),
            height: Math.max(.5, finalSize.y)
          });
        } else if (key === "house" || key === "cottage" || key === "apartment" || key === "apartmentRoom" || key === "cornerShop") {
          // Keep the interior traversable: collide against four perimeter walls,
          // leaving a front entrance gap instead of blocking the entire footprint.
          const hx = Math.max(1.5, finalSize.x * .46);
          const hz = Math.max(1.5, finalSize.z * .46);
          const wall = Math.max(.22, Math.min(hx,hz) * .12);
          colliders.push(
            {x:x-hx+wall/2,z,halfX:wall/2,halfZ:hz,height:finalSize.y},
            {x:x+hx-wall/2,z,halfX:wall/2,halfZ:hz,height:finalSize.y},
            {x,z:z-hz+wall/2,halfX:hx,halfZ:wall/2,height:finalSize.y},
            {x:x-hx*.48,z:z+hz-wall/2,halfX:hx*.48,halfZ:wall/2,height:finalSize.y},
            {x:x+hx*.48,z:z+hz-wall/2,halfX:hx*.48,halfZ:wall/2,height:finalSize.y}
          );
        } else if (key === "barn") {
          colliders.push({
            x, z, halfX: Math.max(1, finalSize.x * .42),
            halfZ: Math.max(1, finalSize.z * .42),
            height: Math.max(2, finalSize.y)
          });
        } else {
          colliders.push({x,z,halfX:key==="cypress"? .7:.55,halfZ:key==="cypress"? .7:.55,height:Math.max(2,finalSize.y)});
        }
        resolve(true);
      }, undefined, () => resolve(false));
    });
    pending.push(promise);
  }
  return {
    ready: Promise.all(pending),
    dispose() { disposed = true; }
  };
}
