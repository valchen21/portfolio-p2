"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

const MODEL_URL = "/Playground/outrun_arcade_cabinet.glb";
const COIN_URL = "/Playground/dollar_coin.glb";

const ENTRANCE_DURATION_MS = 1800;
const ENTRANCE_TURNS = 2;
const ENTRANCE_START_DIST_MULT = 3.5;

const COIN_DURATION_MS = 1600;
const COIN_IDLE_SPIN_RAD_PER_SEC = 0.8;
const COIN_HOVER_SPIN_RAD_PER_SEC = 2.5;
const COIN_TOSS_DURATION_MS = 1800;
const COIN_TOSS_FLIPS = 3; // total end-over-end flips during the toss
const ZOOM_DURATION_MS = 2500;
const POST_ZOOM_HOVER_MS = 250;
const DEEP_ZOOM_DURATION_MS = 350;

type PlayPhase = "default" | "zooming" | "deep-zooming";

function Scene({
  margin = 0.75,
  coinActive = false,
  onCoinTossComplete,
  onDeepZoomComplete,
  phase = "default",
}: {
  margin?: number;
  coinActive?: boolean;
  onCoinTossComplete?: () => void;
  onDeepZoomComplete?: () => void;
  phase?: PlayPhase;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const camera = useThree((s) => s.camera);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<THREE.Group>(null);
  const startTimeRef = useRef<number | null>(null);
  const zoomStartRef = useRef<number | null>(null);
  const zoomFromRef = useRef<{ cam: THREE.Vector3; look: THREE.Vector3 } | null>(null);
  const deepZoomStartRef = useRef<number | null>(null);
  const deepZoomFromRef = useRef<{ cam: THREE.Vector3; look: THREE.Vector3 } | null>(null);
  const deepZoomStartFovRef = useRef<number | null>(null);
  const deepZoomDoneRef = useRef(false);

  // Compute final camera target position + frame offset once when model is loaded
  const sceneInfo = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    cloned.position.sub(center);

    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persp = camera as THREE.PerspectiveCamera;
      const fovRad = (persp.fov * Math.PI) / 180;
      const dist = (maxDim / (2 * Math.tan(fovRad / 2))) * margin;
      persp.near = dist / 100;
      persp.far = dist * 10;
      persp.updateProjectionMatrix();
      return {
        // 3/4 front-left view
        finalCamPos: new THREE.Vector3(-dist * 0.55, dist * 0.15, dist * 0.85),
        // Shift the camera's lookAt right so the model frames to the left
        lookAtX: maxDim * 0.30,
        maxDim,
      };
    }
    return {
      finalCamPos: new THREE.Vector3(0, 0, 5),
      lookAtX: 0,
      maxDim: 1,
    };
  }, [cloned, camera, margin]);

  useFrame(() => {
    if (!groupRef.current) return;
    const persp = camera as THREE.PerspectiveCamera;
    if (!persp.isPerspectiveCamera) return;

    // ── Zoom phase: animate camera into the screen ─────────────────
    if (phase === "zooming") {
      if (zoomStartRef.current === null) {
        zoomFromRef.current = {
          cam: persp.position.clone(),
          look: new THREE.Vector3(sceneInfo.lookAtX, 0, 0),
        };
        zoomStartRef.current = performance.now();
      }
      const elapsed = performance.now() - zoomStartRef.current;
      const t = Math.min(1, elapsed / ZOOM_DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);

      // Stage-1 zoom target — pulls toward the arcade screen and centers it
      const SCREEN_X = 0;
      const SCREEN_Y = sceneInfo.maxDim * 0.10;
      const SCREEN_Z = sceneInfo.maxDim * 0.20;
      const ZOOM_DIST = sceneInfo.maxDim * 0.20;
      const targetCam = new THREE.Vector3(
        SCREEN_X,
        SCREEN_Y,
        SCREEN_Z + ZOOM_DIST
      );
      const targetLook = new THREE.Vector3(SCREEN_X, SCREEN_Y, SCREEN_Z);

      if (zoomFromRef.current) {
        persp.position.lerpVectors(zoomFromRef.current.cam, targetCam, eased);
        const currentLook = new THREE.Vector3().lerpVectors(
          zoomFromRef.current.look,
          targetLook,
          eased
        );
        persp.lookAt(currentLook);
      }
      return;
    }

    // ── Deep-zoom phase: push into the screen content ──────────────
    if (phase === "deep-zooming") {
      if (deepZoomStartRef.current === null) {
        deepZoomFromRef.current = {
          cam: persp.position.clone(),
          look: persp.position
            .clone()
            .add(
              new THREE.Vector3(0, 0, -1).applyQuaternion(persp.quaternion)
            ),
        };
        deepZoomStartFovRef.current = persp.fov;
        deepZoomStartRef.current = performance.now();
      }
      const elapsed = performance.now() - deepZoomStartRef.current;
      const t = Math.min(1, elapsed / DEEP_ZOOM_DURATION_MS);
      const eased = t; // linear — constant velocity, no slow-down at the end

      // Target — much closer to the screen + tighter FOV (telephoto pop)
      const TARGET_X = 0;
      const TARGET_Y = sceneInfo.maxDim * 0.03;
      const TARGET_LOOK_Z = sceneInfo.maxDim * 0.15;
      const TARGET_CAM_Z = TARGET_LOOK_Z + sceneInfo.maxDim * 0.008;
      const targetCam = new THREE.Vector3(TARGET_X, TARGET_Y, TARGET_CAM_Z);
      const targetLook = new THREE.Vector3(
        TARGET_X,
        TARGET_Y,
        TARGET_LOOK_Z
      );
      const TARGET_FOV = 13;

      if (deepZoomFromRef.current) {
        persp.position.lerpVectors(
          deepZoomFromRef.current.cam,
          targetCam,
          eased
        );
        const currentLook = new THREE.Vector3().lerpVectors(
          deepZoomFromRef.current.look,
          targetLook,
          eased
        );
        persp.lookAt(currentLook);

        const startFov = deepZoomStartFovRef.current ?? 45;
        persp.fov = startFov + (TARGET_FOV - startFov) * eased;
        persp.near = sceneInfo.maxDim * 0.001;
        persp.updateProjectionMatrix();
      }

      if (t >= 1 && !deepZoomDoneRef.current) {
        deepZoomDoneRef.current = true;
        onDeepZoomComplete?.();
      }
      return;
    }

    // ── Entrance + idle ────────────────────────────────────────────
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }
    const elapsed = performance.now() - startTimeRef.current;
    const t = Math.min(1, elapsed / ENTRANCE_DURATION_MS);
    const eased = 1 - Math.pow(1 - t, 3);

    const distMul =
      ENTRANCE_START_DIST_MULT + (1 - ENTRANCE_START_DIST_MULT) * eased;
    persp.position.x = sceneInfo.finalCamPos.x * distMul + sceneInfo.lookAtX;
    persp.position.y = sceneInfo.finalCamPos.y * distMul;
    persp.position.z = sceneInfo.finalCamPos.z * distMul;
    persp.lookAt(sceneInfo.lookAtX, 0, 0);

    const totalRot = ENTRANCE_TURNS * 2 * Math.PI;
    groupRef.current.rotation.y = totalRot * (1 - eased);
  });

  return (
    <>
      <group ref={groupRef}>
        <primitive object={cloned} />
      </group>
      <Coin
        active={coinActive}
        arcadeMaxDim={sceneInfo.maxDim}
        onTossComplete={onCoinTossComplete}
      />
    </>
  );
}

function Coin({
  active,
  arcadeMaxDim,
  onTossComplete,
}: {
  active: boolean;
  arcadeMaxDim: number;
  onTossComplete?: () => void;
}) {
  const { scene } = useGLTF(COIN_URL);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<THREE.Group>(null);
  const rotRef = useRef<THREE.Group>(null);
  const startTimeRef = useRef<number | null>(null);
  const tossStartRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [tossing, setTossing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const spinSpeedRef = useRef(COIN_IDLE_SPIN_RAD_PER_SEC);

  // Auto-center the coin, compute scale + label offset relative to arcade
  const { coinScale, labelY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    cloned.position.sub(center);
    const coinMaxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = arcadeMaxDim * 0.22;
    return {
      coinScale: targetSize / coinMaxDim,
      labelY: -(size.y / 2 + coinMaxDim * 0.35),
    };
  }, [cloned, arcadeMaxDim]);

  useEffect(() => {
    if (active && startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }
  }, [active]);

  // Cursor pointer on hover
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  // Idle/entrance final position (also the toss start)
  const IDLE_X = arcadeMaxDim * 0.55;
  const IDLE_Y = 0;
  const IDLE_Z = arcadeMaxDim * 0.2;

  // Initial scale set imperatively to avoid JSX prop conflicting with toss mutations
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(coinScale);
    }
  }, [coinScale]);

  useFrame((_, delta) => {
    if (!active || !groupRef.current) return;

    // ── Toss animation ─────────────────────────────────────────────
    if (tossing && tossStartRef.current !== null) {
      const elapsed = performance.now() - tossStartRef.current;
      const t = Math.min(1, elapsed / COIN_TOSS_DURATION_MS);

      // Straight-up-straight-down toss: same X/Z as IDLE, only Y changes
      const APEX_Y = arcadeMaxDim * 0.20;
      const FALL_END_Y = -arcadeMaxDim * 0.7; // below visible viewport

      const RISE_END = 0.55;
      const HOLD_END = 0.60;

      let posX: number, posY: number, posZ: number, scaleMul: number;
      posX = IDLE_X;
      posZ = IDLE_Z;

      if (t <= RISE_END) {
        const tt = t / RISE_END;
        const eased = 1 - Math.pow(1 - tt, 2); // easeOutQuad — decelerates up to apex
        posY = IDLE_Y + (APEX_Y - IDLE_Y) * eased;
        scaleMul = 1 + 0.4 * eased;
      } else if (t <= HOLD_END) {
        posY = APEX_Y;
        scaleMul = 1.4;
      } else {
        const tt = (t - HOLD_END) / (1 - HOLD_END);
        const posEased = tt * tt; // easeInQuad — gravity on the way down
        posY = APEX_Y + (FALL_END_Y - APEX_Y) * posEased;
        scaleMul = 1.4 + (1 - 1.4) * tt; // shrinks back to normal size
      }

      groupRef.current.position.set(posX, posY, posZ);
      groupRef.current.scale.setScalar(coinScale * scaleMul);

      // Flip rotation around X — exponential ramp (slow start, accelerates)
      const expK = 3;
      const flipProgress =
        (Math.exp(expK * t) - 1) / (Math.exp(expK) - 1);
      if (rotRef.current) {
        rotRef.current.rotation.x =
          COIN_TOSS_FLIPS * 2 * Math.PI * flipProgress;
      }

      if (t >= 1) {
        setTossing(false);
        setHidden(true);
        onTossComplete?.();
      }
      return;
    }

    // ── Entrance (rolling in) + idle spin ──────────────────────────
    if (startTimeRef.current === null) return;

    // Enforce normal scale every frame during non-toss states
    groupRef.current.scale.setScalar(coinScale);

    const elapsed = performance.now() - startTimeRef.current;
    const t = Math.min(1, elapsed / COIN_DURATION_MS);
    const eased = 1 - Math.pow(1 - t, 3);

    const START_X = IDLE_X + arcadeMaxDim * 2.0;

    groupRef.current.position.set(
      START_X + (IDLE_X - START_X) * eased,
      IDLE_Y,
      IDLE_Z
    );

    const targetSpeed = hovered
      ? COIN_HOVER_SPIN_RAD_PER_SEC
      : COIN_IDLE_SPIN_RAD_PER_SEC;
    spinSpeedRef.current += (targetSpeed - spinSpeedRef.current) * 0.12;
    if (rotRef.current) {
      rotRef.current.rotation.y += delta * spinSpeedRef.current;
    }
  });

  const handleClick = () => {
    if (tossing || hidden || !active) return;
    if (startTimeRef.current === null) return;
    const elapsed = performance.now() - startTimeRef.current;
    if (elapsed < COIN_DURATION_MS) return; // entrance not done yet
    tossStartRef.current = performance.now();
    setTossing(true);
  };

  if (!active || hidden) return null;

  const showLabel = !tossing;

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
    >
      {/* Inner rotating group — flip + Y spin live here so the label is unaffected */}
      <group ref={rotRef}>
        <primitive object={cloned} />
      </group>
      <Html position={[0, labelY, 0]} center style={{ pointerEvents: "none" }}>
        <div
          style={{
            opacity: showLabel ? 1 : 0,
            transform: showLabel
              ? "translateY(0) scale(1)"
              : "translateY(10px) scale(0.9)",
            transition:
              "opacity 280ms ease, transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            userSelect: "none",
            filter:
              "drop-shadow(0 8px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 22px rgba(255,140,50,0.5))",
          }}
        >
          <div className="coin-cta">
            <span className="coin-cta__gem coin-cta__gem--l" />
            <span className="coin-cta__gem coin-cta__gem--r" />
            <div className="coin-cta__body">
              <svg
                className="coin-cta__cross coin-cta__cross--l"
                viewBox="0 0 22 22"
                width="22"
                height="22"
              >
                <g
                  stroke="rgba(255, 220, 170, 0.55)"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                >
                  <line x1="4" y1="4" x2="18" y2="18" />
                  <line x1="18" y1="4" x2="4" y2="18" />
                </g>
              </svg>
              <svg
                className="coin-cta__cross coin-cta__cross--r"
                viewBox="0 0 22 22"
                width="22"
                height="22"
              >
                <g
                  stroke="rgba(255, 220, 170, 0.55)"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                >
                  <line x1="4" y1="4" x2="18" y2="18" />
                  <line x1="18" y1="4" x2="4" y2="18" />
                </g>
              </svg>
              <span className="coin-cta__shine" />
              <span className="coin-cta__text">Insert Coin</span>
            </div>
          </div>

          <style jsx>{`
            .coin-cta {
              position: relative;
              display: inline-block;
              padding: 3px;
              border-radius: 999px;
              background: linear-gradient(
                180deg,
                #ffe7a8 0%,
                #f5b95e 22%,
                #c97a2c 60%,
                #6e370e 100%
              );
              box-shadow:
                inset 0 2px 0 rgba(255, 240, 200, 0.95),
                inset 0 -2px 0 rgba(50, 20, 4, 0.75),
                0 0 0 1px rgba(50, 20, 4, 0.55);
              animation: coin-cta-breathe 2.6s ease-in-out infinite;
              white-space: nowrap;
            }
            .coin-cta__body {
              position: relative;
              padding: 11px 64px;
              border-radius: 999px;
              background:
                radial-gradient(
                  ellipse 70% 100% at 50% -15%,
                  rgba(255, 230, 180, 0.9) 0%,
                  transparent 60%
                ),
                linear-gradient(
                  180deg,
                  #f3924a 0%,
                  #e26818 55%,
                  #a83a08 100%
                );
              box-shadow:
                inset 0 2px 3px rgba(255, 230, 180, 0.7),
                inset 0 -3px 6px rgba(70, 24, 4, 0.6),
                inset 0 0 30px rgba(255, 130, 50, 0.35);
              overflow: hidden;
              isolation: isolate;
            }
            .coin-cta__cross {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              z-index: 1;
              opacity: 0.85;
            }
            .coin-cta__cross--l {
              left: 18px;
            }
            .coin-cta__cross--r {
              right: 18px;
            }
            .coin-cta__shine {
              position: absolute;
              inset: 0;
              background: linear-gradient(
                110deg,
                transparent 30%,
                rgba(255, 255, 255, 0.55) 50%,
                transparent 70%
              );
              transform: translateX(-110%);
              animation: coin-cta-shine 2.8s ease-in-out infinite;
              z-index: 2;
              pointer-events: none;
            }
            .coin-cta__text {
              position: relative;
              z-index: 3;
              font-family: 'Inter', system-ui, sans-serif;
              font-weight: 900;
              font-size: 18px;
              letter-spacing: 0.05em;
              color: #fff1c8;
              text-shadow:
                0 1px 0 #6e2a08,
                0 2px 0 #4a1804,
                0 3px 0 #2a0e02,
                0 0 10px rgba(255, 220, 130, 0.65);
            }
            .coin-cta__gem {
              position: absolute;
              top: 50%;
              width: 9px;
              height: 9px;
              transform: translateY(-50%) rotate(45deg);
              background: linear-gradient(
                180deg,
                #ffa080 0%,
                #d83c40 55%,
                #6a1418 100%
              );
              box-shadow:
                inset 0 1px 0 rgba(255, 220, 200, 0.9),
                inset 0 -1px 0 rgba(50, 4, 4, 0.8),
                0 0 8px rgba(255, 100, 80, 0.6);
              z-index: 4;
            }
            .coin-cta__gem--l {
              left: -3px;
            }
            .coin-cta__gem--r {
              right: -3px;
            }
            @keyframes coin-cta-breathe {
              0%,
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.04);
              }
            }
            @keyframes coin-cta-shine {
              0% {
                transform: translateX(-110%);
              }
              55% {
                transform: translateX(110%);
              }
              100% {
                transform: translateX(110%);
              }
            }
          `}</style>
        </div>
      </Html>
    </group>
  );
}

export default function PlayPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [coinActive, setCoinActive] = useState(false);
  const [phase, setPhase] = useState<PlayPhase>("default");
  const [resetKey, setResetKey] = useState(0);

  // Mobile / non-fine-pointer devices skip the whole interaction
  // and go straight to the in-game iframe page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const desktop = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine)"
    ).matches;
    if (!desktop) {
      router.replace("/playground-ingame");
    } else {
      setReady(true);
    }
  }, [router]);

  // Coin spins from the moment the scene is ready
  useEffect(() => {
    if (ready) setCoinActive(true);
  }, [ready, resetKey]);

  const handleReplay = () => {
    setCoinActive(false);
    setPhase("default");
    setResetKey((k) => k + 1);
  };

  // Coin lands → zoom 1 → 0.25s hover → deep-zoom
  useEffect(() => {
    if (phase === "zooming") {
      const t = setTimeout(
        () => setPhase("deep-zooming"),
        ZOOM_DURATION_MS + POST_ZOOM_HOVER_MS
      );
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (!ready) {
    return <main className="min-h-screen w-full bg-[#0A0908]" />;
  }

  return (
    <main className="relative min-h-screen w-full bg-[#0A0908] overflow-hidden">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          href="/#playground"
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-[#252118] bg-[#141210]/80 backdrop-blur-sm text-[#8B8178] hover:text-[#F5EFE8] hover:border-[#3a3530] text-xs font-medium tracking-[0.18em] uppercase transition-all duration-200"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
            ←
          </span>
          Back
        </Link>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="absolute top-6 right-6 z-20 text-right"
      >
        <div className="text-[11px] tracking-[0.3em] uppercase text-[#8B8178]">
          Playground
        </div>
        <div className="font-display italic text-2xl text-[#F5EFE8]">
          OutRun
        </div>
      </motion.div>

      {/* Full-bleed canvas — fixed to viewport so it always fills the screen */}
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 8, 5]} intensity={1.3} />
        <directionalLight
          position={[-5, -3, -5]}
          intensity={0.5}
          color="#5BAECC"
        />
        <directionalLight
          position={[3, -2, 3]}
          intensity={0.3}
          color="#D4874A"
        />
        <Suspense fallback={null}>
          <Scene
            key={`scene-${resetKey}`}
            coinActive={coinActive}
            phase={phase}
            onCoinTossComplete={() => setPhase("zooming")}
            onDeepZoomComplete={() => router.push("/playground-ingame")}
          />
        </Suspense>
      </Canvas>

      {/* Replay button — bottom-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute bottom-6 right-6 z-50"
      >
        <button
          onClick={handleReplay}
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-[#252118] bg-[#141210]/80 backdrop-blur-sm text-[#8B8178] hover:text-[#F5EFE8] hover:border-[#3a3530] text-xs font-medium tracking-[0.18em] uppercase transition-all duration-200"
        >
          <span className="text-base inline-block group-hover:rotate-180 transition-transform duration-500">
            ↻
          </span>
          Replay
        </button>
      </motion.div>
    </main>
  );
}

useGLTF.preload(MODEL_URL);
useGLTF.preload(COIN_URL);
