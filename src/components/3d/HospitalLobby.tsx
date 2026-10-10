import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { DepartmentData, DepartmentId } from '../../types/hospital';
import { soundManager } from '../../audio/soundManager';
import { getHospitalFloorTexture, getMicroNoiseTexture, getBrushedMetalTexture } from './materials/proceduralTextures';
import { HospitalStaff } from './movement/HospitalStaff';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';

interface HospitalLobbyProps {
  departments: DepartmentData[];
  onSelectDepartment: (deptId: DepartmentId) => void;
  hoveredDeptId: DepartmentId | null;
  onHoverDept: (deptId: DepartmentId | null) => void;
}

export const HospitalLobby: React.FC<HospitalLobbyProps> = ({
  departments,
  onSelectDepartment,
  hoveredDeptId,
  onHoverDept
}) => {
  const floorTex = useMemo(() => getHospitalFloorTexture(), []);
  const noiseTex = useMemo(() => getMicroNoiseTexture(), []);
  const brushedMetalTex = useMemo(() => getBrushedMetalTexture(), []);

  const handleDeptClick = (id: DepartmentId) => {
    soundManager.playClick();
    onSelectDepartment(id);
  };

  const handleDeptHover = (id: DepartmentId | null) => {
    if (id && id !== hoveredDeptId) {
      soundManager.playHover();
    }
    onHoverDept(id);
  };

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================
          1. LOBBY ARCHITECTURE: FLOOR, WALLS, CEILING, BASEBOARDS
         ======================================================== */}
      {/* High-Gloss Polished Terrazzo Hospital Tile Floor */}
      <mesh receiveShadow position={[0, -0.01, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 38]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.14}
          metalness={0.25}
          map={floorTex}
        />
      </mesh>

      {/* Perimeter Sanitary Cove Baseboard Trims (100mm height) */}
      <mesh position={[0, 0.08, -25.8]}>
        <boxGeometry args={[46, 0.16, 0.06]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* Back Feature Wall with Architectural Acoustic Paneling */}
      <group position={[0, 3.2, -26]}>
        <mesh receiveShadow>
          <planeGeometry args={[46, 6.4]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.45}
            normalMap={noiseTex}
            normalScale={new THREE.Vector2(0.04, 0.04)}
          />
        </mesh>
        {/* Illuminated Hospital Mission Statement Wall Plaque */}
        <mesh position={[0, 1.8, 0.05]}>
          <planeGeometry args={[14, 1.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Lobby Suspended Ceiling Grid with Acoustic Tiles */}
      <mesh position={[0, 6.2, -10]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 38]} />
        <meshStandardMaterial color="#0b1120" roughness={0.7} />
      </mesh>

      {/* Recessed Commercial 600x1200 LED Troffer Luminaires */}
      {[-12, -6, 0, 6, 12].map((tx, idx) => (
        <React.Fragment key={`troffer-row-${idx}`}>
          {[-4, -10, -16, -22].map((tz, zidx) => (
            <group key={`troffer-${idx}-${zidx}`} position={[tx, 6.18, tz]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.2, 0.6]} />
                <meshBasicMaterial color="#f8fafc" />
              </mesh>
            </group>
          ))}
        </React.Fragment>
      ))}

      {/* Structural Reinforced Concrete Columns with Brushed Metal Base Collars */}
      {[
        [-10, 3.1, -4],
        [10, 3.1, -4],
        [-10, 3.1, -16],
        [10, 3.1, -16]
      ].map(([x, y, z], idx) => (
        <group key={`lobby-col-${idx}`} position={[x, y, z]}>
          {/* Column Shaft */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.48, 0.48, 6.2, 32]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.3}
              metalness={0.05}
              normalMap={noiseTex}
            />
          </mesh>
          {/* Stainless Steel Base Impact Collar */}
          <mesh position={[0, -2.8, 0]} castShadow>
            <cylinderGeometry args={[0.52, 0.52, 0.6, 32]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.15}
              normalMap={brushedMetalTex}
            />
          </mesh>
        </group>
      ))}

      {/* ========================================================
          2. CENTRAL RECEPTION & INTAKE ISLAND
         ======================================================== */}
      <group position={[0, 0, -5.5]}>
        {/* Lower Counter Body with Vertical Slatted Acoustic Wood Texture */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3.4, 3.4, 1.2, 36, 1, false, -Math.PI * 0.65, Math.PI * 1.3]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.3}
            roughness={0.35}
            normalMap={brushedMetalTex}
          />
        </mesh>

        {/* Solid-Surface White Quartz Transaction Top */}
        <mesh position={[0, 1.22, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3.55, 3.55, 0.08, 36, 1, false, -Math.PI * 0.65, Math.PI * 1.3]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.1}
            roughness={0.18}
            normalMap={noiseTex}
          />
        </mesh>

        {/* Recessed Under-Counter LED Glow Strip */}
        <mesh position={[0, 0.08, 0.08]}>
          <cylinderGeometry args={[3.42, 3.42, 0.12, 36, 1, true, -Math.PI * 0.6, Math.PI * 1.2]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[0, 0.1, 0]} intensity={1.2} color="#38bdf8" distance={5} />

        {/* Realistic Thin-Bezel Medical Workstation Displays */}
        {[-0.9, 0, 0.9].map((x, idx) => (
          <group key={`rec-pc-${idx}`} position={[x, 1.48, -0.3]} rotation={[0, (idx - 1) * -0.15, 0]}>
            {/* Monitor Housing */}
            <mesh castShadow>
              <boxGeometry args={[0.62, 0.38, 0.03]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            {/* Anti-Glare Display Screen with Intake Software Graphic */}
            <mesh position={[0, 0, 0.018]}>
              <planeGeometry args={[0.58, 0.34]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
            {/* Articulated Desk Mount Arm */}
            <mesh position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.14, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================
          3. DESIGNER WAITING LOUNGE & RECOVERY SEATING
         ======================================================== */}
      {/* Waiting Lounge - Left Wing */}
      <group position={[-5.6, 0, -2.5]}>
        {[-1.6, 0, 1.6].map((z, idx) => (
          <group key={`lounge-chair-l-${idx}`} position={[0, 0, z]}>
            {/* Padded Seat Cushion */}
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.85, 0.18, 0.85]} />
              <meshStandardMaterial color="#0284c7" roughness={0.7} />
            </mesh>
            {/* Ergonomic Backrest */}
            <mesh position={[-0.38, 0.72, 0]} castShadow>
              <boxGeometry args={[0.14, 0.48, 0.85]} />
              <meshStandardMaterial color="#0369a1" roughness={0.7} />
            </mesh>
            {/* Chrome Tubular Leg Frame */}
            <mesh position={[0, 0.16, 0]} castShadow>
              <boxGeometry args={[0.82, 0.32, 0.82]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        ))}
        {/* Architectural Low Coffee Table with White Calacatta Top */}
        <group position={[1.4, 0, 0]}>
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 0.06, 2.8]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.13, 0]} castShadow>
            <boxGeometry args={[0.75, 0.26, 2.6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Waiting Lounge - Right Wing */}
      <group position={[5.6, 0, -2.5]}>
        {[-1.6, 0, 1.6].map((z, idx) => (
          <group key={`lounge-chair-r-${idx}`} position={[0, 0, z]}>
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.85, 0.18, 0.85]} />
              <meshStandardMaterial color="#0284c7" roughness={0.7} />
            </mesh>
            <mesh position={[0.38, 0.72, 0]} castShadow>
              <boxGeometry args={[0.14, 0.48, 0.85]} />
              <meshStandardMaterial color="#0369a1" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.16, 0]} castShadow>
              <boxGeometry args={[0.82, 0.32, 0.82]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        ))}
        <group position={[-1.4, 0, 0]}>
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 0.06, 2.8]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.13, 0]} castShadow>
            <boxGeometry args={[0.75, 0.26, 2.6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Indoor Architectural Potted Plants (Ficus & Snake Plants in Ceramic Planters) */}
      {[-8.5, 8.5].map((px, idx) => (
        <group key={`lobby-plant-${idx}`} position={[px, 0, 0.5]}>
          {/* Fluted Ceramic Cylindrical Planter */}
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.32, 0.84, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.18} normalMap={brushedMetalTex} />
          </mesh>
          {/* Horticultural Potting Soil */}
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.04, 20]} />
            <meshStandardMaterial color="#1c1917" roughness={0.95} />
          </mesh>
          {/* Multi-Stem Architectural Foliage Leaves with Natural Curvature */}
          <group position={[0, 0.84, 0]}>
            {Array.from({ length: 8 }).map((_, li) => {
              const angle = (li / 8) * Math.PI * 2;
              const leafHeight = 0.8 + (li % 3) * 0.2;
              return (
                <group key={`leaf-${li}`} rotation={[0.2, angle, 0.15]}>
                  <mesh position={[0, leafHeight * 0.45, 0.08]} rotation={[0.1, 0, 0]} castShadow>
                    <boxGeometry args={[0.14, leafHeight, 0.015]} />
                    <meshStandardMaterial
                      color={li % 2 === 0 ? '#15803d' : '#166534'}
                      roughness={0.65}
                      normalMap={noiseTex}
                    />
                  </mesh>
                </group>
              );
            })}
          </group>
        </group>
      ))}

      {/* ========================================================
          4. INTERACTIVE 3D CLINICAL DEPARTMENT WAYFINDING PORTALS
         ======================================================== */}
      {departments.map((dept) => {
        const isHovered = hoveredDeptId === dept.id;
        const [x, , z] = dept.lobbyPosition;

        return (
          <group
            key={dept.id}
            position={[x, 0, z]}
            onClick={(e) => {
              e.stopPropagation();
              handleDeptClick(dept.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              handleDeptHover(dept.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              handleDeptHover(null);
              document.body.style.cursor = 'default';
            }}
          >
            {/* Polished Architectural Floor Inlay Ring */}
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.5, isHovered ? 1.85 : 1.65, 36]} />
              <meshStandardMaterial
                color={dept.color}
                metalness={0.8}
                roughness={0.2}
                emissive={dept.color}
                emissiveIntensity={isHovered ? 0.8 : 0.2}
              />
            </mesh>

            {/* Target Beacon Disc with subtle floor reflection */}
            <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.4, 32]} />
              <meshStandardMaterial
                color={dept.color}
                transparent
                opacity={isHovered ? 0.22 : 0.06}
              />
            </mesh>

            {/* Architectural Stainless Steel Directional Totem Post */}
            <mesh position={[0, 1.4, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 2.8, 16]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.15}
                normalMap={brushedMetalTex}
              />
            </mesh>

            {/* Floating Department Holographic Wayfinder Card */}
            <Html
              position={[0, 2.2, 0]}
              center
              distanceFactor={8}
              style={{ pointerEvents: 'auto' }}
            >
              <div
                className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-md text-left select-none border shadow-2xl flex flex-col gap-1.5 w-64 ${
                  isHovered
                    ? 'scale-105 bg-slate-900/95 border-sky-400 shadow-[0_0_28px_rgba(56,189,248,0.4)]'
                    : 'bg-slate-950/85 border-slate-700 hover:border-slate-500'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeptClick(dept.id);
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                    style={{ backgroundColor: `${dept.color}25`, color: dept.color }}
                  >
                    {dept.code} • {dept.floor}
                  </span>
                  <Sparkles
                    className={`w-3.5 h-3.5 transition-transform ${
                      isHovered ? 'scale-125 text-yellow-300' : 'text-slate-500'
                    }`}
                  />
                </div>

                <div className="font-bold text-sm text-white leading-tight">
                  {dept.shortName}
                </div>

                <div className="text-[11px] text-slate-300 line-clamp-2 leading-snug">
                  {dept.clinicalFocus}
                </div>

                <div className="mt-1 pt-1.5 border-t border-slate-800 flex items-center justify-between text-xs font-semibold" style={{ color: dept.color }}>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Enter Suite</span>
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </Html>
          </group>
        );
      })}

      {/* Atmospheric Interior Natural Illumination */}
      <pointLight position={[0, 4.8, -5]} intensity={1.8} color="#f0f9ff" distance={20} />
      <pointLight position={[-10, 4.8, -12]} intensity={1.2} color="#e0f2fe" distance={16} />
      <pointLight position={[10, 4.8, -12]} intensity={1.2} color="#e0f2fe" distance={16} />

      {/* Realistic Animated Hospital Staff, Doctors & Patients */}
      <HospitalStaff isInterior={true} />
    </group>
  );
};
