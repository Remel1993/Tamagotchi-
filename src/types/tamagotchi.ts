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
  | 'loving'      // 💖 Mimado / Acariciado
  | 'sleepy'      // 💤 Somnoliento
  | 'hungry'      // 🍙 Hambriento
  | 'dancing'     // 💃 Modo Zumba / Bailarín
  | 'playful'     // 😜 Juguetón / Travieso
  | 'proud'       // 👑 Campeón / Orgulloso
  | 'sick'        // 🤒 Enfermito / Resfriado
  | 'sad';        // 😢 Triste / Falta de cariño

export interface GraveyardRecord {
  id: string;
  name: string;
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

export interface TamagotchiState {
  stage: EvolutionStage;
  name: string;
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
  
  // Sleep & Lights
  isSleeping: boolean;
  lightsOn: boolean;
  
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
  
  // Daily Quests
  quests: DailyQuest[];
  lastQuestResetDate: string; // YYYY-MM-DD
  lastSavedTimestamp?: number; // Timestamp of last save for offline health decay calculation
  
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
