import React from 'react';
import { motion } from 'motion/react';
import { EvolutionStage, DisplayMode, ActiveScreen } from '../types/tamagotchi';

interface EggPetRendererProps {
  stage: EvolutionStage;
  displayMode?: DisplayMode;
  isSleeping?: boolean;
  lightsOn?: boolean;
  isSick?: boolean;
  poopCount?: number;
  hungryHearts?: number;
  happyHearts?: number;
  disciplinePercent?: number;
  activeScreen?: ActiveScreen;
  foodType?: 'meal' | 'snack';
  gameStep?: 'idle' | 'guess' | 'reveal';
  petDirection?: 'left' | 'right';
  playerDirection?: 'left' | 'right';
  gameResult?: 'win' | 'lose' | null;
  healthPercent?: number;
  onPetClick?: () => void;
  scale?: number;
}

export const EggPetRenderer: React.FC<EggPetRendererProps> = ({
  stage,
  displayMode = 'lcd-green',
  isSleeping = false,
  lightsOn = true,
  isSick = false,
  poopCount = 0,
  hungryHearts = 4,
  happyHearts = 4,
  disciplinePercent = 0,
  activeScreen = 'main',
  foodType = 'meal',
  petDirection = 'left',
  healthPercent = 100,
  onPetClick,
  scale = 1.0
}) => {
  const isPixel = displayMode === 'pixel-retro';
  const isLcd = displayMode === 'lcd-green';
  const isDarkSleep = isSleeping || !lightsOn;
  const isLowHealth = healthPercent <= 40;
  const isCriticalHealth = healthPercent <= 20;

  // Palette colors based on display mode & matching the uploaded reference image
  const eggColor = isLcd ? '#24482c' : isPixel ? '#fef3c7' : '#ffffff';
  const eggShadow = isLcd ? '#1b3b22' : isPixel ? '#f3e8b0' : '#f4ede4';
  const chickColor = isLcd ? '#1b3b22' : isPixel ? '#eab308' : '#fee66d';
  const chickShadow = isLcd ? '#142c19' : isPixel ? '#ca8a04' : '#fcd34d';
  const beakColor = isLcd ? '#112716' : isPixel ? '#c2410c' : '#fa7e1e';
  const beakInside = isLcd ? '#0b1b0f' : isPixel ? '#9a3412' : '#d95208';
  const strokeColor = isLcd ? '#0f2414' : isPixel ? '#292524' : '#3c2213';
  const darkDetail = isLcd ? '#0f2414' : isPixel ? '#1c1917' : '#2b1810';
  const blushColor = isLcd ? '#73986a' : isPixel ? '#fb7185' : '#fba882';
  const poopColor = isLcd ? '#112716' : isPixel ? '#92400e' : '#b45309';

  // --- STAGE: DEAD (Ghost Chick with Angel Halo and Tombstone) ---
  const renderDeadScreen = () => (
    <g id="dead-memorial">
      {/* Stone Tombstone with Cross */}
      <g transform="translate(40, 85)">
        <path d="M -10 75 Q 30 60 70 75 Z" fill={isLcd ? '#2d5a37' : '#cbd5e1'} />
        <path
          d="M 10 75 L 10 20 C 10 0 50 0 50 20 L 50 75 Z"
          fill={isLcd ? '#1b3b22' : isPixel ? '#94a3b8' : '#e2e8f0'}
          stroke={strokeColor}
          strokeWidth="4"
        />
        <line x1="30" y1="18" x2="30" y2="48" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
        <line x1="18" y1="30" x2="42" y2="30" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
        <text x="30" y="62" fontSize="9" fontWeight="900" textAnchor="middle" fill={strokeColor} fontFamily="monospace">
          R.I.P
        </text>
      </g>

      {/* Floating Angel Chick Ghost */}
      <motion.g
        animate={{ y: [-4, 6, -4], x: [-2, 2, -2] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        transform="translate(110, 50)"
      >
        {/* Golden Halo */}
        <ellipse
          cx="30"
          cy="8"
          rx="15"
          ry="4.5"
          fill="none"
          stroke={isLcd ? '#73986a' : '#f59e0b'}
          strokeWidth="3.5"
        />

        {/* Ghost Chick Head & Body Sheet */}
        <path
          d="M 12 38 C 12 16 48 16 48 38 C 48 58 43 66 38 60 C 33 54 30 66 26 60 C 22 54 17 66 12 58 Z"
          fill={isLcd ? '#2d5a37' : '#ffffff'}
          stroke={strokeColor}
          strokeWidth="3.5"
        />

        {/* Head Sprout Tuft */}
        <path
          d="M 27 18 C 24 10 30 8 30 14 C 31 8 37 10 33 18 Z"
          fill={isLcd ? '#2d5a37' : '#fee66d'}
          stroke={strokeColor}
          strokeWidth="2.5"
        />

        {/* Angel Wings */}
        <path d="M 12 36 C 2 28 4 46 14 42 Z" fill={isLcd ? '#73986a' : '#f1f5f9'} stroke={strokeColor} strokeWidth="2.5" />
        <path d="M 48 36 C 58 28 56 46 46 42 Z" fill={isLcd ? '#73986a' : '#f1f5f9'} stroke={strokeColor} strokeWidth="2.5" />

        {/* Ghost Eyes */}
        <circle cx="24" cy="32" r="3" fill={darkDetail} />
        <circle cx="36" cy="32" r="3" fill={darkDetail} />
        <polygon points="27,37 33,37 30,42" fill={beakColor} stroke={strokeColor} strokeWidth="1.5" />
      </motion.g>
    </g>
  );

  // --- STAGE 1: INCUBATING EGG (Smooth, cute, sleeping ivory egg with blush) ---
  const renderEggIncubating = () => {
    const isPlaying = activeScreen === 'game';
    const tiltAngle = isPlaying ? (petDirection === 'left' ? -16 : 16) : 0;

    return (
      <motion.g
        animate={
          isPlaying
            ? { rotate: [tiltAngle - 3, tiltAngle + 3, tiltAngle - 3], scale: [1.05, 1.1, 1.05] }
            : { scale: [1, 1.025, 1], y: [0, -3, 0] }
        }
        transition={{ duration: isPlaying ? 0.35 : 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '100px', originY: '140px' }}
      >
        {/* Plump Clean White Egg Body */}
        <path
          d="M 100 38 C 144 38 160 84 160 126 C 160 162 136 178 100 178 C 64 178 40 162 40 126 C 40 84 56 38 100 38 Z"
          fill={eggColor}
          stroke={strokeColor}
          strokeWidth={isPixel || isLcd ? 5 : 4}
        />

        {/* Egg Base Shadow */}
        {!isLcd && (
          <path
            d="M 52 148 C 65 168 82 176 100 176 C 118 176 135 168 148 148 C 135 162 118 168 100 168 C 82 168 65 162 52 148 Z"
            fill={eggShadow}
          />
        )}

        {/* Soft Sleepy / Playful Eyes */}
        <g id="egg-sleep-face">
          {isPlaying ? (
            <>
              <circle cx="82" cy="116" r="5" fill={darkDetail} />
              <circle cx="118" cy="116" r="5" fill={darkDetail} />
              {!isLcd && (
                <>
                  <circle cx="80" cy="114" r="1.8" fill="#fff" />
                  <circle cx="116" cy="114" r="1.8" fill="#fff" />
                </>
              )}
            </>
          ) : (
            <>
              <path
                d="M 78 116 Q 88 124 98 116"
                stroke={strokeColor}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 102 116 Q 112 124 122 116"
                stroke={strokeColor}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}
          {/* Tiny sweet beak/smile */}
          <polygon points="96,124 104,124 100,131" fill={beakColor} stroke={strokeColor} strokeWidth="1.5" />

          {/* Rosy blush cheeks */}
          {!isLcd && (
            <>
              <ellipse cx="72" cy="122" rx="7" ry="5" fill={blushColor} opacity={0.7} />
              <ellipse cx="128" cy="122" rx="7" ry="5" fill={blushColor} opacity={0.7} />
            </>
          )}
        </g>

        {/* Warm Sparks / Heat Embers in Game Mode */}
        {isPlaying && (
          <g>
            <circle cx={petDirection === 'left' ? 45 : 155} cy="95" r="4" fill={isLcd ? '#1b3b22' : '#f59e0b'} />
            <circle cx={petDirection === 'left' ? 35 : 165} cy="115" r="2.5" fill={isLcd ? '#1b3b22' : '#f97316'} />
            <circle cx={petDirection === 'left' ? 55 : 145} cy="75" r="3" fill={isLcd ? '#1b3b22' : '#fbbf24'} />
          </g>
        )}

        {/* Zzz animations if not playing */}
        {!isPlaying && (
          <>
            <motion.text
              x="136"
              y="66"
              fontSize="15"
              fontWeight="900"
              fill={strokeColor}
              animate={{ y: [66, 48, 66], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              z
            </motion.text>
            <motion.text
              x="150"
              y="48"
              fontSize="19"
              fontWeight="900"
              fill={strokeColor}
              animate={{ y: [48, 26, 48], opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            >
              Z
            </motion.text>
          </>
        )}
      </motion.g>
    );
  };

  // --- STAGE 2: WIGGLING EGG (Rocking playfully with happy eyes) ---
  const renderEggWiggling = () => (
    <motion.g
      animate={{
        rotate: [-12, 12, -12],
        y: [0, -8, 0],
        x: [-4, 4, -4]
      }}
      transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut' }}
      style={{ originX: '100px', originY: '170px' }}
    >
      <path
        d="M 100 38 C 144 38 160 84 160 126 C 160 162 136 178 100 178 C 64 178 40 162 40 126 C 40 84 56 38 100 38 Z"
        fill={eggColor}
        stroke={strokeColor}
        strokeWidth={isPixel || isLcd ? 5 : 4}
      />

      {/* Cute Winking / Happy Expression */}
      <g id="egg-wiggling-face">
        {/* Wink left */}
        <path
          d="M 74 114 L 86 121 L 74 128"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Wink right */}
        <path
          d="M 126 114 L 114 121 L 126 128"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Open cute beak */}
        <polygon points="94,120 106,120 100,132" fill={beakColor} stroke={strokeColor} strokeWidth="2" />
        <polygon points="97,124 103,124 100,129" fill={beakInside} />

        {/* Cheek blush */}
        {!isLcd && (
          <>
            <circle cx="68" cy="126" r="6" fill={blushColor} opacity={0.8} />
            <circle cx="132" cy="126" r="6" fill={blushColor} opacity={0.8} />
          </>
        )}
      </g>

      {/* Motion sparks */}
      <line x1="28" y1="130" x2="16" y2="136" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="172" y1="130" x2="184" y2="136" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
    </motion.g>
  );

  // --- STAGE 3: CRACKING EGG (Zig-zag fracture spreading across the egg) ---
  const renderEggCracking = () => (
    <motion.g
      animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }}
      transition={{ duration: 0.5, repeat: Infinity }}
      style={{ originX: '100px', originY: '170px' }}
    >
      <path
        d="M 100 38 C 144 38 160 84 160 126 C 160 162 136 178 100 178 C 64 178 40 162 40 126 C 40 84 56 38 100 38 Z"
        fill={eggColor}
        stroke={strokeColor}
        strokeWidth={isPixel || isLcd ? 5 : 4}
      />

      {/* Cute Surprised Eyes */}
      <circle cx="80" cy="112" r="6" fill={darkDetail} />
      <circle cx="120" cy="112" r="6" fill={darkDetail} />
      {!isLcd && (
        <>
          <circle cx="78" cy="109.5" r="2.2" fill="#ffffff" />
          <circle cx="118" cy="109.5" r="2.2" fill="#ffffff" />
          <circle cx="68" cy="122" r="6" fill={blushColor} opacity={0.7} />
          <circle cx="132" cy="122" r="6" fill={blushColor} opacity={0.7} />
        </>
      )}
      <ellipse cx="100" cy="124" rx="4" ry="5.5" fill={beakColor} stroke={strokeColor} strokeWidth="1.5" />

      {/* Characteristic Zig-Zag Eggshell Crack line */}
      <path
        d="M 40 126 L 62 112 L 84 130 L 100 108 L 122 132 L 140 114 L 160 126"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 100 108 L 96 82 L 108 60 L 100 38"
        stroke={strokeColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.g>
  );

  // --- STAGE 4: PEELING EGG (The top shell pops up, baby chick peeks out) ---
  const renderEggHatching = () => (
    <g id="egg-hatching-split">
      {/* Baby chick popping out */}
      <motion.g
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Chick Head */}
        <circle cx="100" cy="118" r="44" fill={chickColor} stroke={strokeColor} strokeWidth="4" />

        {/* Head Sprout / Double Tuft */}
        <path
          d="M 94 76 C 90 62 98 58 100 68 C 102 58 110 62 106 76 Z"
          fill={chickColor}
          stroke={strokeColor}
          strokeWidth="3.5"
        />

        {/* Eyes with specular highlights */}
        <circle cx="82" cy="112" r="7.5" fill={darkDetail} />
        <circle cx="118" cy="112" r="7.5" fill={darkDetail} />
        {!isLcd && (
          <>
            <circle cx="79.5" cy="109" r="2.8" fill="#ffffff" />
            <circle cx="115.5" cy="109" r="2.8" fill="#ffffff" />
            <circle cx="70" cy="124" r="7" fill={blushColor} opacity={0.7} />
            <circle cx="130" cy="124" r="7" fill={blushColor} opacity={0.7} />
          </>
        )}

        {/* Beak */}
        <polygon points="90,118 110,118 100,132" fill={beakColor} stroke={strokeColor} strokeWidth="2.5" />
        <polygon points="94,124 106,124 100,130" fill={beakInside} />
      </motion.g>

      {/* Bottom Cracked Shell */}
      <path
        d="M 40 126 L 62 112 L 84 130 L 100 108 L 122 132 L 140 114 L 160 126 C 160 162 136 178 100 178 C 64 178 40 162 40 126 Z"
        fill={eggColor}
        stroke={strokeColor}
        strokeWidth="4"
      />

      {/* Top Shell Half Popping Upward */}
      <motion.g
        animate={{ y: [-4, -18, -4], rotate: [-6, 8, -6] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '100px', originY: '60px' }}
      >
        <path
          d="M 100 38 C 144 38 156 68 154 96 L 138 82 L 120 104 L 100 80 L 82 102 L 62 84 L 46 96 C 44 68 56 38 100 38 Z"
          fill={eggColor}
          stroke={strokeColor}
          strokeWidth="4"
        />
      </motion.g>
    </g>
  );

  // --- UNIFIED AUTHENTIC FACE EXPRESSION RENDERER ---
  const renderPetFace = (lookX: number = 0) => {
    const isEating = activeScreen === 'animating_eating';
    const isDiscipline = activeScreen === 'animating_discipline';
    const isHungry = (hungryHearts ?? 4) <= 1;
    const isSad = (happyHearts ?? 4) <= 1 || isLowHealth;
    const hasPoopDiscomfort = poopCount > 0;

    // 1. SLEEPING FACE (Peaceful curves + floating Zzz)
    if (isDarkSleep) {
      return (
        <g id="face-sleeping" transform={`translate(${lookX}, 0)`}>
          <path d="M 76 96 Q 84 104 92 96" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 108 96 Q 116 104 124 96" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="94,106 106,106 100,113" fill={beakColor} stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
          <motion.text
            x="128"
            y="76"
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
            fill={isLcd ? '#2d5a37' : '#94a3b8'}
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            z
          </motion.text>
          <motion.text
            x="140"
            y="64"
            fontSize="16"
            fontWeight="bold"
            fontFamily="monospace"
            fill={isLcd ? '#2d5a37' : '#64748b'}
            animate={{ y: [0, -8, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: 0.4, ease: 'easeInOut' }}
          >
            Z
          </motion.text>
        </g>
      );
    }

    // 2. SICK FACE (Dizzy cross eyes, thermometer in beak, fever towel)
    if (isSick) {
      return (
        <g id="face-sick" transform={`translate(${lookX}, 0)`}>
          <line x1="74" y1="92" x2="88" y2="104" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="88" y1="92" x2="74" y2="104" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="112" y1="92" x2="126" y2="104" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="126" y1="92" x2="112" y2="104" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />

          {!isLcd && (
            <rect x="80" y="66" width="40" height="10" rx="4" fill="#67e8f9" stroke={strokeColor} strokeWidth="2" />
          )}

          <path d="M 90 115 Q 100 108 110 115" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="94,114 106,114 100,119" fill={beakColor} stroke={strokeColor} strokeWidth="1.5" />
          
          <g transform="translate(102, 110) rotate(-25)">
            <rect x="0" y="0" width="22" height="5" rx="2" fill={isLcd ? '#73986a' : '#ffffff'} stroke={strokeColor} strokeWidth="1.5" />
            <rect x="14" y="1" width="6" height="3" fill="#ef4444" />
            <circle cx="21" cy="2.5" r="3.5" fill="#ef4444" stroke={strokeColor} strokeWidth="1.2" />
          </g>
        </g>
      );
    }

    // 3. POOP DISCOMFORT FACE (Squinted disgusted side-eyes, wavy mouth, sweat drop)
    if (hasPoopDiscomfort) {
      return (
        <g id="face-poop-discomfort" transform={`translate(${lookX}, 0)`}>
          <path d="M 74 94 L 88 100" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="86" cy="100" r="4.5" fill={darkDetail} />
          
          <path d="M 112 100 L 126 94" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="122" cy="100" r="4.5" fill={darkDetail} />

          {!isLcd && (
            <motion.path
              d="M 132 80 C 132 76 138 72 138 72 C 138 72 144 76 144 80 C 144 84 141 86 138 86 C 135 86 132 84 132 80 Z"
              fill="#38bdf8"
              stroke={strokeColor}
              strokeWidth="1.5"
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}

          <path
            d="M 88 114 Q 94 108 100 114 Q 106 120 112 114"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <polygon points="96,112 104,112 100,117" fill={beakColor} />
        </g>
      );
    }

    // 4. HUNGRY FACE (Wide open begging beak, teary pleading eyes, tummy rumble)
    if (isHungry) {
      return (
        <g id="face-hungry" transform={`translate(${lookX}, 0)`}>
          <circle cx="82" cy="96" r="8.5" fill={darkDetail} />
          <circle cx="118" cy="96" r="8.5" fill={darkDetail} />
          {!isLcd && (
            <>
              <circle cx="80" cy="93" r="3.5" fill="#ffffff" />
              <circle cx="84" cy="98" r="1.5" fill="#ffffff" />
              <circle cx="116" cy="93" r="3.5" fill="#ffffff" />
              <circle cx="120" cy="98" r="1.5" fill="#ffffff" />
              <ellipse cx="66" cy="92" rx="2.5" ry="4" fill="#38bdf8" />
            </>
          )}

          <ellipse
            cx="100"
            cy="114"
            rx="12"
            ry="10"
            fill={beakColor}
            stroke={strokeColor}
            strokeWidth="3"
          />
          <ellipse cx="100" cy="114" rx="8" ry="6" fill={beakInside} />
          <circle cx="100" cy="116" r="3" fill="#f43f5e" />

          {!isLcd && (
            <motion.path
              d="M 90 142 Q 100 136 110 142"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </g>
      );
    }

    // 5. EATING ANIMATION FACE
    if (isEating) {
      return (
        <g id="face-eating" transform={`translate(${lookX}, 0)`}>
          <path d="M 76 96 Q 84 88 92 96" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 108 96 Q 116 88 124 96" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {!isLcd && (
            <>
              <ellipse cx="68" cy="106" rx="8" ry="6" fill={blushColor} opacity={0.8} />
              <ellipse cx="132" cy="106" rx="8" ry="6" fill={blushColor} opacity={0.8} />
            </>
          )}
          <motion.ellipse
            cx="100"
            cy="110"
            rx="11"
            ry="8"
            fill={beakColor}
            stroke={strokeColor}
            strokeWidth="2.5"
            animate={{ scaleY: [0.6, 1.2, 0.6] }}
            transition={{ duration: 0.25, repeat: Infinity }}
          />
          <circle cx="100" cy="110" r="4" fill={beakInside} />
        </g>
      );
    }

    // 6. DISCIPLINED / SCOLDED ANIMATION FACE
    if (isDiscipline) {
      return (
        <g id="face-disciplined" transform={`translate(${lookX}, 0)`}>
          <circle cx="82" cy="98" r="6" fill={darkDetail} />
          <circle cx="118" cy="98" r="6" fill={darkDetail} />
          <circle cx="80" cy="96" r="2" fill="#ffffff" />
          <circle cx="116" cy="96" r="2" fill="#ffffff" />
          <line x1="92" y1="112" x2="108" y2="112" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <polygon points="96,111 104,111 100,116" fill={beakColor} />
        </g>
      );
    }

    // 7. SAD / LOW HAPPINESS / LOW HEALTH FACE
    if (isSad) {
      return (
        <g id="face-sad" transform={`translate(${lookX}, 0)`}>
          <path d="M 74 92 L 90 98" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="82" cy="101" r="5.5" fill={darkDetail} />
          <path d="M 126 92 L 110 98" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="118" cy="101" r="5.5" fill={darkDetail} />

          {!isLcd && (
            <ellipse cx="73" cy="108" rx="2.5" ry="4" fill="#38bdf8" />
          )}

          <path
            d="M 90 116 Q 100 108 110 116"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <polygon points="95,114 105,114 100,118" fill={beakColor} />
        </g>
      );
    }

    // 8. DEFAULT: HAPPY & HEALTHY FACE
    return (
      <g id="face-happy-radiant" transform={`translate(${lookX}, 0)`}>
        <circle cx="82" cy="98" r="8" fill={darkDetail} />
        <circle cx="118" cy="98" r="8" fill={darkDetail} />
        {!isLcd && (
          <>
            <circle cx="79.5" cy="95" r="3" fill="#ffffff" />
            <circle cx="83.5" cy="100" r="1.2" fill="#ffffff" />
            <circle cx="115.5" cy="95" r="3" fill="#ffffff" />
            <circle cx="119.5" cy="100" r="1.2" fill="#ffffff" />
            <ellipse cx="68" cy="108" rx="8" ry="6" fill={blushColor} opacity={0.75} />
            <ellipse cx="132" cy="108" rx="8" ry="6" fill={blushColor} opacity={0.75} />
          </>
        )}
        <g id="chick-beak">
          <path
            d="M 88 102 Q 100 96 112 102 L 100 118 Z"
            fill={beakColor}
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 92 105 Q 100 102 108 105 L 100 114 Z" fill={beakInside} />
        </g>
      </g>
    );
  };

  // --- STAGE 5: BABY CHICK IN EGGSHELL (EXACT MATCH TO REFERENCE IMAGE!) ---
  const renderBabyChick = () => {
    const isEating = activeScreen === 'animating_eating';
    const isPlaying = activeScreen === 'game';
    const lookX = isPlaying ? (petDirection === 'left' ? -6 : 6) : 0;

    // If sleeping or lights are off, completely freeze movement
    const bodyAnimation = isDarkSleep
      ? { y: 0, rotate: 0 }
      : isEating
      ? { y: [0, -3, 0], rotate: 0 }
      : isLowHealth
      ? { y: [0, -2, 0], rotate: [-1, 1, -1] }
      : { y: [0, -5, 0], rotate: 0 };

    const bodyDuration = isDarkSleep ? 0 : isEating ? 0.25 : isLowHealth ? 2.0 : 1.2;

    return (
      <motion.g
        animate={bodyAnimation}
        transition={{ duration: bodyDuration, repeat: isDarkSleep ? 0 : Infinity, ease: 'easeInOut' }}
        style={{ originX: '100px', originY: '170px' }}
      >
        {/* 1. CHICK BODY & HEAD */}
        <g id="chick-character">
          {/* Head & Body Silhouette */}
          <path
            d="M 100 48 C 142 48 158 84 158 126 C 158 144 146 158 100 158 C 54 158 42 144 42 126 C 42 84 58 48 100 48 Z"
            fill={chickColor}
            stroke={strokeColor}
            strokeWidth="4"
          />

          {/* Head Top Feather Tuft (Iconic 2-lobed heart/sprout shape) */}
          <path
            d="M 94 50 C 90 32 99 28 100 38 C 102 28 111 32 106 50 Z"
            fill={chickColor}
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Outstretched Cute Chubby Wings (Gentle, slower flapping) */}
          <motion.path
            d="M 46 112 C 22 102 20 126 38 136 C 44 138 48 132 46 112 Z"
            fill={chickColor}
            stroke={strokeColor}
            strokeWidth="3.5"
            animate={{
              rotate: isDarkSleep
                ? 0
                : isLowHealth
                ? [12, 16, 12] // Drooped sad wings
                : [-6, 8, -6] // Slower relaxed flapping
            }}
            transition={{ duration: isDarkSleep ? 0 : 1.8, repeat: isDarkSleep ? 0 : Infinity, ease: 'easeInOut' }}
            style={{ originX: '46px', originY: '120px' }}
          />
          <motion.path
            d="M 154 112 C 178 102 180 126 162 136 C 156 138 152 132 154 112 Z"
            fill={chickColor}
            stroke={strokeColor}
            strokeWidth="3.5"
            animate={{
              rotate: isDarkSleep
                ? 0
                : isLowHealth
                ? [-12, -16, -12] // Drooped sad wings
                : [6, -8, 6] // Slower relaxed flapping
            }}
            transition={{ duration: isDarkSleep ? 0 : 1.8, repeat: isDarkSleep ? 0 : Infinity, ease: 'easeInOut' }}
            style={{ originX: '154px', originY: '120px' }}
          />

          {/* Soft Golden Spots on lower chest */}
          {!isLcd && (
            <g id="chick-chest-spots" opacity={0.6}>
              <circle cx="88" cy="136" r="4.5" fill={chickShadow} />
              <circle cx="108" cy="136" r="5" fill={chickShadow} />
            </g>
          )}

          {/* 2. CHICK FACE EXPRESSION */}
          {renderPetFace(lookX)}
        </g>

        {/* 3. CRACKED BOTTOM EGGSHELL */}
        <g id="bottom-eggshell">
          <path
            d="M 38 132 L 62 118 L 84 136 L 100 114 L 122 138 L 140 120 L 162 132 C 162 168 138 184 100 184 C 62 184 38 168 38 132 Z"
            fill={eggColor}
            stroke={strokeColor}
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {!isLcd && (
            <path
              d="M 48 152 C 60 172 78 180 100 180 C 122 180 140 172 152 152 C 140 168 122 174 100 174 C 78 174 60 168 48 152 Z"
              fill={eggShadow}
            />
          )}
        </g>
      </motion.g>
    );
  };

  // --- STAGE 6: ADULT CHICK (Fully grown cute chick standing happily) ---
  const renderAdultChick = () => {
    const isEating = activeScreen === 'animating_eating';
    const isPlaying = activeScreen === 'game';
    const lookX = isPlaying ? (petDirection === 'left' ? -6 : 6) : 0;

    // If sleeping or lights are off, completely freeze movement
    const bodyAnimation = isDarkSleep
      ? { y: 0, rotate: 0 }
      : isEating
      ? { y: [0, -3, 0], rotate: 0 }
      : isLowHealth
      ? { y: [0, -2, 0], rotate: [-1, 1, -1] }
      : { y: [0, -5, 0], rotate: [-1.5, 1.5, -1.5] };

    const bodyDuration = isDarkSleep ? 0 : isEating ? 0.25 : isLowHealth ? 2.2 : 1.4;

    return (
      <motion.g
        animate={bodyAnimation}
        transition={{ duration: bodyDuration, repeat: isDarkSleep ? 0 : Infinity, ease: 'easeInOut' }}
        style={{ originX: '100px', originY: '170px' }}
      >
        {/* Cute Orange Feet */}
        <path d="M 82 158 L 82 178 M 72 178 L 92 178" stroke={beakColor} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 118 158 L 118 178 M 108 178 L 128 178" stroke={beakColor} strokeWidth="4.5" strokeLinecap="round" />

        {/* Cute Tail Feather */}
        <path
          d="M 46 128 C 28 120 28 142 42 148 C 32 150 36 162 52 156 Z"
          fill={chickColor}
          stroke={strokeColor}
          strokeWidth="3.5"
        />

        {/* Chubby Round Body */}
        <path
          d="M 100 48 C 146 48 162 84 162 130 C 162 164 138 168 100 168 C 62 168 38 164 38 130 C 38 84 54 48 100 48 Z"
          fill={chickColor}
          stroke={strokeColor}
          strokeWidth="4"
        />

        {/* Head Feather Tuft */}
        <path
          d="M 94 50 C 90 30 99 26 100 36 C 102 26 111 30 106 50 Z"
          fill={chickColor}
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Chubby Flapping Wings (Slower and gentle) */}
        <motion.path
          d="M 44 112 C 18 100 16 128 36 138 C 42 140 46 132 44 112 Z"
          fill={chickColor}
          stroke={strokeColor}
          strokeWidth="3.5"
          animate={{
            rotate: isDarkSleep
              ? 0
              : isLowHealth
              ? [14, 18, 14]
              : [-8, 10, -8]
          }}
          transition={{ duration: isDarkSleep ? 0 : 1.8, repeat: isDarkSleep ? 0 : Infinity, ease: 'easeInOut' }}
          style={{ originX: '44px', originY: '118px' }}
        />
        <motion.path
          d="M 156 112 C 182 100 184 128 164 138 C 158 140 154 132 156 112 Z"
          fill={chickColor}
          stroke={strokeColor}
          strokeWidth="3.5"
          animate={{
            rotate: isDarkSleep
              ? 0
              : isLowHealth
              ? [-14, -18, -14]
              : [8, -10, 8]
          }}
          transition={{ duration: isDarkSleep ? 0 : 1.8, repeat: isDarkSleep ? 0 : Infinity, ease: 'easeInOut' }}
          style={{ originX: '156px', originY: '118px' }}
        />

        {/* Soft belly spots */}
        {!isLcd && (
          <g opacity={0.6}>
            <circle cx="86" cy="142" r="5" fill={chickShadow} />
            <circle cx="112" cy="142" r="5.5" fill={chickShadow} />
          </g>
        )}

        {/* Face Elements */}
        {renderPetFace(lookX)}
      </motion.g>
    );
  };

  // --- INTERACTIVE PROPS: POOP, SICKNESS, FEEDING, BATH, MEDICINE ---
  const renderPoopPiles = () => {
    if (poopCount <= 0) return null;
    const positions = [
      { x: 156, y: 154 },
      { x: 172, y: 140 },
      { x: 142, y: 160 },
      { x: 168, y: 162 }
    ];

    return (
      <g id="poop-layer">
        {positions.slice(0, poopCount).map((pos, idx) => (
          <motion.g
            key={idx}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: idx * 0.2 }}
            transform={`translate(${pos.x}, ${pos.y})`}
          >
            <path
              d="M 10 0 C 14 0 16 6 12 8 C 18 8 20 16 14 18 C 22 18 22 26 12 26 C 2 26 2 18 8 18 C 2 16 4 8 10 8 C 6 6 6 0 10 0 Z"
              fill={poopColor}
              stroke={strokeColor}
              strokeWidth="2"
            />
            <circle cx="9" cy="18" r="1.5" fill={isLcd ? '#9bbc0f' : '#ffffff'} />
            <circle cx="13" cy="18" r="1.5" fill={isLcd ? '#9bbc0f' : '#ffffff'} />
            <circle cx="9.5" cy="18" r="0.8" fill={darkDetail} />
            <circle cx="13.5" cy="18" r="0.8" fill={darkDetail} />
          </motion.g>
        ))}
      </g>
    );
  };

  const renderSicknessSkull = () => {
    if (!isSick) return null;
    return (
      <motion.g
        animate={{ y: [-4, 4, -4], rotate: [-5, 5, -5] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        transform="translate(24, 75)"
      >
        <circle cx="16" cy="16" r="14" fill={isLcd ? '#1b3b22' : '#f87171'} stroke={strokeColor} strokeWidth="2.5" />
        <rect x="10" y="24" width="12" height="7" rx="2" fill={isLcd ? '#1b3b22' : '#f87171'} stroke={strokeColor} strokeWidth="2" />
        <circle cx="11" cy="15" r="3.5" fill={isLcd ? '#9bbc0f' : '#0f172a'} />
        <circle cx="21" cy="15" r="3.5" fill={isLcd ? '#9bbc0f' : '#0f172a'} />
        <line x1="14" y1="25" x2="14" y2="30" stroke={darkDetail} strokeWidth="1.5" />
        <line x1="18" y1="25" x2="18" y2="30" stroke={darkDetail} strokeWidth="1.5" />
      </motion.g>
    );
  };

  const renderEatingAnimation = () => {
    if (activeScreen !== 'animating_eating') return null;
    return (
      <motion.g
        animate={{ x: [10, -5, 10], opacity: [1, 0.7, 1] }}
        transition={{ duration: 0.4, repeat: 3 }}
        transform="translate(135, 95)"
      >
        {foodType === 'meal' ? (
          <g>
            <path d="M 0 15 Q 15 30 30 15 Z" fill={isLcd ? '#1b3b22' : '#e2e8f0'} stroke={strokeColor} strokeWidth="2" />
            <path d="M 2 15 Q 15 2 28 15 Z" fill={isLcd ? '#73986a' : '#ffffff'} stroke={strokeColor} strokeWidth="1.5" />
            <text x="15" y="16" fontSize="9" fontWeight="bold" textAnchor="middle" fill={darkDetail}>
              🍚
            </text>
          </g>
        ) : (
          <g>
            <polygon points="0,20 25,20 30,5 5,5" fill={isLcd ? '#1b3b22' : '#f472b6'} stroke={strokeColor} strokeWidth="2" />
            <circle cx="15" cy="5" r="4" fill={isLcd ? '#73986a' : '#ef4444'} />
            <text x="15" y="18" fontSize="9" fontWeight="bold" textAnchor="middle" fill={darkDetail}>
              🍰
            </text>
          </g>
        )}
      </motion.g>
    );
  };

  const renderBathAnimation = () => {
    if (activeScreen !== 'animating_bath') return null;
    return (
      <motion.g
        initial={{ x: 210 }}
        animate={{ x: -60 }}
        transition={{ duration: 1.5, ease: 'linear' }}
        transform="translate(0, 110)"
      >
        <ellipse cx="30" cy="35" rx="35" ry="12" fill={isLcd ? '#73986a' : '#38bdf8'} opacity={0.7} />
        <circle cx="30" cy="22" r="14" fill={isLcd ? '#1b3b22' : '#facc15'} stroke={strokeColor} strokeWidth="2" />
        <circle cx="40" cy="14" r="9" fill={isLcd ? '#1b3b22' : '#facc15'} stroke={strokeColor} strokeWidth="2" />
        <polygon points="48,14 58,16 48,20" fill={beakColor} stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="43" cy="12" r="1.8" fill={darkDetail} />
        <circle cx="10" cy="15" r="4" fill={isLcd ? '#73986a' : '#bae6fd'} />
        <circle cx="2" cy="25" r="3" fill={isLcd ? '#73986a' : '#bae6fd'} />
      </motion.g>
    );
  };

  const renderMedicineAnimation = () => {
    if (activeScreen !== 'animating_medicine') return null;
    return (
      <motion.g
        initial={{ x: 180, y: 50, rotate: -35 }}
        animate={{ x: 120, y: 90, rotate: -35 }}
        transition={{ duration: 0.6, repeat: 2, repeatType: 'reverse' }}
      >
        <rect x="0" y="0" width="36" height="14" rx="2" fill={isLcd ? '#2d5a37' : '#ffffff'} stroke={strokeColor} strokeWidth="2" />
        <rect x="4" y="2" width="16" height="10" fill={isLcd ? '#1b3b22' : '#ec4899'} />
        <line x1="-12" y1="7" x2="0" y2="7" stroke={darkDetail} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="7" x2="48" y2="7" stroke={darkDetail} strokeWidth="3" />
        <line x1="48" y1="0" x2="48" y2="14" stroke={darkDetail} strokeWidth="3" strokeLinecap="round" />
      </motion.g>
    );
  };

  const renderSleepDarkness = () => {
    if (!isSleeping || lightsOn) return null;
    return (
      <rect
        x="0"
        y="0"
        width="200"
        height="200"
        fill={isLcd ? '#1b3b22' : '#090d16'}
        opacity={isLcd ? 0.75 : 0.88}
        className="pointer-events-none"
      />
    );
  };

  return (
    <div
      className="relative flex items-center justify-center select-none cursor-pointer transition-transform active:scale-95"
      onClick={onPetClick}
      title="Tamagotchi Pet LCD"
      style={{ transform: `scale(${scale})` }}
    >
      <svg
        viewBox="0 0 200 200"
        className={`w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 max-w-full max-h-full ${isPixel ? 'rendering-pixelated' : ''}`}
        style={{
          imageRendering: isPixel ? 'pixelated' : 'auto'
        }}
      >
        {/* Soft Warm Ground Shadow matching reference image */}
        <ellipse
          cx="100"
          cy={stage < EvolutionStage.BABY_CHICK ? '172' : '186'}
          rx={stage < EvolutionStage.BABY_CHICK ? '42' : '52'}
          ry={stage < EvolutionStage.BABY_CHICK ? '8' : '10'}
          fill={isLcd ? '#73986a' : isPixel ? '#44403c' : '#f3e8de'}
          opacity={isLcd ? 0.35 : 0.9}
        />

        {/* Main Character / Stage Render */}
        {stage === EvolutionStage.DEAD ? (
          renderDeadScreen()
        ) : (
          <>
            {stage === EvolutionStage.EGG_INCUBATING && (
              <g transform="translate(100, 115) scale(0.8) translate(-100, -115)">
                {renderEggIncubating()}
              </g>
            )}
            {stage === EvolutionStage.EGG_WIGGLING && (
              <g transform="translate(100, 115) scale(0.8) translate(-100, -115)">
                {renderEggWiggling()}
              </g>
            )}
            {stage === EvolutionStage.EGG_CRACKING && (
              <g transform="translate(100, 115) scale(0.8) translate(-100, -115)">
                {renderEggCracking()}
              </g>
            )}
            {stage === EvolutionStage.EGG_HATCHING && (
              <g transform="translate(100, 115) scale(0.8) translate(-100, -115)">
                {renderEggHatching()}
              </g>
            )}
            {stage === EvolutionStage.BABY_CHICK && renderBabyChick()}
            {stage === EvolutionStage.ADULT_CHICK && renderAdultChick()}
          </>
        )}

        {/* Interactive Layers */}
        {stage !== EvolutionStage.DEAD && (
          <>
            {renderPoopPiles()}
            {renderSicknessSkull()}
            {renderEatingAnimation()}
            {renderBathAnimation()}
            {renderMedicineAnimation()}
            {renderSleepDarkness()}
          </>
        )}
      </svg>
    </div>
  );
};
