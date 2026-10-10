import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { SceneMode, DepartmentData, EquipmentData } from '../../types/hospital';

interface CameraDirectorProps {
  sceneMode: SceneMode;
  activeDepartment: DepartmentData | null;
  activeEquipment: EquipmentData | null;
  isAutoRotate: boolean;
  onTransitionEnd?: () => void;
  tourChapterIndex?: number;
  tourProgress?: number;
  journeyProgress?: number;
}

export const CameraDirector: React.FC<CameraDirectorProps> = ({
  sceneMode,
  activeDepartment,
  activeEquipment,
  isAutoRotate,
  tourChapterIndex = 0,
  tourProgress = 0,
  journeyProgress = 0
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Target coordinates for camera position and lookAt
  const targetCamPos = useRef(new THREE.Vector3(0, 8, 32));
  const targetLookAt = useRef(new THREE.Vector3(0, 5, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 5, 0));

  // Slow exterior cinematic orbit angle
  const orbitAngle = useRef(0);

  useEffect(() => {
    if (sceneMode === 'exterior') {
      if (journeyProgress >= 0.96) {
        targetCamPos.current.set(0, 8.5, 32);
        targetLookAt.current.set(0, 5, 0);
      }
    } else if (sceneMode === 'approaching_entrance') {
      targetCamPos.current.set(0, 1.75, 0.5);
      targetLookAt.current.set(0, 1.6, -6);
    } else if (sceneMode === 'lobby') {
      targetCamPos.current.set(0, 2.1, 4.5);
      targetLookAt.current.set(0, 1.4, -7.5);
    } else if (sceneMode === 'department' && activeDepartment) {
      targetCamPos.current.set(...activeDepartment.roomCameraPos);
      targetLookAt.current.set(...activeDepartment.roomCameraTarget);
    } else if (sceneMode === 'equipment_studio' && activeEquipment) {
      targetCamPos.current.set(...activeEquipment.defaultCameraPos);
      targetLookAt.current.set(...activeEquipment.defaultTarget);
    }
  }, [sceneMode, activeDepartment, activeEquipment, journeyProgress]);

  useFrame((state, delta) => {
    // 1. VILLAGE-TO-HOSPITAL ROAD JOURNEY & EXTERIOR ORBIT
    if (sceneMode === 'exterior') {
      const p = Math.max(0, Math.min(1, journeyProgress));

      if (p < 0.96) {
        // First-person / cinematic driving perspective along winding village road
        const zPos = 145 * (1 - p) + 32 * p;
        const xRoad = Math.sin((zPos - 20) * 0.042) * 4.2;
        const xPos = xRoad + Math.sin(p * Math.PI * 4) * 0.22;
        const yPos = 2.3 * (1 - p) + 8.5 * p;

        // Target lookAt ahead along the road towards the rising hospital
        const zLook = zPos - (24 * (1 - p) + 32 * p);
        const xLook = Math.sin((zLook - 20) * 0.042) * 3.0 * (1 - p);
        const yLook = 2.0 * (1 - p) + 5.0 * p;

        targetCamPos.current.set(xPos, yPos, zPos);
        targetLookAt.current.set(xLook, yLook, zLook);

        camera.position.lerp(targetCamPos.current, 0.08);
        currentLookAt.current.lerp(targetLookAt.current, 0.08);
        camera.lookAt(currentLookAt.current);
        camera.rotation.z = 0;
        return;
      }

      // Arrived at Hospital Forecourt: panoramic wide-angle vista
      orbitAngle.current += delta * 0.04;
      const radius = 32;
      const x = Math.sin(orbitAngle.current) * radius * 0.5;
      const z = Math.cos(orbitAngle.current) * 4 + 32;
      const y = 8.5 + Math.sin(orbitAngle.current * 0.4) * 0.8;

      targetCamPos.current.set(x, y, z);
      targetLookAt.current.set(0, 5, 0);

      camera.position.lerp(targetCamPos.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
      camera.lookAt(currentLookAt.current);
      camera.rotation.z = 0;
      return;
    }

    // 2. ENTRANCE APPROACH WALKTHROUGH
    if (sceneMode === 'approaching_entrance') {
      camera.position.lerp(targetCamPos.current, 0.045);
      currentLookAt.current.lerp(targetLookAt.current, 0.045);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // 3. CINEMATIC FACILITIES TOUR WALKTHROUGH FLIGHT PATHS
    if (sceneMode === 'cinematic_tour') {
      const p = Math.max(0, Math.min(1, tourProgress));

      switch (tourChapterIndex) {
        // Chapter 0: Architectural Exterior & Emergency Bay
        case 0: {
          const angle = -Math.PI / 4 + p * 0.6;
          const radius = 34 - p * 4;
          targetCamPos.current.set(Math.sin(angle) * radius, 11 - p * 3, Math.cos(angle) * radius);
          targetLookAt.current.set(-6, 4, 2);
          break;
        }
        // Chapter 1: Atrium Reception & Intake
        case 1: {
          targetCamPos.current.set(Math.sin(p * 0.8 - 0.4) * 3, 2.1 - p * 0.2, 5.0 - p * 3.5);
          targetLookAt.current.set(0, 1.4, -6.5);
          break;
        }
        // Chapter 2: 3.0T MRI Diagnostic Suite
        case 2: {
          const angle = p * Math.PI * 0.8 - 0.4;
          targetCamPos.current.set(-8 + Math.sin(angle) * 3.8, 2.2, -4 + Math.cos(angle) * 3.8);
          targetLookAt.current.set(-8, 1.3, -4);
          break;
        }
        // Chapter 3: Dual-Source CT Scanner Suite
        case 3: {
          const angle = p * Math.PI * 0.8 + 0.2;
          targetCamPos.current.set(-14 + Math.cos(angle) * 4.2, 2.15, -8 + Math.sin(angle) * 4.2);
          targetLookAt.current.set(-14, 1.3, -8);
          break;
        }
        // Chapter 4: Robot-Assisted Hybrid Operating Theatre
        case 4: {
          const angle = p * Math.PI * 0.7 - 0.3;
          targetCamPos.current.set(8 + Math.sin(angle) * 3.6, 2.0 - p * 0.3, -4 + Math.cos(angle) * 3.6);
          targetLookAt.current.set(8, 1.35, -4);
          break;
        }
        // Chapter 5: Intensive Critical Care Resuscitation Unit (ICU)
        case 5: {
          targetCamPos.current.set(14 + (p - 0.5) * 3.0, 2.05, -8 + 3.8);
          targetLookAt.current.set(14, 1.3, -8);
          break;
        }
        // Chapter 6: Smart Inpatient Recovery Suite
        case 6: {
          const angle = p * Math.PI * 0.6;
          targetCamPos.current.set(8 + Math.cos(angle) * 3.6, 2.1, -16 + Math.sin(angle) * 3.6);
          targetLookAt.current.set(8, 1.25, -16);
          break;
        }
        // Chapter 7: Level-1 Emergency & Trauma Bay
        case 7: {
          const angle = p * Math.PI * 0.7 + 0.3;
          targetCamPos.current.set(-8 + Math.sin(angle) * 4.0, 2.15, -16 + Math.cos(angle) * 4.0);
          targetLookAt.current.set(-8, 1.3, -16);
          break;
        }
        default:
          targetCamPos.current.set(0, 8, 32);
          targetLookAt.current.set(0, 5, 0);
      }

      camera.position.lerp(targetCamPos.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // 4. FREE INTERACTIVE EXPLORATION (LOBBY, DEPARTMENT, EQUIPMENT STUDIO)
    if (controlsRef.current) {
      const controls = controlsRef.current;
      controls.target.lerp(targetLookAt.current, 0.06);

      if (camera.position.distanceTo(targetCamPos.current) > 0.05) {
        camera.position.lerp(targetCamPos.current, 0.06);
      }
      controls.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={
        sceneMode !== 'exterior' &&
        sceneMode !== 'approaching_entrance' &&
        sceneMode !== 'cinematic_tour'
      }
      autoRotate={isAutoRotate}
      autoRotateSpeed={1.0}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.02}
      minDistance={1.8}
      maxDistance={sceneMode === 'equipment_studio' ? 12 : 28}
    />
  );
};
