import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Droplets,
  Pill,
  Moon,
  Sparkles,
  Heart,
  ShieldCheck,
  Check,
  Sun,
  Flame,
  Plus
} from 'lucide-react';
import { OwnerHabitsState, TamagotchiState } from '../types/tamagotchi';
import { soundManager } from '../services/soundEffects';

interface OwnerHealthModalProps {
  habits: OwnerHabitsState;
  petState: TamagotchiState;
  isOpen: boolean;
  onClose: () => void;
  onDrinkWater: () => void;
  onTakePills: () => void;
  onCompleteSleepRoutine: () => void;
}

export const OwnerHealthModal: React.FC<OwnerHealthModalProps> = ({
  habits,
  petState,
  isOpen,
  onClose,
  onDrinkWater,
  onTakePills,
  onCompleteSleepRoutine
}) => {
  if (!isOpen) return null;

  const waterGlasses = habits.waterGlassesToday || 0;
  const isPillsTaken = habits.pillsTakenToday || false;
  const isSleepDone = habits.sleepRoutineDoneToday || false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30 text-slate-950 font-black">
              💧
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-cyan-300 tracking-tight flex items-center gap-2">
                SALUD & AUTOCUIDADO DEL DUEÑO
              </h2>
              <p className="text-[11px] text-slate-400">
                Tus hábitos reales protegen directamente a {petState.name} del frío y enfermedades
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playCancel();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Synergy Explanation Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-950 to-emerald-950/60 border border-cyan-500/30 mb-3 shrink-0 flex items-center gap-3">
          <span className="text-2xl animate-pulse">🐣❤️</span>
          <p className="text-xs text-slate-200 leading-snug">
            <strong>Sinergia Vital:</strong> Cada hábito saludable que registres para ti (tomar agua, tus pastillas o preparar tu descanso) genera <strong>calor vital, salud ❤️ y purificación</strong> para tu Tamagotchi.
          </p>
        </div>

        {/* Habits Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
          {/* 1. HIDRATACIÓN */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💧</span>
                <div>
                  <h3 className="font-black text-sm text-cyan-300 flex items-center gap-2">
                    1. Hidratación Diaria (8 Vasos / 2 Litros)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Bebe un vaso de agua y regístralo. Otorga +3% de Salud al huevo y previene toxinas.
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-black px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {waterGlasses} / 8 Vasos ({waterGlasses * 250} ml)
              </span>
            </div>

            {/* 8 Interactive Glasses */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
              {Array.from({ length: 8 }).map((_, index) => {
                const isFilled = index < waterGlasses;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isFilled) {
                        onDrinkWater();
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                      isFilled
                        ? 'bg-gradient-to-b from-cyan-600 to-blue-700 border-cyan-300 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900/90 border-slate-700/80 text-slate-500 hover:border-cyan-400 hover:text-cyan-300'
                    }`}
                  >
                    <span className="text-lg">{isFilled ? '🥛' : '🫙'}</span>
                    <span className="text-[10px] font-mono font-bold mt-1">
                      #{index + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Recompensa: +3% Salud Vital por vaso
              </span>
              <button
                onClick={onDrinkWater}
                disabled={waterGlasses >= 8}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  waterGlasses >= 8
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer shadow-cyan-500/25'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+1 Vaso de Agua</span>
              </button>
            </div>
          </div>

          {/* 2. TOMAR PASTILLAS / MEDICACIÓN */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/40 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💊</span>
                <div>
                  <h3 className="font-black text-sm text-purple-300 flex items-center gap-2">
                    2. Medicación & Vitaminas del Día
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Registra si tomaste tus medicamentos, vitaminas o suplementos médicos de hoy.
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isPillsTaken
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950 text-amber-300 border-amber-500/40'
              }`}>
                {isPillsTaken ? '✅ Tomadas Hoy' : '⏳ Pendiente'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">
                  {isPillsTaken ? '¡Salud cumplida hoy!' : '¿Tomaste tu medicación / vitaminas?'}
                </span>
                <span className="text-[11px] text-purple-300">
                  {isPillsTaken ? 'Días totales acumulados: ' + habits.totalPillDays : 'Otorga +15% Salud al pollito y escudo preventivo'}
                </span>
              </div>

              <button
                onClick={onTakePills}
                disabled={isPillsTaken}
                className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  isPillsTaken
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-purple-500 hover:bg-purple-400 text-slate-950 cursor-pointer shadow-purple-500/25'
                }`}
              >
                {isPillsTaken ? <Check className="w-4 h-4 stroke-[3]" /> : <Pill className="w-4 h-4" />}
                <span>{isPillsTaken ? 'Tomadas' : 'Marcar como Tomadas'}</span>
              </button>
            </div>
          </div>

          {/* 3. HIGIENE DEL SUEÑO */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/40 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌙</span>
                <div>
                  <h3 className="font-black text-sm text-indigo-300 flex items-center gap-2">
                    3. Higiene de Sueño & Descanso Nocturno
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Prepara un descanso consciente. Apaga las luces y dale a tu mascota un sueño reparador con manta térmica.
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isSleepDone
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-indigo-950 text-indigo-300 border-indigo-500/40'
              }`}>
                {isSleepDone ? '🌙 Rutina de Sueño Activa' : '💤 Listo para dormir'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">
                  {petState.isSleeping ? '😴 Tu mascota está durmiendo plácidamente' : 'Preparar hora de dormir del dueño & mascota'}
                </span>
                <span className="text-[11px] text-indigo-300">
                  {petState.isSleeping ? 'Apagó las luces y activó la manta térmica' : 'Otorga +20% de Salud Vital y escudo contra el frío'}
                </span>
              </div>

              <button
                onClick={onCompleteSleepRoutine}
                className="px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 bg-indigo-500 hover:bg-indigo-400 text-slate-950 cursor-pointer shadow-indigo-500/25"
              >
                <Moon className="w-4 h-4" />
                <span>{petState.isSleeping ? '☀️ Despertar ahora' : '💤 Iniciar Rutina de Sueño'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            {waterGlasses}/8 Vasos • {isPillsTaken ? '💊 Medicación lista' : '💊 Medicación pendiente'}
          </span>
          <button
            onClick={() => {
              soundManager.playCancel();
              onClose();
            }}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-md active:scale-95"
          >
            Guardar & Volver
          </button>
        </div>
      </motion.div>
    </div>
  );
};
