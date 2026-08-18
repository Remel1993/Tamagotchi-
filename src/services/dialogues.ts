import { EvolutionStage, TamagotchiState, ChickEmotion, PetSpecies } from '../types/tamagotchi';

export interface EmotionInfo {
  emotion: ChickEmotion;
  label: string;
  icon: string;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

// 💖 Petting Phrases for CHICK
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

// 🐶 Petting Phrases for DOG (No egg/hatching terms, active puppy from day 1)
export const DOG_PETTING_PHRASES: Record<EvolutionStage, Array<{ text: string; emoji: string }>> = {
  [EvolutionStage.EGG_INCUBATING]: [
    { text: '¡Guau! ¡Amo tus caricias en mi pancita!', emoji: '🐶' },
    { text: '¡Muevo mi colita de felicidad!', emoji: '💖' },
    { text: '¡Eres mi mejor amigo humano!', emoji: '🥰' },
    { text: '¡Guau guau! ¡Qué ricos mimitos en mis orejitas!', emoji: '🐾' }
  ],
  [EvolutionStage.EGG_WIGGLING]: [
    { text: '¡Doy saltitos de alegría cuando me acaricias!', emoji: '🎾' },
    { text: '¡Muevo la colita a mil por hora!', emoji: '🐕' },
    { text: '¡Guau! ¡Cosquillitas en mi lomito!', emoji: '✨' },
    { text: '¡Guau guau! ¡Te quiero mucho!', emoji: '❤️' }
  ],
  [EvolutionStage.EGG_CRACKING]: [
    { text: '¡Olfateo tus manos llenas de cariño!', emoji: '👃' },
    { text: '¡Te miro con mis ojitos tiernos y brillantes!', emoji: '👀' },
    { text: '¡Guau! ¡Qué feliz me hace estar a tu lado!', emoji: '💖' }
  ],
  [EvolutionStage.EGG_HATCHING]: [
    { text: '¡Listo para correr y jugar a tu lado!', emoji: '🏃' },
    { text: '¡Guau guau! ¡Lleno de energía y afecto!', emoji: '⚡' },
    { text: '¡Un lametón de agradecimiento!', emoji: '👅' }
  ],
  [EvolutionStage.BABY_CHICK]: [
    { text: '¡Mi collar deportivo brilla con tus mimos!', emoji: '✨' },
    { text: '¡Guau! ¡Listo para bailar Zumba juntos!', emoji: '💃' },
    { text: '¡Eres el mejor compañero de aventuras!', emoji: '🐕' }
  ],
  [EvolutionStage.ADULT_CHICK]: [
    { text: '¡Guau! ¡Somos un equipo campeón!', emoji: '👑' },
    { text: '¡Fidelidad incondicional para toda la vida!', emoji: '🏆' },
    { text: '¡Ladrido de triunfo y gratitud!', emoji: '🎉' }
  ],
  [EvolutionStage.DEAD]: [
    { text: 'Un ángel canino cuidándote desde el cielo...', emoji: '🕊️' }
  ]
};

// 💬 Stage-specific ambient phrases for CHICK
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

// 💬 Stage-specific ambient phrases for DOG
export const DOG_STAGE_IDLE_PHRASES: Record<EvolutionStage, Array<{ text: string; emoji: string }>> = {
  [EvolutionStage.EGG_INCUBATING]: [
    { text: '¡Guau! ¡Cachorrito recién adoptado y feliz!', emoji: '🐶' },
    { text: '¡Tengo apetito! ¿Me das croquetas o agüita?', emoji: '🥣' },
    { text: 'Moviendo la colita alegremente...', emoji: '🐾' },
    { text: 'Explorando mi nuevo hogar contigo...', emoji: '🏠' }
  ],
  [EvolutionStage.EGG_WIGGLING]: [
    { text: '¡Mírame cómo doy saltitos y muevo la cola!', emoji: '🐕' },
    { text: '¡Guau guau! ¿Jugamos a adivinar la dirección?', emoji: '🎮' },
    { text: '¡Creciendo sano, fuerte y muy contento!', emoji: '🌟' }
  ],
  [EvolutionStage.EGG_CRACKING]: [
    { text: '¡Olfateando cada rincón con curiosidad!', emoji: '👃' },
    { text: '¡Guau! ¡Mis patitas son cada vez más ágiles!', emoji: '⚡' },
    { text: '¡Siempre atento a tu llamado!', emoji: '🐾' }
  ],
  [EvolutionStage.EGG_HATCHING]: [
    { text: '¡Lleno de energía y listo para ejercitarnos!', emoji: '🏃' },
    { text: '¡Guau! ¡Qué gran amistad tenemos!', emoji: '💖' },
    { text: '¡Listo para aprender trucos nuevos!', emoji: '🎾' }
  ],
  [EvolutionStage.BABY_CHICK]: [
    { text: '¡Con mi collar deportivo listo para el Zumba!', emoji: '💃' },
    { text: '¡Guau! ¡Quiero ganarme mi galleta de huesito!', emoji: '🦴' },
    { text: '¡Fuerza, vitalidad y buena salud canina!', emoji: '✨' }
  ],
  [EvolutionStage.ADULT_CHICK]: [
    { text: '¡Guau! ¡Soy un perro adulto fuerte y campeón!', emoji: '👑' },
    { text: '¡Completamos los 7 días de entrenamiento!', emoji: '🎉' },
    { text: '¡Medalla de oro fitness y lealtad eterna!', emoji: '🏆' }
  ],
  [EvolutionStage.DEAD]: [
    { text: 'Descansa en paz en el paraíso de los perritos...', emoji: '🪦' }
  ]
};

// Returns a petting dialogue with emoji
export function getPettingPhrase(stage: EvolutionStage, species: PetSpecies = 'chick'): { text: string; emoji: string } {
  const dictionary = species === 'dog' ? DOG_PETTING_PHRASES : PETTING_PHRASES;
  const list = dictionary[stage] || dictionary[EvolutionStage.BABY_CHICK];
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

// Returns a random idle / stage speech phrase
export function getRandomStagePhrase(stage: EvolutionStage, species: PetSpecies = 'chick'): { text: string; emoji: string } {
  const dictionary = species === 'dog' ? DOG_STAGE_IDLE_PHRASES : STAGE_IDLE_PHRASES;
  const list = dictionary[stage] || dictionary[EvolutionStage.BABY_CHICK];
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

// 🦆 Thank you phrases when cleaning poop / passing duck
export function getCleaningThankYouPhrase(stateOrSpecies?: EvolutionStage | TamagotchiState | PetSpecies): { text: string; emoji: string } {
  const isDog = typeof stateOrSpecies === 'object' && stateOrSpecies !== null
    ? stateOrSpecies.species === 'dog'
    : stateOrSpecies === 'dog';

  if (isDog) {
    const dogPhrases = [
      { text: '¡Guau! ¡Gracias por limpiar mi casita!', emoji: '🧼' },
      { text: '¡Todo reluciente y fresquito, guau!', emoji: '✨' },
      { text: '¡Guau guau! ¡Qué rico suelo limpio!', emoji: '🐾' },
      { text: '¡Gracias por cuidarme tan bien!', emoji: '💖' }
    ];
    return dogPhrases[Math.floor(Math.random() * dogPhrases.length)];
  }

  const phrases = [
    { text: '¡Pío! ¡Gracias por limpiar mi nido!', emoji: '🦆' },
    { text: '¡Qué limpio y fresquito quedó todo!', emoji: '✨' },
    { text: '¡Pío pío! ¡Amo tener el nido reluciente!', emoji: '💖' },
    { text: '¡Gracias! ¡Qué lindo y limpio!', emoji: '🧼' }
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// 💉 Thank you phrases when giving medicine injection
export function getMedicineThankYouPhrase(stateOrSpecies?: EvolutionStage | TamagotchiState | PetSpecies): { text: string; emoji: string } {
  const isDog = typeof stateOrSpecies === 'object' && stateOrSpecies !== null
    ? stateOrSpecies.species === 'dog'
    : stateOrSpecies === 'dog';

  if (isDog) {
    const dogPhrases = [
      { text: '¡Guau! ¡Gracias por curarme con la medicina!', emoji: '💉' },
      { text: '¡Qué alivio! ¡Ya me siento con energía!', emoji: '✨' },
      { text: '¡Guau guau! ¡Se fue el malestar, gracias!', emoji: '🐾' },
      { text: '¡Un lametón de gratitud por curarme!', emoji: '🩹' }
    ];
    return dogPhrases[Math.floor(Math.random() * dogPhrases.length)];
  }

  const phrases = [
    { text: '¡Pío! ¡Gracias por curarme con la inyección!', emoji: '💉' },
    { text: '¡Qué alivio! ¡Se fue la fiebre, gracias!', emoji: '✨' },
    { text: '¡Pío pío! ¡Ya tengo energía otra vez!', emoji: '💖' },
    { text: '¡Gracias por cuidarme tan bien!', emoji: '🩹' }
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// 🍙 Thank you phrases when feeding meal (rice/comida or croquetas)
export function getFeedMealThankYouPhrase(stateOrSpecies?: EvolutionStage | TamagotchiState | PetSpecies): { text: string; emoji: string } {
  const isDog = typeof stateOrSpecies === 'object' && stateOrSpecies !== null
    ? stateOrSpecies.species === 'dog'
    : stateOrSpecies === 'dog';

  if (isDog) {
    const dogPhrases = [
      { text: '¡Ñam ñam! ¡Qué ricas croquetas, guau!', emoji: '🥣' },
      { text: '¡Guau! ¡Pancita llena y colita contenta!', emoji: '😋' },
      { text: '¡Delicioso plato de comida, gracias!', emoji: '🍖' },
      { text: '¡Guau guau! ¡Qué comida tan nutritiva!', emoji: '✨' }
    ];
    return dogPhrases[Math.floor(Math.random() * dogPhrases.length)];
  }

  const phrases = [
    { text: '¡Ñam ñam! ¡Qué rico arroz, gracias!', emoji: '🍙' },
    { text: '¡Pío! ¡Pancita llena y contenta!', emoji: '😋' },
    { text: '¡Delicioso! ¡Gracias por alimentarme!', emoji: '🍚' },
    { text: '¡Pío pío! ¡Qué comida tan rica!', emoji: '✨' }
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// 🍰 Thank you phrases when feeding snack (postre/dulce or huesito)
export function getFeedSnackThankYouPhrase(stateOrSpecies?: EvolutionStage | TamagotchiState | PetSpecies): { text: string; emoji: string } {
  const isDog = typeof stateOrSpecies === 'object' && stateOrSpecies !== null
    ? stateOrSpecies.species === 'dog'
    : stateOrSpecies === 'dog';

  if (isDog) {
    const dogPhrases = [
      { text: '¡Guau! ¡Amo mi galleta de huesito!', emoji: '🦴' },
      { text: '¡Ñam! ¡El mejor premio del mundo, guau!', emoji: '😋' },
      { text: '¡Guau guau! ¡Qué rico snack crujiente!', emoji: '✨' }
    ];
    return dogPhrases[Math.floor(Math.random() * dogPhrases.length)];
  }

  const phrases = [
    { text: '¡Mmm! ¡Qué delicioso postre, gracias!', emoji: '🍰' },
    { text: '¡Pío pío! ¡Qué dulce y sabroso!', emoji: '🧁' },
    { text: '¡Ñam! ¡Un dulcecito muy rico!', emoji: '🍬' }
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// 💬 Get contextual dialogue for petting or ambient speech
export function getContextualDialogue(state: TamagotchiState, isPetting: boolean = false): { text: string; emoji: string } {
  const species = state.species || 'chick';
  const stage = state.stage;

  if (isPetting) {
    return getPettingPhrase(stage, species);
  }

  // Sickness ambient dialogue
  if (state.isSick) {
    if (species === 'dog') {
      const sickDogPhrases = [
        { text: '¡Ayy... me duele mi pancita! 💉', emoji: '🤒' },
        { text: '¡Guau... necesito mi inyección de medicina!', emoji: '🩹' },
        { text: 'Tengo frío y fiebre... ¿Me das medicina?', emoji: '🥺' }
      ];
      return sickDogPhrases[Math.floor(Math.random() * sickDogPhrases.length)];
    } else {
      const sickChickPhrases = [
        { text: '¡Pío... me siento malito! 💉', emoji: '🤒' },
        { text: '¡Necesito medicina para recuperarme!', emoji: '🩹' },
        { text: 'Tengo fiebre y resfriado... pío', emoji: '🥺' }
      ];
      return sickChickPhrases[Math.floor(Math.random() * sickChickPhrases.length)];
    }
  }

  // Extreme Hunger dialogue
  if (state.hungryHearts <= 1) {
    if (species === 'dog') {
      const hungryDogPhrases = [
        { text: '¡Tengo mucha hambre! ¿Me das croquetas? 🥣', emoji: '🍖' },
        { text: '¡Guau guau! ¡Mi pancita hace ruidos de hambre!', emoji: '😋' },
        { text: '¡Por favor, un platito de comida nutritiva!', emoji: '🐾' }
      ];
      return hungryDogPhrases[Math.floor(Math.random() * hungryDogPhrases.length)];
    } else if (stage >= EvolutionStage.BABY_CHICK) {
      const hungryChickPhrases = [
        { text: '¡Pío pío! ¡Tengo mucha hambre!', emoji: '🍙' },
        { text: '¡Mi pancita está vacía! ¿Un platito de arroz?', emoji: '😋' }
      ];
      return hungryChickPhrases[Math.floor(Math.random() * hungryChickPhrases.length)];
    }
  }

  // Poop complaint
  if (state.poopCount >= 2) {
    if (species === 'dog') {
      return { text: '¡Guau! Hay suciedad en mi casita... ¿La limpias?', emoji: '💩' };
    } else {
      return { text: '¡Pío! Hay suciedad en el nido... ¿Usas el patito?', emoji: '💩' };
    }
  }

  // Default stage ambient phrase
  return getRandomStagePhrase(stage, species);
}

// Calculate the active Pet Emotion details based on Hunger, Happiness, Health, Discipline, Sickness, Sleep, Stage, and Species
export function getEmotionInfo(state: TamagotchiState): EmotionInfo {
  const hp = state.healthPercent ?? 100;
  const isDog = state.species === 'dog';
  const isEgg = !isDog && state.stage < EvolutionStage.BABY_CHICK;

  // 1. Sickness (Highest priority)
  if (state.isSick) {
    return {
      emotion: 'sick',
      label: isDog
        ? 'Perrito Enfermo 💉'
        : isEgg
        ? 'Huevo Frío / Destemplado 💉'
        : 'Enfermo / Resfriado 💉',
      icon: '🤒',
      description: isDog
        ? 'Tiene malestar o fiebre. ¡Dale su medicina para que vuelva a mover la colita!'
        : isEgg
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
      description: isDog
        ? 'Cachorro durmiendo plácidamente con su mantita (+Salud recuperada).'
        : 'Descansando plácidamente en el nido tibio. (Regenerando salud vital).',
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
      description: `Salud vital crítica (${hp}%). ¡Necesita alimento, descanso y atención urgente!`,
      badgeBg: 'bg-red-500/20',
      badgeBorder: 'border-red-500/50',
      badgeText: 'text-red-300 font-black animate-pulse'
    };
  }

  // --- EGG-SPECIFIC EMOTIONS (Only for chick species before stage 5) ---
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

  // --- ACTIVE PET EMOTIONS (Dog from day 1 or hatched chick) ---

  // 4. Extreme Hunger (0/4 Hearts)
  if (state.hungryHearts === 0) {
    return {
      emotion: 'hungry',
      label: isDog ? '¡Hambre Extrema (0/4)! 🍖' : '¡Hambre Extrema (0/4)! 🍙',
      icon: '🚨',
      description: isDog
        ? 'Pancita vacía (0/4). ¡Sírvele su plato de croquetas de inmediato!'
        : 'Pancita completamente vacía (0/4). ¡Aliméntalo con plato de arroz!',
      badgeBg: 'bg-red-600/20',
      badgeBorder: 'border-red-500/40',
      badgeText: 'text-red-400 font-black animate-pulse'
    };
  }

  // 5. Hunger Alert (1/4 Hearts)
  if (state.hungryHearts === 1) {
    return {
      emotion: 'hungry',
      label: isDog ? 'Hambriento (1/4) 🍖' : 'Hambriento (1/4) 🍙',
      icon: isDog ? '🍖' : '🍙',
      description: isDog
        ? 'Solo le queda 1 corazón de comida (1/4). ¡Dale un buen plato de croquetas!'
        : 'Solo le queda 1 corazón de comida (1/4). ¡Dale un plato de arroz!',
      badgeBg: 'bg-amber-500/20',
      badgeBorder: 'border-amber-500/40',
      badgeText: 'text-amber-300 font-bold'
    };
  }

  // 6. Sadness / Boredom (0 or 1 Happy Heart)
  if (state.happyHearts <= 1) {
    return {
      emotion: 'sad',
      label: 'Triste / Desanimado 😢',
      icon: '🥺',
      description: isDog
        ? 'Le faltan mimos y juego. ¡Hazle cosquillitas, juega a adivinar la dirección o dale un huesito!'
        : 'Le faltan mimos y juego. ¡Hazle caricias, juega o dale un postre!',
      badgeBg: 'bg-indigo-500/20',
      badgeBorder: 'border-indigo-500/40',
      badgeText: 'text-indigo-300 font-bold'
    };
  }

  // 7. Dirty House (Poop >= 2)
  if (state.poopCount >= 2) {
    return {
      emotion: 'sad',
      label: 'Molesto por Suciedad 💩',
      icon: '😷',
      description: 'Hay suciedad acumulada. ¡Usa el botón de Baño/Duck para limpiar la pantalla!',
      badgeBg: 'bg-amber-700/20',
      badgeBorder: 'border-amber-600/40',
      badgeText: 'text-amber-300 font-bold'
    };
  }

  // 8. Super Happy & Energetic (Full hearts & High Health)
  if (state.hungryHearts >= 4 && state.happyHearts >= 4 && hp >= 85) {
    return {
      emotion: 'excited',
      label: isDog ? '¡Cachorro Radiante! 🌟' : '¡Pollito Radiante! 🌟',
      icon: '💖',
      description: isDog
        ? '¡En su mejor momento! Pancita llena, colita en movimiento y máxima vitalidad.'
        : '¡En su mejor momento! Pancita llena, corazones al máximo y rebosante de salud.',
      badgeBg: 'bg-pink-500/20',
      badgeBorder: 'border-pink-500/40',
      badgeText: 'text-pink-300 font-black'
    };
  }

  // 9. Playful Mood (3-4 Happy Hearts)
  if (state.happyHearts >= 3) {
    return {
      emotion: 'playful',
      label: isDog ? 'Juguetón y Alegre 🐶' : 'Juguetón y Alegre 🐣',
      icon: isDog ? '🎾' : '✨',
      description: isDog
        ? 'Mueve la colita feliz, da saltitos y está listo para aprender trucos.'
        : 'Aletea feliz, da saltitos de alegría y le encanta que le hables.',
      badgeBg: 'bg-amber-500/20',
      badgeBorder: 'border-amber-400/40',
      badgeText: 'text-amber-300 font-bold'
    };
  }

  // 10. Default Content / Normal
  return {
    emotion: 'happy',
    label: isDog ? 'Perrito Satisfecho 😊' : 'Contento y Sereno 😊',
    icon: '🐾',
    description: `Estado general estable y saludable (Día ${state.ageDays}/7, Salud: ${hp}%).`,
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300 font-bold'
  };
}
