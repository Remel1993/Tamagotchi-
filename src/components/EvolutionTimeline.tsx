import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { EvolutionStage, TamagotchiState } from '../types/tamagotchi';
import { STAGES_CONFIG, getTimeUntilNextStage } from '../services/storage';

interface EvolutionTimelineProps {
  state: TamagotchiState;
  onOpenZumba: () => void;
}

const TIMELINE_DAYS = [
  {
    day: 1,
    title: 'Día 1: Incubación',
    icon: '🥚',
    stage: EvolutionStage.EGG_INCUBATING,
    desc: 'Huevo respirando y absorbiendo calor'
  },
  {
    day: 2,
    title: 'Día 2: Moviéndose',
    icon: '🐣',
    stage: EvolutionStage.EGG_WIGGLING,
    desc: 'El huevo se sacude con emoción'
  },
  {
    day: 3,
    title: 'Día 3: Grietas',
    icon: '⚡',
    stage: EvolutionStage.EGG_CRACKING,
    desc: 'Aparecen profundas fisuras'
  },
  {
    day: 4,
    title: 'Día 4: Descascarado',
    icon: '✨',
    stage: EvolutionStage.EGG_HATCHING,
    desc: 'Trozos caen y asoma el pollito'
  },
  {
    day: 5,
    title: 'Día 5: Pollito Bebé',
    icon: '🐥',
    stage: EvolutionStage.BABY_CHICK,
    desc: 'Pollito sentado en su cascarón'
  },
  {
    day: 6,
    title: 'Día 6: Creciendo',
    icon: '💛',
    stage: EvolutionStage.BABY_CHICK,
    desc: 'Fortalecimiento con Zumba'
  },
  {
    day: 7,
    title: 'Día 7+: Pollo Adulto',
    icon: '👑',
    stage: EvolutionStage.ADULT_CHICK,
    desc: 'Mascota adulta desarrollada'
  }
];

export const EvolutionTimeline: React.FC<EvolutionTimelineProps> = ({
  state,
  onOpenZumba
}) => {
  const totalEffectiveSeconds = state.elapsedSeconds + state.growthBonusSeconds;
  const timingInfo = getTimeUntilNextStage(totalEffectiveSeconds);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl text-slate-100 space-y-4">
      {/* Header with 7-Day Title & Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-base">
            ⏳
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-300 font-mono flex items-center gap-2">
              CICLO EVOLUTIVO DE 7 DÍAS (HUEVO A POLLO)
            </h3>
            <p className="text-[11px] text-slate-400">
              Día actual: <strong className="text-slate-200">Día {timingInfo.currentDay} de 7</strong>
            </p>
          </div>
        </div>

        {/* Countdown Pill */}
        {state.stage !== EvolutionStage.ADULT_CHICK && state.stage !== EvolutionStage.DEAD && (
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">
              Próxima evolución en:{' '}
              <strong className="text-cyan-300">
                {timingInfo.hoursRemaining}h {timingInfo.minutesRemaining}m
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* 7-Days Horizontal Roadmap / Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {TIMELINE_DAYS.map((item) => {
          const isPast = timingInfo.currentDay > item.day;
          const isCurrent = timingInfo.currentDay === item.day;
          const isFuture = timingInfo.currentDay < item.day;

          return (
            <div
              key={item.day}
              className={`p-2.5 rounded-2xl border flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-amber-500/15 border-amber-400/80 shadow-lg shadow-amber-500/10 scale-102'
                  : isPast
                  ? 'bg-slate-950/60 border-emerald-500/40'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">{item.icon}</span>
                {isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="text-[9px] font-black uppercase bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-md">
                    HOY
                  </span>
                ) : (
                  <Lock className="w-3 h-3 text-slate-600" />
                )}
              </div>

              <div>
                <span className="text-[11px] font-bold block text-slate-200">
                  Día {item.day}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight block">
                  {item.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zumba Fitness Growth Booster Callout */}
      <div className="bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-950 border border-amber-500/30 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-lg shrink-0">
            🔥
          </div>
          <div className="text-xs">
            <span className="font-bold text-amber-300 block">
              ¡Acelera el desarrollo del huevo bailando Zumba!
            </span>
            <span className="text-slate-400">
              Cada sesión de 15 minutos de Zumba otorga{' '}
              <strong className="text-slate-200">+2 horas de calor biológico</strong> para que tu pollito nazca más rápido y sano.
            </span>
          </div>
        </div>

        <button
          onClick={onOpenZumba}
          className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <Flame className="w-3.5 h-3.5" />
          Bailar Zumba (+2h Impulso)
        </button>
      </div>
    </div>
  );
};
