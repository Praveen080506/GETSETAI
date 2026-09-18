import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";

const services = [
  { icon: "🎤", label: "Technical Seminar" },
  { icon: "🧠", label: "AI Driven Software Solutions" },
  { icon: "💻", label: "Website Development Full Stack" },
  { icon: "📈", label: "Digital Marketing" },
  { icon: "📱", label: "Social Media Management" },
  { icon: "🤖", label: "Robotics" },
  { icon: "📚", label: "Enhanced Courses" },
] as const;

const layout = [
  [-2.4, -1.8, -0.8],
  [-0.5, 2.3, -1.2],
  [1.7, 1.9, -0.2],
  [3.3, -0.8, -1.8],
  [2.2, -2.5, -0.9],
  [-1.1, -0.2, -2.1],
  [0.4, 0.8, -2.8],
] as const;

function ServiceCard({
  icon,
  label,
  position,
  rotation,
}: {
  icon: string;
  label: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.7}>
      <group position={position} rotation={rotation}>
        <Html center transform distanceFactor={8} occlude={false}>
          <div className="pill flex w-[180px] flex-col items-center gap-2 border border-white/15 bg-white/8 px-4 py-5 text-center text-white shadow-xl backdrop-blur-xl backdrop-saturate-150">
            <span className="text-2xl">{icon}</span>
            <span className="text-[10px] font-medium leading-tight tracking-tight text-white/90">
              {label}
            </span>
          </div>
        </Html>
      </group>
    </Float>
  );
}

export function ServicesScene() {
  const dpr = useMemo(
    () => (typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1),
    [],
  );

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="!fixed inset-0 z-0"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {services.map((service, index) => (
        <ServiceCard
          key={service.label}
          icon={service.icon}
          label={service.label}
          position={(layout[index] ? [...layout[index]] : [0, 0, 0]) as [number, number, number]}
          rotation={[0, index * 0.5, 0]}
        />
      ))}
    </Canvas>
  );
}
