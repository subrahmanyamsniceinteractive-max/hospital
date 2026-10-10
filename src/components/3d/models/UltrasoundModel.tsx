import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ExplodedLine } from '../ExplodedLine';
import { getUltrasoundScreenTexture, getMicroNoiseTexture, getBrushedMetalTexture } from '../materials/proceduralTextures';

interface ModelProps {
  explodedProgress: number;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  hoveredPartId: string | null;
  onHoverPart: (partId: string | null) => void;
}

export const UltrasoundModel: React.FC<ModelProps> = ({
  explodedProgress,
  selectedPartId,
  onSelectPart,
  hoveredPartId,
  onHoverPart
}) => {
  const screenTex = useMemo(() => getUltrasoundScreenTexture(), []);
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
      {/* 1. 23.8" OLED Articulating Clinical Display - Moves Up and Forward */}
      <group
        position={[0, 1.8 * p, 1.2 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('us_screen'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('us_screen'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 1.82, 0.1]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[1.05, 0.64, 0.05]} />
          <meshStandardMaterial
            color={getPartColor('#0f172a', 'us_screen')}
            metalness={0.4}
            roughness={0.2}
            emissive={getPartEmissive('us_screen')}
            emissiveIntensity={getPartEmissiveIntensity('us_screen')}
          />
        </mesh>

        {/* Photorealistic Clinical Echocardiogram & Color Flow Doppler Display */}
        <mesh position={[0, 1.82, 0.132]} rotation={[-0.15, 0, 0]}>
          <planeGeometry args={[0.98, 0.58]} />
          <meshBasicMaterial map={screenTex} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.05, 0.13]}
            end={[1.3, 2.75, 0.8]}
            active={isPartActive('us_screen')}
          />
        )}
      </group>

      {/* 2. Ergonomic Control Console & Trackball - Moves Forward */}
      <group
        position={[0, 0.4 * p, 1.4 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('us_console'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('us_console'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 1.18, 0.26]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.85, 0.08, 0.58]} />
          <meshStandardMaterial
            color={getPartColor('#e2e8f0', 'us_console')}
            metalness={0.35}
            roughness={0.28}
            normalMap={noiseTex}
            emissive={getPartEmissive('us_console')}
            emissiveIntensity={getPartEmissiveIntensity('us_console')}
          />
        </mesh>

        {/* Optical Backlit Trackball with Chrome Retainer Collar */}
        <mesh position={[0, 1.24, 0.36]}>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshStandardMaterial color="#0284c7" metalness={0.92} roughness={0.12} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 1.28, 0.36]}
            end={[-1.2, 1.85, 1.0]}
            active={isPartActive('us_console')}
          />
        )}
      </group>

      {/* 3. 256-Channel Digital Beamformer Engine - Moves Backward */}
      <group
        position={[0, 0, -1.6 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('us_beamformer'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('us_beamformer'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 0.82, -0.1]} castShadow>
          <boxGeometry args={[0.68, 0.52, 0.38]} />
          <meshStandardMaterial
            color={getPartColor('#8b5cf6', 'us_beamformer')}
            metalness={0.78}
            roughness={0.22}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('us_beamformer', '#6d28d9')}
            emissiveIntensity={getPartEmissiveIntensity('us_beamformer') || 0.25}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 0.95, -0.1]}
            end={[1.3, 1.45, -0.8]}
            active={isPartActive('us_beamformer')}
          />
        )}
      </group>

      {/* 4. Single-Crystal Piezoelectric Transducers - Moves Left */}
      <group
        position={[-1.6 * p, 0.2 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('us_probes'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('us_probes'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {[-0.09, 0.09].map((x, idx) => (
          <group key={`probe-${idx}`} position={[-0.48 + x, 1.08, 0.12]}>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.026, 0.032, 0.19, 18]} />
              <meshStandardMaterial
                color={getPartColor('#10b981', 'us_probes')}
                metalness={0.65}
                roughness={0.3}
                emissive={getPartEmissive('us_probes')}
                emissiveIntensity={getPartEmissiveIntensity('us_probes')}
              />
            </mesh>
            {/* Piezoelectric Acoustic Lens Face */}
            <mesh position={[0, 0.21, 0]}>
              <boxGeometry args={[0.075, 0.045, 0.035]} />
              <meshStandardMaterial color="#059669" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {p > 0.15 && (
          <ExplodedLine
            start={[-0.48, 1.25, 0.12]}
            end={[-1.6, 1.65, 0.3]}
            active={isPartActive('us_probes')}
          />
        )}
      </group>

      {/* 5. Mobile Hydraulic Cart Chassis & Integrated Gel Bay - Moves Down */}
      <group
        position={[0, -1.6 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('us_cart'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('us_cart'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.74, 0.52, 0.74]} />
          <meshStandardMaterial
            color={getPartColor('#64748b', 'us_cart')}
            metalness={0.5}
            roughness={0.35}
            normalMap={noiseTex}
            emissive={getPartEmissive('us_cart')}
            emissiveIntensity={getPartEmissiveIntensity('us_cart')}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 0.36, 0]}
            end={[1.2, -0.3, 0]}
            active={isPartActive('us_cart')}
          />
        )}
      </group>
    </group>
  );
};
