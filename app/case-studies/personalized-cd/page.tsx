"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const PURPLE      = "#8B60F0";
const PURPLE_LIGHT = "#AA88F8";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.43, 0.195, 0.02, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function JewelCase3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let animId: number;
    let cleanupFn: (() => void) | null = null;

    async function init() {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

      if (!mountRef.current) return;

      const W = mountRef.current.clientWidth;
      const H = mountRef.current.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0A0908);

      // Camera
      const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 1000);
      camera.position.set(0, 0, 38);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      mountRef.current.appendChild(renderer.domElement);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.minDistance = 20;
      controls.maxDistance = 70;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(8, 12, 18);
      scene.add(key);

      const fill = new THREE.DirectionalLight(0xAA88F8, 0.6);
      fill.position.set(-10, -4, 10);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0xF0609E, 0.35);
      rim.position.set(0, -10, -12);
      scene.add(rim);

      // ── Jewel case group ───────────────────────────────────────────
      // Scale: 1 unit ≈ 1mm  (142 × 125 × 10)
      const S = 0.12; // overall scale factor to fit screen nicely
      const W_mm = 142 * S;
      const H_mm = 125 * S;
      const D_mm =  10 * S;

      const group = new THREE.Group();
      scene.add(group);

      // Helper: rounded-ish box
      function makeBox(w: number, h: number, d: number, color: number, opacity = 1) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshStandardMaterial({
          color,
          transparent: opacity < 1,
          opacity,
          roughness: opacity < 1 ? 0.05 : 0.25,
          metalness: opacity < 1 ? 0.0 : 0.1,
          envMapIntensity: 1,
        });
        return new THREE.Mesh(geo, mat);
      }

      // Main case body — dark charcoal plastic
      const body = makeBox(W_mm, H_mm, D_mm, 0x1a1822);
      group.add(body);

      // Front cover — clear plastic tint (slightly blue)
      const frontCover = makeBox(W_mm * 0.97, H_mm * 0.97, D_mm * 0.06, 0x8B60F0, 0.15);
      frontCover.position.z = D_mm / 2 - D_mm * 0.02;
      group.add(frontCover);

      // Front insert artwork — loaded from uploaded image
      // Fill the case front minus tiny border
      const insertW = W_mm * 0.94;
      const insertH = H_mm * 0.94;
      const insertGeo = new THREE.PlaneGeometry(insertW, insertH);
      const textureLoader = new THREE.TextureLoader();
      const insertMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
      const insert = new THREE.Mesh(insertGeo, insertMat);
      insert.position.z = D_mm / 2 - D_mm * 0.08;
      group.add(insert);
      textureLoader.load("/CD/cd-frame-front.png", (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        insertMat.map = tex;
        insertMat.color.set(0xffffff);
        insertMat.needsUpdate = true;
      });

      // Spine strips (left & right, ~6mm each)
      const spineW = 6 * S;
      const spineColor = 0x111018;

      const spineL = makeBox(spineW, H_mm * 0.96, D_mm * 0.9, spineColor);
      spineL.position.x = -(W_mm / 2 - spineW / 2);
      group.add(spineL);

      const spineR = makeBox(spineW, H_mm * 0.96, D_mm * 0.9, spineColor);
      spineR.position.x =  (W_mm / 2 - spineW / 2);
      group.add(spineR);

      // CD disc (visible through the cover when viewed at angle)
      const discR = 60 * S;
      const holeR = 7.5 * S;
      const discShape = new THREE.Shape();
      discShape.absarc(0, 0, discR, 0, Math.PI * 2, false);
      const hole = new THREE.Path();
      hole.absarc(0, 0, holeR, 0, Math.PI * 2, true);
      discShape.holes.push(hole);

      const discGeo = new THREE.ShapeGeometry(discShape, 64);
      const discMat = new THREE.MeshStandardMaterial({
        color: 0xc8b8e8,
        roughness: 0.05,
        metalness: 0.9,
        side: THREE.DoubleSide,
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.z = 0; // center of case
      group.add(disc);

      // CD center hub
      const hubGeo = new THREE.CylinderGeometry(holeR * 1.5, holeR * 1.5, D_mm * 0.1, 32);
      const hubMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.5 });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.rotation.x = Math.PI / 2;
      disc.add(hub);

      // Edge highlights — thin frame
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0x2a2535, roughness: 0.3, metalness: 0.4 });
      const edgeT = new THREE.Mesh(new THREE.BoxGeometry(W_mm, D_mm * 0.18, D_mm), edgeMat);
      edgeT.position.y = H_mm / 2;
      group.add(edgeT);

      const edgeB = edgeT.clone();
      edgeB.position.y = -H_mm / 2;
      group.add(edgeB);

      // Tray card (back, slightly wider: 150 × 118mm)
      const trayW = 150 * S;
      const trayH = 118 * S;
      const trayGeo = new THREE.PlaneGeometry(trayW, trayH);
      const trayMat = new THREE.MeshStandardMaterial({ color: 0x3b2878, roughness: 0.6 });
      const tray = new THREE.Mesh(trayGeo, trayMat);
      tray.position.z = -(D_mm / 2 - 0.02);
      tray.rotation.y = Math.PI;
      group.add(tray);

      // Slight initial tilt so case looks good on load
      group.rotation.x = 0.15;
      group.rotation.y = -0.3;

      setLoaded(true);

      // Resize handler
      const onResize = () => {
        if (!mountRef.current) return;
        const nw = mountRef.current.clientWidth;
        const nh = mountRef.current.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener("resize", onResize);

      // Animate
      const animate = () => {
        animId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        controls.dispose();
        renderer.dispose();
        window.removeEventListener("resize", onResize);
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    }

    init();
    return () => { cleanupFn?.(); };
  }, []);

  return (
    <div className="relative w-full" style={{ height: 520 }}>
      <div ref={mountRef} className="w-full h-full rounded-2xl overflow-hidden" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#4A4540] text-sm">Loading model…</span>
        </div>
      )}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-[#4A4540] tracking-wide pointer-events-none select-none">
        drag to spin · scroll to zoom
      </p>
    </div>
  );
}

export default function PersonalizedCDPage() {
  return (
    <div className="min-h-screen bg-[#0A0908] text-[#F5EFE8]">
      <div className="noise-overlay" aria-hidden="true" />

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-16">
        <FadeUp>
          <Link href="/#projects" className="inline-flex items-center gap-2 text-[11px] text-[#4A4540] hover:text-[#8B8178] transition-colors mb-10">
            ← Back to all projects
          </Link>
        </FadeUp>

        <FadeUp delay={0.08}>
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: PURPLE }}>
            Creative · Product Design
          </p>
        </FadeUp>

        <FadeUp delay={0.14}>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Personalized CD
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-[#8B8178] text-lg leading-relaxed max-w-2xl mb-12">
            A gifting experience that revives the physical mixtape. Personalized CDs with custom artwork,
            handpicked tracklists, and a companion digital experience.
          </p>
        </FadeUp>

        {/* 3D Model */}
        <FadeUp delay={0.28}>
          <div className="rounded-2xl border border-[#252118] overflow-hidden" style={{ background: "#0A0908" }}>
            <JewelCase3D />
          </div>
        </FadeUp>

        <FadeUp delay={0.36} className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-[#4A4540] text-sm">Full case study coming soon.</p>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
            style={{ color: PURPLE_LIGHT }}
          >
            ← Back to all projects
          </Link>
        </FadeUp>
      </div>
    </div>
  );
}
