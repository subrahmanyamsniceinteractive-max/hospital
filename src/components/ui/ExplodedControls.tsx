import React, { useState } from 'react';
import {
  RotateCcw,
  Compass,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Info,
  ShieldAlert,
  Zap,
  Activity,
  ArrowLeft,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { EquipmentData, ExplodedPart } from '../../types/hospital';
import { soundManager } from '../../audio/soundManager';

interface ExplodedControlsProps {
  equipment: EquipmentData;
  explodedProgress: number;
  onSetExplodedProgress: (val: number) => void;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetView: () => void;
  onReassemble: () => void;
  onExploreParts: () => void;
  onBackToDepartment: () => void;
}

export const ExplodedControls: React.FC<ExplodedControlsProps> = ({
  equipment,
  explodedProgress,
  onSetExplodedProgress,
  selectedPartId,
  onSelectPart,
  isAutoRotate,
  onToggleAutoRotate,
  onResetView,
  onReassemble,
  onExploreParts,
  onBackToDepartment
}) => {
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  // Find active selected part
  const activePartIndex = equipment.parts.findIndex((p) => p.id === selectedPartId);
  const activePart: ExplodedPart | undefined =
    activePartIndex >= 0 ? equipment.parts[activePartIndex] : equipment.parts[0];

  const handleNextPart = () => {
    soundManager.playClick();
    const nextIndex = (activePartIndex + 1) % equipment.parts.length;
    onSelectPart(equipment.parts[nextIndex].id);
    if (explodedProgress < 0.5) {
      onExploreParts();
    }
  };

  const handlePrevPart = () => {
    soundManager.playClick();
    const prevIndex = (activePartIndex - 1 + equipment.parts.length) % equipment.parts.length;
    onSelectPart(equipment.parts[prevIndex].id);
    if (explodedProgress < 0.5) {
      onExploreParts();
    }
  };

  return (
    <>
      {/* ========================================================
          1. BOTTOM EXPLODED VIEW CONTROLLER HUD
         ======================================================== */}
      <div className="absolute bottom-6 inset-x-0 mx-auto max-w-4xl px-4 z-30 pointer-events-auto flex flex-col gap-3">
        {/* Parts Quick Chips Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 rounded-2xl glass-panel max-w-full no-scrollbar">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 shrink-0">
            COMPONENTS ({equipment.parts.length}):
          </span>
          {equipment.parts.map((part) => {
            const isSelected = selectedPartId === part.id;
            return (
              <button
                key={part.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectPart(part.id);
                  if (explodedProgress < 0.4) onExploreParts();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-300 shadow-md shadow-sky-500/40 scale-105'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700/60 hover:border-cyan-400 hover:text-white'
                }`}
              >
                {part.name}
              </button>
            );
          })}
        </div>

        {/* Main Floating Control Deck */}
        <div className="p-3.5 rounded-2xl glass-panel border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
          {/* Left: Reassemble & Explore Parts Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
            <button
              onClick={() => {
                soundManager.playAssemble();
                onReassemble();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                explodedProgress === 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reassemble</span>
            </button>

            <button
              onClick={() => {
                soundManager.playExplode();
                onExploreParts();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg ${
                explodedProgress > 0.8
                  ? 'bg-sky-500 text-white shadow-sky-500/40 border border-sky-300'
                  : 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-400 hover:to-cyan-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Explore Parts</span>
            </button>

            <button
              onClick={onBackToDepartment}
              className="md:hidden px-3 py-2 rounded-xl text-xs bg-slate-800 text-slate-300 hover:text-white"
            >
              Back
            </button>
          </div>

          {/* Center: Exploded Progress Range Slider */}
          <div className="flex items-center gap-3 w-full md:max-w-xs">
            <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>ASSEMBLED (0%)</span>
                <span className="text-cyan-300 font-bold">{Math.round(explodedProgress * 100)}% EXPLODED</span>
                <span>SEPARATED (100%)</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedProgress}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onSetExplodedProgress(val);
                }}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
              />
            </div>
          </div>

          {/* Right: Component Step & View Controls */}
          <div className="flex items-center gap-1.5 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={handlePrevPart}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Previous Component"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-2 text-cyan-300 font-semibold">
                {activePartIndex + 1}/{equipment.parts.length}
              </span>
              <button
                onClick={handleNextPart}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Next Component"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onToggleAutoRotate}
              className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                isAutoRotate
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="Rotate 360°"
            >
              {isAutoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={onResetView}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowSpecsModal(true)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Equipment Specifications"
            >
              <Info className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. TOP LEFT: ACTIVE COMPONENT INSPECTION CARD
         ======================================================== */}
      {activePart && (
        <div className="absolute top-20 left-4 md:left-8 w-80 md:w-96 z-20 pointer-events-auto text-left animate-in fade-in slide-in-from-left duration-300">
          <div className="p-4 md:p-5 rounded-2xl glass-panel border-cyan-500/40 shadow-2xl flex flex-col gap-3">
            {/* Header badges */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                {activePart.category}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                PART {activePartIndex + 1} OF {equipment.parts.length}
              </span>
            </div>

            {/* Component Name */}
            <h2 className="text-lg md:text-xl font-bold text-white leading-tight">
              {activePart.name}
            </h2>

            {/* Short Clinical Explanation */}
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-light">
              {activePart.shortDesc}
            </p>

            {/* Clinical Purpose Box */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1 text-[11px]">
                <Activity className="w-3.5 h-3.5" />
                <span>Clinical Role in Medicine</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {activePart.clinicalRole}
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold mb-1 text-[11px]">
                <Zap className="w-3.5 h-3.5" />
                <span>Engineering & Physics Specs</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {activePart.specs}
              </p>
            </div>

            {/* Safety Protocol */}
            <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-red-950/20 p-2.5 rounded-lg border border-red-900/30">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{activePart.safetyProtocol}</span>
            </div>

            {/* Step navigation buttons inside card */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handlePrevPart}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev Part</span>
              </button>
              <button
                onClick={handleNextPart}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>Next Part</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. FULL EQUIPMENT SPECIFICATIONS MODAL
         ======================================================== */}
      {showSpecsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
          <div className="w-full max-w-2xl p-6 rounded-3xl glass-panel border-cyan-500/40 shadow-2xl text-left flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  {equipment.modelCode}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {equipment.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Manufactured by: {equipment.manufacturer}
                </p>
              </div>
              <button
                onClick={() => setShowSpecsModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 mb-1 font-mono">
                  Technological Overview
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {equipment.overview}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 mb-1 font-mono">
                  Clinical Significance
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {equipment.clinicalSignificance}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 mb-2 font-mono">
                  Key Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {equipment.keySpecs.map((spec, idx) => (
                    <div key={idx} className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-slate-400 font-mono text-[10px] uppercase">{spec.label}</div>
                      <div className="text-cyan-300 font-semibold mt-0.5">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSpecsModal(false)}
                className="px-5 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-400 transition-colors cursor-pointer"
              >
                Close & Return to 3D Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
