import React, { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Sky, ContactShadows, Environment } from '@react-three/drei';
import {
  SceneMode,
  DepartmentData,
  EquipmentData,
  DepartmentId,
  EquipmentId,
  TimeOfDay,
  VFXConfig
} from '../../types/hospital';
import { CameraDirector } from './CameraDirector';
import { HospitalExterior } from './HospitalExterior';
import { HospitalLobby } from './HospitalLobby';
import { DepartmentRoom } from './DepartmentRoom';
import { EquipmentStudio } from './EquipmentStudio';
import { AtmosphericVFX } from './effects/AtmosphericVFX';
import { MedicalHologramVFX } from './effects/MedicalHologramVFX';
import { TOUR_CHAPTERS } from '../ui/FacilitiesWalkthrough';

interface HospitalSceneProps {
  sceneMode: SceneMode;
  timeOfDay: TimeOfDay;
  vfxConfig?: VFXConfig;
  activeDepartment: DepartmentData | null;
  activeEquipment: EquipmentData | null;
  allDepartments: DepartmentData[];
  allEquipment: EquipmentData[];
  explodedProgress: number;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  hoveredPartId: string | null;
  onHoverPart: (partId: string | null) => void;
  hoveredDeptId: DepartmentId | null;
  onHoverDept: (deptId: DepartmentId | null) => void;
  hoveredEqId: EquipmentId | null;
  onHoverEq: (eqId: EquipmentId | null) => void;
  doorOpenProgress: number;
  isHoveredDoor: boolean;
  onHoverDoor: (hovered: boolean) => void;
  onEnterLobby: () => void;
  onSelectDepartment: (deptId: DepartmentId) => void;
  onSelectEquipment: (eqId: EquipmentId) => void;
  isAutoRotate: boolean;
  tourChapterIndex?: number;
  tourProgress?: number;
  journeyProgress?: number;
}

export const HospitalScene: React.FC<HospitalSceneProps> = ({
  sceneMode,
  timeOfDay,
  vfxConfig,
  activeDepartment,
  activeEquipment,
  allDepartments,
  allEquipment,
  explodedProgress,
  selectedPartId,
  onSelectPart,
  hoveredPartId,
  onHoverPart,
  hoveredDeptId,
  onHoverDept,
  hoveredEqId,
  onHoverEq,
  doorOpenProgress,
  isHoveredDoor,
  onHoverDoor,
  onEnterLobby,
  onSelectDepartment,
  onSelectEquipment,
  isAutoRotate,
  tourChapterIndex = 0,
  tourProgress = 0,
  journeyProgress = 0
}) => {
  // Environmental sky parameters based on time of day & weather
  const isNight = timeOfDay === 'night';
  const isGolden = timeOfDay === 'golden';
  const isRain = timeOfDay === 'rain' || (vfxConfig?.rainEffect ?? false);

  const sunPosition: [number, number, number] = isNight
    ? [0, -10, 0]
    : isGolden
    ? [20, 4, 30]
    : isRain
    ? [10, 15, 20]
    : [10, 30, 20];

  // Active tour department if in cinematic tour
  const currentTourChapter =
    sceneMode === 'cinematic_tour' ? TOUR_CHAPTERS[tourChapterIndex] : null;
  const tourDepartment = currentTourChapter?.departmentId
    ? allDepartments.find((d) => d.id === currentTourChapter.departmentId) || null
    : null;
  const displayDepartment = sceneMode === 'cinematic_tour' ? tourDepartment : activeDepartment;

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows="soft"
        camera={{ position: [0, 8, 32], fov: 45 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isNight ? 0.95 : isRain ? 0.92 : isGolden ? 1.15 : 1.1,
          stencil: false,
          depth: true
        }}
      >
        <color
          attach="background"
          args={[isNight ? '#030712' : isRain ? '#1e293b' : isGolden ? '#451a03' : '#c8d6e5']}
        />

        {/* Realistic Atmospheric Aerial Fog (Gradually reveals hospital as camera approaches) */}
        <fog
          attach="fog"
          args={[
            isNight ? '#030712' : isRain ? '#334155' : isGolden ? '#fed7aa' : '#dbeafe',
            sceneMode === 'exterior' ? (isRain ? 15 : 30) : 50,
            sceneMode === 'exterior' ? (isRain ? 150 : 240) : 180
          ]}
        />

        <Suspense fallback={null}>
          {/* Natural Atmospheric Sky Simulation */}
          <Sky
            sunPosition={sunPosition}
            turbidity={isRain ? 10 : isGolden ? 8 : 4.5}
            rayleigh={isRain ? 0.35 : isGolden ? 3 : 1.2}
            mieCoefficient={0.005}
            mieDirectionalG={0.82}
          />

          {/* Physically-Based Global HDR Environment Reflections */}
          <Environment
            preset={isNight ? 'night' : isGolden ? 'sunset' : isRain ? 'warehouse' : 'city'}
            environmentIntensity={isNight ? 0.35 : isRain ? 0.5 : 0.85}
          />

          {/* Environmental Global Lighting */}
          <ambientLight intensity={isNight ? 0.3 : isRain ? 0.45 : isGolden ? 0.55 : 0.85} />
          <directionalLight
            position={sunPosition}
            intensity={isNight ? 0.2 : isRain ? 1.4 : isGolden ? 2.0 : 2.6}
            color={isNight ? '#ffffff' : isRain ? '#94a3b8' : isGolden ? '#fed7aa' : '#fffbf0'}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-75}
            shadow-camera-right={75}
            shadow-camera-top={75}
            shadow-camera-bottom={-75}
            shadow-camera-near={0.5}
            shadow-camera-far={260}
            shadow-bias={-0.00012}
            shadow-normalBias={0.02}
          />

          {/* Atmospheric Special Effects: Sun God Rays, Dust Motes, Chai Steam, Monsoon Rain */}
          <AtmosphericVFX
            timeOfDay={timeOfDay}
            enabledGodRays={vfxConfig?.godRays ?? true}
            enabledDustMotes={vfxConfig?.dustMotes ?? true}
            enabledChaiSteam={vfxConfig?.chaiSteam ?? true}
            enabledRain={isRain}
          />

          {/* Medical Hologram Laser Diagnostic VFX */}
          {(sceneMode === 'equipment_studio' || sceneMode === 'department') && (
            <MedicalHologramVFX
              position={[0, 0, 0]}
              scanHeight={sceneMode === 'equipment_studio' ? 3.6 : 3.0}
              scanWidth={sceneMode === 'equipment_studio' ? 4.2 : 3.5}
              enabledScan={vfxConfig?.laserScanner ?? true}
              enabledHoloRings={vfxConfig?.telemetryHolo ?? true}
            />
          )}

          {/* Camera Animation & Director */}
          <CameraDirector
            sceneMode={sceneMode}
            activeDepartment={displayDepartment}
            activeEquipment={activeEquipment}
            isAutoRotate={isAutoRotate}
            tourChapterIndex={tourChapterIndex}
            tourProgress={tourProgress}
            journeyProgress={journeyProgress}
          />

          {/* 1. Hospital Exterior (Shown in exterior or while approaching entrance, or Chapter 0 of facilities tour) */}
          {(sceneMode === 'exterior' ||
            sceneMode === 'approaching_entrance' ||
            (sceneMode === 'cinematic_tour' && tourChapterIndex === 0)) && (
            <HospitalExterior
              onEnterLobby={onEnterLobby}
              doorOpenProgress={doorOpenProgress}
              isHoveredDoor={isHoveredDoor}
              onHoverDoor={onHoverDoor}
              timeOfDay={timeOfDay}
            />
          )}

          {/* 2. Hospital Interior Lobby (Shown in lobby or seamlessly revealed during entrance transition, or in interior tour chapters) */}
          {(sceneMode === 'lobby' ||
            sceneMode === 'approaching_entrance' ||
            (sceneMode === 'cinematic_tour' && tourChapterIndex > 0)) && (
            <HospitalLobby
              departments={allDepartments}
              onSelectDepartment={onSelectDepartment}
              hoveredDeptId={hoveredDeptId}
              onHoverDept={onHoverDept}
            />
          )}

          {/* 3. Department Specific Room */}
          {((sceneMode === 'department' && displayDepartment) ||
            (sceneMode === 'cinematic_tour' &&
              tourChapterIndex > 0 &&
              displayDepartment &&
              displayDepartment.id !== 'reception')) && (
            <DepartmentRoom
              department={displayDepartment}
              allEquipment={allEquipment}
              onSelectEquipment={onSelectEquipment}
              hoveredEqId={hoveredEqId}
              onHoverEq={onHoverEq}
            />
          )}

          {/* 4. Isolated Medical Equipment Inspection Studio */}
          {sceneMode === 'equipment_studio' && activeEquipment && (
            <EquipmentStudio
              equipment={activeEquipment}
              explodedProgress={explodedProgress}
              selectedPartId={selectedPartId}
              onSelectPart={onSelectPart}
              hoveredPartId={hoveredPartId}
              onHoverPart={onHoverPart}
            />
          )}

          {/* Realistic soft ground contact shadow */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.65}
            scale={40}
            blur={2.0}
            far={10}
            resolution={512}
            frames={1}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
