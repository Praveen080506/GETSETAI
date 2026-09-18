import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

// Vertex Shader: curves card along X, applies S-curve clearance (upper curve to right, lower curve to left), and velocity distortion
const vertexShader = `
varying vec2 vUv;
varying vec3 vWorldPosition;
#define PI 3.14159265359

uniform float uScrollSpeed;

void main() {
  vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vec3 newPosition = position;
  
  // Ribbon arc along card width
  newPosition.z = sin(uv.x * PI) * 0.2;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  
  // S-curve lateral clearance:
  // Upper curve (y > 0) sweeps outward to the right.
  // Lower curve (y < 0) sweeps downward to the left.
  // This leaves the middle focused display completely open and unobstructed in front!
  if (worldPosition.y > 0.0) {
    viewPosition.x += pow(worldPosition.y, 1.8) * 0.12;
  } else {
    viewPosition.x -= pow(-worldPosition.y, 1.8) * 0.06;
  }
  
  // Scroll velocity vertex distortion (fluid stretching along Y during scroll)
  viewPosition.x += sin(uv.y * PI) * uScrollSpeed * 2.0;
  
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  vUv = uv;
  vWorldPosition = worldPosition;
}
`;

// Fragment Shader: Rounded SDF borders, texture cover fit, 9-tap Gaussian blur for rear elements, and smooth upper/lower entry/exit fades
const fragmentShader = `
uniform sampler2D uTexture;
uniform float uColorStrength;
uniform float uZoom;
uniform vec2 uPlaneSizes;
uniform vec2 uImageSizes;
uniform float uRevealProgress;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vWorldPosition;

// Signed Distance Field for rounded corners
float roundedRectSDF(vec2 uv, vec2 size, float radius) {
  vec2 d = abs(uv - 0.5) - size * 0.5 + radius;
  return length(max(d, 0.0)) - radius;
}

void main() {
  // Object-fit: cover aspect ratio logic
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  vec2 zoomedUv = (uv - 0.5) / uZoom + 0.5;

  vec4 color;

  if (gl_FrontFacing) {
    color = texture2D(uTexture, zoomedUv);
    // Subtle darkening / contrast tint on hover
    color = mix(color, vec4(0.0, 0.0, 0.0, 1.0), uColorStrength);
  } else {
    // 9-tap Gaussian blur for rear elements (depth-of-field effect on back-side cards)
    float offset = 38.0 / 1024.0;
    vec4 c = vec4(0.0);

    c += texture2D(uTexture, uv + vec2(-offset, -offset)) * 1.0;
    c += texture2D(uTexture, uv + vec2( 0.0,    -offset)) * 2.0;
    c += texture2D(uTexture, uv + vec2( offset, -offset)) * 1.0;
    c += texture2D(uTexture, uv + vec2(-offset,  0.0))   * 2.0;
    c += texture2D(uTexture, uv)                         * 4.0;
    c += texture2D(uTexture, uv + vec2( offset,  0.0))   * 2.0;
    c += texture2D(uTexture, uv + vec2(-offset,  offset)) * 1.0;
    c += texture2D(uTexture, uv + vec2( 0.0,     offset)) * 2.0;
    c += texture2D(uTexture, uv + vec2( offset,  offset)) * 1.0;
    c /= 16.0;

    // Rear cards are dimmed to accentuate depth and avoid distraction from front focal cards
    color = mix(c, vec4(0.02, 0.02, 0.05, 1.0), 0.4);
  }

  float reveal = clamp(uRevealProgress, 0.0, 1.0);
  vec2 revealSize = vec2(reveal);

  // Border radius follows reveal
  float baseRadius = 0.06;
  float radius = baseRadius * reveal;

  // Signed Distance Field
  float sdf = roundedRectSDF(vUv, revealSize, radius);

  // Soft anti-aliased edge
  float edge = 0.003;
  float alpha = 1.0 - smoothstep(0.0, edge, sdf);
  alpha *= smoothstep(0.05, 1.0, uRevealProgress) * uOpacity;

  // Seamless upper and lower entry/exit fade (prevents popping when images come and go)
  float topFade = smoothstep(3.5, 2.3, vWorldPosition.y);
  float bottomFade = smoothstep(-5.4, -3.9, vWorldPosition.y);
  alpha *= clamp(topFade * bottomFade, 0.0, 1.0);

  gl_FragColor = vec4(color.rgb, color.a * alpha);
}
`;

interface CardMesh extends THREE.Mesh {
  userData: {
    project: Project;
    index: number;
    hoverProgress: number;
    hoverTarget: number;
    hiddenProgress: number;
    hiddenTarget: number;
    material: THREE.ShaderMaterial;
  };
}

export default function SpiralGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [displayedProject, setDisplayedProject] = useState<Project | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 18 total cards for optimal spiral density, rhythm, and seamless wrapping
    const TOTAL_SPIRAL_CARDS = 18;
    const spiralItems: Project[] = Array.from(
      { length: TOTAL_SPIRAL_CARDS },
      (_, i) => projects[i % projects.length]!
    );
    const totalCards = TOTAL_SPIRAL_CARDS;
    const centerIndex = Math.floor(totalCards / 2); // 9

    // Setup Three.js scene & camera
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    let isMobile = width < 768;

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 45 : 35,
      width / height,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NoToneMapping;

    // Shared plane geometry with subdivisions for smooth curve distortion
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 16, 16);

    // Texture cache to prevent redundant fetches
    const textureLoader = new THREE.TextureLoader();
    const textureCache = new Map<string, THREE.Texture>();

    const getTexture = (src: string, onUpdateSizes?: (imgW: number, imgH: number) => void) => {
      if (textureCache.has(src)) {
        const tex = textureCache.get(src)!;
        const img = tex.image as HTMLImageElement | undefined;
        if (img && onUpdateSizes) {
          onUpdateSizes(img.width || 1920, img.height || 1080);
        }
        return tex;
      }
      const tex = textureLoader.load(src, (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.minFilter = THREE.LinearMipmapLinearFilter;
        loaded.magFilter = THREE.LinearFilter;
        loaded.generateMipmaps = true;
        const img = loaded.image as HTMLImageElement | undefined;
        if (onUpdateSizes && img) {
          onUpdateSizes(img.width || 1920, img.height || 1080);
        }
      });
      textureCache.set(src, tex);
      return tex;
    };

    // Card parameters
    const baseScaleX = isMobile ? 1.5 : 1.7;
    const baseScaleY = isMobile ? 0.9 : 1.0;
    const verticalGap = 0.52; // Generous vertical spacing so cards don't collide
    const angleGap = 0.85; // angular pitch per card
    const baseRadius = 2.0;

    const cardMeshes: CardMesh[] = [];

    // Initialize cards
    spiralItems.forEach((item, index) => {
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        uniforms: {
          uTexture: { value: null },
          uColorStrength: { value: 0.0 },
          uZoom: { value: 1.0 },
          uPlaneSizes: { value: new THREE.Vector2(baseScaleX, baseScaleY) },
          uImageSizes: { value: new THREE.Vector2(1920, 1080) },
          uRevealProgress: { value: 0.0 },
          uOpacity: { value: 1.0 },
          uScrollSpeed: { value: 0.0 },
        },
      });

      const tex = getTexture(item.cover, (w, h) => {
        const imgSizes = material.uniforms["uImageSizes"];
        if (imgSizes) {
          imgSizes.value.set(w, h);
        }
      });
      const texUniform = material.uniforms["uTexture"];
      if (texUniform) {
        texUniform.value = tex;
      }

      const mesh = new THREE.Mesh(planeGeometry, material);
      mesh.scale.set(baseScaleX, baseScaleY, 1);
      const cardMesh = mesh as unknown as CardMesh;
      cardMesh.userData = {
        project: item,
        index,
        hoverProgress: 0,
        hoverTarget: 0,
        hiddenProgress: 1,
        hiddenTarget: 1,
        material,
      };

      scene.add(cardMesh);
      cardMeshes.push(cardMesh);
    });

    // Staggered reveal animation (blossom into spiral)
    cardMeshes.forEach((card, i) => {
      setTimeout(() => {
        card.userData.hiddenTarget = 0;
      }, (i % 6) * 55);
    });

    // Interaction states
    let scrollOffset = 0;
    let wheelDeltaY = 0;
    let targetWheelDeltaY = 0;
    let wheelDirection = 1;
    const minWheelSpeed = 0.007; // constant rolling rotation speed when not scrolling
    const easing = 0.08;

    const normalizedMouse = new THREE.Vector2(0, 0);
    const targetCameraOffset = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();

    let hoveredMesh: CardMesh | null = null;
    let isDragging = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let lastPointerY = 0;

    // Wheel listener
    const onWheel = (e: WheelEvent) => {
      targetWheelDeltaY += e.deltaY * 0.00015;
      targetWheelDeltaY = Math.max(-1.4, Math.min(1.4, targetWheelDeltaY));
      wheelDirection = e.deltaY >= 0 ? 1 : -1;
    };

    // Pointer move listener
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      normalizedMouse.x = (clientX / width) * 2 - 1;
      normalizedMouse.y = -(clientY / height) * 2 + 1;

      targetCameraOffset.x = normalizedMouse.x * 0.35;
      targetCameraOffset.y = normalizedMouse.y * 0.25;

      if (isDragging) {
        const delta = clientY - lastPointerY;
        targetWheelDeltaY -= delta * 0.0022;
        lastPointerY = clientY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      lastPointerY = e.clientY;
      canvas.style.cursor = "grabbing";
    };

    const onPointerUp = () => {
      isDragging = false;
      canvas.style.cursor = hoveredMesh ? "pointer" : "grab";
    };

    const onPointerLeave = () => {
      normalizedMouse.x = 9999;
      normalizedMouse.y = 9999;
      if (hoveredMesh) {
        hoveredMesh.userData.hoverTarget = 0;
        hoveredMesh = null;
        canvas.style.cursor = "default";
        setHoveredProject(null);
      }
    };

    // Attach interaction events
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      isMobile = width < 768;

      camera.aspect = width / height;
      camera.fov = isMobile ? 45 : 35;
      camera.position.z = 8.0;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      lastTime = time;

      // Inertial scroll dynamics
      wheelDeltaY += (targetWheelDeltaY - wheelDeltaY) * easing;
      scrollOffset += wheelDeltaY;

      // Constant rolling rotation when idle (without scrolling)
      if (Math.abs(targetWheelDeltaY) > minWheelSpeed) {
        targetWheelDeltaY *= 0.94;
      } else {
        targetWheelDeltaY = wheelDirection * minWheelSpeed;
      }

      // Camera parallax
      camera.position.x += (targetCameraOffset.x - camera.position.x) * 0.05;
      camera.position.y += (targetCameraOffset.y - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Raycasting for interactive hover (searches front-facing cards)
      raycaster.setFromCamera(normalizedMouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);

      // Filter for front-facing cards only, closest to camera first
      const frontHit = intersects.find((hit) => {
        if (!hit.face) return false;
        const worldNormal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
        return worldNormal.dot(raycaster.ray.direction) < -0.15;
      });

      const newHoveredMesh = (frontHit?.object as CardMesh) || null;

      if (newHoveredMesh !== hoveredMesh) {
        if (hoveredMesh) {
          hoveredMesh.userData.hoverTarget = 0;
        }
        if (newHoveredMesh && newHoveredMesh.userData.hiddenProgress < 0.1) {
          newHoveredMesh.userData.hoverTarget = 1;
          hoveredMesh = newHoveredMesh;
          canvas.style.cursor = "pointer";
          setHoveredProject(newHoveredMesh.userData.project);
          setDisplayedProject(newHoveredMesh.userData.project);
        } else {
          hoveredMesh = null;
          canvas.style.cursor = "default";
          setHoveredProject(null);
        }
      }

      // Update each card position, rotation, scale & uniforms
      for (const card of cardMeshes) {
        const ud = card.userData;

        // Smoothly interpolate hover & reveal progress
        ud.hoverProgress += (ud.hoverTarget - ud.hoverProgress) * 0.1;
        ud.hiddenProgress += (ud.hiddenTarget - ud.hiddenProgress) * 0.07;

        // Modulo infinite wrapping math
        let N = ud.index - scrollOffset;
        N = ((N % totalCards) + totalCards) % totalCards;

        const B = N - centerIndex;
        const y = B * verticalGap - 0.8 - ud.hiddenProgress * 1.5;
        const theta = B * angleGap;

        // Focal depth arch:
        // Middle cards (near y = -0.3 to 0.3) are in the focal spotlight.
        // We push middle cards FORWARD (+Z) and push upper and lower curves to the BACK SIDE (-Z).
        const focalDist = Math.abs(y + 0.3);
        const focalFactor = Math.exp(-Math.pow(focalDist / 1.6, 2));
        const zArch = focalFactor * 0.75 - (1.0 - focalFactor) * 0.55;
        const r = baseRadius * (1.0 - ud.hiddenProgress * 0.25);

        // Position: Parametric cylindrical spiral with focal forward boost
        card.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r + zArch);

        // Rotation: tangent to the spiral curve
        card.rotation.y = -theta + Math.PI / 2;

        // Scale: middle focused card is prominent, upper & lower curves recede subtly
        const cardScale = (0.86 + focalFactor * 0.16) * (1.0 + 0.05 * ud.hoverProgress);
        const curScaleX = baseScaleX * cardScale;
        const curScaleY = baseScaleY * cardScale;
        card.scale.set(curScaleX, curScaleY, 1);

        // Update GLSL shader uniforms
        const u = ud.material.uniforms;
        const planeSizes = u["uPlaneSizes"];
        if (planeSizes) {
          planeSizes.value.set(curScaleX, curScaleY);
        }

        const colorStrength = u["uColorStrength"];
        if (colorStrength) colorStrength.value = 0.25 * ud.hoverProgress;

        const zoom = u["uZoom"];
        if (zoom) zoom.value = 1.0 + 0.05 * ud.hoverProgress;

        const revealProg = u["uRevealProgress"];
        if (revealProg) {
          revealProg.value = (1.0 - ud.hoverProgress * 0.04) * (1.0 - ud.hiddenProgress);
        }

        const scrollSpeed = u["uScrollSpeed"];
        if (scrollSpeed) {
          const dynamicSpeed =
            Math.abs(wheelDeltaY) > minWheelSpeed * 1.1
              ? wheelDeltaY - wheelDirection * minWheelSpeed
              : 0;
          scrollSpeed.value = dynamicSpeed;
        }

        // Crucial: Higher renderOrder renders on top!
        // Closer cards (higher position.z) have higher renderOrder, guaranteeing
        // that the middle focused card renders ON TOP of both upper and lower curves!
        card.renderOrder = Math.round((card.position.z + 10) * 10);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", handleResize);

      cardMeshes.forEach((card) => {
        card.geometry.dispose();
        card.userData.material.dispose();
      });
      textureCache.forEach((tex) => tex.dispose());
      textureCache.clear();
      planeGeometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-dvh w-full select-none items-center justify-center overflow-hidden bg-background"
    >
      {/* Atmospheric radial vignette mask matching Pacôme Pertant */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,8,0.85)_100%)]" />

      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        style={{ display: "block" }}
      />

      {/* Floating Bottom Project Pill HUD (Only visible on image hover) */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ease-out",
          hoveredProject
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        )}
      >
        {displayedProject && (
          <div className="flex items-center gap-2.5 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-foreground/90 shadow-lg backdrop-blur-md select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] text-muted-foreground">
              {displayedProject.category}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="max-w-[200px] truncate font-medium text-foreground sm:max-w-[320px]">
              {displayedProject.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}