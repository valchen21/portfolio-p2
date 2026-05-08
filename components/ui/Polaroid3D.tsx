"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/Landing%20Page/P3.glb";

type SpinState =
  | { kind: "mouse" }
  | { kind: "spinning"; startTime: number; startY: number; startX: number; targetY: number }
  | { kind: "locked" };

function Model({
  margin = 1.4,
  yawRange = 0.7,
  pitchRange = 0.35,
  smoothing = 0.08,
  spin = false,
  spinDurationMs = 1200,
  onSpinComplete,
}: {
  margin?: number;
  yawRange?: number;
  pitchRange?: number;
  smoothing?: number;
  spin?: boolean;
  spinDurationMs?: number;
  onSpinComplete?: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const camera = useThree((s) => s.camera);
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef<SpinState>({ kind: "mouse" });
  const onSpinCompleteRef = useRef(onSpinComplete);
  onSpinCompleteRef.current = onSpinComplete;

  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!groupRef.current) return;

    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    cloned.position.sub(center);

    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persp = camera as THREE.PerspectiveCamera;
      const fovRad = (persp.fov * Math.PI) / 180;
      const dist = (maxDim / (2 * Math.tan(fovRad / 2))) * margin;
      persp.position.set(0, 0, dist);
      persp.near = dist / 100;
      persp.far = dist * 10;
      persp.lookAt(0, 0, 0);
      persp.updateProjectionMatrix();
    }
  }, [cloned, camera, margin]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMouseMove);
    return () => window.removeEventListener("pointermove", onMouseMove);
  }, []);

  // Trigger spin transition
  useEffect(() => {
    if (!spin) return;
    if (stateRef.current.kind !== "mouse") return;
    const g = groupRef.current;
    if (!g) return;

    const TWO_PI = 2 * Math.PI;
    const mod = (n: number, d: number) => ((n % d) + d) % d;
    const startY = g.rotation.y;
    const startMod = mod(startY, TWO_PI);
    // Distance to next "facing back" angle (rotation.y mod 2π = π)
    const angleToBack = (Math.PI - startMod + TWO_PI) % TWO_PI;
    const turns = 2;
    const targetY = startY + turns * TWO_PI + angleToBack;

    stateRef.current = {
      kind: "spinning",
      startTime: performance.now(),
      startY,
      startX: g.rotation.x,
      targetY,
    };
  }, [spin]);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const state = stateRef.current;

    if (state.kind === "spinning") {
      const elapsed = performance.now() - state.startTime;
      const t = Math.min(1, elapsed / spinDurationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      g.rotation.y = state.startY + (state.targetY - state.startY) * eased;
      // Flatten any pitch tilt during the spin
      g.rotation.x = state.startX * (1 - eased);
      if (t >= 1) {
        stateRef.current = { kind: "locked" };
        onSpinCompleteRef.current?.();
      }
      return;
    }

    if (state.kind === "mouse") {
      const tY = mouseRef.current.x * yawRange;
      const tX = mouseRef.current.y * pitchRange;
      g.rotation.y += (tY - g.rotation.y) * smoothing;
      g.rotation.x += (tX - g.rotation.x) * smoothing;
    }
    // locked: hold position
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  );
}

export default function Polaroid3D({
  width = 420,
  height = 360,
  spin = false,
  onSpinComplete,
}: {
  width?: number;
  height?: number;
  spin?: boolean;
  onSpinComplete?: () => void;
}) {
  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
        style={{ background: "transparent" }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
      >
        <directionalLight position={[4, 5, 5]} intensity={1.4} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#5BAECC" />
        <directionalLight position={[3, -3, 1]} intensity={0.25} color="#D4874A" />

        <Suspense fallback={null}>
          <Model spin={spin} onSpinComplete={onSpinComplete} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
