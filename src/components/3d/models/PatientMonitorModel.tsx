import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ExplodedLine } from '../ExplodedLine';
import { getPatientMonitorScreenTexture, getMicroNoiseTexture, getBrushedMetalTexture } from '../materials/proceduralTextures';

interface ModelProps {
  explodedProgress: number;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  hoveredPartId: string | null;
  onHoverPart: (partId: string | null) => void;
}

export const PatientMonitorModel: React.FC<ModelProps> = ({
  explodedProgress,
  selectedPartId,
  onSelectPart,
  hoveredPartId,
  onHoverPart
}) => {
  const screenTex = useMemo(() => getPatientMonitorScreenTexture(), []);
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
      {/* 1. High-Definition Touchscreen Front Assembly - Moves Forward */}
      <group
        position={[0, 0, 1.4 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('pm_screen'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('pm_screen'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Medical Polycarbonate Front Bezel with Smooth Radius */}
        <mesh position={[0, 1.25, 0.16]} castShadow>
          <boxGeometry args={[1.18, 0.78, 0.06]} />
          <meshStandardMaterial
            color={getPartColor('#0f172a', 'pm_screen')}
            metalness={0.3}
            roughness={0.2}
            emissive={getPartEmissive('pm_screen')}
            emissiveIntensity={getPartEmissiveIntensity('pm_screen')}
          />
        </mesh>

        {/* Real Photorealistic Multi-Lead Diagnostic ECG Clinical Screen Texture */}
        <mesh position={[0, 1.25, 0.192]}>
          <planeGeometry args={[1.12, 0.72]} />
          <meshBasicMaterial map={screenTex} />
        </mesh>

        {/* Top 360-degree Alarm Light Beacon Lens */}
        <mesh position={[0, 1.68, 0.02]}>
          <boxGeometry args={[0.35, 0.07, 0.14]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Ergonomic Molded Top Carry Handle */}
        <mesh position={[0, 1.76, -0.05]} castShadow>
          <boxGeometry args={[0.42, 0.08, 0.12]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 1.45, 0.19]}
            end={[1.2, 1.95, 0.8]}
            active={isPartActive('pm_screen')}
          />
        )}
      </group>

      {/* 2. Isolated Real-Time DSP Processing Motherboard - Moves Backward */}
      <group
        position={[0, 0, -1.4 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('pm_cpu'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('pm_cpu'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Multilayer Green FR4 Motherboard with Gold Contacts */}
        <mesh position={[0, 1.25, -0.06]} castShadow>
          <boxGeometry args={[1.05, 0.68, 0.04]} />
          <meshStandardMaterial
            color={getPartColor('#10b981', 'pm_cpu')}
            metalness={0.75}
            roughness={0.28}
            normalMap={noiseTex}
            emissive={getPartEmissive('pm_cpu', '#059669')}
            emissiveIntensity={getPartEmissiveIntensity('pm_cpu') || 0.2}
          />
        </mesh>

        {/* BGA Processor Heat Sink with Extruded Aluminum Fins */}
        <mesh position={[0.18, 1.25, -0.01]} castShadow>
          <boxGeometry args={[0.26, 0.26, 0.06]} />
          <meshStandardMaterial color="#334155" metalness={0.92} normalMap={brushedMetalTex} />
        </mesh>

        {/* Shielded SMD Capacitors & Transformers */}
        {[-0.3, -0.15, 0.35].map((cx, idx) => (
          <mesh key={`cap-${idx}`} position={[cx, 1.4, -0.02]}>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        ))}

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 1.45, -0.06]}
            end={[-1.2, 1.95, -0.8]}
            active={isPartActive('pm_cpu')}
          />
        )}
      </group>

      {/* 3. NIBP Blood Pressure Micro-Pump & Solenoid Manifold - Moves Left */}
      <group
        position={[-1.4 * p, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('pm_nibp'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('pm_nibp'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Brass Valve Block and DC Micro-Pump */}
        <mesh position={[-0.38, 1.25, 0]} castShadow>
          <boxGeometry args={[0.28, 0.38, 0.22]} />
          <meshStandardMaterial
            color={getPartColor('#f59e0b', 'pm_nibp')}
            metalness={0.75}
            roughness={0.22}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('pm_nibp')}
            emissiveIntensity={getPartEmissiveIntensity('pm_nibp')}
          />
        </mesh>

        {/* Quick-Click NIBP Metal Luer Coupler */}
        <mesh position={[-0.53, 1.18, 0.09]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[-0.38, 1.4, 0]}
            end={[-1.4, 1.75, 0]}
            active={isPartActive('pm_nibp')}
          />
        )}
      </group>

      {/* 4. Hot-Swappable Parameter Measurement Bay - Moves Right */}
      <group
        position={[1.4 * p, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('pm_module_bay'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('pm_module_bay'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0.38, 1.25, 0]} castShadow>
          <boxGeometry args={[0.3, 0.6, 0.24]} />
          <meshStandardMaterial
            color={getPartColor('#8b5cf6', 'pm_module_bay')}
            metalness={0.45}
            roughness={0.35}
            emissive={getPartEmissive('pm_module_bay')}
            emissiveIntensity={getPartEmissiveIntensity('pm_module_bay')}
          />
        </mesh>

        {/* Defibrillation-Proof Isolated Patient Cable Sockets */}
        {[-0.18, 0, 0.18].map((y, idx) => (
          <mesh key={`socket-${idx}`} position={[0.54, 1.25 + y, 0.06]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.038, 0.038, 0.05, 18]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        ))}

        {p > 0.15 && (
          <ExplodedLine
            start={[0.38, 1.5, 0]}
            end={[1.4, 1.75, 0]}
            active={isPartActive('pm_module_bay')}
          />
        )}
      </group>

      {/* Cast Aluminum Bedside Articulated Mounting Bracket */}
      <mesh position={[0, 0.65, -0.22]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.85, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.88} normalMap={brushedMetalTex} />
      </mesh>
    </group>
  );
};
