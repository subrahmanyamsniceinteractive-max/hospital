import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  getAPRoadTexture,
  getRedSoilTexture,
  getMangaloreTileTexture,
  getLimestoneWashTexture,
  getCoconutBarkTexture,
  getBananaLeafTexture,
  getTinRoofTexture,
  getPaddyFieldTexture,
  getMicroNoiseTexture,
  getBrushedMetalTexture,
  getTireTreadTexture
} from '../materials/proceduralTextures';
import { TimeOfDay } from '../../../types/hospital';

interface IndianVillageProps {
  timeOfDay: TimeOfDay;
}

/**
 * Road centerline curve X coordinate at given Z
 * Winding rural road from Z=160 to Z=24
 */
const getVillageRoadX = (z: number) => {
  return Math.sin((z - 20) * 0.042) * 4.2;
};

/**
 * Animated Andhra Village Walking Pedestrian with Full Multi-Joint Biomechanics
 * Models natural walking cycle: articulated hip joints, bending knees during recovery swing,
 * ankle push-off, opposing arm swings with elbow flexion, and realistic cotton attire.
 */
const AndhraVillagePedestrian: React.FC<{
  startZ: number;
  endZ: number;
  roadSide: 'left' | 'right';
  speed: number;
  type: 'farmer' | 'woman';
  color: string;
}> = ({ startZ, endZ, roadSide, speed, type, color }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftThighRef = useRef<THREE.Group>(null);
  const leftShinRef = useRef<THREE.Group>(null);
  const rightThighRef = useRef<THREE.Group>(null);
  const rightShinRef = useRef<THREE.Group>(null);
  const leftUpperArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightUpperArmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);

  const currentZ = useRef(startZ);
  const direction = useRef(startZ > endZ ? -1 : 1);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    currentZ.current += direction.current * speed * delta;
    if (direction.current > 0 && currentZ.current >= Math.max(startZ, endZ)) {
      direction.current = -1;
    } else if (direction.current < 0 && currentZ.current <= Math.min(startZ, endZ)) {
      direction.current = 1;
    }

    const z = currentZ.current;
    const roadX = getVillageRoadX(z);
    const x = roadX + (roadSide === 'left' ? -4.5 : 4.5);

    // Natural walking oscillation with vertical pelvis bob
    const gaitPhase = currentZ.current * 4.6;
    const pelvisBob = Math.abs(Math.sin(gaitPhase)) * 0.035;
    groupRef.current.position.set(x, pelvisBob, z);
    groupRef.current.rotation.y = direction.current < 0 ? Math.PI : 0;

    // Multi-joint leg biomechanics with functional knee bending
    const legPhase = Math.sin(gaitPhase);
    const leftThighAngle = legPhase * 0.44;
    const rightThighAngle = -legPhase * 0.44;
    const leftKneeAngle = Math.max(0, -legPhase) * 0.65;
    const rightKneeAngle = Math.max(0, legPhase) * 0.65;

    if (leftThighRef.current) leftThighRef.current.rotation.x = leftThighAngle;
    if (leftShinRef.current) leftShinRef.current.rotation.x = leftKneeAngle;
    if (rightThighRef.current) rightThighRef.current.rotation.x = rightThighAngle;
    if (rightShinRef.current) rightShinRef.current.rotation.x = rightKneeAngle;

    // Opposing arm swings with elbow flex
    const armPhase = -legPhase;
    const leftArmAngle = armPhase * 0.36;
    const rightArmAngle = -armPhase * 0.36;
    const leftElbowAngle = Math.max(0, armPhase) * 0.28;
    const rightElbowAngle = Math.max(0, -armPhase) * 0.28;

    if (leftUpperArmRef.current) leftUpperArmRef.current.rotation.x = leftArmAngle;
    if (leftForearmRef.current) leftForearmRef.current.rotation.x = leftElbowAngle;
    if (rightUpperArmRef.current) rightUpperArmRef.current.rotation.x = rightArmAngle;
    if (rightForearmRef.current) rightForearmRef.current.rotation.x = rightElbowAngle;
  });

  return (
    <group ref={groupRef}>
      {/* Torso & Upper Body with Realistic Cotton Textile Attire */}
      <mesh position={[0, 1.14, 0]} castShadow>
        <boxGeometry args={[0.38, 0.52, 0.22]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>

      {/* Anatomical Head, Hair & Attire Details */}
      <group position={[0, 1.54, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.125, 16, 16]} />
          <meshStandardMaterial color="#8d5524" roughness={0.55} />
        </mesh>

        {type === 'farmer' ? (
          <>
            <mesh position={[0.18, -0.22, 0]} castShadow>
              <boxGeometry args={[0.12, 0.38, 0.24]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.13, 0.1, 14]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[0, 0.04, -0.07]} castShadow>
              <sphereGeometry args={[0.13, 14, 14]} />
              <meshStandardMaterial color="#171717" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.04, -0.1]}>
              <torusGeometry args={[0.07, 0.022, 10, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
            <group position={[0.26, -0.32, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.17, 16, 16]} />
                <meshStandardMaterial color="#eab308" metalness={0.75} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0.14, 0]}>
                <cylinderGeometry args={[0.09, 0.11, 0.07, 14]} />
                <meshStandardMaterial color="#eab308" metalness={0.75} roughness={0.25} />
              </mesh>
            </group>
          </>
        )}
      </group>

      {/* Articulated Left Leg (Hip Joint -> Thigh -> Knee Joint -> Shin -> Foot) */}
      <group position={[-0.1, 0.86, 0]} ref={leftThighRef}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.4, 12]} />
          <meshStandardMaterial color={type === 'farmer' ? '#f8fafc' : color} roughness={0.75} />
        </mesh>
        <group position={[0, -0.4, 0]} ref={leftShinRef}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.058, 0.05, 0.4, 12]} />
            <meshStandardMaterial color={type === 'farmer' ? '#f8fafc' : color} roughness={0.75} />
          </mesh>
          <mesh position={[0, -0.42, 0.05]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.17]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Articulated Right Leg */}
      <group position={[0.1, 0.86, 0]} ref={rightThighRef}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.4, 12]} />
          <meshStandardMaterial color={type === 'farmer' ? '#f8fafc' : color} roughness={0.75} />
        </mesh>
        <group position={[0, -0.4, 0]} ref={rightShinRef}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.058, 0.05, 0.4, 12]} />
            <meshStandardMaterial color={type === 'farmer' ? '#f8fafc' : color} roughness={0.75} />
          </mesh>
          <mesh position={[0, -0.42, 0.05]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.17]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Articulated Left Arm (Shoulder -> Upper Arm -> Elbow -> Forearm -> Hand) */}
      <group position={[-0.23, 1.34, 0]} ref={leftUpperArmRef}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.042, 0.038, 0.3, 10]} />
          <meshStandardMaterial color="#8d5524" roughness={0.6} />
        </mesh>
        <group position={[0, -0.3, 0]} ref={leftForearmRef}>
          <mesh position={[0, -0.14, 0]} castShadow>
            <cylinderGeometry args={[0.036, 0.032, 0.28, 10]} />
            <meshStandardMaterial color="#8d5524" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Articulated Right Arm */}
      <group position={[0.23, 1.34, 0]} ref={rightUpperArmRef}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.042, 0.038, 0.3, 10]} />
          <meshStandardMaterial color="#8d5524" roughness={0.6} />
        </mesh>
        <group position={[0, -0.3, 0]} ref={rightForearmRef}>
          <mesh position={[0, -0.14, 0]} castShadow>
            <cylinderGeometry args={[0.036, 0.032, 0.28, 10]} />
            <meshStandardMaterial color="#8d5524" roughness={0.6} />
          </mesh>
          {type === 'farmer' && (
            <mesh position={[0.03, -0.05, 0.08]} rotation={[0.1, 0, 0]} castShadow>
              <cylinderGeometry args={[0.014, 0.014, 1.25, 8]} />
              <meshStandardMaterial color="#451a03" roughness={0.8} />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
};

/**
 * Authentic Andhra Pradesh Bajaj Auto-Rickshaw
 */
const AndhraAutoRickshaw: React.FC<{ timeOfDay: TimeOfDay }> = ({ timeOfDay }) => {
  const rickshawRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Group>(null);
  const rearWheelsRef = useRef<THREE.Group>(null);
  const posZ = useRef(144);
  const speed = 7.2;

  const isNight = timeOfDay === 'night';
  const isGolden = timeOfDay === 'golden';

  useFrame((_, delta) => {
    if (!rickshawRef.current) return;
    posZ.current -= speed * delta;
    if (posZ.current < 36) {
      posZ.current = 152;
    }

    const z = posZ.current;
    const roadX = getVillageRoadX(z) - 1.25;
    rickshawRef.current.position.set(roadX, 0, z);

    const nextZ = z - 1.5;
    const nextX = getVillageRoadX(nextZ) - 1.25;
    const angle = Math.atan2(nextX - roadX, nextZ - z);
    rickshawRef.current.rotation.y = angle;

    const spin = (speed * delta) / 0.25;
    if (frontWheelRef.current) frontWheelRef.current.rotation.x += spin;
    if (rearWheelsRef.current) rearWheelsRef.current.rotation.x += spin;
  });

  return (
    <group ref={rickshawRef}>
      {/* Ground Contact Ambient Occlusion Shadow */}
      <mesh position={[0, 0.015, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 2.6]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={0.6} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.54, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.36, 0.52, 2.25]} />
        <meshStandardMaterial color="#171717" metalness={0.4} roughness={0.35} />
      </mesh>

      <mesh position={[0, 1.18, -0.06]} castShadow>
        <boxGeometry args={[1.34, 0.78, 2.05]} />
        <meshStandardMaterial color="#eab308" metalness={0.2} roughness={0.4} />
      </mesh>

      <mesh position={[0, 1.64, -0.08]} castShadow>
        <boxGeometry args={[1.38, 0.15, 2.18]} />
        <meshStandardMaterial color="#1c1917" roughness={0.85} />
      </mesh>

      <mesh position={[0, 1.24, 0.9]} rotation={[-0.14, 0, 0]}>
        <boxGeometry args={[1.18, 0.6, 0.04]} />
        <meshPhysicalMaterial
          color="#f0f9ff"
          transmission={0.88}
          transparent
          roughness={0.05}
          reflectivity={0.6}
        />
      </mesh>

      <mesh position={[0, 0.64, 1.14]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.08, 16]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.64, 1.18]}>
        <circleGeometry args={[0.09, 16]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={isNight ? 2.5 : isGolden ? 1.0 : 0.4}
        />
      </mesh>

      <group position={[0, 0.86, 0.32]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.36, 0.42, 0.22]} />
          <meshStandardMaterial color="#a16207" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.54, 0]} castShadow>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshStandardMaterial color="#8d5524" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.6, 0.02]}>
          <cylinderGeometry args={[0.13, 0.12, 0.06, 14]} />
          <meshStandardMaterial color="#854d0e" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.26, 0.36]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.62, 10]} />
          <meshStandardMaterial color="#1c1917" metalness={0.8} />
        </mesh>
      </group>

      <group position={[0, 0.26, 0.98]} ref={frontWheelRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.16, 16]} />
          <meshStandardMaterial color="#1c1917" roughness={0.85} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.17, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      <group position={[0, 0.26, -0.66]} ref={rearWheelsRef}>
        {[-0.6, 0.6].map((wx, idx) => (
          <group key={`rw-${idx}`} position={[wx, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.18, 16]} />
              <meshStandardMaterial color="#1c1917" roughness={0.85} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.15, 0.15, 0.19, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {[-0.54, 0.54].map((mx, idx) => (
        <mesh key={`flap-${idx}`} position={[mx, 0.16, -1.14]}>
          <boxGeometry args={[0.26, 0.2, 0.02]} />
          <meshStandardMaterial color="#dc2626" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * TVS XL100 Heavy Duty Moped
 */
const TVSXL100Moped: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.45, 0]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.62, 0.1]} castShadow>
        <boxGeometry args={[0.22, 0.2, 0.45]} />
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0.66, -0.22]} castShadow>
        <boxGeometry args={[0.24, 0.1, 0.42]} />
        <meshStandardMaterial color="#1c1917" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.68, -0.6]} castShadow>
        <boxGeometry args={[0.3, 0.04, 0.48]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
      </mesh>

      <group position={[0, 0.88, 0.45]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.58, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, -0.06, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 14]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} />
        </mesh>
      </group>

      <group position={[0, 0.26, 0.62]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.08, 16]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.09, 14]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} />
        </mesh>
      </group>

      <group position={[0, 0.26, -0.58]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.08, 16]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.09, 14]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} />
        </mesh>
      </group>

      <mesh position={[0, 0.14, -0.05]} rotation={[-0.2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.32, 6]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
    </group>
  );
};

/**
 * Parked Red Agricultural Tractor (Mahindra / Swaraj)
 */
const AndhraAgriculturalTractor: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  tireTreadTex: THREE.CanvasTexture;
}> = ({ position, rotation = [0, 0, 0], tireTreadTex }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Ground Contact Ambient Occlusion Shadow */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 3.2]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={0.65} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.65, 2.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
      </mesh>

      <mesh position={[0, 1.22, 0.35]} castShadow>
        <boxGeometry args={[1.15, 0.62, 1.8]} />
        <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.25} />
      </mesh>

      <mesh position={[0, 1.18, 1.26]} castShadow>
        <boxGeometry args={[0.95, 0.5, 0.05]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
      </mesh>
      {[-0.32, 0.32].map((hx, idx) => (
        <mesh key={`tract-hl-${idx}`} position={[hx, 1.24, 1.29]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 14]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} />
        </mesh>
      ))}

      <group position={[0.48, 1.6, 0.6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 10]} />
          <meshStandardMaterial color="#171717" metalness={0.8} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.62, 0.03]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.08, 0.015, 0.1]} />
          <meshStandardMaterial color="#171717" />
        </mesh>
      </group>

      {[-0.82, 0.82].map((wx, idx) => (
        <group key={`rear-tr-${idx}`} position={[wx, 0.68, -0.65]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.68, 0.68, 0.42, 24]} />
            <meshStandardMaterial color="#171717" roughness={0.9} normalMap={tireTreadTex} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.42, 0.42, 0.44, 16]} />
            <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {[-0.68, 0.68].map((wx, idx) => (
        <group key={`front-tr-${idx}`} position={[wx, 0.38, 0.9]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.22, 18]} />
            <meshStandardMaterial color="#171717" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.23, 14]} />
            <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {[-0.82, 0.82].map((fx, idx) => (
        <mesh key={`fender-${idx}`} position={[fx, 1.25, -0.65]} castShadow>
          <boxGeometry args={[0.46, 0.1, 1.2]} />
          <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.25} />
        </mesh>
      ))}

      <mesh position={[0, 1.45, -0.5]} castShadow>
        <boxGeometry args={[0.45, 0.12, 0.4]} />
        <meshStandardMaterial color="#1c1917" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.7, -0.1]} rotation={[0.6, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.03, 16]} />
        <meshStandardMaterial color="#1c1917" metalness={0.5} />
      </mesh>
    </group>
  );
};

/**
 * Authentic Coconut Palm Tree (Kobbari Chettu)
 */
const AndhraCoconutPalm: React.FC<{
  position: [number, number, number];
  height?: number;
  curve?: number;
  barkTex: THREE.CanvasTexture;
}> = ({ position, height = 11.5, curve = 0.08, barkTex }) => {
  return (
    <group position={position}>
      <mesh position={[curve * 8, height * 0.5, 0]} rotation={[0, 0, curve]} castShadow>
        <cylinderGeometry args={[0.18, 0.32, height, 16]} />
        <meshStandardMaterial color="#5c4333" roughness={0.92} map={barkTex} />
      </mesh>

      <group position={[curve * 16, height, 0]}>
        {[-0.2, 0.15, -0.1, 0.22].map((cx, idx) => (
          <mesh key={`nut-${idx}`} position={[cx, -0.3, idx * 0.12 - 0.18]} castShadow>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#15803d' : '#ea580c'} roughness={0.65} />
          </mesh>
        ))}

        {Array.from({ length: 12 }).map((_, fi) => {
          const ang = (fi / 12) * Math.PI * 2;
          const droop = 0.48 + (fi % 3) * 0.06;
          return (
            <group key={`frond-${fi}`} rotation={[droop, ang, 0.28]}>
              <mesh position={[0, -0.5, 2.2]} rotation={[-0.42, 0, 0]} castShadow>
                <boxGeometry args={[0.42, 0.05, 4.4]} />
                <meshStandardMaterial color="#166534" roughness={0.65} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

/**
 * Banana Grove (Arati Thota)
 */
const AndhraBananaPlant: React.FC<{ position: [number, number, number]; leafTex: THREE.CanvasTexture }> = ({
  position,
  leafTex
}) => {
  return (
    <group position={position}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 2.8, 12]} />
        <meshStandardMaterial color="#65a30d" roughness={0.8} />
      </mesh>

      {Array.from({ length: 7 }).map((_, li) => {
        const ang = (li / 7) * Math.PI * 2;
        return (
          <group key={`bleaf-${li}`} position={[0, 2.6, 0]} rotation={[0.65, ang, 0]}>
            <mesh position={[0, -0.3, 1.4]} rotation={[-0.35, 0, 0]} castShadow>
              <planeGeometry args={[0.65, 2.6]} />
              <meshStandardMaterial color="#22c55e" roughness={0.5} map={leafTex} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}

      <mesh position={[0, 2.1, 0.6]} castShadow>
        <coneGeometry args={[0.12, 0.35, 12]} />
        <meshStandardMaterial color="#701a75" roughness={0.6} />
      </mesh>
    </group>
  );
};

/**
 * APSPDCL / APTRANSCO Concrete Utility Pole
 */
const AndhraElectricPole: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[0.26, 9.0, 0.26]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.85} />
      </mesh>

      <mesh position={[0, 2.2, 0.14]}>
        <boxGeometry args={[0.22, 0.32, 0.02]} />
        <meshStandardMaterial color="#eab308" roughness={0.4} />
      </mesh>

      <mesh position={[0, 8.4, 0]} castShadow>
        <boxGeometry args={[2.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
      </mesh>

      {[-0.95, 0, 0.95].map((ix, idx) => (
        <group key={`insul-${idx}`} position={[ix, 8.6, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.06, 0.18, 12]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.15} />
          </mesh>
        </group>
      ))}

      <mesh position={[-0.45, 7.2, 0.25]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.85, 0.08, 0.12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
      </mesh>
    </group>
  );
};

/**
 * Sagging 3-phase overhead power cables connecting electric utility poles
 */
const OverheadPowerLines: React.FC = () => {
  const spans = [
    { z1: 148, z2: 118 },
    { z1: 118, z2: 88 },
    { z1: 88, z2: 58 }
  ];

  const wireOffsets = [-0.95, 0, 0.95];

  return (
    <group>
      {spans.map((span, sidx) => {
        const x1 = getVillageRoadX(span.z1) + 5.6;
        const x2 = getVillageRoadX(span.z2) + 5.6;
        const steps = 8;

        return wireOffsets.map((off, oidx) => {
          const wireSegments: [number, number, number][] = [];
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const z = span.z1 + t * (span.z2 - span.z1);
            const x = x1 + t * (x2 - x1) + off;
            const sag = Math.sin(t * Math.PI) * 0.45;
            const y = 8.6 - sag;
            wireSegments.push([x, y, z]);
          }

          return (
            <group key={`wire-${sidx}-${oidx}`}>
              {wireSegments.slice(0, -1).map((p1, pi) => {
                const p2 = wireSegments[pi + 1];
                const mx = (p1[0] + p2[0]) / 2;
                const my = (p1[1] + p2[1]) / 2;
                const mz = (p1[2] + p2[2]) / 2;
                const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
                const angY = Math.atan2(p2[0] - p1[0], p2[2] - p1[2]);
                const angX = -Math.atan2(p2[1] - p1[1], Math.hypot(p2[0] - p1[0], p2[2] - p1[2]));

                return (
                  <group
                    key={`ws-${pi}`}
                    position={[mx, my, mz]}
                    rotation={[angX, angY, 0]}
                  >
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.012, 0.012, len, 4]} />
                      <meshStandardMaterial color="#0f172a" roughness={0.9} />
                    </mesh>
                  </group>
                );
              })}
            </group>
          );
        });
      })}
    </group>
  );
};

/**
 * Rural Andhra Irrigation Aqueduct / Culvert Bridge with reflective water
 */
const IrrigationCulvertBridge: React.FC = () => {
  const zBridge = 96;
  const bridgeX = getVillageRoadX(zBridge);

  return (
    <group position={[bridgeX, 0, zBridge]}>
      {/* Irrigation Canal Running Under Road */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 4.5]} />
        <meshPhysicalMaterial
          color="#14532d"
          transmission={0.4}
          roughness={0.08}
          reflectivity={0.9}
        />
      </mesh>

      {/* Concrete Parapet Safety Guardrails with Red & White Striped Blocks */}
      {[-3.8, 3.8].map((px, idx) => (
        <group key={`culvert-parapet-${idx}`} position={[px, 0, 0]}>
          <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.35, 0.95, 5.8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.7} />
          </mesh>
          {[-1.8, -0.6, 0.6, 1.8].map((rz, ridx) => (
            <mesh key={`reflector-${ridx}`} position={[idx === 0 ? 0.18 : -0.18, 0.48, rz]}>
              <boxGeometry args={[0.02, 0.35, 0.45]} />
              <meshStandardMaterial color="#dc2626" roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

/**
 * Rural Andhra Highway Milestone
 */
const AndhraMilestone: React.FC<{
  position: [number, number, number];
  distanceKm: string;
}> = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.44, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.88, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.88, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#eab308" roughness={0.5} />
      </mesh>
    </group>
  );
};

/**
 * Photorealistic Indian Village Environment inspired by real Andhra Pradesh locations
 */
export const IndianVillage: React.FC<IndianVillageProps> = ({ timeOfDay }) => {
  const isNight = timeOfDay === 'night';
  const isGolden = timeOfDay === 'golden';

  const apRoadTex = useMemo(() => getAPRoadTexture(), []);
  const redSoilTex = useMemo(() => getRedSoilTexture(), []);
  const tileTex = useMemo(() => getMangaloreTileTexture(), []);
  const limeTex = useMemo(() => getLimestoneWashTexture(), []);
  const palmBarkTex = useMemo(() => getCoconutBarkTexture(), []);
  const bananaLeafTex = useMemo(() => getBananaLeafTexture(), []);
  const tinTex = useMemo(() => getTinRoofTexture(), []);
  const paddyTex = useMemo(() => getPaddyFieldTexture(), []);
  const noiseTex = useMemo(() => getMicroNoiseTexture(), []);
  const metalTex = useMemo(() => getBrushedMetalTexture(), []);
  const tireTreadTex = useMemo(() => getTireTreadTexture(), []);

  // Road geometry segments along S-curve
  const roadSegments = useMemo(() => {
    const segments: { z: number; x: number; rotY: number; len: number }[] = [];
    const step = 6;
    for (let z = 160; z >= 24; z -= step) {
      const x1 = getVillageRoadX(z);
      const x2 = getVillageRoadX(z - step);
      const angle = Math.atan2(x2 - x1, -step);
      segments.push({
        z: z - step / 2,
        x: (x1 + x2) / 2,
        rotY: angle,
        len: Math.hypot(x2 - x1, step) + 0.12
      });
    }
    return segments;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================
          1. REALISTIC ANDHRA BITUMEN ROAD & RED EARTH SHOULDERS
         ======================================================== */}
      {roadSegments.map((seg, idx) => (
        <group key={`road-seg-${idx}`} position={[seg.x, 0, seg.z]} rotation={[0, seg.rotY, 0]}>
          <mesh receiveShadow position={[0, 0.015, 0]}>
            <planeGeometry args={[6.8, seg.len]} />
            <meshStandardMaterial
              color="#272a2e"
              roughness={0.92}
              map={apRoadTex}
            />
          </mesh>

          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, seg.len * 0.6]} />
            <meshStandardMaterial color="#fef08a" roughness={0.8} />
          </mesh>

          {[-3.1, 3.1].map((ex, eidx) => (
            <mesh key={`edgeline-${eidx}`} position={[ex, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.12, seg.len]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
            </mesh>
          ))}

          <mesh receiveShadow position={[-4.8, 0.01, 0]}>
            <planeGeometry args={[2.8, seg.len]} />
            <meshStandardMaterial
              color="#9c4424"
              roughness={0.95}
              map={redSoilTex}
            />
          </mesh>

          <mesh receiveShadow position={[4.8, 0.01, 0]}>
            <planeGeometry args={[2.8, seg.len]} />
            <meshStandardMaterial
              color="#9c4424"
              roughness={0.95}
              map={redSoilTex}
            />
          </mesh>
        </group>
      ))}

      {/* ========================================================
          2. EXTENSIVE ANDHRA PADDY FIELDS (VARI POLAM)
         ======================================================== */}
      <mesh receiveShadow position={[-44, -0.04, 95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 140]} />
        <meshStandardMaterial
          color={isGolden ? '#15803d' : '#166534'}
          roughness={0.85}
          map={paddyTex}
        />
      </mesh>

      <mesh receiveShadow position={[44, -0.04, 95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 140]} />
        <meshStandardMaterial
          color={isGolden ? '#166534' : '#14532d'}
          roughness={0.85}
          map={paddyTex}
        />
      </mesh>

      {[-24, 24].map((bx, bidx) => (
        <mesh key={`bund-${bidx}`} position={[bx, 0.1, 95]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.25, 135]} />
          <meshStandardMaterial color="#78350f" roughness={0.95} />
        </mesh>
      ))}

      {/* ========================================================
          3. HOUSE 1: TRADITIONAL GODAVARI MANDUVA COURTYARD HOUSE (Z=145, Left)
         ======================================================== */}
      <group position={[-16.5, 0, 145]} rotation={[0, 0.22, 0]}>
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[11.2, 0.64, 8.8]} />
          <meshStandardMaterial color="#991b1b" roughness={0.65} />
        </mesh>

        <mesh position={[0, 2.1, -0.8]} castShadow receiveShadow>
          <boxGeometry args={[10.4, 3.0, 6.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} map={limeTex} />
        </mesh>

        <group position={[0, 4.4, -0.8]}>
          <mesh position={[-2.4, 0, 0]} rotation={[0, 0, 0.52]} castShadow>
            <boxGeometry args={[5.6, 0.18, 7.6]} />
            <meshStandardMaterial color="#c2410c" roughness={0.7} map={tileTex} />
          </mesh>
          <mesh position={[2.4, 0, 0]} rotation={[0, 0, -0.52]} castShadow>
            <boxGeometry args={[5.6, 0.18, 7.6]} />
            <meshStandardMaterial color="#c2410c" roughness={0.7} map={tileTex} />
          </mesh>
        </group>

        {[-4.2, -1.4, 1.4, 4.2].map((px, idx) => (
          <group key={`manduva-col-${idx}`} position={[px, 1.8, 3.4]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.12, 2.4, 12]} />
              <meshStandardMaterial color="#451a03" roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.15, 0]}>
              <boxGeometry args={[0.35, 0.12, 0.25]} />
              <meshStandardMaterial color="#5c2c16" roughness={0.75} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 1.5, 2.42]}>
          <boxGeometry args={[1.3, 2.2, 0.1]} />
          <meshStandardMaterial color="#3e1c08" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.52, 2.46]}>
          <boxGeometry args={[1.4, 0.08, 0.08]} />
          <meshStandardMaterial color="#eab308" roughness={0.6} />
        </mesh>

        {[-2.2, -1.8].map((mx, idx) => (
          <group key={`pot-${idx}`} position={[mx, 0.75, 3.6]}>
            <mesh castShadow>
              <sphereGeometry args={[0.22, 14, 14]} />
              <meshStandardMaterial color="#9a3412" roughness={0.65} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================
          4. HOUSE 2: MODERN CONCRETE VILLAGE PUCCA HOUSE (Z=148, Right)
         ======================================================== */}
      <group position={[16.2, 0, 148]} rotation={[0, -0.25, 0]}>
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[9.4, 3.6, 7.8]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.75} map={noiseTex} />
        </mesh>

        <mesh position={[0, 3.9, 0]} castShadow>
          <boxGeometry args={[9.5, 0.7, 7.9]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} />
        </mesh>

        <group position={[2.8, 4.8, -1.8]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.65, 1.2, 16]} />
            <meshStandardMaterial color="#171717" roughness={0.6} />
          </mesh>
          {[-0.2, 0.1, 0.4].map((ry, idx) => (
            <mesh key={`tank-rib-${idx}`} position={[0, 0.6 + ry, 0]}>
              <torusGeometry args={[0.66, 0.02, 8, 16]} />
              <meshStandardMaterial color="#09090b" roughness={0.5} />
            </mesh>
          ))}
        </group>

        <group position={[-3.2, 4.5, 3.2]} rotation={[0.4, 0.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>

        {Array.from({ length: 8 }).map((_, si) => (
          <mesh key={`stair-${si}`} position={[-5.1, 0.35 + si * 0.38, 2.4 - si * 0.45]} castShadow>
            <boxGeometry args={[0.9, 0.18, 0.45]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          5. SRI BALAJI TIFFIN & TEA POINT (Z=120, Right)
         ======================================================== */}
      <group position={[13.8, 0, 120]} rotation={[0, -0.28, 0]}>
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 2.6, 4.2]} />
          <meshStandardMaterial color="#fef08a" roughness={0.8} />
        </mesh>

        <mesh position={[0, 2.85, 1.4]} rotation={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[6.4, 0.08, 3.8]} />
          <meshStandardMaterial color="#64748b" metalness={0.75} roughness={0.3} map={tinTex} />
        </mesh>
        {[-3.0, 3.0].map((bx, idx) => (
          <mesh key={`bamboo-${idx}`} position={[bx, 1.35, 2.8]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.7, 10]} />
            <meshStandardMaterial color="#78350f" roughness={0.85} />
          </mesh>
        ))}

        <mesh position={[0, 0.9, 2.0]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.95, 0.75]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.25} />
        </mesh>

        <group position={[-1.6, 1.58, 2.0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.45, 16]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.88} roughness={0.15} map={metalTex} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <coneGeometry args={[0.3, 0.12, 16]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.88} roughness={0.15} />
          </mesh>
        </group>

        <group position={[-0.7, 1.5, 2.0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.25, 14]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0.45, 0.08, 0]}>
            <boxGeometry args={[0.3, 0.14, 0.22]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        </group>

        <group position={[0.9, 1.58, 2.0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.45, 0.5]} />
            <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent roughness={0.05} />
          </mesh>
          {[-0.35, 0, 0.35].map((sx, idx) => (
            <mesh key={`snack-${idx}`} position={[sx, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.09, 0.18, 10]} />
              <meshStandardMaterial color="#d97706" roughness={0.65} />
            </mesh>
          ))}
        </group>

        <group position={[2.1, 2.2, 2.2]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {Array.from({ length: 8 }).map((_, bi) => {
            const ang = (bi / 8) * Math.PI * 2;
            return (
              <mesh key={`bana-${bi}`} position={[Math.cos(ang) * 0.12, -0.15, Math.sin(ang) * 0.12]} rotation={[0.4, ang, 0]}>
                <cylinderGeometry args={[0.03, 0.035, 0.28, 8]} />
                <meshStandardMaterial color="#eab308" roughness={0.6} />
              </mesh>
            );
          })}
        </group>

        {[
          { x: -1.8, z: 3.6, c: '#dc2626' },
          { x: -0.6, z: 3.6, c: '#0284c7' },
          { x: 1.6, z: 3.6, c: '#dc2626' }
        ].map((chair, cidx) => (
          <group key={`chair-${cidx}`} position={[chair.x, 0, chair.z]}>
            <mesh position={[0, 0.42, 0]} castShadow>
              <boxGeometry args={[0.44, 0.06, 0.42]} />
              <meshStandardMaterial color={chair.c} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.72, -0.19]} castShadow>
              <boxGeometry args={[0.42, 0.54, 0.04]} />
              <meshStandardMaterial color={chair.c} roughness={0.5} />
            </mesh>
            {[-0.18, 0.18].map((lx, lidx) =>
              [-0.17, 0.17].map((lz, lzidx) => (
                <mesh key={`cl-${lidx}-${lzidx}`} position={[lx, 0.2, lz]}>
                  <cylinderGeometry args={[0.02, 0.025, 0.4, 8]} />
                  <meshStandardMaterial color={chair.c} roughness={0.5} />
                </mesh>
              ))
            )}
          </group>
        ))}

        <TVSXL100Moped position={[2.8, 0, 4.2]} rotation={[0, 0.35, 0]} />
      </group>

      {/* ========================================================
          6. PARKED RED AGRICULTURAL TRACTOR (Z=134, Left Field)
         ======================================================== */}
      <AndhraAgriculturalTractor
        position={[-12.5, 0, 134]}
        rotation={[0, 0.42, 0]}
        tireTreadTex={tireTreadTex}
      />

      {/* ========================================================
          7. SPRAWLING SACRED BANYAN TREE (MARRI CHETTU) (Z=95, Left)
         ======================================================== */}
      <group position={[-18.5, 0, 95]}>
        <mesh position={[0, 3.6, 0]} castShadow>
          <cylinderGeometry args={[1.6, 2.4, 7.2, 16]} />
          <meshStandardMaterial color="#453123" roughness={0.95} />
        </mesh>

        {[-2.2, 1.8, -1.2, 2.6].map((rx, idx) => (
          <mesh key={`prop-${idx}`} position={[rx, 2.4, (idx % 2 === 0 ? 1 : -1) * 1.6]} castShadow>
            <cylinderGeometry args={[0.1, 0.14, 5.0, 10]} />
            <meshStandardMaterial color="#3e2b1f" roughness={0.95} />
          </mesh>
        ))}

        <mesh position={[0, 7.8, 0]} castShadow>
          <sphereGeometry args={[7.2, 16, 16]} />
          <meshStandardMaterial
            color={isGolden ? '#15803d' : '#166534'}
            roughness={0.78}
          />
        </mesh>

        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[4.4, 4.6, 0.84, 24]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      </group>

      {/* ========================================================
          8. ANDHRA COCONUT PALM GROVES ALONG ROAD (KOBBARI CHETLU)
         ======================================================== */}
      {[
        { x: -22, z: 142, h: 12.0, c: 0.06 },
        { x: 22, z: 136, h: 13.2, c: -0.07 },
        { x: -25, z: 110, h: 11.5, c: 0.08 },
        { x: 24, z: 104, h: 12.8, c: -0.05 },
        { x: -20, z: 75, h: 11.0, c: 0.07 },
        { x: 21, z: 66, h: 12.4, c: -0.06 }
      ].map((palm, pidx) => (
        <AndhraCoconutPalm
          key={`palm-groove-${pidx}`}
          position={[palm.x, 0, palm.z]}
          height={palm.h}
          curve={palm.c}
          barkTex={palmBarkTex}
        />
      ))}

      {/* ========================================================
          9. BANANA PLANTATION GROVE (ARATI THOTA) (Z=128, Left)
         ======================================================== */}
      {[-24, -22, -26].map((bx, idx) => (
        <AndhraBananaPlant
          key={`banana-${idx}`}
          position={[bx, 0, 126 + idx * 3.5]}
          leafTex={bananaLeafTex}
        />
      ))}

      {/* ========================================================
          10. APSPDCL ELECTRICITY UTILITY POLES & SAGGING 3-PHASE CABLES
         ======================================================== */}
      {[148, 118, 88, 58].map((pz, idx) => {
        const poleX = getVillageRoadX(pz) + 5.6;
        return <AndhraElectricPole key={`ap-pole-${idx}`} position={[poleX, 0, pz]} />;
      })}
      {/* Catenary Sagging Overhead Power Cables */}
      <OverheadPowerLines />

      {/* ========================================================
          11. IRRIGATION CANAL CULVERT BRIDGE (Z=96)
         ======================================================== */}
      <IrrigationCulvertBridge />

      {/* ========================================================
          12. BILINGUAL HIGHWAY MILESTONES
         ======================================================== */}
      <AndhraMilestone position={[-4.8, 0, 136]} distanceKm="1.5 KM" />
      <AndhraMilestone position={[-4.9, 0, 78]} distanceKm="0.8 KM" />

      {/* ========================================================
          13. LIVING ANDHRA VILLAGE PEOPLE & DYNAMIC TRAFFIC
         ======================================================== */}
      <AndhraAutoRickshaw timeOfDay={timeOfDay} />

      <AndhraVillagePedestrian
        startZ={140}
        endZ={116}
        roadSide="left"
        speed={0.85}
        type="farmer"
        color="#f8fafc"
      />

      <AndhraVillagePedestrian
        startZ={110}
        endZ={84}
        roadSide="right"
        speed={1.05}
        type="woman"
        color="#ea580c"
      />

      {/* ========================================================
          14. HOSPITAL APPROACH TRANSITION GATE & MONUMENT (Z=36)
         ======================================================== */}
      <group position={[0, 0, 36]}>
        <group position={[-11, 0, 0]}>
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.2, 2.8, 0.8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.15, 0.42]}>
            <boxGeometry args={[4.8, 0.08, 0.02]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
