import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Sphere } from '@react-three/drei';
import { Vector3, Color } from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

// Glowing orb component for vibrant, trading-themed nodes
const GlowingOrb = ({ position, color, intensity = 1.5, scale = 0.4 }: { position: [number, number, number]; color: string; intensity?: number; scale?: number }) => (
  <Sphere position={position} scale={scale}>
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
  </Sphere>
);

// Particle-like orbs representing a trading network in dark space
function World() {
  const groupRef = useRef<THREE.Group>(null);

  const orbs = useMemo(() => {
    const count = 200; // Reduced for performance
    const elements = [];
    const colors = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b']; // Tailwind indigo-600, purple-600, emerald-500, amber-500
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 80 - 40;
      const y = Math.random() * 80 - 40;
      const z = Math.random() * 80 - 40;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const scale = Math.random() * 0.2 + 0.1;
      elements.push(<GlowingOrb key={i} position={[x, y, z]} color={color} intensity={2} scale={scale} />);
    }
    return elements;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05; // Slower rotation for subtle effect
    }
  });

  return <group ref={groupRef}>{orbs}</group>;
}

const CameraRig = () => {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.lerp(
      new Vector3(Math.sin(t * 0.03) * 15, 5, 15 + Math.cos(t * 0.03) * 15),
      0.02
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

// Main component with dark, vibrant trading platform background
const DigitalWorld = () => {
  return (
    <Canvas
      style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}
      shadows
      camera={{ position: [0, 5, 20], fov: 60 }}
    >
      {/* Dark space background with stars */}
      <Stars radius={150} depth={80} count={5000} factor={5} saturation={1} fade speed={0.3} />

      {/* Subtle lighting for dark mode with vibrant highlights */}
      <ambientLight intensity={0.2} color="#ffffff" />
      <hemisphereLight intensity={0.25} groundColor="#1e1e2e" skyColor="#312e81" /> {/* Tailwind gray-900, indigo-800 */}
      <directionalLight
        castShadow
        position={[30, 30, -30]}
        intensity={0.6}
        shadow-mapSize={[1024, 1024]}
        color="#e0e7ff" // Tailwind indigo-100
      />

      {/* Vibrant point lights for glowing effect */}
      <pointLight position={[0, 0, 0]} intensity={1} distance={40} color="#4f46e5" /> {/* indigo-600 */}
      <pointLight position={[15, 5, 15]} intensity={0.8} distance={30} color="#7c3aed" /> {/* purple-600 */}
      <pointLight position={[-15, -5, -15]} intensity={0.7} distance={30} color="#10b981" /> {/* emerald-500 */}

      <Suspense fallback={null}>
        <World />
      </Suspense>

      <CameraRig />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />

      <EffectComposer>
        {/* Bloom for vibrant glow, tuned for trading aesthetic */}
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.8} intensity={2} levels={6} mipmapBlur />
        {/* Vignette for darker edges, focusing on UI */}
        <Vignette eskil={false} offset={0.4} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
};

export default DigitalWorld;
