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

export const XRayModel: React.FC<ModelProps> = ({
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
      {/* 1. Isocentric Orbital C-Arm Arc - Moves Up */}
      <group
        position={[0, 1.5 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('carm_arc'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('carm_arc'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 1.32, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.98, 0.085, 28, 64, Math.PI * 1.25]} />
          <meshStandardMaterial
            color={getPartColor('#0284c7', 'carm_arc')}
            metalness={0.88}
            roughness={0.18}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('carm_arc')}
            emissiveIntensity={getPartEmissiveIntensity('carm_arc')}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.35, 0]}
            end={[1.4, 2.95, 0]}
            active={isPartActive('carm_arc')}
          />
        )}
      </group>

      {/* 2. Flat-Panel Digital Detector - Moves Upper Forward */}
      <group
        position={[0, 1.8 * p, 1.8 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('carm_detector'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('carm_detector'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 2.15, 0.48]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.54, 0.54, 0.13]} />
          <meshStandardMaterial
            color={getPartColor('#10b981', 'carm_detector')}
            metalness={0.82}
            roughness={0.2}
            emissive={getPartEmissive('carm_detector', '#059669')}
            emissiveIntensity={getPartEmissiveIntensity('carm_detector') || 0.3}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.15, 0.52]}
            end={[-1.4, 2.75, 1.2]}
            active={isPartActive('carm_detector')}
          />
        )}
      </group>

      {/* 3. Monoblock High-Frequency X-Ray Generator - Moves Lower Backward */}
      <group
        position={[0, -1.2 * p, -1.8 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('carm_generator'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('carm_generator'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 0.52, -0.48]} castShadow>
          <boxGeometry args={[0.48, 0.48, 0.38]} />
          <meshStandardMaterial
            color={getPartColor('#f97316', 'carm_generator')}
            metalness={0.88}
            roughness={0.18}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('carm_generator', '#ea580c')}
            emissiveIntensity={getPartEmissiveIntensity('carm_generator') || 0.3}
          />
        </mesh>
        {/* Radiation Collimator Cone */}
        <mesh position={[0, 0.76, -0.48]}>
          <cylinderGeometry args={[0.11, 0.16, 0.16, 20]} />
          <meshStandardMaterial color="#475569" metalness={0.92} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 0.52, -0.48]}
            end={[1.4, -0.18, -1.2]}
            active={isPartActive('carm_generator')}
          />
        )}
      </group>

      {/* 4. Counterbalanced Mobile Chassis Base - Moves Down */}
      <group
        position={[0, -1.6 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('carm_chassis'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('carm_chassis'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 0.36, -0.52]} castShadow receiveShadow>
          <boxGeometry args={[0.84, 0.62, 1.25]} />
          <meshStandardMaterial
            color={getPartColor('#64748b', 'carm_chassis')}
            metalness={0.52}
            roughness={0.32}
            normalMap={noiseTex}
            emissive={getPartEmissive('carm_chassis')}
            emissiveIntensity={getPartEmissiveIntensity('carm_chassis')}
          />
        </mesh>

        {/* Counterbalance Carriage Joint */}
        <mesh position={[0, 0.94, -0.32]}>
          <boxGeometry args={[0.22, 0.64, 0.44]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} normalMap={brushedMetalTex} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 0.42, -0.52]}
            end={[-1.4, -0.28, 0]}
            active={isPartActive('carm_chassis')}
          />
        )}
      </group>
    </group>
  );
};
