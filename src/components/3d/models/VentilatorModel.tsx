import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ExplodedLine } from '../ExplodedLine';
import { getVentilatorScreenTexture, getMicroNoiseTexture, getBrushedMetalTexture } from '../materials/proceduralTextures';

interface ModelProps {
  explodedProgress: number;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  hoveredPartId: string | null;
  onHoverPart: (partId: string | null) => void;
}

export const VentilatorModel: React.FC<ModelProps> = ({
  explodedProgress,
  selectedPartId,
  onSelectPart,
  hoveredPartId,
  onHoverPart
}) => {
  const beaconRef = useRef<THREE.Mesh>(null);
  const screenTex = useMemo(() => getVentilatorScreenTexture(), []);
  const noiseTex = useMemo(() => getMicroNoiseTexture(), []);
  const brushedMetalTex = useMemo(() => getBrushedMetalTexture(), []);

  const p = explodedProgress;

  useFrame((state) => {
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      }
    }
  });

  const isPartActive = (id: string) => selectedPartId === id;
  const isPartHovered = (id: string) => hoveredPartId === id;

  const getPartColor = (defaultColor: string, id: string) => {
    if (isPartActive(id)) return '#38bdf8';
    if (isPartHovered(id)) return '#06b6d4';
    return defaultColor;
  };

  const getPartEmissive = (id: string, defaultEmissive = '#000000') => {
    if (isPartActive(id)) return '#0284c7';
    if (isPartHovered(id)) return '#0891b2';
    return defaultEmissive;
  };

  const getPartEmissiveIntensity = (id: string) => {
    if (isPartActive(id)) return 0.55;
    if (isPartHovered(id)) return 0.3;
    return 0.0;
  };

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Touchscreen Waveform Display - Moves Up and Forward */}
      <group
        position={[0, 1.8 * p, 1.5 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('vent_screen'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('vent_screen'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Anti-Microbial Sealed Display Bezel */}
        <mesh position={[0, 1.72, 0.22]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.96, 0.64, 0.08]} />
          <meshStandardMaterial
            color={getPartColor('#1e293b', 'vent_screen')}
            metalness={0.4}
            roughness={0.2}
            emissive={getPartEmissive('vent_screen')}
            emissiveIntensity={getPartEmissiveIntensity('vent_screen')}
          />
        </mesh>

        {/* Photorealistic Clinical Waveform Touchscreen Surface */}
        <mesh position={[0, 1.72, 0.265]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[0.88, 0.56]} />
          <meshBasicMaterial map={screenTex} />
        </mesh>

        {/* 360-Degree Omnidirectional High-Acuity Alarm Beacon */}
        <mesh ref={beaconRef} position={[0, 2.1, 0.16]}>
          <cylinderGeometry args={[0.065, 0.065, 0.09, 24]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.8}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.05, 0.26]}
            end={[1.2, 2.55, 0.8]}
            active={isPartActive('vent_screen')}
          />
        )}
      </group>

      {/* 2. Maglev Micro-Turbine Compressor - Moves Backward */}
      <group
        position={[0, 0, -1.8 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('vent_turbine'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('vent_turbine'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 1.18, -0.12]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.48, 32]} />
          <meshStandardMaterial
            color={getPartColor('#f59e0b', 'vent_turbine')}
            metalness={0.88}
            roughness={0.18}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('vent_turbine', '#b45309')}
            emissiveIntensity={getPartEmissiveIntensity('vent_turbine') || 0.3}
          />
        </mesh>

        {/* Aluminum Heat Exchanger Fins */}
        {[-0.15, -0.05, 0.05, 0.15].map((fx, idx) => (
          <mesh key={`turb-fin-${idx}`} position={[fx, 1.18, -0.12]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.02, 32]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        ))}

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 1.3, -0.12]}
            end={[1.4, 1.85, -1.0]}
            active={isPartActive('vent_turbine')}
          />
        )}
      </group>

      {/* 3. High-Speed Proportional Inspiratory Valve Block - Moves Left */}
      <group
        position={[-1.6 * p, 0.4 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('vent_valves'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('vent_valves'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[-0.22, 1.18, 0.16]} castShadow>
          <boxGeometry args={[0.24, 0.38, 0.26]} />
          <meshStandardMaterial
            color={getPartColor('#06b6d4', 'vent_valves')}
            metalness={0.85}
            roughness={0.2}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('vent_valves')}
            emissiveIntensity={getPartEmissiveIntensity('vent_valves')}
          />
        </mesh>
        {/* 22mm ISO Standard Inspiratory Hose Conical Port */}
        <mesh position={[-0.22, 1.08, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.14, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[-0.22, 1.25, 0.2]}
            end={[-1.5, 1.85, 0.4]}
            active={isPartActive('vent_valves')}
          />
        )}
      </group>

      {/* 4. Active Heated Expiratory Valve & PEEP Diaphragm - Moves Right */}
      <group
        position={[1.6 * p, 0.4 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('vent_expiratory'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('vent_expiratory'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0.22, 1.18, 0.16]} castShadow>
          <boxGeometry args={[0.24, 0.38, 0.26]} />
          <meshStandardMaterial
            color={getPartColor('#10b981', 'vent_expiratory')}
            metalness={0.75}
            roughness={0.25}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('vent_expiratory')}
            emissiveIntensity={getPartEmissiveIntensity('vent_expiratory')}
          />
        </mesh>
        {/* Autoclavable Water Trap Drain Reservoir */}
        <mesh position={[0.22, 0.96, 0.22]}>
          <cylinderGeometry args={[0.055, 0.055, 0.16, 24]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.85}
            roughness={0.1}
            ior={1.48}
            thickness={0.3}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0.22, 1.25, 0.2]}
            end={[1.5, 1.85, 0.4]}
            active={isPartActive('vent_expiratory')}
          />
        )}
      </group>

      {/* 5. Medical-Grade Antimicrobial Mobile Chassis & Stand - Moves Down */}
      <group
        position={[0, -1.6 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('vent_chassis'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('vent_chassis'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Main Central Housing */}
        <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.64, 0.64, 0.48]} />
          <meshStandardMaterial
            color={getPartColor('#e2e8f0', 'vent_chassis')}
            metalness={0.25}
            roughness={0.3}
            normalMap={noiseTex}
            emissive={getPartEmissive('vent_chassis')}
            emissiveIntensity={getPartEmissiveIntensity('vent_chassis')}
          />
        </mesh>

        {/* Die-Cast Aluminum Vertical Stand Column */}
        <mesh position={[0, 0.52, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.72, 24]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} normalMap={brushedMetalTex} />
        </mesh>

        {/* Five-Star Cast Aluminum Base on Lockable Caster Wheels */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.48, 0.54, 0.12, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.35} />
        </mesh>

        {/* Medical Oxygen E-Cylinder with Brass Regulator */}
        <group position={[0, 0.62, -0.24]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.65, 24]} />
            <meshStandardMaterial color="#166534" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} />
          </mesh>
        </group>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 0.45, 0]}
            end={[-1.2, -0.15, 0.6]}
            active={isPartActive('vent_chassis')}
          />
        )}
      </group>
    </group>
  );
};
