import React, { useState, useEffect, useRef } from 'react';
import {
  SceneMode,
  DepartmentId,
  EquipmentId,
  TimeOfDay,
  VFXConfig,
  DepartmentData,
  EquipmentData
} from './types/hospital';
import { DEPARTMENTS, EQUIPMENT_LIST } from './data/hospitalData';
import { HospitalScene } from './components/3d/HospitalScene';
import { TitleOverlay } from './components/ui/TitleOverlay';
import { Navbar } from './components/ui/Navbar';
import { ExplodedControls } from './components/ui/ExplodedControls';
import { DepartmentExplorer } from './components/ui/DepartmentExplorer';
import { HospitalMinimap } from './components/ui/HospitalMinimap';
import { FacilitiesWalkthrough, TOUR_CHAPTERS } from './components/ui/FacilitiesWalkthrough';
import { VillageJourneyHUD } from './components/ui/VillageJourneyHUD';
import { CinematicPostFX } from './components/ui/CinematicPostFX';
import { VFXControlPanel } from './components/ui/VFXControlPanel';
import { soundManager } from './audio/soundManager';
import { Map, Layers, HelpCircle, Activity, Sparkles } from 'lucide-react';

export function App() {
  // Navigation & Scene States
  const [sceneMode, setSceneMode] = useState<SceneMode>('exterior');
  const [activeDeptId, setActiveDeptId] = useState<DepartmentId | null>(null);
  const [activeEqId, setActiveEqId] = useState<EquipmentId | null>(null);
 
  // Village-to-Hospital Road Journey States
  const [journeyProgress, setJourneyProgress] = useState<number>(0); // 0 = Village Center, 1 = Hospital Entrance
  const [isAutoDriving, setIsAutoDriving] = useState<boolean>(false);

  // Cinematic Facilities Tour Walkthrough States
  const [tourChapterIndex, setTourChapterIndex] = useState<number>(0);
  const [tourProgress, setTourProgress] = useState<number>(0);
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(true);

  // Environmental lighting
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');

  // Interactive door animation state
  const [doorOpenProgress, setDoorOpenProgress] = useState<number>(0);
  const [isHoveredDoor, setIsHoveredDoor] = useState<boolean>(false);

  // Exploded View States
  const [explodedProgress, setExplodedProgress] = useState<number>(0);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);

  // Hover states
  const [hoveredDeptId, setHoveredDeptId] = useState<DepartmentId | null>(null);
  const [hoveredEqId, setHoveredEqId] = useState<EquipmentId | null>(null);

  // Controls & Modals
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMinimapOpen, setIsMinimapOpen] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Special Visual & Atmospheric Effects Configuration (Lightweight & Clean by Default)
  const [vfxConfig, setVfxConfig] = useState<VFXConfig>({
    godRays: false,
    dustMotes: false,
    chaiSteam: false,
    rainEffect: false,
    laserScanner: false,
    telemetryHolo: false,
    cinemaLetterbox: false,
    ambientSoundtrack: false
  });
  const [isVFXModalOpen, setIsVFXModalOpen] = useState<boolean>(false);

  // Synchronize monsoon rain procedural audio
  useEffect(() => {
    if (timeOfDay === 'rain' || vfxConfig.rainEffect) {
      soundManager.startRainAudio();
    } else {
      soundManager.stopRainAudio();
    }
  }, [timeOfDay, vfxConfig.rainEffect]);

  const handleToggleVFX = (key: keyof VFXConfig) => {
    soundManager.playClick();
    setVfxConfig((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === 'rainEffect') {
        if (next.rainEffect) {
          setTimeOfDay('rain');
        } else if (timeOfDay === 'rain') {
          setTimeOfDay('day');
        }
      }
      return next;
    });
  };

  const handleSelectTimeOfDay = (tod: TimeOfDay) => {
    soundManager.playClick();
    setTimeOfDay(tod);
    setVfxConfig((prev) => ({
      ...prev,
      rainEffect: tod === 'rain'
    }));
  };

  const activeDepartment: DepartmentData | null =
    DEPARTMENTS.find((d) => d.id === activeDeptId) || null;

  const activeEquipment: EquipmentData | null =
    EQUIPMENT_LIST.find((e) => e.id === activeEqId) || null;

  // Animation frame ref for smooth transitions
  const animFrameRef = useRef<number | null>(null);

  // ========================================================
  // SCENE TRANSITIONS
  // ========================================================

  /**
   * Clickable Entrance Transition:
   * Smooth camera move towards door, doors slide open, camera enters lobby
   */
  const handleEnterHospital = () => {
    if (sceneMode !== 'exterior') return;
    setSceneMode('approaching_entrance');
    soundManager.playDoorOpen();

    const startTime = performance.now();
    const duration = 2200; // 2.2 seconds entrance cinematic

    const animateDoor = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / 800, 1); // Door slides open in first 0.8s
      setDoorOpenProgress(progress);

      if (elapsed < duration) {
        animFrameRef.current = requestAnimationFrame(animateDoor);
      } else {
        // Now inside lobby
        setSceneMode('lobby');
        setDoorOpenProgress(1);
        soundManager.startAmbient();
      }
    };

    animFrameRef.current = requestAnimationFrame(animateDoor);
  };

  /**
   * Return to Hospital Exterior
   */
  const handleReturnOutside = () => {
    soundManager.playClick();
    setSceneMode('exterior');
    setActiveDeptId(null);
    setActiveEqId(null);
    setDoorOpenProgress(0);
    setExplodedProgress(0);
    setIsAutoRotate(false);
    setJourneyProgress(1.0);
  };

  /**
   * Return to Central Lobby
   */
  const handleBackToLobby = () => {
    soundManager.playClick();
    setSceneMode('lobby');
    setActiveDeptId(null);
    setActiveEqId(null);
    setExplodedProgress(0);
    setIsAutoRotate(false);
  };

  /**
   * Select and enter a department room
   */
  const handleSelectDepartment = (deptId: DepartmentId) => {
    const dept = DEPARTMENTS.find((d) => d.id === deptId);
    if (!dept) return;

    setActiveDeptId(deptId);
    setSceneMode('department');
    setIsAutoRotate(false);

    // If department has primary equipment, prepare it
    if (dept.primaryEquipmentId) {
      setActiveEqId(dept.primaryEquipmentId);
      const eq = EQUIPMENT_LIST.find((e) => e.id === dept.primaryEquipmentId);
      if (eq && eq.parts.length > 0) {
        setSelectedPartId(eq.parts[0].id);
      }
    }
  };

  /**
   * Select medical equipment and transition to dedicated 3D product-exploration studio
   */
  const handleSelectEquipment = (eqId: EquipmentId) => {
    const eq = EQUIPMENT_LIST.find((e) => e.id === eqId);
    if (!eq) return;

    setActiveEqId(eqId);
    setActiveDeptId(eq.departmentId);
    setSceneMode('equipment_studio');
    setExplodedProgress(0); // Start assembled
    setIsAutoRotate(false);

    if (eq.parts.length > 0) {
      setSelectedPartId(eq.parts[0].id);
    }
  };

  /**
   * Exploded view animations
   */
  const handleExploreParts = () => {
    soundManager.playExplode();
    // Smoothly animate exploded progress from current value to 1.0
    const startVal = explodedProgress;
    const targetVal = 1.0;
    const startTime = performance.now();
    const duration = 1200;

    const animateExplode = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      const current = startVal + (targetVal - startVal) * ease;
      setExplodedProgress(current);

      if (t < 1) {
        requestAnimationFrame(animateExplode);
      }
    };
    requestAnimationFrame(animateExplode);
  };

  const handleReassemble = () => {
    soundManager.playAssemble();
    const startVal = explodedProgress;
    const targetVal = 0.0;
    const startTime = performance.now();
    const duration = 1200;

    const animateReassemble = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const current = startVal + (targetVal - startVal) * ease;
      setExplodedProgress(current);

      if (t < 1) {
        requestAnimationFrame(animateReassemble);
      }
    };
    requestAnimationFrame(animateReassemble);
  };

  const handleResetView = () => {
    soundManager.playClick();
    setIsAutoRotate(false);
    if (activeEquipment && activeEquipment.parts.length > 0) {
      setSelectedPartId(activeEquipment.parts[0].id);
    }
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Scroll-driven explosion when in equipment studio
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (sceneMode !== 'equipment_studio') return;
      // If user holds Shift or in studio, wheel can advance explosion
      if (e.ctrlKey || e.metaKey) return; // Ignore browser zoom
      e.preventDefault();
      const delta = e.deltaY * 0.0015;
      setExplodedProgress((prev) => Math.max(0, Math.min(1, prev + delta)));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [sceneMode]);

  // ========================================================
  // VILLAGE ROAD JOURNEY CONTROLS (DIRECT SCROLL, TOUCH, KEYS)
  // ========================================================
  useEffect(() => {
    if (sceneMode !== 'exterior') return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      // Forward scroll travels down the road towards the hospital
      const delta = e.deltaY * 0.00065;
      setJourneyProgress((prev) => Math.max(0, Math.min(1, prev + delta)));
      if (isAutoDriving) setIsAutoDriving(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setJourneyProgress((prev) => Math.min(1, prev + 0.035));
        if (isAutoDriving) setIsAutoDriving(false);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setJourneyProgress((prev) => Math.max(0, prev - 0.035));
        if (isAutoDriving) setIsAutoDriving(false);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      touchStartY = touchY;
      setJourneyProgress((prev) => Math.max(0, Math.min(1, prev + diff * 0.0025)));
      if (isAutoDriving) setIsAutoDriving(false);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [sceneMode, isAutoDriving]);

  // Auto-drive continuous progress ticker
  useEffect(() => {
    if (sceneMode !== 'exterior' || !isAutoDriving) return;

    let lastTime = performance.now();
    let frameId: number;
    const driveDurationSec = 16; // 16-second cinematic road drive

    const tickDrive = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      setJourneyProgress((prev) => {
        const next = prev + deltaSec / driveDurationSec;
        if (next >= 1) {
          setIsAutoDriving(false);
          return 1;
        }
        return next;
      });

      frameId = requestAnimationFrame(tickDrive);
    };

    frameId = requestAnimationFrame(tickDrive);
    return () => cancelAnimationFrame(frameId);
  }, [sceneMode, isAutoDriving]);

  // ========================================================
  // CINEMATIC FACILITIES TOUR WALKTHROUGH CONTROLS
  // ========================================================
  const handleStartFacilitiesTour = () => {
    soundManager.playClick();
    setSceneMode('cinematic_tour');
    setTourChapterIndex(0);
    setTourProgress(0);
    setIsTourPlaying(true);
    soundManager.startAmbient();
  };

  const handleCloseFacilitiesTour = () => {
    soundManager.playClick();
    setIsTourPlaying(false);
    if (tourChapterIndex === 0) {
      setSceneMode('exterior');
    } else {
      setSceneMode('lobby');
    }
  };

  const handleToggleTourPlay = () => {
    soundManager.playClick();
    setIsTourPlaying((prev) => !prev);
  };

  const handleSelectTourChapter = (index: number) => {
    soundManager.playClick();
    setTourChapterIndex(index);
    setTourProgress(0);
  };

  const handleNextTourChapter = () => {
    soundManager.playClick();
    setTourChapterIndex((prev) => (prev + 1) % TOUR_CHAPTERS.length);
    setTourProgress(0);
  };

  const handlePrevTourChapter = () => {
    soundManager.playClick();
    setTourChapterIndex((prev) => (prev - 1 + TOUR_CHAPTERS.length) % TOUR_CHAPTERS.length);
    setTourProgress(0);
  };

  const handleReplayTour = () => {
    soundManager.playClick();
    setTourChapterIndex(0);
    setTourProgress(0);
    setIsTourPlaying(true);
  };

  // Continuous animation frame loop for facilities tour progress advancement
  useEffect(() => {
    if (sceneMode !== 'cinematic_tour' || !isTourPlaying) return;

    let lastTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      setTourProgress((prev) => {
        const currentChapter = TOUR_CHAPTERS[tourChapterIndex] || TOUR_CHAPTERS[0];
        const duration = currentChapter.durationSeconds || 7;
        const next = prev + deltaSec / duration;
        if (next >= 1) {
          // Progress to the next chapter smoothly
          setTourChapterIndex((prevIdx) => {
            if (prevIdx < TOUR_CHAPTERS.length - 1) {
              return prevIdx + 1;
            } else {
              return 0; // Loop seamlessly back to exterior overview
            }
          });
          return 0;
        }
        return next;
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [sceneMode, isTourPlaying, tourChapterIndex]);

  return (
    <div className="w-screen h-screen relative bg-slate-950 overflow-hidden font-sans select-none">
      {/* 3D WebGL Canvas Scene */}
      <HospitalScene
        sceneMode={sceneMode}
        timeOfDay={timeOfDay}
        vfxConfig={vfxConfig}
        activeDepartment={activeDepartment}
        activeEquipment={activeEquipment}
        allDepartments={DEPARTMENTS}
        allEquipment={EQUIPMENT_LIST}
        explodedProgress={explodedProgress}
        selectedPartId={selectedPartId}
        onSelectPart={setSelectedPartId}
        hoveredPartId={hoveredPartId}
        onHoverPart={setHoveredPartId}
        hoveredDeptId={hoveredDeptId}
        onHoverDept={setHoveredDeptId}
        hoveredEqId={hoveredEqId}
        onHoverEq={setHoveredEqId}
        doorOpenProgress={doorOpenProgress}
        isHoveredDoor={isHoveredDoor}
        onHoverDoor={setIsHoveredDoor}
        onEnterLobby={handleEnterHospital}
        onSelectDepartment={handleSelectDepartment}
        onSelectEquipment={handleSelectEquipment}
        isAutoRotate={isAutoRotate}
        tourChapterIndex={tourChapterIndex}
        tourProgress={tourProgress}
        journeyProgress={journeyProgress}
      />

      {/* Cinematic Camera Post-Processing & Special Effects (Letterbox, Vignette, ECG) */}
      <CinematicPostFX
        isCinemaLetterbox={vfxConfig.cinemaLetterbox}
        timeOfDay={timeOfDay}
        isDriving={isAutoDriving}
        speed={isAutoDriving ? 38 : 0}
        showECG={vfxConfig.telemetryHolo}
      />


      {/* Top Navigation Bar (Hidden during cinematic facilities tour for full-screen video feel) */}
      {sceneMode !== 'cinematic_tour' && (
        <Navbar
          sceneMode={sceneMode}
          timeOfDay={timeOfDay}
          onChangeTimeOfDay={handleSelectTimeOfDay}
          activeDepartment={activeDepartment}
          activeEquipment={activeEquipment}
          allDepartments={DEPARTMENTS}
          allEquipment={EQUIPMENT_LIST}
          onReturnOutside={handleReturnOutside}
          onBackToLobby={handleBackToLobby}
          onSelectDepartment={handleSelectDepartment}
          onSelectEquipment={handleSelectEquipment}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onStartFacilitiesTour={handleStartFacilitiesTour}
          onOpenVFXPanel={() => setIsVFXModalOpen(true)}
        />
      )}

      {/* Village-to-Hospital Road Journey Interactive HUD (When in Exterior Scene) */}
      {sceneMode === 'exterior' && (
        <VillageJourneyHUD
          journeyProgress={journeyProgress}
          onSeekJourney={(p) => {
            setJourneyProgress(p);
            setIsAutoDriving(false);
          }}
          isAutoDriving={isAutoDriving}
          onToggleAutoDrive={() => setIsAutoDriving((prev) => !prev)}
          onSkipToHospital={() => {
            setJourneyProgress(1.0);
            setIsAutoDriving(false);
          }}
          onEnterHospital={handleEnterHospital}
          onStartFacilitiesTour={handleStartFacilitiesTour}
          onOpenVFXPanel={() => setIsVFXModalOpen(true)}
        />
      )}

      {/* Opening Scene Title Overlay (When Exterior & Arrived at Hospital Forecourt) */}
      {sceneMode === 'exterior' && journeyProgress >= 0.95 && (
        <TitleOverlay
          onEnter={handleEnterHospital}
          isHoveredDoor={isHoveredDoor}
          onStartFacilitiesTour={handleStartFacilitiesTour}
        />
      )}

      {/* Cinematic 3D Facilities Tour Walkthrough Video Player HUD */}
      {sceneMode === 'cinematic_tour' && (
        <FacilitiesWalkthrough
          isPlaying={isTourPlaying}
          onTogglePlay={handleToggleTourPlay}
          currentChapterIndex={tourChapterIndex}
          chapterProgress={tourProgress}
          onSelectChapter={handleSelectTourChapter}
          onNextChapter={handleNextTourChapter}
          onPrevChapter={handlePrevTourChapter}
          onReplay={handleReplayTour}
          onClose={handleCloseFacilitiesTour}
        />
      )}

      {/* Department Sidebar Card (When inside a department) */}
      {sceneMode === 'department' && activeDepartment && (
        <DepartmentExplorer
          department={activeDepartment}
          allEquipment={EQUIPMENT_LIST}
          onSelectEquipment={handleSelectEquipment}
          onBackToLobby={handleBackToLobby}
        />
      )}

      {/* Dedicated Exploded View Controls (When in equipment inspection studio) */}
      {sceneMode === 'equipment_studio' && activeEquipment && (
        <ExplodedControls
          equipment={activeEquipment}
          explodedProgress={explodedProgress}
          onSetExplodedProgress={setExplodedProgress}
          selectedPartId={selectedPartId}
          onSelectPart={setSelectedPartId}
          isAutoRotate={isAutoRotate}
          onToggleAutoRotate={() => setIsAutoRotate(!isAutoRotate)}
          onResetView={handleResetView}
          onReassemble={handleReassemble}
          onExploreParts={handleExploreParts}
          onBackToDepartment={() => setSceneMode('department')}
        />
      )}

      {/* Persistent Floating Utility Hub (Bottom Right, hidden during cinematic tour) */}
      {sceneMode !== 'cinematic_tour' && (
        <div className="absolute bottom-6 right-6 z-30 pointer-events-auto flex items-center gap-2">
          {/* Special Effects (VFX) Studio Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsVFXModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/40 text-xs text-purple-200 hover:text-white hover:border-cyan-300 transition-all cursor-pointer flex items-center gap-2 shadow-xl shadow-purple-500/20"
            title="Special Effects & Weather Studio (స్పెషల్ ఎఫెక్ట్స్)"
          >
            <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-semibold hidden sm:inline">VFX Studio</span>
          </button>

          {/* Hospital Floor Wayfinder Map */}
          <button
            onClick={() => setIsMinimapOpen(true)}
            className="px-3.5 py-2.5 rounded-xl glass-panel text-xs text-cyan-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-2 shadow-xl"
            title="Floor Plan / Wayfinder"
          >
            <Map className="w-4 h-4" />
            <span className="font-semibold hidden sm:inline">Hospital Map</span>
          </button>

          {/* Quick Instructions & Help Guide */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2.5 rounded-xl glass-panel text-slate-400 hover:text-white transition-all cursor-pointer shadow-xl"
            title="Controls Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hospital Interactive Floor Plan / Wayfinder Modal */}
      <HospitalMinimap
        isOpen={isMinimapOpen}
        onClose={() => setIsMinimapOpen(false)}
        departments={DEPARTMENTS}
        activeDeptId={activeDeptId}
        onSelectDepartment={handleSelectDepartment}
      />

      {/* Special Effects & Atmosphere Studio (VFX) Modal */}
      <VFXControlPanel
        isOpen={isVFXModalOpen}
        onClose={() => setIsVFXModalOpen(false)}
        timeOfDay={timeOfDay}
        onSelectTimeOfDay={handleSelectTimeOfDay}
        vfxConfig={vfxConfig}
        onToggleVFX={handleToggleVFX}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onTriggerThunder={() => soundManager.playThunder()}
        onTriggerLaserScan={() => soundManager.playLaserScan()}
      />

      {/* Interactive Controls & Features Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
          <div className="w-full max-w-lg p-6 rounded-3xl glass-panel border-cyan-500/40 shadow-2xl text-left flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                <Activity className="w-4 h-4" />
                <span>Interactive 3D Navigation Guide</span>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="text-cyan-300 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  1. Exterior & Automatic Doors
                </div>
                <p className="leading-relaxed text-slate-300">
                  Click the illuminated hospital glass doors or the "Enter Hospital" button to initiate the cinematic camera approach and automatic sliding door sequence into the lobby.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="text-cyan-300 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  2. Central Lobby & Clinical Suites
                </div>
                <p className="leading-relaxed text-slate-300">
                  Hover over any department beacon or doorway in the lobby to reveal its medical specialty. Click to enter the specialized 3D room.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="text-cyan-300 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  3. Medical Equipment & Exploded 3D Views
                </div>
                <p className="leading-relaxed text-slate-300">
                  Click on any 3D medical device (MRI, CT, Ventilator, Telemetry Monitor, Surgical Robot, Smart Bed, C-Arm, Ultrasound) to isolate it in the high-tech inspection studio. Use the slider or mouse wheel to explode the parts and inspect their physics and clinical role!
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="text-cyan-300 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  4. Camera Navigation
                </div>
                <p className="leading-relaxed text-slate-300 font-mono">
                  • Click & Drag: Orbit 360° around any building or object<br />
                  • Right Click & Drag: Pan camera position<br />
                  • Mouse Wheel: Zoom in / Zoom out & advance exploded view
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-400 cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
