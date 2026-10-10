import React from 'react';
import {
  Sparkles,
  Sun,
  Sunset,
  CloudRain,
  Moon,
  Zap,
  Activity,
  Film,
  Wind,
  Volume2,
  VolumeX,
  X,
  Radio
} from 'lucide-react';
import { TimeOfDay, VFXConfig } from '../../types/hospital';

interface VFXControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  timeOfDay: TimeOfDay;
  onSelectTimeOfDay: (tod: TimeOfDay) => void;
  vfxConfig: VFXConfig;
  onToggleVFX: (key: keyof VFXConfig) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onTriggerThunder: () => void;
  onTriggerLaserScan: () => void;
}

export const VFXControlPanel: React.FC<VFXControlPanelProps> = ({
  isOpen,
  onClose,
  timeOfDay,
  onSelectTimeOfDay,
  vfxConfig,
  onToggleVFX,
  isMuted,
  onToggleMute,
  onTriggerThunder,
  onTriggerLaserScan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-cyan-500/40 p-6 md:p-8 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-cyan-400">
                Visual & Atmospheric FX Engine
              </div>
              <h2 className="text-xl font-bold tracking-wide text-white">
                Special Effects Studio (స్పెషల్ ఎఫెక్ట్స్)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-5 max-h-[75vh] overflow-y-auto pr-1">
          {/* ========================================================
              1. WEATHER & ATMOSPHERIC LIGHTING MODE
             ======================================================== */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase flex items-center gap-2">
                <Sun className="w-3.5 h-3.5" />
                Atmospheric Environment Mode
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Dynamic Sun & Sky</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Daylight */}
              <button
                onClick={() => onSelectTimeOfDay('day')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  timeOfDay === 'day'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Sun className={`w-5 h-5 mb-1.5 ${timeOfDay === 'day' ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">Clear Daylight</span>
                <span className="text-[10px] text-slate-400">సూర్యోదయం</span>
              </button>

              {/* Golden Hour */}
              <button
                onClick={() => onSelectTimeOfDay('golden')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  timeOfDay === 'golden'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Sunset className={`w-5 h-5 mb-1.5 ${timeOfDay === 'golden' ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">Golden Hour</span>
                <span className="text-[10px] text-slate-400">గోల్డెన్ అవర్</span>
              </button>

              {/* Monsoon Rain */}
              <button
                onClick={() => onSelectTimeOfDay('rain')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  timeOfDay === 'rain'
                    ? 'bg-blue-600/25 border-blue-400 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <CloudRain className={`w-5 h-5 mb-1.5 ${timeOfDay === 'rain' ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">Monsoon Rain</span>
                <span className="text-[10px] text-blue-300">వర్షం & చినుకులు</span>
              </button>

              {/* Midnight Neon */}
              <button
                onClick={() => onSelectTimeOfDay('night')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  timeOfDay === 'night'
                    ? 'bg-indigo-600/25 border-indigo-400 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Moon className={`w-5 h-5 mb-1.5 ${timeOfDay === 'night' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">Midnight Neon</span>
                <span className="text-[10px] text-indigo-300">రాత్రి నియాన్</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              2. SPECIAL VFX TOGGLE SWITCHES
             ======================================================== */}
          <div>
            <div className="text-xs font-mono tracking-widest text-cyan-300 uppercase mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Active Special Visual Effects (VFX)
            </div>

            <div className="space-y-2.5">
              {/* Volumetric Sun God Rays */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Volumetric Sun God Rays</div>
                    <div className="text-[11px] text-slate-400">Crepuscular light shafts filtering through palm trees</div>
                  </div>
                </div>
                <button
                  onClick={() => onToggleVFX('godRays')}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    vfxConfig.godRays ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      vfxConfig.godRays ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Atmospheric Dust Motes & Chai Steam */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-300 flex items-center justify-center">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Dust Motes & Chai Steam</div>
                    <div className="text-[11px] text-slate-400">Golden floating pollen particles + tea stall steam</div>
                  </div>
                </div>
                <button
                  onClick={() => onToggleVFX('dustMotes')}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    vfxConfig.dustMotes ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      vfxConfig.dustMotes ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Medical Diagnostic Laser Scanner & Hologram */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Holographic Laser Scanner</div>
                    <div className="text-[11px] text-slate-400">Diagnostic slicing beam & concentric 3D telemetry rings</div>
                  </div>
                </div>
                <button
                  onClick={() => onToggleVFX('laserScanner')}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    vfxConfig.laserScanner ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      vfxConfig.laserScanner ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 2.39:1 CinemaScope Anamorphic Letterbox */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">2.39:1 CinemaScope Bars</div>
                    <div className="text-[11px] text-slate-400">Ultra-wide cinema black bars with telemetry HUD</div>
                  </div>
                </div>
                <button
                  onClick={() => onToggleVFX('cinemaLetterbox')}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    vfxConfig.cinemaLetterbox ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      vfxConfig.cinemaLetterbox ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Live Biomedical ECG Monitor */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Live Patient ECG Oscilloscope</div>
                    <div className="text-[11px] text-slate-400">Real-time Sinus Rhythm 72 BPM heartbeat waveform</div>
                  </div>
                </div>
                <button
                  onClick={() => onToggleVFX('telemetryHolo')}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    vfxConfig.telemetryHolo ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      vfxConfig.telemetryHolo ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              3. INTERACTIVE AUDIO & SFX TRIGGERS
             ======================================================== */}
          <div>
            <div className="text-xs font-mono tracking-widest text-cyan-300 uppercase mb-3 flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5" />
              Interactive Sound FX Triggers
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onTriggerThunder}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-3 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Play Thunder</div>
                  <div className="text-[10px] text-slate-400">ఉరుము శబ్దం</div>
                </div>
              </button>

              <button
                onClick={onTriggerLaserScan}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-3 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Laser Scan SFX</div>
                  <div className="text-[10px] text-slate-400">లేజర్ స్కాన్ సౌండ్</div>
                </div>
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                Master Procedural Audio
              </span>
              <button
                onClick={onToggleMute}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                  isMuted ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isMuted ? 'MUTED' : 'ACTIVE'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-cyan-500/20 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            AETHERIS REAL-TIME SHADER ENGINE
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wider transition-all shadow-lg shadow-cyan-500/25"
          >
            APPLY & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
