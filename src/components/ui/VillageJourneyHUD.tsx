import React, { useState, useEffect } from 'react';
import {
  Compass,
  Navigation,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Mouse,
  Sparkles,
  MapPin,
  Building2,
  ChevronRight,
  Gauge
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface VillageJourneyHUDProps {
  journeyProgress: number; // 0.0 to 1.0
  onSeekJourney: (progress: number) => void;
  isAutoDriving: boolean;
  onToggleAutoDrive: () => void;
  onSkipToHospital: () => void;
  onEnterHospital?: () => void;
  onStartFacilitiesTour?: () => void;
  onOpenVFXPanel?: () => void;
}

const MILESTONES = [
  { progress: 0.0, label: 'Kothapalli Village', icon: '🏡', sub: 'Manduva House & Tiffin Point' },
  { progress: 0.35, label: 'Paddy & Banana Groves', icon: '🌾', sub: 'Vari Polam & Coconut Palms' },
  { progress: 0.70, label: 'Sacred Banyan & Canal', icon: '🌳', sub: 'Marri Chettu & Highway Milestone' },
  { progress: 1.0, label: 'Aetheris Medical Campus', icon: '🏥', sub: 'Super-Speciality Hospital' }
];

export const VillageJourneyHUD: React.FC<VillageJourneyHUDProps> = ({
  journeyProgress,
  onSeekJourney,
  isAutoDriving,
  onToggleAutoDrive,
  onSkipToHospital,
  onEnterHospital,
  onStartFacilitiesTour,
  onOpenVFXPanel
}) => {
  const [speed, setSpeed] = useState<number>(0);
  const isArrived = journeyProgress >= 0.95;

  // Calculate distance remaining in km or meters
  const totalKm = 1.5;
  const remainingKm = Math.max(0, totalKm * (1 - journeyProgress));
  const distanceFormatted =
    remainingKm >= 0.1
      ? `${remainingKm.toFixed(1)} km`
      : `${Math.round(remainingKm * 1000)} meters`;

  // Dynamic simulated speed indicator
  useEffect(() => {
    if (isAutoDriving) {
      setSpeed(38);
    } else {
      setSpeed(0);
    }
  }, [isAutoDriving]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-8">
      {/* ========================================================
          TOP HEADER: CORRIDOR ROUTE & TELEMETRY BADGE
         ======================================================== */}
      <div className="flex items-start justify-between gap-4 pointer-events-auto">
        {/* Route Details Card */}
        <div className="glass-panel px-4 py-2.5 rounded-2xl border-cyan-500/30 shadow-2xl backdrop-blur-md flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Navigation className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SH-36 Andhra Corridor • Coastal Rural Highway</span>
            </div>
            <div className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>Kothapalli Village</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-cyan-300">Aetheris Super Speciality Hospital</span>
            </div>
          </div>
        </div>

        {/* Real-time Distance & Speed Telemetry */}
        <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 rounded-2xl glass-panel border-cyan-500/30 text-xs font-mono text-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Distance</div>
              <div className="font-bold text-white text-sm">{distanceFormatted}</div>
            </div>
          </div>

          <div className="w-px h-7 bg-slate-700/60" />

          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-sky-400" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Road Speed</div>
              <div className="font-bold text-cyan-300 text-sm">
                {isAutoDriving ? '38 km/h' : isArrived ? '0 km/h (Forecourt)' : 'Cruise'}
              </div>
            </div>
          </div>

          <div className="w-px h-7 bg-slate-700/60" />

          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Bearing</div>
              <div className="font-bold text-amber-300 text-sm">North-East 032°</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          CENTER FLOATING PROMPT (When in early village journey)
         ======================================================== */}
      {!isArrived && journeyProgress < 0.15 && !isAutoDriving && (
        <div className="self-center glass-panel px-6 py-3.5 rounded-2xl border-cyan-400/40 shadow-2xl flex items-center gap-3 animate-bounce pointer-events-auto">
          <Mouse className="w-5 h-5 text-cyan-300" />
          <div className="text-xs font-medium text-slate-100">
            <span className="font-bold text-white">Scroll mouse wheel</span> or press{' '}
            <span className="text-cyan-300 font-bold">Auto-Drive</span> to travel toward the hospital
          </div>
        </div>
      )}

      {/* ========================================================
          BOTTOM INTERACTIVE JOURNEY CONTROLLER & TIMELINE
         ======================================================== */}
      <div className="w-full max-w-4xl mx-auto pointer-events-auto space-y-3">
        {/* Milestone Steps Bar */}
        <div className="glass-panel px-5 py-3 rounded-2xl border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase tracking-wider">Scenic Road Journey</span>
              <span className="text-slate-400">•</span>
              <span className="text-white font-bold">{Math.round(journeyProgress * 100)}% Traveled</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Auto Drive Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onToggleAutoDrive();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                  isAutoDriving
                    ? 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 hover:text-white'
                }`}
                title="Toggle smooth automated camera drive to hospital"
              >
                {isAutoDriving ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoDriving ? 'Pause Drive' : 'Auto-Drive'}</span>
              </button>

              {/* Special Effects & Atmosphere Studio (VFX) Button */}
              {onOpenVFXPanel && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenVFXPanel();
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/40 text-purple-200 hover:text-white hover:border-cyan-300 flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-purple-500/20"
                  title="Special Effects & Weather Studio (స్పెషల్ ఎఫెక్ట్స్)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                  <span>VFX Studio</span>
                </button>
              )}

              {/* Skip to Hospital Button */}
              {!isArrived && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSkipToHospital();
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-1 cursor-pointer transition-all"
                  title="Fast-forward directly to hospital forecourt"
                >
                  <FastForward className="w-3.5 h-3.5 text-sky-400" />
                  <span>Arrive at Hospital</span>
                </button>
              )}

              {/* Replay Village Journey Button when arrived */}
              {isArrived && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSeekJourney(0);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-1 cursor-pointer transition-all"
                  title="Restart village-to-hospital road journey"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Re-drive Village Road</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Timeline Track */}
          <div className="relative pt-1 pb-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.002"
              value={journeyProgress}
              onChange={(e) => onSeekJourney(parseFloat(e.target.value))}
              className="w-full h-2.5 bg-slate-800/90 rounded-lg appearance-none cursor-ew-resize accent-cyan-400 transition-all focus:outline-none"
            />

            {/* Visual Milestones along track */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {MILESTONES.map((m, idx) => {
                const isActive = journeyProgress >= m.progress - 0.05;
                const isCurrent =
                  Math.abs(journeyProgress - m.progress) < 0.2 ||
                  (m.progress === 1.0 && journeyProgress >= 0.85);

                return (
                  <button
                    key={`mile-${idx}`}
                    onClick={() => {
                      soundManager.playClick();
                      onSeekJourney(m.progress);
                    }}
                    className={`text-left p-1.5 rounded-xl transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-500/15 border border-cyan-400/40 text-white'
                        : 'hover:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span>{m.icon}</span>
                      <span className={`truncate ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                        {m.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate pl-5 hidden sm:block">
                      {m.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
