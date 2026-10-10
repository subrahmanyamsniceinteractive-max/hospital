import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TimeOfDay } from '../../../types/hospital';

interface AtmosphericVFXProps {
  timeOfDay: TimeOfDay;
  enabledGodRays?: boolean;
  enabledDustMotes?: boolean;
  enabledChaiSteam?: boolean;
  enabledRain?: boolean;
}

/**
 * 1. Floating Atmospheric Dust Motes & Golden Pollen Particles
 * Simulates micro-particles catching ambient sunlight, rising and swirling in gentle thermal updrafts.
 */
export const DustMotesField: React.FC<{ count?: number; bounds?: [number, number, number] }> = ({
  count = 140,
  bounds = [90, 22, 180]
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * bounds[0];
      pos[i * 3 + 1] = Math.random() * bounds[1] + 0.5;
      pos[i * 3 + 2] = Math.random() * bounds[2] - 10;
    }
    return pos;
  }, [count, bounds]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.2;
    // GPU transform without modifying buffer attributes
    pointsRef.current.position.y = (t % bounds[1]) * 0.4;
    pointsRef.current.rotation.y = t * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        color="#fef08a"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/**
 * 2. Volumetric Sun God Rays (Crepuscular Light Shafts)
 * Translucent radial light shafts with dynamic animated shimmer.
 */
export const SunGodRays: React.FC<{ sunPosition: [number, number, number]; isGolden: boolean }> = ({
  sunPosition,
  isGolden
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Subtle natural optical pulsation
    const shimmer = 0.85 + Math.sin(t * 1.8) * 0.12;
    groupRef.current.scale.set(shimmer, shimmer, shimmer);
  });

  // Calculate sun direction normalized
  const sunDir = useMemo(() => {
    const v = new THREE.Vector3(...sunPosition).normalize();
    return v;
  }, [sunPosition]);

  return (
    <group ref={groupRef} position={[sunPosition[0] * 0.35, sunPosition[1] * 0.35, sunPosition[2] * 0.35]}>
      {[-0.25, -0.08, 0.1, 0.28, 0.45].map((angleOffset, idx) => (
        <mesh
          key={`godray-${idx}`}
          position={[angleOffset * 22, -18, angleOffset * 15]}
          rotation={[0.45, angleOffset * 0.6, -0.35]}
        >
          <coneGeometry args={[4.5 + idx * 0.8, 75, 16, 1, true]} />
          <meshBasicMaterial
            color={isGolden ? '#fed7aa' : '#ffffff'}
            transparent
            opacity={isGolden ? 0.075 : 0.05}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

/**
 * 3. Monsoon Coastal Rain System & Ground Splash Rings
 * Simulates heavy Andhra coastal monsoon downpour with 2,400 rain streaks and ground splashes.
 */
export const MonsoonRainSystem: React.FC = () => {
  const rainRef = useRef<THREE.Points>(null);
  const splashesRef = useRef<THREE.Group>(null);
  const count = 2400;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 85;
      pos[i * 3 + 1] = Math.random() * 38;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 160 + 50;
      vel[i] = 38 + Math.random() * 22; // High terminal velocity
    }
    return [pos, vel];
  }, [count]);

  useFrame((_, delta) => {
    if (!rainRef.current) return;
    const posAttr = rainRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Rain falls fast with a slant due to coastal sea breeze
      array[idx + 1] -= velocities[i] * delta;
      array[idx + 0] += delta * 4.5; // Wind drift

      if (array[idx + 1] < 0) {
        array[idx + 1] = 38;
        array[idx + 0] = (Math.random() - 0.5) * 85;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Falling Rain Streaks */}
      <points ref={rainRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color="#cbd5e1"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Ground Puddle Ripples & Wet Reflections */}
      <mesh position={[0, 0.03, 75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 180]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.08}
          metalness={0.85}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

/**
 * 4. Billowing Steam Particles from Sri Balaji Tiffin Stall Idli Steamer
 */
export const ChaiStallSteam: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;

  const [positions, offsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = Math.random() * 2.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      off[i] = Math.random() * Math.PI * 2;
    }
    return [pos, off];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      array[idx + 1] += delta * 0.85; // Rise up
      array[idx + 0] += Math.sin(t * 2 + offsets[i]) * 0.006;
      array[idx + 2] += Math.cos(t * 1.5 + offsets[i]) * 0.006;

      if (array[idx + 1] > 2.5) {
        array[idx + 1] = 0;
        array[idx + 0] = (Math.random() - 0.5) * 0.35;
        array[idx + 2] = (Math.random() - 0.5) * 0.35;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.32}
          color="#f1f5f9"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

/**
 * Master Atmospheric VFX Controller
 */
export const AtmosphericVFX: React.FC<AtmosphericVFXProps> = ({
  timeOfDay,
  enabledGodRays = false,
  enabledDustMotes = false,
  enabledChaiSteam = false,
  enabledRain = false
}) => {
  const isNight = timeOfDay === 'night';
  const isGolden = timeOfDay === 'golden';
  const isRain = timeOfDay === 'rain' || enabledRain;

  const sunPos: [number, number, number] = isNight
    ? [0, -10, 0]
    : isGolden
    ? [60, 18, 90]
    : [40, 65, 50];

  return (
    <group>
      {/* 1. Sunlight Dust Motes (Day / Golden hour) */}
      {enabledDustMotes && !isRain && !isNight && <DustMotesField />}

      {/* 2. Crepuscular Sun God Rays */}
      {enabledGodRays && !isNight && !isRain && (
        <SunGodRays sunPosition={sunPos} isGolden={isGolden} />
      )}

      {/* 3. Coastal Andhra Monsoon Rain System */}
      {isRain && <MonsoonRainSystem />}

      {/* 4. Idli Cooker & Tea Kettle Billowing Steam at Sri Balaji Tiffin Point */}
      {enabledChaiSteam && (
        <ChaiStallSteam position={[-8.1, 1.25, 142.2]} />
      )}
    </group>
  );
};
