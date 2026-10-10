import React, { useEffect, useRef, useState } from 'react';
import { TimeOfDay } from '../../types/hospital';

interface CinematicPostFXProps {
  isCinemaLetterbox: boolean;
  timeOfDay: TimeOfDay;
  isDriving: boolean;
  speed: number;
  showECG: boolean;
}

export const CinematicPostFX: React.FC<CinematicPostFXProps> = ({
  isCinemaLetterbox,
  timeOfDay,
  isDriving,
  speed,
  showECG
}) => {
  const isRain = timeOfDay === 'rain';
  const isGolden = timeOfDay === 'golden';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bpm] = useState<number>(72);

  // Real-time Canvas ECG Waveform Oscilloscope
  useEffect(() => {
    if (!showECG) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // ECG points pattern
    const getECGValue = (phase: number) => {
      const p = phase % 1;
      if (p < 0.15) return 0; // Baseline
      if (p < 0.22) return -3; // P wave
      if (p < 0.28) return 0; // PR segment
      if (p < 0.31) return 3; // Q dip
      if (p < 0.35) return -24; // R peak (upward sharp spike)
      if (p < 0.39) return 7; // S dip
      if (p < 0.44) return 0; // ST segment
      if (p < 0.54) return -5; // T wave
      return 0; // TP baseline
    };

    let phase = 0;
    const draw = () => {
      // Fade existing trail
      ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      const currentY = midY + getECGValue(phase);
      ctx.moveTo(x, currentY);

      x = (x + 2) % width;
      phase += 0.015;

      const nextY = midY + getECGValue(phase);
      ctx.lineTo(x, nextY);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [showECG]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* ========================================================
          1. 2.39:1 ANAMORPHIC CINEMASCOPE LETTERBOX BARS
         ======================================================== */}
      {isCinemaLetterbox && (
        <>
          <div className="absolute top-0 left-0 right-0 h-[8vh] bg-black border-b border-cyan-500/20 shadow-2xl transition-all duration-700 z-40 flex items-center justify-between px-6">
            <span className="font-mono text-[10px] tracking-widest text-cyan-400/80 uppercase">
              • AETHERIS CINEMATIC SCOPE 2.39:1 • AP RURAL-TO-TRAUMA VISTA •
            </span>
            <span className="font-mono text-[10px] tracking-wider text-slate-400">
              4K DCI HDR • 24 FPS
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-black border-t border-cyan-500/20 shadow-2xl transition-all duration-700 z-40 flex items-center justify-between px-6">
            <span className="font-mono text-[10px] tracking-wider text-slate-500">
              PHYSICALLY ACCURATE LIGHTING & ARCHITECTURAL PBR
            </span>
            <span className="font-mono text-[10px] tracking-widest text-emerald-400">
              ONLINE • TELEMETRY ACTIVE
            </span>
          </div>
        </>
      )}

      {/* ========================================================
          2. DYNAMIC SPEED MOTION VIGNETTE (During Vehicular Drive)
         ======================================================== */}
      {isDriving && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle, transparent 55%, rgba(6, 182, 212, 0.08) 85%, rgba(3, 7, 18, 0.45) 100%)',
            boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.6)'
          }}
        />
      )}

      {/* ========================================================
          3. RAINDROPS & MOISTURE ON CAMERA LENS (Monsoon Rain Mode)
         ======================================================== */}
      {isRain && (
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-black/30 backdrop-blur-[0.5px]">
          {/* Animated subtle rain streak overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-slate-900/10 pointer-events-none" />
        </div>
      )}

      {/* ========================================================
          4. GOLDEN HOUR ANAMORPHIC SUN STREAK FLARE
         ======================================================== */}
      {isGolden && (
        <div
          className="absolute top-12 right-1/4 w-96 h-1 opacity-60 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(254, 215, 170, 0.8) 50%, transparent)',
            filter: 'blur(2px)',
            transform: 'rotate(-12deg)'
          }}
        />
      )}

      {/* ========================================================
          5. LIVE BIOMEDICAL ECG OSCILLOSCOPE BADGE
         ======================================================== */}
      {showECG && (
        <div className="absolute bottom-6 left-6 pointer-events-auto flex items-center gap-3 glass-panel px-3.5 py-2 rounded-2xl border-cyan-500/30 backdrop-blur-md shadow-2xl">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={110}
              height={32}
              className="rounded-lg bg-gray-950/80 border border-cyan-500/20"
            />
            <div className="absolute top-1 left-2 text-[9px] font-mono text-cyan-400 font-semibold tracking-wider">
              ECG-II
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{bpm}</span>
              <span className="text-[10px] text-cyan-300 font-normal">BPM</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400">SINUS RHYTHM</span>
          </div>
        </div>
      )}
    </div>
  );
};
