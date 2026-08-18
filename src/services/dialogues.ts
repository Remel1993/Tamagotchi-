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

// 💖 Phrases when petting or giving "mimos" (caricias / afecto)
export const PETTING_PHRASES: Record<EvolutionStage, Array<{ text: string; emoji: string }>> = {
  [EvolutionStage.EGG_INCUBATING]: [
    { text: '¡Siento tus mimos tibios en el cascarón!', emoji: '🥚' },
    { text: '¡Qué rico calorcito en mi nido!', emoji: '🔥' },
    { text: '¡Zzz... caricias calientitas!', emoji: '💤' },
    { text: '¡Me siento seguro y protegido!', emoji: '🪹' }
  ],
  [EvolutionStage.EGG_WIGGLING]: [
    { text: '¡Me tambaleo de alegría con tus mimos!', emoji: '🐣' },
    { text: '¡Siento muchas cosquillitas tibias!', emoji: '💖' },
    { text: '¡Wiggle wiggle! ¡Qué lindo cariño!', emoji: '⚡' },
    { text: '¡Pronto te daré un abrazo con alitas!', emoji: '🥰' }
  ],
  [EvolutionStage.EGG_CRACKING]: [
    { text: '¡Crack! ¡Tus mimos me dan fuerza!', emoji: '💥' },
    { text: '¡Picoteo con ganas para salir!', emoji: '🔨' },
    { text: '¡Ya casi rompo el cascarón!', emoji: '✨' }
  ],
  [EvolutionStage.EGG_HATCHING]: [
    { text: '¡Pío! ¡Ya asomo mis ojitos!', emoji: '👀' },
    { text: '¡Qué suaves son tus caricias!', emoji: '🥰' },
    { text: '¡Hola! ¡Gracias por cuidarme!', emoji: '🐣' }
  ],
  [EvolutionStage.BABY_CHICK]: [
    { text: '¡Pío pío! ¡Amo tus caricias suaves!', emoji: '🥰' },
    { text: '¡Pío! ¡Eres mi persona favorita!', emoji: '💖' },
    { text: '¡Prrr! ¡Qué ricos mimitos!', emoji: '🐣' },
    { text: '¡Pío pío! ¡Te quiero con el alma!', emoji: '❤️' },
    { text: '¡Cosquillitas en mis alitas!', emoji: '✨' }
  ],
  [EvolutionStage.ADULT_CHICK]: [
    { text: '¡Kikirikí! ¡Qué bien se siente!', emoji: '👑' },
    { text: '¡Gracias por cuidarme con amor!', emoji: '💖' },
    { text: '¡Abrazo con alas para mi amigo!', emoji: '🐓' },
    { text: '¡Eres el mejor cuidador!', emoji: '🏆' }
  ],
  [EvolutionStage.DEAD]: [
    { text: 'Un recuerdo de amor eterno...', emoji: '🕊️' }
  ]
};

// 💬 Stage-specific ambient phrases
export const STAGE_IDLE_PHRASES: Record<EvolutionStage, Array<{ text: string; emoji: string }>> = {
  [EvolutionStage.EGG_INCUBATING]: [
    { text: 'Zzz... absorbiendo calor en el nido', emoji: '🥚' },
    { text: 'El nido está tibio y tranquilo', emoji: '🔥' },
    { text: 'Creciendo día a día con cariño', emoji: '⏳' },
    { text: 'Latidos suaves en el cascarón...', emoji: '💓' }
  ],
  [EvolutionStage.EGG_WIGGLING]: [
    { text: '¡Mírame cómo me tambaleo!', emoji: '🐣' },
    { text: '¡Siento mucha vitalidad y fuerza!', emoji: '⚡' },
    { text: '¡Cada día estoy más cerca de nacer!', emoji: '🌟' }
  ],
  [EvolutionStage.EGG_CRACKING]: [
    { text: '¡Crack! ¡Ya tengo grietas profundas!', emoji: '💥' },
    { text: '¡Estoy picoteando desde adentro!', emoji: '🔨' },
    { text: '¡Pronto saldrá mi piquito!', emoji: '👀' }
  ],
  [EvolutionStage.EGG_HATCHING]: [
    { text: '¡Pío! ¡Ya asomo mi piquito!', emoji: '🐥' },
    { text: '¡Hola! ¡Qué emoción verte!', emoji: '👀' },
    { text: '¡Ya casi me libero del cascarón!', emoji: '🐣' }
  ],
  [EvolutionStage.BABY_CHICK]: [
    { text: '¡Pío pío! ¡Qué lindo es cantar!', emoji: '🐣' },
    { text: '¡Tengo apetito! ¿Me das arroz?', emoji: '🍙' },
    { text: '¡Vamos a bailar y jugar juntos!', emoji: '💃' },
    { text: '¡Pío! Recuerda limpiar si hay popó', emoji: '🦆' },
    { text: '¡Crezco feliz y brillante!', emoji: '💖' }
  ],
  [EvolutionStage.ADULT_CHICK]: [
    { text: '¡Kikirikí! ¡Soy un gallo fuerte!', emoji: '👑' },
    { text: '¡Completamos los 7 días juntos!', emoji: '🎉' },
    { text: '¡Plumas brillantes y llenas de salud!', emoji: '✨' }
  ],
  [EvolutionStage.DEAD]: [
    { text: 'Descansa en paz en el memorial...', emoji: '🪦' }
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

// 🦆 Thank you phrases when cleaning poop / passing duck
export function getCleaningThankYouPhrase(_stageOrState?: EvolutionStage | TamagotchiState): { text: string; emoji: string } {
  const phrases = [
    { text: '¡Pío! ¡Gracias por limpiar mi nido!', emoji: '🦆' },
    { text: '¡Qué limpio y fresquito quedó todo!', emoji: '✨' },
    { text: '¡Pío pío! ¡Amo tener el nido reluciente!', emoji: '💖' },
    { text: '¡Gracias! ¡Qué lindo y limpio!', emoji: '🧼' }
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// 💉 Thank you phrases when giving medicine injection
export function getMedicineThankYouPhrase(_stageOrState?: EvolutionStage | TamagotchiState): { text: string; emoji: string } {
  const phrases = [
    { text: '¡Pío! ¡Gracias por curarme con la inyección!', emoji: '💉' },
    { text: '¡Qué alivio! ¡Se fue la fiebre, gracias!', emoji: '✨' },
    { text: '¡Pío pío! ¡Ya tengo energía otra vez!', emoji: '💖' },
    { text: '¡Gracias por cuidarme tan bien!', emoji: '🩹' }
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// 🍙 Thank you phrases when feeding meal (rice/comida)
export function getFeedMealThankYouPhrase(_stageOrState?: EvolutionStage | TamagotchiState): { text: string; emoji: string } {
  const phrases = [
    { text: '¡Ñam ñam! ¡Qué rico arroz, gracias!', emoji: '🍙' },
    { text: '¡Pío! ¡Pancita llena y contenta!', emoji: '😋' },
    { text: '¡Delicioso! ¡Gracias por alimentarme!', emoji: '🍚' },
    { text: '¡Pío pío! ¡Qué comida tan rica!', emoji: '✨' }
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// 🍰 Thank you phrases when feeding snack (postre/dulce)
export function getFeedSnackThankYouPhrase(_stageOrState?: EvolutionStage | TamagotchiState): { text: string; emoji: string } {
  const phrases = [
    { text: '¡Mmm! ¡Qué delicioso postre, gracias!', emoji: '🍰' },
    { text: '¡Pío pío! ¡Qué dulce y sabroso!', emoji: '🧁' },
    { text: '¡Ñam! ¡Un dulcecito muy rico!', emoji: '🍬' }
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// Calculate the active Chick / Egg Emotion details based on Hunger, Happiness, Health, Discipline, Sickness, Sleep, and Stage
export function getEmotionInfo(state: TamagotchiState): EmotionInfo {
  const hp = state.healthPercent ?? 100;
  const isEgg = state.stage < EvolutionStage.BABY_CHICK;

  // 1. Sickness (Highest priority)
  if (state.isSick) {
    return {
      emotion: 'sick',
      label: isEgg ? 'Huevo Frío / Destemplado 💉' : 'Enfermo / Resfriado 💉',
      icon: '🤒',
      description: isEgg
        ? 'El huevo ha perdido calor vital y necesita medicina y temperatura estable.'
        : 'Tiene fiebre o gripe. ¡Dale medicina inmediatamente!',
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
      description: 'Descansando plácidamente en el nido tibio. (Debuffs de hambre reducidos y regenerando salud).',
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
      description: `Salud vital crítica (${hp}%). ¡Necesita calor, cuidados y atención inmediata!`,
      badgeBg: 'bg-red-500/20',
      badgeBorder: 'border-red-500/50',
      badgeText: 'text-red-300 font-black animate-pulse'
    };
  }

  // --- EGG-SPECIFIC EMOTIONS (Eggs do NOT ask for solid food) ---
  if (isEgg) {
    if (state.stage === EvolutionStage.EGG_CRACKING || state.stage === EvolutionStage.EGG_HATCHING) {
      return {
        emotion: 'excited',
        label: '¡Eclosionando Pronto! 🐣',
        icon: '💥',
        description: '¡Fisuras activas en la cáscara! El pollito está listo para nacer.',
        badgeBg: 'bg-yellow-500/20',
        badgeBorder: 'border-yellow-400/40',
        badgeText: 'text-yellow-300 font-black animate-pulse'
      };
    }

    if (state.stage === EvolutionStage.EGG_WIGGLING) {
      return {
        emotion: 'playful',
        label: 'Moviéndose de Alegría ⚡',
        icon: '🐣',
        description: 'El huevo se balancea con fuerza demostrando vitalidad y energía en su desarrollo.',
        badgeBg: 'bg-amber-500/20',
        badgeBorder: 'border-amber-400/40',
        badgeText: 'text-amber-300 font-bold'
      };
    }

    return {
      emotion: 'happy',
      label: 'Incubando Tibio 🥚',
      icon: '🥚',
      description: `Desarrollo embrionario saludable (Salud: ${hp}%, Día ${state.ageDays}/7).`,
      badgeBg: 'bg-emerald-500/20',
      badgeBorder: 'border-emerald-400/40',
      badgeText: 'text-emerald-300 font-bold'
    };
  }

  // --- HATCHED CHICK EMOTIONS (Calculated from Hunger, Happiness, Health, Discipline, Poop) ---

  // 4. Extreme Hunger (0/4 Hearts)
  if (state.hungryHearts === 0) {
    return {
      emotion: 'hungry',
      label: '¡Hambre Extrema (0/4)! 🍙',
      icon: '🚨',
      description: 'Pancita completamente vacía (0/4). ¡Aliméntalo de inmediato con plato de arroz!',
      badgeBg: 'bg-red-600/20',
      badgeBorder: 'border-red-500/40',
      badgeText: 'text-red-400 font-black animate-pulse'
    };
  }

  // 5. Hunger Alert (1/4 Hearts)
  if (state.hungryHearts === 1) {
    return {
      emotion: 'hungry',
      label: 'Hambriento (1/4) 🍙',
      icon: '🍙',
      description: 'Solo le queda 1 corazón de comida (1/4). ¡Dale un plato de arroz para saciarlo!',
      badgeBg: 'bg-amber-500/20',
      badgeBorder: 'border-amber-500/40',
      badgeText: 'text-amber-300 font-bold'
    };
  }

  // 6. Poop discomfort (>= 2 poops)
  if (state.poopCount >= 2) {
    return {
      emotion: 'sad',
      label: 'Incómodo por Suciedad 🦆',
      icon: '🤢',
      description: `Hay ${state.poopCount} popós acumuladas en el nido. ¡Límpialo con el patito!`,
      badgeBg: 'bg-amber-700/20',
      badgeBorder: 'border-amber-600/40',
      badgeText: 'text-amber-200 font-bold'
    };
  }

  // 7. Sadness / Low Happiness (0-1/4 Hearts)
  if (state.happyHearts <= 1) {
    return {
      emotion: 'sad',
      label: 'Triste & Solitario (1/4) 😢',
      icon: '😢',
      description: 'Corazones de felicidad bajos (1/4). ¡Hazle mimos, jueguen o dale un postrecito!',
      badgeBg: 'bg-blue-500/20',
      badgeBorder: 'border-blue-500/40',
      badgeText: 'text-blue-300 font-bold'
    };
  }

  // 8. Low Discipline (Mischievous / Tantrum < 30%)
  if (state.discipline < 30) {
    return {
      emotion: 'playful',
      label: 'Travieso / Rebelde 😜',
      icon: '😜',
      description: 'Disciplina baja (<30%). Podría desobedecer o pedir atención sin necesidad. ¡Edúcalo!',
      badgeBg: 'bg-orange-500/20',
      badgeBorder: 'border-orange-500/40',
      badgeText: 'text-orange-300 font-bold'
    };
  }

  // 9. High Discipline (75%+)
  if (state.discipline >= 75) {
    return {
      emotion: 'proud',
      label: 'Educado & Ejemplar 🎓',
      icon: '👑',
      description: 'Gran disciplina y respeto a las reglas del cuidador.',
      badgeBg: 'bg-yellow-500/20',
      badgeBorder: 'border-yellow-400/40',
      badgeText: 'text-yellow-300 font-bold'
    };
  }

  // 11. Radiant & Fully Happy (4/4 Happy, >= 3/4 Hunger, Health >= 80%)
  if (state.happyHearts === 4 && state.hungryHearts >= 3 && hp >= 80) {
    return {
      emotion: 'happy',
      label: 'Radiante & Feliz ✨',
      icon: '🌟',
      description: '¡Completamente sano, amado, con la pancita y el corazón llenos al 100%!',
      badgeBg: 'bg-emerald-500/20',
      badgeBorder: 'border-emerald-400/40',
      badgeText: 'text-emerald-300 font-black'
    };
  }

  // Default: Content & Peaceful
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
  const hp = state.healthPercent ?? 100;
  const isEgg = state.stage < EvolutionStage.BABY_CHICK;

  // 1. Sleeping state
  if (state.isSleeping || !state.lightsOn) {
    return isEgg
      ? { text: 'Zzz... incubando tibio... 💤', emoji: '💤' }
      : { text: 'Zzz... soñando bonito... 💤', emoji: '💤' };
  }

  // 2. Sick state
  if (state.isSick) {
    return isEgg
      ? { text: '¡El nido se siente frío! 🌡️', emoji: '🤒' }
      : { text: '¡Achu! Necesito medicina 💉', emoji: '🤒' };
  }

  // 3. Critical Health
  if (hp < 30) {
    return isEgg
      ? { text: `¡Salud baja (${hp}%)! Dame calor ❤️`, emoji: '💔' }
      : { text: `¡Débil (${hp}%)! Dame cuidados ❤️`, emoji: '💔' };
  }

  // --- EGG DIALOGUES (Never complains about solid food hunger) ---
  if (isEgg) {
    if (isPetting) {
      return getPettingPhrase(state.stage);
    }
    if (state.stage === EvolutionStage.EGG_CRACKING) {
      return { text: '¡Crack! ¡Ya casi salgo! 💥', emoji: '💥' };
    }
    if (state.stage === EvolutionStage.EGG_WIGGLING) {
      return { text: '¡Me muevo con fuerza! ⚡', emoji: '⚡' };
    }
    return getRandomStagePhrase(state.stage);
  }

  // --- HATCHED CHICK CONTEXTUAL DIALOGUES ---

  // 4. Extreme Hunger (0/4)
  if (state.hungryHearts === 0) {
    return { text: '¡Tengo mucha hambre! ¡Dame arroz! 🍙', emoji: '🚨' };
  }

  // 5. Hunger (1/4)
  if (state.hungryHearts === 1) {
    return { text: '¡Tengo hambrita! ¿Me das comida? 🍚', emoji: '🍙' };
  }

  // 6. Poop discomfort
  if (state.poopCount >= 2) {
    return { text: `¡Hay popó en el nido! Pasa el patito 🦆`, emoji: '🤢' };
  }

  // 7. Low Happiness (0-1/4)
  if (state.happyHearts <= 1) {
    return isPetting
      ? { text: '¡Gracias por tus mimos! Te quiero 💖', emoji: '🥰' }
      : { text: '¡Me siento solito! ¿Jugamos? 😢', emoji: '😢' };
  }

  // 8. Low Discipline (Mischief / Tantrum < 30%)
  if (state.discipline < 30) {
    return isPetting
      ? { text: '¡Jeje, ando travieso hoy! 😜', emoji: '😜' }
      : { text: '¡Hoy tengo ganas de travesuras! 😜', emoji: '😜' };
  }

  // 9. High Discipline (Educated >= 75%)
  if (state.discipline >= 75) {
    return isPetting
      ? { text: '¡Soy un pollito educado y bueno! 🎓', emoji: '👑' }
      : { text: '¡Obedezco todas tus enseñanzas! 🎓', emoji: '👑' };
  }

  // 10. Radiant (4/4 Hungry, 4/4 Happy, Health >= 80%)
  if (state.happyHearts === 4 && state.hungryHearts >= 3 && hp >= 80) {
    return isPetting
      ? { text: '¡Te quiero con todo mi corazón! ✨', emoji: '🌟' }
      : { text: '¡Me siento radiante y muy feliz! ✨', emoji: '🌟' };
  }

  // Petting action dialogues
  if (isPetting) {
    return getPettingPhrase(state.stage);
  }

  // Ambient stage dialogues
  return getRandomStagePhrase(state.stage);
}
