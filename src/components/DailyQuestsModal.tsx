import React from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle, Sparkles, Gift, Flame, Trophy } from 'lucide-react';
import { DailyQuest } from '../types/tamagotchi';
import { soundManager } from '../services/soundEffects';

interface DailyQuestsModalProps {
  quests: DailyQuest[];
  onClose: () => void;
  onClaimQuest: (questId: string) => void;
  onOpenZumba: () => void;
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  quests,
  onClose,
  onClaimQuest,
  onOpenZumba
}) => {
  const completedCount = quests.filter((q) => q.current >= q.target).length;
  const allCompleted = completedCount === quests.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
              🎯
            </div>
            <div>
              <h2 className="text-lg font-black text-emerald-300 font-mono tracking-wide flex items-center gap-2">
                RETOS DIARIOS DEL CUIDADOR
              </h2>
              <p className="text-xs text-slate-400">
                Cumple estos retos diarios para que tu Tamagotchi crezca sano y fuerte
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 mb-4 flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">
                Progreso de Retos de Hoy ({completedCount}/{quests.length})
              </span>
              <span className="font-mono text-emerald-400 font-black">
                {Math.round((completedCount / quests.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                style={{ width: `${(completedCount / quests.length) * 100}%` }}
              />
            </div>
          </div>

          {allCompleted && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black px-3 py-1.5 rounded-xl shadow-inner animate-pulse">
              <Trophy className="w-4 h-4" />
              ¡Maestro del Día!
            </div>
          )}
        </div>

        {/* Quest List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {quests.map((q) => {
            const isCompleted = q.current >= q.target;
            const progress = Math.min(100, Math.round((q.current / q.target) * 100));

            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  q.claimed
                    ? 'bg-slate-950/50 border-slate-800 opacity-60'
                    : isCompleted
                    ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-800/40 border-slate-700/60'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                    {q.icon}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100">{q.title}</h4>
                      {isCompleted && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                          ✓ Cumplido
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{q.description}</p>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono">
                      <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-emerald-400 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-slate-300 font-bold">
                        {q.current}/{q.target} {q.unit}
                      </span>
                    </div>

                    <div className="text-[10px] text-amber-300/90 font-medium">
                      🎁 Recompensa: {q.rewardText}
                    </div>
                  </div>
                </div>

                {/* Quest CTA / Claim Button */}
                <div className="flex items-center justify-end sm:justify-center">
                  {q.claimed ? (
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Reclamado
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        soundManager.playHappy();
                        onClaimQuest(q.id);
                      }}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 transition-all"
                    >
                      <Gift className="w-4 h-4" />
                      Reclamar Recompensa
                    </button>
                  ) : q.category === 'zumba' ? (
                    <button
                      onClick={() => {
                        soundManager.playSelect();
                        onClose();
                        onOpenZumba();
                      }}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs shadow-md cursor-pointer active:scale-95"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      Bailar Zumba Ahora
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-slate-400">
                      En progreso ({progress}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Los retos se reinician automáticamente cada 24 horas a medianoche.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
