const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const weak = () => innerWidth < 860 || navigator.hardwareConcurrency < 4 || reduced();

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function waitForThree() {
  if (window.THREE) return Promise.resolve();
  return new Promise((resolve) => {
    const start = Date.now();
    const id = setInterval(() => {
      if (window.THREE || Date.now() - start > 2800) {
        clearInterval(id);
        resolve();
      }
    }, 40);
  });
}

export async function initRobot(stage) {
  if (!stage) return;
  const fallback = stage.querySelector(".hero-fallback");
  fallback?.removeAttribute("hidden");
  bindFallback(stage, fallback);
  await waitForThree();
  if (!window.THREE || !webglOk() || reduced()) return;
  try {
    startWebgl(stage, fallback);
  } catch {
    fallback?.removeAttribute("hidden");
  }
}

function startWebgl(stage, fallback) {
  const THREE = window.THREE;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 40);
  camera.position.set(0, 0.12, 4.6);

  const renderer = new THREE.WebGLRenderer({
    antialias: !weak(),
    alpha: true,
    powerPreference: "low-power"
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, weak() ? 1.2 : 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  stage.appendChild(renderer.domElement);

  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(
    new THREE.SphereGeometry(8, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0x1a2233,
      side: THREE.BackSide
    })
  ));
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = env;
  pmrem.dispose();

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0x2c303a,
    metalness: 1,
    roughness: 0.16,
    clearcoat: 0.72,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.35
  });
  const dark = new THREE.MeshPhysicalMaterial({
    color: 0x0b0c10,
    metalness: 0.88,
    roughness: 0.32,
    clearcoat: 0.35
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x101824,
    metalness: 0.45,
    roughness: 0.08,
    transparent: true,
    opacity: 0.78,
    envMapIntensity: 1.2
  });
  const glow = new THREE.MeshStandardMaterial({
    color: 0xd7e7ff,
    emissive: 0x3d7dff,
    emissiveIntensity: 3.2,
    metalness: 0.1,
    roughness: 0.18
  });

  const head = new THREE.Group();
  scene.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(1.12, 64, 64), chrome);
  skull.scale.set(0.9, 1.08, 0.86);
  head.add(skull);

  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.7, 40, 40), dark);
  jaw.position.set(0, -0.74, 0.1);
  jaw.scale.set(0.92, 0.52, 0.78);
  head.add(jaw);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.32, 0.08), glass);
  visor.position.set(0, 0.2, 0.9);
  head.add(visor);

  const brow = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.06, 0.12), dark);
  brow.position.set(0, 0.38, 0.88);
  head.add(brow);

  const cheekL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.18), chrome);
  const cheekR = cheekL.clone();
  cheekL.position.set(-0.62, -0.08, 0.62);
  cheekR.position.set(0.62, -0.08, 0.62);
  cheekL.rotation.y = 0.35;
  cheekR.rotation.y = -0.35;
  head.add(cheekL, cheekR);

  const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.22, 16), dark);
  const earR = earL.clone();
  earL.rotation.z = Math.PI / 2;
  earR.rotation.z = Math.PI / 2;
  earL.position.set(-0.98, 0.12, 0);
  earR.position.set(0.98, 0.12, 0);
  head.add(earL, earR);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.55, 20), dark);
  neck.position.set(0, -1.18, 0.02);
  head.add(neck);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.045, 12, 48), chrome);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, -1.38, 0.02);
  head.add(collar);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 20), glow);
  const eyeR = eyeL.clone();
  eyeL.position.set(-0.3, 0.2, 0.96);
  eyeR.position.set(0.3, 0.2, 0.96);
  head.add(eyeL, eyeR);

  const eyeLightL = new THREE.PointLight(0x6ea8ff, 1.6, 4);
  const eyeLightR = eyeLightL.clone();
  eyeLightL.position.copy(eyeL.position);
  eyeLightR.position.copy(eyeR.position);
  head.add(eyeLightL, eyeLightR);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.62, 0.01, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0x6ea8ff, transparent: true, opacity: 0.38 })
  );
  ring.rotation.x = Math.PI / 2.35;
  scene.add(ring);

  scene.add(new THREE.AmbientLight(0x9aa6b8, 0.28));
  const key = new THREE.PointLight(0x8eb6ff, 22, 14);
  key.position.set(-2.4, 2.2, 3.4);
  const fill = new THREE.PointLight(0xffffff, 10, 12);
  fill.position.set(2.6, -0.2, 2.6);
  const rim = new THREE.PointLight(0x3d7dff, 14, 12);
  rim.position.set(0.2, 1.8, -3.2);
  scene.add(key, fill, rim);

  const mouse = { x: 0, y: 0 };
  const look = { x: 0, y: 0 };
  let alert = 0;

  const onMove = (e) => {
    const b = stage.getBoundingClientRect();
    mouse.x = ((e.clientX - b.left) / b.width) * 2 - 1;
    mouse.y = -(((e.clientY - b.top) / b.height) * 2 - 1);
  };
  addEventListener("pointermove", onMove, { passive: true });
  addEventListener("deviceorientation", (e) => {
    if (e.gamma == null || e.beta == null) return;
    mouse.x = Math.max(-1, Math.min(1, e.gamma / 28));
    mouse.y = Math.max(-1, Math.min(1, -(e.beta - 45) / 40));
  }, { passive: true });

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("pointerenter", () => { alert = 1; });
    el.addEventListener("pointerleave", () => { alert = 0; });
  });

  const resize = () => {
    const w = stage.clientWidth || 1;
    const h = Math.max(stage.clientHeight, 280);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  addEventListener("resize", resize);

  let raf = 0;
  let live = true;
  let ready = false;
  const tick = (t) => {
    if (!live) return;
    const idle = Math.sin(t * 0.0009) * 0.035;
    const bob = Math.sin(t * 0.0014) * 0.03;
    look.x += (mouse.x * 0.42 - look.x) * 0.045;
    look.y += (mouse.y * 0.26 - look.y) * 0.045;
    head.rotation.y = look.x + idle;
    head.rotation.x = look.y * 0.48;
    head.position.y = bob;
    eyeL.position.x = -0.3 + look.x * 0.055;
    eyeR.position.x = 0.3 + look.x * 0.055;
    eyeL.position.y = 0.2 + look.y * 0.04;
    eyeR.position.y = 0.2 + look.y * 0.04;
    glow.emissiveIntensity = 2.6 + alert * 1.4 + Math.sin(t * 0.004) * 0.25;
    ring.rotation.z += 0.0016;
    ring.material.opacity = 0.28 + alert * 0.18;
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      fallback?.setAttribute("hidden", "");
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  document.addEventListener("visibilitychange", () => {
    live = document.visibilityState === "visible";
    if (live) raf = requestAnimationFrame(tick);
    else cancelAnimationFrame(raf);
  });
}

function bindFallback(stage, fallback) {
  if (!fallback) return;
  const eyes = fallback.querySelectorAll(".eye");
  const apply = (nx, ny) => {
    fallback.style.transform = `rotateY(${nx * 14}deg) rotateX(${-ny * 10}deg)`;
    eyes.forEach((el) => {
      el.style.transform = `translate(${nx * 8}px, ${ny * 6}px)`;
    });
  };
  addEventListener("pointermove", (e) => {
    const b = stage.getBoundingClientRect();
    apply((e.clientX - b.left) / b.width - 0.5, (e.clientY - b.top) / b.height - 0.5);
  }, { passive: true });
  addEventListener("deviceorientation", (e) => {
    if (e.gamma == null || e.beta == null) return;
    apply(Math.max(-0.5, Math.min(0.5, e.gamma / 40)), Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 50)));
  }, { passive: true });
}
