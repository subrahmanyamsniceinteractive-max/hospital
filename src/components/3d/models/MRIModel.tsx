import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ExplodedLine } from '../ExplodedLine';
import { getMicroNoiseTexture, getBrushedMetalTexture } from '../materials/proceduralTextures';

interface ModelProps {
  explodedProgress: number; // 0.0 to 1.0
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  hoveredPartId: string | null;
  onHoverPart: (partId: string | null) => void;
}

export const MRIModel: React.FC<ModelProps> = ({
  explodedProgress,
  selectedPartId,
  onSelectPart,
  hoveredPartId,
  onHoverPart
}) => {
  const boreGlowRef = useRef<THREE.PointLight>(null);
  const noiseTex = useMemo(() => getMicroNoiseTexture(), []);
  const brushedMetalTex = useMemo(() => getBrushedMetalTexture(), []);

  useFrame((state) => {
    if (boreGlowRef.current) {
      boreGlowRef.current.intensity = 1.4 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

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
      {/* 1. OUTER CASING & SHROUD - Slides forward */}
      <group
        position={[0, 0, 2.8 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('mri_casing'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('mri_casing'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Aerodynamic Front Facade Ring with Ergonomic Flared Bore Entry */}
        <mesh position={[0, 1.42, 0.95]} castShadow receiveShadow>
          <torusGeometry args={[0.92, 0.32, 36, 72]} />
          <meshStandardMaterial
            color={getPartColor('#f8fafc', 'mri_casing')}
            metalness={0.12}
            roughness={0.22}
            normalMap={noiseTex}
            normalScale={new THREE.Vector2(0.02, 0.02)}
            emissive={getPartEmissive('mri_casing')}
            emissiveIntensity={getPartEmissiveIntensity('mri_casing')}
          />
        </mesh>

        {/* Outer Cylindrical Composite Shell */}
        <mesh position={[0, 1.42, 0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.28, 1.28, 1.25, 64, 1, true]} />
          <meshStandardMaterial
            color={getPartColor('#f1f5f9', 'mri_casing')}
            metalness={0.1}
            roughness={0.25}
            side={THREE.DoubleSide}
            normalMap={noiseTex}
            emissive={getPartEmissive('mri_casing')}
            emissiveIntensity={getPartEmissiveIntensity('mri_casing')}
          />
        </mesh>

        {/* Sculpted Base Pedestal Shell */}
        <mesh position={[0, 0.42, 0.3]} castShadow receiveShadow>
          <boxGeometry args={[2.55, 0.84, 1.65]} />
          <meshStandardMaterial
            color={getPartColor('#e2e8f0', 'mri_casing')}
            metalness={0.2}
            roughness={0.3}
            emissive={getPartEmissive('mri_casing')}
            emissiveIntensity={getPartEmissiveIntensity('mri_casing')}
          />
        </mesh>

        {/* Dual Ergonomic Integrated Technician Touchpads on Gantry Shoulders */}
        {[-1.0, 1.0].map((tx, idx) => (
          <group key={`mri-touch-${idx}`} position={[tx, 1.95, 0.95]}>
            <mesh rotation={[-0.2, (idx === 0 ? 0.3 : -0.3), 0]}>
              <boxGeometry args={[0.28, 0.18, 0.02]} />
              <meshStandardMaterial color="#0284c7" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* 3D Callout Line when exploded */}
        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.05, 0.95]}
            end={[1.5, 2.6, 1.5]}
            active={isPartActive('mri_casing')}
          />
        )}
      </group>

      {/* 2. LIQUID HELIUM CRYOSTAT DEWAR VESSEL - Expands Upward */}
      <group
        position={[0, 2.2 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('mri_cryostat'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('mri_cryostat'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Double-Walled Stainless Steel Vacuum Vessel */}
        <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.18, 1.18, 1.55, 64, 1, false]} />
          <meshStandardMaterial
            color={getPartColor('#38bdf8', 'mri_cryostat')}
            metalness={0.88}
            roughness={0.16}
            normalMap={brushedMetalTex}
            transparent
            opacity={p > 0.05 ? 0.85 : 0.4}
            emissive={getPartEmissive('mri_cryostat', '#0284c7')}
            emissiveIntensity={getPartEmissiveIntensity('mri_cryostat') || (p > 0.1 ? 0.25 : 0)}
          />
        </mesh>

        {/* 4K Coldhead Re-condenser Dome on top of Cryostat */}
        <mesh position={[0, 2.72, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.45, 32]} />
          <meshStandardMaterial color="#0284c7" metalness={0.92} roughness={0.12} normalMap={brushedMetalTex} />
        </mesh>

        {/* Cryogenic Quench Vent Stack & Relief Valve Flanges */}
        <mesh position={[0.42, 2.68, 0.2]} rotation={[0, 0, 0.35]}>
          <cylinderGeometry args={[0.045, 0.045, 0.65, 18]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.8, 0]}
            end={[-1.5, 3.3, 0]}
            active={isPartActive('mri_cryostat')}
          />
        )}
      </group>

      {/* 3. 3.0T SUPERCONDUCTING MAGNET SOLENOID - Moves Backward */}
      <group
        position={[0, 0, -2.5 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('mri_magnet'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('mri_magnet'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Niobium-Titanium Solenoid Winding Coil Bundles in Copper Matrix */}
        {[-0.55, -0.25, 0.05, 0.35, 0.6].map((zPos, idx) => (
          <mesh key={`nb-coil-${idx}`} position={[0, 1.42, zPos]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.96, 0.09, 28, 64]} />
            <meshStandardMaterial
              color={getPartColor('#f59e0b', 'mri_magnet')}
              metalness={0.92}
              roughness={0.15}
              normalMap={brushedMetalTex}
              emissive={getPartEmissive('mri_magnet', '#b45309')}
              emissiveIntensity={getPartEmissiveIntensity('mri_magnet') || (p > 0.1 ? 0.35 : 0)}
            />
          </mesh>
        ))}

        {/* Structural Aluminum Magnet Cage Frame */}
        <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.06, 1.06, 1.45, 36, 1, true]} />
          <meshStandardMaterial
            color={getPartColor('#b45309', 'mri_magnet')}
            wireframe
            transparent
            opacity={0.65}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.25, 0]}
            end={[1.8, 2.85, -1.5]}
            active={isPartActive('mri_magnet')}
          />
        )}
      </group>

      {/* 4. 3-AXIS GRADIENT COIL ASSEMBLY - Moves Left */}
      <group
        position={[-2.6 * p, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('mri_gradient'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('mri_gradient'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Direct Water-Cooled Cylinder */}
        <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.83, 0.83, 1.58, 48, 1, true]} />
          <meshStandardMaterial
            color={getPartColor('#06b6d4', 'mri_gradient')}
            metalness={0.82}
            roughness={0.22}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('mri_gradient')}
            emissiveIntensity={getPartEmissiveIntensity('mri_gradient')}
          />
        </mesh>

        {/* Copper Saddle Conductor Windings (Golay Coils) */}
        {[-0.45, 0, 0.45].map((z, idx) => (
          <mesh key={`saddle-coil-${idx}`} position={[0, 1.42, z]} rotation={[0, 0, (Math.PI / 4) * idx]}>
            <torusGeometry args={[0.84, 0.035, 18, 48]} />
            <meshStandardMaterial color="#e07a5f" metalness={0.92} roughness={0.12} normalMap={brushedMetalTex} />
          </mesh>
        ))}

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.25, 0]}
            end={[-1.8, 2.85, 0]}
            active={isPartActive('mri_gradient')}
          />
        )}
      </group>

      {/* 5. RF BODY TRANSMIT/RECEIVE BIRDCAGE COIL - Moves Right */}
      <group
        position={[2.6 * p, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('mri_rf_coil'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('mri_rf_coil'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* 16 Birdcage Copper Rungs */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const r = 0.66;
          const x = Math.cos(angle) * r;
          const y = 1.42 + Math.sin(angle) * r;
          return (
            <mesh key={`birdcage-${i}`} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 1.52, 12]} />
              <meshStandardMaterial
                color={getPartColor('#10b981', 'mri_rf_coil')}
                metalness={0.9}
                roughness={0.18}
                emissive={getPartEmissive('mri_rf_coil')}
                emissiveIntensity={getPartEmissiveIntensity('mri_rf_coil')}
              />
            </mesh>
          );
        })}

        {/* Dual End Ring Resonators with Capacitive Tuning Chips */}
        {[-0.76, 0.76].map((z, idx) => (
          <mesh key={`rf-ring-${idx}`} position={[0, 1.42, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.66, 0.028, 18, 48]} />
            <meshStandardMaterial color="#10b981" metalness={0.9} roughness={0.18} />
          </mesh>
        ))}

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.25, 0]}
            end={[1.8, 2.85, 0]}
            active={isPartActive('mri_rf_coil')}
          />
        )}
      </group>

      {/* 6. MOTORIZED CARBON FIBER PATIENT COUCH - Moves Down and Out */}
      <group
        position={[0, -1.8 * p, 2.2 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('mri_table'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('mri_table'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Cantilevered Table Base Pedestal */}
        <mesh position={[0, 0.42, 1.8]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 0.72, 2.25]} />
          <meshStandardMaterial
            color={getPartColor('#94a3b8', 'mri_table')}
            metalness={0.35}
            roughness={0.35}
            normalMap={noiseTex}
            emissive={getPartEmissive('mri_table')}
            emissiveIntensity={getPartEmissiveIntensity('mri_table')}
          />
        </mesh>

        {/* Lightweight Carbon Fiber Couch Deck */}
        <mesh position={[0, 0.88, 1.3]} castShadow receiveShadow>
          <boxGeometry args={[0.68, 0.08, 2.85]} />
          <meshStandardMaterial
            color={getPartColor('#1e293b', 'mri_table')}
            metalness={0.65}
            roughness={0.25}
            emissive={getPartEmissive('mri_table')}
            emissiveIntensity={getPartEmissiveIntensity('mri_table')}
          />
        </mesh>

        {/* Ergonomic Sanitary Mattress Cushion */}
        <mesh position={[0, 0.96, 1.3]} castShadow>
          <boxGeometry args={[0.62, 0.08, 2.65]} />
          <meshStandardMaterial color="#e0e7ff" roughness={0.65} />
        </mesh>

        {/* Detachable 64-Channel Neuro Head Matrix Coil Cradle */}
        <mesh position={[0, 1.06, 0.22]} castShadow>
          <boxGeometry args={[0.36, 0.14, 0.38]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.3} roughness={0.3} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 0.95, 2.2]}
            end={[1.2, 0.25, 2.8]}
            active={isPartActive('mri_table')}
          />
        )}
      </group>

      {/* 7. BORE CIRCADIAN LED COMFORT HALO - Moves Up and Forward */}
      <group
        position={[0, 1.8 * p, 1.5 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('mri_bore_light'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('mri_bore_light'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0, 1.42, 0.72]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.56, 0.045, 28, 64]} />
          <meshStandardMaterial
            color={getPartColor('#a855f7', 'mri_bore_light')}
            emissive="#a855f7"
            emissiveIntensity={0.9}
            toneMapped={false}
          />
        </mesh>

        <pointLight
          ref={boreGlowRef}
          position={[0, 1.42, 0]}
          color="#38bdf8"
          distance={4.5}
          decay={2}
          intensity={1.4}
        />

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 1.85, 0.72]}
            end={[-1.2, 2.65, 1.2]}
            active={isPartActive('mri_bore_light')}
          />
        )}
      </group>
    </group>
  );
};
