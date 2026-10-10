import React, { Suspense, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { EquipmentData, ExplodedPart } from '../../types/hospital';
import { MRIModel } from './models/MRIModel';
import { CTModel } from './models/CTModel';
import { VentilatorModel } from './models/VentilatorModel';
import { PatientMonitorModel } from './models/PatientMonitorModel';
import { SurgicalRobotModel } from './models/SurgicalRobotModel';
import { ICUBedModel } from './models/ICUBedModel';
import { XRayModel } from './models/XRayModel';
import { UltrasoundModel } from './models/UltrasoundModel';
import { soundManager } from '../../audio/soundManager';
import { getBrushedMetalTexture, getMicroNoiseTexture } from './materials/proceduralTextures';

interface EquipmentStudioProps {
  equipment: EquipmentData;
  explodedProgress: number;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  hoveredPartId: string | null;
  onHoverPart: (partId: string | null) => void;
}

export const EquipmentStudio: React.FC<EquipmentStudioProps> = ({
  equipment,
  explodedProgress,
  selectedPartId,
  onSelectPart,
  hoveredPartId,
  onHoverPart
}) => {
  const brushedMetalTex = useMemo(() => getBrushedMetalTexture(), []);
  const noiseTex = useMemo(() => getMicroNoiseTexture(), []);

  const handleSelect = (partId: string) => {
    soundManager.playClick();
    onSelectPart(partId);
  };

  const handleHover = (partId: string | null) => {
    if (partId && partId !== hoveredPartId) {
      soundManager.playHover();
    }
    onHoverPart(partId);
  };

  // Find the selected part object
  const activePart = equipment.parts.find((p) => p.id === selectedPartId);

  return (
    <group position={[0, 0, 0]}>
      {/* High-tech Studio Platform */}
      <group position={[0, -0.05, 0]}>
        {/* Main circular pedestal with Brushed Dark Titanium Texture */}
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[3.85, 4.05, 0.12, 64]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.85}
            roughness={0.25}
            normalMap={brushedMetalTex}
          />
        </mesh>

        {/* Outer subtle cyan accent ring */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.75, 3.82, 64]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>

        {/* Secondary inner ring */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 2.23, 64]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.6} toneMapped={false} />
        </mesh>

        {/* High-precision radial crosshair floor markings */}
        {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((rot, idx) => (
          <mesh key={idx} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, rot]}>
            <planeGeometry args={[0.02, 7.2]} />
            <meshBasicMaterial color="#1e293b" transparent opacity={0.5} />
          </mesh>
        ))}

        {/* Studio Floor Reflector Background */}
        <mesh receiveShadow position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#030712" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* Studio Lighting Rig */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-6, 8, -4]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[0, 4, 0]} intensity={1.5} color="#ffffff" distance={10} />
      <pointLight position={[0, 0.2, 0]} intensity={0.8} color="#06b6d4" distance={5} />

      {/* Render the specific 3D model */}
      <Suspense fallback={null}>
        {equipment.id === 'mri_scanner' && (
          <MRIModel
            explodedProgress={explodedProgress}
            selectedPartId={selectedPartId}
            onSelectPart={handleSelect}
            hoveredPartId={hoveredPartId}
            onHoverPart={handleHover}
          />
        )}

        {equipment.id === 'ct_scanner' && (
          <CTModel
            explodedProgress={explodedProgress}
            selectedPartId={selectedPartId}
            onSelectPart={handleSelect}
            hoveredPartId={hoveredPartId}
            onHoverPart={handleHover}
          />
        )}

        {equipment.id === 'ventilator' && (
          <VentilatorModel
            explodedProgress={explodedProgress}
            selectedPartId={selectedPartId}
            onSelectPart={handleSelect}
            hoveredPartId={hoveredPartId}
            onHoverPart={handleHover}
          />
        )}

        {equipment.id === 'patient_monitor' && (
          <PatientMonitorModel
            explodedProgress={explodedProgress}
            selectedPartId={selectedPartId}
            onSelectPart={handleSelect}
            hoveredPartId={hoveredPartId}
            onHoverPart={handleHover}
          />
        )}

        {equipment.id === 'surgical_robot' && (
          <SurgicalRobotModel
            explodedProgress={explodedProgress}
            selectedPartId={selectedPartId}
            onSelectPart={handleSelect}
            hoveredPartId={hoveredPartId}
            onHoverPart={handleHover}
          />
        )}

        {equipment.id === 'icu_bed' && (
          <ICUBedModel
            explodedProgress={explodedProgress}
            selectedPartId={selectedPartId}
            onSelectPart={handleSelect}
            hoveredPartId={hoveredPartId}
            onHoverPart={handleHover}
          />
        )}

        {equipment.id === 'xray_c_arm' && (
          <XRayModel
            explodedProgress={explodedProgress}
            selectedPartId={selectedPartId}
            onSelectPart={handleSelect}
            hoveredPartId={hoveredPartId}
            onHoverPart={handleHover}
          />
        )}

        {equipment.id === 'ultrasound' && (
          <UltrasoundModel
            explodedProgress={explodedProgress}
            selectedPartId={selectedPartId}
            onSelectPart={handleSelect}
            hoveredPartId={hoveredPartId}
            onHoverPart={handleHover}
          />
        )}
      </Suspense>

      {/* Floating 3D HTML Hotspots over parts when exploded */}
      {explodedProgress > 0.4 && (
        <group>
          {equipment.parts.map((part: ExplodedPart) => {
            const posX = part.offset[0] * explodedProgress;
            const posY = 1.3 + part.offset[1] * explodedProgress;
            const posZ = part.offset[2] * explodedProgress;

            const isSelected = selectedPartId === part.id;
            const isHovered = hoveredPartId === part.id;

            return (
              <group key={part.id} position={[posX, posY, posZ]}>
                <Html
                  center
                  distanceFactor={6}
                  zIndexRange={[100, 0]}
                  style={{ pointerEvents: 'auto' }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(part.id);
                    }}
                    onMouseEnter={() => handleHover(part.id)}
                    onMouseLeave={() => handleHover(null)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 border shadow-lg whitespace-nowrap cursor-pointer select-none backdrop-blur-md ${
                      isSelected
                        ? 'bg-sky-500/90 text-white border-sky-300 shadow-sky-500/50 scale-110'
                        : isHovered
                        ? 'bg-cyan-950/80 text-cyan-200 border-cyan-400 scale-105'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white animate-ping' : 'bg-cyan-400'}`} />
                    <span>{part.name}</span>
                  </button>
                </Html>
              </group>
            );
          })}
        </group>
      )}

      {/* Active Part In-3D Floating Diagnostic Card (Near component) */}
      {activePart && explodedProgress > 0.3 && (
        <group
          position={[
            activePart.offset[0] * explodedProgress + (activePart.offset[0] >= 0 ? 0.8 : -0.8),
            1.6 + activePart.offset[1] * explodedProgress,
            activePart.offset[2] * explodedProgress
          ]}
        >
          <Html
            center
            distanceFactor={5.5}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="w-64 p-3 rounded-xl glass-panel-cyan text-left text-xs animate-in fade-in zoom-in duration-300 pointer-events-auto">
              <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-cyan-500/30">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                  {activePart.category}
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/40">
                  ISOLATED
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1 leading-tight">
                {activePart.name}
              </h4>
              <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                {activePart.shortDesc}
              </p>
              <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800 text-[10px] font-mono text-slate-400">
                <div className="text-cyan-300 font-semibold mb-0.5">Clinical Purpose:</div>
                <div className="text-slate-300 leading-snug line-clamp-2">{activePart.clinicalRole}</div>
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};
