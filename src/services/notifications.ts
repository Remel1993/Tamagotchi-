/**
 * Duolingo-style push notifications and browser tab alerts service.
 * Supports HTML5 Web Notifications API, animated Favicon, dynamic tab title,
 * and sassy, funny, caring Duolingo-style reminders.
 */

import { TamagotchiState, EvolutionStage } from '../types/tamagotchi';

export interface NotificationSettings {
  enabled: boolean;
  frequencyMinutes: number; // e.g. 15, 30, 60
  soundEnabled: boolean;
  duolingoTone: 'sassy' | 'caring' | 'dramatic';
}

const NOTIFICATION_SETTINGS_KEY = 'tamagotchi_notification_settings_v1';

export function getNotificationSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load notification settings', e);
  }
  return {
    enabled: true,
    frequencyMinutes: 30,
    soundEnabled: true,
    duolingoTone: 'sassy'
  };
}

export function saveNotificationSettings(settings: NotificationSettings) {
  try {
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save notification settings', e);
  }
}

// Sassy & Dramatic Duolingo-style Notification library
export const DUOLINGO_NOTIFICATIONS = {
  hunger: [
    { title: '🍙 ¡Piolín tiene hambre!', body: '¿Me estás ignorando por otra pestaña? Mi pancita hace ruidos 🥺 ¡Dame arrocito!', icon: '🍙' },
    { title: '🐥 Oye... ¿y mi comida?', body: 'Las aves virtuales también necesitan comer. ¡No dejes que se vacíen mis corazones!', icon: '🍚' },
    { title: '💔 ¡Me abandonaste!', body: '4 corazones vacíos y un pollito triste. Tarda solo 5 segundos alimentarme.', icon: '🍙' }
  ],
  water: [
    { title: '💧 ¡Hora de tomar Agua!', body: 'Recordatorio de tu pollito: ¡Bebe un vaso de agua ahora mismo! 🥛 Tu cuerpo y yo lo necesitamos.', icon: '💧' },
    { title: '🫙 ¡Objetivo Hidratación!', body: '¿Llevas 8 vasos hoy? Bebe 250ml para purificar toxinas y darle +3% de salud a tu mascota.', icon: '💧' }
  ],
  pills: [
    { title: '💊 ¡Recordatorio de tus Pastillas!', body: '¿Ya tomaste tus medicamentos o vitaminas de hoy? ¡Cuídate para que cuidemos juntos el nido!', icon: '💊' },
    { title: '🩺 ¡Alerta de Salud!', body: 'Tu dosis diaria de pastillas/vitaminas está pendiente. ¡Márcalas para activar el escudo inmune!', icon: '💊' }
  ],
  sleep: [
    { title: '🌙 ¡Higiene de Sueño!', body: 'Es hora de apagar pantallas y descansar. ¡Pon a dormir a tu Tamagotchi con manta térmica!', icon: '💤' },
    { title: '😴 Tu pollito bosteza...', body: 'Zzz... hora de apagar la luz para un sueño reparador de 8 horas.', icon: '🌙' }
  ],
  zumba: [
    { title: '💃 ¡Es hora de Zumba Fitness!', body: '¡Solo 20 minutos de baile para acelerar el crecimiento +1 día (+24h) y recargar salud vital!', icon: '🔥' },
    { title: '⚡ ¡No rompas tu racha de baile!', body: 'Baila un poco con tu Tamagotchi para quemar calorías y desbloquear medallas.', icon: '💃' }
  ],
  poop: [
    { title: '🦆 ¡Emergencia Sanitaria!', body: '¡Pío pío! Hay suciedad en mi pantalla... ¡Pásale el patito de goma antes de que enferme! 🤢', icon: '🧼' },
    { title: '💩 ¡Alguien hizo del baño!', body: 'No me dejes viviendo entre popós. ¡Abre la pestaña y limpia!', icon: '🦆' }
  ],
  idle: [
    { title: '🐥 ¡Tu Tamagotchi te extraña!', body: 'Estos 7 días de vida son sagrados... ¡Entra a darme unas caricias y jugar un minijuego!', icon: '💖' },
    { title: '🥺 ¿Quién cuidará de mí?', body: 'Solo necesitas 1 minuto para checar mis corazones de hambre y felicidad.', icon: '✨' },
    { title: '👑 ¡Rumbo al Pollo Adulto!', body: 'Cada hora cuenta en el ciclo de evolución. ¡Ven a ver mi progreso de hoy!', icon: '🐣' }
  ]
};

class NotificationManager {
  private originalTitle: string = 'Tamagotchi Virtual Pet';
  private titleInterval: any = null;
  private isTabActive: boolean = true;
  private lastNotificationTimestamp: number = 0;

  constructor() {
    if (typeof document !== 'undefined') {
      this.originalTitle = document.title || 'Tamagotchi Virtual Pet';
      this.initVisibilityListener();
    }
  }

  private initVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      this.isTabActive = document.visibilityState === 'visible';
      if (this.isTabActive) {
        this.stopTitleAnimation();
      }
    });
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  public hasPermission(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  }

  public sendPushNotification(title: string, body: string, icon = '🐥') {
    const settings = getNotificationSettings();
    if (!settings.enabled) return;

    // 1. Web Notification
    if (this.hasPermission()) {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/assets/icon.png', // or standard browser icon
          badge: '/assets/icon.png',
          tag: 'tamagotchi-reminder',
          silent: !settings.soundEnabled
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (e) {
        console.warn('Error sending web notification', e);
      }
    }

    // 2. Tab title animation if tab is hidden
    if (!this.isTabActive) {
      this.startTitleAnimation(title);
    }
  }

  public startTitleAnimation(alertMessage: string) {
    this.stopTitleAnimation();
    let toggle = false;
    const shortAlert = alertMessage.length > 25 ? alertMessage.slice(0, 25) + '...' : alertMessage;

    this.titleInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.stopTitleAnimation();
        return;
      }
      document.title = toggle ? `(1) 🔔 ${shortAlert}` : `(1) 🐥 ¡Tu Mascota te Llama!`;
      toggle = !toggle;
    }, 1200);
  }

  public stopTitleAnimation() {
    if (this.titleInterval) {
      clearInterval(this.titleInterval);
      this.titleInterval = null;
    }
    if (typeof document !== 'undefined') {
      document.title = this.originalTitle;
    }
  }

  // Trigger contextual Duolingo reminder based on state
  public checkAndTriggerReminder(state: TamagotchiState) {
    if (state.isDead) return;

    const now = Date.now();
    const settings = getNotificationSettings();
    const minCooldownMs = (settings.frequencyMinutes || 20) * 60 * 1000;

    // Cooldown check (except urgent needs)
    const isUrgent = state.hungryHearts === 0 || state.poopCount >= 2 || state.isSick || state.healthPercent < 35;
    if (!isUrgent && now - this.lastNotificationTimestamp < minCooldownMs) {
      return;
    }

    let chosenNotif: { title: string; body: string; icon: string } | null = null;

    if (state.poopCount >= 2) {
      const list = DUOLINGO_NOTIFICATIONS.poop;
      chosenNotif = list[Math.floor(Math.random() * list.length)];
    } else if (state.hungryHearts <= 1) {
      const list = DUOLINGO_NOTIFICATIONS.hunger;
      chosenNotif = list[Math.floor(Math.random() * list.length)];
    } else if (state.ownerHabits?.waterGlassesToday < 4 && new Date().getHours() >= 12) {
      const list = DUOLINGO_NOTIFICATIONS.water;
      chosenNotif = list[Math.floor(Math.random() * list.length)];
    } else if (!state.ownerHabits?.pillsTakenToday && new Date().getHours() >= 14) {
      const list = DUOLINGO_NOTIFICATIONS.pills;
      chosenNotif = list[Math.floor(Math.random() * list.length)];
    } else if (new Date().getHours() >= 21 && !state.isSleeping) {
      const list = DUOLINGO_NOTIFICATIONS.sleep;
      chosenNotif = list[Math.floor(Math.random() * list.length)];
    } else if (!state.zumbaCompletedDate && new Date().getHours() >= 17) {
      const list = DUOLINGO_NOTIFICATIONS.zumba;
      chosenNotif = list[Math.floor(Math.random() * list.length)];
    } else {
      const list = DUOLINGO_NOTIFICATIONS.idle;
      chosenNotif = list[Math.floor(Math.random() * list.length)];
    }

    if (chosenNotif) {
      this.lastNotificationTimestamp = now;
      this.sendPushNotification(chosenNotif.title, chosenNotif.body, chosenNotif.icon);
    }
  }

  // Quick test notification for the user to verify in browser/mobile
  public sendTestDuolingoNotification() {
    const list = [
      { title: '🐥 ¡Piolín dice: "No te olvides de mí!"', body: 'Modo Duolingo activado: ¿Ya tomaste tu agua y le diste amor a tu pollito? ❤️', icon: '🐥' },
      { title: '🍙 "Tengo hambre de arrocito..."', body: 'Tu Tamagotchi está vigilando tu racha de cuidados diarios. ¡No lo dejes pasar hambre!', icon: '🍙' },
      { title: '💧 ¡Recordatorio de Hidratación!', body: 'Bebe un vaso de agua ahora mismo para mantenerte saludable y darle energía a tu huevo.', icon: '💧' },
      { title: '💃 ¡Hora del Zumba Fitness!', body: '20 minutos de baile para avanzar 1 día (+24h) y recargar salud al 100%.', icon: '💃' }
    ];
    const picked = list[Math.floor(Math.random() * list.length)];
    this.sendPushNotification(picked.title, picked.body, picked.icon);
    return picked;
  }
}

export const notificationManager = new NotificationManager();
