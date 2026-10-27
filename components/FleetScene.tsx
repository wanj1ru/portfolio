"use client";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Palette } from "./hooks";

const N = 200;
const CLUSTERS = 50;
type V3 = [number, number, number];

// ---- layouts ----------------------------------------------------------------
const one: { p: V3; s: number }[] = Array.from({ length: N }, (_, i) => ({ p: [0, 0.5, 0], s: i === 0 ? 1 : 0 }));
const floor: { p: V3; s: number }[] = Array.from({ length: N }, (_, i) => {
  const c = i % 20, r = Math.floor(i / 20);
  return { p: [(c - 9.5) * 0.55, 0.5, (r - 4.5) * 1.45], s: 1 };
});
const clusterCenter = (k: number): V3 => [((k % 10) - 4.5) * 2.3, 0, (Math.floor(k / 10) - 2) * 2.7];
const clustered: { p: V3; s: number }[] = Array.from({ length: N }, (_, i) => {
  const [cx, , cz] = clusterCenter(Math.floor(i / 4));
  const q = i % 4;
  return { p: [cx + (q % 2 ? 0.3 : -0.3), 0.5, cz + (q > 1 ? 0.4 : -0.4)], s: 1 };
});
const LAYOUT = (stage: number) => (stage === 0 ? one : stage === 1 ? floor : clustered);

const CAMERA: { pos: V3; look: V3 }[] = [
  { pos: [2.1, 1.6, 3.2], look: [0, 0.5, 0] },
  { pos: [0, 10, 14], look: [0, 0, 0.5] },
  { pos: [0, 16, 12], look: [0, 0, 0.6] },
  { pos: [0, 12, 17], look: [0, 1.8, 0] },
  { pos: [10, 12, 17], look: [0, 0.5, 2.2] },
  { pos: [0, 15, 11], look: [0, 0, 0.4] },
  { pos: [-12, 10, 13], look: [0.5, 0.5, 0] },
];
const GIT: V3 = [0, 5.2, -1.5];
const GATE: V3 = [0, 0.75, 9.2];

type Props = { stage: number; palette: Palette; reduced: boolean };

export default function FleetScene({ stage, palette, reduced }: Props) {
  const racks = useRef<THREE.InstancedMesh>(null);
  const leds = useRef<THREE.InstancedMesh>(null);
  const tiles = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const git = useRef<THREE.Group>(null);
  const shield = useRef<THREE.Group>(null);
  const images = useRef<THREE.InstancedMesh>(null);
  const rings = useRef<THREE.InstancedMesh>(null);
  const reqs = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();

  const cur = useMemo(() => one.map((o) => ({ p: new THREE.Vector3(...o.p), s: o.s })), []);
  const alerts = useMemo(() => new Float32Array(N), []);
  const look = useMemo(() => new THREE.Vector3(...CAMERA[0].look), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const ok = useMemo(() => new THREE.Color(), []);
  const crash = useMemo(() => new THREE.Color(), []);
  const accent = useMemo(() => new THREE.Color(), []);
  const line = useMemo(() => new THREE.Color(), []);
  useEffect(() => { ok.set(palette.ok); crash.set(palette.crash); accent.set(palette.accent); line.set(palette.line); }, [palette, ok, crash, accent, line]);

  // git sync lines: one segment from the git node to each cluster
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(CLUSTERS * 6);
    for (let k = 0; k < CLUSTERS; k++) {
      const [x, , z] = clusterCenter(k);
      pos.set([GIT[0], GIT[1] - 0.25, GIT[2], x, 1.05, z], k * 6);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(CLUSTERS * 6), 3));
    return g;
  }, []);

  // particle pools
  const imgState = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ y: 7 + i * 0.6, x: (Math.random() - 0.5) * 1.4, bad: Math.random() < 0.3, vx: 0, life: 0 })), []);
  const ringState = useMemo(() => Array.from({ length: 10 }, () => ({ i: 0, t: 1 })), []);
  const reqState = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ from: new THREE.Vector3(), to: new THREE.Vector3(), t: i / 70, speed: 0.4 + Math.random() * 0.5 })), []);
  useEffect(() => {
    reqState.forEach((r) => {
      r.from.set(16, 1 + Math.random() * 2.5, (Math.random() - 0.5) * 14);
      const [x, , z] = clusterCenter(Math.floor(Math.random() * CLUSTERS));
      r.to.set(x, 1, z);
    });
  }, [reqState]);

  const ringCursor = useRef(0);
  useEffect(() => {
    if (!tiles.current) return;
    const d = new THREE.Object3D(); d.scale.setScalar(0.0001); d.updateMatrix();
    for (let j = 0; j < CLUSTERS; j++) tiles.current.setMatrixAt(j, d.matrix);
    tiles.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const time = state.clock.elapsedTime;
    const k = reduced ? 1 : Math.min(1, dt * 2.6);
    const layout = LAYOUT(stage);

    // racks + LEDs
    for (let i = 0; i < N; i++) {
      const c = cur[i], t = layout[i];
      const ki = reduced ? 1 : Math.min(1, k * (0.75 + (i % 13) * 0.04));
      c.p.x += (t.p[0] - c.p.x) * ki; c.p.y += (t.p[1] - c.p.y) * ki; c.p.z += (t.p[2] - c.p.z) * ki;
      c.s += (t.s - c.s) * ki;
      dummy.position.copy(c.p); dummy.scale.setScalar(Math.max(c.s, 0.0001)); dummy.rotation.set(0, 0, 0); dummy.updateMatrix();
      racks.current?.setMatrixAt(i, dummy.matrix);
      dummy.position.set(c.p.x, c.p.y + 0.28 * c.s, c.p.z + 0.302 * c.s); dummy.updateMatrix();
      leds.current?.setMatrixAt(i, dummy.matrix);
      if (alerts[i] > 0) alerts[i] = Math.max(0, alerts[i] - dt * 0.55);
      if (stage !== 5) alerts[i] = 0;
      const blink = reduced ? 1 : 0.65 + 0.35 * Math.sin(time * 3 + i * 1.7);
      col.copy(alerts[i] > 0 ? crash : ok).multiplyScalar(alerts[i] > 0 ? 1 : blink);
      leds.current?.setColorAt(i, col);
    }
    if (racks.current) racks.current.instanceMatrix.needsUpdate = true;
    if (leds.current) { leds.current.instanceMatrix.needsUpdate = true; if (leds.current.instanceColor) leds.current.instanceColor.needsUpdate = true; }

    // cluster floor tiles
    if (tiles.current) {
      for (let j = 0; j < CLUSTERS; j++) {
        const [x, , z] = clusterCenter(j);
        tiles.current.getMatrixAt(j, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        const target = stage >= 2 ? 1 : 0.0001;
        const s = dummy.scale.x + (target - dummy.scale.x) * k;
        dummy.position.set(x, 0.01, z); dummy.rotation.set(-Math.PI / 2, 0, 0); dummy.scale.set(s, s, s); dummy.updateMatrix();
        tiles.current.setMatrixAt(j, dummy.matrix);
      }
      tiles.current.instanceMatrix.needsUpdate = true;
    }

    // git sync wave
    if (git.current) { const s = git.current.scale.x + ((stage === 3 ? 1 : 0.0001) - git.current.scale.x) * k; git.current.scale.setScalar(s); }
    if (lines.current) {
      lines.current.visible = stage === 3;
      const colors = lineGeo.getAttribute("color") as THREE.BufferAttribute;
      const wave = reduced ? -1 : (time * 9) % (CLUSTERS + 10);
      for (let j = 0; j < CLUSTERS; j++) {
        const hot = wave < 0 || Math.abs(j - wave) < 2.5;
        const c = hot ? accent : line;
        colors.setXYZ(j * 2, c.r, c.g, c.b); colors.setXYZ(j * 2 + 1, c.r, c.g, c.b);
      }
      colors.needsUpdate = true;
    }

    // security: shield and image gate
    if (shield.current) { const s = shield.current.scale.x + ((stage === 4 ? 1 : 0.0001) - shield.current.scale.x) * k; shield.current.scale.setScalar(s); }
    if (images.current) {
      imgState.forEach((im, i) => {
        if (stage !== 4 || reduced) { dummy.scale.setScalar(0.0001); dummy.position.set(0, -5, 0); }
        else {
          if (im.bad && im.y < GATE[1] + 1.1 && im.vx === 0) im.vx = (Math.random() < 0.5 ? -1 : 1) * 2.5;
          im.y -= dt * (im.vx ? 0.6 : 2.4); im.x += im.vx * dt; im.life += dt;
          if (im.y < GATE[1] - 0.2 || Math.abs(im.x) > 5) { im.y = 7 + Math.random() * 2; im.x = (Math.random() - 0.5) * 1.4; im.bad = Math.random() < 0.3; im.vx = 0; }
          dummy.position.set(GATE[0] + im.x, im.y, GATE[2]); dummy.scale.setScalar(1); dummy.rotation.set(time + i, time * 0.7, 0);
        }
        dummy.updateMatrix(); images.current!.setMatrixAt(i, dummy.matrix);
        images.current!.setColorAt(i, im.bad ? crash : accent);
      });
      images.current.instanceMatrix.needsUpdate = true;
      if (images.current.instanceColor) images.current.instanceColor.needsUpdate = true;
    }

    // observability: random alerts with expanding rings
    if (stage === 5 && !reduced && Math.random() < dt * 4) {
      const i = Math.floor(Math.random() * N);
      alerts[i] = 1;
      const r = ringState[ringCursor.current % ringState.length]; ringCursor.current++;
      r.i = i; r.t = 0;
    }
    if (rings.current) {
      ringState.forEach((r, j) => {
        r.t = Math.min(1, r.t + dt * 0.8);
        const p = cur[r.i].p;
        const on = stage === 5 && r.t < 1;
        dummy.position.set(p.x, 1.08, p.z); dummy.rotation.set(-Math.PI / 2, 0, 0); dummy.scale.setScalar(on ? 0.3 + r.t * 1.6 : 0.0001); dummy.updateMatrix();
        rings.current!.setMatrixAt(j, dummy.matrix);
      });
      rings.current.instanceMatrix.needsUpdate = true;
      (rings.current.material as THREE.MeshBasicMaterial).color.copy(crash);
    }

    // APIs: requests flowing into clusters
    if (reqs.current) {
      reqState.forEach((r, j) => {
        if (stage === 6 && !reduced) {
          r.t += dt * r.speed;
          if (r.t > 1) { r.t = 0; r.from.set(16, 1 + Math.random() * 2.5, (Math.random() - 0.5) * 14); const [x, , z] = clusterCenter(Math.floor(Math.random() * CLUSTERS)); r.to.set(x, 1, z); }
          const e = 1 - (1 - r.t) ** 2;
          dummy.position.lerpVectors(r.from, r.to, e); dummy.position.y += Math.sin(r.t * Math.PI) * 1.5;
          dummy.scale.setScalar(1 - r.t * 0.6);
        } else dummy.scale.setScalar(0.0001);
        dummy.rotation.set(0, 0, 0); dummy.updateMatrix();
        reqs.current!.setMatrixAt(j, dummy.matrix);
      });
      reqs.current.instanceMatrix.needsUpdate = true;
    }

    // camera
    const cam = CAMERA[stage];
    const kc = reduced ? 1 : Math.min(1, dt * 1.8);
    // pull back on narrow or tall frames so the whole fleet stays in view
    const aspect = state.size.width / Math.max(1, state.size.height);
    const f = stage === 0 ? 1 : Math.min(2.1, Math.max(1, 1.45 / aspect));
    const lookV = new THREE.Vector3(...cam.look);
    const posV = new THREE.Vector3(...cam.pos).sub(lookV).multiplyScalar(f).add(lookV);
    camera.position.lerp(posV, kc);
    look.lerp(new THREE.Vector3(...cam.look), kc);
    camera.lookAt(look);
  });

  return (
    <>
      <fog attach="fog" args={[palette.bg2, palette.dark ? 18 : 26, palette.dark ? 46 : 70]} />
      <ambientLight intensity={palette.dark ? 1.1 : 1.4} />
      <hemisphereLight args={["#cfe0ff", "#1a1206", 0.6]} />
      <directionalLight position={[6, 12, 8]} intensity={1.3} />
      <directionalLight position={[-8, 4, -6]} intensity={0.4} color={palette.accent} />
      <gridHelper args={[60, 60, palette.line, palette.line]} position={[0, 0, 0]} />

      <instancedMesh ref={racks} args={[undefined, undefined, N]}>
        <boxGeometry args={[0.46, 1, 0.6]} />
        <meshStandardMaterial color={palette.dark ? "#3a475b" : "#4a586d"} metalness={0.1} roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={leds} args={[undefined, undefined, N]}>
        <planeGeometry args={[0.3, 0.05]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={tiles} args={[undefined, undefined, CLUSTERS]}>
        <planeGeometry args={[1.5, 1.75]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={palette.dark ? 0.08 : 0.12} />
      </instancedMesh>

      {/* GitOps */}
      <lineSegments ref={lines} geometry={lineGeo} visible={false}>
        <lineBasicMaterial vertexColors transparent opacity={0.9} />
      </lineSegments>
      <group ref={git} position={GIT} scale={0.0001}>
        <mesh><boxGeometry args={[1.8, 0.5, 0.5]} /><meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.35} /></mesh>
        {stage === 3 && <Html center distanceFactor={14} zIndexRange={[4, 0]}><span className="globe-label home">git main → argocd</span></Html>}
      </group>

      {/* Security */}
      <group ref={shield} scale={0.0001}>
        <lineSegments position={[0, 1.6, 0.6]}>
          <edgesGeometry args={[new THREE.BoxGeometry(24.5, 3.2, 15.5)]} />
          <lineBasicMaterial color={palette.accent} />
        </lineSegments>
        <mesh position={GATE}><boxGeometry args={[2.4, 1.5, 0.7]} /><meshStandardMaterial color={palette.dark ? "#2c384a" : "#dfe5ee"} /></mesh>
        {stage === 4 && <Html position={[GATE[0], GATE[1] + 1.1, GATE[2]]} center distanceFactor={14} zIndexRange={[4, 0]}><span className="globe-label home">harbor · kyverno</span></Html>}
      </group>
      <instancedMesh ref={images} args={[undefined, undefined, 14]}>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Observability */}
      <instancedMesh ref={rings} args={[undefined, undefined, 10]}>
        <ringGeometry args={[0.85, 1, 40]} />
        <meshBasicMaterial transparent opacity={0.8} side={THREE.DoubleSide} toneMapped={false} />
      </instancedMesh>

      {/* APIs */}
      <instancedMesh ref={reqs} args={[undefined, undefined, 70]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshBasicMaterial color={palette.accent} toneMapped={false} />
      </instancedMesh>

      {stage === 0 && (
        <Html position={[0, 1.25, 0]} center distanceFactor={4} zIndexRange={[4, 0]}>
          <span className="globe-label">ubuntu-01 · patched · Ready</span>
        </Html>
      )}
    </>
  );
}
