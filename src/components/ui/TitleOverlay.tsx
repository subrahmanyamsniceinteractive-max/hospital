import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Activity, Wind, Video } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface TitleOverlayProps {
  onEnter: () => void;
  isHoveredDoor: boolean;
  onStartFacilitiesTour?: () => void;
}

export const TitleOverlay: React.FC<TitleOverlayProps> = ({
  onEnter,
  isHoveredDoor,
  onStartFacilitiesTour
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-20">
      {/* Top Header Live Status */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass-panel text-xs text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono font-semibold tracking-wider">AETHERIS HEALTHCARE • LEVEL-1 TRAUMA ACTIVE</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-300 glass-panel px-4 py-1.5 rounded-full">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>HEPA: 99.98%</span>
          </div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1.5 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FARADAY CAGE: 100%</span>
          </div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1.5 text-sky-300">
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>LAMINAR FLOW: ON</span>
          </div>
        </div>
      </div>

      {/* Center Cinematic Title & Prompt */}
      <div className="max-w-2xl text-left pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>Next-Generation Medical Visualization</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none mb-4 font-sans drop-shadow-2xl">
          EXPLORE THE FUTURE <br />
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
            OF HEALTHCARE
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-200 font-light mb-8 max-w-xl leading-relaxed drop-shadow">
          Step inside. Discover how modern medicine works through interactive 3D architecture and exploded medical technology.
        </p>

        {/* Call to action & interactive instructions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={() => {
              soundManager.playDoorOpen();
              onEnter();
            }}
            className={`group px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-xl ${
              isHoveredDoor
                ? 'bg-sky-400 text-slate-950 scale-105 shadow-cyan-500/50'
                : 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-400 hover:to-cyan-400 hover:scale-105 shadow-sky-500/30'
            }`}
          >
            <span>Enter Hospital</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Premium "Explore Hospital Facilities" Button */}
          {onStartFacilitiesTour && (
            <button
              onClick={() => {
                soundManager.playClick();
                onStartFacilitiesTour();
              }}
              className="group px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center gap-2.5 cursor-pointer shadow-2xl glass-panel border-cyan-400/60 hover:border-cyan-300 hover:bg-cyan-500/20 text-white hover:scale-105"
            >
              <Video className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 animate-pulse" />
              <span>Explore Hospital Facilities</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </button>
          )}

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300/90 glass-panel-light px-3.5 py-2.5 rounded-lg border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Click entrance to enter</span>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Credits */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono pointer-events-auto">
        <div>ORBIT: Drag with mouse to inspect exterior building</div>
        <div>SCROLL: Zoom in / out</div>
      </div>
    </div>
  );
};
