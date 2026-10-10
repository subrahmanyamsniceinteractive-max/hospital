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

export const SurgicalRobotModel: React.FC<ModelProps> = ({
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
      {/* 1. 4x Articulated Multi-Joint Manipulator Arms - Moves Up and Forward */}
      <group
        position={[0, 1.2 * p, 1.8 * p]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('robot_arms'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('robot_arms'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* Overhead Gantry Boom with Brush Aluminum Finish */}
        <mesh position={[0, 2.25, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.085, 0.085, 1.45, 24]} />
          <meshStandardMaterial
            color={getPartColor('#0ea5e9', 'robot_arms')}
            metalness={0.88}
            roughness={0.18}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('robot_arms')}
            emissiveIntensity={getPartEmissiveIntensity('robot_arms')}
          />
        </mesh>

        {/* 4 Articulated 7-DOF Robotic Manipulator Arms */}
        {[-0.52, -0.17, 0.17, 0.52].map((x, idx) => (
          <group key={`rob-arm-${idx}`} position={[x, 2.15, 0]}>
            {/* Shoulder Servo Joint with LED Optical Encoder Ring */}
            <mesh position={[0, -0.05, 0]} castShadow>
              <sphereGeometry args={[0.065, 24, 24]} />
              <meshStandardMaterial
                color="#0284c7"
                metalness={0.9}
                roughness={0.15}
                emissive="#06b6d4"
                emissiveIntensity={0.6}
              />
            </mesh>
            {/* Carbon-Fiber Bicep Segment */}
            <mesh position={[0, -0.38, 0.22]} rotation={[0.42, 0, (idx - 1.5) * 0.12]} castShadow>
              <cylinderGeometry args={[0.038, 0.038, 0.68, 16]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.6} roughness={0.25} />
            </mesh>
            {/* Elbow Articulation */}
            <mesh position={[0, -0.7, 0.38]} castShadow>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            {/* Forearm Segment */}
            <mesh position={[0, -0.92, 0.5]} rotation={[-0.32, 0, (idx - 1.5) * 0.12]} castShadow>
              <cylinderGeometry args={[0.028, 0.028, 0.62, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.85} normalMap={brushedMetalTex} />
            </mesh>
          </group>
        ))}

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 2.35, 0]}
            end={[1.5, 3.05, 0.8]}
            active={isPartActive('robot_arms')}
          />
        )}
      </group>

      {/* 2. EndoWrist Micro-Articulated Instruments - Moves Left */}
      <group
        position={[-2.0 * p, 0.4 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('robot_endowrist'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('robot_endowrist'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[-0.32, 1.05, 0.52]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.75, 16]} />
          <meshStandardMaterial
            color={getPartColor('#f97316', 'robot_endowrist')}
            metalness={0.92}
            roughness={0.12}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('robot_endowrist')}
            emissiveIntensity={getPartEmissiveIntensity('robot_endowrist')}
          />
        </mesh>
        {/* Micro-Articulated Forceps Jaw with Nitinol Tendon Linkage */}
        <mesh position={[-0.32, 0.68, 0.58]} castShadow>
          <boxGeometry args={[0.032, 0.07, 0.032]} />
          <meshStandardMaterial color="#ea580c" metalness={0.95} roughness={0.1} />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[-0.32, 1.25, 0.52]}
            end={[-1.6, 1.85, 0.5]}
            active={isPartActive('robot_endowrist')}
          />
        )}
      </group>

      {/* 3. Motorized Patient Cart Base & Telescoping Mast - Moves Down */}
      <group
        position={[0, -1.6 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('robot_column'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('robot_column'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        {/* High-Mass Heavy Stability Base Cart (800kg cast iron ballast) */}
        <mesh position={[0, 0.38, -0.22]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.65, 1.05]} />
          <meshStandardMaterial
            color={getPartColor('#475569', 'robot_column')}
            metalness={0.6}
            roughness={0.3}
            normalMap={noiseTex}
            emissive={getPartEmissive('robot_column')}
            emissiveIntensity={getPartEmissiveIntensity('robot_column')}
          />
        </mesh>

        {/* Telescoping Vertical Column with Hydraulic Seals */}
        <mesh position={[0, 1.35, -0.22]} castShadow>
          <boxGeometry args={[0.38, 1.55, 0.38]} />
          <meshStandardMaterial
            color="#f1f5f9"
            metalness={0.5}
            roughness={0.2}
            normalMap={brushedMetalTex}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0, 0.55, -0.22]}
            end={[1.4, 0.25, -0.8]}
            active={isPartActive('robot_column')}
          />
        )}
      </group>

      {/* 4. 3D High-Definition Optical Vision Tower - Moves Right */}
      <group
        position={[2.0 * p, 0.4 * p, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart('robot_optics'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHoverPart('robot_optics'); }}
        onPointerOut={() => onHoverPart(null)}
      >
        <mesh position={[0.32, 1.25, 0.52]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.026, 0.026, 0.75, 16]} />
          <meshStandardMaterial
            color={getPartColor('#a855f7', 'robot_optics')}
            metalness={0.82}
            roughness={0.18}
            normalMap={brushedMetalTex}
            emissive={getPartEmissive('robot_optics')}
            emissiveIntensity={getPartEmissiveIntensity('robot_optics')}
          />
        </mesh>

        {/* Dual 4K CMOS Stereoscopic Optical Lenses */}
        <mesh position={[0.32, 0.88, 0.58]}>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.9}
            roughness={0.05}
            ior={1.6}
            emissive="#38bdf8"
            emissiveIntensity={0.6}
          />
        </mesh>

        {p > 0.15 && (
          <ExplodedLine
            start={[0.32, 1.25, 0.52]}
            end={[1.6, 1.85, 0.5]}
            active={isPartActive('robot_optics')}
          />
        )}
      </group>
    </group>
  );
};
