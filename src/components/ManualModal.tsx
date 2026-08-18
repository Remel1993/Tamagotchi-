import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Heart,
  Flame,
  Gamepad2,
  Clock,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Sun,
  Moon
} from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'buttons' | 'cycle' | 'health' | 'zumba' | 'game'>('basics');

  if (!isOpen) return null;

  const tabs = [
    { id: 'basics', label: '📖 Introducción', icon: '🐣' },
    { id: 'buttons', label: '🔘 Botones & Iconos', icon: '🎮' },
    { id: 'health', label: '❤️ Barra de Salud', icon: '⏱️' },
    { id: 'game', label: '🎮 3 Minijuegos', icon: '🎯' },
    { id: 'cycle', label: '⏳ Ciclo de 7 Días', icon: '📅' },
    { id: 'zumba', label: '💃 Zumba & Retos', icon: '✨' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-lg shadow-md shadow-cyan-500/20">
              📖
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-cyan-300 font-mono flex items-center gap-2">
                MANUAL DEL CUIDADOR
              </h2>
              <p className="text-[11px] text-slate-400">
                Guía completa e instrucciones del Tamagotchi 7 Días
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

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-slate-800/80 shrink-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playBeep(1100, 0.02);
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20 scale-102'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 text-xs text-slate-300">
          {/* BASICS */}
          {activeTab === 'basics' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h3 className="font-black text-amber-300 text-sm flex items-center gap-2">
                  <span>🐣</span> ¿Cuál es tu misión como Cuidador?
                </h3>
                <p className="leading-relaxed">
                  Tu objetivo es cuidar a tu mascota desde que es un <strong>Huevo en Incubación</strong> hasta que rompa el cascarón y se convierta en un <strong>Pollo Adulto</strong> a lo largo de un ciclo real de <strong>7 Días</strong>.
                </p>
                <p className="leading-relaxed">
                  El huevo necesita <strong>calor, mimos, retos diarios y sesiones de Zumba</strong>. Si lo descuidas por más de 24 horas continuas, el frío y el abandono harán que fallezca.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                  <span className="font-black text-emerald-400 flex items-center gap-1.5">
                    <span>❤️</span> Regla de Oro: Visitas Diarias
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Visita a tu huevo/pollito al menos 1 o 2 veces al día para mantener su salud en el 100%.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                  <span className="font-black text-rose-400 flex items-center gap-1.5">
                    <span>💃</span> El Secreto: Bailar Zumba
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Un toque a <strong>Bailar Zumba</strong> otorga +25% de salud vital y acelera 2 horas su crecimiento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BUTTONS & ICONS */}
          {activeTab === 'buttons' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h3 className="font-black text-cyan-300 text-sm flex items-center gap-2">
                  <span>🎮</span> Los 3 Botones Físicos
                </h3>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="w-7 h-7 mx-auto rounded-full bg-slate-700 flex items-center justify-center font-black text-white text-xs mb-1">A</span>
                    <strong className="block text-xs text-amber-300">ELEGIR</strong>
                    <span className="text-[10px] text-slate-400 font-sans">Mueve la selección entre los 8 iconos</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-500/40">
                    <span className="w-7 h-7 mx-auto rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs mb-1">B</span>
                    <strong className="block text-xs text-amber-300">ACCIÓN</strong>
                    <span className="text-[10px] text-slate-400 font-sans">Confirma la acción del icono seleccionado</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="w-7 h-7 mx-auto rounded-full bg-slate-700 flex items-center justify-center font-black text-white text-xs mb-1">C</span>
                    <strong className="block text-xs text-amber-300">VOLVER / MIMOS</strong>
                    <span className="text-[10px] text-slate-400 font-sans">Cancela menús o acaricia a tu mascota</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h3 className="font-black text-amber-300 text-xs uppercase tracking-wider">
                  Menú de los 8 Iconos Tradicionales
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700">
                    <strong className="text-amber-300 block">🍙 Comida:</strong> Alimenta con arroz o pastel (al nacer).
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700">
                    <strong className="text-yellow-300 block">💡 Luz:</strong> Apaga la luz cuando duerma para que descanse.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700">
                    <strong className="text-cyan-300 block">🎮 Minijuego:</strong> Atrapa el calor que cae para sumar salud.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700">
                    <strong className="text-pink-300 block">💉 Medicina:</strong> Cura calaveras y enfermedades al instante.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700">
                    <strong className="text-sky-300 block">🦆 Limpieza:</strong> Baña y elimina las popós de la pantalla.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700">
                    <strong className="text-emerald-300 block">📊 Báscula:</strong> Consulta edad, peso, salud y corazones.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700">
                    <strong className="text-indigo-300 block">🗣️ Disciplina:</strong> Enseña modales y buena conducta.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700">
                    <strong className="text-rose-400 block">🚨 Alerta:</strong> Se ilumina cuando tu mascota necesita auxilio.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HEALTH (24 HOURS RULE) */}
          {activeTab === 'health' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-black text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Regla Crítica de Salud & 24 Horas de Abandono</span>
                </div>
                <p className="leading-relaxed">
                  La salud de tu huevo/pollito decae de forma continua y gradual si no se le brinda atención:
                </p>
                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-emerald-500/40">
                    <span className="text-emerald-300 font-bold">⏱️ 0 a 6 Horas sin visita:</span>
                    <span className="text-emerald-400 font-black">Salud baja a 75% (Estable)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-amber-500/40">
                    <span className="text-amber-300 font-bold">⏱️ 12 Horas sin visita:</span>
                    <span className="text-amber-400 font-black">Salud baja a 50% (Tristeza)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-orange-500/40">
                    <span className="text-orange-300 font-bold">⏱️ 18 Horas sin visita:</span>
                    <span className="text-orange-400 font-black">Salud baja a 25% (¡Peligro!)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-red-500/60">
                    <span className="text-red-300 font-bold">⏱️ 24 Horas sin visita:</span>
                    <span className="text-red-400 font-black animate-pulse">Salud 0% ➔ ¡FALLECIMIENTO!</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 space-y-1 text-[11px]">
                <strong className="text-amber-300 block">¿Cómo recuperar la salud al 100%?</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Pulsar <strong>Bailar Zumba (+15 min)</strong>: Recupera inmediatamente <strong>+25% de salud</strong>.</li>
                  <li>Ganar el <strong>Minijuego de Calor</strong>: Otorga <strong>+15% de salud</strong>.</li>
                  <li>Completar los <strong>Retos Diarios</strong> y alimentar / limpiar a la mascota.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 3 MINIGAMES */}
          {activeTab === 'game' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-cyan-500/40 space-y-1">
                <h3 className="font-black text-cyan-300 text-sm flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Los 3 Tipos de Minijuegos Disponibles</span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  Selecciona el icono 🎮 (Minijuego) para elegir entre los 3 minijuegos. Ganar cualquiera (3+ aciertos) otorga <strong>+15% de Salud Vital ❤️</strong> y acelera la incubación.
                </p>
              </div>

              {/* Game 1 */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-amber-300 flex items-center gap-1.5 text-xs">
                    <span>🔥</span> 1. Atrapa el Calor (Nido Térmico)
                  </strong>
                  <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    Reflejos Rápidos
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Chispas térmicas caen por 3 columnas a velocidad creciente (1.0x a 3.2x). Toca directamente la columna o usa [A] para mover el nido y atrapar el calor antes de que toque el suelo.
                </p>
              </div>

              {/* Game 2 */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-cyan-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-cyan-300 flex items-center gap-1.5 text-xs">
                    <span>🎯</span> 2. Adivina la Dirección (Clásico Tamagotchi)
                  </strong>
                  <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                    Predicción 50/50
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tu mascota se prepara tras una cuenta atrás 3-2-1. Elige si girará hacia la <strong>Izquierda ⬅️</strong> o <strong>Derecha ➡️</strong>. ¡Acierta al menos 3 de 5 para triunfar!
                </p>
              </div>

              {/* Game 3 */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-rose-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-rose-300 flex items-center gap-1.5 text-xs">
                    <span>💃</span> 3. Salto de Ritmo Zumba (Musical Beat)
                  </strong>
                  <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded">
                    Sincronización
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Las notas musicales viajan por la pista de baile. Pulsa el botón [B] o toca la pantalla con precisión justo cuando la nota musical llegue a la Zona de Baile 🎯 del pollito.
                </p>
              </div>
            </div>
          )}

          {/* 7 DAYS CYCLE */}
          {activeTab === 'cycle' && (
            <div className="space-y-2.5">
              <span className="font-bold text-amber-300 text-xs uppercase tracking-wider block">
                Las 6 Etapas de Desarrollo (0 a 7 Días)
              </span>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-amber-300 block">Día 1: Huevo en Incubación 🥚</strong>
                    <span className="text-[10px] text-slate-400 font-sans">El huevo descansa en el nido recibiendo calor</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400">0h - 24h</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-amber-300 block">Día 2: Huevo Moviéndose 🐣</strong>
                    <span className="text-[10px] text-slate-400 font-sans">El embrión despierta y se sacude con energía</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400">24h - 48h</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-amber-300 block">Día 3: Grietas en el Cascarón ⚡</strong>
                    <span className="text-[10px] text-slate-400 font-sans">Fisuras profundas aparecen en la cáscara</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400">48h - 72h</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-amber-300 block">Día 4: Descascarándose 🐥</strong>
                    <span className="text-[10px] text-slate-400 font-sans">Trozos de cáscara caen y asoma el pollito</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400">72h - 96h</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-amber-300 block">Días 5-6: Pollito Bebé en Cascarón 💛</strong>
                    <span className="text-[10px] text-slate-400 font-sans">¡Nace tu pollito amarillo! Requiere comida y cuidados</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400">96h - 144h</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <strong className="text-emerald-300 block">Día 7+: Pollo Adulto Completo 👑</strong>
                    <span className="text-[10px] text-slate-400 font-sans">Madurez máxima alcanzada con patas y plumaje completo</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">144h+</span>
                </div>
              </div>
            </div>
          )}

          {/* ZUMBA & QUESTS */}
          {activeTab === 'zumba' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Sinergia Fitness: Baila Zumba con tu Mascota</span>
                </div>
                <p className="leading-relaxed">
                  Al completar tu sesión de 15 minutos de baile Zumba, tu mascota recibe energía física y la súper recompensa:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-200">
                  <li><strong>+1 Día Entero (+24 Horas) de Crecimiento Acelerado</strong>.</li>
                  <li><strong>+35% de Salud Vital Inmediata</strong> ❤️.</li>
                  <li><strong>Felicidad al Máximo (4/4 corazones)</strong> y cumplimiento de la misión de Zumba.</li>
                  <li>Música latina motivadora con ritmo 8-bit opcional tocando el botón de música 🎵.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-pink-300 font-black text-sm">
                  <span>💬</span>
                  <span>Emociones, Mimos y Frases por Etapas</span>
                </div>
                <p className="leading-relaxed text-[11px] text-slate-300">
                  Tu pollito tiene emociones en tiempo real (Radiante, Contento, Con Hambre, Triste, Friolento, Somnoliento, etc.). Al hacerle <strong>mimos</strong> (tocándolo o pulsando botón [C]), emitirá adorables gorjeos y dirá frases tiernas según su etapa de crecimiento.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-500 font-mono">
            Tamagotchi 7 Días • v3.5
          </span>
          <button
            onClick={() => {
              soundManager.playCancel();
              onClose();
            }}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-md active:scale-95"
          >
            Entendido, ¡Volver a Cuidar!
          </button>
        </div>
      </motion.div>
    </div>
  );
};
