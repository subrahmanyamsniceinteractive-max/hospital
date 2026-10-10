export type SceneMode = 
  | 'exterior' 
  | 'approaching_entrance'
  | 'lobby' 
  | 'department' 
  | 'equipment_studio'
  | 'cinematic_tour';

export type TimeOfDay = 'day' | 'golden' | 'rain' | 'night';

export interface VFXConfig {
  godRays: boolean;
  dustMotes: boolean;
  chaiSteam: boolean;
  rainEffect: boolean;
  laserScanner: boolean;
  telemetryHolo: boolean;
  cinemaLetterbox: boolean;
  ambientSoundtrack: boolean;
}

export type DepartmentId = 
  | 'reception'
  | 'mri_suite'
  | 'ct_suite'
  | 'operation_theatre'
  | 'icu'
  | 'patient_room'
  | 'laboratory'
  | 'emergency';

export type EquipmentId = 
  | 'mri_scanner'
  | 'ct_scanner'
  | 'ventilator'
  | 'patient_monitor'
  | 'surgical_robot'
  | 'icu_bed'
  | 'xray_c_arm'
  | 'ultrasound';

export interface ExplodedPart {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  clinicalRole: string;
  specs: string;
  safetyProtocol: string;
  offset: [number, number, number]; // Vector applied when exploded = 1.0
  rotationOffset?: [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
  wireframe?: boolean;
  glow?: boolean;
}

export interface EquipmentData {
  id: EquipmentId;
  name: string;
  modelCode: string;
  manufacturer: string;
  departmentId: DepartmentId;
  tagline: string;
  overview: string;
  clinicalSignificance: string;
  keySpecs: { label: string; value: string }[];
  parts: ExplodedPart[];
  defaultCameraPos: [number, number, number];
  defaultTarget: [number, number, number];
}

export interface DepartmentData {
  id: DepartmentId;
  name: string;
  shortName: string;
  code: string;
  floor: string;
  wing: string;
  description: string;
  clinicalFocus: string;
  keyStaff: string;
  equipmentIds: EquipmentId[];
  primaryEquipmentId?: EquipmentId;
  lobbyPosition: [number, number, number]; // Hotspot position in the 3D lobby
  roomCameraPos: [number, number, number];
  roomCameraTarget: [number, number, number];
  color: string;
  icon: string;
}
