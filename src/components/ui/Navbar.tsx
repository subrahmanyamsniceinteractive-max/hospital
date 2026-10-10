import React, { useState } from 'react';
import {
  Building2,
  Compass,
  Layers,
  Sun,
  Sunset,
  Moon,
  Volume2,
  VolumeX,
  ChevronDown,
  ArrowLeft,
  ChevronRight,
  Activity,
  Video,
  CloudRain,
  Sparkles
} from 'lucide-react';
import {
  SceneMode,
  DepartmentData,
  EquipmentData,
  DepartmentId,
  EquipmentId,
  TimeOfDay
} from '../../types/hospital';
import { soundManager } from '../../audio/soundManager';

interface NavbarProps {
  sceneMode: SceneMode;
  timeOfDay: TimeOfDay;
  onChangeTimeOfDay: (time: TimeOfDay) => void;
  activeDepartment: DepartmentData | null;
  activeEquipment: EquipmentData | null;
  allDepartments: DepartmentData[];
  allEquipment: EquipmentData[];
  onReturnOutside: () => void;
  onBackToLobby: () => void;
  onSelectDepartment: (deptId: DepartmentId) => void;
  onSelectEquipment: (eqId: EquipmentId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onStartFacilitiesTour?: () => void;
  onOpenVFXPanel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sceneMode,
  timeOfDay,
  onChangeTimeOfDay,
  activeDepartment,
  activeEquipment,
  allDepartments,
  allEquipment,
  onReturnOutside,
  onBackToLobby,
  onSelectDepartment,
  onSelectEquipment,
  isMuted,
  onToggleMute,
  onStartFacilitiesTour,
  onOpenVFXPanel
}) => {
  const [isDeptMenuOpen, setIsDeptMenuOpen] = useState(false);
  const [isTechMenuOpen, setIsTechMenuOpen] = useState(false);

  // If in exterior mode, title overlay handles opening scene header
  if (sceneMode === 'exterior') {
    return (
      <header className="absolute top-0 right-0 p-6 z-30 pointer-events-auto flex items-center gap-2">
        {/* Explore Hospital Facilities Button */}
        {onStartFacilitiesTour && (
          <button
            onClick={() => {
              soundManager.playClick();
              onStartFacilitiesTour();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border-cyan-400/60 hover:border-cyan-300 text-xs font-bold text-white bg-cyan-950/40 hover:bg-cyan-500/20 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 group"
            title="Cinematic 3D Facilities Tour"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform animate-pulse" />
            <span>Explore Facilities</span>
          </button>
        )}

        {/* Time of day toggles */}
        <div className="flex items-center gap-1 p-1 rounded-xl glass-panel">
          <button
            onClick={() => onChangeTimeOfDay('day')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              timeOfDay === 'day' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Daylight"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeTimeOfDay('golden')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              timeOfDay === 'golden' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Golden Hour / Sunset"
          >
            <Sunset className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeTimeOfDay('night')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              timeOfDay === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Night Mode"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Mute */}
        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
        </button>
      </header>
    );
  }

  return (
    <header className="absolute top-0 inset-x-0 p-4 md:px-8 z-30 flex items-center justify-between pointer-events-auto">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div
          onClick={onReturnOutside}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-panel cursor-pointer hover:border-cyan-400 transition-all select-none"
        >
          <div className="w-6 h-6 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/40">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white tracking-wider font-mono">
            AETHERIS
          </span>
        </div>

        {/* Breadcrumb Hierarchy */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 glass-panel px-3 py-1.5 rounded-xl font-medium">
          <button
            onClick={onReturnOutside}
            className="hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Exterior</span>
          </button>

          <ChevronRight className="w-3 h-3 text-slate-600" />

          <button
            onClick={onBackToLobby}
            className={`hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer ${
              sceneMode === 'lobby' ? 'text-cyan-300 font-bold' : ''
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Central Lobby</span>
          </button>

          {activeDepartment && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className={`font-medium ${sceneMode === 'department' ? 'text-cyan-300 font-bold' : 'text-slate-300'}`}>
                {activeDepartment.shortName}
              </span>
            </>
          )}

          {activeEquipment && sceneMode === 'equipment_studio' && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-sky-400 font-bold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>3D Exploded Studio</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Center Navigation Shortcuts */}
      <div className="flex items-center gap-2">
        {/* Return outside */}
        <button
          onClick={onReturnOutside}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Outside</span>
        </button>

        {/* Back to Lobby if inside a department or studio */}
        {sceneMode !== 'lobby' && (
          <button
            onClick={onBackToLobby}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/40 text-xs text-sky-300 hover:bg-sky-500/30 transition-all cursor-pointer font-semibold"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Back to Lobby</span>
          </button>
        )}

        {/* Departments Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsDeptMenuOpen(!isDeptMenuOpen);
              setIsTechMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-200 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Explore Departments</span>
            <span className="sm:hidden">Departments</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isDeptMenuOpen && (
            <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto w-64 p-2 rounded-2xl glass-panel border-cyan-500/40 shadow-2xl flex flex-col gap-1 z-50">
              <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold border-b border-slate-800">
                Hospital Departments
              </div>
              {allDepartments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => {
                    onSelectDepartment(dept.id);
                    setIsDeptMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                    activeDepartment?.id === dept.id
                      ? 'bg-sky-500/20 text-sky-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div>
                    <div>{dept.shortName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{dept.floor}</div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {dept.code}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Medical Technology Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsTechMenuOpen(!isTechMenuOpen);
              setIsDeptMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-200 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Medical Tech (3D)</span>
            <span className="sm:hidden">Equipment</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isTechMenuOpen && (
            <div className="absolute top-full mt-2 right-0 w-72 p-2 rounded-2xl glass-panel border-cyan-500/40 shadow-2xl flex flex-col gap-1 z-50">
              <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold border-b border-slate-800">
                Inspectable 3D Medical Equipment
              </div>
              {allEquipment.map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => {
                    onSelectEquipment(eq.id);
                    setIsTechMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                    activeEquipment?.id === eq.id && sceneMode === 'equipment_studio'
                      ? 'bg-sky-500/20 text-sky-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="pr-2">
                    <div className="font-semibold line-clamp-1">{eq.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{eq.modelCode}</div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800 shrink-0">
                    3D EXPLODE
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Explore Hospital Facilities Cinematic Tour Button */}
        {onStartFacilitiesTour && (
          <button
            onClick={() => {
              soundManager.playClick();
              onStartFacilitiesTour();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-cyan-400/50 text-xs text-cyan-200 hover:text-white hover:border-cyan-300 hover:bg-cyan-500/30 transition-all cursor-pointer font-semibold shadow-lg shadow-cyan-500/20 group"
            title="Cinematic 3D Hospital Facilities Walkthrough"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform animate-pulse" />
            <span className="hidden sm:inline">Explore Facilities</span>
            <span className="sm:hidden">Tour</span>
          </button>
        )}
      </div>

      {/* Right Controls: Lighting presets, VFX Studio & Audio */}
      <div className="flex items-center gap-2">
        {/* Special Effects (VFX) Studio Button */}
        {onOpenVFXPanel && (
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenVFXPanel();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/40 text-xs text-purple-200 hover:text-white hover:border-cyan-300 transition-all font-semibold shadow-lg shadow-purple-500/20 cursor-pointer"
            title="Special Effects & Atmosphere Studio (VFX) - స్పెషల్ ఎఫెక్ట్స్"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden md:inline">VFX Studio</span>
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl glass-panel">
          <button
            onClick={() => onChangeTimeOfDay('day')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              timeOfDay === 'day' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Daylight"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeTimeOfDay('golden')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              timeOfDay === 'golden' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Golden Hour Sunset"
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeTimeOfDay('rain')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              timeOfDay === 'rain' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Monsoon Rain Mode (వర్షం)"
          >
            <CloudRain className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeTimeOfDay('night')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              timeOfDay === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Midnight Neon Mode"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onToggleMute}
          className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
        </button>
      </div>
    </header>
  );
};
