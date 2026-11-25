import * as THREE from "three";

/**
 * Cohesive visual finishing pass for the procedural campaign.
 * Keeps the established low-key cinematic palette while improving depth,
 * shadow readability and atmosphere without post-processing dependencies.
 */
export function applyVisualPolish(scene, renderer, { mobile = false } = {}) {
  scene.background = new THREE.Color(0x0b1118);
  scene.fog = new THREE.FogExp2(0x0d141b, mobile ? 0.014 : 0.012);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.2 : 1.7));

  scene.traverse(object => {
    if (object.isLight) {
      if (object.isHemisphereLight) {
        object.intensity = Math.min(object.intensity, 0.9);
      } else if (object.isDirectionalLight) {
        object.intensity = Math.min(object.intensity, 1.65);
        object.shadow.bias = -0.00018;
        object.shadow.normalBias = 0.025;
        object.shadow.radius = mobile ? 2 : 3;
        object.shadow.camera.near = 0.5;
        object.shadow.camera.far = 90;
        object.shadow.camera.left = -38;
        object.shadow.camera.right = 38;
        object.shadow.camera.top = 38;
        object.shadow.camera.bottom = -38;
        object.shadow.camera.updateProjectionMatrix();
      } else if (object.isPointLight) {
        object.intensity = Math.min(object.intensity, 10);
        object.distance = Math.min(object.distance || 14, 18);
      }
    }
    if (object.isMesh && object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        if ("roughness" in material) material.roughness = Math.max(0.48, material.roughness);
        if ("metalness" in material) material.metalness = Math.min(0.28, material.metalness);
      }
    }
  });

  const count = mobile ? 36 : 72;
  const positions = new Float32Array(count * 3);
  const drift = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 34;
    positions[i * 3 + 1] = Math.random() * 7 + 0.4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 34;
    drift[i * 3] = (Math.random() - 0.5) * 0.12;
    drift[i * 3 + 1] = 0.025 + Math.random() * 0.045;
    drift[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xc7b18e, size: mobile ? 0.045 : 0.055,
    transparent: true, opacity: 0.22, depthWrite: false, sizeAttenuation: true
  });
  const dust = new THREE.Points(geometry, material);
  dust.frustumCulled = false;
  scene.add(dust);

  return {
    update(dt, focus) {
      if (focus) dust.position.set(focus.x, 0, focus.z);
      const p = geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const k = i * 3;
        p.array[k] += drift[k] * dt;
        p.array[k + 1] += drift[k + 1] * dt;
        p.array[k + 2] += drift[k + 2] * dt;
        if (p.array[k + 1] > 8) {
          p.array[k + 1] = 0.35;
          p.array[k] = (Math.random() - 0.5) * 34;
          p.array[k + 2] = (Math.random() - 0.5) * 34;
        }
      }
      p.needsUpdate = true;
    },
    dispose() {
      scene.remove(dust);
      geometry.dispose();
      material.dispose();
    }
  };
}
