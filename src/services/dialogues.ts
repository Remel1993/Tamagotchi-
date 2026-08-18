import { EvolutionStage, TamagotchiState, ChickEmotion } from '../types/tamagotchi';

export interface EmotionInfo {
  emotion: ChickEmotion;
  label: string;
  icon: string;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

// 💖 Phrases when petting or giving "mimos" (caricias)
export const PETTING_PHRASES: Record<EvolutionStage, Array<{ text: string; emoji: string }>> = {
  [EvolutionStage.EGG_INCUBATING]: [
    { text: '¡Tap tap! Siento tus caricias tibias a través del cascarón', emoji: '🥚' },
    { text: '¡Qué rico calorcito me dan tus mimos!', emoji: '🔥' },
    { text: '¡Zzz... tus caricias me hacen soñar bonito!', emoji: '💤' },
    { text: '¡Tus mimos me dan energía para crecer fuerte!', emoji: '✨' },
    { text: '¡Me siento seguro y calientito en el nido!', emoji: '🪹' }
  ],
  [EvolutionStage.EGG_WIGGLING]: [
    { text: '¡Me muevo de felicidad con tus caricias!', emoji: '🐣' },
    { text: '¡Tus mimos me llenan de alegría y cosquillitas!', emoji: '💖' },
    { text: '¡Wiggle wiggle! ¡Siento tu amorcito!', emoji: '⚡' },
    { text: '¡Ya casi quiero salir para darte un abrazo!', emoji: '🥰' }
  ],
  [EvolutionStage.EGG_CRACKING]: [
    { text: '¡Crack! ¡Tus mimos me dan fuerza para romper la cáscara!', emoji: '💥' },
    { text: '¡Picoteo con más ganas gracias a tu cariño!', emoji: '🔨' },
    { text: '¡Siento tu presencia muy cerca de mí!', emoji: '✨' },
    { text: '¡Unos mimos más y romperé el cascarón!', emoji: '💪' }
  ],
  [EvolutionStage.EGG_HATCHING]: [
    { text: '¡Pío! ¡Ya asomo mis ojitos para verte!', emoji: '👀' },
    { text: '¡Qué suaves son tus caricias en mi cabecita!', emoji: '🥰' },
    { text: '¡Hola amigo! ¡Gracias por cuidarme tanto!', emoji: '🐣' },
    { text: '¡Tus mimos me dan la bienvenida al mundo!', emoji: '🌟' }
  ],
  [EvolutionStage.BABY_CHICK]: [
    { text: '¡Pío pío! ¡Me encantan tus caricias suaves!', emoji: '🥰' },
    { text: '¡Pío! ¡Me haces el pollito más feliz del mundo!', emoji: '💖' },
    { text: '¡Prrr! ¡Qué ricos mimos, te quiero muchísimo!', emoji: '🐣' },
    { text: '¡Pío pío! ¡Siento cosquillitas en mis alitas amarillas!', emoji: '✨' },
    { text: '¡Eres mi persona y cuidador favorito!', emoji: '🌟' },
    { text: '¡Pío! ¡Dame más cariñitos y mimos por favor!', emoji: '💕' },
    { text: '¡Pío pío! ¡Tus mimos me recargan el corazoncito!', emoji: '❤️' }
  ],
  [EvolutionStage.ADULT_CHICK]: [
    { text: '¡KIKIRIKÍ! ¡Qué bien se siente un buen mimo!', emoji: '👑' },
    { text: '¡Gracias por cuidarme con tanto amor desde el huevo!', emoji: '💖' },
    { text: '¡Un abrazo con alitas para mi cuidador campeón!', emoji: '🐓' },
    { text: '¡Pío! ¡Me llenas el alma de felicidad y energía!', emoji: '🌟' },
    { text: '¡Kikirikí! ¡Eres el mejor entrenador y amigo!', emoji: '🏆' }
  ],
  [EvolutionStage.DEAD]: [
    { text: 'Un dulce recuerdo de amor eterno...', emoji: '🕊️' }
  ]
};

// 💬 Stage-specific ambient / idle phrases
export const STAGE_IDLE_PHRASES: Record<EvolutionStage, Array<{ text: string; emoji: string }>> = {
  [EvolutionStage.EGG_INCUBATING]: [
    { text: 'Zzz... absorbiendo calor del nido con tranquilidad', emoji: '🥚' },
    { text: 'La temperatura está tibia y reconfortante', emoji: '🔥' },
    { text: '¿Bailaste Zumba hoy? Me llega tu ritmo positivo', emoji: '💃' },
    { text: 'Creciendo poco a poco en el día 1 de incubación', emoji: '⏳' }
  ],
  [EvolutionStage.EGG_WIGGLING]: [
    { text: '¡Mírame cómo me tambaleo de emoción a los lados!', emoji: '🐣' },
    { text: '¡Siento mucha vitalidad y energía dentro de mí!', emoji: '⚡' },
    { text: '¡Cada hora estoy más cerca de romper la cáscara!', emoji: '🌟' },
    { text: '¡Si bailas Zumba me lleno de ritmo y crezco rápido!', emoji: '💃' }
  ],
  [EvolutionStage.EGG_CRACKING]: [
    { text: '¡Crack! ¡Ya se están formando grietas profundas!', emoji: '💥' },
    { text: '¡Estoy picoteando el cascarón desde adentro!', emoji: '🔨' },
    { text: '¡No dejes que se enfríe el nido, dame calorcito!', emoji: '🔥' },
    { text: '¡Pronto saldrá mi cabecita al mundo exterior!', emoji: '👀' }
  ],
  [EvolutionStage.EGG_HATCHING]: [
    { text: '¡Pío! ¡Ya asomo mi piquito al mundo exterior!', emoji: '🐥' },
    { text: '¡Hola! ¿Tú eres quien me cuidó con tanto esmero?', emoji: '👀' },
    { text: '¡Qué emocionante ver la luz y sentir tus mimos!', emoji: '✨' },
    { text: '¡Casi me libero de todo el cascarón!', emoji: '🐣' }
  ],
  [EvolutionStage.BABY_CHICK]: [
    { text: '¡Pío pío! ¡Qué hermoso es dar saltitos y cantar!', emoji: '🐣' },
    { text: '¡Tengo un poquito de apetito! ¿Me das arroz o postre?', emoji: '🍙' },
    { text: '¡Vamos a bailar Zumba juntos para ganar energía!', emoji: '💃' },
    { text: '¡Quiero jugar al minijuego de atrapar el calor!', emoji: '🎮' },
    { text: '¡Crezco sano, feliz y con plumas brillantes gracias a ti!', emoji: '💖' },
    { text: '¡Pío! Recuerda limpiar el nido con el patito si hay popó', emoji: '🦆' }
  ],
  [EvolutionStage.ADULT_CHICK]: [
    { text: '¡KIKIRIKÍ! ¡He alcanzado mi máximo esplendor adulto!', emoji: '👑' },
    { text: '¡Soy un gallo fuerte, ágil y campeón de Zumba!', emoji: '🏆' },
    { text: '¡Completamos el ciclo de 7 días juntos con éxito!', emoji: '🎉' },
    { text: '¡Gracias por no abandonarme y cuidarme cada día!', emoji: '💖' },
    { text: '¡Kikirikí! ¡Mis plumas relucen de tanta salud!', emoji: '✨' }
  ],
  [EvolutionStage.DEAD]: [
    { text: 'Descansa en paz en el jardín del recuerdo...', emoji: '🪦' }
  ]
};

// Returns a petting dialogue with emoji
export function getPettingPhrase(stage: EvolutionStage): { text: string; emoji: string } {
  const list = PETTING_PHRASES[stage] || PETTING_PHRASES[EvolutionStage.BABY_CHICK];
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

// Returns a random idle / stage speech phrase
export function getRandomStagePhrase(stage: EvolutionStage): { text: string; emoji: string } {
  const list = STAGE_IDLE_PHRASES[stage] || STAGE_IDLE_PHRASES[EvolutionStage.BABY_CHICK];
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

// Calculate the active Chick Emotion details based on Hunger, Happiness, Health, Discipline, Sickness, Sleep, and Poop
export function getEmotionInfo(state: TamagotchiState): EmotionInfo {
  const hp = state.healthPercent ?? state.health ?? 100;

  // 1. Sickness (Highest priority)
  if (state.isSick) {
    return {
      emotion: 'sick',
      label: 'Enfermo / Resfriado 💉',
      icon: '🤒',
      description: 'Tiene fiebre o gripe. ¡Dale medicina urgentemente!',
      badgeBg: 'bg-rose-500/20',
      badgeBorder: 'border-rose-500/40',
      badgeText: 'text-rose-300 font-bold'
    };
  }

  // 2. Sleep / Lights off
  if (state.isSleeping || !state.lightsOn) {
    return {
      emotion: 'sleepy',
      label: 'Durmiendo Zzz 💤',
      icon: '💤',
      description: 'Descansando plácidamente en su nido calientito. (Debuffs reducidos)',
      badgeBg: 'bg-indigo-500/20',
      badgeBorder: 'border-indigo-500/40',
      badgeText: 'text-indigo-300 font-bold'
    };
  }

  // 3. Critical Health (< 30%)
  if (hp < 30) {
    return {
      emotion: 'sad',
      label: 'Débil / Sin Energía 💔',
      icon: '🥀',
      description: `Salud crítica (${hp}%). ¡Necesita calor, comida y cuidados inmediatos!`,
      badgeBg: 'bg-red-500/20',
      badgeBorder: 'border-red-500/50',
      badgeText: 'text-red-300 font-black animate-pulse'
    };
  }

  // 4. Extreme Hunger (0/4)
  if (state.hungryHearts === 0) {
    return {
      emotion: 'hungry',
      label: '¡Hambriento Extremo (0/4)! 🍙',
      icon: '🚨',
      description: 'Pancita vacía (0/4). ¡Aliméntalo de inmediato con un plato de arroz!',
      badgeBg: 'bg-red-600/20',
      badgeBorder: 'border-red-500/40',
      badgeText: 'text-red-400 font-bold'
    };
  }

  // 5. Hunger Alert (1/4)
  if (state.hungryHearts === 1) {
    return {
      emotion: 'hungry',
      label: 'Hambriento (1/4) 🍙',
      icon: '🍙',
      description: 'Solo le queda 1 corazón de comida (1/4). ¡Dale un plato de arroz!',
      badgeBg: 'bg-amber-500/20',
      badgeBorder: 'border-amber-500/40',
      badgeText: 'text-amber-300 font-bold'
    };
  }

  // 6. Poop discomfort (>= 2 poops)
  if (state.poopCount >= 2) {
    return {
      emotion: 'sad',
      label: 'Incómodo (Suciedad) 🦆',
      icon: '🤢',
      description: `Hay ${state.poopCount} popós acumuladas en el nido. ¡Usa el patito limpiador!`,
      badgeBg: 'bg-amber-700/20',
      badgeBorder: 'border-amber-600/40',
      badgeText: 'text-amber-200'
    };
  }

  // 7. Sadness / Low Happiness (0-1 hearts)
  if (state.happyHearts <= 1) {
    return {
      emotion: 'sad',
      label: 'Triste / Solito (1/4) 😢',
      icon: '😢',
      description: 'Corazones de felicidad bajos (1/4). ¡Dale mimos o jueguen minijuegos!',
      badgeBg: 'bg-blue-500/20',
      badgeBorder: 'border-blue-500/40',
      badgeText: 'text-blue-300'
    };
  }

  // 8. Low Discipline (Mischievous / Tantrum < 30%)
  if (state.discipline < 30) {
    return {
      emotion: 'playful',
      label: 'Travieso / Berrinche 😜',
      icon: '😜',
      description: 'Disciplina baja (<30%). Podría hacer travesuras. ¡Edúcalo con disciplina!',
      badgeBg: 'bg-orange-500/20',
      badgeBorder: 'border-orange-500/40',
      badgeText: 'text-orange-300'
    };
  }

  // 9. Zumba Energetic Mode
  if ((state.zumbaData?.todayMinutesCompleted || 0) >= 15) {
    return {
      emotion: 'dancing',
      label: 'Modo Zumba Fitness 🔥',
      icon: '💃',
      description: '¡Lleno de energía y vitalidad por su sesión de baile fitness!',
      badgeBg: 'bg-gradient-to-r from-amber-500/20 to-rose-500/20',
      badgeBorder: 'border-amber-400/50',
      badgeText: 'text-amber-300 font-black'
    };
  }

  // 10. High Discipline (75%+)
  if (state.discipline >= 75) {
    return {
      emotion: 'proud',
      label: 'Educado & Ejemplar 🎓',
      icon: '👑',
      description: 'Muy disciplinado y con excelente conducta.',
      badgeBg: 'bg-yellow-500/20',
      badgeBorder: 'border-yellow-400/40',
      badgeText: 'text-yellow-300 font-bold'
    };
  }

  // 11. Radiant & Fully Happy (4/4 Happy, 3-4 Hunger, Health > 80%)
  if (state.happyHearts === 4 && state.hungryHearts >= 3 && hp >= 80) {
    return {
      emotion: 'happy',
      label: 'Radiante & Feliz ✨',
      icon: '🌟',
      description: '¡Completamente sano, lleno de energía y cariño al máximo!',
      badgeBg: 'bg-emerald-500/20',
      badgeBorder: 'border-emerald-400/40',
      badgeText: 'text-emerald-300 font-black'
    };
  }

  // Default: Content
  return {
    emotion: 'happy',
    label: 'Alegre & En Paz 🐣',
    icon: '🐣',
    description: `Tranquilo en su nido (Comida: ${state.hungryHearts}/4, Felicidad: ${state.happyHearts}/4, Salud: ${hp}%).`,
    badgeBg: 'bg-lime-500/20',
    badgeBorder: 'border-lime-400/40',
    badgeText: 'text-lime-300'
  };
}

// Generates contextual dialogue matching exact state parameters
export function getContextualDialogue(state: TamagotchiState, isPetting = false): { text: string; emoji: string } {
  const hp = state.healthPercent ?? state.health ?? 100;
  const isEgg = state.stage === EvolutionStage.EGG_INCUBATING ||
                state.stage === EvolutionStage.EGG_WIGGLING ||
                state.stage === EvolutionStage.EGG_CRACKING ||
                state.stage === EvolutionStage.EGG_HATCHING;

  // Sleeping state
  if (state.isSleeping || !state.lightsOn) {
    return { text: 'Zzz... descansando plácidamente en el nido tibio... 💤', emoji: '💤' };
  }

  // Sick state
  if (state.isSick) {
    return isEgg
      ? { text: '¡El huevo se siente frío y con escalofríos! ¡Medicina 💉 por favor!', emoji: '🤒' }
      : { text: '¡Achu! Tengo fiebre y frío... ¿Me das medicina 💉?', emoji: '🤒' };
  }

  // Critical Health
  if (hp < 30) {
    return { text: `¡Me siento muy débil (Salud al ${hp}%)! Necesito calor y cuidados urgente ❤️`, emoji: '💔' };
  }

  // Hungry States (0/4 or 1/4)
  if (state.hungryHearts === 0) {
    return isEgg
      ? { text: '¡El nido no tiene nutrientes (0/4 comida)! Aliméntame para crecer 🍙', emoji: '🚨' }
      : { text: '¡Mi pancita está vacía (0/4 comida)! ¡Por favor dame un plato de arroz 🍙!', emoji: '🚨' };
  }

  if (state.hungryHearts === 1) {
    return isEgg
      ? { text: '¡Absorbiendo pocos nutrientes (1/4 comida)! Un plato de comida me vendría bien 🍙', emoji: '🍙' }
      : { text: '¡Tengo hambrita, solo me queda 1 corazón de comida (1/4)! ¿Me das arroz 🍚?', emoji: '🍙' };
  }

  // Poop discomfort
  if (state.poopCount >= 2) {
    return { text: `¡Puf! Hay ${state.poopCount} popós en el nido... ¡Pasa el patito limpiador 🦆!`, emoji: '🤢' };
  }

  // Low Happiness
  if (state.happyHearts <= 1) {
    return isPetting
      ? { text: '¡Gracias por tus mimos! Estaba muy triste y solito (1/4 felicidad) 💖', emoji: '🥰' }
      : { text: '¡Me siento solito (1/4 felicidad)! ¿Me haces mimos o jugamos un minijuego? 😢', emoji: '😢' };
  }

  // Low Discipline (Mischief)
  if (state.discipline < 30) {
    return isPetting
      ? { text: '¡Jeje, me encantan tus mimos pero hoy ando algo travieso! 😜', emoji: '😜' }
      : { text: '¡No quiero hacer caso, jeje! ¿O me vas a educar con disciplina? 😜', emoji: '😜' };
  }

  // High Discipline (Educated)
  if (state.discipline >= 75) {
    return isPetting
      ? { text: '¡Agradezco mucho tu cariño y educación! Soy un pollito ejemplar 🎓', emoji: '👑' }
      : { text: '¡Sigo todas tus enseñanzas con respeto y buena conducta! 🎓', emoji: '👑' };
  }

  // Petting action dialogues
  if (isPetting) {
    return getPettingPhrase(state.stage);
  }

  // Ambient stage dialogues
  return getRandomStagePhrase(state.stage);
}
