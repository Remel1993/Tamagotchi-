import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Heart,
  Calendar,
  Clock,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { GraveyardRecord } from '../types/tamagotchi';
import { placeFlowersOnGrave } from '../services/storage';
import { soundManager } from '../services/soundEffects';

interface GraveyardModalProps {
  records: GraveyardRecord[];
  onClose: () => void;
  onNewPet: () => void;
  onRecordsUpdated: (records: GraveyardRecord[]) => void;
}

export const GraveyardModal: React.FC<GraveyardModalProps> = ({
  records,
  onClose,
  onNewPet,
  onRecordsUpdated
}) => {
  const [selectedRecord, setSelectedRecord] = useState<GraveyardRecord | null>(
    records.length > 0 ? records[0] : null
  );
  const [flowerNotification, setFlowerNotification] = useState<string | null>(null);

  const handlePlaceFlowers = (graveId: string, name: string) => {
    soundManager.playSelect();
    const updated = placeFlowersOnGrave(graveId);
    onRecordsUpdated(updated);
    if (selectedRecord && selectedRecord.id === graveId) {
      setSelectedRecord({
        ...selectedRecord,
        flowersPlaced: selectedRecord.flowersPlaced + 1
      });
    }
    setFlowerNotification(`🌸 Has depositado flores en la lápida de ${name}`);
    setTimeout(() => setFlowerNotification(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Prominent Back / Return Button */}
            <button
              onClick={() => {
                soundManager.playCancel();
                onClose();
              }}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
              title="Volver a la Mascota"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Atrás</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shadow-inner">
                🪦
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-amber-300 font-mono flex items-center gap-2">
                  CEMENTERIO
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  Memorial de generaciones pasadas
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playSelect();
                onNewPet();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nueva Mascota</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
            <button
              onClick={() => {
                soundManager.playCancel();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Flower Toast */}
        <AnimatePresence>
          {flowerNotification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-2 bg-pink-950/80 border border-pink-500/50 text-pink-200 text-xs font-bold px-3 py-1.5 rounded-xl text-center shadow-lg shrink-0"
            >
              {flowerNotification}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto pr-1">
          {records.length === 0 ? (
            /* Empty State */
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-3xl">
                🕊️
              </div>
              <h3 className="text-sm font-bold text-slate-200">
                No hay mascotas en el cementerio aún
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                ¡Tu linaje de Tamagotchis está saludable! Cuando alguna mascota complete su ciclo o fallezca, su memorial se preservará aquí con honor.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    soundManager.playCancel();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver al Juego
                </button>
                <button
                  onClick={() => {
                    soundManager.playSelect();
                    onNewPet();
                  }}
                  className="flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs shadow-md cursor-pointer hover:bg-amber-300"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Nueva Mascota
                </button>
              </div>
            </div>
          ) : (
            /* Graveyard Grid & Details */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* List of Graves */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tumbas Conmemoradas ({records.length})
                </span>
                {records.map((r) => {
                  const isSelected = selectedRecord?.id === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        soundManager.playBeep(900, 0.02);
                        setSelectedRecord(r);
                      }}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-400/80 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="text-xl">🪦</div>
                        <div>
                          <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            {r.name}
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-700 text-amber-300 rounded-md">
                              G{r.generation}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {r.stageName} • {r.ageDays}d
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono text-pink-400 flex items-center justify-end gap-1">
                          🌸 {r.flowersPlaced}
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {r.deathDate.split('T')[0] || r.deathDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Grave Tribute Card */}
              {selectedRecord && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
                  <div>
                    {/* Tombstone Monument Graphic */}
                    <div className="flex flex-col items-center justify-center py-2.5 bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-800/80 mb-2.5">
                      <div className="text-3xl mb-0.5">🪦</div>
                      <h3 className="text-sm font-black text-amber-300 font-mono">
                        {selectedRecord.name} (Generación {selectedRecord.generation})
                      </h3>
                      <span className="text-[11px] text-slate-400 italic text-center px-2">
                        "{selectedRecord.epitaph || 'Siempre vivirás en nuestros corazones'}"
                      </span>
                    </div>

                    {/* Stats Specs */}
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between py-0.5 border-b border-slate-800">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          Fecha:
                        </span>
                        <span className="font-mono text-slate-200 text-[10px]">
                          {selectedRecord.deathDate}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-0.5 border-b border-slate-800">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          Vivido:
                        </span>
                        <span className="font-mono text-slate-200">
                          {selectedRecord.ageDays} días
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-0.5 border-b border-slate-800">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Award className="w-3 h-3 text-emerald-400" />
                          Etapa:
                        </span>
                        <span className="font-bold text-slate-200">
                          {selectedRecord.stageName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-0.5 border-b border-slate-800">
                        <span className="text-slate-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-rose-400" />
                          Causa:
                        </span>
                        <span className="font-bold text-rose-300 text-[10px] text-right max-w-[60%]">
                          {selectedRecord.deathReasonText}
                        </span>
                      </div>

                      {selectedRecord.zumbaMinutesLogged > 0 && (
                        <div className="flex items-center justify-between py-0.5 border-b border-slate-800">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-500" />
                            Zumba bailado:
                          </span>
                          <span className="font-mono text-amber-300 font-bold">
                            {selectedRecord.zumbaMinutesLogged} min
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Grave Actions */}
                  <div className="pt-3 flex items-center gap-2">
                    <button
                      onClick={() =>
                        handlePlaceFlowers(selectedRecord.id, selectedRecord.name)
                      }
                      className="flex-1 flex items-center justify-center gap-1 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 font-bold py-1.5 px-2.5 rounded-xl text-xs transition-colors cursor-pointer active:scale-95"
                    >
                      <span>🌸</span>
                      Dejar Flores ({selectedRecord.flowersPlaced})
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playSelect();
                        onNewPet();
                      }}
                      className="flex-1 flex items-center justify-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-1.5 px-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      <span>🐣</span>
                      Nueva Mascota
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Back Bar in Modal */}
        <div className="pt-2.5 mt-2 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              soundManager.playCancel();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Volver a la Mascota</span>
          </button>
          <span className="text-[10px] text-slate-500 font-mono">
            {records.length} memoriales guardados
          </span>
        </div>
      </motion.div>
    </div>
  );
};
