"use client";
import { Html, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import landDots from "@/content/land-dots.json";
import { team } from "@/content/profile";
import type { Palette } from "./hooks";

const R = 2;
const toVec = (lat: number, lon: number, r = R) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

export default function GlobeScene({ palette, reduced }: { palette: Palette; reduced: boolean }) {
  const globe = useRef<THREE.Group>(null);
  const pulses = useRef<THREE.Mesh[]>([]);
  const rings = useRef<THREE.Mesh[]>([]);
  const markers = useRef<THREE.Group[]>([]);
  const labels = useRef<HTMLSpanElement[]>([]);
  const wp = useMemo(() => new THREE.Vector3(), []);
  const toCam = useMemo(() => new THREE.Vector3(), []);

  const dots = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array((landDots as number[][]).length * 3);
    (landDots as number[][]).forEach(([lat, lon], i) => { const v = toVec(lat, lon, R * 1.002); pos.set([v.x, v.y, v.z], i * 3); });
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const home = team.find((t) => t.home)!;
  const arcs = useMemo(() =>
    team.filter((t) => !t.home).map((t) => {
      const a = toVec(home.lat, home.lon), b = toVec(t.lat, t.lon);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.setLength(R + a.distanceTo(b) * 0.38);
      return new THREE.QuadraticBezierCurve3(a, mid, b);
    }), [home]);
  const arcGeos = useMemo(() => arcs.map((c) => new THREE.TubeGeometry(c, 64, 0.008, 6, false)), [arcs]);

  // start with Africa facing the camera
  const startRot = useMemo(() => -((home.lon + 90) * Math.PI) / 180 - 0.05, [home]);

  useFrame((state, dt) => {
    const time = state.clock.elapsedTime;
    // hide labels on the far side of the globe
    markers.current.forEach((g, i) => {
      const el = labels.current[i];
      if (!g || !el) return;
      g.getWorldPosition(wp);
      toCam.copy(state.camera.position).sub(wp);
      el.style.opacity = wp.clone().normalize().dot(toCam.normalize()) > 0.15 ? "1" : "0";
    });
    if (globe.current && !reduced) globe.current.rotation.y += dt * 0.06;
    pulses.current.forEach((m, i) => {
      if (!m) return;
      const t = reduced ? 0.5 : ((time * 0.35 + i * 0.33) % 1);
      // alternate direction: alerts out, reviews back
      m.position.copy(arcs[i].getPoint(i % 2 ? 1 - t : t));
    });
    rings.current.forEach((m, i) => {
      if (!m) return;
      const t = reduced ? 0.5 : (time * 0.6 + i * 0.25) % 1;
      m.scale.setScalar(1 + t * 2.2);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - t);
    });
  });

  return (
    <>
      <ambientLight intensity={1} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} minPolarAngle={0.6} maxPolarAngle={2.5} />
      <group ref={globe} rotation={[0.25, startRot, 0]}>
        <mesh>
          <sphereGeometry args={[R * 0.995, 64, 64]} />
          <meshBasicMaterial color={palette.dark ? "#1a1e20" : "#c9cecb"} />
        </mesh>
        <mesh>
          <sphereGeometry args={[R * 1.06, 48, 48]} />
          <meshBasicMaterial color={palette.dark ? palette.accent : "#121415"} transparent opacity={palette.dark ? 0.05 : 0.06} side={THREE.BackSide} />
        </mesh>
        <points geometry={dots}>
          <pointsMaterial size={0.038} color={palette.dark ? "#59625f" : "#4f5755"} sizeAttenuation />
        </points>
        {arcGeos.map((g, i) => (
          <mesh key={i} geometry={g}><meshBasicMaterial color={palette.dark ? palette.accent : "#121415"} transparent opacity={0.8} toneMapped={false} /></mesh>
        ))}
        {arcs.map((_, i) => (
          <mesh key={`p${i}`} ref={(m) => { if (m) pulses.current[i] = m; }}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color={i % 2 ? palette.ok : palette.accent} toneMapped={false} />
          </mesh>
        ))}
        {team.map((t, i) => {
          const v = toVec(t.lat, t.lon, R * 1.01);
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize());
          return (
            <group key={t.name} position={v} quaternion={q} ref={(g) => { if (g) markers.current[i] = g; }}>
              <mesh><circleGeometry args={[t.home ? 0.06 : 0.045, 24]} /><meshBasicMaterial color={t.home ? palette.accent : palette.ok} toneMapped={false} /></mesh>
              <mesh ref={(m) => { if (m) rings.current[i] = m; }}><ringGeometry args={[0.06, 0.075, 32]} /><meshBasicMaterial color={t.home ? palette.accent : palette.ok} transparent toneMapped={false} /></mesh>
              <Html zIndexRange={[4, 0]} occlude={false} style={{ pointerEvents: "none" }}>
                <span ref={(el) => { if (el) labels.current[i] = el; }} className={`globe-label ${t.home ? "home" : ""}`} style={{ transition: "opacity .3s" }}>{t.name} · {t.note}</span>
              </Html>
            </group>
          );
        })}
      </group>
    </>
  );
}
