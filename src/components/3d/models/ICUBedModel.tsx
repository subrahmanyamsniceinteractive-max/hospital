import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ExplodedLine } from '../ExplodedLine';
import { getMicroNoiseTexture, getBrushedMetalTexture } from '../materials/proceduralTextures';

interface ModelProps {
  explodedProgress: number;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  hoveredPartId: string | null;
  onHoverPart: (partId: string | null) => void;
}

export const ICUBedModel: React.FC<ModelProps> = ({
  explodedProgress,
  selectedPartId,
  onSelectPart,
  hoveredPartId,
  onHoverPart
}) => {
  const noiseTex = useMemo(() => getMicroNoiseTexture(), []);
  const brushedMetalTex = useMemo(() => getBrushedMetalTexture(), []);

  const p = explodedProgress;
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
      {/* 1. Pneumatic Microclimate Mattress - Moves Up */}
      <group
        position={[0, 1.8 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('bed_mattress'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('bed_mattress'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 0.98, 0]} castShadow>
          <boxGeometry args={[1.04, 0.19, 2.24]} />
          <meshStandardMaterial
            color={getPartColor('#38bdf8', 'bed_mattress')}
            metalness={0.15}
            roughness={0.55}
            normalMap={noiseTex}
            emissive={getPartEmissive('bed_mattress')}
            emissiveIntensity={getPartEmissiveIntensity('bed_mattress')}
          />
        </mesh>
        {/* Memory Foam Pillow */}
        <mesh position={[0, 1.1, -0.78]} castShadow>
          <boxGeometry args={[0.72, 0.09, 0.46]} />
          <meshStandardMaterial color="#ffffff" roughness={0.75} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 1.15, 0]}
            end={[1.4, 2.35, 0]}
            active={isPartActive('bed_mattress')}
          />
        )}
      </group>

      {/* 2. Radiolucent Articulating Deck - Stays or slightly lifts */}
      <group
        position={[0, 0.4 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('bed_deck'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('bed_deck'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.08, 0.08, 2.28]} />
          <meshStandardMaterial
            color={getPartColor('#e2e8f0', 'bed_deck')}
            metalness={0.4}
            roughness={0.3}
            normalMap={noiseTex}
            emissive={getPartEmissive('bed_deck')}
            emissiveIntensity={getPartEmissiveIntensity('bed_deck')}
          />
        </mesh>

        {/* Molded Polycarbonate Headboard and Footboard */}
        <mesh position={[0, 1.15, -1.18]} castShadow>
          <boxGeometry args={[1.14, 0.64, 0.08]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 1.05, 1.18]} castShadow>
          <boxGeometry args={[1.14, 0.48, 0.08]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.2} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 0.82, 0.8]}
            end={[-1.4, 1.55, 0.8]}
            active={isPartActive('bed_deck')}
          />
        )}
      </group>

      {/* 3. Electric Linear Actuators & Heavy Steel Base - Moves Down */}
      <group
        position={[0, -1.6 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('bed_actuators'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('bed_actuators'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.94, 0.48, 1.85]} />
          <meshStandardMaterial
            color={getPartColor('#475569', 'bed_actuators')}
            metalness={0.72}
            roughness={0.28}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('bed_actuators')}
            emissiveIntensity={getPartEmissiveIntensity('bed_actuators')}
          />
        </mesh>

        {/* Dual High-Torque Linear Actuator Chrome Pistons */}
        {[-0.52, 0.52].map((z, idx) => (
          <mesh key={`piston-${idx}`} position={[0, 0.68, z]}>
            <cylinderGeometry args={[0.055, 0.055, 0.32, 20]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.92} roughness={0.15} />
          </mesh>
        ))}

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 0.42, 0]}
            end={[-1.4, -0.38, 0]}
            active={isPartActive('bed_actuators')}
          />
        )}
      </group>

      {/* 4. Split Siderails with Nursing LCD Consoles - Moves Right */}
      <group
        position={[1.8 * p, 0.6 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('bed_siderails'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('bed_siderails'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0.58, 1.02, -0.32]} castShadow>
          <boxGeometry args={[0.07, 0.32, 0.85]} />
          <meshStandardMaterial
            color={getPartColor('#94a3b8', 'bed_siderails')}
            metalness={0.3}
            roughness={0.38}
            emissive={getPartEmissive('bed_siderails')}
            emissiveIntensity={getPartEmissiveIntensity('bed_siderails')}
          />
        </mesh>

        {/* Nurse Graphic Control Touchscreen */}
        <mesh position={[0.62, 1.02, -0.32]}>
          <planeGeometry args={[0.22, 0.13]} />
          <meshBasicMaterial color="#0ea5e9" side={THREE.DoubleSide} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0.62, 1.02, -0.32]}
            end={[1.6, 1.85, -0.32]}
            active={isPartActive('bed_siderails')}
          />
        )}
      </group>
    </group>
  );
};
