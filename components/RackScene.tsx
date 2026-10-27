"use client";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Palette } from "./hooks";

const UNITS = 8;
const UNIT_H = 0.26;
const GAP = 0.06;
const PORT_UNIT = 4;
const unitY = (i: number) => (i - (UNITS - 1) / 2) * (UNIT_H + GAP);
const PORT = new THREE.Vector3(0.62, unitY(PORT_UNIT), 0.6);

const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(2.9, -2.6, 1.3),
  new THREE.Vector3(2.4, -1.7, 1.9),
  new THREE.Vector3(1.6, -0.6, 1.8),
  new THREE.Vector3(0.9, PORT.y - 0.05, 1.25),
  new THREE.Vector3(PORT.x, PORT.y, 0.86),
  new THREE.Vector3(PORT.x, PORT.y, 0.66),
]);

const METAL = new THREE.MeshStandardMaterial({ color: "#3b4658", metalness: 0.15, roughness: 0.55 });
const BODY = new THREE.MeshStandardMaterial({ color: "#2b3646", metalness: 0.1, roughness: 0.6 });
const BEZEL = new THREE.MeshStandardMaterial({ color: "#3f4c61", metalness: 0.1, roughness: 0.5 });
const SLAT = new THREE.MeshStandardMaterial({ color: "#0f141c", roughness: 0.9 });
const PORT_MAT = new THREE.MeshStandardMaterial({ color: "#05070a", roughness: 0.8 });

type Props = { palette: Palette; plugged: boolean; plugRequest: number; onPlugged: () => void; reduced: boolean };

export default function RackScene({ palette, plugged, plugRequest, onPlugged, reduced }: Props) {
  const group = useRef<THREE.Group>(null);
  const plug = useRef<THREE.Group>(null);
  const tube = useRef<THREE.Mesh>(null);
  const leds = useRef<THREE.MeshBasicMaterial[]>([]);
  const t = useRef(0.34);
  const target = useRef(0.34);
  const dragging = useRef(false);
  const lastEnd = useRef(-1);
  const [hover, setHover] = useState(false);
  const { camera, pointer } = useThree();
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const samples = useMemo(() => Array.from({ length: 80 }, (_, i) => CURVE.getPointAt(i / 79)), []);
  const cableMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f2a53a", roughness: 0.5 }), []);
  const phases = useMemo(() => Array.from({ length: UNITS * 2 }, () => Math.random() * 10), []);

  useEffect(() => { cableMat.color.set("#f3c300"); }, [palette, cableMat]);
  useEffect(() => { if (plugRequest > 0) target.current = 1; }, [plugRequest]);
  useEffect(() => { document.body.style.cursor = hover && !plugged ? "grab" : ""; }, [hover, plugged]);

  useEffect(() => {
    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      if (controls) controls.enabled = true;
      if (t.current > 0.9) target.current = 1;
    };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, [controls]);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    const time = state.clock.elapsedTime;
    if (dragging.current && !plugged) {
      // follow the pointer along the cable path: pick the curve point closest to it on screen
      let best = 0, bd = Infinity;
      samples.forEach((p, i) => {
        tmp.copy(p).applyMatrix4(group.current!.matrixWorld).project(camera);
        const d = (tmp.x - pointer.x) ** 2 + (tmp.y - pointer.y) ** 2;
        if (d < bd) { bd = d; best = i / 79; }
      });
      target.current = Math.max(0.12, best);
    }
    const k = reduced ? 1 : Math.min(1, dt * 10);
    t.current += (target.current - t.current) * k;
    if (!plugged && t.current > 0.985) { t.current = 1; onPlugged(); }

    // cable: rebuild only when the plug actually moved
    const end = Math.max(0.02, t.current);
    if (Math.abs(end - lastEnd.current) > 1e-4 || !tube.current?.geometry.attributes.position) {
    lastEnd.current = end;
    const pts = Array.from({ length: 40 }, (_, i) => CURVE.getPointAt((i / 39) * end));
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.034, 8, false);
    if (tube.current) { tube.current.geometry.dispose(); tube.current.geometry = geo; }
    if (plug.current) {
      plug.current.position.copy(CURVE.getPointAt(end));
      const tan = CURVE.getTangentAt(end);
      plug.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), tan.normalize());
    }
    }

    // LEDs
    leds.current.forEach((m, i) => {
      if (!m) return;
      const unit = Math.floor(i / 2), activity = i % 2 === 1;
      if (!plugged) {
        m.color.set(activity ? "#2a3240" : palette.crash);
        m.opacity = activity ? 1 : reduced ? 1 : 0.55 + 0.45 * Math.abs(Math.sin(time * 1.5 + unit));
      } else {
        m.color.set(activity ? palette.accent : palette.ok);
        m.opacity = activity && !reduced ? (Math.sin(time * (6 + (phases[i] % 5)) + phases[i]) > 0.1 ? 1 : 0.15) : 1;
      }
    });

    if (group.current && !reduced && !dragging.current) group.current.rotation.y = Math.sin(time * 0.35) * 0.12;
  });

  return (
    <>
      <ambientLight intensity={palette.dark ? 1.1 : 1.4} />
      <hemisphereLight args={["#cfe0ff", "#1a1206", 0.6]} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color={palette.accent} />
      <OrbitControls makeDefault enableZoom={false} enablePan={false} minPolarAngle={0.9} maxPolarAngle={1.95} rotateSpeed={0.6} />
      <group ref={group} position={[0, 0.15, 0]}>
        {/* cabinet frame */}
        {[-1.1, 1.1].map((x) => [-0.7, 0.7].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0, z]} material={METAL}><boxGeometry args={[0.1, 3.1, 0.1]} /></mesh>
        )))}
        {[-1.55, 1.55].map((y) => (
          <mesh key={y} position={[0, y, 0]} material={METAL}><boxGeometry args={[2.3, 0.1, 1.5]} /></mesh>
        ))}
        {/* servers */}
        {Array.from({ length: UNITS }, (_, u) => {
          const y = unitY(u);
          return (
            <group key={u} position={[0, y, 0]}>
              <mesh material={BODY}><boxGeometry args={[1.95, UNIT_H, 1.2]} /></mesh>
              <mesh position={[0, 0, 0.6]} material={BEZEL}><boxGeometry args={[1.95, UNIT_H * 0.92, 0.02]} /></mesh>
              {Array.from({ length: 9 }, (_, s) => (
                <mesh key={s} position={[-0.25 + s * 0.075, 0, 0.615]} material={SLAT}><boxGeometry args={[0.03, UNIT_H * 0.55, 0.01]} /></mesh>
              ))}
              {[0, 1].map((k) => (
                <mesh key={k} position={[-0.82 + k * 0.1, 0, 0.62]}>
                  <circleGeometry args={[0.03, 16]} />
                  <meshBasicMaterial transparent ref={(m) => { if (m) leds.current[u * 2 + k] = m; }} />
                </mesh>
              ))}
              {u === PORT_UNIT && (
                <mesh position={[PORT.x, 0, 0.615]} material={PORT_MAT}><boxGeometry args={[0.13, 0.1, 0.02]} /></mesh>
              )}
            </group>
          );
        })}
        {/* cable + plug */}
        <mesh ref={tube} material={cableMat} />
        <group
          ref={plug}
          onPointerDown={(e) => {
            if (plugged) return;
            e.stopPropagation();
            dragging.current = true;
            if (controls) controls.enabled = false;
          }}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <mesh position={[0, 0, 0.06]} material={cableMat}><boxGeometry args={[0.14, 0.11, 0.2]} /></mesh>
          <mesh position={[0, 0, -0.06]}><boxGeometry args={[0.11, 0.08, 0.08]} /><meshStandardMaterial color="#cfd8e3" transparent opacity={0.85} /></mesh>
          {/* a bigger invisible grab handle so the plug is easy to catch */}
          <mesh visible={false}><sphereGeometry args={[0.32, 8, 8]} /></mesh>
        </group>
      </group>
      <ContactShadows frames={1} position={[0, -1.46, 0]} opacity={palette.dark ? 0.6 : 0.35} scale={6} blur={2.4} far={3} />
    </>
  );
}
