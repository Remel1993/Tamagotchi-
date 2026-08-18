import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Heart, Check } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface NewPetModalProps {
  currentGeneration: number;
  onClose: () => void;
  onConfirmHatch: (petName: string) => void;
}

const NAME_SUGGESTIONS = [
  'Piolín',
  'Pollito',
  'Chispita',
  'Solcito',
  'Pikito',
  'Bolita',
  'Mango',
  'Cookie',
  'Zumbita'
];

export const NewPetModal: React.FC<NewPetModalProps> = ({
  currentGeneration,
  onClose,
  onConfirmHatch
}) => {
  const [petName, setPetName] = useState<string>('Piolín');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playHappy();
    onConfirmHatch(petName.trim() || `Tamatchi G${currentGeneration + 1}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
              🥚
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-300 font-mono tracking-wide">
                NUEVA MASCOTA (G{currentGeneration + 1})
              </h2>
              <p className="text-xs text-slate-400">
                Inicia un nuevo ciclo de 7 días con amor y vitalidad
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

        {/* Central Egg Preview */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center justify-center py-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <motion.div
              animate={{ scale: [1, 1.08, 1], y: [0, -4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl my-2"
            >
              🥚
            </motion.div>
            <span className="text-xs font-mono text-amber-300 font-bold">
              Huevo de Generación {currentGeneration + 1}
            </span>
            <span className="text-[10px] text-slate-400">
              Listo para comenzar el Día 1 de Incubación
            </span>
          </div>

          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Nombre de tu nueva mascota:
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              maxLength={15}
              placeholder="Ej: Piolín, Chispita..."
              className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-hidden transition-colors"
              autoFocus
            />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Sugerencias rápidas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {NAME_SUGGESTIONS.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => setPetName(sug)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    petName === sug
                      ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Incubar Nuevo Huevo
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
