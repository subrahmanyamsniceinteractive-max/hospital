import React from 'react';
import { ArrowLeft, Compass, Layers, Users, Stethoscope, ChevronRight, Sparkles } from 'lucide-react';
import { DepartmentData, EquipmentData, EquipmentId } from '../../types/hospital';
import { soundManager } from '../../audio/soundManager';

interface DepartmentExplorerProps {
  department: DepartmentData;
  allEquipment: EquipmentData[];
  onSelectEquipment: (eqId: EquipmentId) => void;
  onBackToLobby: () => void;
}

export const DepartmentExplorer: React.FC<DepartmentExplorerProps> = ({
  department,
  allEquipment,
  onSelectEquipment,
  onBackToLobby
}) => {
  const departmentEquipment = allEquipment.filter((eq) =>
    department.equipmentIds.includes(eq.id)
  );

  return (
    <div className="absolute top-20 left-4 md:left-8 w-80 md:w-96 z-20 pointer-events-auto text-left animate-in fade-in slide-in-from-left duration-300">
      <div className="p-4 md:p-5 rounded-2xl glass-panel border-cyan-500/40 shadow-2xl flex flex-col gap-3">
        {/* Department Header */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border"
            style={{
              backgroundColor: `${department.color}25`,
              borderColor: `${department.color}60`,
              color: department.color
            }}
          >
            {department.code} • {department.floor}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {department.wing}
          </span>
        </div>

        {/* Department Name */}
        <h2 className="text-xl font-bold text-white leading-tight">
          {department.name}
        </h2>

        {/* Description */}
        <p className="text-xs text-slate-200 leading-relaxed font-light">
          {department.description}
        </p>

        {/* Clinical Focus */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1 text-[11px]">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Specialties</span>
          </div>
          <p className="text-slate-300 text-xs leading-snug">
            {department.clinicalFocus}
          </p>
        </div>

        {/* Key Staff */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <Users className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-[11px] leading-snug text-slate-300">{department.keyStaff}</span>
        </div>

        {/* Available Medical Equipment */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Suite Medical Equipment ({departmentEquipment.length})</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {departmentEquipment.map((eq) => (
              <button
                key={eq.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectEquipment(eq.id);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {eq.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {eq.modelCode}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-1 rounded border border-cyan-800 shrink-0 group-hover:scale-105 transition-transform">
                  <span>3D EXPLODE</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              soundManager.playClick();
              onBackToLobby();
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Lobby</span>
          </button>

          <div className="text-[10px] font-mono text-cyan-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Click 3D Model in Room</span>
          </div>
        </div>
      </div>
    </div>
  );
};
