import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Heart,
  Droplets,
  Pill,
  Moon,
  Flame,
  Gamepad2,
  ShieldCheck
} from 'lucide-react';
import { Achievement } from '../types/tamagotchi';
import { soundManager } from '../services/soundEffects';

interface AchievementsModalProps {
  achievements: Achievement[];
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  isOpen,
  onClose
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'health' | 'survival' | 'zumba' | 'care'>('all');

  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter((a) => {
    if (filterCategory === 'all') return true;
    return a.category === filterCategory;
  });

  const getCategoryBadge = (category: Achievement['category']) => {
    switch (category) {
      case 'health':
        return { label: 'Salud del Dueño', color: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/40' };
      case 'survival':
        return { label: 'Supervivencia', color: 'text-amber-300 bg-amber-950/80 border-amber-500/40' };
      case 'zumba':
        return { label: 'Zumba Fitness', color: 'text-rose-300 bg-rose-950/80 border-rose-500/40' };
      case 'care':
        return { label: 'Cuidados', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30 text-slate-950 font-black">
              🏆
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 tracking-tight flex items-center gap-2">
                SISTEMA DE LOGROS & MEDALLAS
              </h2>
              <p className="text-[11px] text-slate-400">
                Recompensas por supervivencia, constancia y hábitos saludables
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

        {/* Global Progress Bar Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-950 to-cyan-950/50 border border-amber-500/30 mb-3 shrink-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Progreso de Logros Desbloqueados
            </span>
            <span className="font-mono font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
              {unlockedCount} / {totalCount} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-700/80">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full shadow-sm"
            />
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-slate-800/80 shrink-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: '🌟 Todos', count: totalCount },
            { id: 'health', label: '💧 Salud del Dueño', count: achievements.filter((a) => a.category === 'health').length },
            { id: 'survival', label: '👑 Supervivencia', count: achievements.filter((a) => a.category === 'survival').length },
            { id: 'zumba', label: '💃 Zumba', count: achievements.filter((a) => a.category === 'zumba').length },
            { id: 'care', label: '❤️ Cuidados', count: achievements.filter((a) => a.category === 'care').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playBeep(1100, 0.02);
                setFilterCategory(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === tab.id
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20 scale-102'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          {filteredAchievements.map((achievement) => {
            const badge = getCategoryBadge(achievement.category);
            const currentVal = Math.min(achievement.target, achievement.current);
            const itemPercent = Math.round((currentVal / achievement.target) * 100);

            return (
              <div
                key={achievement.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  achievement.unlocked
                    ? 'bg-slate-900/90 border-amber-400/60 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/70 border-slate-800/90 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon / Trophy */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                      achievement.unlocked
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 border-amber-200 shadow-md shadow-amber-400/30'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5" />}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-sm text-slate-100 flex items-center gap-1.5">
                          {achievement.title}
                          {achievement.unlocked && (
                            <span className="text-emerald-400 text-xs flex items-center gap-0.5 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> ¡Desbloqueado!
                            </span>
                          )}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug mb-2">
                      {achievement.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400 text-[10px]">
                          🎁 Recompensa: <strong className="text-amber-300 font-sans">{achievement.rewardDescription}</strong>
                        </span>
                        <span className={`font-bold ${achievement.unlocked ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {currentVal} / {achievement.target}
                        </span>
                      </div>

                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          style={{ width: `${itemPercent}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            achievement.unlocked
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                              : 'bg-amber-500/70'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            {unlockedCount} de {totalCount} Medallas Obtenidas
          </span>
          <button
            onClick={() => {
              soundManager.playCancel();
              onClose();
            }}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-md active:scale-95"
          >
            Cerrar Logros
          </button>
        </div>
      </motion.div>
    </div>
  );
};
