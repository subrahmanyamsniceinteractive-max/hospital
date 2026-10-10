import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ExplodedLine } from '../ExplodedLine';
import { getMicroNoiseTexture, getBrushedMetalTexture } from '../materials/proceduralTextures';

interface ModelProps {
  explodedProgress: number;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  hoveredPartId: string | null;
  onHoverPart: (partId: string | null) => void;
}

export const CTModel: React.FC<ModelProps> = ({
  explodedProgress,
  selectedPartId,
  onSelectPart,
  hoveredPartId,
  onHoverPart
}) => {
  const rotatingDrumRef = useRef<THREE.Group>(null);
  const noiseTex = useMemo(() => getMicroNoiseTexture(), []);
  const brushedMetalTex = useMemo(() => getBrushedMetalTexture(), []);

  const p = explodedProgress;

  useFrame((_, delta) => {
    if (rotatingDrumRef.current) {
      const speed = p > 0.5 ? 0.4 : 2.8;
      rotatingDrumRef.current.rotation.z += delta * speed;
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
      {/* 1. Gantry Aerodynamic Housing - Slides Forward */}
      <group
        position={[0, 0, 2.8 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('ct_cover'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('ct_cover'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 1.42, 0.42]} castShadow receiveShadow>
          <boxGeometry args={[2.45, 2.25, 0.75]} />
          <meshStandardMaterial
            color={getPartColor('#f8fafc', 'ct_cover')}
            metalness={0.12}
            roughness={0.22}
            normalMap={noiseTex}
            emissive={getPartEmissive('ct_cover')}
            emissiveIntensity={getPartEmissiveIntensity('ct_cover')}
          />
        </mesh>

        {/* Central Beveled Bore Funnel Ring */}
        <mesh position={[0, 1.42, 0.8]}>
          <ringGeometry args={[0.55, 0.88, 64]} />
          <meshStandardMaterial
            color={getPartColor('#0284c7', 'ct_cover')}
            metalness={0.6}
            roughness={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Dual Technician Control Tablets with Laser Aimer Buttons */}
        {[-0.9, 0.9].map((tx, idx) => (
          <mesh key={`ct-screen-${idx}`} position={[tx, 2.12, 0.81]}>
            <planeGeometry args={[0.36, 0.24]} />
            <meshBasicMaterial color="#0ea5e9" />
          </mesh>
        ))}

        {p > 0.15 && (
          <ExplodedLine
            start={[0.9, 2.12, 0.81]}
            end={[1.8, 2.85, 1.2]}
            active={isPartActive('ct_cover')}
          />
        )}
      </group>

      {/* 2. Direct-Drive Rotating Drum Gantry Rotor - Moves Backward */}
      <group
        ref={rotatingDrumRef}
        position={[0, 0, -2.5 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('ct_drum'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('ct_drum'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.08, 1.08, 0.52, 64, 1, true]} />
          <meshStandardMaterial
            color={getPartColor('#0284c7', 'ct_drum')}
            metalness={0.88}
            roughness={0.18}
            normalMap={brushedMetalTex}
            wireframe={p > 0.3}
            side={THREE.DoubleSide}
            emissive={getPartEmissive('ct_drum')}
            emissiveIntensity={getPartEmissiveIntensity('ct_drum')}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.5, 0]}
            end={[1.8, 3.05, -1.5]}
            active={isPartActive('ct_drum')}
          />
        )}
      </group>

      {/* 3. Dual Straton Liquid-Cooled X-Ray Tubes - Moves Upper Left */}
      <group
        position={[-2.4 * p, 1.2 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('ct_tubes'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('ct_tubes'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[-0.42, 2.15, 0]} castShadow>
          <boxGeometry args={[0.54, 0.44, 0.42]} />
          <meshStandardMaterial
            color={getPartColor('#f97316', 'ct_tubes')}
            metalness={0.88}
            roughness={0.18}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('ct_tubes', '#ea580c')}
            emissiveIntensity={getPartEmissiveIntensity('ct_tubes') || 0.4}
          />
        </mesh>
        {/* Heavy Oil Heat Exchanger Radiator */}
        <mesh position={[-0.42, 2.42, 0]}>
          <boxGeometry args={[0.38, 0.12, 0.32]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[-0.42, 2.15, 0]}
            end={[-2.0, 2.95, 0]}
            active={isPartActive('ct_tubes')}
          />
        )}
      </group>

      {/* 4. Ultrafast Ceramic Stellar Multi-Row Detectors - Moves Lower Right */}
      <group
        position={[2.4 * p, -1.2 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('ct_detectors'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('ct_detectors'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0.42, 0.72, 0]} rotation={[0, 0, 0.38]} castShadow>
          <boxGeometry args={[0.65, 0.28, 0.44]} />
          <meshStandardMaterial
            color={getPartColor('#10b981', 'ct_detectors')}
            metalness={0.78}
            roughness={0.22}
            emissive={getPartEmissive('ct_detectors', '#059669')}
            emissiveIntensity={getPartEmissiveIntensity('ct_detectors') || 0.3}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0.42, 0.72, 0]}
            end={[2.2, 0.25, 0]}
            active={isPartActive('ct_detectors')}
          />
        )}
      </group>

      {/* 5. Optical Contactless Gigabit Slip Ring - Moves Up */}
      <group
        position={[0, 2.3 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('ct_slip_ring'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('ct_slip_ring'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 1.42, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.12, 0.065, 28, 64]} />
          <meshStandardMaterial
            color={getPartColor('#6366f1', 'ct_slip_ring')}
            metalness={0.92}
            roughness={0.14}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('ct_slip_ring', '#4f46e5')}
            emissiveIntensity={getPartEmissiveIntensity('ct_slip_ring') || 0.3}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.55, -0.22]}
            end={[-1.6, 3.25, 0]}
            active={isPartActive('ct_slip_ring')}
          />
        )}
      </group>

      {/* 6. Cantilevered Motorized Carbon Fiber Couch - Moves Down and Out */}
      <group
        position={[0, -1.8 * p, 2.0 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('ct_table'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('ct_table'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 0.46, 1.85]} castShadow receiveShadow>
          <boxGeometry args={[0.74, 0.74, 2.05]} />
          <meshStandardMaterial
            color={getPartColor('#94a3b8', 'ct_table')}
            metalness={0.35}
            roughness={0.38}
            normalMap={noiseTex}
            emissive={getPartEmissive('ct_table')}
            emissiveIntensity={getPartEmissiveIntensity('ct_table')}
          />
        </mesh>

        {/* Curved Carbon Fiber Scanned Deck */}
        <mesh position={[0, 0.92, 1.15]} castShadow>
          <boxGeometry args={[0.62, 0.08, 2.55]} />
          <meshStandardMaterial color="#0f172a" metalness={0.65} roughness={0.25} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 0.92, 1.85]}
            end={[1.4, 0.15, 2.2]}
            active={isPartActive('ct_table')}
          />
        )}
      </group>
    </group>
  );
};
