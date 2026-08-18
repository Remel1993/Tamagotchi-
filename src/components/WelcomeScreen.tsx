import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Flame,
  Sparkles,
  Trophy,
  Sliders,
  Play,
  RotateCcw,
  BookOpen,
  Volume2,
  VolumeX,
  Plus,
  Compass,
  Thermometer,
  ShieldCheck,
  Zap,
  ChevronRight,
  Droplets,
  Moon,
  Sun,
  Sunrise,
  Sunset
} from 'lucide-react';
import {
  TamagotchiState,
  EvolutionStage,
  DeviceTheme,
  DisplayMode,
  GraveyardRecord,
  DayNightTimeOfDay
} from '../types/tamagotchi';
import { STAGES_CONFIG, getDayNightTimeOfDay } from '../services/storage';
import { soundManager } from '../services/soundEffects';
import { EggPetRenderer } from './EggPetRenderer';

interface WelcomeScreenProps {
  state: TamagotchiState;
  graveyardRecords: GraveyardRecord[];
  theme: DeviceTheme;
  displayMode: DisplayMode;
  isZumbaMusicPlaying: boolean;
  onStartGame: () => void;
  onOpenGraveyard: () => void;
  onOpenQuests: () => void;
  onOpenNewPet: () => void;
  onOpenGuide: () => void;
  onOpenAchievements: () => void;
  onOpenOwnerHealth: () => void;
  onToggleSleep: () => void;
  onDirectZumba: () => void;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onPet: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  state,
  graveyardRecords,
  theme,
  displayMode,
  isZumbaMusicPlaying,
  onStartGame,
  onOpenGraveyard,
  onOpenQuests,
  onOpenNewPet,
  onOpenGuide,
  onOpenAchievements,
  onOpenOwnerHealth,
  onToggleSleep,
  onDirectZumba,
  onToggleTheme,
  onToggleSound,
  onPet
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<DayNightTimeOfDay>(() => getDayNightTimeOfDay());
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeOfDay(getDayNightTimeOfDay(now));
      setCurrentTimeStr(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const stageConfig = STAGES_CONFIG[state.stage] || STAGES_CONFIG[EvolutionStage.EGG_INCUBATING];
  const isEgg = state.stage < EvolutionStage.BABY_CHICK;
  const currentHealth = typeof state.healthPercent === 'number' ? state.healthPercent : 100;
  const eggTemp = (36.0 + (currentHealth / 100) * 2.2).toFixed(1);
  const completedQuests = state.quests.filter((q) => q.current >= q.target).length;
  const unlockedAchievements = state.achievements ? state.achievements.filter((a) => a.unlocked).length : 0;
  const totalAchievements = state.achievements ? state.achievements.length : 9;
  const waterGlasses = state.ownerHabits?.waterGlassesToday || 0;

  const getDayNightTheme = () => {
    switch (timeOfDay) {
      case 'dawn':
        return {
          bgGradient: 'from-amber-950/40 via-orange-950/30 to-slate-950/95',
          glow: 'shadow-[0_0_50px_rgba(245,158,11,0.25)]',
          label: 'Amanecer',
          icon: <Sunrise className="w-3.5 h-3.5 text-amber-400" />
        };
      case 'day':
        return {
          bgGradient: 'from-sky-900/30 via-blue-950/40 to-slate-950/95',
          glow: 'shadow-[0_0_50px_rgba(56,189,248,0.25)]',
          label: 'Día',
          icon: <Sun className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
        };
      case 'sunset':
        return {
          bgGradient: 'from-rose-950/40 via-purple-950/35 to-slate-950/95',
          glow: 'shadow-[0_0_50px_rgba(244,63,94,0.25)]',
          label: 'Atardecer',
          icon: <Sunset className="w-3.5 h-3.5 text-rose-400" />
        };
      case 'night':
        return {
          bgGradient: 'from-indigo-950/50 via-slate-950/80 to-slate-950/98',
          glow: 'shadow-[0_0_60px_rgba(99,102,241,0.3)]',
          label: 'Noche',
          icon: <Moon className="w-3.5 h-3.5 text-indigo-300" />
        };
    }
  };

  const dayNightInfo = getDayNightTheme();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-3 sm:p-5 overflow-x-hidden bg-slate-950 font-sans select-none">
      {/* Background Image with Ambient Glow & Blur Overlay tailored to Day/Night Cycle */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/tamagotchi_japan_bg_1787031523769.jpg"
          alt="Tamagotchi Japón Vintage 1996"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 scale-105 blur-xs transform duration-1000"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${dayNightInfo.bgGradient}`} />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/75 to-slate-950/95" />
      </div>

      {/* Top Floating Mini Header */}
      <header className="relative z-10 w-full max-w-md flex items-center justify-between pt-1 pb-2 px-1">
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60 text-xs font-mono font-bold text-slate-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
          <span>TAMAGOTCHI 1996</span>
          <span className="text-[10px] text-amber-300 font-sans">たまごっち</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Day / Night Real-time Pill */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/80 text-[11px] font-mono text-slate-200 shadow-md">
            {dayNightInfo.icon}
            <span>{currentTimeStr}</span>
            <span className="text-[9px] font-sans font-bold text-amber-400 opacity-80">{dayNightInfo.label}</span>
          </div>

          {/* Audio Quick Button */}
          <button
            onClick={() => {
              soundManager.playBeep(900, 0.02);
              onToggleSound();
            }}
            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 flex items-center justify-center cursor-pointer transition-all active:scale-90 shadow-md"
            title="Activar / Desactivar Sonido"
          >
            {isZumbaMusicPlaying ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settings Quick Button */}
          <button
            onClick={() => {
              soundManager.playSelect();
              setShowSettingsModal(true);
            }}
            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 flex items-center justify-center cursor-pointer transition-all active:scale-90 shadow-md"
            title="Ajustes y Opciones"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </header>

      {/* Main Welcome Container & Central Card */}
      <main className="relative z-10 w-full max-w-md flex flex-col items-center justify-center my-auto space-y-3.5 py-1">
        {/* Game Title with Cute Japanese Pop Styling */}
        <div className="text-center space-y-0.5">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: -15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="inline-block"
          >
            <div className="text-[11px] font-black tracking-widest text-amber-400 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              ★ EDICIÓN JAPONESA CLÁSICA ★
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-400 drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] uppercase">
              ¡BIENVENIDO A TAMA-GO!
            </h1>
          </motion.div>
          <p className="text-xs text-slate-300 font-medium">
            Simulador auténtico de mascota virtual de Japón (1996)
          </p>
        </div>

        {/* Central Real Tamagotchi Egg Device with Black & White Retro Pixel LCD Screen */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className={`relative w-64 sm:w-72 aspect-[1/1.22] rounded-[48%_48%_44%_44%/56%_56%_40%_40%] bg-gradient-to-b from-sky-400 via-cyan-400 to-teal-500 p-4 sm:p-5 shadow-[0_16px_35px_rgba(0,0,0,0.65),inset_0_4px_12px_rgba(255,255,255,0.7),inset_0_-8px_16px_rgba(0,0,0,0.35)] border-4 border-white/80 flex flex-col items-center justify-between transition-all ${dayNightInfo.glow}`}
        >
          {/* Tamagotchi Keychain Ring Hole at top */}
          <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-white/90 shadow-inner -mt-1 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
          </div>

          {/* Device Brand Label */}
          <div className="text-[9px] font-black tracking-widest text-slate-950 uppercase font-mono -mt-1 opacity-90">
            ★ TAMAGOTCHI BANDAI 1996 ★
          </div>

          {/* Central Black & White Pixel Art LCD Screen (Authentic 1996 B&W LCD) */}
          <div
            onClick={() => {
              soundManager.playSelect();
              onPet();
            }}
            title="Haz clic para acariciar y transferir calor vital"
            className="relative w-full h-36 sm:h-40 rounded-2xl bg-[#a6b68a] border-4 border-slate-900/90 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] p-2 flex flex-col items-center justify-between overflow-hidden cursor-pointer group"
          >
            {/* Retro 2-bit Scanline / Grid Matrix Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0, 0, 0, 0.4) 50%, transparent 50%), linear-gradient(90deg, rgba(0, 0, 0, 0.2) 50%, transparent 50%)',
                backgroundSize: '100% 4px, 4px 100%'
              }}
            />

            {/* LCD Top Info in Pure Black & White LCD Style */}
            <div className="w-full flex items-center justify-between text-[9px] font-mono font-bold text-slate-950 z-10">
              <span className="tracking-wider">★ {state.name.toUpperCase()} ★</span>
              <span className="bg-slate-950 text-[#a6b68a] px-1 rounded-xs">
                {state.isSleeping ? '💤 DORMIDO' : `❤️ ${currentHealth}%`}
              </span>
            </div>

            {/* Central Animated Chick / Egg in Pure B&W Pixel Style */}
            <div className="relative z-10 my-auto flex items-center justify-center scale-90 group-hover:scale-95 transition-transform">
              <EggPetRenderer
                stage={state.stage}
                mood={state.isSleeping ? 'sleeping' : state.isSick ? 'sick' : 'happy'}
                poopCount={0}
                isSick={state.isSick}
                isSleeping={state.isSleeping}
                displayMode="pixel-retro"
                eggCrackLevel={Math.min(4, Math.max(1, state.stage))}
              />
            </div>

            {/* LCD Bottom Stats */}
            <div className="w-full flex items-center justify-between text-[8px] font-mono text-slate-900 border-t border-slate-800/30 pt-0.5 z-10">
              <span>{isEgg ? `🌡️ ${eggTemp}°C` : `⚖️ ${state.weightGrams}g`}</span>
              <span className="text-[7px] text-slate-800 uppercase tracking-tighter opacity-80 group-hover:opacity-100">
                [ Tocar para mimar ]
              </span>
              <span>DÍA {state.ageDays}/7</span>
            </div>
          </div>

          {/* 3 Physical Classic Yellow Oval Buttons (A, B, C) */}
          <div className="w-full flex items-center justify-around px-2 pt-1">
            {/* Button A: Elegir / Menú */}
            <button
              onClick={() => {
                soundManager.playBeep(800, 0.03);
                onOpenQuests();
              }}
              title="Botón A: Retos y Misiones"
              className="w-9 h-7 sm:w-10 sm:h-8 rounded-[50%] bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 border-2 border-amber-600 shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.8)] active:translate-y-1 active:shadow-xs flex items-center justify-center font-black text-amber-950 text-[10px] cursor-pointer transition-transform"
            >
              A
            </button>

            {/* Button B: Aceptar / Empezar Partida */}
            <button
              onClick={() => {
                soundManager.playStartGame();
                onStartGame();
              }}
              title="Botón B: ¡Empezar a Jugar y Cuidar!"
              className="w-10 h-8 sm:w-11 sm:h-9 rounded-[50%] bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 border-2 border-amber-600 shadow-[0_5px_10px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.8)] active:translate-y-1 active:shadow-xs flex items-center justify-center font-black text-amber-950 text-xs cursor-pointer transition-transform scale-105"
            >
              B
            </button>

            {/* Button C: Cancelar / Mimar */}
            <button
              onClick={() => {
                soundManager.playPetLove();
                onPet();
              }}
              title="Botón C: Acariciar y dar cariño"
              className="w-9 h-7 sm:w-10 sm:h-8 rounded-[50%] bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 border-2 border-amber-600 shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.8)] active:translate-y-1 active:shadow-xs flex items-center justify-center font-black text-amber-950 text-[10px] cursor-pointer transition-transform"
            >
              C
            </button>
          </div>
        </motion.div>

        {/* Pet Name & Status Bar */}
        <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-3 shadow-xl text-center space-y-1">
          <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
            TU MASCOTA ACTUAL
          </div>
          <div className="text-base sm:text-lg font-black text-white tracking-wide uppercase flex items-center justify-center gap-2">
            <span>🐣</span>
            <span>{state.name || 'TAMAGOTCHI'}</span>
            <span className="text-[10px] font-mono bg-amber-400/25 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
              G{state.generation}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 flex-wrap">
            <span className="font-mono text-amber-300 font-bold">Día {state.ageDays}/7</span>
            <span>•</span>
            <span className="text-slate-200">{stageConfig.name}</span>
            <span>•</span>
            <span className="font-mono text-emerald-400 font-bold">
              {isEgg ? `🌡️ ${eggTemp}°C` : `❤️ ${currentHealth}%`}
            </span>
          </div>
        </div>

        {/* Main Action Buttons Grid */}
        <div className="w-full space-y-2">
          {/* PRIMARY BIG ACTION BUTTON: EMPEZAR PARTIDA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundManager.playStartGame();
              onStartGame();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base tracking-wide uppercase shadow-[0_6px_20px_rgba(245,158,11,0.4)] border-2 border-yellow-200 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-rose-600 text-rose-600 animate-pulse" />
            <span>¡EMPEZAR PARTIDA! (CUIDAR)</span>
            <ChevronRight className="w-5 h-5 ml-auto" />
          </motion.button>

          {/* SECONDARY ACTION BUTTONS (2 Columns) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Logros (Achievements) */}
            <button
              onClick={() => {
                soundManager.playSelect();
                onOpenAchievements();
              }}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-950/80 to-slate-900 hover:from-amber-900/90 border-2 border-amber-400/60 text-amber-300 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <span>🏆</span>
              <span>LOGROS ({unlockedAchievements}/{totalAchievements})</span>
            </button>

            {/* Salud del Dueño (Owner Health Synergy) */}
            <button
              onClick={() => {
                soundManager.playSelect();
                onOpenOwnerHealth();
              }}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-950/80 to-slate-900 hover:from-cyan-900/90 border-2 border-cyan-400/60 text-cyan-300 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <span>💧</span>
              <span>SALUD DUEÑO ({waterGlasses}/8)</span>
            </button>

            {/* Dormir / Despertar Libremente */}
            <button
              onClick={() => {
                soundManager.playSelect();
                onToggleSleep();
              }}
              className={`py-2.5 px-3 rounded-xl border-2 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 ${
                state.isSleeping
                  ? 'bg-indigo-900/90 hover:bg-indigo-800 border-indigo-400 text-indigo-200'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <span>{state.isSleeping ? '☀️' : '💤'}</span>
              <span>{state.isSleeping ? 'DESPERTAR' : 'DORMIR'}</span>
            </button>

            {/* Mis Mascotas & Cementerio */}
            <button
              onClick={() => {
                soundManager.playSelect();
                onOpenGraveyard();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-2 border-indigo-500/40 text-indigo-200 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <span>🪦</span>
              <span>CEMENTERIO ({graveyardRecords.length})</span>
            </button>

            {/* Retos Diarios */}
            <button
              onClick={() => {
                soundManager.playSelect();
                onOpenQuests();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-2 border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <span>🎯</span>
              <span>RETOS ({completedQuests}/5)</span>
            </button>

            {/* Sesión Zumba 20m */}
            <button
              onClick={() => {
                soundManager.playSelect();
                onDirectZumba();
              }}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-950/70 to-amber-950/70 hover:from-rose-900/80 hover:to-amber-900/80 border-2 border-rose-500/50 text-rose-300 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>ZUMBA (20 min)</span>
            </button>

            {/* Nueva Mascota */}
            <button
              onClick={() => {
                soundManager.playSelect();
                onOpenNewPet();
              }}
              className="col-span-2 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-2 border-amber-500/40 text-amber-300 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>CREAR NUEVA MASCOTA</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Footer App Navigation Bar */}
      <footer className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-2 shadow-2xl flex items-center justify-around text-slate-400 mt-2">
        <button
          onClick={() => soundManager.playBeep(900, 0.02)}
          className="flex flex-col items-center text-amber-400 font-bold text-[10px] cursor-pointer"
        >
          <span className="text-base">🏠</span>
          <span>Inicio</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenAchievements();
          }}
          className="flex flex-col items-center hover:text-amber-300 text-[10px] font-bold cursor-pointer"
        >
          <span className="text-base">🏆</span>
          <span>Logros</span>
        </button>

        <button
          onClick={() => {
            soundManager.playStartGame();
            onStartGame();
          }}
          className="flex flex-col items-center bg-amber-400 text-slate-950 p-2 -mt-4 rounded-full border-2 border-white shadow-lg font-black text-[9px] cursor-pointer active:scale-90"
        >
          <span className="text-lg">🎮</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenOwnerHealth();
          }}
          className="flex flex-col items-center hover:text-cyan-300 text-[10px] font-bold cursor-pointer"
        >
          <span className="text-base">💧</span>
          <span>Salud</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenGuide();
          }}
          className="flex flex-col items-center hover:text-slate-200 text-[10px] font-bold cursor-pointer"
        >
          <span className="text-base">📖</span>
          <span>Guía</span>
        </button>
      </footer>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-black text-sm text-amber-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" /> AJUSTES & OPCIONES
                </span>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-slate-400 hover:text-white font-black text-sm cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {/* Audio Controls */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-200">Efectos & Música:</span>
                  <button
                    onClick={onToggleSound}
                    className={`px-3 py-1 rounded-lg font-black ${
                      isZumbaMusicPlaying
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isZumbaMusicPlaying ? 'Activado' : 'Silencio'}
                  </button>
                </div>

                {/* Theme Switcher */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-200">Color de Carcasa:</span>
                  <button
                    onClick={onToggleTheme}
                    className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black"
                  >
                    Cambiar Color
                  </button>
                </div>

                {/* Achievements Link */}
                <button
                  onClick={() => {
                    setShowSettingsModal(false);
                    onOpenAchievements();
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Ver Todos los Logros</span>
                </button>

                {/* Owner Health Link */}
                <button
                  onClick={() => {
                    setShowSettingsModal(false);
                    onOpenOwnerHealth();
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold flex items-center justify-center gap-2"
                >
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Salud & Hábitos del Dueño</span>
                </button>

                {/* Guide Link */}
                <button
                  onClick={() => {
                    setShowSettingsModal(false);
                    onOpenGuide();
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Ver Guía de Cuidados Completa</span>
                </button>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase cursor-pointer"
              >
                Cerrar Ajustes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
