import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { DepartmentData, EquipmentData, EquipmentId } from '../../types/hospital';
import { MRIModel } from './models/MRIModel';
import { CTModel } from './models/CTModel';
import { VentilatorModel } from './models/VentilatorModel';
import { PatientMonitorModel } from './models/PatientMonitorModel';
import { SurgicalRobotModel } from './models/SurgicalRobotModel';
import { ICUBedModel } from './models/ICUBedModel';
import { XRayModel } from './models/XRayModel';
import { UltrasoundModel } from './models/UltrasoundModel';
import { soundManager } from '../../audio/soundManager';
import { getMicroNoiseTexture, getBrushedMetalTexture } from './materials/proceduralTextures';
import { Layers, Sparkles } from 'lucide-react';

interface DepartmentRoomProps {
  department: DepartmentData;
  allEquipment: EquipmentData[];
  onSelectEquipment: (eqId: EquipmentId) => void;
  hoveredEqId: EquipmentId | null;
  onHoverEq: (eqId: EquipmentId | null) => void;
}

export const DepartmentRoom: React.FC<DepartmentRoomProps> = ({
  department,
  allEquipment,
  onSelectEquipment,
  hoveredEqId,
  onHoverEq
}) => {
  const noiseTex = useMemo(() => getMicroNoiseTexture(), []);
  const brushedMetalTex = useMemo(() => getBrushedMetalTexture(), []);

  const primaryEquipment = allEquipment.find(
    (e) => e.id === department.primaryEquipmentId
  );

  const handleEquipmentClick = (id: EquipmentId) => {
    soundManager.playClick();
    onSelectEquipment(id);
  };

  const handleEquipmentHover = (id: EquipmentId | null) => {
    if (id && id !== hoveredEqId) {
      soundManager.playHover();
    }
    onHoverEq(id);
  };

  return (
    <group position={[department.roomCameraTarget[0], 0, department.roomCameraTarget[2]]}>
      {/* ========================================================
          1. CLINICAL ROOM ARCHITECTURE (FLOOR, WALLS, CEILING)
         ======================================================== */}
      {/* Homogeneous Welded Medical Vinyl Sheet Flooring */}
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.22}
          metalness={0.12}
          normalMap={noiseTex}
          normalScale={new THREE.Vector2(0.03, 0.03)}
        />
      </mesh>

      {/* Sanitary Coved Wall Baseboards (Runs 150mm up the wall) */}
      {[-9, 9].map((wx, idx) => (
        <mesh key={`cove-side-${idx}`} position={[wx > 0 ? 8.95 : -8.95, 0.08, 0]} castShadow>
          <boxGeometry args={[0.08, 0.16, 18]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, -8.95]} castShadow>
        <boxGeometry args={[18, 0.16, 0.08]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>

      {/* Wall Protection Crash Rails / Impact Bumpers at 900mm height */}
      <mesh position={[0, 0.9, -8.92]} castShadow receiveShadow>
        <boxGeometry args={[17.8, 0.18, 0.05]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.4} metalness={0.1} />
      </mesh>
      {[-8.92, 8.92].map((wx, idx) => (
        <mesh key={`rail-side-${idx}`} position={[wx, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.18, 17.8]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.4} metalness={0.1} />
        </mesh>
      ))}

      {/* Clean Hospital Eggshell Perimeter Walls */}
      <mesh position={[0, 2.6, -9]} receiveShadow>
        <planeGeometry args={[18, 5.2]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.5}
          normalMap={noiseTex}
          normalScale={new THREE.Vector2(0.02, 0.02)}
        />
      </mesh>
      <mesh position={[-9, 2.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[18, 5.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      <mesh position={[9, 2.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[18, 5.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Clean Room Suspended Ceiling */}
      <mesh position={[0, 5.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#0b1120" roughness={0.7} />
      </mesh>

      {/* Clean Room Laminar Flow Ceiling Grid */}
      <mesh position={[0, 5.15, 0]}>
        <boxGeometry args={[6.8, 0.06, 6.8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 4.8, 0]} intensity={2.4} color="#f8fafc" distance={14} castShadow />

      {/* Lead-Glass Observation Window with Stainless Steel Reveal (MRI & CT) */}
      {(department.id === 'mri_suite' || department.id === 'ct_suite') && (
        <group position={[-8.85, 2.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.6, 2.1, 0.18]} />
            <meshStandardMaterial color="#334155" metalness={0.85} normalMap={brushedMetalTex} />
          </mesh>
          {/* Heavy Lead Radiation Shielding Glass with Physical Transmission */}
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[4.3, 1.85]} />
            <meshPhysicalMaterial
              color="#38bdf8"
              transmission={0.88}
              roughness={0.04}
              ior={1.62} // High-density lead glass
              thickness={0.8}
              reflectivity={0.7}
            />
          </mesh>
        </group>
      )}

      {/* Medical Gas Outlets Headwall Panel (ICU & Patient Recovery Suite) */}
      {(department.id === 'icu' || department.id === 'patient_room') && (
        <group position={[0, 1.9, -8.78]}>
          <mesh castShadow>
            <boxGeometry args={[6.4, 0.95, 0.14]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Color-Coded Medical Gas Quick-Connect Couplers (DIN/Ohmeda Standards) */}
          {[
            { label: 'O2', color: '#22c55e', x: -2.2 },
            { label: 'O2', color: '#22c55e', x: -1.4 },
            { label: 'AIR', color: '#eab308', x: -0.6 },
            { label: 'VAC', color: '#f8fafc', x: 0.6 },
            { label: 'VAC', color: '#f8fafc', x: 1.4 },
            { label: 'AGSS', color: '#3b82f6', x: 2.2 }
          ].map((gas, idx) => (
            <group key={`gas-${idx}`} position={[gas.x, 0, 0.09]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.07, 0.07, 0.08, 18]} />
                <meshStandardMaterial color={gas.color} metalness={0.85} roughness={0.15} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* Dual Articulated Surgical Pendant Lamps (Operating Theatre) */}
      {department.id === 'operation_theatre' && (
        <group position={[0, 4.4, 0]}>
          {[-1.3, 1.3].map((sx, idx) => (
            <group key={`surg-light-${idx}`} position={[sx, 0, 0]}>
              {/* Articulated Boom Arm */}
              <mesh position={[0, -0.4, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.85, 16]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} normalMap={brushedMetalTex} />
              </mesh>
              {/* Multi-Faceted LED Surgical Cupola Head */}
              <mesh position={[0, -0.85, 0]} rotation={[0.25 * (idx === 0 ? 1 : -1), 0, 0]} castShadow>
                <cylinderGeometry args={[0.75, 0.75, 0.18, 32]} />
                <meshStandardMaterial color="#f8fafc" metalness={0.4} roughness={0.2} />
              </mesh>
              {/* High-Intensity Surgical Focus Beam Spot */}
              <spotLight
                position={[0, -0.9, 0]}
                angle={0.55}
                penumbra={0.3}
                intensity={4.2}
                color="#ffffff"
                target-position={[0, 0, 0]}
              />
            </group>
          ))}
          {/* Mobile Stainless Steel Mayo Instrument Stand */}
          <group position={[-2.4, -3.2, 1.2]}>
            <mesh position={[0, 0.85, 0]} castShadow>
              <boxGeometry args={[0.8, 0.04, 0.55]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.42, -0.24]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.85, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
            </mesh>
          </group>
        </group>
      )}

      {/* ========================================================
          2. CLICKABLE PRIMARY MEDICAL EQUIPMENT MODEL
         ======================================================== */}
      {primaryEquipment && (
        <group
          position={[0, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            handleEquipmentClick(primaryEquipment.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            handleEquipmentHover(primaryEquipment.id);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            handleEquipmentHover(null);
            document.body.style.cursor = 'default';
          }}
        >
          {/* Subtle Precision Target Ring on Floor under Equipment */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.5, 2.68, 48]} />
            <meshStandardMaterial
              color={hoveredEqId === primaryEquipment.id ? '#38bdf8' : department.color}
              metalness={0.8}
              roughness={0.2}
              emissive={hoveredEqId === primaryEquipment.id ? '#38bdf8' : department.color}
              emissiveIntensity={hoveredEqId === primaryEquipment.id ? 0.9 : 0.3}
            />
          </mesh>

          {/* Render the actual 3D equipment model */}
          <group position={[0, 0, 0]}>
            {primaryEquipment.id === 'mri_scanner' && (
              <MRIModel
                explodedProgress={0}
                selectedPartId={null}
                onSelectPart={() => {}}
                hoveredPartId={null}
                onHoverPart={() => {}}
              />
            )}
            {primaryEquipment.id === 'ct_scanner' && (
              <CTModel
                explodedProgress={0}
                selectedPartId={null}
                onSelectPart={() => {}}
                hoveredPartId={null}
                onHoverPart={() => {}}
              />
            )}
            {primaryEquipment.id === 'ventilator' && (
              <VentilatorModel
                explodedProgress={0}
                selectedPartId={null}
                onSelectPart={() => {}}
                hoveredPartId={null}
                onHoverPart={() => {}}
              />
            )}
            {primaryEquipment.id === 'patient_monitor' && (
              <PatientMonitorModel
                explodedProgress={0}
                selectedPartId={null}
                onSelectPart={() => {}}
                hoveredPartId={null}
                onHoverPart={() => {}}
              />
            )}
            {primaryEquipment.id === 'surgical_robot' && (
              <SurgicalRobotModel
                explodedProgress={0}
                selectedPartId={null}
                onSelectPart={() => {}}
                hoveredPartId={null}
                onHoverPart={() => {}}
              />
            )}
            {primaryEquipment.id === 'icu_bed' && (
              <ICUBedModel
                explodedProgress={0}
                selectedPartId={null}
                onSelectPart={() => {}}
                hoveredPartId={null}
                onHoverPart={() => {}}
              />
            )}
            {primaryEquipment.id === 'xray_c_arm' && (
              <XRayModel
                explodedProgress={0}
                selectedPartId={null}
                onSelectPart={() => {}}
                hoveredPartId={null}
                onHoverPart={() => {}}
              />
            )}
            {primaryEquipment.id === 'ultrasound' && (
              <UltrasoundModel
                explodedProgress={0}
                selectedPartId={null}
                onSelectPart={() => {}}
                hoveredPartId={null}
                onHoverPart={() => {}}
              />
            )}
          </group>

          {/* Floating Interactive 3D Callout Prompt */}
          <Html position={[0, 2.65, 0]} center distanceFactor={7} style={{ pointerEvents: 'auto' }}>
            <div
              className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-md text-left select-none border shadow-2xl flex items-center gap-3 ${
                hoveredEqId === primaryEquipment.id
                  ? 'bg-sky-500 text-white scale-105 shadow-sky-500/50 border-white'
                  : 'bg-slate-900/90 text-cyan-200 border-cyan-500/40 hover:border-cyan-300'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleEquipmentClick(primaryEquipment.id);
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-80">
                  Interactive 3D Technology
                </div>
                <div className="text-sm font-bold leading-tight">
                  {primaryEquipment.name}
                </div>
                <div className="text-[10px] text-cyan-200 mt-0.5 flex items-center gap-1">
                  <span>Click to Inspect & Explode Parts</span>
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </div>
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};
