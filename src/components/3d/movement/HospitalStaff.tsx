import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getSkinTexture, getFabricWeaveTexture } from '../materials/proceduralTextures';

export type StaffRole = 'doctor' | 'nurse' | 'surgeon' | 'patient';

interface HumanoidProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  role: StaffRole;
  isWalking?: boolean;
  walkPath?: { startX: number; endX: number; z: number; speed: number };
  isSeated?: boolean;
  name?: string;
  accessory?: 'tablet' | 'stethoscope' | 'clipboard' | 'none';
  gender?: 'male' | 'female';
}

/**
 * Anatomically proportioned, photorealistic 3D Human Model with realistic
 * facial features, layered clothing, multi-joint gait biomechanics, and clinical attire.
 */
export const PhotorealisticHumanoid: React.FC<HumanoidProps> = ({
  position,
  rotation = [0, 0, 0],
  role,
  isWalking = false,
  walkPath,
  isSeated = false,
  accessory = 'none',
  gender = 'male'
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const pelvisRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftThighRef = useRef<THREE.Group>(null);
  const rightThighRef = useRef<THREE.Group>(null);
  const leftShinRef = useRef<THREE.Group>(null);
  const rightShinRef = useRef<THREE.Group>(null);
  const leftFootRef = useRef<THREE.Group>(null);
  const rightFootRef = useRef<THREE.Group>(null);
  const leftShoulderRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);

  const skinTex = useMemo(() => getSkinTexture(), []);
  const fabricTex = useMemo(() => getFabricWeaveTexture(), []);

  // Physically based material palettes for hospital personnel & patients
  const palette = useMemo(() => {
    switch (role) {
      case 'doctor':
        return {
          coat: '#f8fafc',
          coatInner: '#0284c7',
          pants: '#1e293b',
          tie: '#0369a1',
          shoes: '#0f172a',
          skin: gender === 'female' ? '#e8b89d' : '#d29b7a',
          hair: gender === 'female' ? '#3e2723' : '#1e293b',
          roughnessCoat: 0.45,
          roughnessPants: 0.65
        };
      case 'nurse':
        return {
          coat: '#0891b2', // Ceil blue hospital scrubs
          coatInner: '#06b6d4',
          pants: '#0e7490',
          tie: '#0891b2',
          shoes: '#f8fafc', // White supportive nursing clogs
          skin: gender === 'female' ? '#f3c5a8' : '#c68642',
          hair: gender === 'female' ? '#451a03' : '#0f172a',
          roughnessCoat: 0.6,
          roughnessPants: 0.6
        };
      case 'surgeon':
        return {
          coat: '#059669', // Sterile surgical greens
          coatInner: '#047857',
          pants: '#047857',
          tie: '#059669',
          shoes: '#022c22', // Antistatic surgical clogs
          skin: '#d4a373',
          hair: '#1c1917',
          roughnessCoat: 0.55,
          roughnessPants: 0.55
        };
      case 'patient':
        return {
          coat: '#93c5fd', // Light blue patient gown
          coatInner: '#bfdbfe',
          pants: '#60a5fa',
          tie: '#93c5fd',
          shoes: '#e2e8f0', // Hospital grip socks / slippers
          skin: '#dfa785',
          hair: '#78716c',
          roughnessCoat: 0.7,
          roughnessPants: 0.7
        };
    }
  }, [role, gender]);

  // Biomechanical gait animation loop
  useFrame((state) => {
    const t = state.clock.elapsedTime + position[0] * 3.1 + position[2] * 1.7;

    if (isWalking && walkPath && rootRef.current) {
      const dist = walkPath.endX - walkPath.startX;
      const walkTime = Math.abs(dist) / walkPath.speed;
      const cycle = (t % (walkTime * 2)) / walkTime;
      const forward = cycle <= 1;
      const normP = forward ? cycle : 2 - cycle;

      const currentX = walkPath.startX + normP * dist;
      rootRef.current.position.x = currentX;
      rootRef.current.position.z = walkPath.z;
      rootRef.current.rotation.y = forward
        ? (dist > 0 ? Math.PI / 2 : -Math.PI / 2)
        : (dist > 0 ? -Math.PI / 2 : Math.PI / 2);

      // Biomechanical gait cycle (frequency proportional to forward speed)
      const walkCycle = t * walkPath.speed * 4.6;
      const legPhase = Math.sin(walkCycle);

      // Hip flexion / extension
      if (leftThighRef.current && rightThighRef.current) {
        leftThighRef.current.rotation.x = legPhase * 0.48;
        rightThighRef.current.rotation.x = -legPhase * 0.48;

        // Knee articulation: bends dynamically during the swing phase
        if (leftShinRef.current && rightShinRef.current) {
          leftShinRef.current.rotation.x = Math.max(0, -legPhase * 0.75);
          rightShinRef.current.rotation.x = Math.max(0, legPhase * 0.75);
        }

        // Foot / ankle dorsiflexion and plantar flexion
        if (leftFootRef.current && rightFootRef.current) {
          leftFootRef.current.rotation.x = legPhase > 0 ? -legPhase * 0.25 : legPhase * 0.15;
          rightFootRef.current.rotation.x = legPhase < 0 ? legPhase * 0.25 : -legPhase * 0.15;
        }
      }

      // Torso & Pelvis dynamics: sinusoidal vertical bounce & lateral sway
      if (pelvisRef.current) {
        const verticalBounce = Math.abs(Math.sin(walkCycle)) * 0.038;
        const pelvicSway = Math.cos(walkCycle) * 0.018;
        pelvisRef.current.position.y = 0.94 + verticalBounce;
        pelvisRef.current.position.x = pelvicSway;
        pelvisRef.current.rotation.y = Math.cos(walkCycle) * 0.06;
      }

      // Arm swing counterbalance (opposite phase to legs)
      if (leftShoulderRef.current && rightShoulderRef.current) {
        leftShoulderRef.current.rotation.x = -legPhase * 0.38;
        rightShoulderRef.current.rotation.x = legPhase * 0.38;

        if (leftForearmRef.current && rightForearmRef.current) {
          leftForearmRef.current.rotation.x = 0.18 + Math.abs(legPhase) * 0.22;
          rightForearmRef.current.rotation.x = 0.18 + Math.abs(legPhase) * 0.22;
        }
      }

      // Head stabilization
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.7) * 0.12;
        headRef.current.rotation.x = Math.sin(walkCycle * 2) * 0.02;
      }
    } else if (!isSeated) {
      // NATURAL IDLE / CONVERSATION POSE
      const breath = Math.sin(t * 1.8) * 0.012;
      if (spineRef.current) {
        spineRef.current.position.y = 0.28 + breath;
      }

      if (headRef.current) {
        // Natural gaze micro-movements
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.18 + Math.cos(t * 0.25) * 0.1;
        headRef.current.rotation.x = Math.sin(t * 0.8) * 0.04 - 0.02;
      }

      // Expressive arm posture (holding tablet, gesturing, checking chart)
      if (leftShoulderRef.current && rightShoulderRef.current) {
        if (accessory === 'tablet' || role === 'nurse') {
          // Holding digital tablet with two hands in front of chest
          leftShoulderRef.current.rotation.x = -0.55 + Math.sin(t * 0.6) * 0.04;
          leftShoulderRef.current.rotation.z = 0.2;
          rightShoulderRef.current.rotation.x = -0.65 + Math.sin(t * 0.8) * 0.04;
          rightShoulderRef.current.rotation.z = -0.25;
          if (leftForearmRef.current) leftForearmRef.current.rotation.x = -0.5;
          if (rightForearmRef.current) rightForearmRef.current.rotation.x = -0.5;
        } else {
          // Natural relaxed standing gesture
          leftShoulderRef.current.rotation.x = Math.sin(t * 0.6) * 0.05;
          leftShoulderRef.current.rotation.z = 0.06;
          rightShoulderRef.current.rotation.x = -0.25 + Math.sin(t * 1.2) * 0.1; // Gesturing hand
          rightShoulderRef.current.rotation.z = -0.12;
          if (rightForearmRef.current) {
            rightForearmRef.current.rotation.x = -0.4 + Math.sin(t * 1.4) * 0.15;
          }
        }
      }
    } else {
      // SEATED WAITING / CONSULTATION POSE
      const breath = Math.sin(t * 1.6) * 0.008;
      if (spineRef.current) {
        spineRef.current.position.y = 0.28 + breath;
        spineRef.current.rotation.x = 0.08; // Natural slight seated lean
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.35) * 0.15;
        headRef.current.rotation.x = -0.06 + Math.sin(t * 0.5) * 0.03;
      }
    }
  });

  return (
    <group ref={rootRef} position={position} rotation={rotation}>
      {/* ========================================================
          1. PELVIS / LOWER TORSO CORE
         ======================================================== */}
      <group ref={pelvisRef} position={[0, isSeated ? 0.52 : 0.94, 0]}>
        {/* Pelvic girdle & trousers waist */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[gender === 'female' ? 0.32 : 0.34, 0.18, 0.22]} />
          <meshStandardMaterial
            color={palette.pants}
            roughness={palette.roughnessPants}
            normalMap={fabricTex}
            normalScale={new THREE.Vector2(0.04, 0.04)}
          />
        </mesh>

        {/* Leather Belt & Brushed Metal Buckle */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.345, 0.035, 0.225]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.08, 0.114]}>
          <boxGeometry args={[0.05, 0.04, 0.01]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* ========================================================
            2. UPPER SPINE, CHEST, COAT & HEAD
           ======================================================== */}
        <group ref={spineRef} position={[0, 0.16, 0]}>
          {/* Ribcage / Torso Shirt */}
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[0.36, 0.32, 0.23]} />
            <meshStandardMaterial
              color={role === 'doctor' ? '#f1f5f9' : palette.coat}
              roughness={0.6}
            />
          </mesh>

          {/* Authentic Tailored Lab Coat / Medical Scrub Top */}
          <group position={[0, 0.16, 0]}>
            {/* Coat Back & Sides */}
            <mesh position={[0, 0, -0.01]} castShadow>
              <boxGeometry args={[0.38, 0.36, 0.245]} />
              <meshStandardMaterial
                color={palette.coat}
                roughness={palette.roughnessCoat}
                normalMap={fabricTex}
                normalScale={new THREE.Vector2(0.03, 0.03)}
              />
            </mesh>

            {/* Folded Lapels (Doctors) */}
            {role === 'doctor' && (
              <>
                <mesh position={[-0.1, 0.1, 0.125]} rotation={[0, 0.15, -0.2]}>
                  <boxGeometry args={[0.07, 0.22, 0.02]} />
                  <meshStandardMaterial color={palette.coat} roughness={0.5} />
                </mesh>
                <mesh position={[0.1, 0.1, 0.125]} rotation={[0, -0.15, 0.2]}>
                  <boxGeometry args={[0.07, 0.22, 0.02]} />
                  <meshStandardMaterial color={palette.coat} roughness={0.5} />
                </mesh>
                {/* Shirt Collar & Silk Necktie */}
                <mesh position={[0, 0.17, 0.115]}>
                  <boxGeometry args={[0.09, 0.05, 0.015]} />
                  <meshStandardMaterial color="#f8fafc" />
                </mesh>
                <mesh position={[0, 0.06, 0.118]}>
                  <boxGeometry args={[0.035, 0.18, 0.01]} />
                  <meshStandardMaterial color={palette.tie} metalness={0.3} roughness={0.4} />
                </mesh>
              </>
            )}

            {/* Lower Coat Skirt extending past the thighs (Doctors) */}
            {role === 'doctor' && !isSeated && (
              <mesh position={[0, -0.26, 0]} castShadow>
                <boxGeometry args={[0.385, 0.32, 0.245]} />
                <meshStandardMaterial color={palette.coat} roughness={palette.roughnessCoat} />
              </mesh>
            )}

            {/* Chest Breast Pocket with Pen & Surgical Scissor Clips */}
            {role === 'doctor' && (
              <group position={[0.12, 0.14, 0.126]}>
                <mesh>
                  <boxGeometry args={[0.07, 0.08, 0.005]} />
                  <meshStandardMaterial color={palette.coat} />
                </mesh>
                {/* Stainless steel pen clip */}
                <mesh position={[0.015, 0.035, 0.005]}>
                  <boxGeometry args={[0.008, 0.045, 0.008]} />
                  <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.2} />
                </mesh>
              </group>
            )}

            {/* Hospital Biometric ID Badge Clip */}
            <group position={[-0.11, 0.15, 0.128]}>
              <mesh>
                <boxGeometry args={[0.05, 0.07, 0.006]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.02, 0.004]}>
                <boxGeometry args={[0.04, 0.02, 0.002]} />
                <meshStandardMaterial color="#0284c7" />
              </mesh>
            </group>
          </group>

          {/* Contoured Neck with Sternocleidomastoid Anatomical Profile */}
          <mesh position={[0, 0.36, 0.01]} castShadow>
            <cylinderGeometry args={[0.062, 0.075, 0.11, 16]} />
            <meshStandardMaterial
              color={palette.skin}
              roughness={0.65}
              normalMap={skinTex}
              normalScale={new THREE.Vector2(0.04, 0.04)}
            />
          </mesh>

          {/* ========================================================
              3. PHOTOREALISTIC HUMAN HEAD & FACIAL ANATOMY
             ======================================================== */}
          <group ref={headRef} position={[0, 0.49, 0.02]}>
            {/* Cranium & Jaw Massing */}
            <mesh castShadow>
              <sphereGeometry args={[0.108, 24, 24]} />
              <meshStandardMaterial
                color={palette.skin}
                roughness={0.65}
                normalMap={skinTex}
                normalScale={new THREE.Vector2(0.05, 0.05)}
              />
            </mesh>

            {/* Jawline & Chin Contour */}
            <mesh position={[0, -0.065, 0.03]}>
              <boxGeometry args={[0.095, 0.07, 0.1]} />
              <meshStandardMaterial color={palette.skin} roughness={0.65} normalMap={skinTex} />
            </mesh>

            {/* Brow Ridge & Forehead */}
            <mesh position={[0, 0.028, 0.088]}>
              <boxGeometry args={[0.1, 0.025, 0.035]} />
              <meshStandardMaterial color={palette.skin} roughness={0.65} />
            </mesh>

            {/* Left & Right Eyes (Sclera + Dark Pupil/Iris) */}
            {[-0.034, 0.034].map((ex, idx) => (
              <group key={`eye-${idx}`} position={[ex, 0.018, 0.102]}>
                {/* Sclera */}
                <mesh>
                  <sphereGeometry args={[0.013, 12, 12]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.1} />
                </mesh>
                {/* Iris / Pupil */}
                <mesh position={[0, 0, 0.01]}>
                  <circleGeometry args={[0.007, 12]} />
                  <meshStandardMaterial color="#292524" roughness={0.2} />
                </mesh>
              </group>
            ))}

            {/* Nose Bridge & Tip */}
            <mesh position={[0, -0.01, 0.118]} rotation={[0.2, 0, 0]}>
              <coneGeometry args={[0.018, 0.042, 12]} />
              <meshStandardMaterial color={palette.skin} roughness={0.65} />
            </mesh>

            {/* Anatomical Upper & Lower Lips */}
            <mesh position={[0, -0.048, 0.098]}>
              <boxGeometry args={[0.038, 0.012, 0.015]} />
              <meshStandardMaterial color="#a16207" roughness={0.6} />
            </mesh>

            {/* Left & Right Ears */}
            {[-0.105, 0.105].map((earX, idx) => (
              <mesh key={`ear-${idx}`} position={[earX, 0.005, -0.01]} rotation={[0, earX > 0 ? 0.3 : -0.3, 0]}>
                <boxGeometry args={[0.014, 0.042, 0.028]} />
                <meshStandardMaterial color={palette.skin} roughness={0.7} />
              </mesh>
            ))}

            {/* Sculpted Hair Geometry */}
            <mesh position={[0, 0.04, -0.015]} castShadow>
              <sphereGeometry args={[0.114, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
              <meshStandardMaterial color={palette.hair} roughness={0.85} />
            </mesh>
            {gender === 'female' && (
              /* Professional Hair Bun / Tie */
              <mesh position={[0, 0.02, -0.11]} castShadow>
                <sphereGeometry args={[0.045, 14, 14]} />
                <meshStandardMaterial color={palette.hair} roughness={0.9} />
              </mesh>
            )}

            {/* Stethoscope Binaural Headset (Doctors) */}
            {role === 'doctor' && (
              <group position={[0, -0.18, 0.07]}>
                <mesh rotation={[0.4, 0, 0]}>
                  <torusGeometry args={[0.095, 0.012, 12, 28, Math.PI]} />
                  <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
                </mesh>
                {/* Chestpiece Bell */}
                <mesh position={[0.03, -0.08, 0.06]}>
                  <cylinderGeometry args={[0.022, 0.022, 0.012, 16]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
                </mesh>
              </group>
            )}

            {/* Surgical Bouffant Cap & Face Mask (Surgeons) */}
            {role === 'surgeon' && (
              <>
                {/* Bouffant Surgical Cap */}
                <mesh position={[0, 0.05, 0]}>
                  <sphereGeometry args={[0.12, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
                  <meshStandardMaterial color="#059669" roughness={0.65} normalMap={fabricTex} />
                </mesh>
                {/* Pleated Surgical Face Mask */}
                <mesh position={[0, -0.04, 0.085]}>
                  <boxGeometry args={[0.11, 0.075, 0.04]} />
                  <meshStandardMaterial color="#a7f3d0" roughness={0.5} />
                </mesh>
              </>
            )}
          </group>

          {/* ========================================================
              4. ARTICULATED SHOULDERS, ARMS & HANDS
             ======================================================== */}
          {/* Left Arm Assembly */}
          <group ref={leftShoulderRef} position={[-0.23, 0.28, 0]}>
            {/* Deltoid Shoulder Cap */}
            <mesh position={[0, -0.04, 0]} castShadow>
              <sphereGeometry args={[0.055, 14, 14]} />
              <meshStandardMaterial color={palette.coat} roughness={palette.roughnessCoat} />
            </mesh>
            {/* Upper Arm (Bicep/Tricep) */}
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.048, 0.042, 0.24, 14]} />
              <meshStandardMaterial color={palette.coat} roughness={palette.roughnessCoat} />
            </mesh>
            {/* Forearm & Hand */}
            <group ref={leftForearmRef} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.12, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.034, 0.22, 14]} />
                <meshStandardMaterial
                  color={role === 'doctor' ? palette.coat : palette.skin}
                  roughness={0.65}
                />
              </mesh>
              {/* Articulated Hand with Palm & Digits */}
              <group position={[0, -0.24, 0]}>
                <mesh position={[0, -0.02, 0]} castShadow>
                  <boxGeometry args={[0.042, 0.065, 0.022]} />
                  <meshStandardMaterial
                    color={role === 'surgeon' ? '#fef08a' : palette.skin} // Sterile latex gloves
                    roughness={0.5}
                  />
                </mesh>
              </group>
            </group>
          </group>

          {/* Right Arm Assembly */}
          <group ref={rightShoulderRef} position={[0.23, 0.28, 0]}>
            <mesh position={[0, -0.04, 0]} castShadow>
              <sphereGeometry args={[0.055, 14, 14]} />
              <meshStandardMaterial color={palette.coat} roughness={palette.roughnessCoat} />
            </mesh>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.048, 0.042, 0.24, 14]} />
              <meshStandardMaterial color={palette.coat} roughness={palette.roughnessCoat} />
            </mesh>
            <group ref={rightForearmRef} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.12, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.034, 0.22, 14]} />
                <meshStandardMaterial
                  color={role === 'doctor' ? palette.coat : palette.skin}
                  roughness={0.65}
                />
              </mesh>
              {/* Hand holding clinical accessory */}
              <group position={[0, -0.24, 0]}>
                <mesh position={[0, -0.02, 0]} castShadow>
                  <boxGeometry args={[0.042, 0.065, 0.022]} />
                  <meshStandardMaterial
                    color={role === 'surgeon' ? '#fef08a' : palette.skin}
                    roughness={0.5}
                  />
                </mesh>

                {/* EMR Digital Tablet held by Nurses */}
                {(accessory === 'tablet' || role === 'nurse') && (
                  <group position={[0, -0.04, 0.08]} rotation={[-0.4, 0.1, 0]}>
                    {/* Tablet Glass & Bezel */}
                    <mesh castShadow>
                      <boxGeometry args={[0.18, 0.24, 0.012]} />
                      <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.15} />
                    </mesh>
                    {/* Glowing EMR Clinical Patient Record Screen */}
                    <mesh position={[0, 0, 0.007]}>
                      <planeGeometry args={[0.16, 0.22]} />
                      <meshBasicMaterial color="#38bdf8" />
                    </mesh>
                  </group>
                )}

                {/* Patient Chart Clipboard held by Doctors */}
                {accessory === 'clipboard' && (
                  <group position={[0, -0.04, 0.08]} rotation={[-0.3, 0, 0]}>
                    <mesh castShadow>
                      <boxGeometry args={[0.16, 0.24, 0.015]} />
                      <meshStandardMaterial color="#78350f" roughness={0.7} />
                    </mesh>
                    <mesh position={[0, 0, 0.009]}>
                      <planeGeometry args={[0.14, 0.21]} />
                      <meshStandardMaterial color="#f8fafc" />
                    </mesh>
                    <mesh position={[0, 0.1, 0.012]}>
                      <boxGeometry args={[0.06, 0.025, 0.01]} />
                      <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
                    </mesh>
                  </group>
                )}
              </group>
            </group>
          </group>
        </group>

        {/* ========================================================
            5. MULTI-JOINTED LOWER LIMBS (THIGHS, KNEES, SHINS, FEET)
           ======================================================== */}
        {!isSeated ? (
          <group position={[0, -0.05, 0]}>
            {/* Left Leg Assembly */}
            <group ref={leftThighRef} position={[-0.105, 0, 0]}>
              {/* Thigh / Quadriceps */}
              <mesh position={[0, -0.22, 0]} castShadow>
                <cylinderGeometry args={[0.068, 0.055, 0.44, 16]} />
                <meshStandardMaterial
                  color={palette.pants}
                  roughness={palette.roughnessPants}
                  normalMap={fabricTex}
                />
              </mesh>
              {/* Patella / Kneecap */}
              <mesh position={[0, -0.44, 0.018]} castShadow>
                <sphereGeometry args={[0.042, 12, 12]} />
                <meshStandardMaterial color={palette.pants} roughness={palette.roughnessPants} />
              </mesh>

              {/* Lower Leg / Shin & Calf */}
              <group ref={leftShinRef} position={[0, -0.44, 0]}>
                <mesh position={[0, -0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.052, 0.042, 0.42, 16]} />
                  <meshStandardMaterial
                    color={palette.pants}
                    roughness={palette.roughnessPants}
                    normalMap={fabricTex}
                  />
                </mesh>

                {/* Supportive Clinical Footwear */}
                <group ref={leftFootRef} position={[0, -0.42, 0]}>
                  {/* Thick EVA Midsole with Cushioning */}
                  <mesh position={[0, 0.02, 0.05]} castShadow>
                    <boxGeometry args={[0.095, 0.045, 0.24]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.4} />
                  </mesh>
                  {/* Shoe Upper with Contoured Toe Box */}
                  <mesh position={[0, 0.055, 0.05]} castShadow>
                    <boxGeometry args={[0.09, 0.055, 0.23]} />
                    <meshStandardMaterial color={palette.shoes} roughness={0.45} />
                  </mesh>
                </group>
              </group>
            </group>

            {/* Right Leg Assembly */}
            <group ref={rightThighRef} position={[0.105, 0, 0]}>
              <mesh position={[0, -0.22, 0]} castShadow>
                <cylinderGeometry args={[0.068, 0.055, 0.44, 16]} />
                <meshStandardMaterial
                  color={palette.pants}
                  roughness={palette.roughnessPants}
                  normalMap={fabricTex}
                />
              </mesh>
              <mesh position={[0, -0.44, 0.018]} castShadow>
                <sphereGeometry args={[0.042, 12, 12]} />
                <meshStandardMaterial color={palette.pants} roughness={palette.roughnessPants} />
              </mesh>

              <group ref={rightShinRef} position={[0, -0.44, 0]}>
                <mesh position={[0, -0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.052, 0.042, 0.42, 16]} />
                  <meshStandardMaterial
                    color={palette.pants}
                    roughness={palette.roughnessPants}
                    normalMap={fabricTex}
                  />
                </mesh>

                <group ref={rightFootRef} position={[0, -0.42, 0]}>
                  <mesh position={[0, 0.02, 0.05]} castShadow>
                    <boxGeometry args={[0.095, 0.045, 0.24]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.4} />
                  </mesh>
                  <mesh position={[0, 0.055, 0.05]} castShadow>
                    <boxGeometry args={[0.09, 0.055, 0.23]} />
                    <meshStandardMaterial color={palette.shoes} roughness={0.45} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        ) : (
          /* ========================================================
              SEATED LEG KINEMATICS (NATURAL 90° RESTING CHAIR POSE)
             ======================================================== */
          <group position={[0, -0.05, 0]}>
            {[-0.105, 0.105].map((lx, idx) => (
              <group key={`seated-leg-${idx}`} position={[lx, 0, 0]}>
                {/* Thigh extending forward onto the seat cushion */}
                <mesh position={[0, -0.06, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.065, 0.052, 0.42, 16]} />
                  <meshStandardMaterial color={palette.pants} roughness={palette.roughnessPants} />
                </mesh>
                {/* Kneecap */}
                <mesh position={[0, -0.06, 0.42]} castShadow>
                  <sphereGeometry args={[0.042, 12, 12]} />
                  <meshStandardMaterial color={palette.pants} />
                </mesh>
                {/* Lower shin dropping vertically to the floor */}
                <mesh position={[0, -0.27, 0.42]} castShadow>
                  <cylinderGeometry args={[0.05, 0.042, 0.42, 16]} />
                  <meshStandardMaterial color={palette.pants} roughness={palette.roughnessPants} />
                </mesh>
                {/* Foot resting flat on the floor */}
                <mesh position={[0, -0.49, 0.48]} castShadow>
                  <boxGeometry args={[0.095, 0.05, 0.22]} />
                  <meshStandardMaterial color={palette.shoes} roughness={0.5} />
                </mesh>
              </group>
            ))}
          </group>
        )}
      </group>
    </group>
  );
};

/**
 * Hospital Staff and Patients System: Organizes realistic hospital personnel
 * across exterior pathways and interior lobby zones with natural interactions.
 */
export const HospitalStaff: React.FC<{ isInterior?: boolean }> = ({ isInterior = false }) => {
  return (
    <group position={[0, 0, 0]}>
      {!isInterior ? (
        /* ========================================================
            EXTERIOR SCENE: DOCTORS, NURSES, CONSULTANTS, VISITORS
           ======================================================== */
        <group>
          {/* Senior Attending Physician walking from parking toward entrance with clinical folder */}
          <PhotorealisticHumanoid
            position={[5.2, 0, 8.5]}
            role="doctor"
            isWalking
            walkPath={{ startX: 9.5, endX: -1.5, z: 7.2, speed: 1.3 }}
            accessory="clipboard"
            gender="male"
          />

          {/* Triage Nurse walking across plaza with mobile EMR tablet */}
          <PhotorealisticHumanoid
            position={[-11.5, 0, 5.8]}
            role="nurse"
            isWalking
            walkPath={{ startX: -15.5, endX: -4.5, z: 5.8, speed: 1.4 }}
            accessory="tablet"
            gender="female"
          />

          {/* Ambulatory Patient taking a guided convalescence walk on the sidewalk */}
          <PhotorealisticHumanoid
            position={[-3.5, 0, 10.4]}
            role="patient"
            isWalking
            walkPath={{ startX: -9.5, endX: 5.5, z: 10.2, speed: 1.05 }}
            gender="male"
          />

          {/* Clinical Case Briefing Pair standing near entrance portico */}
          <PhotorealisticHumanoid
            position={[3.8, 0, 3.2]}
            rotation={[0, -Math.PI * 0.65, 0]}
            role="doctor"
            accessory="stethoscope"
            gender="female"
          />
          <PhotorealisticHumanoid
            position={[3.1, 0, 2.6]}
            rotation={[0, Math.PI * 0.35, 0]}
            role="surgeon"
            gender="male"
          />
        </group>
      ) : (
        /* ========================================================
            INTERIOR LOBBY SCENE: INTAKE STAFF, NURSES, SEATED PATIENTS
           ======================================================== */
        <group>
          {/* Patient Admissions Intake Officer seated behind reception desk */}
          <PhotorealisticHumanoid
            position={[0, 0, -6.15]}
            rotation={[0, 0, 0]}
            role="nurse"
            isSeated
            gender="female"
          />

          {/* Floor Charge Nurse walking with clinical tablet along atrium corridor */}
          <PhotorealisticHumanoid
            position={[-3.5, 0, -10.5]}
            role="nurse"
            isWalking
            walkPath={{ startX: -8.0, endX: 8.0, z: -10.5, speed: 1.25 }}
            accessory="tablet"
            gender="male"
          />

          {/* Attending Neurologist & Surgical Fellow in consultation near West Diagnostic Archway */}
          <PhotorealisticHumanoid
            position={[-9.2, 0, -6.4]}
            rotation={[0, 0.65, 0]}
            role="doctor"
            accessory="clipboard"
            gender="male"
          />
          <PhotorealisticHumanoid
            position={[-8.5, 0, -5.7]}
            rotation={[0, -2.45, 0]}
            role="surgeon"
            gender="female"
          />

          {/* Patients seated in the waiting lounge chairs with realistic seated posture */}
          <PhotorealisticHumanoid
            position={[-5.6, 0, -2.5]}
            rotation={[0, Math.PI / 2, 0]}
            role="patient"
            isSeated
            gender="female"
          />
          <PhotorealisticHumanoid
            position={[5.6, 0, -0.9]}
            rotation={[0, -Math.PI / 2, 0]}
            role="patient"
            isSeated
            gender="male"
          />
        </group>
      )}
    </group>
  );
};
