import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Heart,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { ZumbaSessionState } from '../types/tamagotchi';
import { zumbaAudio } from '../services/zumbaAudio';
import { soundManager } from '../services/soundEffects';

interface ZumbaWorkoutModalProps {
  zumbaData: ZumbaSessionState;
  onClose: () => void;
  onWorkoutComplete: (minutes: number, calories: number) => void;
}

const DANCE_MOVES = [
  { name: 'Paso Salsa Lateral', icon: '💃', bpmText: '1-2-3, 5-6-7' },
  { name: 'Merengue Marcha Rápida', icon: '🔥', bpmText: '¡Rodillas arriba!' },
  { name: 'Reggaeton Dembow Bounce', icon: '⚡', bpmText: '¡Cadera y rebote!' },
  { name: 'Cumbia Mambo Cruzado', icon: '🎶', bpmText: '¡Paso adelante y atrás!' },
  { name: 'Samba Ritmo Festivo', icon: '✨', bpmText: '¡Brazos al aire!' }
];

export const ZumbaWorkoutModal: React.FC<ZumbaWorkoutModalProps> = ({
  zumbaData,
  onClose,
  onWorkoutComplete
}) => {
  const [selectedGoal, setSelectedGoal] = useState<number>(zumbaData.dailyTargetMinutes || 15);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);
  const [currentMoveIdx, setCurrentMoveIdx] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const caloriesPerMinute = 8.5;
  const minutesDone = Math.floor(secondsElapsed / 60);
  const currentSeconds = secondsElapsed % 60;
  const caloriesBurned = Math.round((secondsElapsed / 60) * caloriesPerMinute);
  const targetSeconds = selectedGoal * 60;
  const progressPercent = Math.min(100, Math.round((secondsElapsed / targetSeconds) * 100));

  // Workout Timer Interval
  useEffect(() => {
    let interval: number | null = null;
    if (isActive) {
      interval = window.setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Rotate dance moves every 12 seconds while active
  useEffect(() => {
    let moveInterval: number | null = null;
    if (isActive) {
      moveInterval = window.setInterval(() => {
        setCurrentMoveIdx((prev) => (prev + 1) % DANCE_MOVES.length);
      }, 12000);
    }
    return () => {
      if (moveInterval) clearInterval(moveInterval);
    };
  }, [isActive]);

  const handleToggleActive = () => {
    soundManager.playSelect();
    setIsActive(!isActive);
  };

  const handleReset = () => {
    soundManager.playRefuse();
    setIsActive(false);
    setSecondsElapsed(0);
  };

  const handleFinishWorkout = () => {
    setIsActive(false);
    soundManager.playZumbaFinishBeep();
    setShowCelebration(true);
  };

  const handleSaveAndClose = () => {
    const minToLog = Math.max(1, Math.ceil(secondsElapsed / 60));
    onWorkoutComplete(minToLog, caloriesBurned);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
              💃
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-300 font-mono tracking-wide flex items-center gap-2">
                SESIÓN DE ZUMBA FITNESS
              </h2>
              <p className="text-xs text-slate-400">
                ¡Baila para recargar de energía vital a tu Tamagotchi y acelerar su crecimiento!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              zumbaAudio.stopWorkoutMusic();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Celebration Screen when workout completed */}
        {showCelebration ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30"
            >
              🏆
            </motion.div>

            <div>
              <h3 className="text-xl font-black text-amber-300">
                ¡SESIÓN DE ZUMBA COMPLETADA!
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Has quemado <strong className="text-amber-400">{caloriesBurned} calorías</strong> en{' '}
                <strong className="text-emerald-400">{Math.ceil(secondsElapsed / 60)} minutos</strong> de baile rítmico.
              </p>
            </div>

            {/* Rewards Card */}
            <div className="w-full bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 space-y-2 text-left text-xs">
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                Recompensas para tu Mascota:
              </span>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="text-base">⚡</span>
                <span>
                  <strong>+1 Día Entero de Recompensa (+24 Horas)</strong> de aceleración de crecimiento e incubación
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="text-base">💖</span>
                <span>
                  <strong>+35% Salud Vital ❤️ y Felicidad al Máximo (4/4)</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="text-base">🎯</span>
                <span>
                  <strong>Reto Diario de Zumba Completado</strong> (+Puntos para tu récord diario)
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveAndClose}
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black py-3 rounded-xl text-sm shadow-xl shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
            >
              Guardar Recompensas y Volver a la Mascota
            </button>
          </div>
        ) : (
          /* Live Workout Player */
          <div className="space-y-4">
            {/* Goal Selector (Only editable when not active) */}
            {!isActive && secondsElapsed === 0 && (
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  Selecciona tu meta de Zumba para hoy:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 15, 30].map((min) => (
                    <button
                      key={min}
                      onClick={() => setSelectedGoal(min)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedGoal === min
                          ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-102'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {min} Minutos {min === 15 ? '🔥 Recomendado' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Central Animated Workout Stage */}
            <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 rounded-3xl p-5 flex flex-col items-center justify-center overflow-hidden">
              {/* Dancing Chick Silhouette */}
              <motion.div
                animate={
                  isActive
                    ? {
                        y: [-6, 6, -6],
                        rotate: [-6, 6, -6],
                        scale: [1, 1.05, 1]
                      }
                    : { y: 0 }
                }
                transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl sm:text-7xl my-2 select-none"
              >
                🐣
              </motion.div>

              {/* Current Dance Move Cue */}
              <div className="text-center my-1 z-10">
                <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold mb-1 shadow-inner">
                  <span>{DANCE_MOVES[currentMoveIdx].icon}</span>
                  <span>{DANCE_MOVES[currentMoveIdx].name}</span>
                </div>
                <div className="text-xs text-slate-400 font-mono italic">
                  {DANCE_MOVES[currentMoveIdx].bpmText}
                </div>
              </div>

              {/* Big Digital Timer Display */}
              <div className="font-mono text-4xl sm:text-5xl font-black text-amber-400 my-2 tracking-wider drop-shadow-md">
                {String(minutesDone).padStart(2, '0')}:{String(currentSeconds).padStart(2, '0')}
              </div>

              {/* Progress Bar towards Target */}
              <div className="w-full max-w-xs space-y-1 mt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Meta: {selectedGoal} min</span>
                  <span className="text-amber-300 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Real-time stats pills */}
              <div className="flex items-center gap-4 mt-4 text-xs font-mono">
                <div className="flex items-center gap-1 text-rose-400 bg-rose-950/40 border border-rose-800/40 px-3 py-1 rounded-xl">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{caloriesBurned} kcal</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-xl">
                  <Activity className="w-3.5 h-3.5" />
                  <span>128 BPM Salsa</span>
                </div>
              </div>
            </div>

            {/* Workout Controls */}
            <div className="flex items-center gap-3">
              {/* Play / Pause Main Button */}
              <button
                onClick={handleToggleActive}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pausar Baile
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {secondsElapsed > 0 ? 'Continuar Baile' : '¡Comenzar a Bailar Zumba!'}
                  </>
                )}
              </button>

              {/* Reset or Finish Button */}
              {secondsElapsed > 0 && (
                <button
                  onClick={handleFinishWorkout}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 px-4 py-3.5 rounded-2xl font-black text-xs shadow-lg cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Finalizar
                </button>
              )}

              {secondsElapsed > 0 && !isActive && (
                <button
                  onClick={handleReset}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar contador"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Daily Streak Info Footer */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Minutos acumulados de por vida:{' '}
                <strong className="text-amber-300 font-mono">
                  {zumbaData.totalMinutesEver + Math.floor(secondsElapsed / 60)} min
                </strong>
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                🔥 Racha de {zumbaData.currentStreakDays} días
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
