export enum EvolutionStage {
  EGG_INCUBATING = 1,  // Día 1: Huevo respirando y absorbiendo calor
  EGG_WIGGLING = 2,    // Día 2: Huevo tambaleándose con fuerza a los lados
  EGG_CRACKING = 3,    // Día 3: Fisuras y grietas profundas en el cascarón
  EGG_HATCHING = 4,    // Día 4: Descascarándose, trozos cayendo y pollito asomando
  BABY_CHICK = 5,      // Día 5-6: Pollito bebé tierno sentado dentro de su cascarón
  ADULT_CHICK = 6,     // Día 7+: Pollo adulto completo y desarrollado
  DEAD = 7             // Fallecido (Fantasma y memorial)
}

export type PetMood = 'happy' | 'excited' | 'eating' | 'playing' | 'sick' | 'sleeping' | 'scolded' | 'praising' | 'dead';

export type ChickEmotion =
  | 'happy'       // 🌟 Alegre / Radiante
  | 'excited'     // ⚡ Emocionado / Eclosionando
  | 'loving'      // 💖 Mimado / Acariciado
  | 'sleepy'      // 💤 Somnoliento
  | 'hungry'      // 🍙 Hambriento
  | 'dancing'     // 💃 Modo Zumba / Bailarín
  | 'playful'     // 😜 Juguetón / Travieso
  | 'proud'       // 👑 Campeón / Orgulloso
  | 'sick'        // 🤒 Enfermito / Resfriado
  | 'sad';        // 😢 Triste / Falta de cariño

export type PetSpecies = 'chick' | 'dog';

export interface GraveyardRecord {
  id: string;
  name: string;
  species?: PetSpecies;
  generation: number;
  stageReached: EvolutionStage;
  stageName: string;
  ageDays: number;
  totalTimeAliveSeconds: number;
  deathReason: 'hunger' | 'sickness' | 'depression' | 'poop_neglect' | 'old_age' | 'quest_neglect';
  deathReasonText: string;
  deathDate: string;
  flowersPlaced: number;
  epitaph: string;
  zumbaMinutesLogged: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'zumba' | 'care' | 'game' | 'hygiene';
  target: number;
  current: number;
  unit: string;
  rewardText: string;
  completed: boolean;
  claimed: boolean;
}

export interface ZumbaSessionState {
  dailyTargetMinutes: number;
  todayMinutesCompleted: number;
  currentStreakDays: number;
  lastZumbaDate: string; // YYYY-MM-DD
  totalMinutesEver: number;
  totalCaloriesBurned: number;
}

export type DayNightTimeOfDay = 'dawn' | 'day' | 'sunset' | 'night';

export interface OwnerHabitsState {
  waterGlassesToday: number; // 0 to 8 glasses (250ml each = 2L target)
  lastWaterDate: string; // YYYY-MM-DD
  totalWaterLogged: number;
  
  pillsTakenToday: boolean;
  lastPillDate: string; // YYYY-MM-DD
  totalPillDays: number;
  
  sleepRoutineDoneToday: boolean;
  lastSleepRoutineDate: string; // YYYY-MM-DD
  totalSleepRoutines: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'health' | 'survival' | 'zumba' | 'care';
  target: number;
  current: number;
  unlocked: boolean;
  unlockedDate?: string;
  rewardDescription: string;
}

export interface TamagotchiState {
  id?: string;
  stage: EvolutionStage;
  name: string;
  species?: PetSpecies;
  ageDays: number;
  weightGrams: number;
  birthTimestamp: number; // Unix timestamp of creation
  
  // 4-Heart meters (Classic Tamagotchi standard: 0 to 4 hearts)
  hungryHearts: number;    // 0 to 4
  happyHearts: number;     // 0 to 4
  
  // Training / Discipline (0 to 100%)
  discipline: number;      // 0 to 100
  
  // Poop & Sickness
  poopCount: number;       // 0 to 4 piles of poop on screen
  isSick: boolean;
  sickDosesNeeded: number; // 1 or 2
  
  // Sleep & Lights (Can sleep and wake up anytime user desires)
  isSleeping: boolean;
  lightsOn: boolean;
  sleepStartSeconds?: number;
  
  // Attention Call (Bottom-right alert icon)
  needsAttention: boolean;
  attentionReason: 'hungry' | 'sad' | 'poop' | 'sick' | 'discipline' | null;
  
  // Vital Health Bar (0 to 100%)
  healthPercent: number;   // 0 to 100% (If it drops to 0, egg or chick dies)

  // Death System
  isDead: boolean;
  deathReason: 'hunger' | 'sickness' | 'depression' | 'poop_neglect' | 'old_age' | 'quest_neglect' | null;
  deathTime?: number;
  
  // Progression & Stats (7 Days Cycle)
  generation: number;
  elapsedSeconds: number; // Total seconds since creation (7 days = 604,800 seconds)
  growthBonusSeconds: number; // Bonus progression seconds earned through Zumba
  simulationSpeedMultiplier: number; // 1 = Real 7-day time, 60 = 1 min = 1 hour (Fast mode)
  snacksEaten: number;
  
  // Fitness / Zumba Link
  zumbaData: ZumbaSessionState;
  zumbaTimerRemainingSeconds?: number; // 20-min countdown timer (1200 seconds max)
  zumbaCompletedDate?: string; // YYYY-MM-DD date string when 20-min Zumba reward was earned for the day
  
  // Daily Quests
  quests: DailyQuest[];
  lastQuestResetDate: string; // YYYY-MM-DD
  lastSavedTimestamp?: number; // Timestamp of last save for offline health decay calculation
  
  // Owner Wellness Habits (Health synergy)
  ownerHabits: OwnerHabitsState;
  
  // Achievements System
  achievements: Achievement[];
  
  // Stats Counters for Achievements
  minigamesWonCount?: number;
  poopCleanedCount?: number;
  petsGivenCount?: number;
  lowestHealthRecorded?: number;
  
  // Emotions & Interactive Speech Bubbles
  currentEmotion?: ChickEmotion;
  activeSpeechBubble?: { text: string; emoji: string } | null;
}

export type MiniGameType = 'sparks_catcher' | 'left_right' | 'rhythm_dance';

export type DeviceTheme = 'neon-yellow' | 'cyber-purple' | 'retro-teal' | 'coral-pink' | 'midnight-black' | 'vintage-white';
export type DisplayMode = 'lcd-green' | 'pixel-retro' | 'hd';

export type ActiveScreen = 
  | 'main'
  | 'food_select'
  | 'status_page'
  | 'game_select'
  | 'game'
  | 'death'
  | 'animating_eating'
  | 'animating_bath'
  | 'animating_medicine'
  | 'animating_discipline'
  | 'animating_praise';

export interface StageConfig {
  stage: EvolutionStage;
  dayNumber: number; // Day 1 to 7
  dayRangeLabel: string;
  name: string;
  subtitle: string;
  description: string;
  startSecond: number;
  endSecond: number;
}

export interface ThemeStyleConfig {
  id: DeviceTheme;
  name: string;
  body: string;
  border: string;
  shadow: string;
  ring: string;
  dotColor: string;
}

export const THEME_CONFIGS: Record<DeviceTheme, ThemeStyleConfig> = {
  'neon-yellow': {
    id: 'neon-yellow',
    name: 'Amarillo Neón',
    body: 'from-amber-400 via-yellow-400 to-amber-500',
    border: 'border-yellow-600',
    shadow: 'shadow-amber-500/30',
    ring: 'bg-yellow-400',
    dotColor: '#eab308'
  },
  'cyber-purple': {
    id: 'cyber-purple',
    name: 'Púrpura Cyber',
    body: 'from-purple-500 via-fuchsia-500 to-indigo-600',
    border: 'border-purple-700',
    shadow: 'shadow-purple-500/30',
    ring: 'bg-purple-500',
    dotColor: '#a855f7'
  },
  'retro-teal': {
    id: 'retro-teal',
    name: 'Teal Retro',
    body: 'from-teal-400 via-cyan-400 to-emerald-500',
    border: 'border-teal-600',
    shadow: 'shadow-teal-500/30',
    ring: 'bg-teal-400',
    dotColor: '#2dd4bf'
  },
  'coral-pink': {
    id: 'coral-pink',
    name: 'Rosa Coral',
    body: 'from-rose-400 via-pink-400 to-rose-500',
    border: 'border-pink-600',
    shadow: 'shadow-pink-500/30',
    ring: 'bg-rose-400',
    dotColor: '#fb7185'
  },
  'midnight-black': {
    id: 'midnight-black',
    name: 'Negro Medianoche',
    body: 'from-slate-800 via-zinc-900 to-slate-950',
    border: 'border-slate-700',
    shadow: 'shadow-slate-900/50',
    ring: 'bg-slate-800',
    dotColor: '#334155'
  },
  'vintage-white': {
    id: 'vintage-white',
    name: 'Blanco Vintage',
    body: 'from-slate-100 via-stone-200 to-slate-300',
    border: 'border-slate-400',
    shadow: 'shadow-slate-300/30',
    ring: 'bg-slate-200',
    dotColor: '#cbd5e1'
  }
};

