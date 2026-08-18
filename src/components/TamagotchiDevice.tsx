import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Palette,
  Eye,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Heart,
  Zap,
  Info,
  BookOpen
} from 'lucide-react';
import { EggPetRenderer } from './EggPetRenderer';
import { ManualModal } from './ManualModal';
import {
  EvolutionStage,
  TamagotchiState,
  DeviceTheme,
  DisplayMode,
  ActiveScreen,
  MiniGameType
} from '../types/tamagotchi';
import { STAGES_CONFIG } from '../services/storage';
import { soundManager } from '../services/soundEffects';
import { getPettingPhrase, getRandomStagePhrase, getEmotionInfo } from '../services/dialogues';

interface TamagotchiDeviceProps {
  state: TamagotchiState;
  theme: DeviceTheme;
  displayMode: DisplayMode;
  onThemeChange: (theme: DeviceTheme) => void;
  onDisplayModeChange: (mode: DisplayMode) => void;
  onFeedMeal: () => void;
  onFeedSnack: () => void;
  onToggleLights: () => void;
  onCleanPoop: () => void;
  onGiveMedicine: () => void;
  onDiscipline: () => void;
  onMiniGameComplete: (won: boolean) => void;
  onResetNewEgg: () => void;
  onPet: () => void;
}

export const TamagotchiDevice: React.FC<TamagotchiDeviceProps> = ({
  state,
  theme,
  displayMode,
  onThemeChange,
  onDisplayModeChange,
  onFeedMeal,
  onFeedSnack,
  onToggleLights,
  onCleanPoop,
  onGiveMedicine,
  onDiscipline,
  onMiniGameComplete,
  onResetNewEgg,
  onPet
}) => {
  // Navigation & Subscreen states
  const [selectedIconIdx, setSelectedIconIdx] = useState<number | null>(null);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('main');
  const [meterPage, setMeterPage] = useState<number>(0);
  const [foodChoice, setFoodChoice] = useState<'meal' | 'snack'>('meal');
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
  const [speechToast, setSpeechToast] = useState<string | null>(null);
  const [showManual, setShowManual] = useState<boolean>(false);
  const [currentDialogue, setCurrentDialogue] = useState<{ text: string; emoji: string } | null>(null);

  // 3 Mini-Games Selector & System
  const [selectedGameIndex, setSelectedGameIndex] = useState<0 | 1 | 2>(0);
  const [activeGameType, setActiveGameType] = useState<MiniGameType>('sparks_catcher');
  const [gameRound, setGameRound] = useState<number>(1);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameIsFinished, setGameIsFinished] = useState<boolean>(false);

  // Game 1: Falling Heat / Spark Catcher state
  const [playerLane, setPlayerLane] = useState<0 | 1 | 2>(1); // 0: Left, 1: Center, 2: Right
  const [targetLane, setTargetLane] = useState<0 | 1 | 2>(1);
  const [sparkProgress, setSparkProgress] = useState<number>(0); // 0% to 100% falling down
  const [sparkPhase, setSparkPhase] = useState<'playing' | 'caught' | 'missed'>('playing');

  // Game 2: Classic Left / Right Guessing state
  const [lrPhase, setLrPhase] = useState<'ready' | 'choice' | 'reveal'>('ready');
  const [lrCountdown, setLrCountdown] = useState<number>(3);
  const [lrPlayerGuess, setLrPlayerGuess] = useState<'left' | 'right' | null>(null);
  const [lrPetDirection, setLrPetDirection] = useState<'left' | 'right' | null>(null);
  const [lrSelectedSide, setLrSelectedSide] = useState<'left' | 'right'>('left');

  // Game 3: Zumba Rhythm Beat Match state
  const [rhythmBeatProgress, setRhythmBeatProgress] = useState<number>(0); // 100% to 0% (traveling right to left)
  const [rhythmPhase, setRhythmPhase] = useState<'playing' | 'hit' | 'missed'>('playing');
  const [rhythmNoteSymbol, setRhythmNoteSymbol] = useState<string>('🎵');

  // Speed scaling per round (in ms)
  const sparkDurations = [2400, 1900, 1500, 1100, 750];
  const currentSparkDuration = sparkDurations[gameRound - 1] || 1200;

  const rhythmDurations = [2000, 1650, 1350, 1050, 800];
  const currentRhythmDuration = rhythmDurations[gameRound - 1] || 1400;

  // Animation frame loop refs
  const fallTimerRef = useRef<number | null>(null);
  const rhythmTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const countdownIntervalRef = useRef<any>(null);

  // Animation temporary states
  const [animationType, setAnimationType] = useState<ActiveScreen | null>(null);

  const stageConfig = STAGES_CONFIG[state.stage];

  // --- GAME 1: Falling spark physics loop ---
  useEffect(() => {
    if (activeScreen !== 'game' || activeGameType !== 'sparks_catcher' || sparkPhase !== 'playing' || gameIsFinished) {
      if (fallTimerRef.current) cancelAnimationFrame(fallTimerRef.current);
      return;
    }

    startTimeRef.current = performance.now();
    setSparkProgress(0);

    const updateFall = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(100, (elapsed / currentSparkDuration) * 100);
      setSparkProgress(progress);

      if (progress >= 100) {
        handleSparkHitBottom();
      } else {
        fallTimerRef.current = requestAnimationFrame(updateFall);
      }
    };

    fallTimerRef.current = requestAnimationFrame(updateFall);

    return () => {
      if (fallTimerRef.current) cancelAnimationFrame(fallTimerRef.current);
    };
  }, [activeScreen, activeGameType, gameRound, sparkPhase, gameIsFinished]);

  const handleSparkHitBottom = () => {
    if (playerLane === targetLane) {
      triggerSparkCatchSuccess();
    } else {
      triggerSparkCatchFail();
    }
  };

  const triggerSparkCatchSuccess = () => {
    if (fallTimerRef.current) cancelAnimationFrame(fallTimerRef.current);
    setSparkPhase('caught');
    soundManager.playGameRoundWin();
    const newScore = gameScore + 1;
    setGameScore(newScore);

    setTimeout(() => {
      advanceSparkNextRound(newScore);
    }, 850);
  };

  const triggerSparkCatchFail = () => {
    if (fallTimerRef.current) cancelAnimationFrame(fallTimerRef.current);
    setSparkPhase('missed');
    soundManager.playGameRoundLose();

    setTimeout(() => {
      advanceSparkNextRound(gameScore);
    }, 850);
  };

  const advanceSparkNextRound = (currentScore: number) => {
    if (gameRound >= 5) {
      setGameIsFinished(true);
      finishMiniGame(currentScore >= 3);
    } else {
      setGameRound((prev) => prev + 1);
      setTargetLane((prev) => {
        const lanes: (0 | 1 | 2)[] = [0, 1, 2];
        const available = lanes.filter((l) => l !== prev);
        return available[Math.floor(Math.random() * available.length)];
      });
      setSparkPhase('playing');
      setSparkProgress(0);
    }
  };

  const handleColumnTap = (lane: 0 | 1 | 2) => {
    if (sparkPhase !== 'playing') return;
    soundManager.playBeep(1200, 0.02);
    setPlayerLane(lane);

    if (lane === targetLane && sparkProgress >= 30) {
      triggerSparkCatchSuccess();
    }
  };

  // --- GAME 2: Classic Left/Right Guessing System ---
  const startLeftRightRound = () => {
    setLrPhase('ready');
    setLrCountdown(3);
    setLrPlayerGuess(null);
    setLrPetDirection(null);

    let count = 3;
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      count -= 1;
      setLrCountdown(count);
      soundManager.playBeep(880 + (3 - count) * 150, 0.04);

      if (count <= 0) {
        clearInterval(countdownIntervalRef.current);
        setLrPhase('choice');
      }
    }, 600);
  };

  const handleMakeLeftRightGuess = (side: 'left' | 'right') => {
    if (lrPhase !== 'choice') return;
    setLrPlayerGuess(side);
    setLrPhase('reveal');

    // Randomize pet's direction (50% left, 50% right)
    const petChoice: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right';
    setLrPetDirection(petChoice);

    const isMatch = side === petChoice;
    const newScore = isMatch ? gameScore + 1 : gameScore;

    if (isMatch) {
      soundManager.playGameRoundWin();
      setGameScore(newScore);
    } else {
      soundManager.playGameRoundLose();
    }

    setTimeout(() => {
      if (gameRound >= 5) {
        setGameIsFinished(true);
        finishMiniGame(newScore >= 3);
      } else {
        setGameRound((prev) => prev + 1);
        startLeftRightRound();
      }
    }, 1100);
  };

  // --- GAME 3: Zumba Rhythm Beat Match Loop ---
  const rhythmNotes = ['🎵', '🎶', '⚡', '💃', '⭐'];

  useEffect(() => {
    if (activeScreen !== 'game' || activeGameType !== 'rhythm_dance' || rhythmPhase !== 'playing' || gameIsFinished) {
      if (rhythmTimerRef.current) cancelAnimationFrame(rhythmTimerRef.current);
      return;
    }

    startTimeRef.current = performance.now();
    setRhythmBeatProgress(0);
    setRhythmNoteSymbol(rhythmNotes[(gameRound - 1) % rhythmNotes.length]);

    const updateRhythm = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(100, (elapsed / currentRhythmDuration) * 100);
      setRhythmBeatProgress(progress);

      if (progress >= 100) {
        // Reached end without hitting
        triggerRhythmMiss();
      } else {
        rhythmTimerRef.current = requestAnimationFrame(updateRhythm);
      }
    };

    rhythmTimerRef.current = requestAnimationFrame(updateRhythm);

    return () => {
      if (rhythmTimerRef.current) cancelAnimationFrame(rhythmTimerRef.current);
    };
  }, [activeScreen, activeGameType, gameRound, rhythmPhase, gameIsFinished]);

  const handleRhythmTap = () => {
    if (rhythmPhase !== 'playing') return;

    // Target hit sweet spot: between 68% and 88% travel towards left target
    if (rhythmBeatProgress >= 65 && rhythmBeatProgress <= 90) {
      triggerRhythmHit();
    } else {
      triggerRhythmMiss();
    }
  };

  const triggerRhythmHit = () => {
    if (rhythmTimerRef.current) cancelAnimationFrame(rhythmTimerRef.current);
    setRhythmPhase('hit');
    soundManager.playGameRoundWin();
    const newScore = gameScore + 1;
    setGameScore(newScore);

    setTimeout(() => {
      advanceRhythmNextRound(newScore);
    }, 850);
  };

  const triggerRhythmMiss = () => {
    if (rhythmTimerRef.current) cancelAnimationFrame(rhythmTimerRef.current);
    setRhythmPhase('missed');
    soundManager.playGameRoundLose();

    setTimeout(() => {
      advanceRhythmNextRound(gameScore);
    }, 850);
  };

  const advanceRhythmNextRound = (currentScore: number) => {
    if (gameRound >= 5) {
      setGameIsFinished(true);
      finishMiniGame(currentScore >= 3);
    } else {
      setGameRound((prev) => prev + 1);
      setRhythmPhase('playing');
      setRhythmBeatProgress(0);
    }
  };

  // General mini-game completion
  const finishMiniGame = (won: boolean) => {
    if (won) {
      soundManager.playHappy();
      onMiniGameComplete(true);
      showToast('🎉 ¡Victoria! +15% Salud Vital ❤️ y +30 min crecimiento');
    } else {
      soundManager.playRefuse();
      onMiniGameComplete(false);
      showToast('💨 ¡Sigue practicando! Se necesitan 3+ aciertos');
    }
  };

  // Start selected game
  const launchMiniGame = (gameType: MiniGameType) => {
    setActiveGameType(gameType);
    setGameRound(1);
    setGameScore(0);
    setGameIsFinished(false);
    setActiveScreen('game');

    if (gameType === 'sparks_catcher') {
      const randomInitialLane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
      setPlayerLane(1);
      setTargetLane(randomInitialLane);
      setSparkPhase('playing');
      setSparkProgress(0);
    } else if (gameType === 'left_right') {
      setLrSelectedSide('left');
      startLeftRightRound();
    } else if (gameType === 'rhythm_dance') {
      setRhythmPhase('playing');
      setRhythmBeatProgress(0);
    }
  };

  // Shell themes styling
  const themeStyles: Record<
    DeviceTheme,
    { body: string; border: string; shadow: string; ring: string }
  > = {
    'neon-yellow': {
      body: 'from-amber-400 via-yellow-400 to-amber-500',
      border: 'border-yellow-600',
      shadow: 'shadow-amber-500/30',
      ring: 'bg-yellow-400'
    },
    'cyber-purple': {
      body: 'from-purple-500 via-fuchsia-500 to-indigo-600',
      border: 'border-purple-700',
      shadow: 'shadow-purple-500/30',
      ring: 'bg-purple-500'
    },
    'retro-teal': {
      body: 'from-teal-400 via-cyan-400 to-emerald-500',
      border: 'border-teal-600',
      shadow: 'shadow-teal-500/30',
      ring: 'bg-teal-400'
    },
    'coral-pink': {
      body: 'from-rose-400 via-pink-400 to-rose-500',
      border: 'border-pink-600',
      shadow: 'shadow-pink-500/30',
      ring: 'bg-rose-400'
    },
    'midnight-black': {
      body: 'from-slate-800 via-zinc-900 to-slate-950',
      border: 'border-slate-700',
      shadow: 'shadow-slate-900/50',
      ring: 'bg-slate-800'
    },
    'vintage-white': {
      body: 'from-slate-100 via-stone-200 to-slate-300',
      border: 'border-slate-400',
      shadow: 'shadow-slate-300/30',
      ring: 'bg-slate-200'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles['neon-yellow'];

  // The 8 Classic Tamagotchi Menu Icons
  const topIcons = [
    { id: 'feed', label: 'Comida', symbol: '🍙', desc: 'Alimentar comida o postre' },
    { id: 'light', label: 'Luces', symbol: '💡', desc: 'Apagar/Encender luz al dormir' },
    { id: 'game', label: 'Juego', symbol: '🎮', desc: 'Mini-juego Adivina la Dirección' },
    { id: 'medicine', label: 'Medicina', symbol: '💉', desc: 'Curar enfermedades y calaveras' }
  ];

  const bottomIcons = [
    { id: 'bath', label: 'Limpieza', symbol: '🦆', desc: 'Bañar y limpiar popós' },
    { id: 'meter', label: 'Salud', symbol: '📊', desc: 'Báscula y corazones de vitalidad' },
    { id: 'discipline', label: 'Disciplina', symbol: '🗣️', desc: 'Educar y regañar travesuras' },
    { id: 'attention', label: 'Atención', symbol: '🚨', desc: 'Llamada de alerta de la mascota' }
  ];

  // Helper trigger animation
  const triggerAnimation = (anim: ActiveScreen, durationMs = 1800, callback?: () => void) => {
    setActiveScreen(anim);
    setTimeout(() => {
      setActiveScreen('main');
      if (callback) callback();
    }, durationMs);
  };

  const showToast = (msg: string) => {
    setSpeechToast(msg);
    setTimeout(() => setSpeechToast(null), 3000);
  };

  // Petting handler with randomized cute phrases & chirps
  const triggerPettingWithDialogue = () => {
    if (state.stage === EvolutionStage.DEAD) return;

    soundManager.playPetChirp();
    onPet();
    const phrase = getPettingPhrase(state.stage);
    setCurrentDialogue(phrase);
    showToast(`💖 ${phrase.text}`);

    setTimeout(() => {
      setCurrentDialogue(null);
    }, 4500);
  };

  // Periodic ambient pet speech dialogue according to stage & mood
  useEffect(() => {
    if (state.isDead || state.isSleeping || activeScreen !== 'main') return;

    const interval = setInterval(() => {
      if (Math.random() < 0.65 && !currentDialogue) {
        const stagePhrase = getRandomStagePhrase(state.stage);
        setCurrentDialogue(stagePhrase);
        setTimeout(() => {
          setCurrentDialogue(null);
        }, 4000);
      }
    }, 18000);

    return () => clearInterval(interval);
  }, [state.stage, state.isDead, state.isSleeping, activeScreen, currentDialogue]);

  const emotionInfo = getEmotionInfo(state);

  // Button A: Move selection / Game controls
  const handleButtonA = () => {
    soundManager.playBeep(987, 0.03);

    if (state.isDead) {
      showToast('Presiona B para reiniciar un nuevo huevo');
      return;
    }

    if (activeScreen === 'main') {
      // Cycle through icons 0 to 6 (icon 7 is attention indicator only)
      setSelectedIconIdx((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % 7;
      });
    } else if (activeScreen === 'game_select') {
      setSelectedGameIndex((prev) => (((prev + 1) % 3) as 0 | 1 | 2));
    } else if (activeScreen === 'food_select') {
      setFoodChoice((prev) => (prev === 'meal' ? 'snack' : 'meal'));
    } else if (activeScreen === 'status_page') {
      setMeterPage((prev) => (prev + 1) % 5);
    } else if (activeScreen === 'game') {
      if (activeGameType === 'sparks_catcher' && sparkPhase === 'playing') {
        // Cycle player lane: 0 (Izq) -> 1 (Centro) -> 2 (Der) -> 0
        setPlayerLane((prev) => (((prev + 1) % 3) as 0 | 1 | 2));
        soundManager.playBeep(1100, 0.02);
      } else if (activeGameType === 'left_right' && lrPhase === 'choice') {
        setLrSelectedSide((prev) => (prev === 'left' ? 'right' : 'left'));
        soundManager.playBeep(1050, 0.02);
      } else if (activeGameType === 'rhythm_dance' && rhythmPhase === 'playing') {
        handleRhythmTap();
      }
    }
  };

  // Button B: Confirm action / Action execution
  const handleButtonB = () => {
    if (state.isDead) {
      soundManager.playSelect();
      onResetNewEgg();
      setActiveScreen('main');
      setSelectedIconIdx(null);
      showToast('🥚 ¡Un nuevo huevo ha comenzado a incubar!');
      return;
    }

    if (activeScreen === 'main') {
      if (selectedIconIdx === null) {
        soundManager.playSelect();
        setSelectedIconIdx(0);
        return;
      }

      soundManager.playSelect();
      switch (selectedIconIdx) {
        case 0: // Feed
          if (state.stage < EvolutionStage.BABY_CHICK) {
            soundManager.playRefuse();
            showToast('¡El huevo absorbe calor, aún no come sólidos!');
            return;
          }
          setActiveScreen('food_select');
          break;

        case 1: // Lights
          soundManager.playLightSwitch();
          onToggleLights();
          showToast(state.lightsOn ? '💡 Luz apagada (Buenas noches)' : '💡 Luz encendida');
          break;

        case 2: // Game Selection Menu
          if (state.isSleeping) {
            soundManager.playRefuse();
            showToast('¡Está durmiendo!');
            return;
          }
          if (state.isSick) {
            soundManager.playRefuse();
            showToast('¡Está enfermito! Dale medicina primero.');
            return;
          }
          setActiveScreen('game_select');
          break;

        case 3: // Medicine
          if (!state.isSick) {
            soundManager.playRefuse();
            showToast('¡No está enfermo! No necesita inyección.');
            return;
          }
          soundManager.playMedicine();
          triggerAnimation('animating_medicine', 1600, () => {
            onGiveMedicine();
            showToast('✨ ¡Medicina administrada con éxito!');
          });
          break;

        case 4: // Bath / Flush
          if (state.poopCount === 0) {
            soundManager.playRefuse();
            showToast('¡Todo está limpio!');
            return;
          }
          soundManager.playFlush();
          triggerAnimation('animating_bath', 1600, () => {
            onCleanPoop();
            showToast('🦆 ¡Popó limpiada! La pantalla quedó reluciente.');
          });
          break;

        case 5: // Meter / Scale
          setActiveScreen('status_page');
          setMeterPage(0);
          break;

        case 6: // Discipline
          if (state.stage < EvolutionStage.BABY_CHICK) {
            soundManager.playRefuse();
            showToast('¡El huevo está incubando con tranquilidad!');
            return;
          }
          soundManager.playScold();
          triggerAnimation('animating_discipline', 1400, () => {
            onDiscipline();
            showToast('🗣️ ¡Disciplina aplicada! (+25% educación)');
          });
          break;

        default:
          break;
      }
    } else if (activeScreen === 'game_select') {
      soundManager.playSelect();
      const gameTypes: MiniGameType[] = ['sparks_catcher', 'left_right', 'rhythm_dance'];
      launchMiniGame(gameTypes[selectedGameIndex]);
    } else if (activeScreen === 'food_select') {
      soundManager.playEat();
      const choice = foodChoice;
      triggerAnimation('animating_eating', 1500, () => {
        if (choice === 'meal') {
          onFeedMeal();
          showToast('🍚 ¡Comió comida! (+1 ❤️ Hambre, +1g)');
        } else {
          onFeedSnack();
          showToast('🍰 ¡Comió postre! (+1 ❤️ Felicidad, +2g)');
        }
      });
    } else if (activeScreen === 'status_page') {
      setActiveScreen('main');
      setSelectedIconIdx(null);
    } else if (activeScreen === 'game') {
      if (gameIsFinished) {
        setActiveScreen('main');
        setSelectedIconIdx(null);
      } else if (activeGameType === 'sparks_catcher' && sparkPhase === 'playing') {
        if (playerLane === targetLane && sparkProgress >= 25) {
          triggerSparkCatchSuccess();
        }
      } else if (activeGameType === 'left_right' && lrPhase === 'choice') {
        handleMakeLeftRightGuess(lrSelectedSide);
      } else if (activeGameType === 'rhythm_dance' && rhythmPhase === 'playing') {
        handleRhythmTap();
      }
    }
  };

  // Button C: Cancel / Pet / Back
  const handleButtonC = () => {
    soundManager.playCancel();

    if (activeScreen !== 'main') {
      setActiveScreen('main');
      setSelectedIconIdx(null);
      return;
    }

    if (selectedIconIdx !== null) {
      setSelectedIconIdx(null);
    } else {
      // Pet or tap with dialogue phrases & chirps
      triggerPettingWithDialogue();
    }
  };

  // LCD Background colors
  const getScreenBg = () => {
    if (displayMode === 'lcd-green') return 'bg-[#9bbc0f] text-[#0f380f] font-mono';
    if (displayMode === 'pixel-retro') return 'bg-[#d8cbb5] text-[#292524] font-mono';
    return 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F3E8DE] text-stone-800 font-sans';
  };

  // Render Status Meter Page
  const renderStatusPage = () => {
    switch (meterPage) {
      case 0: // Age & Weight
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 p-2">
            <span className="text-xs font-black tracking-wider uppercase border-b-2 border-current pb-0.5">
              - EDAD & PESO -
            </span>
            <div className="flex flex-col items-center space-y-1 font-mono text-sm font-bold">
              <div>EDAD: {state.ageDays} DÍAS</div>
              <div>PESO: {state.weightGrams} g</div>
              <div className="text-[10px] mt-1 opacity-75">GENERACIÓN: G{state.generation}</div>
            </div>
            <span className="text-[9px] opacity-70 mt-2">Pág 1/5 • Pulsa A para ver más</span>
          </div>
        );

      case 1: // Vital Health Bar (0-100%)
        const hp = typeof state.healthPercent === 'number' ? state.healthPercent : 100;
        const hpStatus = hp > 70 ? 'Excelente' : hp > 40 ? 'Estable' : hp > 20 ? '¡Alerta!' : '¡CRÍTICA!';
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 p-2">
            <span className="text-xs font-black tracking-wider uppercase border-b-2 border-current pb-0.5">
              - BARRA DE SALUD (6H / 24H) -
            </span>
            <div className="w-44 h-6 border-2 border-current p-0.5 rounded-xs my-2 flex bg-black/10">
              <div
                className={`h-full transition-all duration-500 ${
                  hp > 50 ? 'bg-current' : hp > 25 ? 'bg-amber-600 animate-pulse' : 'bg-red-600 animate-bounce'
                }`}
                style={{ width: `${Math.max(4, hp)}%` }}
              />
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              <span>{hp}%</span>
              <span className="text-[10px] opacity-80 uppercase">({hpStatus})</span>
            </div>
            <span className="text-[8px] opacity-70 text-center">Baja gradualmente: en 6h a 75%, en 24h a 0%</span>
            <span className="text-[9px] opacity-70">Pág 2/5 • Pulsa A para ver más</span>
          </div>
        );

      case 2: // Hungry Hearts
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 p-2">
            <span className="text-xs font-black tracking-wider uppercase border-b-2 border-current pb-0.5">
              - HAMBRE -
            </span>
            <div className="flex items-center gap-2 my-2">
              {[1, 2, 3, 4].map((idx) => (
                <span key={idx} className="text-2xl">
                  {idx <= state.hungryHearts ? '🖤' : '🤍'}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-bold">
              {state.hungryHearts}/4 Corazones
            </span>
            <span className="text-[9px] opacity-70">Pág 3/5 • Pulsa A para ver más</span>
          </div>
        );

      case 3: // Happy Hearts
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 p-2">
            <span className="text-xs font-black tracking-wider uppercase border-b-2 border-current pb-0.5">
              - FELICIDAD -
            </span>
            <div className="flex items-center gap-2 my-2">
              {[1, 2, 3, 4].map((idx) => (
                <span key={idx} className="text-2xl">
                  {idx <= state.happyHearts ? '🖤' : '🤍'}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-bold">
              {state.happyHearts}/4 Corazones
            </span>
            <span className="text-[9px] opacity-70">Pág 4/5 • Pulsa A para ver más</span>
          </div>
        );

      case 4: // Discipline Meter
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 p-2">
            <span className="text-xs font-black tracking-wider uppercase border-b-2 border-current pb-0.5">
              - DISCIPLINA -
            </span>
            <div className="w-40 h-6 border-2 border-current p-0.5 rounded-xs my-2 flex">
              <div
                className="h-full bg-current transition-all duration-300"
                style={{ width: `${state.discipline}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold">{state.discipline}%</span>
            <span className="text-[9px] opacity-70">Pág 5/5 • Pulsa B para salir</span>
          </div>
        );

      default:
        return null;
    }
  };

  // Render Food Selection Menu
  const renderFoodSelect = () => (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3 p-3">
      <span className="text-xs font-black uppercase tracking-wider border-b-2 border-current pb-0.5">
        - SELECCIÓN DE COMIDA -
      </span>
      <div className="flex items-center justify-around w-full px-4">
        {/* Meal Choice */}
        <div
          className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all cursor-pointer ${
            foodChoice === 'meal'
              ? 'border-current font-black scale-110 bg-black/10'
              : 'border-transparent opacity-60'
          }`}
          onClick={() => setFoodChoice('meal')}
        >
          <span className="text-3xl">🍚</span>
          <span className="text-[11px] font-bold mt-1">COMIDA</span>
          <span className="text-[9px] opacity-75">+1 Hambre, +5% Salud</span>
        </div>

        {/* Snack Choice */}
        <div
          className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all cursor-pointer ${
            foodChoice === 'snack'
              ? 'border-current font-black scale-110 bg-black/10'
              : 'border-transparent opacity-60'
          }`}
          onClick={() => setFoodChoice('snack')}
        >
          <span className="text-3xl">🍰</span>
          <span className="text-[11px] font-bold mt-1">POSTRE</span>
          <span className="text-[9px] opacity-75">+1 Feliz, +2g</span>
        </div>
      </div>
      <div className="text-[10px] text-center font-bold">
        [A] Cambiar • [B] Alimentar • [C] Volver
      </div>
    </div>
  );

  // Render 3 Mini-Games Selection Menu
  const renderGameSelectScreen = () => {
    const gameOptions = [
      {
        id: 'sparks_catcher',
        icon: '🔥',
        title: 'Atrapa Calor',
        desc: 'Chispas térmicas cayendo por 3 columnas a velocidad rápida'
      },
      {
        id: 'left_right',
        icon: '🎯',
        title: 'Adivina Lado',
        desc: 'El clásico juego Tamagotchi: ¿Girará a la Izq o Der?'
      },
      {
        id: 'rhythm_dance',
        icon: '💃',
        title: 'Ritmo Zumba',
        desc: 'Baila tocando las notas musicales en la zona de ritmo'
      }
    ];

    return (
      <div className="w-full h-full flex flex-col justify-between p-2 select-none">
        <div className="text-center border-b border-current/25 pb-1">
          <span className="text-xs font-black uppercase tracking-wider">
            - ELIGE UN MINIJUEGO (3) -
          </span>
        </div>

        <div className="flex flex-col gap-1.5 my-1">
          {gameOptions.map((opt, idx) => {
            const isSelected = selectedGameIndex === idx;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  soundManager.playSelect();
                  setSelectedGameIndex(idx as 0 | 1 | 2);
                  launchMiniGame(opt.id as MiniGameType);
                }}
                className={`flex items-center gap-2 p-1.5 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-current bg-black/15 font-black scale-102 shadow-sm'
                    : 'border-current/20 hover:border-current/50 opacity-80'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-black/10 flex items-center justify-center text-lg shrink-0">
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[11px] font-black uppercase flex items-center justify-between">
                    <span>{opt.title}</span>
                    {isSelected && <span className="text-[9px] font-mono">▶ PLAY</span>}
                  </div>
                  <div className="text-[8px] opacity-75 truncate">{opt.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[9px] text-center font-bold opacity-80 pt-0.5 border-t border-current/20">
          [A] Elegir • [B] Jugar • [C] Volver
        </div>
      </div>
    );
  };

  // Render Active Mini-Game Screen
  const renderGameScreen = () => {
    const isEgg = state.stage < EvolutionStage.BABY_CHICK;

    // --- GAME FINISHED SUMMARY SCREEN ---
    if (gameIsFinished) {
      const won = gameScore >= 3;
      return (
        <div className="w-full h-full flex flex-col items-center justify-between p-2.5 sm:p-3 text-center">
          <div className="flex flex-col items-center mt-1 space-y-1">
            <span className="text-3xl animate-bounce">{won ? (isEgg ? '🔥' : '👑') : '😢'}</span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wide">
              {won ? '¡VICTORIA EN EL JUEGO!' : 'FIN DEL JUEGO'}
            </span>
            <div className="font-mono text-xs font-black bg-black/20 px-3 py-0.5 rounded-full">
              Puntuación: {gameScore} / 5 Aciertos
            </div>
          </div>

          <div className="bg-black/10 border border-current/20 rounded-xl p-2 max-w-[95%]">
            <p className="text-[10px] sm:text-[11px] font-bold">
              {won
                ? '✨ ¡Recompensa obtenida! +15% Salud Vital ❤️, +1 Felicidad 💖 y +30 min de incubación acelerada.'
                : '💨 Necesitas al menos 3 aciertos para sumar salud. ¡Inténtalo de nuevo!'}
            </p>
          </div>

          <div className="w-full flex items-center justify-center gap-2 pb-0.5">
            <button
              onClick={() => launchMiniGame(activeGameType)}
              className="text-[10px] sm:text-[11px] font-black border-2 border-current px-3 py-1 rounded-xl uppercase cursor-pointer hover:bg-black/10 active:scale-95"
            >
              🔄 Reintentar
            </button>
            <button
              onClick={() => {
                setActiveScreen('main');
                setSelectedIconIdx(null);
              }}
              className="text-[10px] sm:text-[11px] font-black bg-black/20 border-2 border-current px-3 py-1 rounded-xl uppercase cursor-pointer hover:bg-black/30 active:scale-95"
            >
              [B] Volver
            </button>
          </div>
        </div>
      );
    }

    // --- 1. FALLING HEAT / SPARKS CATCHER ---
    if (activeGameType === 'sparks_catcher') {
      const laneLabels = ['IZQ', 'CENTRO', 'DER'];
      const laneIcons = ['⬅️', '🎯', '➡️'];
      const sparkSymbol = isEgg ? '🔥' : '🍒';
      const speedLabels = ['1.0x', '1.3x', '1.6x', '2.2x', '3.2x ⚡'];

      return (
        <div className="w-full h-full flex flex-col justify-between p-1 select-none">
          {/* Header */}
          <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-black border-b border-current/25 pb-0.5 px-1">
            <span className="flex items-center gap-1 uppercase">
              <span>{sparkSymbol}</span>
              <span>R{gameRound}/5</span>
              <span className="text-[9px] opacity-80 font-mono bg-black/15 px-1 rounded">
                Vel: {speedLabels[gameRound - 1]}
              </span>
            </span>
            <div className="flex items-center gap-1 font-mono">
              <span className="opacity-75">ACIERTOS:</span>
              <span className="bg-black/20 px-1.5 py-0.2 rounded font-black">{gameScore}/5</span>
            </div>
          </div>

          {/* 3 Lane Interactive Field */}
          <div className="grid grid-cols-3 gap-1 flex-1 bg-black/10 border border-current/20 rounded-xl p-1 relative overflow-hidden my-1">
            {[0, 1, 2].map((laneIdx) => {
              const isTarget = targetLane === laneIdx;
              const isPlayerHere = playerLane === laneIdx;

              return (
                <div
                  key={laneIdx}
                  onClick={() => handleColumnTap(laneIdx as 0 | 1 | 2)}
                  className={`relative flex flex-col items-center justify-between rounded-lg border transition-all cursor-pointer ${
                    isPlayerHere
                      ? 'border-current/50 bg-black/15 shadow-inner'
                      : 'border-current/10 hover:border-current/30 hover:bg-black/5'
                  }`}
                >
                  <div className="text-[8px] sm:text-[9px] font-bold opacity-70 mt-0.5 pointer-events-none">
                    {laneIcons[laneIdx]} {laneLabels[laneIdx]}
                  </div>

                  {/* Vertical Falling Track Area */}
                  <div className="relative w-full flex-1 flex flex-col items-center overflow-hidden">
                    {isTarget && sparkPhase === 'playing' && (
                      <motion.div
                        style={{
                          top: `${sparkProgress * 0.72}%`,
                          position: 'absolute'
                        }}
                        className="text-2xl sm:text-3xl filter drop-shadow-md z-10 pointer-events-none"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 0.4, repeat: Infinity }}
                        >
                          {sparkSymbol}
                        </motion.div>
                      </motion.div>
                    )}

                    {isTarget && sparkPhase === 'caught' && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.4, opacity: 1 }}
                        className="absolute bottom-2 text-2xl z-20"
                      >
                        ✨🔥✨
                      </motion.div>
                    )}

                    {isTarget && sparkPhase === 'missed' && (
                      <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -10 }}
                        className="absolute bottom-2 text-xl z-20"
                      >
                        💨
                      </motion.div>
                    )}
                  </div>

                  {/* Bottom Catcher */}
                  <div className="h-12 sm:h-14 flex flex-col items-center justify-end pb-0.5 w-full">
                    {isPlayerHere ? (
                      <motion.div
                        layoutId="egg-catcher"
                        className="flex flex-col items-center relative"
                      >
                        {sparkPhase === 'caught' && (
                          <div className="absolute -top-5 text-[9px] font-black text-amber-900 bg-amber-300 px-1 py-0.2 rounded-full border border-amber-500 whitespace-nowrap z-30 shadow-md">
                            ¡ATRAPADO! +1
                          </div>
                        )}
                        {sparkPhase === 'missed' && (
                          <div className="absolute -top-5 text-[9px] font-bold text-red-900 bg-red-300 px-1 py-0.2 rounded-full border border-red-500 whitespace-nowrap z-30 shadow-md">
                            ¡FALLADO!
                          </div>
                        )}

                        <div className="w-10 h-10 flex items-center justify-center">
                          <EggPetRenderer
                            stage={state.stage}
                            displayMode={displayMode}
                            activeScreen="game"
                            scale={0.42}
                          />
                        </div>
                        <div className="text-[10px] leading-none -mt-1.5">🪹</div>
                      </motion.div>
                    ) : (
                      <div className="w-6 h-1.5 rounded-full bg-black/10 border border-current/15 mb-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick-Tap Buttons */}
          <div className="space-y-0.5 pt-0.5 border-t border-current/25">
            <div className="grid grid-cols-3 gap-1">
              {[0, 1, 2].map((laneIdx) => (
                <button
                  key={laneIdx}
                  onClick={() => handleColumnTap(laneIdx as 0 | 1 | 2)}
                  disabled={sparkPhase !== 'playing'}
                  className={`py-1 px-1 rounded-lg text-[9px] sm:text-[10px] font-black border transition-all cursor-pointer active:scale-95 ${
                    playerLane === laneIdx
                      ? 'bg-current text-white dark:text-black border-current shadow-md'
                      : 'bg-black/10 border-current/30 hover:bg-black/20'
                  }`}
                >
                  {laneIcons[laneIdx]} {laneLabels[laneIdx]}
                </button>
              ))}
            </div>
            <div className="text-[9px] text-center font-bold opacity-75">
              👆 Toca la columna en la pantalla para atrapar el calor
            </div>
          </div>
        </div>
      );
    }

    // --- 2. CLASSIC LEFT / RIGHT GUESSING GAME ---
    if (activeGameType === 'left_right') {
      return (
        <div className="w-full h-full flex flex-col justify-between p-2 select-none text-center">
          {/* Header */}
          <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-black border-b border-current/25 pb-1">
            <span className="uppercase">🎯 ADIVINA LADO (R{gameRound}/5)</span>
            <div className="flex items-center gap-1 font-mono">
              <span className="opacity-75">ACIERTOS:</span>
              <span className="bg-black/20 px-1.5 py-0.2 rounded font-black">{gameScore}/5</span>
            </div>
          </div>

          {/* Central Pet Stage */}
          <div className="flex-1 flex flex-col items-center justify-center my-1 relative">
            {lrPhase === 'ready' && (
              <div className="space-y-2">
                <motion.div
                  animate={{ rotate: [-8, 8, -8] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="w-20 h-20 mx-auto flex items-center justify-center"
                >
                  <EggPetRenderer stage={state.stage} displayMode={displayMode} activeScreen="game" scale={0.7} />
                </motion.div>
                <div className="text-xs font-black tracking-widest text-amber-500 animate-pulse">
                  ¡PREPÁRATE! {lrCountdown > 0 ? lrCountdown : '¡YA!'}
                </div>
                <div className="text-[10px] opacity-75">¿Hacia qué lado girará tu mascota?</div>
              </div>
            )}

            {lrPhase === 'choice' && (
              <div className="space-y-2">
                <div className="w-20 h-20 mx-auto flex items-center justify-center">
                  <EggPetRenderer stage={state.stage} displayMode={displayMode} activeScreen="game" scale={0.7} />
                </div>
                <div className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">
                  ¡ELIGE AHORA! ⬅️ O ➡️
                </div>
              </div>
            )}

            {lrPhase === 'reveal' && (
              <div className="space-y-2">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{
                    scale: 1.1,
                    x: lrPetDirection === 'left' ? -20 : 20,
                    rotate: lrPetDirection === 'left' ? -15 : 15
                  }}
                  className="w-20 h-20 mx-auto flex items-center justify-center"
                >
                  <EggPetRenderer stage={state.stage} displayMode={displayMode} activeScreen="game" scale={0.75} />
                </motion.div>
                <div className="text-sm font-black">
                  {lrPlayerGuess === lrPetDirection ? (
                    <span className="text-emerald-600 dark:text-emerald-400">✨ ¡ACERTASTE! +1 ✨</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">💨 ¡FALLASTE! (Giró a la {lrPetDirection === 'left' ? 'Izq' : 'Der'})</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Choice Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-current/20">
            <button
              onClick={() => handleMakeLeftRightGuess('left')}
              disabled={lrPhase !== 'choice'}
              className={`py-2 px-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer active:scale-95 ${
                lrSelectedSide === 'left'
                  ? 'border-current bg-black/20 scale-102 shadow-md font-black'
                  : 'border-current/30 hover:bg-black/10 opacity-80'
              }`}
            >
              ⬅️ IZQUIERDA
            </button>
            <button
              onClick={() => handleMakeLeftRightGuess('right')}
              disabled={lrPhase !== 'choice'}
              className={`py-2 px-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer active:scale-95 ${
                lrSelectedSide === 'right'
                  ? 'border-current bg-black/20 scale-102 shadow-md font-black'
                  : 'border-current/30 hover:bg-black/10 opacity-80'
              }`}
            >
              DERECHA ➡️
            </button>
          </div>
          <div className="text-[9px] opacity-75 mt-1">
            [A] Cambiar lado • [B] Confirmar elección
          </div>
        </div>
      );
    }

    // --- 3. ZUMBA RHYTHM BEAT MATCH GAME ---
    if (activeGameType === 'rhythm_dance') {
      return (
        <div className="w-full h-full flex flex-col justify-between p-2 select-none text-center">
          {/* Header */}
          <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-black border-b border-current/25 pb-1">
            <span className="uppercase">💃 RITMO ZUMBA (R{gameRound}/5)</span>
            <div className="flex items-center gap-1 font-mono">
              <span className="opacity-75">ACIERTOS:</span>
              <span className="bg-black/20 px-1.5 py-0.2 rounded font-black">{gameScore}/5</span>
            </div>
          </div>

          {/* Dancing Rhythm Track */}
          <div className="flex-1 flex flex-col items-center justify-center my-2 space-y-2">
            <div className="relative w-full h-20 bg-black/10 border-2 border-current/25 rounded-2xl flex items-center px-3 overflow-hidden shadow-inner">
              {/* Target Beat Hit Zone on Left (where the pet is dancing) */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-3 border-current/60 bg-black/15 flex items-center justify-center shadow-md animate-pulse">
                  <EggPetRenderer stage={state.stage} displayMode={displayMode} activeScreen="game" scale={0.45} />
                </div>
                <span className="text-[8px] font-black uppercase mt-0.5">🎯 ZONA HIT</span>
              </div>

              {/* Rhythm Line */}
              <div className="absolute left-16 right-4 h-1.5 bg-current/20 rounded-full" />

              {/* Moving Note */}
              {rhythmPhase === 'playing' && (
                <div
                  style={{
                    left: `${Math.max(16, 100 - rhythmBeatProgress * 0.85)}%`,
                    position: 'absolute'
                  }}
                  className="text-3xl z-20 filter drop-shadow-md pointer-events-none"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 20, -20, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  >
                    {rhythmNoteSymbol}
                  </motion.div>
                </div>
              )}

              {/* Hit / Miss feedback badge */}
              {rhythmPhase === 'hit' && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  className="absolute left-10 text-xs font-black text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full border border-amber-500 shadow-lg z-30"
                >
                  ¡PERFECTO! 🔥 +1
                </motion.div>
              )}
              {rhythmPhase === 'missed' && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  className="absolute left-10 text-xs font-bold text-red-900 bg-red-300 px-2 py-0.5 rounded-full border border-red-500 shadow-lg z-30"
                >
                  ¡FALLADO! 💨
                </motion.div>
              )}
            </div>

            <div className="text-[10px] font-bold opacity-80">
              ¡Toca el botón justo cuando la nota entre al círculo de baile!
            </div>
          </div>

          {/* Huge Tap Button */}
          <div className="pt-1 border-t border-current/20">
            <button
              onClick={handleRhythmTap}
              disabled={rhythmPhase !== 'playing'}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs uppercase shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-300"
            >
              <span>💃</span>
              <span>¡PULSA AL RITMO! [B]</span>
              <span>🎶</span>
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center select-none w-full max-w-[360px] xs:max-w-[400px] sm:max-w-[440px] md:max-w-[460px] mx-auto px-1">
      {/* Top Bar with Themes, Display Mode, Audio, and Manual Button */}
      <div className="w-full flex items-center justify-between mb-2 px-1 text-xs gap-1.5 flex-wrap">
        {/* Theme Shell Selector */}
        <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-full px-2.5 py-1 shadow-md">
          <Palette className="w-3 h-3 text-amber-400" />
          {(
            ['neon-yellow', 'cyber-purple', 'retro-teal', 'coral-pink', 'midnight-black', 'vintage-white'] as DeviceTheme[]
          ).map((t) => (
            <button
              key={t}
              onClick={() => {
                soundManager.playBeep(1200, 0.02);
                onThemeChange(t);
              }}
              className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                theme === t ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
              } ${
                t === 'neon-yellow'
                  ? 'bg-yellow-400'
                  : t === 'cyber-purple'
                  ? 'bg-purple-500'
                  : t === 'retro-teal'
                  ? 'bg-teal-400'
                  : t === 'coral-pink'
                  ? 'bg-rose-400'
                  : t === 'vintage-white'
                  ? 'bg-slate-200'
                  : 'bg-slate-800'
              }`}
              title={`Carcasa ${t}`}
            />
          ))}
        </div>

        {/* Display Mode, Audio, & Manual Modal Trigger */}
        <div className="flex items-center gap-1">
          {/* Manual Modal Button */}
          <button
            onClick={() => {
              soundManager.playSelect();
              setShowManual(true);
            }}
            className="flex items-center gap-1 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 rounded-full px-2 py-1 text-[10px] font-bold shadow-md transition-colors cursor-pointer active:scale-95"
            title="Abrir Manual de Instrucciones e Indicaciones"
          >
            <BookOpen className="w-3 h-3 text-amber-400" />
            <span>Manual</span>
          </button>

          {/* Screen Display Mode Switcher */}
          <button
            onClick={() => {
              const modes: DisplayMode[] = ['lcd-green', 'pixel-retro', 'hd'];
              const nextIdx = (modes.indexOf(displayMode) + 1) % modes.length;
              onDisplayModeChange(modes[nextIdx]);
              soundManager.playSelect();
            }}
            className="flex items-center gap-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-full px-2 py-1 text-[10px] font-bold shadow-md transition-colors cursor-pointer"
            title="Cambiar pantalla (LCD Verde Clásico / Pixel / HD)"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span className="capitalize">
              {displayMode === 'lcd-green' ? 'LCD' : displayMode === 'pixel-retro' ? 'Pixel' : 'HD'}
            </span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => {
              const newSound = !soundEnabled;
              setSoundEnabled(newSound);
              soundManager.setEnabled(newSound);
              if (newSound) soundManager.playBeep(1000, 0.05);
            }}
            className="p-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 shadow-md transition-colors cursor-pointer"
            title={soundEnabled ? 'Silenciar' : 'Activar audio 8-bit'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3 h-3 text-amber-400" />
            ) : (
              <VolumeX className="w-3 h-3 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Manual Modal */}
      <AnimatePresence>
        {showManual && (
          <ManualModal isOpen={showManual} onClose={() => setShowManual(false)} />
        )}
      </AnimatePresence>

      {/* Main Oval Tamagotchi Egg Shell Chassis */}
      <div
        className={`relative w-full p-4 sm:p-6 rounded-[56px] sm:rounded-[64px] bg-gradient-to-b ${currentTheme.body} ${currentTheme.border} border-4 shadow-2xl ${currentTheme.shadow} transition-all duration-500`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), inset 0 3px 8px rgba(255,255,255,0.45)'
        }}
      >
        {/* Keychain Top Loop */}
        <div className="absolute -top-3 left-10 w-7 h-7 rounded-full border-4 border-slate-700 bg-slate-900/60 shadow-inner flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-transparent border-2 border-slate-600" />
        </div>

        {/* Top Logo Tamagotchi */}
        <div className="text-center mb-2">
          <span className="font-black tracking-widest text-slate-950 text-xs sm:text-sm drop-shadow-sm uppercase font-mono">
            ★ TAMAGOTCHI ★
          </span>
        </div>

        {/* Inner LCD Frame & Housing */}
        <div className="relative rounded-3xl bg-slate-950 p-2.5 sm:p-3.5 border-4 border-slate-800 shadow-2xl overflow-hidden">
          {/* Top 4 Icons (Feed, Light, Game, Medicine) */}
          <div className="grid grid-cols-4 gap-1 pb-1.5 mb-1.5 border-b border-slate-800">
            {topIcons.map((icon, idx) => {
              const isSelected = selectedIconIdx === idx;
              return (
                <button
                  key={icon.id}
                  onClick={() => {
                    soundManager.playBeep(1100, 0.02);
                    setSelectedIconIdx(idx);
                  }}
                  className={`flex flex-col items-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg font-black'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={icon.desc}
                >
                  <span className="text-base sm:text-lg leading-none">{icon.symbol}</span>
                  <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold uppercase">{icon.label}</span>
                </button>
              );
            })}
          </div>

          {/* LCD Screen Display */}
          <div
            className={`relative w-full h-[280px] sm:h-[320px] md:h-[340px] rounded-2xl p-2.5 flex flex-col items-center justify-between overflow-hidden shadow-inner ${getScreenBg()}`}
            style={{
              boxShadow: 'inset 0 4px 16px rgba(0,0,0,0.55)'
            }}
          >
            {/* Retro Scanlines Pattern Overlay */}
            {displayMode !== 'hd' && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20 bg-repeat"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0, 0, 0, 0.35) 50%, transparent 50%)',
                  backgroundSize: '100% 4px'
                }}
              />
            )}

            {/* In-Game Screens Switching */}
            {activeScreen === 'status_page' ? (
              renderStatusPage()
            ) : activeScreen === 'game_select' ? (
              renderGameSelectScreen()
            ) : activeScreen === 'food_select' ? (
              renderFoodSelect()
            ) : activeScreen === 'game' ? (
              renderGameScreen()
            ) : (
              // Main Normal Pet Living Screen
              <>
                {/* Top Status Header inside LCD */}
                <div className="w-full flex items-center justify-between z-10 text-[10px] sm:text-[11px] font-bold">
                  <div className="flex items-center gap-1">
                    <span className="bg-black/20 px-1.5 py-0.5 rounded font-mono">
                      {state.name}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                      (state.healthPercent ?? state.health ?? 100) > 50
                        ? 'bg-emerald-800/30 text-emerald-950 dark:text-emerald-300'
                        : (state.healthPercent ?? state.health ?? 100) > 25
                        ? 'bg-amber-800/30 text-amber-900 animate-pulse'
                        : 'bg-red-800/40 text-red-900 dark:text-red-300 animate-bounce'
                    }`}>
                      ❤️ {state.healthPercent ?? state.health ?? 100}%
                    </span>
                  </div>

                  {/* Emotion Pill Badge */}
                  <button
                    onClick={triggerPettingWithDialogue}
                    title={emotionInfo.description}
                    className="flex items-center gap-1 bg-black/15 hover:bg-black/25 px-1.5 py-0.5 rounded-full text-[9px] font-bold cursor-pointer transition-all active:scale-95 border border-black/10"
                  >
                    <span>{emotionInfo.icon}</span>
                    <span className="opacity-90">{emotionInfo.label}</span>
                  </button>

                  {/* Hungry & Happy heart icons preview */}
                  <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px]">
                    <div className="flex items-center" title="Hambre">
                      <span className="mr-0.5">🍖</span>
                      {state.hungryHearts}/4
                    </div>
                    <div className="flex items-center" title="Felicidad">
                      <span className="mr-0.5">💖</span>
                      {state.happyHearts}/4
                    </div>
                  </div>
                </div>

                {/* Interactive Dialogue Speech Balloon */}
                <AnimatePresence>
                  {currentDialogue && !state.isDead && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: -4 }}
                      onClick={triggerPettingWithDialogue}
                      className="z-30 my-1 bg-amber-50 text-amber-950 dark:bg-slate-900 dark:text-amber-200 border-2 border-amber-400/80 px-2.5 py-1 rounded-2xl shadow-lg flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold max-w-[92%] cursor-pointer active:scale-95 text-center"
                    >
                      <span className="text-sm shrink-0">{currentDialogue.emoji}</span>
                      <span className="leading-tight select-none">"{currentDialogue.text}"</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toast fallback */}
                <AnimatePresence>
                  {speechToast && !currentDialogue && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="z-20 bg-black/85 text-amber-300 border border-amber-400/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md text-center max-w-[90%]"
                    >
                      {speechToast}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Central Pet / Scene Rendering */}
                <div className="my-auto z-10 flex flex-col items-center justify-center flex-1 w-full">
                  <EggPetRenderer
                    stage={state.stage}
                    displayMode={displayMode}
                    isSleeping={state.isSleeping}
                    lightsOn={state.lightsOn}
                    isSick={state.isSick}
                    poopCount={state.poopCount}
                    activeScreen={activeScreen}
                    foodType={foodChoice}
                    healthPercent={state.healthPercent ?? state.health ?? 100}
                    onPetClick={triggerPettingWithDialogue}
                  />
                </div>

                {/* Bottom Screen Info / Attention Prompt */}
                <div className="w-full flex items-center justify-between z-10 text-[9px] sm:text-[10px] font-bold pt-1 border-t border-black/15">
                  <span className="opacity-75">{stageConfig.name}</span>
                  {state.isDead ? (
                    <span className="text-red-500 font-black animate-pulse">
                      ¡FALLECIDO! PULSA B
                    </span>
                  ) : state.isSleeping ? (
                    <span className="opacity-80">Durmiendo (Zzz...)</span>
                  ) : state.isSick ? (
                    <span className="text-red-600 font-black animate-bounce">
                      ¡ENFERMO! 💉
                    </span>
                  ) : state.poopCount > 0 ? (
                    <span className="text-amber-800 font-bold">
                      {state.poopCount} Popó(s) 🦆
                    </span>
                  ) : (
                    <span className="opacity-60">Peso: {state.weightGrams}g</span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Bottom 4 Icons (Bath, Meter, Discipline, Attention) */}
          <div className="grid grid-cols-4 gap-1 pt-1.5 mt-1.5 border-t border-slate-800">
            {bottomIcons.map((icon, idx) => {
              const actualIdx = idx + 4;
              const isSelected = selectedIconIdx === actualIdx;
              const isAttentionIcon = icon.id === 'attention';
              const isAlertActive = isAttentionIcon && state.needsAttention;

              return (
                <button
                  key={icon.id}
                  onClick={() => {
                    if (!isAttentionIcon) {
                      soundManager.playBeep(1100, 0.02);
                      setSelectedIconIdx(actualIdx);
                    }
                  }}
                  className={`flex flex-col items-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg font-black'
                      : isAlertActive
                      ? 'bg-red-500 text-white animate-bounce shadow-md font-black'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={icon.desc}
                >
                  <span className="text-base sm:text-lg leading-none">{icon.symbol}</span>
                  <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold uppercase">{icon.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Authentic 3 Physical Buttons (A: Select, B: Execute, C: Cancel) */}
        <div className="mt-4 mb-1 flex items-center justify-around px-3">
          {/* Button A (Select / Next) */}
          <div className="flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.88, y: 3 }}
              onClick={handleButtonA}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 shadow-xl flex items-center justify-center text-white font-black text-sm sm:text-base active:shadow-inner cursor-pointer"
            >
              A
            </motion.button>
            <span className="text-[10px] font-black text-slate-950 mt-1 uppercase">
              Elegir
            </span>
          </div>

          {/* Button B (Execute / Confirm) */}
          <div className="flex flex-col items-center -translate-y-2">
            <motion.button
              whileTap={{ scale: 0.88, y: 3 }}
              onClick={handleButtonB}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 border-2 border-amber-300 shadow-2xl flex items-center justify-center text-slate-950 font-black text-base sm:text-lg active:shadow-inner cursor-pointer"
            >
              B
            </motion.button>
            <span className="text-[10px] font-black text-slate-950 mt-0.5 uppercase">
              Acción
            </span>
          </div>

          {/* Button C (Cancel / Back) */}
          <div className="flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.88, y: 3 }}
              onClick={handleButtonC}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 shadow-xl flex items-center justify-center text-white font-black text-sm sm:text-base active:shadow-inner cursor-pointer"
            >
              C
            </motion.button>
            <span className="text-[10px] font-black text-slate-950 mt-1 uppercase">
              Volver
            </span>
          </div>
        </div>

        {/* Selected Menu Label */}
        <div className="text-center mt-1.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-950 bg-white/60 px-3 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
            {selectedIconIdx !== null
              ? `[ ${[...topIcons, ...bottomIcons][selectedIconIdx]?.label} ] - Pulsa B para usar`
              : 'Pulsa A para elegir un icono'}
          </span>
        </div>
      </div>
    </div>
  );
};
