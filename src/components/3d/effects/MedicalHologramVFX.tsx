import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface MedicalHologramVFXProps {
  position?: [number, number, number];
  scanHeight?: number;
  scanWidth?: number;
  color?: string;
  enabledScan?: boolean;
  enabledHoloRings?: boolean;
}

/**
 * 1. High-Tech Medical Diagnostic Laser Scan Plane
 * Vertical slicing beam with moving scanline and glowing laser edge.
 */
export const LaserScanPlane: React.FC<{
  position?: [number, number, number];
  height?: number;
  width?: number;
  color?: string;
}> = ({ position = [0, 0, 0], height = 3.6, width = 3.8, color = '#06b6d4' }) => {
  const planeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!planeRef.current) return;
    const t = state.clock.elapsedTime;
    // Smooth back-and-forth diagnostic laser sweep
    const zOffset = Math.sin(t * 1.6) * 1.8;
    planeRef.current.position.z = position[2] + zOffset;
  });

  return (
    <group ref={planeRef} position={position}>
      {/* Translucent Laser Sheet */}
      <mesh position={[0, height * 0.5, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Intensely Glowing Top & Bottom Cutting Laser Edges */}
      <mesh position={[0, height * 0.5, 0]}>
        <planeGeometry args={[width, 0.04]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Vertical Holographic Grid Matrix */}
      {[-width * 0.4, -width * 0.2, 0, width * 0.2, width * 0.4].map((lx, idx) => (
        <mesh key={`hologrid-${idx}`} position={[lx, height * 0.5, 0]}>
          <planeGeometry args={[0.015, height]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

/**
 * 2. Rotating Holographic Diagnostic Telemetry Rings
 * Multi-layer concentric geometric data rings that rotate around the medical equipment.
 */
export const HologramTelemetryRings: React.FC<{
  position?: [number, number, number];
  radius?: number;
  color?: string;
}> = ({ position = [0, 0.1, 0], radius = 2.4, color = '#06b6d4' }) => {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.y += delta * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 0.65;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.9;
  });

  return (
    <group position={position}>
      {/* Outer Telemetry Compass Ring */}
      <group ref={ring1Ref}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.96, radius, 48]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Cardinal Tick Marks */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={`tick-${i}`}
            rotation={[0, (i / 8) * Math.PI * 2, 0]}
            position={[0, 0, radius * 0.98]}
          >
            <boxGeometry args={[0.04, 0.02, 0.16]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Middle Counter-Rotating Data Track */}
      <group ref={ring2Ref}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.76, radius * 0.78, 32]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh
            key={`node-${i}`}
            rotation={[0, (i / 4) * Math.PI * 2, 0]}
            position={[0, 0, radius * 0.77]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color="#67e8f9"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Inner Precision Reticle */}
      <group ref={ring3Ref}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.52, radius * 0.54, 24]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

/**
 * 3. Master Medical Hologram VFX Suite
 */
export const MedicalHologramVFX: React.FC<MedicalHologramVFXProps> = ({
  position = [0, 0, 0],
  scanHeight = 3.2,
  scanWidth = 3.6,
  color = '#06b6d4',
  enabledScan = false,
  enabledHoloRings = false
}) => {
  return (
    <group position={position}>
      {/* Concentric Telemetry Rings on the Floor */}
      {enabledHoloRings && (
        <HologramTelemetryRings radius={scanWidth * 0.75} color={color} />
      )}

      {/* Diagnostic Slicing Laser Plane */}
      {enabledScan && (
        <LaserScanPlane
          height={scanHeight}
          width={scanWidth}
          color={color}
        />
      )}
    </group>
  );
};
