import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  X,
  Video,
  Sparkles,
  MapPin,
  Layers,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { DepartmentData, DepartmentId } from '../../types/hospital';
import { soundManager } from '../../audio/soundManager';

export interface TourChapter {
  id: string;
  departmentId?: DepartmentId;
  isExterior?: boolean;
  title: string;
  category: string;
  floor: string;
  wing: string;
  equipment: string[];
  description: string;
  durationSeconds: number;
}

export const TOUR_CHAPTERS: TourChapter[] = [
  {
    id: 'chap_ext',
    isExterior: true,
    title: 'Hospital Complex & Emergency Heliport',
    category: 'ARCHITECTURAL EXTERIOR',
    floor: 'Campus Grounds',
    wing: 'Central Facility',
    equipment: ['Level-1 Emergency Trauma Dock', 'Rooftop Helipad', 'Responding Ambulance Bay'],
    description: 'Multi-floor tertiary medical center equipped with rooftop trauma heliport, double-glazed curtain walls, and rapid ambulance bays.',
    durationSeconds: 7.0
  },
  {
    id: 'chap_atrium',
    departmentId: 'reception',
    title: 'Atrium Reception & Patient Intake Center',
    category: 'CENTRAL ATRIUM',
    floor: 'Ground Floor',
    wing: 'Main Pavilion',
    equipment: ['Digital Intake Terminals', 'Biometric Wayfinding', 'Executive Lounge'],
    description: 'High-gloss terrazzo atrium featuring automated patient check-in kiosks, admissions triage, and comfortable family lounge seating.',
    durationSeconds: 6.5
  },
  {
    id: 'chap_mri',
    departmentId: 'mri_suite',
    title: '3.0T High-Field MRI Diagnostic Imaging Suite',
    category: 'DIAGNOSTIC RADIOLOGY',
    floor: 'Level 1',
    wing: 'North Diagnostic Wing',
    equipment: ['3.0T Superconducting Magnet', 'Liquid Helium Cryostat', 'Faraday RF Shielding'],
    description: 'Magnetically shielded Faraday examination suite delivering sub-millimeter neurovascular and musculoskeletal imaging without radiation.',
    durationSeconds: 7.5
  },
  {
    id: 'chap_ct',
    departmentId: 'ct_suite',
    title: '128-Slice Dual-Source CT & Angiography Suite',
    category: 'HIGH-SPEED COMPUTED TOMOGRAPHY',
    floor: 'Level 1',
    wing: 'North Diagnostic Wing',
    equipment: ['Dual Straton X-Ray Tubes', 'Rotating Gantry Rotor', 'Ceramic Stellar Detectors'],
    description: 'Ultra-fast dual-source computed tomography scanning an entire beating human heart in 0.25 seconds with low radiation dose.',
    durationSeconds: 7.0
  },
  {
    id: 'chap_or',
    departmentId: 'operation_theatre',
    title: 'Robot-Assisted Hybrid Surgical Theatre',
    category: 'SURGICAL ONCOLOGY & ROBOTICS',
    floor: 'Level 2',
    wing: 'West Surgical Pavilion',
    equipment: ['4-Arm Laparoscopic Surgical Robot', 'Dual Surgical LED Cupolas', 'Laminar Flow Airfield'],
    description: 'Ultra-clean positive-pressure operating room equipped with 7-DOF robotic master tele-manipulators and intraoperative fluoroscopy.',
    durationSeconds: 7.5
  },
  {
    id: 'chap_icu',
    departmentId: 'icu',
    title: 'Intensive Critical Care Resuscitation Unit (ICU)',
    category: 'CRITICAL CARE MEDICINE',
    floor: 'Level 2',
    wing: 'West Pavilion',
    equipment: ['Smart Protective Ventilator', 'Multi-Lead Telemetry Waveforms', 'Medical Gas Headwall'],
    description: 'Continuous closed-loop physiological resuscitation bay delivering adaptive lung-protective ventilation and continuous hemodynamics.',
    durationSeconds: 7.5
  },
  {
    id: 'chap_inp',
    departmentId: 'patient_room',
    title: 'Smart Inpatient Recovery Suite',
    category: 'INPATIENT CONVALESCENCE',
    floor: 'Level 3',
    wing: 'East Tower',
    equipment: ['Critical Care Smart Bed', 'Low-Air-Loss Microclimate Mattress', 'Continuous Telemetry'],
    description: 'Biophilic healing recovery suite with electric articulating smart bed, automated pressure ulcer prevention, and circadian lighting.',
    durationSeconds: 6.5
  },
  {
    id: 'chap_er',
    departmentId: 'emergency',
    title: 'Level-1 Emergency Trauma Resuscitation Bay',
    category: 'ACUTE EMERGENCY & TRAUMA',
    floor: 'Ground Floor',
    wing: 'Ambulance Bay Annex',
    equipment: ['Point-of-Care Ultrasound', 'Mobile C-Arm Fluoroscopy', 'Rapid Transfusion Setup'],
    description: 'Immediate cardiopulmonary arrest and polytrauma resuscitation suite adjoining the ambulance bay with instant bedside sonography.',
    durationSeconds: 7.0
  }
];

interface FacilitiesWalkthroughProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentChapterIndex: number;
  chapterProgress: number; // 0 to 1 within the current chapter
  onSelectChapter: (index: number) => void;
  onNextChapter: () => void;
  onPrevChapter: () => void;
  onReplay: () => void;
  onClose: () => void;
}

export const FacilitiesWalkthrough: React.FC<FacilitiesWalkthroughProps> = ({
  isPlaying,
  onTogglePlay,
  currentChapterIndex,
  chapterProgress,
  onSelectChapter,
  onNextChapter,
  onPrevChapter,
  onReplay,
  onClose
}) => {
  const currentChapter = TOUR_CHAPTERS[currentChapterIndex] || TOUR_CHAPTERS[0];

  // Keyboard shortcut listener (Space = play/pause, Esc = close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.code === 'Escape') {
        onClose();
      } else if (e.code === 'ArrowRight') {
        onNextChapter();
      } else if (e.code === 'ArrowLeft') {
        onPrevChapter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onClose, onNextChapter, onPrevChapter]);

  return (
    <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between p-4 md:p-8 select-none">
      {/* ========================================================
          1. TOP VIDEO HEADER HUD
         ======================================================== */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl glass-panel border-cyan-500/40 shadow-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <div className="flex items-center gap-2 font-mono text-xs">
            <Video className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold tracking-widest uppercase">
              CINEMATIC 3D FACILITIES TOUR
            </span>
            <span className="text-cyan-300 hidden sm:inline">• 4K WALKTHROUGH</span>
          </div>
        </div>

        {/* Close Walkthrough Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="p-3 rounded-2xl glass-panel text-slate-300 hover:text-white hover:border-red-400 hover:bg-red-500/20 transition-all cursor-pointer shadow-2xl group flex items-center gap-2"
          title="Exit Tour (Esc)"
        >
          <span className="text-xs font-semibold hidden sm:inline text-slate-300 group-hover:text-white">
            Exit Walkthrough
          </span>
          <X className="w-4 h-4 text-slate-300 group-hover:text-red-400" />
        </button>
      </div>

      {/* ========================================================
          2. CINEMATIC LOWER-THIRD FACILITY INFORMATION CARD
         ======================================================== */}
      <div className="max-w-xl text-left pointer-events-auto animate-in fade-in slide-in-from-bottom duration-300">
        <div className="p-4 md:p-5 rounded-3xl glass-panel border-cyan-500/40 shadow-2xl flex flex-col gap-2.5">
          {/* Facility Location Tags */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-800">
              {currentChapter.category}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentChapter.floor} • {currentChapter.wing}</span>
            </div>
          </div>

          {/* Facility Title */}
          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
            {currentChapter.title}
          </h2>

          {/* Description */}
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-light">
            {currentChapter.description}
          </p>

          {/* Equipment Available on Site */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold mr-1">
              FACILITY HIGHLIGHTS:
            </span>
            {currentChapter.equipment.map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900/90 text-cyan-200 border border-slate-700 flex items-center gap-1"
              >
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          3. FULL VIDEO TRANSPORT & TIMELINE CONTROL DECK
         ======================================================== */}
      <div className="w-full max-w-4xl mx-auto pointer-events-auto flex flex-col gap-2.5">
        {/* Scrubber Bar with Chapter Segments */}
        <div className="p-2.5 rounded-2xl glass-panel border-cyan-500/40 shadow-2xl flex flex-col gap-2">
          {/* Multi-Segment Timeline Track */}
          <div className="flex items-center gap-1.5 w-full h-3">
            {TOUR_CHAPTERS.map((chap, idx) => {
              const isPast = idx < currentChapterIndex;
              const isCurrent = idx === currentChapterIndex;
              const segProgress = isPast ? 1 : isCurrent ? chapterProgress : 0;

              return (
                <div
                  key={chap.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectChapter(idx);
                  }}
                  className="flex-1 h-2 rounded-full bg-slate-800/80 hover:bg-slate-700 cursor-pointer relative overflow-hidden transition-all group"
                  title={`${idx + 1}. ${chap.title}`}
                >
                  {/* Fill progress inside chapter segment */}
                  <div
                    className={`h-full transition-all duration-100 ${
                      isCurrent ? 'bg-gradient-to-r from-sky-400 to-cyan-300' : 'bg-sky-500'
                    }`}
                    style={{ width: `${segProgress * 100}%` }}
                  />
                  {/* Hover tooltip label */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 border border-slate-700 text-[10px] text-white rounded whitespace-nowrap pointer-events-none transition-opacity z-50 shadow-xl">
                    {idx + 1}. {chap.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transport Buttons Bar */}
          <div className="flex items-center justify-between pt-1">
            {/* Left: Replay & Skip Prev */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onReplay();
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Replay from Beginning"
              >
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Replay</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onPrevChapter();
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                title="Previous Facility"
              >
                <SkipBack className="w-4 h-4" />
              </button>
            </div>

            {/* Center: Main Play / Pause Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onTogglePlay();
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-cyan-500/40 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Tour</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Tour</span>
                  </>
                )}
              </button>

              <div className="text-xs font-mono text-cyan-300 hidden md:block">
                FACILITY {currentChapterIndex + 1} OF {TOUR_CHAPTERS.length}
              </div>
            </div>

            {/* Right: Skip Next & Close */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onNextChapter();
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                title="Next Facility"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                title="Close Walkthrough"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
