"use client";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { ReactNode, useEffect, useRef, useState } from "react";
import { hasWebGL, useInView } from "./hooks";

type Props = {
  className?: string;
  children: ReactNode;
  overlay?: ReactNode;
  fallback: string;
  camera?: CanvasProps["camera"];
};

/** Mounts a WebGL canvas only near the viewport, and pauses rendering when it scrolls away. */
export default function SceneFrame({ className, children, overlay, fallback, camera }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, "400px");
  const visible = useInView(ref, "50px");
  const [gl, setGl] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setGl(hasWebGL()), []);
  useEffect(() => { if (near) setMounted(true); }, [near]);

  return (
    <div ref={ref} className={className}>
      {gl === false ? (
        <div className="scene-fallback">{fallback}</div>
      ) : mounted ? (
        <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} camera={camera} gl={{ antialias: true, alpha: true }}>
          {children}
        </Canvas>
      ) : null}
      {overlay}
    </div>
  );
}
