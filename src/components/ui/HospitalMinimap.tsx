import React, { useState } from 'react';
import { Map, Layers, Compass, ArrowRight, X } from 'lucide-react';
import { DepartmentData, DepartmentId } from '../../types/hospital';
import { soundManager } from '../../audio/soundManager';

interface HospitalMinimapProps {
  isOpen: boolean;
  onClose: () => void;
  departments: DepartmentData[];
  activeDeptId: DepartmentId | null;
  onSelectDepartment: (deptId: DepartmentId) => void;
}

export const HospitalMinimap: React.FC<HospitalMinimapProps> = ({
  isOpen,
  onClose,
  departments,
  activeDeptId,
  onSelectDepartment
}) => {
  const [selectedFloor, setSelectedFloor] = useState<string>('All');

  if (!isOpen) return null;

  const floors = ['All', 'Ground Floor', 'Level 1', 'Level 2', 'Level 3', 'Sub-Level 1'];

  const filteredDepts = selectedFloor === 'All'
    ? departments
    : departments.filter((d) => d.floor === selectedFloor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-4xl p-6 rounded-3xl glass-panel border-cyan-500/40 shadow-2xl text-left flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Map className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Hospital Interactive Architectural Wayfinder
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Aetheris Medical Center • Real-Time Spatial Navigation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Floor Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {floors.map((fl) => (
            <button
              key={fl}
              onClick={() => setSelectedFloor(fl)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedFloor === fl
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {fl}
            </button>
          ))}
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-h-[55vh] overflow-y-auto pr-2">
          {filteredDepts.map((dept) => {
            const isActive = activeDeptId === dept.id;
            return (
              <div
                key={dept.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectDepartment(dept.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left ${
                  isActive
                    ? 'bg-sky-500/20 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase"
                      style={{ backgroundColor: `${dept.color}25`, color: dept.color }}
                    >
                      {dept.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dept.floor}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white mb-1 leading-snug">
                    {dept.shortName}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {dept.clinicalFocus}
                  </p>
                </div>

                <div
                  className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold"
                  style={{ color: dept.color }}
                >
                  <span className="text-[11px]">Teleport Here</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
