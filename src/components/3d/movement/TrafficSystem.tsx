import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TimeOfDay } from '../../../types/hospital';
import {
  getMicroNoiseTexture,
  getBrushedMetalTexture,
  getTireTreadTexture,
  getCarGrilleTexture
} from '../materials/proceduralTextures';

interface TrafficSystemProps {
  timeOfDay: TimeOfDay;
}

/**
 * Photorealistic Automotive Wheel Assembly
 * Includes treaded radial rubber tire, alloy wheel rim, center hub cap,
 * ventilated steel disc brake rotor, and hydraulic brake caliper.
 */
const RealisticWheel: React.FC<{
  radius?: number;
  width?: number;
  isFront?: boolean;
  steerAngle?: number;
  rotationRef?: (el: THREE.Group | null) => void;
  tireTreadTex: THREE.CanvasTexture;
  brushedMetalTex: THREE.CanvasTexture;
}> = ({
  radius = 0.36,
  width = 0.24,
  isFront = false,
  steerAngle = 0,
  rotationRef,
  tireTreadTex,
  brushedMetalTex
}) => {
  const steerGroupRef = useRef<THREE.Group>(null);
  const spinGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (steerGroupRef.current && isFront) {
      steerGroupRef.current.rotation.y = steerAngle;
    }
  });

  return (
    <group ref={steerGroupRef}>
      <group
        ref={(el) => {
          spinGroupRef.current = el;
          if (rotationRef) rotationRef(el);
        }}
      >
        {/* Rubber Tire with Deep Tread & Sidewall Chamfer */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[radius, radius, width, 32]} />
          <meshStandardMaterial
            color="#141414"
            roughness={0.88}
            metalness={0.05}
            normalMap={tireTreadTex}
            normalScale={new THREE.Vector2(0.8, 0.8)}
          />
        </mesh>

        {/* Outer Wheel Rim / Alloy Face */}
        <group position={[width * 0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[radius * 0.72, radius * 0.72, 0.02, 24]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.92}
              roughness={0.16}
              normalMap={brushedMetalTex}
            />
          </mesh>
          {/* Multi-Spoke Alloy Architecture */}
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`spoke-${i}`} rotation={[0, 0, (i / 5) * Math.PI * 2]}>
              <boxGeometry args={[radius * 0.08, radius * 1.35, 0.025]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
          {/* Chrome Center Hub Cap */}
          <mesh position={[0, 0, 0.012]}>
            <cylinderGeometry args={[radius * 0.22, radius * 0.22, 0.02, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* Static Brake Rotor and Caliper (Stationary inside the wheel) */}
      <group position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        {/* Ventilated Steel Disc Brake Rotor */}
        <mesh>
          <cylinderGeometry args={[radius * 0.58, radius * 0.58, 0.02, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.25} />
        </mesh>
        {/* High-Performance Red/Charcoal Brake Caliper */}
        <mesh position={[0, radius * 0.45, 0]}>
          <boxGeometry args={[radius * 0.35, radius * 0.22, 0.045]} />
          <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

export const TrafficSystem: React.FC<TrafficSystemProps> = ({ timeOfDay }) => {
  const isNight = timeOfDay === 'night';

  const noiseTex = useMemo(() => getMicroNoiseTexture(), []);
  const brushedMetalTex = useMemo(() => getBrushedMetalTexture(), []);
  const tireTreadTex = useMemo(() => getTireTreadTexture(), []);
  const grilleTex = useMemo(() => getCarGrilleTexture(), []);

  // Moving Vehicle Group & Wheel References
  const ambulanceRef = useRef<THREE.Group>(null);
  const ambulanceChassisRef = useRef<THREE.Group>(null);
  const ambWheelsRef = useRef<THREE.Group[]>([]);
  const ambSteerAngle = useRef<number>(0);
  const ambStrobeRedRef = useRef<THREE.PointLight>(null);
  const ambStrobeBlueRef = useRef<THREE.PointLight>(null);

  const car1Ref = useRef<THREE.Group>(null);
  const car1ChassisRef = useRef<THREE.Group>(null);
  const car1WheelsRef = useRef<THREE.Group[]>([]);

  const car2Ref = useRef<THREE.Group>(null);
  const car2ChassisRef = useRef<THREE.Group>(null);
  const car2WheelsRef = useRef<THREE.Group[]>([]);

  const vanRef = useRef<THREE.Group>(null);
  const vanChassisRef = useRef<THREE.Group>(null);
  const vanWheelsRef = useRef<THREE.Group[]>([]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // ========================================================
    // 1. ADVANCED RESPONDING EMERGENCY AMBULANCE DYNAMICS
    // ========================================================
    if (ambulanceRef.current && ambulanceChassisRef.current) {
      const cycle = (t % 38) / 38; // 38s realistic traffic loop
      let x = 0;
      let z = 0;
      let rotY = 0;
      let speed = 0;
      let steer = 0;
      let roll = 0;
      let pitch = 0;

      if (cycle < 0.34) {
        // Phase 1: Rapid straight-line response along main roadway (X from 52 down to -10)
        const p1 = cycle / 0.34;
        x = 52 - p1 * 62;
        z = 14.8;
        rotY = -Math.PI / 2;
        speed = 62 / (0.34 * 38);
        steer = 0;
        roll = 0;
        // Mild acceleration pitch squat at beginning, level out
        pitch = p1 < 0.1 ? 0.025 : 0;
      } else if (cycle < 0.48) {
        // Phase 2: Decelerates, steers smoothly 90° into emergency ramp
        const p2 = (cycle - 0.34) / 0.14;
        const smoothP = Math.sin(p2 * (Math.PI / 2));
        x = -10 - smoothP * 8.5;
        z = 14.8 - (1 - Math.cos(p2 * (Math.PI / 2))) * 11.5;
        rotY = -Math.PI / 2 + p2 * (Math.PI / 2);
        speed = (1 - p2 * 0.6) * 7.5;
        // Natural steering angle & centrifugal body roll
        steer = Math.sin(p2 * Math.PI) * 0.42; // Front wheels turn up to ~24°
        roll = -Math.sin(p2 * Math.PI) * 0.055; // Body leans away from turn
        pitch = -0.035; // Front nose dives under braking
      } else if (cycle < 0.78) {
        // Phase 3: Parked stationary at Trauma Dock (X = -18.5, Z = 3.3)
        x = -18.5;
        z = 3.3;
        rotY = 0;
        speed = 0;
        steer = 0;
        roll = 0;
        pitch = 0;
      } else {
        // Phase 4: Departs from dock, accelerates, merges back into westbound lane
        const p4 = (cycle - 0.78) / 0.22;
        x = -18.5 - p4 * 34;
        z = 3.3 + Math.sin(p4 * Math.PI) * 4.2 + p4 * 11.5;
        rotY = -Math.PI / 2 - (1 - p4) * 0.25;
        speed = 5.5 + p4 * 6.5;
        steer = -Math.sin(p4 * Math.PI) * 0.28;
        roll = Math.sin(p4 * Math.PI) * 0.035;
        pitch = 0.02; // Acceleration squat
      }

      ambulanceRef.current.position.set(x, 0, z);
      ambulanceRef.current.rotation.y = rotY;

      // Chassis dynamic suspension reaction
      ambulanceChassisRef.current.rotation.z = roll;
      ambulanceChassisRef.current.rotation.x = pitch;
      ambSteerAngle.current = steer;

      // Wheel rotation proportional to linear velocity
      const wheelSpin = (speed * delta) / 0.38;
      ambWheelsRef.current.forEach((w) => {
        if (w) w.rotation.x += wheelSpin;
      });

      // Emergency Lightbar Strobe System (Dual-pulse wig-wag)
      if (ambStrobeRedRef.current && ambStrobeBlueRef.current) {
        const isResponding = speed > 0.1 || cycle < 0.85;
        const strobe = Math.sin(t * 16);
        ambStrobeRedRef.current.intensity = isResponding && strobe > 0.2 ? 4.5 : 0.05;
        ambStrobeBlueRef.current.intensity = isResponding && strobe < -0.2 ? 4.5 : 0.05;
      }
    }

    // ========================================================
    // 2. CIVILIAN METALLIC SILVER EXECUTIVE SEDAN (WESTBOUND)
    // ========================================================
    if (car1Ref.current && car1ChassisRef.current) {
      const car1Speed = 9.8; // ~35 km/h
      const dist = 110;
      const progress = ((t * car1Speed) % dist) / dist;
      const x = 55 - progress * dist;
      const z = 12.6;

      car1Ref.current.position.set(x, 0, z);
      car1Ref.current.rotation.y = -Math.PI / 2;

      // Gentle suspension vibrations over roadway texture
      const roadVibe = Math.sin(t * 18) * 0.003;
      car1ChassisRef.current.position.y = roadVibe;

      const wheelSpin = (car1Speed * delta) / 0.35;
      car1WheelsRef.current.forEach((w) => {
        if (w) w.rotation.x += wheelSpin;
      });
    }

    // ========================================================
    // 3. CIVILIAN NAVY BLUE METALLIC SUV (EASTBOUND)
    // ========================================================
    if (car2Ref.current && car2ChassisRef.current) {
      const car2Speed = 10.5;
      const dist = 120;
      const progress = ((t * car2Speed + 45) % dist) / dist;
      const x = -60 + progress * dist;
      const z = 15.6;

      car2Ref.current.position.set(x, 0, z);
      car2Ref.current.rotation.y = Math.PI / 2;

      const wheelSpin = (car2Speed * delta) / 0.38;
      car2WheelsRef.current.forEach((w) => {
        if (w) w.rotation.x -= wheelSpin; // Opposite lane
      });
    }

    // ========================================================
    // 4. HOSPITAL PHARMACEUTICAL LOGISTICS VAN
    // ========================================================
    if (vanRef.current && vanChassisRef.current) {
      const vanSpeed = 8.2;
      const dist = 115;
      const progress = ((t * vanSpeed + 80) % dist) / dist;
      const x = 55 - progress * dist;
      const z = 12.6;

      vanRef.current.position.set(x, 0, z);
      vanRef.current.rotation.y = -Math.PI / 2;

      const wheelSpin = (vanSpeed * delta) / 0.37;
      vanWheelsRef.current.forEach((w) => {
        if (w) w.rotation.x += wheelSpin;
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================
          1. HIGH-FIDELITY MODULAR EMERGENCY AMBULANCE
         ======================================================== */}
      <group ref={ambulanceRef} position={[50, 0, 14.8]}>
        {/* Chassis Assembly with dynamic suspension tilt */}
        <group ref={ambulanceChassisRef}>
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

            {/* High-Visibility Diamond-Plate Lower Perimeter Rub Rails */}
            <mesh position={[0, -0.92, 0]}>
              <boxGeometry args={[2.38, 0.12, 3.8]} />
              <meshStandardMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.2}
                normalMap={brushedMetalTex}
              />
            </mesh>

            {/* Retroreflective Emergency Chevron Decals on Rear Door */}
            <group position={[0, 0, -1.88]} rotation={[0, Math.PI, 0]}>
              {/* Double Rear Emergency Doors with Window Glass */}
              {[-0.55, 0.55].map((dx, idx) => (
                <group key={`rear-door-${idx}`} position={[dx, 0, 0]}>
                  {/* Tinted Safety Glass Window */}
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
                  {/* Stainless Steel Heavy-Duty Paddle Latch Handle */}
                  <mesh position={[dx > 0 ? -0.22 : 0.22, 0, 0.015]}>
                    <boxGeometry args={[0.06, 0.12, 0.02]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
                  </mesh>
                </group>
              ))}

              {/* Fluorescent Yellow & Red Hazard Chevrons on lower rear doors */}
              <mesh position={[0, -0.55, 0.005]}>
                <planeGeometry args={[2.1, 0.7]} />
                <meshStandardMaterial color="#ef4444" roughness={0.4} />
              </mesh>
            </group>

            {/* Rear Cast Aluminum Drop Step Bumper */}
            <mesh position={[0, -0.88, -1.95]}>
              <boxGeometry args={[2.1, 0.14, 0.35]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Side Star of Life Medical Cross Badging */}
            {[-1.18, 1.18].map((sx, idx) => (
              <group
                key={`side-star-${idx}`}
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

            {/* High-Intensity Side Scene Floodlights */}
            {[-1.18, 1.18].map((sx, idx) => (
              <mesh key={`scene-light-${idx}`} position={[sx, 0.85, 0.5]}>
                <boxGeometry args={[0.04, 0.08, 0.25]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
              </mesh>
            ))}
          </group>

          {/* Aerodynamic Front Driver Cab (Sprinter / Transit Style Cutaway) */}
          <group position={[0, 1.15, 1.85]}>
            {/* Hood & Engine Compartment */}
            <mesh position={[0, -0.15, 0.45]} castShadow receiveShadow>
              <boxGeometry args={[2.14, 0.95, 1.45]} />
              <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.18} />
            </mesh>

            {/* Sloped Raked Aerodynamic Windshield */}
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

            {/* Front Radiator Grille with Chrome Trim & Mesh */}
            <mesh position={[0, -0.22, 1.18]}>
              <boxGeometry args={[1.45, 0.48, 0.05]} />
              <meshStandardMaterial
                color="#1e293b"
                metalness={0.85}
                roughness={0.2}
                normalMap={grilleTex}
              />
            </mesh>

            {/* Projector LED Headlights with Integrated Turn Indicators */}
            {[-0.82, 0.82].map((hx, idx) => (
              <group key={`headlight-${idx}`} position={[hx, -0.15, 1.18]}>
                <mesh>
                  <boxGeometry args={[0.32, 0.24, 0.04]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={isNight ? 3.0 : 0.8}
                  />
                </mesh>
                {/* Night Driving Light Beam Spotlight */}
                {isNight && (
                  <spotLight
                    position={[0, 0, 0.2]}
                    angle={0.5}
                    penumbra={0.3}
                    intensity={5.0}
                    color="#ffffff"
                    target-position={[hx * 2, -1.2, 18]}
                  />
                )}
              </group>
            ))}

            {/* Commercial Side View Mirrors with Turn Signal Repeaters */}
            {[-1.18, 1.18].map((mx, idx) => (
              <group key={`mirror-${idx}`} position={[mx, 0.28, 0.25]}>
                <mesh castShadow>
                  <boxGeometry args={[0.08, 0.28, 0.18]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Mirror Glass Reflection */}
                <mesh position={[mx > 0 ? -0.042 : 0.042, 0, -0.01]}>
                  <planeGeometry args={[0.02, 0.24]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.98} roughness={0.05} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Low-Profile Aerodynamic Emergency Warning Lightbar */}
          <group position={[0, 2.48, 0.85]}>
            <mesh castShadow>
              <boxGeometry args={[1.75, 0.12, 0.32]} />
              <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Left High-Intensity Red Strobe */}
            <mesh position={[-0.65, 0.02, 0]}>
              <boxGeometry args={[0.42, 0.08, 0.26]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.5} />
            </mesh>
            {/* Right High-Intensity Blue Strobe */}
            <mesh position={[0.65, 0.02, 0]}>
              <boxGeometry args={[0.42, 0.08, 0.26]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={3.5} />
            </mesh>
            <pointLight ref={ambStrobeRedRef} position={[-0.65, 0.25, 0]} color="#ef4444" distance={18} decay={2} />
            <pointLight ref={ambStrobeBlueRef} position={[0.65, 0.25, 0]} color="#3b82f6" distance={18} decay={2} />
          </group>
        </group>

        {/* 4 Realistic Wheels with Radial Treads & Brake Calipers */}
        {[
          { x: -1.08, z: 1.65, isFront: true, key: 'fl' },
          { x: 1.08, z: 1.65, isFront: true, key: 'fr' },
          { x: -1.08, z: -1.25, isFront: false, key: 'rl' },
          { x: 1.08, z: -1.25, isFront: false, key: 'rr' }
        ].map((w, idx) => (
          <group key={`amb-wheel-${w.key}`} position={[w.x, 0.38, w.z]}>
            <RealisticWheel
              radius={0.38}
              width={0.24}
              isFront={w.isFront}
              steerAngle={w.isFront ? ambSteerAngle.current : 0}
              rotationRef={(el) => { if (el) ambWheelsRef.current[idx] = el; }}
              tireTreadTex={tireTreadTex}
              brushedMetalTex={brushedMetalTex}
            />
          </group>
        ))}
      </group>

      {/* ========================================================
          2. METALLIC SILVER EXECUTIVE SEDAN (WESTBOUND)
         ======================================================== */}
      <group ref={car1Ref} position={[0, 0, 12.6]}>
        <group ref={car1ChassisRef}>
          {/* Sculpted Aerodynamic Car Body with Metallic Clearcoat */}
          <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.88, 0.62, 4.55]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.88}
              roughness={0.14}
              normalMap={brushedMetalTex}
            />
          </mesh>

          {/* Greenhouse Glass Cabin with A/B/C Pillars */}
          <group position={[0, 1.12, -0.15]}>
            <mesh castShadow>
              <boxGeometry args={[1.56, 0.52, 2.35]} />
              <meshPhysicalMaterial
                color="#0f172a"
                roughness={0.03}
                metalness={0.92}
                transmission={0.45}
                reflectivity={0.98}
                clearcoat={1.0}
              />
            </mesh>
            {/* Center B-Pillar Gloss Black Accent */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.58, 0.5, 0.08]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
            </mesh>
          </group>

          {/* Front Bumper, Hexagonal Radiator Grille & Chrome Badge */}
          <mesh position={[0, 0.48, 2.3]}>
            <boxGeometry args={[1.4, 0.32, 0.06]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.9}
              roughness={0.18}
              normalMap={grilleTex}
            />
          </mesh>

          {/* Slanted Projector LED Headlights */}
          {[-0.72, 0.72].map((hx, idx) => (
            <group key={`c1-hl-${idx}`} position={[hx, 0.55, 2.29]}>
              <mesh>
                <boxGeometry args={[0.3, 0.14, 0.04]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={isNight ? 2.8 : 0.6}
                />
              </mesh>
            </group>
          ))}

          {/* Sleek Rear LED Taillight Bar */}
          <mesh position={[0, 0.68, -2.29]}>
            <boxGeometry args={[1.68, 0.1, 0.04]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={isNight ? 2.5 : 0.8}
            />
          </mesh>
        </group>

        {/* 4 Multi-Spoke 18-inch Wheels */}
        {[
          { x: -0.96, z: 1.45, key: 'fl' },
          { x: 0.96, z: 1.45, key: 'fr' },
          { x: -0.96, z: -1.35, key: 'rl' },
          { x: 0.96, z: -1.35, key: 'rr' }
        ].map((w, idx) => (
          <group key={`c1-wheel-${w.key}`} position={[w.x, 0.34, w.z]}>
            <RealisticWheel
              radius={0.34}
              width={0.22}
              rotationRef={(el) => { if (el) car1WheelsRef.current[idx] = el; }}
              tireTreadTex={tireTreadTex}
              brushedMetalTex={brushedMetalTex}
            />
          </group>
        ))}
      </group>

      {/* ========================================================
          3. NAVY BLUE METALLIC LUXURY CROSSOVER SUV (EASTBOUND)
         ======================================================== */}
      <group ref={car2Ref} position={[-60, 0, 15.6]}>
        <group ref={car2ChassisRef}>
          {/* Elevated SUV Body with Satin Black Cladding */}
          <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.98, 0.78, 4.65]} />
            <meshStandardMaterial
              color="#0f2b48"
              metalness={0.85}
              roughness={0.16}
            />
          </mesh>

          {/* SUV Cabin with Chrome Roof Rails */}
          <group position={[0, 1.34, -0.15]}>
            <mesh castShadow>
              <boxGeometry args={[1.68, 0.64, 2.65]} />
              <meshPhysicalMaterial
                color="#0f172a"
                roughness={0.03}
                metalness={0.9}
                transmission={0.4}
                reflectivity={0.98}
              />
            </mesh>
            {/* Satin Chrome Roof Rails */}
            {[-0.75, 0.75].map((rx, idx) => (
              <mesh key={`roof-rail-${idx}`} position={[rx, 0.35, 0]}>
                <boxGeometry args={[0.04, 0.05, 2.3]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
              </mesh>
            ))}
          </group>

          {/* Front Grille & Matrix Headlights */}
          <mesh position={[0, 0.62, 2.34]}>
            <boxGeometry args={[1.52, 0.42, 0.06]} />
            <meshStandardMaterial color="#020617" metalness={0.8} roughness={0.2} normalMap={grilleTex} />
          </mesh>
          {[-0.76, 0.76].map((hx, idx) => (
            <mesh key={`c2-hl-${idx}`} position={[hx, 0.72, 2.34]}>
              <boxGeometry args={[0.32, 0.16, 0.04]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={isNight ? 2.8 : 0.6}
              />
            </mesh>
          ))}
        </group>

        {/* 20-inch SUV Wheels */}
        {[
          { x: -1.02, z: 1.5, key: 'fl' },
          { x: 1.02, z: 1.5, key: 'fr' },
          { x: -1.02, z: -1.4, key: 'rl' },
          { x: 1.02, z: -1.4, key: 'rr' }
        ].map((w, idx) => (
          <group key={`c2-wheel-${w.key}`} position={[w.x, 0.4, w.z]}>
            <RealisticWheel
              radius={0.4}
              width={0.26}
              rotationRef={(el) => { if (el) car2WheelsRef.current[idx] = el; }}
              tireTreadTex={tireTreadTex}
              brushedMetalTex={brushedMetalTex}
            />
          </group>
        ))}
      </group>

      {/* ========================================================
          4. HOSPITAL PHARMACEUTICAL SUPPLY TRANSPORT VAN
         ======================================================== */}
      <group ref={vanRef} position={[55, 0, 12.6]}>
        <group ref={vanChassisRef}>
          {/* High-Roof Commercial Van Body with Hospital Fleet Decals */}
          <mesh position={[0, 1.25, -0.3]} castShadow receiveShadow>
            <boxGeometry args={[2.08, 1.75, 4.6]} />
            <meshStandardMaterial
              color="#f8fafc"
              metalness={0.25}
              roughness={0.22}
              normalMap={noiseTex}
            />
          </mesh>

          {/* Cyan Medical Logistics Stripe */}
          <mesh position={[0, 1.15, -0.3]}>
            <boxGeometry args={[2.1, 0.22, 4.62]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>

          {/* Sloped Windshield and Cab */}
          <mesh position={[0, 1.35, 1.55]} rotation={[0.38, 0, 0]} castShadow>
            <planeGeometry args={[1.82, 0.85]} />
            <meshPhysicalMaterial
              color="#0f172a"
              roughness={0.04}
              metalness={0.9}
              transmission={0.4}
              reflectivity={0.9}
            />
          </mesh>

          {/* Van Headlights */}
          {[-0.78, 0.78].map((hx, idx) => (
            <mesh key={`van-hl-${idx}`} position={[hx, 0.72, 2.02]}>
              <boxGeometry args={[0.28, 0.22, 0.04]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={isNight ? 2.5 : 0.6}
              />
            </mesh>
          ))}
        </group>

        {/* Commercial Van Wheels */}
        {[
          { x: -1.02, z: 1.55, key: 'fl' },
          { x: 1.02, z: 1.55, key: 'fr' },
          { x: -1.02, z: -1.45, key: 'rl' },
          { x: 1.02, z: -1.45, key: 'rr' }
        ].map((w, idx) => (
          <group key={`van-wheel-${w.key}`} position={[w.x, 0.36, w.z]}>
            <RealisticWheel
              radius={0.36}
              width={0.22}
              rotationRef={(el) => { if (el) vanWheelsRef.current[idx] = el; }}
              tireTreadTex={tireTreadTex}
              brushedMetalTex={brushedMetalTex}
            />
          </group>
        ))}
      </group>
    </group>
  );
};
