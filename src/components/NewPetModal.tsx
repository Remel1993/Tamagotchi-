import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Check } from 'lucide-react';
import { PetSpecies } from '../types/tamagotchi';
import { soundManager } from '../services/soundEffects';

interface NewPetModalProps {
  currentGeneration: number;
  onClose: () => void;
  onConfirmHatch: (petName: string, species: PetSpecies) => void;
}

const CHICK_NAME_SUGGESTIONS = [
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

const DOG_NAME_SUGGESTIONS = [
  'Firulais',
  'Toby',
  'Rocky',
  'Max',
  'Luna',
  'Coco',
  'Zeus',
  'Bobby',
  'Zumba'
];

export const NewPetModal: React.FC<NewPetModalProps> = ({
  currentGeneration,
  onClose,
  onConfirmHatch
}) => {
  const [species, setSpecies] = useState<PetSpecies>('chick');
  const [petName, setPetName] = useState<string>('Piolín');

  const handleSpeciesChange = (newSpecies: PetSpecies) => {
    setSpecies(newSpecies);
    soundManager.playBeep(newSpecies === 'dog' ? 520 : 880, 0.04);
    if (newSpecies === 'dog') {
      setPetName('Toby');
    } else {
      setPetName('Piolín');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playHappy();
    const defaultName = species === 'dog' ? `Perrito G${currentGeneration + 1}` : `Tamatchi G${currentGeneration + 1}`;
    onConfirmHatch(petName.trim() || defaultName, species);
  };

  const currentSuggestions = species === 'dog' ? DOG_NAME_SUGGESTIONS : CHICK_NAME_SUGGESTIONS;

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
              {species === 'dog' ? '🐶' : '🥚'}
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-300 font-mono tracking-wide">
                NUEVA MASCOTA (G{currentGeneration + 1})
              </h2>
              <p className="text-xs text-slate-400">
                Elige tu especie e inicia el ciclo de 7 días
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

        {/* Species Selection */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              1. Elige la Especie de tu Mascota:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Pollito Option */}
              <button
                type="button"
                onClick={() => handleSpeciesChange('chick')}
                className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  species === 'chick'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {species === 'chick' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <span className="text-3xl mb-1">🐥</span>
                <span className="text-xs font-black">Pollito Tamagotchi</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Huevo &rarr; Polluelo &rarr; Adulto</span>
              </button>

              {/* Perrito Option */}
              <button
                type="button"
                onClick={() => handleSpeciesChange('dog')}
                className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  species === 'dog'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {species === 'dog' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <span className="text-3xl mb-1">🐶</span>
                <span className="text-xs font-black">Perrito Deportivo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Cachorro &rarr; Joven &rarr; Campeón</span>
              </button>
            </div>
          </div>

          {/* Central Preview */}
          <div className="flex flex-col items-center justify-center py-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <motion.div
              animate={{ scale: [1, 1.08, 1], y: [0, -4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl my-1"
            >
              {species === 'dog' ? '🐶' : '🥚'}
            </motion.div>
            <span className="text-xs font-mono text-amber-300 font-bold">
              {species === 'dog' ? 'Cachorrito en Camita (Día 1)' : `Huevo de Generación ${currentGeneration + 1}`}
            </span>
            <span className="text-[10px] text-slate-400 text-center px-4">
              {species === 'dog'
                ? 'Comenzará durmiendo plácidamente con ojitos cerrados y poco pelo'
                : 'Listo para comenzar el Día 1 de Incubación y calor'}
            </span>
          </div>

          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              2. Nombre de tu nueva mascota:
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              maxLength={15}
              placeholder={species === 'dog' ? 'Ej: Toby, Firulais...' : 'Ej: Piolín, Chispita...'}
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
              {currentSuggestions.map((sug) => (
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
              {species === 'dog' ? 'Adoptar Cachorrito' : 'Incubar Nuevo Huevo'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
