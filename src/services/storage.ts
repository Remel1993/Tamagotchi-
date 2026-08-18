import {
  EvolutionStage,
  TamagotchiState,
  StageConfig,
  GraveyardRecord,
  DailyQuest,
  ZumbaSessionState
} from '../types/tamagotchi';

export const SECONDS_PER_DAY = 86400; // 24 hours

export const STAGES_CONFIG: Record<EvolutionStage, StageConfig> = {
  [EvolutionStage.EGG_INCUBATING]: {
    stage: EvolutionStage.EGG_INCUBATING,
    dayNumber: 1,
    dayRangeLabel: 'Día 1 (0h - 24h)',
    name: '1. Huevo en Incubación',
    subtitle: 'El huevo descansa recibiendo calor y cuidados',
    description: 'Día 1 del ciclo de 7 días. El huevo está en sus primeros momentos de desarrollo. Necesita temperatura estable y cariño.',
    startSecond: 0,
    endSecond: SECONDS_PER_DAY * 1
  },
  [EvolutionStage.EGG_WIGGLING]: {
    stage: EvolutionStage.EGG_WIGGLING,
    dayNumber: 2,
    dayRangeLabel: 'Día 2 (24h - 48h)',
    name: '2. Huevo Moviéndose',
    subtitle: 'El huevo se sacude con fuerza a los lados',
    description: 'Día 2 del ciclo. ¡El embrión dentro del huevo está despierto y activo! Se tambalea emocionado buscando romper la cáscara.',
    startSecond: SECONDS_PER_DAY * 1,
    endSecond: SECONDS_PER_DAY * 2
  },
  [EvolutionStage.EGG_CRACKING]: {
    stage: EvolutionStage.EGG_CRACKING,
    dayNumber: 3,
    dayRangeLabel: 'Día 3 (48h - 72h)',
    name: '3. Grietas en el Cascarón',
    subtitle: 'Aparecen profundas fisuras y fracturas',
    description: 'Día 3 del ciclo. Pequeñas grietas se extienden por toda la superficie del huevo. ¡El nacimiento está muy cerca!',
    startSecond: SECONDS_PER_DAY * 2,
    endSecond: SECONDS_PER_DAY * 3
  },
  [EvolutionStage.EGG_HATCHING]: {
    stage: EvolutionStage.EGG_HATCHING,
    dayNumber: 4,
    dayRangeLabel: 'Día 4 (72h - 96h)',
    name: '4. Descascarándose',
    subtitle: 'Trozos de cascarón caen y asoma el pollito',
    description: 'Día 4 del ciclo. La cáscara superior se desprende mientras asoman los ojitos brillantes del pollito.',
    startSecond: SECONDS_PER_DAY * 3,
    endSecond: SECONDS_PER_DAY * 4
  },
  [EvolutionStage.BABY_CHICK]: {
    stage: EvolutionStage.BABY_CHICK,
    dayNumber: 5,
    dayRangeLabel: 'Días 5 y 6 (96h - 144h)',
    name: '5. Pollito Bebé en Cascarón',
    subtitle: '¡Nació tu pollito amarillo! Sentado en su cascarón',
    description: 'Días 5 y 6 del ciclo. ¡Felicidades, nació tu Tamagotchi! En esta etapa es vulnerable: aliméntalo, baila Zumba para darle energía y límpiale su casita.',
    startSecond: SECONDS_PER_DAY * 4,
    endSecond: SECONDS_PER_DAY * 6
  },
  [EvolutionStage.ADULT_CHICK]: {
    stage: EvolutionStage.ADULT_CHICK,
    dayNumber: 7,
    dayRangeLabel: 'Día 7+ (144h en adelante)',
    name: '6. Pollo Adulto Completo',
    subtitle: 'Mascota adulta desarrollada, fuerte y autónoma',
    description: 'Día 7 en adelante. ¡Completaste el ciclo de 7 días de huevo a pollo adulto! Mantén sus corazones llenos y su rutina fitness de Zumba.',
    startSecond: SECONDS_PER_DAY * 6,
    endSecond: Infinity
  },
  [EvolutionStage.DEAD]: {
    stage: EvolutionStage.DEAD,
    dayNumber: 0,
    dayRangeLabel: 'Q.E.P.D.',
    name: '7. Mascota Fallecida (Memorial)',
    subtitle: 'El alma de tu Tamagotchi partió al más allá',
    description: 'Tu mascota ha fallecido. Puedes honrar su memoria en el Cementerio y hacer nacer una nueva mascota para continuar la siguiente generación.',
    startSecond: 0,
    endSecond: 0
  }
};

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function generateDailyQuests(): DailyQuest[] {
  return [
    {
      id: 'quest-zumba',
      title: 'Bailar 15 min de Zumba',
      description: 'Haz tu sesión de Zumba diaria para darle energía vital e impulso de crecimiento a tu mascota.',
      icon: '💃',
      category: 'zumba',
      target: 15,
      current: 0,
      unit: 'min',
      rewardText: '+2h Crecimiento y +1 Corazón de Felicidad',
      completed: false,
      claimed: false
    },
    {
      id: 'quest-feed',
      title: 'Alimentar 3 Comidas Sanas',
      description: 'Sirve 3 platos de arroz nutritivo a tu Tamagotchi para mantenerlo fuerte.',
      icon: '🍚',
      category: 'care',
      target: 3,
      current: 0,
      unit: 'veces',
      rewardText: '+1 Corazón de Hambre y +15% Disciplina',
      completed: false,
      claimed: false
    },
    {
      id: 'quest-game',
      title: 'Ganar 2 Mini-Juegos',
      description: 'Juega a Adivina la Dirección con tu mascota y acierta en al menos 2 partidas.',
      icon: '🎮',
      category: 'game',
      target: 2,
      current: 0,
      unit: 'victorias',
      rewardText: '+2 Corazones de Felicidad',
      completed: false,
      claimed: false
    },
    {
      id: 'quest-clean',
      title: 'Higiene Impecable',
      description: 'Limpia la suciedad o dale un baño relajante con el patito de goma.',
      icon: '🦆',
      category: 'hygiene',
      target: 1,
      current: 0,
      unit: 'limpiezas',
      rewardText: 'Inmunidad a enfermedades por 6 horas',
      completed: false,
      claimed: false
    },
    {
      id: 'quest-pet',
      title: 'Dar Cariño y Acariciar',
      description: 'Haz clic sobre tu Tamagotchi para acariciarlo y darle afecto 3 veces.',
      icon: '💖',
      category: 'care',
      target: 3,
      current: 0,
      unit: 'caricias',
      rewardText: '+20% Disciplina y Buena Conducta',
      completed: false,
      claimed: false
    }
  ];
}

const INITIAL_ZUMBA_STATE: ZumbaSessionState = {
  dailyTargetMinutes: 15,
  todayMinutesCompleted: 0,
  currentStreakDays: 1,
  lastZumbaDate: getTodayDateString(),
  totalMinutesEver: 0,
  totalCaloriesBurned: 0
};

export const INITIAL_TAMAGOTCHI_STATE: TamagotchiState = {
  stage: EvolutionStage.EGG_INCUBATING,
  name: 'Piolín',
  ageDays: 1,
  weightGrams: 5,
  birthTimestamp: Date.now(),
  healthPercent: 100, // 0 to 100% vital health
  hungryHearts: 4,
  happyHearts: 4,
  discipline: 30,
  poopCount: 0,
  isSick: false,
  sickDosesNeeded: 0,
  isSleeping: false,
  lightsOn: true,
  needsAttention: false,
  attentionReason: null,
  isDead: false,
  deathReason: null,
  generation: 1,
  elapsedSeconds: 0,
  growthBonusSeconds: 0,
  simulationSpeedMultiplier: 1, // 1 = Real 7-day time
  snacksEaten: 0,
  zumbaData: INITIAL_ZUMBA_STATE,
  quests: generateDailyQuests(),
  lastQuestResetDate: getTodayDateString()
};

const STORAGE_KEYS = {
  STATE: 'tamagotchi_game_state_v3',
  GRAVEYARD: 'tamagotchi_graveyard_records_v3',
  THEME: 'tamagotchi_device_theme_v3',
  DISPLAY_MODE: 'tamagotchi_display_mode_v3'
};

export function calculateStageForSeconds(totalEffectiveSeconds: number): EvolutionStage {
  if (totalEffectiveSeconds < SECONDS_PER_DAY * 1) return EvolutionStage.EGG_INCUBATING; // Day 1
  if (totalEffectiveSeconds < SECONDS_PER_DAY * 2) return EvolutionStage.EGG_WIGGLING;   // Day 2
  if (totalEffectiveSeconds < SECONDS_PER_DAY * 3) return EvolutionStage.EGG_CRACKING;   // Day 3
  if (totalEffectiveSeconds < SECONDS_PER_DAY * 4) return EvolutionStage.EGG_HATCHING;   // Day 4
  if (totalEffectiveSeconds < SECONDS_PER_DAY * 6) return EvolutionStage.BABY_CHICK;     // Days 5 & 6
  return EvolutionStage.ADULT_CHICK; // Day 7+
}

export function getTimeUntilNextStage(totalEffectiveSeconds: number): {
  currentStage: EvolutionStage;
  currentDay: number;
  progressPercent: number;
  secondsRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  nextStageName: string;
} {
  const currentStage = calculateStageForSeconds(totalEffectiveSeconds);
  const currentDay = Math.min(7, Math.floor(totalEffectiveSeconds / SECONDS_PER_DAY) + 1);

  let startSec = 0;
  let endSec = SECONDS_PER_DAY * 1;
  let nextStageName = 'Huevo Moviéndose';

  switch (currentStage) {
    case EvolutionStage.EGG_INCUBATING:
      startSec = 0;
      endSec = SECONDS_PER_DAY * 1;
      nextStageName = 'Día 2: Huevo Moviéndose';
      break;
    case EvolutionStage.EGG_WIGGLING:
      startSec = SECONDS_PER_DAY * 1;
      endSec = SECONDS_PER_DAY * 2;
      nextStageName = 'Día 3: Grietas en el Cascarón';
      break;
    case EvolutionStage.EGG_CRACKING:
      startSec = SECONDS_PER_DAY * 2;
      endSec = SECONDS_PER_DAY * 3;
      nextStageName = 'Día 4: Descascarándose';
      break;
    case EvolutionStage.EGG_HATCHING:
      startSec = SECONDS_PER_DAY * 3;
      endSec = SECONDS_PER_DAY * 4;
      nextStageName = 'Día 5: Pollito Bebé en Cascarón';
      break;
    case EvolutionStage.BABY_CHICK:
      startSec = SECONDS_PER_DAY * 4;
      endSec = SECONDS_PER_DAY * 6;
      nextStageName = 'Día 7: Pollo Adulto Completo';
      break;
    case EvolutionStage.ADULT_CHICK:
      startSec = SECONDS_PER_DAY * 6;
      endSec = SECONDS_PER_DAY * 7;
      nextStageName = 'Máxima Madurez Alcanzada';
      break;
  }

  const stageDuration = endSec - startSec;
  const elapsedInStage = Math.max(0, totalEffectiveSeconds - startSec);
  const secondsRemaining = Math.max(0, endSec - totalEffectiveSeconds);
  const progressPercent = Math.min(100, Math.round((elapsedInStage / stageDuration) * 100));
  const hoursRemaining = Math.floor(secondsRemaining / 3600);
  const minutesRemaining = Math.floor((secondsRemaining % 3600) / 60);

  return {
    currentStage,
    currentDay,
    progressPercent,
    secondsRemaining,
    hoursRemaining,
    minutesRemaining,
    nextStageName
  };
}

export function loadSavedState(): TamagotchiState {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.STATE);
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = getTodayDateString();
      
      // Check if daily quests need a reset
      let quests = parsed.quests || generateDailyQuests();
      let lastQuestResetDate = parsed.lastQuestResetDate || today;
      let zumbaData = parsed.zumbaData || INITIAL_ZUMBA_STATE;

      if (lastQuestResetDate !== today) {
        quests = generateDailyQuests();
        lastQuestResetDate = today;
        zumbaData = {
          ...zumbaData,
          todayMinutesCompleted: 0,
          lastZumbaDate: today
        };
      }

      let state: TamagotchiState = {
        ...INITIAL_TAMAGOTCHI_STATE,
        healthPercent: typeof parsed.healthPercent === 'number' ? parsed.healthPercent : 100,
        ...parsed,
        quests,
        lastQuestResetDate,
        zumbaData
      };

      // --- OFFLINE TIME CATCH-UP & 6-HOUR / 24-HOUR HEALTH DECAY ---
      if (!state.isDead && parsed.lastSavedTimestamp) {
        const now = Date.now();
        const offlineSeconds = Math.max(0, Math.floor((now - parsed.lastSavedTimestamp) / 1000));
        
        if (offlineSeconds > 30) {
          // Add elapsed time to life counter
          state.elapsedSeconds = (state.elapsedSeconds || 0) + offlineSeconds;
          const totalEffective = state.elapsedSeconds + (state.growthBonusSeconds || 0);
          state.ageDays = Math.min(7, Math.floor(totalEffective / SECONDS_PER_DAY) + 1);
          state.stage = Math.max(state.stage, calculateStageForSeconds(totalEffective));

          const offlineHours = offlineSeconds / 3600;

          // 1. Natural Health Decay: In 6 hours -> -25% HP, in 24 hours -> -100% HP
          const baselineHpLoss = (offlineHours / 24) * 100;

          // 2. Hunger decay: drops 1 heart every 2 hours
          const hungerDrop = Math.floor(offlineHours / 2);
          state.hungryHearts = Math.max(0, state.hungryHearts - hungerDrop);

          // 3. Happiness decay: drops 1 heart every 2.5 hours
          const happyDrop = Math.floor(offlineHours / 2.5);
          state.happyHearts = Math.max(0, state.happyHearts - happyDrop);

          // 4. Poop accumulation: 1 poop every 3 hours up to 4
          const poopGain = Math.floor(offlineHours / 3);
          state.poopCount = Math.min(4, state.poopCount + poopGain);

          // 5. Neglect penalties on health
          let neglectPenalty = 0;
          if (state.hungryHearts === 0) neglectPenalty += offlineHours * 1.5;
          if (state.happyHearts === 0) neglectPenalty += offlineHours * 1.0;
          if (state.poopCount >= 3) neglectPenalty += offlineHours * 1.5;
          if (state.isSick) neglectPenalty += offlineHours * 2.5;

          const totalHpLoss = Math.round(baselineHpLoss + neglectPenalty);
          const currentHp = typeof state.healthPercent === 'number' ? state.healthPercent : 100;
          const newHp = Math.max(0, currentHp - totalHpLoss);
          state.healthPercent = newHp;

          // If health reached 0 due to 24h absence or severe neglect, mark as dead
          if (newHp <= 0) {
            state.isDead = true;
            state.healthPercent = 0;
            state.stage = EvolutionStage.DEAD;
            state.deathReason = state.hungryHearts === 0 ? 'hunger' : 'quest_neglect';
            state.deathTime = now;
            state.needsAttention = false;

            // Auto record death in Graveyard
            addGraveyardRecord({
              name: state.name,
              generation: state.generation,
              stageReached: state.stage,
              stageName: STAGES_CONFIG[state.stage]?.name || 'Mascota',
              ageDays: state.ageDays,
              totalTimeAliveSeconds: state.elapsedSeconds,
              deathReason: state.deathReason,
              deathReasonText: 'Falleció por inasistencia prolongada (+24 horas sin cuidados ni calor)',
              deathDate: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              epitaph: 'Un compañero que recordaremos siempre. ¡Cuida a la próxima generación!',
              zumbaMinutesLogged: state.zumbaData?.totalMinutesEver || 0
            });
          } else {
            state.needsAttention = state.hungryHearts === 0 || state.happyHearts === 0 || state.poopCount >= 2 || newHp < 35;
          }
        }
      }

      state.lastSavedTimestamp = Date.now();
      return state;
    }
  } catch (e) {
    console.error('Failed to load tamagotchi state', e);
  }
  return INITIAL_TAMAGOTCHI_STATE;
}

export function saveState(state: TamagotchiState) {
  try {
    const stateToSave = {
      ...state,
      lastSavedTimestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(stateToSave));
  } catch (e) {
    console.error('Failed to save tamagotchi state', e);
  }
}

// Graveyard Management
export function loadGraveyard(): GraveyardRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GRAVEYARD);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load graveyard records', e);
  }
  return [];
}

export function saveGraveyard(records: GraveyardRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.GRAVEYARD, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save graveyard records', e);
  }
}

export function addGraveyardRecord(record: Omit<GraveyardRecord, 'id' | 'flowersPlaced'>): GraveyardRecord {
  const records = loadGraveyard();
  const newRecord: GraveyardRecord = {
    ...record,
    id: `grave_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    flowersPlaced: 0
  };
  records.unshift(newRecord);
  saveGraveyard(records);
  return newRecord;
}

export function placeFlowersOnGrave(graveId: string): GraveyardRecord[] {
  const records = loadGraveyard();
  const updated = records.map((r) =>
    r.id === graveId ? { ...r, flowersPlaced: r.flowersPlaced + 1 } : r
  );
  saveGraveyard(updated);
  return updated;
}

export function resetToNewEgg(customName = 'Piolín', nextGeneration = 1): TamagotchiState {
  const today = getTodayDateString();
  const newState: TamagotchiState = {
    ...INITIAL_TAMAGOTCHI_STATE,
    name: customName.trim() || `Tamatchi G${nextGeneration}`,
    generation: nextGeneration,
    stage: EvolutionStage.EGG_INCUBATING,
    birthTimestamp: Date.now(),
    healthPercent: 100,
    elapsedSeconds: 0,
    growthBonusSeconds: 0,
    ageDays: 1,
    hungryHearts: 4,
    happyHearts: 4,
    weightGrams: 5,
    poopCount: 0,
    isSick: false,
    isDead: false,
    deathReason: null,
    isSleeping: false,
    lightsOn: true,
    needsAttention: false,
    attentionReason: null,
    quests: generateDailyQuests(),
    lastQuestResetDate: today
  };
  saveState(newState);
  return newState;
}
