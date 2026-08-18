import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bell,
  BellRing,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Flame,
  Volume2,
  Clock,
  Send
} from 'lucide-react';
import {
  getNotificationSettings,
  saveNotificationSettings,
  notificationManager,
  NotificationSettings
} from '../services/notifications';
import { soundManager } from '../services/soundEffects';

interface NotificationSettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onShowToast: (title: string, desc: string, icon: string) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen = true,
  onClose,
  onShowToast
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings);
  const [permissionStatus, setPermissionStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  useEffect(() => {
    if (isOpen) {
      setSettings(getNotificationSettings());
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermissionStatus(Notification.permission);
      }
    }
  }, [isOpen]);

  if (isOpen === false) return null;

  const handleRequestPermission = async () => {
    soundManager.playSelect();
    const granted = await notificationManager.requestPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    if (granted) {
      soundManager.playHappy();
      onShowToast(
        '🔔 Notificaciones Activadas',
        '¡Ahora recibirás alertas estilo Duolingo en tu celular o navegador cuando tu mascota te necesite!',
        '🐣'
      );
    }
  };

  const handleSendTestNotification = () => {
    soundManager.playSelect();
    const testData = notificationManager.sendTestDuolingoNotification();
    onShowToast(testData.title, testData.body, testData.icon);
  };

  const handleToggleEnabled = () => {
    soundManager.playSelect();
    const updated = { ...settings, enabled: !settings.enabled };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleChangeFrequency = (freq: number) => {
    soundManager.playSelect();
    const updated = { ...settings, frequencyMinutes: freq };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30 text-slate-950 font-black">
              🔔
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-emerald-300 tracking-tight flex items-center gap-2">
                NOTIFICACIONES ESTILO DUOLINGO
              </h2>
              <p className="text-[11px] text-slate-400">
                Alertas dramáticas y cariñosas en tu pestaña y celular
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

        {/* Duolingo Mascot Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/60 border border-emerald-500/40 mb-3.5 shrink-0 flex items-center gap-3">
          <div className="text-3xl animate-bounce">🐥</div>
          <div className="text-xs text-slate-200 leading-snug">
            <strong className="text-emerald-300">¡Tu Tamagotchi no te dejará olvidar tu racha!</strong>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Si cambias de pestaña o sales de la app, recibirás recordatorios con humor sobre hambre, agua, pastillas, sueño y zumba.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
          {/* Permission Status */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Permiso del Navegador / Celular</h4>
                <p className="text-[11px] text-slate-400">
                  {permissionStatus === 'granted'
                    ? '✅ Notificaciones autorizadas'
                    : permissionStatus === 'denied'
                    ? '❌ Permiso bloqueado en el navegador'
                    : '⏳ Permiso pendiente de autorizar'}
                </p>
              </div>
            </div>

            {permissionStatus !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 rounded-xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Autorizar</span>
              </button>
            )}
          </div>

          {/* Master Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-200">Activar Alertas & Título de Pestaña</h4>
              <p className="text-[11px] text-slate-400">
                Muestra alertas dinámicas como "(1) 🐥 ¡Piolín te extraña!" cuando estés en otra pestaña.
              </p>
            </div>

            <button
              onClick={handleToggleEnabled}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.enabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Frequency */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" /> Frecuencia de Recordatorios
              </span>
              <span className="font-mono text-emerald-300 font-bold">
                Cada {settings.frequencyMinutes} min
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleChangeFrequency(mins)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    settings.frequencyMinutes === mins
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {mins} minutos
                </button>
              ))}
            </div>
          </div>

          {/* Test Duolingo Notification Button */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950/40 to-slate-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Probar Alerta Duolingo
              </h4>
              <p className="text-[10px] text-slate-400">
                Envía una notificación de prueba instantánea a tu pantalla.
              </p>
            </div>

            <button
              onClick={handleSendTestNotification}
              className="px-3.5 py-1.5 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>¡Probar Ahora!</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            {settings.enabled ? '🟢 Alertas Activas' : '⚪ Alertas Pausadas'}
          </span>
          <button
            onClick={() => {
              soundManager.playCancel();
              onClose();
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-md active:scale-95"
          >
            Guardar & Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
