import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const canvas = document.getElementById("portfolio-3d");
const hero = document.querySelector(".hero");
const toggle = document.getElementById("sceneToggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");
const smallScreen = window.matchMedia("(max-width: 760px)");

if (canvas && hero) {
  try {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !smallScreen.matches,
    powerPreference: "low-power"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, smallScreen.matches ? 1.25 : 1.7));
  renderer.setSize(canvas.clientWidth || 420, canvas.clientHeight || 500, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7.8);

  const root = new THREE.Group();
  scene.add(root);

  scene.add(new THREE.AmbientLight(0x9bcfff, 1.15));

  const cyanLight = new THREE.PointLight(0x45eaff, 24, 12);
  cyanLight.position.set(-3, 2.8, 3);
  scene.add(cyanLight);

  const violetLight = new THREE.PointLight(0x9466ff, 19, 12);
  violetLight.position.set(3, -2, 2);
  scene.add(violetLight);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.18, 2),
    new THREE.MeshPhysicalMaterial({
      color: 0x102c4c,
      metalness: .68,
      roughness: .22,
      transmission: .12,
      transparent: true,
      opacity: .9,
      clearcoat: 1,
      clearcoatRoughness: .16,
      emissive: 0x06243a,
      emissiveIntensity: .8
    })
  );
  root.add(core);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.23, 2),
    new THREE.MeshBasicMaterial({
      color: 0x65eaff,
      wireframe: true,
      transparent: true,
      opacity: .34
    })
  );
  root.add(wire);

  const innerCore = new THREE.Mesh(
    new THREE.SphereGeometry(.48, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x66eaff,
      transparent: true,
      opacity: .12
    })
  );
  root.add(innerCore);

  const rings = [];
  const ringSettings = [
    { radius: 1.75, tube: .012, color: 0x59eaff, rotation: [.85, .1, .2], speed: .12 },
    { radius: 2.02, tube: .008, color: 0x9670ff, rotation: [1.28, .8, -.35], speed: -.09 },
    { radius: 2.32, tube: .006, color: 0x8beeff, rotation: [.35, 1.1, .7], speed: .06 }
  ];

  ringSettings.forEach((settings, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(settings.radius, settings.tube, 8, 180),
      new THREE.MeshBasicMaterial({
        color: settings.color,
        transparent: true,
        opacity: index === 0 ? .72 : .46
      })
    );
    ring.rotation.set(...settings.rotation);
    ring.userData.speed = settings.speed;
    root.add(ring);
    rings.push(ring);
  });

  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xc2f8ff });
  const nodePositions = [
    [1.88, .8, .18],
    [-1.65, -.92, .42],
    [.25, 2.05, -.25],
    [-.55, -2.08, .1],
    [2.12, -.55, -.35],
    [-2.18, .45, -.2]
  ];

  const nodes = nodePositions.map((position, index) => {
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(index % 2 ? .035 : .05, 12, 12),
      nodeMaterial
    );
    node.position.set(...position);
    root.add(node);
    return node;
  });

  const starCount = smallScreen.matches ? 520 : 1050;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i += 1) {
    const radius = 2.6 + Math.random() * 3.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);
    const tint = Math.random();
    starColors[i * 3] = .38 + tint * .45;
    starColors[i * 3 + 1] = .72 + tint * .24;
    starColors[i * 3 + 2] = .9 + tint * .1;
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      size: smallScreen.matches ? .018 : .023,
      vertexColors: true,
      transparent: true,
      opacity: .78,
      sizeAttenuation: true,
      depthWrite: false
    })
  );
  scene.add(stars);

  const pointer = new THREE.Vector2(0, 0);
  const targetRotation = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();
  let active = !reducedMotion.matches;
  let visible = true;
  let frame = 0;

  const resize = () => {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    camera.aspect = width / height;
    camera.position.z = smallScreen.matches ? 8.6 : 7.8;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, smallScreen.matches ? 1.15 : 1.7));
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };

  const render = () => {
    renderer.render(scene, camera);
  };

  const animate = () => {
    if (!active || !visible || document.hidden) {
      frame = 0;
      return;
    }

    frame = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    root.rotation.y = elapsed * .08 + targetRotation.x;
    root.rotation.x = Math.sin(elapsed * .14) * .06 + targetRotation.y;
    core.rotation.y = elapsed * .08;
    wire.rotation.y = -elapsed * .055;
    wire.rotation.x = elapsed * .035;
    innerCore.scale.setScalar(1 + Math.sin(elapsed * 1.35) * .055);
    rings.forEach(ring => {
      ring.rotation.z += ring.userData.speed * .002;
    });
    nodes.forEach((node, index) => {
      node.scale.setScalar(1 + Math.sin(elapsed * 1.8 + index) * .18);
    });
    stars.rotation.y = elapsed * .008;
    stars.rotation.x = Math.sin(elapsed * .12) * .025;
    cyanLight.position.x = Math.sin(elapsed * .35) * 3;
    violetLight.position.y = Math.cos(elapsed * .28) * 2.5;
    render();
  };

  const start = () => {
    if (!active || !visible || document.hidden || frame) return;
    clock.start();
    frame = requestAnimationFrame(animate);
  };

  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const setMotion = next => {
    active = next;
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(!next));
      toggle.textContent = next ? "Pause 3D motion" : "Resume 3D motion";
    }
    if (active) start();
    else {
      stop();
      render();
    }
  };

  if (toggle) {
    toggle.addEventListener("click", () => setMotion(!active));
  }

  if (finePointer.matches) {
    hero.addEventListener("pointermove", event => {
      const bounds = hero.getBoundingClientRect();
      pointer.set(
        (event.clientX - bounds.left) / bounds.width - .5,
        (event.clientY - bounds.top) / bounds.height - .5
      );
      targetRotation.set(pointer.x * .18, pointer.y * .12);
    }, { passive: true });

    hero.addEventListener("pointerleave", () => targetRotation.set(0, 0), { passive: true });
  }

  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) start();
    else stop();
  }, { threshold: .02 });
  visibilityObserver.observe(hero);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  reducedMotion.addEventListener("change", event => {
    if (event.matches) setMotion(false);
  });

  resize();
  render();
  if (!reducedMotion.matches) start();

  window.addEventListener("pagehide", () => {
    stop();
    visibilityObserver.disconnect();
    resizeObserver.disconnect();
    starGeometry.dispose();
    renderer.dispose();
  }, { once: true });
  } catch {
    canvas.style.display = "none";
  }
}

if (finePointer.matches) {
  document.querySelectorAll(".project-card").forEach(card => {
    let bounds;

    card.addEventListener("pointerenter", () => {
      bounds = card.getBoundingClientRect();
      card.classList.add("is-tilting");
    });

    card.addEventListener("pointermove", event => {
      bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (x - .5) * 7;
      const rotateX = (.5 - y) * 7;
      card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.transform = "";
    });
  });
}