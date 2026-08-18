import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Skull,
  Activity,
  Award,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Zap,
  Coffee,
  HelpCircle,
  Clock,
  Flame,
  Plus,
  Trophy,
  Gift,
  Gamepad2,
  Volume2,
  VolumeX,
  ShieldAlert,
  HeartPulse,
  ChevronDown,
  ChevronUp,
  FastForward,
  Sliders
} from 'lucide-react';
import { TamagotchiDevice } from './components/TamagotchiDevice';
import { GraveyardModal } from './components/GraveyardModal';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { EvolutionTimeline } from './components/EvolutionTimeline';
import { NewPetModal } from './components/NewPetModal';
import {
  EvolutionStage,
  TamagotchiState,
  DeviceTheme,
  DisplayMode,
  GraveyardRecord,
  DailyQuest
} from './types/tamagotchi';
import {
  loadSavedState,
  saveState,
  resetToNewEgg,
  loadGraveyard,
  saveGraveyard,
  addGraveyardRecord,
  STAGES_CONFIG,
  calculateStageForSeconds,
  getTimeUntilNextStage,
  SECONDS_PER_DAY,
  getTodayDateString
} from './services/storage';
import { soundManager } from './services/soundEffects';
import { zumbaAudio } from './services/zumbaAudio';

export function App() {
  const [petState, setPetState] = useState<TamagotchiState>(loadSavedState);
  const [graveyardRecords, setGraveyardRecords] = useState<GraveyardRecord[]>(loadGraveyard);
  const [theme, setTheme] = useState<DeviceTheme>('neon-yellow');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('hd');

  // Modals and Panels visibility
  const [isTopPanelOpen, setIsTopPanelOpen] = useState<boolean>(false);
  const [showGraveyard, setShowGraveyard] = useState<boolean>(false);
  const [showQuests, setShowQuests] = useState<boolean>(false);
  const [showNewPet, setShowNewPet] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showDevPanel, setShowDevPanel] = useState<boolean>(false);

  // Direct Zumba Music State
  const [isZumbaMusicPlaying, setIsZumbaMusicPlaying] = useState<boolean>(false);

  // Floating Reward Toast Notification
  const [rewardToast, setRewardToast] = useState<{
    id: number;
    title: string;
    description: string;
    icon: string;
  } | null>(null);

  // Time-decay tracking refs to handle neglected states accurately
  const neglectedTimerRef = useRef<{
    zeroHungerSince: number | null;
    zeroHappySince: number | null;
    sickSince: number | null;
    poopOverloadSince: number | null;
    questNeglectTick: number;
  }>({
    zeroHungerSince: null,
    zeroHappySince: null,
    sickSince: null,
    poopOverloadSince: null,
    questNeglectTick: 0
  });

  // Save state on changes
  useEffect(() => {
    saveState(petState);
  }, [petState]);

  const showRewardNotification = (title: string, description: string, icon = '🎉') => {
    const id = Date.now();
    setRewardToast({ id, title, description, icon });
    setTimeout(() => {
      setRewardToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  // Main 1-Second Simulation Loop (Processes 7-Day Growth, Health & Quest Neglect)
  useEffect(() => {
    const timer = setInterval(() => {
      setPetState((prev) => {
        if (prev.isDead) return prev;

        let updated = { ...prev };
        const speed = prev.simulationSpeedMultiplier || 1;
        const addSeconds = 1 * speed;

        updated.elapsedSeconds += addSeconds;

        // Effective total seconds (natural elapsed + Zumba fitness growth bonus)
        const totalEffectiveSeconds = updated.elapsedSeconds + updated.growthBonusSeconds;
        const calculatedAgeDays = Math.min(7, Math.floor(totalEffectiveSeconds / SECONDS_PER_DAY) + 1);
        updated.ageDays = calculatedAgeDays;

        // --- 1. 7-DAY STAGE EVOLUTION CHECK ---
        const newCalculatedStage = calculateStageForSeconds(totalEffectiveSeconds);
        if (newCalculatedStage !== updated.stage && newCalculatedStage > updated.stage) {
          if (newCalculatedStage === EvolutionStage.BABY_CHICK) {
            soundManager.playEggHatch();
            showRewardNotification('¡Eclosión Exitosa!', '¡Tu pollito ha roto el cascarón y nació!', '🐣');
          } else if (newCalculatedStage === EvolutionStage.ADULT_CHICK) {
            soundManager.playHappy();
            showRewardNotification('¡Pollo Adulto!', '¡Tu mascota ha alcanzado su máximo esplendor!', '👑');
          } else {
            soundManager.playSelect();
          }
          updated.stage = newCalculatedStage;
        }

        // --- 2. VITAL STATS DECAY (Hunger, Happiness, Poop) ---
        // Hunger drops 1 heart frequently every 35s (scaled with speed)
        if (Math.floor(updated.elapsedSeconds) % 35 === 0 && updated.hungryHearts > 0) {
          updated.hungryHearts = Math.max(0, updated.hungryHearts - 1);
        }

        // Happiness drops 1 heart frequently every 40s
        if (Math.floor(updated.elapsedSeconds) % 40 === 0 && updated.happyHearts > 0) {
          updated.happyHearts = Math.max(0, updated.happyHearts - 1);
        }

        // Poop occurs frequently every 45s (if poopCount < 4)
        if (Math.floor(updated.elapsedSeconds) % 45 === 0 && updated.poopCount < 4) {
          soundManager.playPoop();
          updated.poopCount += 1;
        }

        // --- 3. SICKNESS TRIGGERS (Egg and Chick catch cold & illness easily) ---
        let currentHp = typeof updated.healthPercent === 'number' ? updated.healthPercent : 100;

        if (!updated.isSick) {
          const hasHygieneIssue = updated.poopCount >= 2 || updated.snacksEaten >= 2;
          const hasNeglectIssue = updated.hungryHearts === 0 || updated.happyHearts === 0;
          // Cold draft / sickness check every 50s with 30% chance if health < 85%
          const coldDraft = Math.floor(updated.elapsedSeconds) % 50 === 0 && (currentHp < 85 || updated.hungryHearts <= 1) && Math.random() < 0.35;

          if (hasHygieneIssue || hasNeglectIssue || coldDraft) {
            soundManager.playRefuse();
            updated.isSick = true;
            updated.sickDosesNeeded = (updated.snacksEaten >= 3 || updated.poopCount >= 3) ? 2 : 1;
          }
        }

        // --- 4. HEALTH BAR DECAY & QUEST NEGLECT SYSTEM ---
        // Continuous natural decay: In 6 hours -> -25%, in 24 hours -> -100%
        // (100% / 86400s) = ~0.0011574% per second
        let baselineLoss = (100 / SECONDS_PER_DAY) * addSeconds;
        let neglectPenalty = 0;

        // Additional neglect penalties
        if (updated.hungryHearts === 0) neglectPenalty += (0.004 * addSeconds);
        if (updated.happyHearts === 0) neglectPenalty += (0.002 * addSeconds);
        if (updated.poopCount >= 3) neglectPenalty += (0.004 * addSeconds);
        if (updated.isSick) neglectPenalty += (0.008 * addSeconds);

        // Quest neglect decay: if 0 quests completed after 1 hour
        const completedQuests = updated.quests.filter((q) => q.current >= q.target).length;
        if (completedQuests === 0 && updated.elapsedSeconds > 3600) {
          neglectPenalty += (0.002 * addSeconds);
        }

        const totalLoss = baselineLoss + neglectPenalty;
        currentHp = Math.max(0, currentHp - totalLoss);
        updated.healthPercent = Number(currentHp.toFixed(2));

        // --- 5. ATTENTION CALL SYSTEM ---
        const needsCall =
          updated.hungryHearts === 0 ||
          updated.happyHearts === 0 ||
          updated.isSick ||
          updated.poopCount >= 2 ||
          currentHp < 35;

        if (needsCall && !updated.needsAttention) {
          updated.needsAttention = true;
          soundManager.playAttentionCall();
        } else if (!needsCall && updated.needsAttention) {
          updated.needsAttention = false;
        }

        // --- 6. CRITICAL DEATH CHECK (Health = 0% or Severe Neglect) ---
        if (currentHp <= 0) {
          // If quests were 0, death reason is quest neglect / lack of heat
          if (completedQuests === 0) {
            return triggerDeath(updated, 'quest_neglect');
          }
          if (updated.hungryHearts === 0) {
            return triggerDeath(updated, 'hunger');
          }
          if (updated.isSick) {
            return triggerDeath(updated, 'sickness');
          }
          if (updated.poopCount >= 4) {
            return triggerDeath(updated, 'poop_neglect');
          }
          return triggerDeath(updated, 'depression');
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Helper trigger death and record in Graveyard
  const triggerDeath = (
    current: TamagotchiState,
    reason: 'hunger' | 'sickness' | 'depression' | 'poop_neglect' | 'old_age' | 'quest_neglect'
  ): TamagotchiState => {
    soundManager.playDeathFuneral();
    if (isZumbaMusicPlaying) {
      zumbaAudio.stopWorkoutMusic();
      setIsZumbaMusicPlaying(false);
    }

    let reasonText = 'Inanición por falta de alimento';
    if (reason === 'quest_neglect') reasonText = 'El huevo se enfrió y falleció por descuido de retos diarios y falta de calor';
    if (reason === 'sickness') reasonText = 'Enfermedad grave no tratada con medicina';
    if (reason === 'poop_neglect') reasonText = 'Infección por acumulación de suciedad';
    if (reason === 'depression') reasonText = 'Tristeza profunda por falta de juegos y cariño';

    const stageConfig = STAGES_CONFIG[current.stage];

    // Automatically add to Graveyard
    const newRecord = addGraveyardRecord({
      name: current.name,
      generation: current.generation,
      stageReached: current.stage,
      stageName: stageConfig?.name || 'Mascota',
      ageDays: current.ageDays,
      totalTimeAliveSeconds: current.elapsedSeconds,
      deathReason: reason,
      deathReasonText: reasonText,
      deathDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      epitaph: 'Un compañero que recordaremos siempre. ¡Cuida a la próxima generación!',
      zumbaMinutesLogged: current.zumbaData?.totalMinutesEver || 0
    });

    setGraveyardRecords(loadGraveyard());

    return {
      ...current,
      healthPercent: 0,
      isDead: true,
      stage: EvolutionStage.DEAD,
      deathReason: reason,
      deathTime: Date.now(),
      needsAttention: false
    };
  };

  // Helper to update progress on daily quests
  const updateQuest = (categoryOrId: string, amount = 1) => {
    setPetState((prev) => {
      const updatedQuests = prev.quests.map((q) => {
        if (q.id === categoryOrId || q.category === categoryOrId) {
          const newCurrent = Math.min(q.target, q.current + amount);
          return {
            ...q,
            current: newCurrent,
            completed: newCurrent >= q.target
          };
        }
        return q;
      });
      return { ...prev, quests: updatedQuests };
    });
  };

  // DIRECT 1-CLICK ZUMBA WORKOUT (Gives 1 Whole Day of Reward = +24h / 86400s)
  const handleDirectZumbaWorkout = (minutes = 15) => {
    if (petState.isDead) return;

    soundManager.playHappy();

    // 15 min Zumba = +1 WHOLE DAY (+86,400s / 24 hours) of incubation / growth advance
    const growthBonusSec = SECONDS_PER_DAY;
    const caloriesBurned = minutes * 9.5; // ~142 kcal

    setPetState((prev) => {
      const newTotalMin = (prev.zumbaData?.totalMinutesEver || 0) + minutes;
      const newTodayMin = (prev.zumbaData?.todayMinutesCompleted || 0) + minutes;
      const newCalories = (prev.zumbaData?.totalCaloriesBurned || 0) + caloriesBurned;
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      const newHp = Math.min(100, currentHp + 35); // +35% Health recovery!

      return {
        ...prev,
        healthPercent: newHp,
        growthBonusSeconds: prev.growthBonusSeconds + growthBonusSec,
        happyHearts: 4,
        hungryHearts: Math.max(3, prev.hungryHearts),
        discipline: Math.min(100, prev.discipline + 20),
        zumbaData: {
          ...prev.zumbaData,
          todayMinutesCompleted: newTodayMin,
          totalMinutesEver: newTotalMin,
          totalCaloriesBurned: Math.round(newCalories),
          lastZumbaDate: getTodayDateString()
        }
      };
    });

    updateQuest('zumba', minutes);

    showRewardNotification(
      '💃 ¡+1 Día Entero de Recompensa Zumba! (+24h)',
      '¡+24 Horas de Crecimiento Acelerado, +35% Salud Vital ❤️ y Felicidad al Máximo (4/4)!',
      '🔥'
    );
  };

  // Toggle Background Zumba Music
  const handleToggleZumbaMusic = () => {
    if (isZumbaMusicPlaying) {
      zumbaAudio.stopWorkoutMusic();
      setIsZumbaMusicPlaying(false);
    } else {
      zumbaAudio.startWorkoutMusic();
      setIsZumbaMusicPlaying(true);
    }
  };

  // Pet action handlers with Health restoration
  const handleFeedMeal = () => {
    setPetState((prev) => {
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      // 40% chance of generating poop shortly after eating
      const willPoop = Math.random() < 0.4 && prev.poopCount < 4;
      if (willPoop) soundManager.playPoop();
      return {
        ...prev,
        healthPercent: Math.min(100, currentHp + 5),
        hungryHearts: Math.min(4, prev.hungryHearts + 1),
        weightGrams: prev.weightGrams + 1,
        poopCount: willPoop ? prev.poopCount + 1 : prev.poopCount,
        needsAttention: prev.happyHearts === 0 || prev.isSick
      };
    });
    updateQuest('care', 1);
  };

  const handleFeedSnack = () => {
    setPetState((prev) => ({
      ...prev,
      happyHearts: Math.min(4, prev.happyHearts + 1),
      weightGrams: prev.weightGrams + 2,
      snacksEaten: prev.snacksEaten + 1,
      needsAttention: prev.hungryHearts === 0 || prev.isSick
    }));
  };

  const handleToggleLights = () => {
    setPetState((prev) => ({
      ...prev,
      lightsOn: !prev.lightsOn,
      isSleeping: prev.lightsOn
    }));
  };

  const handleCleanPoop = () => {
    setPetState((prev) => {
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      return {
        ...prev,
        healthPercent: Math.min(100, currentHp + 10),
        poopCount: 0,
        needsAttention: prev.hungryHearts === 0 || prev.happyHearts === 0 || prev.isSick
      };
    });
    updateQuest('hygiene', 1);
  };

  const handleGiveMedicine = () => {
    setPetState((prev) => {
      const remainingDoses = prev.sickDosesNeeded - 1;
      const isCured = remainingDoses <= 0;
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      return {
        ...prev,
        healthPercent: Math.min(100, currentHp + 25),
        isSick: !isCured,
        sickDosesNeeded: Math.max(0, remainingDoses),
        snacksEaten: isCured ? 0 : prev.snacksEaten,
        needsAttention: !isCured
      };
    });
  };

  const handleDiscipline = () => {
    setPetState((prev) => ({
      ...prev,
      discipline: Math.min(100, prev.discipline + 25)
    }));
  };

  const handleMiniGameComplete = (won: boolean) => {
    setPetState((prev) => {
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      return {
        ...prev,
        healthPercent: won ? Math.min(100, currentHp + 15) : currentHp,
        happyHearts: won ? Math.min(4, prev.happyHearts + 1) : prev.happyHearts,
        weightGrams: Math.max(5, prev.weightGrams - (won ? 2 : 1)),
        growthBonusSeconds: won ? prev.growthBonusSeconds + 1800 : prev.growthBonusSeconds // +30 min bonus on win!
      };
    });
    if (won) {
      updateQuest('game', 1);
      showRewardNotification(
        '🎮 ¡Mini-Juego Ganado!',
        '¡El huevo absorbió calor vital! +15% Salud ❤️ y +30 min de incubación acelerada.',
        '✨'
      );
    }
  };

  const handlePet = () => {
    soundManager.playPetChirp();
    setPetState((prev) => {
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      return {
        ...prev,
        healthPercent: Math.min(100, currentHp + 3),
        happyHearts: Math.min(4, prev.happyHearts + 1),
        discipline: Math.min(100, prev.discipline + 2)
      };
    });
    updateQuest('quest-pet', 1);
  };

  // Direct 1-Click Claim Daily Quest Reward
  const handleClaimQuest = (questId: string) => {
    setPetState((prev) => {
      const updatedQuests = prev.quests.map((q) =>
        q.id === questId ? { ...q, claimed: true } : q
      );
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      return {
        ...prev,
        healthPercent: Math.min(100, currentHp + 20),
        quests: updatedQuests,
        happyHearts: 4,
        hungryHearts: 4,
        growthBonusSeconds: prev.growthBonusSeconds + 3600 // +1 extra hour bonus!
      };
    });
    showRewardNotification(
      '🎁 ¡Recompensa Reclamada!',
      '¡+1 Hora de Impulso de Incubación, +20% Salud Vital ❤️ y Corazones Llenos!',
      '🌟'
    );
  };

  // Start new pet handler
  const handleConfirmNewPet = (name: string) => {
    neglectedTimerRef.current = {
      zeroHungerSince: null,
      zeroHappySince: null,
      sickSince: null,
      poopOverloadSince: null,
      questNeglectTick: 0
    };
    const nextGen = petState.generation + 1;
    const newState = resetToNewEgg(name, nextGen);
    setPetState(newState);
    setShowNewPet(false);
    setShowGraveyard(false);
    showRewardNotification('🥚 ¡Nuevo Huevo Iniciado!', `Generación ${nextGen} iniciada con éxito. ¡A cuidarlo!`, '🐣');
  };

  // Fast Dev Simulation handlers (Direct +24 hrs and customizable time jump)
  const handleAdvanceDay = (daysCount = 1) => {
    soundManager.playSelect();
    const addedSecs = SECONDS_PER_DAY * daysCount;
    setPetState((prev) => {
      if (prev.isDead) return prev;

      const newElapsed = prev.elapsedSeconds + addedSecs;
      const totalEffectiveSeconds = newElapsed + prev.growthBonusSeconds;
      const newCalculatedStage = calculateStageForSeconds(totalEffectiveSeconds);
      const calculatedAgeDays = Math.min(7, Math.floor(totalEffectiveSeconds / SECONDS_PER_DAY) + 1);

      // Health decay over 24 hours (100% loss per 24 hours if unvisited)
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      const healthLoss = Math.round(100 * daysCount);
      const newHp = Math.max(0, currentHp - healthLoss);

      // New hunger, happiness, poop from 24h absence
      const newHunger = 0;
      const newHappy = 0;
      const newPoop = Math.min(4, prev.poopCount + 3);

      let updatedState: TamagotchiState = {
        ...prev,
        elapsedSeconds: newElapsed,
        ageDays: calculatedAgeDays,
        stage: Math.max(prev.stage, newCalculatedStage),
        healthPercent: newHp,
        hungryHearts: newHunger,
        happyHearts: newHappy,
        poopCount: newPoop,
        needsAttention: true
      };

      if (newCalculatedStage !== prev.stage && newCalculatedStage > prev.stage) {
        if (newCalculatedStage === EvolutionStage.BABY_CHICK) {
          soundManager.playEggHatch();
          showRewardNotification('¡Eclosión Exitosa!', '¡Tu pollito ha roto el cascarón y nació!', '🐣');
        } else if (newCalculatedStage === EvolutionStage.ADULT_CHICK) {
          soundManager.playHappy();
          showRewardNotification('¡Pollo Adulto!', '¡Tu mascota ha alcanzado su máximo esplendor!', '👑');
        }
      }

      // If health reached 0 after 24 hours of absence, trigger death
      if (newHp <= 0) {
        return triggerDeath(updatedState, 'hunger');
      }

      return updatedState;
    });

    showRewardNotification(
      `⏩ +${daysCount * 24} Horas Añadidas`,
      `Se avanzaron ${daysCount * 24}h sin visitas. ¡La salud bajó y necesita atención urgente!`,
      '⏳'
    );
  };

  const completedQuestsCount = petState.quests.filter((q) => q.current >= q.target).length;
  const currentHealth = typeof petState.healthPercent === 'number' ? petState.healthPercent : 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Floating Reward Toast Notification */}
      <AnimatePresence>
        {rewardToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-slate-950 p-3 sm:p-4 rounded-2xl shadow-2xl border-2 border-amber-300 font-bold max-w-md w-[92%] flex items-center gap-3"
          >
            <span className="text-3xl animate-bounce">{rewardToast.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-black uppercase tracking-wide">{rewardToast.title}</div>
              <div className="text-xs font-semibold text-slate-900">{rewardToast.description}</div>
            </div>
            <button
              onClick={() => setRewardToast(null)}
              className="text-slate-900 hover:text-black font-black text-sm p-1 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          {/* Logo & Pet Info */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-xl shadow-md shadow-amber-500/20">
              🐣
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
                {petState.name}
                <span className="text-[10px] uppercase font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full">
                  Gen {petState.generation} • Día {petState.ageDays}/7
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                {STAGES_CONFIG[petState.stage]?.name || 'Tamagotchi 7 Días'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons in Top Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* DIRECT +24 HRS SIMULATION BUTTON */}
            <button
              onClick={() => handleAdvanceDay(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95 text-xs animate-pulse"
              title="Avanzar 24 Horas (+1 Día) para simular el ciclo de crecimiento"
            >
              <FastForward className="w-3.5 h-3.5 fill-current" />
              <span>+24 hrs</span>
            </button>

            {/* DIRECT 1-CLICK ZUMBA REWARD BUTTON (NO POPUP) */}
            <button
              onClick={() => handleDirectZumbaWorkout(15)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-black bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 hover:from-rose-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-rose-500/20 transition-all cursor-pointer active:scale-95"
              title="1 Clic: Otorga +15 min Zumba, +2h Crecimiento y +25% Salud al instante"
            >
              <Flame className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              <span className="hidden sm:inline">💃 Bailar Zumba</span>
              <span className="sm:hidden">💃 Zumba</span>
            </button>

            {/* Cementerio Button */}
            <button
              onClick={() => {
                soundManager.playSelect();
                setShowGraveyard(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>🪦</span>
              <span className="hidden sm:inline">Cementerio</span>
              <span>({graveyardRecords.length})</span>
            </button>

            {/* Daily Quests Button */}
            <button
              onClick={() => {
                soundManager.playSelect();
                setShowQuests(true);
              }}
              className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>🎯</span>
              <span className="hidden sm:inline">Retos</span>
              <span>({completedQuestsCount}/5)</span>
              {completedQuestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </button>

            {/* DESPLEGABLE / COLLAPSIBLE TOP PANEL TOGGLE BUTTON */}
            <button
              onClick={() => {
                soundManager.playBeep(900, 0.02);
                setIsTopPanelOpen(!isTopPanelOpen);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs border transition-all cursor-pointer active:scale-95 ${
                isTopPanelOpen
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title={isTopPanelOpen ? 'Ocultar panel superior de cuidador' : 'Desplegar panel superior de cuidador y simulación'}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Panel Cuidador</span>
              {isTopPanelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* EXPANDABLE COLLAPSIBLE TOP PANEL DRAWER */}
        <AnimatePresence>
          {isTopPanelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-slate-800 bg-slate-900/95"
            >
              <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
                {/* Health Bar Section & Direct Actions */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Health Bar */}
                  <div className="space-y-1.5 flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                          Barra de Salud Vital ({currentHealth}%)
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          currentHealth > 70
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : currentHealth > 40
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                        }`}
                      >
                        {currentHealth > 70 ? 'Óptima' : currentHealth > 40 ? 'Estable' : '¡Peligro / Crítica!'}
                      </span>
                    </div>

                    {/* Health Meter Track */}
                    <div className="w-full h-3 bg-slate-900 rounded-full p-0.5 border border-slate-800 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full transition-all duration-500 ${
                          currentHealth > 70
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : currentHealth > 40
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
                        }`}
                        style={{ width: `${currentHealth}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {currentHealth <= 40
                          ? '⚠️ ¡Salud crítica! Haz retos o pulsa Zumba para evitar que el huevo muera.'
                          : 'Completa los retos diarios y baila Zumba para mantener la salud al 100%.'}
                      </span>
                    </p>
                  </div>

                  {/* 1-Click Zumba Boost in Panel */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleDirectZumbaWorkout(15)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 text-white font-black px-3.5 py-2 rounded-xl text-xs shadow-md cursor-pointer active:scale-95"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>+15m Zumba (+25% ❤️)</span>
                    </button>
                  </div>
                </div>

                {/* Simulation & Time Travel Controls Box */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-cyan-500/30 text-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
                    <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> Herramientas de Simulación Rápida (Pruebas 7 Días)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Simula el avance del tiempo para probar eclosión y etapas
                    </span>
                  </div>

                  {/* Simulation Fast Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleAdvanceDay(1)}
                      className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 font-black hover:bg-cyan-500/30 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <FastForward className="w-4 h-4 fill-current" />
                      <span>+24 Horas (+1 Día)</span>
                    </button>

                    <button
                      onClick={() => handleAdvanceDay(2)}
                      className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 font-bold hover:bg-cyan-900/50 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <FastForward className="w-4 h-4 fill-current" />
                      <span>+48 Horas (+2 Días)</span>
                    </button>

                    <button
                      onClick={() => {
                        setPetState((prev) => ({ ...prev, healthPercent: 100 }));
                        soundManager.playHappy();
                        showRewardNotification('💚 Salud Restaurada', 'La salud vital se fijó en 100%.', '💖');
                      }}
                      className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-900/50 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>💚 Restaurar 100%</span>
                    </button>

                    <button
                      onClick={() => {
                        setPetState((prev) => ({ ...prev, healthPercent: 10 }));
                        soundManager.playAttentionCall();
                        showRewardNotification('💔 Salud al 10%', 'Salud crítica activada para prueba.', '⚠️');
                      }}
                      className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-bold hover:bg-amber-900/50 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>💔 Bajar a 10%</span>
                    </button>
                  </div>

                  {/* Speed Selector & Audio Control */}
                  <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-slate-800 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">Velocidad:</span>
                      {[
                        { label: '1x Real', val: 1 },
                        { label: '10x', val: 10 },
                        { label: '60x (1m=1h)', val: 60 },
                        { label: '3600x', val: 3600 }
                      ].map((spd) => (
                        <button
                          key={spd.val}
                          onClick={() =>
                            setPetState((prev) => ({
                              ...prev,
                              simulationSpeedMultiplier: spd.val
                            }))
                          }
                          className={`px-2 py-0.5 rounded font-mono font-bold border transition-all cursor-pointer ${
                            petState.simulationSpeedMultiplier === spd.val
                              ? 'bg-cyan-500 text-slate-950 font-black border-cyan-400'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {spd.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Audio Toggle */}
                      <button
                        onClick={handleToggleZumbaMusic}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer ${
                          isZumbaMusicPlaying
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {isZumbaMusicPlaying ? <Volume2 className="w-3.5 h-3.5 text-rose-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{isZumbaMusicPlaying ? 'Música ON' : 'Música OFF'}</span>
                      </button>

                      {/* Guide Button */}
                      <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Guía</span>
                      </button>

                      {/* New Pet Modal */}
                      <button
                        onClick={() => {
                          soundManager.playSelect();
                          setShowNewPet(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nueva Mascota</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5 flex flex-col items-center justify-center space-y-5">
        {/* Death Notification Banner if dead */}
        <AnimatePresence>
          {petState.isDead && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-600/60 shadow-2xl text-center flex flex-col items-center"
            >
              <div className="flex items-center gap-2 text-rose-400 font-black text-sm uppercase">
                <Skull className="w-5 h-5 animate-pulse" /> ¡Tu Mascota ha Fallecido!
              </div>
              <p className="text-xs text-rose-200 mt-1">
                {petState.deathReason === 'quest_neglect'
                  ? 'El huevo se enfrió y no sobrevivió por falta de retos y calor biológico.'
                  : 'Su memorial ha sido guardado con honor en el Cementerio.'}
              </p>
              <div className="flex items-center gap-2 mt-3 w-full justify-center">
                <button
                  onClick={() => setShowGraveyard(true)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  🪦 Ver en Cementerio
                </button>
                <button
                  onClick={() => setShowNewPet(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-transform cursor-pointer"
                >
                  🐣 Iniciar Nueva Mascota (G{petState.generation + 1})
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clean Collapsible Toggle Quick Pill above the Tamagotchi */}
        <div className="w-full flex items-center justify-center gap-2">
          <button
            onClick={() => {
              soundManager.playBeep(900, 0.02);
              setIsTopPanelOpen(!isTopPanelOpen);
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-300 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTopPanelOpen ? '🔼 Ocultar Panel Superior' : '🔽 Desplegar Panel de Cuidador & Simulación'}</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full font-mono text-emerald-400 font-black">
              ❤️ {currentHealth}%
            </span>
          </button>

          {/* Quick +24h Shortcut right above Device */}
          <button
            onClick={() => handleAdvanceDay(1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-black shadow-md transition-all cursor-pointer active:scale-95"
            title="Avanzar 24 horas inmediatamente (+1 Día)"
          >
            <FastForward className="w-3 h-3 fill-current" />
            <span>+24h</span>
          </button>
        </div>

        {/* The Physical Tamagotchi Device with LCD and exact chick art */}
        <TamagotchiDevice
          state={petState}
          theme={theme}
          displayMode={displayMode}
          onThemeChange={setTheme}
          onDisplayModeChange={setDisplayMode}
          onFeedMeal={handleFeedMeal}
          onFeedSnack={handleFeedSnack}
          onToggleLights={handleToggleLights}
          onCleanPoop={handleCleanPoop}
          onGiveMedicine={handleGiveMedicine}
          onDiscipline={handleDiscipline}
          onMiniGameComplete={handleMiniGameComplete}
          onResetNewEgg={() => setShowNewPet(true)}
          onPet={handlePet}
        />

        {/* 7-Day Evolution Timeline Component */}
        <div className="w-full max-w-2xl">
          <EvolutionTimeline
            state={petState}
            onOpenZumba={() => handleDirectZumbaWorkout(15)}
          />
        </div>

        {/* Collapsible Care Guide */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl text-xs space-y-3 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-black text-amber-300 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> GUÍA DE CUIDADOS Y CICLO DE 7 DÍAS
                </span>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-amber-300 block">🐣 Ciclo de 7 Días</strong>
                  <p>
                    El Tamagotchi pasa por 7 días de desarrollo: Día 1 (Incubación), Día 2 (Moviéndose), Día 3 (Grietas), Día 4 (Descascarado), Días 5-6 (Pollito Bebé) y Día 7 (Adulto).
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-rose-300 block">💃 Dinámica de Zumba (1 Clic)</strong>
                  <p>
                    Pulsar el botón de Zumba registra directamente tu sesión de 15 min, da +2 horas de crecimiento acelerado y restaura +25% de Salud sin pantallas intermedias.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-emerald-300 block">❤️ Barra de Salud y Muerte</strong>
                  <p>
                    Si no completas los retos diarios o descuidas a tu mascota, la barra de salud bajará. Si llega a 0%, el huevo/mascota fallece y queda en el Cementerio.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-cyan-300 block">🎮 Mini-Juego para el Huevo</strong>
                  <p>
                    ¡Ahora puedes jugar con el huevo! En el mini-juego "Atrapa el Calor" mueves el nido con [A] y confirmas con [B] para ganar salud ❤️.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {showGraveyard && (
          <GraveyardModal
            records={graveyardRecords}
            onClose={() => setShowGraveyard(false)}
            onNewPet={() => {
              setShowGraveyard(false);
              setShowNewPet(true);
            }}
            onRecordsUpdated={(updated) => setGraveyardRecords(updated)}
          />
        )}

        {showQuests && (
          <DailyQuestsModal
            quests={petState.quests}
            onClose={() => setShowQuests(false)}
            onClaimQuest={handleClaimQuest}
            onOpenZumba={() => {
              setShowQuests(false);
              handleDirectZumbaWorkout(15);
            }}
          />
        )}

        {showNewPet && (
          <NewPetModal
            currentGeneration={petState.generation}
            onClose={() => setShowNewPet(false)}
            onConfirmHatch={handleConfirmNewPet}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

