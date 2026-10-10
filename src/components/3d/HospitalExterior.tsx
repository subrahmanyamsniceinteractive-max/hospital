import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { TimeOfDay } from '../../types/hospital';
import {
  getAsphaltTexture,
  getMicroNoiseTexture,
  getBrushedMetalTexture,
  getTireTreadTexture,
  getTreeBarkTexture,
  getCarGrilleTexture,
  getArchitecturalPanelTexture,
  getGraniteTexture
} from './materials/proceduralTextures';
import { TrafficSystem } from './movement/TrafficSystem';
import { HospitalStaff } from './movement/HospitalStaff';
import { IndianVillage } from './environment/IndianVillage';
import { LogIn, Sparkles } from 'lucide-react';

interface HospitalExteriorProps {
  onEnterLobby: () => void;
  doorOpenProgress: number; // 0 = closed, 1 = fully open
  isHoveredDoor: boolean;
  onHoverDoor: (hovered: boolean) => void;
  timeOfDay: TimeOfDay;
}

export const HospitalExterior: React.FC<HospitalExteriorProps> = ({
  onEnterLobby,
  doorOpenProgress,
  isHoveredDoor,
  onHoverDoor,
  timeOfDay
}) => {
  const ambulanceLightRedRef = useRef<THREE.PointLight>(null);
  const ambulanceLightBlueRef = useRef<THREE.PointLight>(null);
  const signGlowRef = useRef<THREE.Mesh>(null);

  const asphaltTex = useMemo(() => getAsphaltTexture(), []);
  const noiseTex = useMemo(() => getMicroNoiseTexture(), []);
  const brushedMetalTex = useMemo(() => getBrushedMetalTexture(), []);
  const tireTreadTex = useMemo(() => getTireTreadTexture(), []);
  const treeBarkTex = useMemo(() => getTreeBarkTexture(), []);
  const grilleTex = useMemo(() => getCarGrilleTexture(), []);
  const archPanelTex = useMemo(() => getArchitecturalPanelTexture(), []);
  const graniteTex = useMemo(() => getGraniteTexture(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Flashing ambulance emergency beacon strobe with realistic rapid dual-pulse
    if (ambulanceLightRedRef.current && ambulanceLightBlueRef.current) {
      const redFlash = (Math.sin(t * 12) > 0.3 || Math.sin(t * 12 + 0.6) > 0.4) ? 3.0 : 0.05;
      const blueFlash = (Math.sin(t * 12 + Math.PI) > 0.3 || Math.sin(t * 12 + Math.PI + 0.6) > 0.4) ? 3.0 : 0.05;
      ambulanceLightRedRef.current.intensity = redFlash;
      ambulanceLightBlueRef.current.intensity = blueFlash;
    }
  });

  // Calculate sliding door displacement with smooth physical damping
  const doorSlideDist = 1.25 * doorOpenProgress;

  const isNight = timeOfDay === 'night';
  const isGolden = timeOfDay === 'golden';

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================
          1. MAIN CENTRAL HOSPITAL TOWER (5-STOREY ARCHITECTURAL WING)
         ======================================================== */}
      <group position={[0, 7.8, -5]}>
        {/* Core Architectural Massing - Matte Off-White Composite Cladding */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[18.4, 15.6, 12.4]} />
          <meshStandardMaterial
            color={isNight ? '#0f172a' : isGolden ? '#fdf8f4' : '#f8fafc'}
            roughness={0.35}
            metalness={0.1}
            map={archPanelTex}
          />
        </mesh>

        {/* Horizontal Concrete Floor Slab Reveals & Shadow Gaps */}
        {[-5.8, -2.9, 0, 2.9, 5.8].map((y, idx) => (
          <group key={`floor-slab-${idx}`} position={[0, y, 6.25]}>
            {/* Slab fascia band */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[18.6, 0.45, 0.35]} />
              <meshStandardMaterial
                color="#e2e8f0"
                metalness={0.2}
                roughness={0.3}
              />
            </mesh>
            {/* Dark shadow reveal groove under slab */}
            <mesh position={[0, -0.26, 0]}>
              <boxGeometry args={[18.6, 0.08, 0.4]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Double-Glazed Glass Curtain Wall Facade with Physical Transmission */}
        <mesh position={[0, 0, 6.22]} castShadow receiveShadow>
          <planeGeometry args={[16.8, 14.2]} />
          <meshPhysicalMaterial
            color={isNight ? '#0369a1' : isGolden ? '#bae6fd' : '#e0f2fe'}
            transmission={0.85}
            opacity={1}
            transparent
            roughness={0.04}
            ior={1.52}
            thickness={0.5}
            reflectivity={0.65}
            clearcoat={1.0}
            clearcoatRoughness={0.03}
          />
        </mesh>

        {/* Interior Illuminated Floor Volumes behind the glass */}
        {[-4.2, -1.3, 1.6, 4.5].map((y, idx) => (
          <group key={`int-volume-${idx}`} position={[0, y, 5.6]}>
            <mesh>
              <planeGeometry args={[16.0, 2.2]} />
              <meshStandardMaterial
                color={isNight ? '#0ea5e9' : isGolden ? '#fed7aa' : '#ffffff'}
                emissive={isNight ? '#0284c7' : isGolden ? '#f59e0b' : '#38bdf8'}
                emissiveIntensity={isNight ? 0.75 : isGolden ? 0.4 : 0.15}
                roughness={0.6}
              />
            </mesh>
            {/* Subtle hospital room silhouette / ceiling troffers */}
            <mesh position={[0, 1.05, 0.2]}>
              <boxGeometry args={[15.6, 0.06, 0.8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          </group>
        ))}

        {/* Extruded Architectural Mullions with Structural Shadow Caps */}
        {[-7.5, -5.0, -2.5, 0, 2.5, 5.0, 7.5].map((x, idx) => (
          <mesh key={`mullion-vert-${idx}`} position={[x, 0, 6.32]} castShadow>
            <boxGeometry args={[0.14, 14.4, 0.22]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.85}
              roughness={0.2}
              normalMap={brushedMetalTex}
            />
          </mesh>
        ))}

        {/* Subtle Healing Teal Architectural Accent Spandrel Strips */}
        {[-8.5, 8.5].map((ax, idx) => (
          <mesh key={`teal-accent-${idx}`} position={[ax, 0, 6.3]} castShadow>
            <boxGeometry args={[0.3, 14.8, 0.15]} />
            <meshStandardMaterial color="#0d9488" metalness={0.75} roughness={0.25} />
          </mesh>
        ))}

        {/* Horizontal Brise-Soleil Sunshade Blades in Subtle Healing Teal Accent */}
        {[-4.3, -1.4, 1.5, 4.4].map((y, idx) => (
          <mesh key={`sunshade-${idx}`} position={[0, y + 1.2, 6.55]} castShadow>
            <boxGeometry args={[17.0, 0.08, 0.65]} />
            <meshStandardMaterial color="#0d9488" metalness={0.7} roughness={0.25} />
          </mesh>
        ))}

        {/* Rooftop Parapet Cap & Safety Railings */}
        <mesh position={[0, 7.95, 0]} castShadow>
          <boxGeometry args={[18.5, 0.35, 12.5]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Rooftop Mechanical Plant Screen with Ventilation Louvers */}
        <group position={[0, 9.2, -1.0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[13.2, 2.2, 8.4]} />
            <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Intake Louver Horizontal Slits */}
          {[-0.6, -0.2, 0.2, 0.6].map((ly, idx) => (
            <mesh key={`louver-${idx}`} position={[0, ly, 4.22]}>
              <boxGeometry args={[12.6, 0.12, 0.06]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          {/* Dual Chiller Fans */}
          {[-3.0, 3.0].map((cx, idx) => (
            <mesh key={`chiller-${idx}`} position={[cx, 1.15, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[1.2, 1.2, 0.3, 24]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* Rooftop Emergency Helipad */}
        <group position={[0, 10.4, -1.0]}>
          {/* Octagonal Steel Base Grate */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[4.8, 5.0, 0.25, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.6} />
          </mesh>
          {/* Perimeter Safety Netting Support Ring */}
          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4.85, 5.2, 32]} />
            <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Helipad Perimeter Inset LED Lights */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const hx = Math.cos(angle) * 4.6;
            const hz = Math.sin(angle) * 4.6;
            return (
              <mesh key={`heli-led-${i}`} position={[hx, 0.14, hz]}>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshBasicMaterial color="#22c55e" />
              </mesh>
            );
          })}
          {/* Painted Yellow Helipad Boundary Ring */}
          <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.8, 4.05, 32]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
          {/* Helipad Painted White "H" */}
          <group position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[-0.95, 0, 0]}>
              <planeGeometry args={[0.35, 2.4]} />
              <meshBasicMaterial color="#f8fafc" />
            </mesh>
            <mesh position={[0.95, 0, 0]}>
              <planeGeometry args={[0.35, 2.4]} />
              <meshBasicMaterial color="#f8fafc" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[1.9, 0.35]} />
              <meshBasicMaterial color="#f8fafc" />
            </mesh>
          </group>
        </group>

        {/* Architectural 3D Backlit Hospital Signage */}
        <group position={[0, 6.35, 6.38]}>
          <mesh ref={signGlowRef} castShadow>
            <boxGeometry args={[12.4, 1.35, 0.18]} />
            <meshStandardMaterial
              color="#0c1d37"
              metalness={0.8}
              roughness={0.2}
              normalMap={brushedMetalTex}
            />
          </mesh>
          {/* Medical Cross Channel Letter Emblem */}
          <group position={[-5.0, 0, 0.12]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.9, 0.08]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#38bdf8"
                emissiveIntensity={isNight ? 1.2 : 0.6}
              />
            </mesh>
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.3, 0.08]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#38bdf8"
                emissiveIntensity={isNight ? 1.2 : 0.6}
              />
            </mesh>
          </group>
          {/* High-End Architectural Typography in 3D */}
          <Html position={[0.4, 0, 0.14]} center transform distanceFactor={13}>
            <div className="font-extrabold text-white text-[16px] tracking-[0.25em] uppercase font-sans select-none whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              AETHERIS SUPER SPECIALITY HOSPITAL
            </div>
          </Html>
        </group>
      </group>

      {/* ========================================================
          2. WEST SURGICAL & TRAUMA WING (3-STOREY ARCHITECTURAL WING)
         ======================================================== */}
      <group position={[-16.5, 5.2, -5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[14.6, 10.4, 10.6]} />
          <meshStandardMaterial
            color={isNight ? '#0b1120' : isGolden ? '#fdf8f4' : '#f1f5f9'}
            roughness={0.35}
            metalness={0.1}
            map={archPanelTex}
          />
        </mesh>
        {/* Ribbon Windows with Architectural Head and Sill Flashing */}
        {[-2.6, 0.4, 3.4].map((y, idx) => (
          <group key={`west-ribbon-${idx}`} position={[0, y, 5.35]}>
            {/* Top and Bottom Metal Trim */}
            <mesh position={[0, 0.85, 0]}>
              <boxGeometry args={[13.2, 0.08, 0.2]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.85, 0]}>
              <boxGeometry args={[13.2, 0.08, 0.2]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            {/* Glass Pane */}
            <mesh castShadow>
              <planeGeometry args={[13.0, 1.6]} />
              <meshPhysicalMaterial
                color={isNight ? '#0369a1' : '#e0f2fe'}
                transmission={0.82}
                roughness={0.05}
                ior={1.52}
                thickness={0.4}
                reflectivity={0.6}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================
          3. EAST DIAGNOSTIC & CLINICAL WING (3-STOREY ARCHITECTURAL WING)
         ======================================================== */}
      <group position={[16.5, 5.2, -5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[14.6, 10.4, 10.6]} />
          <meshStandardMaterial
            color={isNight ? '#0b1120' : isGolden ? '#fdf8f4' : '#f1f5f9'}
            roughness={0.35}
            metalness={0.1}
            map={archPanelTex}
          />
        </mesh>
        {/* Ribbon Windows */}
        {[-2.6, 0.4, 3.4].map((y, idx) => (
          <group key={`east-ribbon-${idx}`} position={[0, y, 5.35]}>
            <mesh position={[0, 0.85, 0]}>
              <boxGeometry args={[13.2, 0.08, 0.2]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.85, 0]}>
              <boxGeometry args={[13.2, 0.08, 0.2]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh castShadow>
              <planeGeometry args={[13.0, 1.6]} />
              <meshPhysicalMaterial
                color={isNight ? '#0369a1' : '#e0f2fe'}
                transmission={0.82}
                roughness={0.05}
                ior={1.52}
                thickness={0.4}
                reflectivity={0.6}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================
          4. CANTILEVERED MAIN ENTRANCE PORTICO & SOFFIT
         ======================================================== */}
      <group position={[0, 0, 2]}>
        {/* Grand Cantilevered Canopy Roof - Matte Anthracite Cladding */}
        <mesh position={[0, 3.9, 1.8]} castShadow receiveShadow>
          <boxGeometry args={[10.6, 0.38, 6.4]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.7}
            roughness={0.25}
            normalMap={brushedMetalTex}
          />
        </mesh>

        {/* Flush Architectural Soffit Ceiling under Canopy with Recessed LED Pots */}
        <mesh position={[0, 3.69, 1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10.2, 6.0]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Recessed LED Downlight Pots */}
        {[-3.2, 0, 3.2].map((lx, idx) => (
          <group key={`downlight-${idx}`} position={[lx, 3.68, 1.8]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.22, 24]} />
              <meshBasicMaterial color="#f8fafc" />
            </mesh>
            <pointLight position={[0, -0.1, 0]} intensity={isNight ? 2.2 : 1.4} color="#f0f9ff" distance={7} />
          </group>
        ))}

        {/* Brushed Stainless Steel Support Columns (Circular Hollow Section) */}
        {[-4.6, 4.6].map((cx, idx) => (
          <group key={`canopy-col-${idx}`} position={[cx, 1.85, 4.4]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.18, 3.7, 32]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.15}
                normalMap={brushedMetalTex}
              />
            </mesh>
            {/* Cast Steel Base Flange with Anchor Bolts */}
            <mesh position={[0, -1.82, 0]}>
              <cylinderGeometry args={[0.26, 0.28, 0.08, 16]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Heavy Entrance Portal Surround Frame */}
        <mesh position={[0, 1.6, -0.85]} castShadow>
          <boxGeometry args={[4.4, 3.25, 0.35]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.25}
            map={graniteTex}
          />
        </mesh>

        {/* Header Casing housing Automatic Door Motor and Sensor */}
        <mesh position={[0, 3.12, -0.7]} castShadow>
          <boxGeometry args={[3.8, 0.28, 0.22]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>

        {/* Dual Infrared Motion Sensor Eyeballs */}
        {[-0.6, 0.6].map((sx, idx) => (
          <mesh key={`sensor-${idx}`} position={[sx, 3.12, -0.58]}>
            <boxGeometry args={[0.16, 0.08, 0.05]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive={isHoveredDoor ? '#38bdf8' : '#0284c7'}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}

        {/* Recessed Floor Guide Track */}
        <mesh position={[0, 0.02, -0.85]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.6, 0.1]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* ========================================================
            5. PHOTOREALISTIC AUTOMATIC GLASS SLIDING DOORS
           ======================================================== */}
        <group
          onClick={(e) => {
            e.stopPropagation();
            onEnterLobby();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHoverDoor(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            onHoverDoor(false);
            document.body.style.cursor = 'default';
          }}
        >
          {/* Left Sliding Door Assembly */}
          <group position={[-0.78 - doorSlideDist, 1.45, -0.85]}>
            {/* Laminated Safety Glass Panel with Real Physical Transmission */}
            <mesh castShadow>
              <boxGeometry args={[1.38, 2.72, 0.04]} />
              <meshPhysicalMaterial
                color={isHoveredDoor ? '#38bdf8' : '#e0f2fe'}
                transmission={0.92}
                opacity={1}
                transparent
                roughness={0.03}
                ior={1.52}
                thickness={0.3}
                reflectivity={0.65}
                clearcoat={1.0}
                clearcoatRoughness={0.02}
              />
            </mesh>

            {/* Stainless Steel Patch Fittings (Top & Bottom Clamps) */}
            <mesh position={[-0.55, 1.34, 0]}>
              <boxGeometry args={[0.22, 0.08, 0.06]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[-0.55, -1.34, 0]}>
              <boxGeometry args={[0.22, 0.08, 0.06]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
            </mesh>

            {/* Frosted Manifestation Safety Vision Stripes (Building Code Compliant) */}
            {[-0.3, 0.2].map((sy, idx) => (
              <mesh key={`frosted-l-${idx}`} position={[0, sy, 0.022]}>
                <planeGeometry args={[1.2, 0.06]} />
                <meshStandardMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.45}
                  roughness={0.9}
                />
              </mesh>
            ))}

            {/* Black EPDM Rubber Draft Gasket on Meeting Stile */}
            <mesh position={[0.68, 0, 0]}>
              <boxGeometry args={[0.02, 2.7, 0.05]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          </group>

          {/* Right Sliding Door Assembly */}
          <group position={[0.78 + doorSlideDist, 1.45, -0.85]}>
            <mesh castShadow>
              <boxGeometry args={[1.38, 2.72, 0.04]} />
              <meshPhysicalMaterial
                color={isHoveredDoor ? '#38bdf8' : '#e0f2fe'}
                transmission={0.92}
                opacity={1}
                transparent
                roughness={0.03}
                ior={1.52}
                thickness={0.3}
                reflectivity={0.65}
                clearcoat={1.0}
                clearcoatRoughness={0.02}
              />
            </mesh>

            {/* Patch Fittings */}
            <mesh position={[0.55, 1.34, 0]}>
              <boxGeometry args={[0.22, 0.08, 0.06]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0.55, -1.34, 0]}>
              <boxGeometry args={[0.22, 0.08, 0.06]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
            </mesh>

            {/* Frosted Vision Stripes */}
            {[-0.3, 0.2].map((sy, idx) => (
              <mesh key={`frosted-r-${idx}`} position={[0, sy, 0.022]}>
                <planeGeometry args={[1.2, 0.06]} />
                <meshStandardMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.45}
                  roughness={0.9}
                />
              </mesh>
            ))}

            {/* EPDM Rubber Gasket */}
            <mesh position={[-0.68, 0, 0]}>
              <boxGeometry args={[0.02, 2.7, 0.05]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          </group>

          {/* Recessed Foot Mat Well with Stainless Frame */}
          <mesh position={[0, 0.02, 0.25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[3.2, 1.8]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>

          {/* Interactive Entrance Instruction Pill */}
          <Html position={[0, 1.65, 0.45]} center distanceFactor={10}>
            <div
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-md select-none border ${
                isHoveredDoor
                  ? 'bg-sky-500 text-white shadow-[0_0_25px_rgba(14,165,233,0.8)] scale-105 border-white'
                  : 'bg-slate-900/90 text-cyan-200 border-cyan-500/40 shadow-lg hover:border-cyan-300'
              }`}
            >
              <LogIn className={`w-4 h-4 ${isHoveredDoor ? 'animate-bounce' : ''}`} />
              <span className="font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                Main Entrance • Click to Enter
              </span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
            </div>
          </Html>
        </group>
      </group>

      {/* ========================================================
          6. HIGH-DETAIL TYPE-III EMERGENCY AMBULANCE BAY
         ======================================================== */}
      <group position={[-18.5, 0, 1]}>
        {/* Emergency Canopy Portico */}
        <mesh position={[0, 3.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.4, 0.35, 5.4]} />
          <meshStandardMaterial color="#991b1b" metalness={0.7} roughness={0.25} />
        </mesh>
        <Html position={[0, 3.4, 2.8]} center distanceFactor={12}>
          <div className="bg-red-700 text-white font-black text-[11px] px-3.5 py-1.5 rounded-lg shadow-xl uppercase tracking-widest whitespace-nowrap border border-red-500 font-mono">
            EMERGENCY / LEVEL-1 TRAUMA BAY
          </div>
        </Html>

        {/* High-Fidelity 3D Type-III Modular Ambulance (Parked at Trauma Dock) */}
        <group position={[0, 0, 1.5]}>
          {/* Main Modular Patient Care Box Body */}
          <group position={[0, 1.45, -0.45]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.34, 1.95, 3.75]} />
              <meshStandardMaterial
                color="#ffffff"
                metalness={0.2}
                roughness={0.18}
                normalMap={noiseTex}
                normalScale={new THREE.Vector2(0.015, 0.015)}
              />
            </mesh>

            {/* Diamond-Plate Lower Perimeter Rub Rails */}
            <mesh position={[0, -0.92, 0]}>
              <boxGeometry args={[2.38, 0.12, 3.8]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.2}
                normalMap={brushedMetalTex}
              />
            </mesh>

            {/* Rear Emergency Doors with Window Glass & Chevrons */}
            <group position={[0, 0, -1.88]} rotation={[0, Math.PI, 0]}>
              {[-0.55, 0.55].map((dx, idx) => (
                <group key={`parked-rear-door-${idx}`} position={[dx, 0, 0]}>
                  <mesh position={[0, 0.45, 0.01]}>
                    <planeGeometry args={[0.55, 0.55]} />
                    <meshPhysicalMaterial
                      color="#0f172a"
                      roughness={0.05}
                      metalness={0.9}
                      transmission={0.3}
                      reflectivity={0.9}
                    />
                  </mesh>
                  <mesh position={[dx > 0 ? -0.22 : 0.22, 0, 0.015]}>
                    <boxGeometry args={[0.06, 0.12, 0.02]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
                  </mesh>
                </group>
              ))}
              <mesh position={[0, -0.55, 0.005]}>
                <planeGeometry args={[2.1, 0.7]} />
                <meshStandardMaterial color="#ef4444" roughness={0.4} />
              </mesh>
            </group>

            {/* Rear Drop Step Bumper */}
            <mesh position={[0, -0.88, -1.95]}>
              <boxGeometry args={[2.1, 0.14, 0.35]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Star of Life Decals */}
            {[-1.18, 1.18].map((sx, idx) => (
              <group
                key={`parked-side-star-${idx}`}
                position={[sx, 0.25, 0.2]}
                rotation={[0, sx > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
              >
                <mesh position={[0, 0, 0.005]}>
                  <boxGeometry args={[0.18, 0.65, 0.01]} />
                  <meshBasicMaterial color="#0284c7" />
                </mesh>
                <mesh position={[0, 0, 0.005]}>
                  <boxGeometry args={[0.65, 0.18, 0.01]} />
                  <meshBasicMaterial color="#0284c7" />
                </mesh>
              </group>
            ))}
          </group>

          {/* Aerodynamic Driver Cab Chassis */}
          <group position={[0, 1.15, 1.85]}>
            <mesh position={[0, -0.15, 0.45]} castShadow receiveShadow>
              <boxGeometry args={[2.14, 0.95, 1.45]} />
              <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0.42, 0.15]} rotation={[0.42, 0, 0]} castShadow>
              <planeGeometry args={[1.88, 0.88]} />
              <meshPhysicalMaterial
                color="#0f172a"
                roughness={0.04}
                metalness={0.92}
                transmission={0.4}
                reflectivity={0.95}
                clearcoat={1.0}
              />
            </mesh>
            <mesh position={[0, -0.22, 1.18]}>
              <boxGeometry args={[1.45, 0.48, 0.05]} />
              <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} normalMap={grilleTex} />
            </mesh>
            {[-0.82, 0.82].map((hx, idx) => (
              <mesh key={`parked-hl-${idx}`} position={[hx, -0.15, 1.18]}>
                <boxGeometry args={[0.32, 0.24, 0.04]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={isNight ? 2.5 : 0.6} />
              </mesh>
            ))}
            {[-1.18, 1.18].map((mx, idx) => (
              <mesh key={`parked-mirr-${idx}`} position={[mx, 0.28, 0.25]} castShadow>
                <boxGeometry args={[0.08, 0.28, 0.18]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </group>

          {/* Low-Profile Warning Lightbar */}
          <group position={[0, 2.48, 0.85]}>
            <mesh castShadow>
              <boxGeometry args={[1.75, 0.12, 0.32]} />
              <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.15} />
            </mesh>
            <pointLight ref={ambulanceLightRedRef} position={[-0.65, 0.25, 0]} color="#ef4444" distance={15} decay={2} />
            <pointLight ref={ambulanceLightBlueRef} position={[0.65, 0.25, 0]} color="#3b82f6" distance={15} decay={2} />
          </group>

          {/* 4 Wheels with Realistic Treads & Steel Rims */}
          {[
            { x: -1.08, z: 1.65 },
            { x: 1.08, z: 1.65 },
            { x: -1.08, z: -1.25 },
            { x: 1.08, z: -1.25 }
          ].map((w, idx) => (
            <group key={`parked-wh-${idx}`} position={[w.x, 0.38, w.z]}>
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 28]} />
                <meshStandardMaterial color="#141414" roughness={0.88} normalMap={tireTreadTex} />
              </mesh>
              <mesh position={[w.x > 0 ? 0.12 : -0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.26, 0.26, 0.04, 20]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.15} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ========================================================
          7. LANDSCAPING, ROADS, TREES, AND GROUNDS
         ======================================================== */}
      {/* Ground Grass / Natural Terrain */}
      <mesh receiveShadow position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 120]} />
        <meshStandardMaterial
          color={isNight ? '#030712' : isGolden ? '#142918' : '#1e381e'}
          roughness={0.95}
        />
      </mesh>

      {/* Heavy-Duty Asphalt Roadway with Realistic Texture */}
      <mesh receiveShadow position={[0, 0.01, 14]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 12]} />
        <meshStandardMaterial
          color="#181e26"
          roughness={0.75}
          metalness={0.05}
          map={asphaltTex}
        />
      </mesh>

      {/* Highway Yellow Center Dashes */}
      {[-40, -28, -16, -4, 8, 20, 32, 44].map((x, idx) => (
        <mesh key={`dash-${idx}`} position={[x, 0.02, 14]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.5, 0.22]} />
          <meshStandardMaterial color="#facc15" roughness={0.5} />
        </mesh>
      ))}

      {/* Photorealistic Zebra Crosswalk Stripes across the main hospital entrance */}
      {[-4.2, -3.0, -1.8, -0.6, 0.6, 1.8, 3.0, 4.2].map((zx, idx) => (
        <mesh key={`zebra-${idx}`} position={[zx, 0.025, 14]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.7, 7.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      ))}

      {/* Cast Iron Storm Drainage Grates along Curb Line */}
      {[-18, -6, 6, 18].map((gx, idx) => (
        <mesh key={`drain-${idx}`} position={[gx, 0.022, 9.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 0.5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} normalMap={grilleTex} />
        </mesh>
      ))}

      {/* Architectural Concrete Forecourt Plaza with Grout Grid */}
      <mesh receiveShadow position={[0, 0.02, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 8.4]} />
        <meshStandardMaterial
          color="#cbd5e1"
          roughness={0.4}
          metalness={0.1}
          normalMap={noiseTex}
          normalScale={new THREE.Vector2(0.03, 0.03)}
        />
      </mesh>

      {/* ADA Tactile Blister Warning Pavers on Crosswalk Curb Cuts */}
      {[-3, 3].map((tx, idx) => (
        <mesh key={`tactile-${idx}`} position={[tx, 0.028, 9.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1.8, 0.8]} />
          <meshStandardMaterial color="#eab308" roughness={0.6} />
        </mesh>
      ))}

      {/* Stainless Steel Pedestrian Safety Bollards with Reflective Tape */}
      {[-5.2, -3.8, 3.8, 5.2].map((bx, idx) => (
        <group key={`bollard-${idx}`} position={[bx, 0, 9.15]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.9, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.15} normalMap={brushedMetalTex} />
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.06, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.6} roughness={0.2} emissive="#0284c7" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}

      {/* Granite Curb Stones along Plaza Perimeter */}
      {[-14, 14].map((cx, idx) => (
        <mesh key={`curb-v-${idx}`} position={[cx, 0.08, 5]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 0.16, 8.4]} />
          <meshStandardMaterial color="#475569" roughness={0.4} map={graniteTex} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 9.2]} castShadow receiveShadow>
        <boxGeometry args={[28.25, 0.16, 0.25]} />
        <meshStandardMaterial color="#475569" roughness={0.4} map={graniteTex} />
      </mesh>

      {/* Manicured Boxwood Planter Beds with Stone Curbs */}
      {[-8.5, 8.5].map((hx, idx) => (
        <group key={`planter-${idx}`} position={[hx, 0, 6.8]}>
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.6, 0.45, 1.4]} />
            <meshStandardMaterial color="#64748b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <boxGeometry args={[5.2, 0.05, 1.0]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.65, 0]} castShadow>
            <boxGeometry args={[5.0, 0.5, 0.9]} />
            <meshStandardMaterial
              color={isGolden ? '#166534' : '#14532d'}
              roughness={0.85}
              normalMap={noiseTex}
            />
          </mesh>
        </group>
      ))}

      {/* Anatomically Realistic Branched Deciduous Trees with Organic Canopies */}
      {[
        [-13, 0, 9],
        [13, 0, 9],
        [-24, 0, 6],
        [24, 0, 6],
        [-28, 0, 12],
        [28, 0, 12],
        [-9, 0, 18],
        [9, 0, 18]
      ].map(([x, y, z], idx) => (
        <group key={`tree-${idx}`} position={[x, y, z]}>
          {/* Cast Iron Tree Root Protection Grate on ground */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 1.1, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} normalMap={grilleTex} />
          </mesh>

          {/* Tapered Trunk with Furrowed Bark Texture */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.32, 2.8, 16]} />
            <meshStandardMaterial color="#452a1b" roughness={0.92} normalMap={treeBarkTex} normalScale={new THREE.Vector2(0.8, 0.8)} />
          </mesh>

          {/* Primary Structural Branches reaching outward */}
          <group position={[0, 2.6, 0]}>
            <mesh position={[-0.45, 0.55, 0]} rotation={[0, 0, -0.55]} castShadow>
              <cylinderGeometry args={[0.1, 0.16, 1.4, 12]} />
              <meshStandardMaterial color="#452a1b" roughness={0.92} normalMap={treeBarkTex} />
            </mesh>
            <mesh position={[0.48, 0.58, 0.15]} rotation={[0.2, 0, 0.52]} castShadow>
              <cylinderGeometry args={[0.09, 0.15, 1.35, 12]} />
              <meshStandardMaterial color="#452a1b" roughness={0.92} normalMap={treeBarkTex} />
            </mesh>
            <mesh position={[0, 0.72, -0.42]} rotation={[-0.45, 0, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.14, 1.4, 12]} />
              <meshStandardMaterial color="#452a1b" roughness={0.92} normalMap={treeBarkTex} />
            </mesh>
          </group>

          {/* Multi-Tier Organic Foliage Cluster Clouds with Subsurface Feel */}
          <group position={[0, 4.2, 0]}>
            {/* Core Lower Canopy */}
            <mesh position={[0, 0, 0]} castShadow>
              <sphereGeometry args={[1.65, 18, 18]} />
              <meshStandardMaterial
                color={isGolden ? '#15803d' : '#14532d'}
                roughness={0.78}
                normalMap={noiseTex}
                normalScale={new THREE.Vector2(0.12, 0.12)}
              />
            </mesh>
            {/* Left Asymmetric Leaf Cloud */}
            <mesh position={[-0.9, 0.45, 0.3]} castShadow>
              <sphereGeometry args={[1.2, 16, 16]} />
              <meshStandardMaterial
                color={isGolden ? '#16a34a' : '#15803d'}
                roughness={0.75}
                normalMap={noiseTex}
              />
            </mesh>
            {/* Right Asymmetric Leaf Cloud */}
            <mesh position={[0.85, 0.55, -0.3]} castShadow>
              <sphereGeometry args={[1.15, 16, 16]} />
              <meshStandardMaterial
                color={isGolden ? '#16a34a' : '#166534'}
                roughness={0.75}
                normalMap={noiseTex}
              />
            </mesh>
            {/* Upper Crown Canopy */}
            <mesh position={[0.1, 1.25, 0]} castShadow>
              <sphereGeometry args={[1.05, 16, 16]} />
              <meshStandardMaterial
                color={isGolden ? '#22c55e' : '#16a34a'}
                roughness={0.72}
                normalMap={noiseTex}
              />
            </mesh>
          </group>
        </group>
      ))}

      {/* Modern Architectural Streetlight Masts with LED Fixtures */}
      {[-10, 10, -22, 22].map((lx, idx) => (
        <group key={`street-mast-${idx}`} position={[lx, 0, 9.8]}>
          {/* Vertical Square Section Column */}
          <mesh position={[0, 2.6, 0]} castShadow>
            <boxGeometry args={[0.12, 5.2, 0.12]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Horizontal Luminaire Arm */}
          <mesh position={[0, 5.2, 0.45]} castShadow>
            <boxGeometry args={[0.1, 0.08, 0.9]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* LED Optical Lens */}
          <mesh position={[0, 5.14, 0.75]}>
            <boxGeometry args={[0.22, 0.04, 0.35]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive={isNight ? '#fef08a' : '#000000'}
              emissiveIntensity={isNight ? 1.5 : 0}
            />
          </mesh>
          {isNight && (
            <pointLight position={[0, 4.9, 0.75]} intensity={2.0} color="#fef08a" distance={12} decay={2} />
          )}
        </group>
      ))}

      {/* ========================================================
          8. EAST CAMPUS VISITOR & STAFF PARKING APPRON
         ======================================================== */}
      <group position={[28, 0, 11]}>
        {/* Asphalt Parking Surface */}
        <mesh receiveShadow position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[14, 18]} />
          <meshStandardMaterial color="#1a202c" roughness={0.78} metalness={0.05} map={asphaltTex} />
        </mesh>
        {/* White Painted Parking Stall Lines */}
        {[-6, -3, 0, 3, 6].map((px, idx) => (
          <mesh key={`stall-${idx}`} position={[px, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.14, 8.5]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Realistic Moving Vehicles (Responding Ambulance & Traffic) */}
      <TrafficSystem timeOfDay={timeOfDay} />

      {/* Realistic Moving Hospital Staff & Doctors on Plaza */}
      <HospitalStaff isInterior={false} />

      {/* Photorealistic Indian Village Environment along the Approach Road */}
      <IndianVillage timeOfDay={timeOfDay} />
    </group>
  );
};
