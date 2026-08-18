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
  Sliders,
  Thermometer,
  Home,
  ArrowLeft,
  Bell,
  Sun,
  Sunrise,
  Sunset,
  Moon
} from 'lucide-react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TamagotchiDevice } from './components/TamagotchiDevice';
import { GraveyardModal } from './components/GraveyardModal';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { EvolutionTimeline } from './components/EvolutionTimeline';
import { NewPetModal } from './components/NewPetModal';
import { ManualModal } from './components/ManualModal';
import { AchievementsModal } from './components/AchievementsModal';
import { OwnerHealthModal } from './components/OwnerHealthModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import {
  EvolutionStage,
  TamagotchiState,
  PetSpecies,
  DeviceTheme,
  DisplayMode,
  GraveyardRecord,
  DailyQuest,
  Achievement,
  OwnerHabitsState,
  DayNightTimeOfDay
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
  getTodayDateString,
  getDayNightTimeOfDay,
  generateInitialAchievements,
  getInitialOwnerHabits,
  loadPetSlots,
  savePetSlots,
  updatePetInSlots
} from './services/storage';
import { soundManager } from './services/soundEffects';
import { zumbaAudio } from './services/zumbaAudio';
import { notificationManager } from './services/notifications';

export function App() {
  const [petState, setPetState] = useState<TamagotchiState>(loadSavedState);
  const [petSlots, setPetSlots] = useState<TamagotchiState[]>(loadPetSlots);
  const [graveyardRecords, setGraveyardRecords] = useState<GraveyardRecord[]>(loadGraveyard);
  const [theme, setTheme] = useState<DeviceTheme>('neon-yellow');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('hd');

  // Main Screen View (Welcome Screen vs Simulator Device)
  const [currentView, setCurrentView] = useState<'welcome' | 'device'>('welcome');

  // Day / Night Cycle Mode (Auto / Dawn / Day / Sunset / Night)
  const [timeOfDayMode, setTimeOfDayMode] = useState<'auto' | DayNightTimeOfDay>('auto');

  // Modals and Panels visibility
  const [isTopPanelOpen, setIsTopPanelOpen] = useState<boolean>(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);
  const [showGraveyard, setShowGraveyard] = useState<boolean>(false);
  const [showQuests, setShowQuests] = useState<boolean>(false);
  const [showNewPet, setShowNewPet] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [showOwnerHealth, setShowOwnerHealth] = useState<boolean>(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState<boolean>(false);
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

  // Save state on changes and sync with pet slots
  useEffect(() => {
    saveState(petState);
    updatePetInSlots(petState);
    setPetSlots(loadPetSlots());
  }, [petState]);

  // Handler to switch between pets
  const handleSwitchPet = (targetPet: TamagotchiState) => {
    soundManager.playHappy();
    // Save current pet first
    updatePetInSlots(petState);
    // Switch to target pet
    setPetState(targetPet);
    saveState(targetPet);
    setPetSlots(loadPetSlots());
    showRewardNotification(
      '🔄 Mascota Cambiada',
      `Ahora estás cuidando a ${targetPet.name} (${targetPet.species === 'dog' ? 'Perrito' : 'Pollito'} Gen ${targetPet.generation}).`,
      targetPet.species === 'dog' ? '🐶' : '🐣'
    );
  };

  // Active Day/Night Cycle
  const activeTimeOfDay: DayNightTimeOfDay =
    timeOfDayMode === 'auto' ? getDayNightTimeOfDay() : timeOfDayMode;

  const handleCycleTimeOfDay = () => {
    soundManager.playSelect();
    const modes: Array<'auto' | DayNightTimeOfDay> = ['auto', 'dawn', 'day', 'sunset', 'night'];
    const nextIdx = (modes.indexOf(timeOfDayMode) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    setTimeOfDayMode(nextMode);

    const labels: Record<string, string> = {
      auto: '⏰ Tiempo Real Automático',
      dawn: '🌅 Amanecer Cálido',
      day: '☀️ Pleno Día Luminoso',
      sunset: '🌇 Atardecer Crepuscular',
      night: '🌙 Noche Estrellada'
    };

    showRewardNotification(
      '🌓 Ciclo Día / Noche',
      `Ambiente visual configurado en: ${labels[nextMode]}`,
      nextMode === 'night' ? '🌙' : nextMode === 'dawn' ? '🌅' : nextMode === 'sunset' ? '🌇' : '☀️'
    );
  };

  // Periodic Duolingo Notification Reminder Check (Every 30s)
  useEffect(() => {
    const notifTimer = setInterval(() => {
      if (!petState.isDead) {
        notificationManager.checkAndTriggerReminder(petState);
      }
    }, 30000);
    return () => clearInterval(notifTimer);
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

        // --- 1. SLEEP & LIGHT 8-HOUR CYCLE CHECK ---
        const isSleeping = updated.isSleeping || !updated.lightsOn;
        if (isSleeping) {
          if (updated.sleepStartSeconds === undefined) {
            updated.sleepStartSeconds = updated.elapsedSeconds;
          }
          const sleepDuration = updated.elapsedSeconds - updated.sleepStartSeconds;
          const SLEEP_REQUIRED_SECONDS = 8 * 3600; // 28,800 seconds (8 continuous hours)

          if (sleepDuration >= SLEEP_REQUIRED_SECONDS) {
            // Auto wake up after 8 hours of restorative sleep!
            updated.isSleeping = false;
            updated.lightsOn = true;
            updated.sleepStartSeconds = undefined;
            soundManager.playHappy();
            showRewardNotification(
              '☀️ ¡Buenos Días!',
              'Tu mascota completó sus 8 horas de sueño reparador y prendió la luz automáticamente.',
              '✨'
            );
          }
        }

        // --- 1B. 20-MINUTE ZUMBA TIMER COUNTDOWN & REWARD (1 PER DAY) ---
        if (updated.zumbaTimerRemainingSeconds && updated.zumbaTimerRemainingSeconds > 0) {
          const decrementedSec = Math.min(updated.zumbaTimerRemainingSeconds, addSeconds);
          updated.zumbaTimerRemainingSeconds = Math.max(0, updated.zumbaTimerRemainingSeconds - decrementedSec);

          if (updated.zumbaTimerRemainingSeconds === 0) {
            // 20-Minute Zumba session finished! Grant full day growth reward!
            const growthBonusSec = SECONDS_PER_DAY; // +1 whole day (24h / 86400s)
            const currentHp = typeof updated.healthPercent === 'number' ? updated.healthPercent : 100;
            const newHp = Math.min(100, currentHp + 35);

            updated.growthBonusSeconds += growthBonusSec;
            updated.healthPercent = newHp;
            updated.happyHearts = 4;
            updated.hungryHearts = Math.max(3, updated.hungryHearts);
            updated.discipline = Math.min(100, updated.discipline + 20);
            updated.zumbaCompletedDate = getTodayDateString();
            updated.zumbaData = {
              ...updated.zumbaData,
              todayMinutesCompleted: (updated.zumbaData?.todayMinutesCompleted || 0) + 20,
              totalMinutesEver: (updated.zumbaData?.totalMinutesEver || 0) + 20,
              totalCaloriesBurned: (updated.zumbaData?.totalCaloriesBurned || 0) + 190,
              lastZumbaDate: getTodayDateString()
            };

            // Complete quest
            updated.quests = updated.quests.map((q) => {
              if (q.category === 'zumba' || q.id === 'quest-zumba') {
                return { ...q, current: Math.min(q.target, q.current + 20), completed: true };
              }
              return q;
            });

            soundManager.playHappy();
            showRewardNotification(
              '🏆 ¡Zumba de 20 Minutos Completada!',
              '¡Completaste tu sesión diaria de 20 minutos! Recibiste +1 Día Entero (+24h) de Crecimiento, +35% Salud Vital ❤️ y Felicidad al Máximo (4/4).',
              '🔥'
            );
          }
        }

        // --- 1C. 7-DAY STAGE EVOLUTION CHECK ---
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

        // --- 1D. 8-HOUR SLEEP AUTO-WAKE CHECK ---
        if (updated.isSleeping && updated.sleepStartSeconds !== undefined) {
          const sleepElapsed = updated.elapsedSeconds - updated.sleepStartSeconds;
          const EIGHT_HOURS = 8 * 3600;
          if (sleepElapsed >= EIGHT_HOURS) {
            updated.isSleeping = false;
            updated.lightsOn = true;
            updated.sleepStartSeconds = undefined;
            soundManager.playHappy();
            showRewardNotification(
              '🌅 ¡Buenos Días!',
              'Tu mascota ha completado sus 8 horas de sueño reparador, encendió la luz y se despertó llena de energía.',
              '☀️'
            );
          }
        }

        // --- 2. VITAL STATS DECAY (Hunger, Happiness, Poop) ---
        const isEgg = updated.stage < EvolutionStage.BABY_CHICK;

        if (isEgg) {
          // Eggs absorb warmth from nest and don't consume solid food or generate poop
          updated.hungryHearts = 4;
          updated.happyHearts = 4;
          updated.poopCount = 0;
        } else {
          // Hatched chick decay rules (Authentic Japanese 1996/1997 Tamagotchi Rhythms):
          const isBaby = updated.stage === EvolutionStage.BABY_CHICK;
          
          // Baby chick requires frequent care; adult chick has longer, steadier intervals
          const baseHunger = isBaby ? 120 : 240;
          const baseHappy = isBaby ? 150 : 300;
          const basePoop = isBaby ? 240 : 360;

          // When sleeping in dark, decay is halted or slowed by 8x
          const hungerInterval = isSleeping ? baseHunger * 8 : baseHunger;
          const happyInterval = isSleeping ? baseHappy * 8 : baseHappy;

          // Hunger drops 1 heart
          if (Math.floor(updated.elapsedSeconds) % hungerInterval === 0 && updated.hungryHearts > 0) {
            updated.hungryHearts = Math.max(0, updated.hungryHearts - 1);
          }

          // Happiness drops 1 heart
          if (Math.floor(updated.elapsedSeconds) % happyInterval === 0 && updated.happyHearts > 0) {
            updated.happyHearts = Math.max(0, updated.happyHearts - 1);
          }

          // Poop occurs only when awake or if lights left ON (classic Tamagotchi rule: no poop while sleeping in the dark)
          if (!isSleeping && Math.floor(updated.elapsedSeconds) % basePoop === 0 && updated.poopCount < 4) {
            soundManager.playPoop();
            updated.poopCount += 1;
          }

          // Gradual discipline decay (slight decay every 600s if awake)
          if (!isSleeping && Math.floor(updated.elapsedSeconds) % 600 === 0 && updated.disciplinePercent > 0) {
            updated.disciplinePercent = Math.max(0, updated.disciplinePercent - 5);
          }
        }

        // --- 3. SICKNESS TRIGGERS (Authentic Japanese Bandai 1996/1997 Tamagotchi Standards) ---
        let currentHp = typeof updated.healthPercent === 'number' ? updated.healthPercent : 100;

        if (!updated.isSick && !isEgg) {
          // A. Cavities / Toothache: only when overfed sweets (5 or more snacks eaten without working out)
          const hasSnackCavity = updated.snacksEaten >= 5;

          // B. Filth Sickness: only if maximum capacity of 4 poops are left uncleaned for a prolonged time (check every 300s with 5% probability)
          const hasPoopNeglect = updated.poopCount >= 4 && Math.floor(updated.elapsedSeconds) % 300 === 0 && Math.random() < 0.05;

          // C. Severe Starvation Sickness: only if 0 hunger hearts and health critically low (< 20%)
          const hasStarvationNeglect = updated.hungryHearts === 0 && currentHp < 20 && Math.floor(updated.elapsedSeconds) % 300 === 0 && Math.random() < 0.05;

          // D. Rare Natural Stage Sickness: authentic rare event (check once per hour with 1.5% probability when awake)
          const naturalStageSickness = !isSleeping && Math.floor(updated.elapsedSeconds) % 3600 === 0 && Math.random() < 0.015;

          if (hasSnackCavity || hasPoopNeglect || hasStarvationNeglect || naturalStageSickness) {
            soundManager.playRefuse();
            updated.isSick = true;
            updated.sickDosesNeeded = (hasSnackCavity || updated.poopCount >= 4) ? 2 : 1;
            updated.needsAttention = true;
          }
        }

        // --- 4. HEALTH BAR DECAY & RESTORATIVE SLEEP SYSTEM ---
        // Natural awake baseline decay: In 6 hours -> -25%, in 24 hours -> -100%
        let baselineLoss = (100 / SECONDS_PER_DAY) * addSeconds;
        let neglectPenalty = 0;

        if (isSleeping) {
          // RESTORATIVE SLEEP: Negates baseline loss and slowly regenerates health (+0.02%/sec)
          // If lights are turned off in a clean environment and not sick
          if (!updated.lightsOn && updated.poopCount === 0 && !updated.isSick) {
            baselineLoss = 0;
            currentHp = Math.min(100, currentHp + (0.02 * addSeconds));
          } else {
            // Partial sleep benefit if lights left on or dirty
            baselineLoss = baselineLoss * 0.25;
          }
        }

        // Additional neglect penalties (only for active neglect)
        if (!isEgg) {
          if (updated.hungryHearts === 0) neglectPenalty += (0.004 * addSeconds);
          if (updated.happyHearts === 0) neglectPenalty += (0.002 * addSeconds);
          if (updated.poopCount >= 3) neglectPenalty += (0.004 * addSeconds);
        }
        if (updated.isSick) neglectPenalty += (0.006 * addSeconds);

        // Quest neglect decay: if 0 quests completed after 1 hour of waking
        const completedQuests = updated.quests.filter((q) => q.current >= q.target).length;
        if (completedQuests === 0 && updated.elapsedSeconds > 3600 && !isSleeping) {
          neglectPenalty += (0.001 * addSeconds);
        }

        const totalLoss = baselineLoss + neglectPenalty;
        currentHp = Math.max(0, currentHp - totalLoss);
        updated.healthPercent = Number(currentHp.toFixed(2));

        // --- 5. ATTENTION CALL SYSTEM ---
        const needsCall =
          (!isEgg && (updated.hungryHearts === 0 || updated.happyHearts === 0 || updated.poopCount >= 2)) ||
          updated.isSick ||
          currentHp < 30;

        if (needsCall && !updated.needsAttention && !isSleeping) {
          updated.needsAttention = true;
          soundManager.playAttentionCall();
        } else if (!needsCall && updated.needsAttention) {
          updated.needsAttention = false;
        }

        // --- 6. CRITICAL DEATH CHECK (Health = 0% or Severe Neglect) ---
        if (currentHp <= 0) {
          if (completedQuests === 0 && isEgg) {
            return triggerDeath(updated, 'quest_neglect');
          }
          if (updated.hungryHearts === 0 && !isEgg) {
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

  // DIRECT 1-CLICK ZUMBA WORKOUT (20-Minute Timer & 1-Per-Day Lock)
  const handleDirectZumbaWorkout = () => {
    if (petState.isDead) return;

    const today = getTodayDateString();
    if (petState.zumbaCompletedDate === today || (petState.zumbaData?.lastZumbaDate === today && petState.zumbaCompletedDate === today)) {
      soundManager.playRefuse();
      showRewardNotification(
        '🔒 Zumba Bloqueada por Hoy',
        'Solo se puede realizar 1 sesión de Zumba por día. ¡Ya completaste la de hoy con éxito! Vuelve mañana para entrenar.',
        '✅'
      );
      return;
    }

    if ((petState.zumbaTimerRemainingSeconds || 0) > 0) {
      soundManager.playSelect();
      const remSec = petState.zumbaTimerRemainingSeconds!;
      const m = Math.floor(remSec / 60);
      const s = remSec % 60;
      showRewardNotification(
        '⏳ Zumba en Progreso',
        `Temporizador activo: restan ${m}m ${s < 10 ? '0' : ''}${s}s para desbloquear la recompensa de +1 Día y +35% Salud. ¡A seguir bailando!`,
        '💃'
      );
      return;
    }

    // Start 20-minute workout timer (20 min * 60 = 1200 seconds)
    soundManager.playHappy();
    setPetState((prev) => ({
      ...prev,
      zumbaTimerRemainingSeconds: 1200
    }));

    if (!isZumbaMusicPlaying) {
      handleToggleZumbaMusic();
    }

    showRewardNotification(
      '💃 ¡Temporizador de Zumba Iniciado (20 min)!',
      'El temporizador de 20 minutos está corriendo. Al finalizar los 20 minutos recibirás automáticamente tu recompensa de +1 Día (+24h) de Crecimiento y +35% Salud.',
      '⏳'
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

  const handleToggleSleep = () => {
    soundManager.playSelect();
    setPetState((prev) => {
      const isCurrentlySleeping = prev.isSleeping || !prev.lightsOn;
      if (isCurrentlySleeping) {
        // Wake up immediately at user's will!
        soundManager.playPetChirp();
        showRewardNotification('☀️ ¡Mascota Despierta!', `${prev.name} se ha despertado con energía y alegría.`, '🐣');
        return {
          ...prev,
          lightsOn: true,
          isSleeping: false,
          sleepStartSeconds: undefined
        };
      } else {
        // Put to sleep immediately at user's will!
        soundManager.playSleepZzz();
        const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
        showRewardNotification('💤 ¡A Dormir!', `${prev.name} está durmiendo plácidamente con manta térmica (+20% Salud).`, '🌙');
        return {
          ...prev,
          lightsOn: false,
          isSleeping: true,
          healthPercent: Math.min(100, currentHp + 20),
          sleepStartSeconds: prev.elapsedSeconds
        };
      }
    });
  };

  const handleToggleLights = () => {
    handleToggleSleep();
  };

  const handleDrinkWater = () => {
    soundManager.playSelect();
    const todayStr = getTodayDateString();
    setPetState((prev) => {
      const habits = prev.ownerHabits || getInitialOwnerHabits();
      const currentWater = habits.lastWaterDate === todayStr ? habits.waterGlassesToday : 0;
      if (currentWater >= 8) return prev;

      const newWater = currentWater + 1;
      const totalWater = (habits.totalWaterLogged || 0) + 1;
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      const newHp = Math.min(100, currentHp + 3);

      const updatedHabits: OwnerHabitsState = {
        ...habits,
        waterGlassesToday: newWater,
        lastWaterDate: todayStr,
        totalWaterLogged: totalWater
      };

      // Check achievement hydration_master
      const achs = (prev.achievements || generateInitialAchievements()).map((a) => {
        if (a.id === 'hydration_master') {
          const unlocked = newWater >= 8;
          return { ...a, current: Math.max(a.current, newWater), unlocked: a.unlocked || unlocked };
        }
        return a;
      });

      return {
        ...prev,
        healthPercent: newHp,
        ownerHabits: updatedHabits,
        achievements: achs
      };
    });

    showRewardNotification(
      '💧 ¡Vaso de Agua Tomado!',
      `Hidratación registrada (${(petState.ownerHabits?.waterGlassesToday || 0) + 1}/8). ¡+3% Salud Vital para ${petState.name}!`,
      '🌊'
    );
  };

  const handleTakePills = () => {
    soundManager.playSelect();
    const todayStr = getTodayDateString();
    setPetState((prev) => {
      const habits = prev.ownerHabits || getInitialOwnerHabits();
      if (habits.pillsTakenToday && habits.lastPillDate === todayStr) return prev;

      const totalPillDays = (habits.totalPillDays || 0) + 1;
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      const newHp = Math.min(100, currentHp + 15);

      const updatedHabits: OwnerHabitsState = {
        ...habits,
        pillsTakenToday: true,
        lastPillDate: todayStr,
        totalPillDays
      };

      // Check medication_champion achievement
      const achs = (prev.achievements || generateInitialAchievements()).map((a) => {
        if (a.id === 'medication_champion') {
          const unlocked = totalPillDays >= 3;
          return { ...a, current: totalPillDays, unlocked: a.unlocked || unlocked };
        }
        return a;
      });

      return {
        ...prev,
        healthPercent: newHp,
        isSick: false, // Prevents sickness
        ownerHabits: updatedHabits,
        achievements: achs
      };
    });

    showRewardNotification(
      '💊 ¡Medicación / Vitaminas Tomadas!',
      `¡Compromiso con tu salud cumplido! +15% Salud y escudo preventivo para ${petState.name}.`,
      '🛡️'
    );
  };

  const handleCompleteSleepRoutine = () => {
    soundManager.playSelect();
    const todayStr = getTodayDateString();
    const isSleepingNow = petState.isSleeping;

    if (isSleepingNow) {
      // Wake up
      handleToggleSleep();
    } else {
      // Start sleep routine
      setPetState((prev) => {
        const habits = prev.ownerHabits || getInitialOwnerHabits();
        const totalSleepRoutines = (habits.totalSleepRoutines || 0) + 1;
        const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;

        const updatedHabits: OwnerHabitsState = {
          ...habits,
          sleepRoutineDoneToday: true,
          lastSleepRoutineDate: todayStr,
          totalSleepRoutines
        };

        const achs = (prev.achievements || generateInitialAchievements()).map((a) => {
          if (a.id === 'restful_sleep') {
            return { ...a, current: 1, unlocked: true };
          }
          return a;
        });

        return {
          ...prev,
          isSleeping: true,
          lightsOn: false,
          healthPercent: Math.min(100, currentHp + 20),
          ownerHabits: updatedHabits,
          achievements: achs
        };
      });

      showRewardNotification(
        '🌙 ¡Rutina de Sueño Iniciada!',
        `Luces apagadas y descanso activado. +20% Salud Vital y protección térmica nocturna.`,
        '💤'
      );
    }
  };

  const handleCleanPoop = () => {
    setPetState((prev) => {
      const currentHp = typeof prev.healthPercent === 'number' ? prev.healthPercent : 100;
      const poopCleaned = (prev.poopCleanedCount || 0) + 1;

      // Check spotless_home achievement
      const achs = (prev.achievements || generateInitialAchievements()).map((a) => {
        if (a.id === 'spotless_home') {
          const unlocked = poopCleaned >= 10;
          return { ...a, current: poopCleaned, unlocked: a.unlocked || unlocked };
        }
        return a;
      });

      return {
        ...prev,
        healthPercent: Math.min(100, currentHp + 10),
        poopCount: 0,
        poopCleanedCount: poopCleaned,
        achievements: achs,
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
      const minigamesWon = won ? (prev.minigamesWonCount || 0) + 1 : prev.minigamesWonCount || 0;

      // Check minigame_master achievement
      const achs = (prev.achievements || generateInitialAchievements()).map((a) => {
        if (a.id === 'minigame_master') {
          const unlocked = minigamesWon >= 5;
          return { ...a, current: minigamesWon, unlocked: a.unlocked || unlocked };
        }
        return a;
      });

      return {
        ...prev,
        healthPercent: won ? Math.min(100, currentHp + 15) : currentHp,
        happyHearts: won ? Math.min(4, prev.happyHearts + 1) : prev.happyHearts,
        weightGrams: Math.max(5, prev.weightGrams - (won ? 2 : 1)),
        growthBonusSeconds: won ? prev.growthBonusSeconds + 1800 : prev.growthBonusSeconds,
        minigamesWonCount: minigamesWon,
        achievements: achs
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
      const petsGiven = (prev.petsGivenCount || 0) + 1;

      // Check loving_caregiver achievement
      const achs = (prev.achievements || generateInitialAchievements()).map((a) => {
        if (a.id === 'loving_caregiver') {
          const unlocked = petsGiven >= 25;
          return { ...a, current: petsGiven, unlocked: a.unlocked || unlocked };
        }
        return a;
      });

      return {
        ...prev,
        healthPercent: Math.min(100, currentHp + 3),
        happyHearts: Math.min(4, prev.happyHearts + 1),
        discipline: Math.min(100, prev.discipline + 2),
        petsGivenCount: petsGiven,
        achievements: achs
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
  const handleConfirmNewPet = (name: string, species: PetSpecies = 'chick') => {
    neglectedTimerRef.current = {
      zeroHungerSince: null,
      zeroHappySince: null,
      sickSince: null,
      poopOverloadSince: null,
      questNeglectTick: 0
    };
    const nextGen = petState.generation + 1;
    const newState = resetToNewEgg(name, nextGen, petState.achievements, species);
    setPetState(newState);
    setShowNewPet(false);
    setShowGraveyard(false);
    showRewardNotification(
      species === 'dog' ? '🐶 ¡Nuevo Cachorrito Adoptado!' : '🥚 ¡Nuevo Huevo Iniciado!',
      `Generación ${nextGen} (${species === 'dog' ? 'Perrito' : 'Pollito'}) iniciada con éxito. ¡A cuidarlo!`,
      species === 'dog' ? '🐶' : '🐣'
    );
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

  if (currentView === 'welcome') {
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

        <WelcomeScreen
          state={petState}
          graveyardRecords={graveyardRecords}
          theme={theme}
          displayMode={displayMode}
          isZumbaMusicPlaying={isZumbaMusicPlaying}
          timeOfDay={activeTimeOfDay}
          onCycleTimeOfDay={handleCycleTimeOfDay}
          onStartGame={() => {
            soundManager.playStartGame();
            setCurrentView('device');
          }}
          onOpenGraveyard={() => setShowGraveyard(true)}
          onOpenQuests={() => setShowQuests(true)}
          onOpenNewPet={() => setShowNewPet(true)}
          onOpenGuide={() => setShowGuide(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenOwnerHealth={() => setShowOwnerHealth(true)}
          onOpenNotifications={() => setShowNotificationSettings(true)}
          onToggleSleep={handleToggleSleep}
          onDirectZumba={handleDirectZumbaWorkout}
          onToggleTheme={() => {
            const themes: DeviceTheme[] = ['neon-yellow', 'cyber-purple', 'retro-teal', 'coral-pink', 'midnight-black', 'vintage-white'];
            const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
            setTheme(nextTheme);
          }}
          onSelectTheme={(selectedTheme) => setTheme(selectedTheme)}
          onToggleSound={handleToggleZumbaMusic}
          onPet={handlePet}
        />

        {/* MODALS */}
        <AnimatePresence>
          {showNotificationSettings && (
            <NotificationSettingsModal
              isOpen={showNotificationSettings}
              onClose={() => setShowNotificationSettings(false)}
              onShowToast={showRewardNotification}
            />
          )}

          {showAchievements && (
            <AchievementsModal
              achievements={petState.achievements || generateInitialAchievements()}
              onClose={() => setShowAchievements(false)}
            />
          )}

          {showOwnerHealth && (
            <OwnerHealthModal
              habits={petState.ownerHabits || getInitialOwnerHabits()}
              petName={petState.name}
              isPetSleeping={petState.isSleeping}
              onClose={() => setShowOwnerHealth(false)}
              onDrinkWater={handleDrinkWater}
              onTakePills={handleTakePills}
              onCompleteSleepRoutine={handleCompleteSleepRoutine}
            />
          )}

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
                handleDirectZumbaWorkout();
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

          {showGuide && (
            <ManualModal
              isOpen={showGuide}
              onClose={() => setShowGuide(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  const getDayNightBgClasses = () => {
    switch (activeTimeOfDay) {
      case 'dawn':
        return 'bg-gradient-to-b from-amber-950/30 via-slate-950 to-slate-950';
      case 'day':
        return 'bg-gradient-to-b from-sky-950/35 via-blue-950/20 to-slate-950';
      case 'sunset':
        return 'bg-gradient-to-b from-rose-950/35 via-purple-950/25 to-slate-950';
      case 'night':
        return 'bg-gradient-to-b from-indigo-950/40 via-slate-950/90 to-slate-950';
    }
  };

  return (
    <div className={`min-h-screen ${getDayNightBgClasses()} text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 transition-colors duration-700 relative`}>
      {/* Dynamic Ambient Sky Glow Overlay tailored to Day/Night */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {activeTimeOfDay === 'night' && (
          <div className="absolute top-6 right-10 text-indigo-300/30 text-6xl select-none">✨</div>
        )}
        {activeTimeOfDay === 'dawn' && (
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        )}
        {activeTimeOfDay === 'day' && (
          <div className="absolute -top-20 right-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        )}
        {activeTimeOfDay === 'sunset' && (
          <div className="absolute -top-20 left-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        )}
      </div>

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

      {/* Top Navigation Bar with Replegable (Collapsible) Mode for Full Mobile Game Visibility */}
      <header className="border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 shadow-md transition-all">
        {isHeaderCollapsed ? (
          /* Sleek Minimal Collapsed Floating Strip */
          <div className="max-w-5xl mx-auto px-3 py-1.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setCurrentView('welcome');
                }}
                className="px-2.5 py-1 rounded-lg font-black bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-xs flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                title="Volver al Panel Principal"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Panel</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs font-black">
                <span>{petState.species === 'dog' ? '🐶' : '🐣'} {petState.name}</span>
                <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full">
                  Día {petState.ageDays}/7
                </span>
                <span className="text-[10px] font-bold text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded-full border border-rose-500/30">
                  ❤️ {currentHealth}%
                </span>
              </div>
            </div>

            {/* Replegable Unfold Toggle Button */}
            <button
              onClick={() => {
                soundManager.playBeep(1100, 0.02);
                setIsHeaderCollapsed(false);
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-xl font-black bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer active:scale-95 animate-pulse"
              title="Desplegar barra de opciones, zumba, retos y panel superior"
            >
              <ChevronDown className="w-4 h-4 stroke-[3]" />
              <span>Desplegar Menú</span>
            </button>
          </div>
        ) : (
          /* Full Expanded Header with Fold Button */
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
            {/* Logo & Pet Info */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setCurrentView('welcome');
                }}
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 hover:from-amber-300 flex items-center justify-center text-lg shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-95 shrink-0"
                title="Volver a la Pantalla de Inicio"
              >
                {petState.species === 'dog' ? '🐶' : '🐣'}
              </button>
              <div>
                <h1 className="text-xs sm:text-sm font-black tracking-tight flex items-center gap-1.5 flex-wrap">
                  {petState.name}
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full">
                    Gen {petState.generation} • Día {petState.ageDays}/7
                  </span>
                  {/* Clickable Day/Night pill */}
                  <button
                    onClick={handleCycleTimeOfDay}
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full border transition-all cursor-pointer hover:opacity-90 active:scale-95 flex items-center gap-1 ${
                      activeTimeOfDay === 'night'
                        ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                        : activeTimeOfDay === 'dawn'
                        ? 'bg-orange-950/80 text-amber-300 border-amber-500/40'
                        : activeTimeOfDay === 'sunset'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                        : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                    }`}
                    title="Cambiar Ciclo Día / Noche Visual"
                  >
                    <span>
                      {activeTimeOfDay === 'night' ? '🌙 Noche' : activeTimeOfDay === 'dawn' ? '🌅 Amanecer' : activeTimeOfDay === 'sunset' ? '🌇 Atardecer' : '☀️ Día'}
                    </span>
                  </button>
                </h1>
              </div>
            </div>

            {/* Quick Action Buttons in Top Bar */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {/* PET SWITCHER / ADOPT BUTTON IN HEADER */}
              <button
                onClick={() => {
                  soundManager.playSelect();
                  if (petSlots.length > 1) {
                    const currentIndex = petSlots.findIndex(
                      (p) => (p.id && p.id === petState.id) || (p.species === petState.species && p.generation === petState.generation)
                    );
                    const nextPet = petSlots[(currentIndex + 1) % petSlots.length];
                    handleSwitchPet(nextPet);
                  } else {
                    setShowNewPet(true);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 text-slate-950 shadow-md shadow-amber-500/25 transition-all cursor-pointer active:scale-95 text-xs border border-amber-300 ring-1 ring-amber-400/50"
                title={petSlots.length > 1 ? `Alternar a la siguiente mascota (${petSlots.length} activas)` : 'Adoptar otra mascota para alternar'}
              >
                <span className="text-sm">{petState.species === 'dog' ? '🐶' : '🐣'}</span>
                <span>{petSlots.length > 1 ? 'Alternar Mascota 🔄' : '+ Otra Mascota'}</span>
              </button>

              {/* VOLVER AL PANEL PRINCIPAL BUTTON */}
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setCurrentView('welcome');
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl font-black bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer active:scale-95 text-xs"
                title="Regresar al Panel Principal de Bienvenida"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                <span>Panel</span>
              </button>

              {/* DORMIR / DESPERTAR LIBREMENTE BUTTON */}
              <button
                onClick={handleToggleSleep}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl font-black border transition-all cursor-pointer active:scale-95 shadow-md ${
                  petState.isSleeping
                    ? 'bg-indigo-900/90 hover:bg-indigo-800 text-indigo-200 border-indigo-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
                }`}
                title={petState.isSleeping ? 'Despertar ahora mismo' : 'Poner a dormir ahora'}
              >
                <span>{petState.isSleeping ? '☀️ Despertar' : '💤 Dormir'}</span>
              </button>

              {/* DUOLINGO NOTIFICATIONS BUTTON */}
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setShowNotificationSettings(true);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-xl font-bold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 shadow-md transition-all cursor-pointer active:scale-95"
                title="Configurar Notificaciones Estilo Duolingo"
              >
                <Bell className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Alertas</span>
              </button>

              {/* DIRECT +24 HRS SIMULATION BUTTON */}
              <button
                onClick={() => handleAdvanceDay(1)}
                className="flex items-center gap-1 px-2 py-1 rounded-xl font-black bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95 text-xs"
                title="Avanzar 24 Horas (+1 Día) para simular el ciclo de crecimiento"
              >
                <FastForward className="w-3.5 h-3.5 fill-current" />
                <span>+24h</span>
              </button>

              {/* DIRECT 1-CLICK ZUMBA REWARD BUTTON */}
              <button
                onClick={() => handleDirectZumbaWorkout()}
                disabled={petState.zumbaCompletedDate === getTodayDateString()}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl font-black shadow-md transition-all cursor-pointer active:scale-95 text-xs ${
                  petState.zumbaCompletedDate === getTodayDateString()
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-85'
                    : (petState.zumbaTimerRemainingSeconds || 0) > 0
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/30 animate-pulse'
                    : 'bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 hover:from-rose-400 hover:to-yellow-400 text-slate-950 shadow-rose-500/20'
                }`}
                title={
                  petState.zumbaCompletedDate === getTodayDateString()
                    ? 'Ya completaste la sesión de Zumba hoy. Vuelve mañana.'
                    : (petState.zumbaTimerRemainingSeconds || 0) > 0
                    ? `Temporizador activo: restan ${Math.floor((petState.zumbaTimerRemainingSeconds || 0) / 60)}m ${((petState.zumbaTimerRemainingSeconds || 0) % 60)}s`
                    : 'Iniciar sesión de Zumba (20 min). Al finalizar otorga +1 Día de crecimiento y +35% salud.'
                }
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                {petState.zumbaCompletedDate === getTodayDateString() ? (
                  <span>✅ Zumba</span>
                ) : (petState.zumbaTimerRemainingSeconds || 0) > 0 ? (
                  <span>
                    ⏳ {Math.floor((petState.zumbaTimerRemainingSeconds || 0) / 60)}:
                    {String((petState.zumbaTimerRemainingSeconds || 0) % 60).padStart(2, '0')}
                  </span>
                ) : (
                  <span>💃 Zumba</span>
                )}
              </button>

              {/* Cementerio Button */}
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setShowGraveyard(true);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-xs transition-all cursor-pointer active:scale-95"
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
                className="relative flex items-center gap-1 px-2 py-1 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span>🎯</span>
                <span className="hidden sm:inline">Retos</span>
                <span>({completedQuestsCount}/5)</span>
                {completedQuestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                )}
              </button>

              {/* Logros Button */}
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setShowAchievements(true);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-xl font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-xs transition-all cursor-pointer active:scale-95"
                title="Ver Sistema de Logros Desbloqueables"
              >
                <span>🏆</span>
                <span className="hidden sm:inline">Logros</span>
              </button>

              {/* Hábitos del Dueño Button */}
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setShowOwnerHealth(true);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-xl font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-xs transition-all cursor-pointer active:scale-95"
                title="Registrar Hidratación, Medicación y Rutina de Sueño"
              >
                <span>💧</span>
                <span className="hidden sm:inline">Hábitos</span>
              </button>

              {/* DESPLEGABLE / COLLAPSIBLE TOP PANEL TOGGLE BUTTON */}
              <button
                onClick={() => {
                  soundManager.playBeep(900, 0.02);
                  setIsTopPanelOpen(!isTopPanelOpen);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl font-black text-xs border transition-all cursor-pointer active:scale-95 ${
                  isTopPanelOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
                title={isTopPanelOpen ? 'Ocultar panel superior de cuidador' : 'Desplegar panel superior de cuidador y simulación'}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Panel Cuidador</span>
                {isTopPanelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* REPLEGAR PESTAÑA / OCULTAR MENÚ PARA VER EL JUEGO COMPLETO */}
              <button
                onClick={() => {
                  soundManager.playBeep(800, 0.02);
                  setIsHeaderCollapsed(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 shadow-sm transition-all cursor-pointer active:scale-95"
                title="Replegar esta barra superior para ver el juego en pantalla completa"
              >
                <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden xs:inline">Replegar</span>
              </button>
            </div>
          </div>
        )}

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
                      onClick={() => handleDirectZumbaWorkout()}
                      disabled={petState.zumbaCompletedDate === getTodayDateString()}
                      className={`flex items-center gap-1.5 font-black px-3.5 py-2 rounded-xl text-xs shadow-md cursor-pointer active:scale-95 transition-all ${
                        petState.zumbaCompletedDate === getTodayDateString()
                          ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                          : (petState.zumbaTimerRemainingSeconds || 0) > 0
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 animate-pulse'
                          : 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 text-white'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {petState.zumbaCompletedDate === getTodayDateString() ? (
                        <span>✅ Zumba Completada (Hoy)</span>
                      ) : (petState.zumbaTimerRemainingSeconds || 0) > 0 ? (
                        <span>
                          ⏳ Zumba ({Math.floor((petState.zumbaTimerRemainingSeconds || 0) / 60)}:
                          {String((petState.zumbaTimerRemainingSeconds || 0) % 60).padStart(2, '0')})
                        </span>
                      ) : (
                        <span>💃 Zumba (20 min • +1 Día)</span>
                      )}
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

        {/* Clean Collapsible Toggle & Navigation Quick Pills above the Tamagotchi */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2">
          {/* Direct Back to Welcome Screen Pill */}
          <button
            onClick={() => {
              soundManager.playSelect();
              setCurrentView('welcome');
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/95 hover:bg-slate-800 border-2 border-amber-400/70 text-xs font-black text-amber-300 shadow-lg shadow-amber-400/15 transition-all cursor-pointer active:scale-95 hover:border-amber-300"
            title="Volver a la Pantalla de Inicio / Panel Principal"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>⬅️ Volver al Panel Principal</span>
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(900, 0.02);
              setIsTopPanelOpen(!isTopPanelOpen);
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-300 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTopPanelOpen ? '🔼 Ocultar Panel' : '🔽 Panel Cuidador'}</span>
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

          {/* Add New Pet Shortcut */}
          <button
            onClick={() => {
              soundManager.playSelect();
              setShowNewPet(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-md transition-all cursor-pointer active:scale-95"
            title="Adoptar otra mascota (Perrito o Pollito) y alternar entre ellas"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Mascota</span>
          </button>
        </div>

        {/* Multi-Pet Switching Bar (Visible if 2+ pets exist or can toggle) */}
        {petSlots.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-slate-900/90 border border-amber-400/30 rounded-2xl p-2.5 shadow-lg flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between text-[11px] font-black text-amber-300 px-1">
              <span>🐾 Alternar entre Mascotas ({petSlots.length} activas):</span>
              <span className="text-[10px] text-slate-400 font-mono font-normal">Toca para cambiar</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {petSlots.map((slot, idx) => {
                const isSelected = (slot.id && slot.id === petState.id) || (slot.species === petState.species && slot.generation === petState.generation);
                return (
                  <button
                    key={slot.id || `slot-${idx}`}
                    onClick={() => handleSwitchPet(slot)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/25 font-black scale-102 ring-2 ring-amber-300/60'
                        : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    <span className="text-base">{slot.species === 'dog' ? '🐶' : '🐣'}</span>
                    <div className="text-left leading-tight">
                      <div className="text-xs truncate max-w-[100px]">{slot.name}</div>
                      <div className={`text-[9px] font-mono ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                        Día {slot.ageDays} • ❤️ {slot.healthPercent ?? 100}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

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
          hasMultiplePets={petSlots.length > 1}
        />

        {/* EGG VITAL WARMTH & INCUBATION / DOG HEALTH & NUTRITION MONITOR */}
        {(petState.species === 'dog' || petState.stage < EvolutionStage.BABY_CHICK) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5"
          >
            {/* Header with Temperature / Vital Gauge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  <Thermometer className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                    <span>
                      {petState.species === 'dog'
                        ? 'Monitor de Calor Vital & Alimentación'
                        : 'Monitor de Calor Vital e Incubación'}
                    </span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-full font-mono">
                      Día {petState.ageDays}/7
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    {petState.species === 'dog'
                      ? `Vitalidad y energía del cachorro: ${currentHealth}% Salud (${(37.5 + (currentHealth / 100) * 1.5).toFixed(1)}°C corporal)`
                      : `Temperatura térmica del huevo: ${(36.0 + (currentHealth / 100) * 2.2).toFixed(1)}°C (${currentHealth}% Calor Vital)`}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`text-xs font-black uppercase px-3 py-1 rounded-full border shadow-sm ${
                  currentHealth > 70
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : currentHealth > 40
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-rose-500/25 text-rose-300 border-rose-500/50 animate-bounce'
                }`}
              >
                {currentHealth > 70
                  ? petState.species === 'dog' ? '🐶 Salud Óptima & Enérgico' : '🔥 Nido Cálido & Saludable'
                  : currentHealth > 40
                  ? petState.species === 'dog' ? '🍖 Vitalidad Estable' : '♨️ Temperatura Estable'
                  : petState.species === 'dog' ? '⚠️ ¡ATENCIÓN URGENTE!' : '❄️ ¡PELIGRO DE FRÍO!'}
              </span>
            </div>

            {/* Visual Temperature Meter Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                <span>{petState.species === 'dog' ? '❤️ 0% (Crítico)' : '❄️ 35.0°C (Crítico)'}</span>
                <span className="text-amber-300 font-black">
                  {petState.species === 'dog' ? '🐾 Rango Óptimo: 70% - 100%' : '🌡️ Rango Óptimo: 37.0°C - 38.2°C'}
                </span>
                <span>{petState.species === 'dog' ? '🍖 100% (Máx)' : '🔥 38.5°C (Máx)'}</span>
              </div>
              <div className="w-full h-3.5 bg-slate-950 rounded-full p-0.5 border border-amber-500/30 overflow-hidden shadow-inner">
                <motion.div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentHealth > 70
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-rose-500 shadow-md shadow-amber-500/40'
                      : currentHealth > 40
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-500'
                      : 'bg-gradient-to-r from-blue-600 via-rose-600 to-red-500 animate-pulse'
                  }`}
                  style={{ width: `${Math.max(6, currentHealth)}%` }}
                />
              </div>
            </div>

            {/* 4 Interactive Sources of Vital Warmth / Dog Nutrition */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider block">
                {petState.species === 'dog'
                  ? '¿Cómo cuidar la vitalidad y felicidad de tu perrito?'
                  : '¿Dónde y cómo absorbe calor el huevo para no morir de frío?'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Caricias */}
                <div
                  onClick={() => handlePet()}
                  className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-amber-500/30 transition-all cursor-pointer group active:scale-98"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg group-hover:scale-110 transition-transform">🤲</span>
                    <span className="font-black text-xs text-amber-300">
                      {petState.species === 'dog' ? '1. Mimos y Acariciar' : '1. Caricias al Cascarón'}
                    </span>
                    <span className="ml-auto text-[9px] font-mono font-bold bg-amber-400/15 text-amber-300 px-1.5 py-0.2 rounded">
                      +3% Salud
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {petState.species === 'dog'
                      ? 'Toca al perrito en la pantalla o haz clic aquí para darle afecto (+3% Salud y felicidad).'
                      : 'Toca el huevo en la pantalla LCD o haz clic aquí. Transfiere calor biológico directo de tus manos.'}
                  </p>
                </div>

                {/* 2. Minijuegos / Alimentación */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{petState.species === 'dog' ? '🍖' : '🎮'}</span>
                    <span className="font-black text-xs text-amber-300">
                      {petState.species === 'dog' ? '2. Alimentación & Minijuegos' : '2. Minijuegos de Destreza'}
                    </span>
                    <span className="ml-auto text-[9px] font-mono font-bold bg-amber-400/15 text-amber-300 px-1.5 py-0.2 rounded">
                      +15% Salud
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {petState.species === 'dog'
                      ? 'Aliméntalo con croquetas (🍖) o premios (🦴) desde el menú del Tamagotchi y juega a atrapar chispas.'
                      : 'Juega en el botón 🎮 del Tamagotchi. La fricción y victorias térmicas aceleran 30 min la incubación.'}
                  </p>
                </div>

                {/* 3. Zumba */}
                <div
                  onClick={() => handleDirectZumbaWorkout()}
                  className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/40 to-amber-950/40 hover:from-rose-950/60 hover:to-amber-950/60 border border-rose-500/40 transition-all cursor-pointer group active:scale-98"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg group-hover:scale-110 transition-transform">💃</span>
                    <span className="font-black text-xs text-rose-300">3. Sesión Zumba 20 min</span>
                    <span className="ml-auto text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded">
                      +35% Salud & +24h
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {petState.species === 'dog'
                      ? 'Entrena con tu mascota para llenar su vitalidad y avanzar su crecimiento diario.'
                      : 'Tu entrenamiento genera calor masivo que calienta el nido y avanza 1 día completo de incubación.'}
                  </p>
                </div>

                {/* 4. Retos y Sueño */}
                <div
                  onClick={() => setShowQuests(true)}
                  className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-emerald-500/30 transition-all cursor-pointer active:scale-98"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🪺</span>
                    <span className="font-black text-xs text-emerald-300">
                      {petState.species === 'dog' ? '4. Retos Diarios & Descanso' : '4. Retos del Nido & Sueño'}
                    </span>
                    <span className="ml-auto text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">
                      Vitalidad Óptima
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {petState.species === 'dog'
                      ? 'Cumplir los 5 retos diarios y apagar la luz para que duerma mantiene al perrito saludable y activo.'
                      : 'Cumplir los 5 retos diarios y apagar la luz para que duerma 8h conserva el calor del nido.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 7-Day Evolution Timeline Component */}
        <div className="w-full max-w-2xl">
          <EvolutionTimeline
            state={petState}
            onOpenZumba={() => handleDirectZumbaWorkout()}
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
        {showAchievements && (
          <AchievementsModal
            achievements={petState.achievements || generateInitialAchievements()}
            onClose={() => setShowAchievements(false)}
          />
        )}

        {showOwnerHealth && (
          <OwnerHealthModal
            habits={petState.ownerHabits || getInitialOwnerHabits()}
            petName={petState.name}
            isPetSleeping={petState.isSleeping}
            onClose={() => setShowOwnerHealth(false)}
            onDrinkWater={handleDrinkWater}
            onTakePills={handleTakePills}
            onCompleteSleepRoutine={handleCompleteSleepRoutine}
          />
        )}

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
              handleDirectZumbaWorkout();
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

        {showNotificationSettings && (
          <NotificationSettingsModal
            isOpen={showNotificationSettings}
            onClose={() => setShowNotificationSettings(false)}
            onShowToast={showRewardNotification}
          />
        )}

        {showGuide && (
          <ManualModal
            isOpen={showGuide}
            onClose={() => setShowGuide(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

