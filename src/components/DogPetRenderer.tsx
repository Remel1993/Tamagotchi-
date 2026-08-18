import React from 'react';
import { motion } from 'motion/react';
import { EvolutionStage, DisplayMode, ActiveScreen } from '../types/tamagotchi';

interface DogPetRendererProps {
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
  mood?: string;
  isMiniGameMultiplePets?: boolean;
}

export const DogPetRenderer: React.FC<DogPetRendererProps> = ({
  stage,
  displayMode = 'lcd-green',
  isSleeping = false,
  lightsOn = true,
  isSick = false,
  poopCount = 0,
  happyHearts = 4,
  activeScreen = 'main',
  foodType = 'meal',
  healthPercent = 100,
  onPetClick,
  scale = 1.0,
  mood,
  isMiniGameMultiplePets = false
}) => {
  const isPixel = displayMode === 'pixel-retro';
  const isLcd = displayMode === 'lcd-green';
  const isDarkSleep = isSleeping || !lightsOn;

  // Exact Color Palette based on reference image
  // Bold dark chocolate contour
  const strokeColor = isLcd ? '#0f2414' : isPixel ? '#292524' : '#2d1414';
  const darkDetail = isLcd ? '#0f2414' : isPixel ? '#1c1917' : '#2d1414';
  
  // Golden honey / caramel fur colors from reference
  const furBase = isLcd ? '#1b3b22' : isPixel ? '#d97706' : '#e5a265';
  const furHighlight = isLcd ? '#2d5a37' : isPixel ? '#f59e0b' : '#f2ba7e';
  const furShadow = isLcd ? '#142c19' : isPixel ? '#b45309' : '#ca8342';
  
  // Cream muzzle & belly patch
  const creamFur = isLcd ? '#73986a' : isPixel ? '#fef3c7' : '#fff0dd';
  const creamFurLight = isLcd ? '#85ab7a' : isPixel ? '#ffffff' : '#fff7ed';
  
  // Details
  const noseColor = isLcd ? '#0f2414' : isPixel ? '#1c1917' : '#2d1414';
  const tongueColor = isLcd ? '#73986a' : isPixel ? '#f43f5e' : '#f472b6';
  const blushColor = isLcd ? '#73986a' : isPixel ? '#fb7185' : '#fca5a5';
  const collarColor = isLcd ? '#142c19' : isPixel ? '#0284c7' : '#2dd4bf';
  const medalColor = isLcd ? '#73986a' : isPixel ? '#eab308' : '#fbbf24';
  const groundShadow = isLcd ? '#0f2414' : isPixel ? '#1c1917' : '#2d1414';
  const poopColor = isLcd ? '#112716' : isPixel ? '#92400e' : '#b45309';

  // --- STAGE 7: MEMORIAL (Angel Dog with Halo and Cloud) ---
  const renderDeadScreen = () => (
    <g id="dog-memorial-scene">
      {/* Stone Memorial Tombstone */}
      <g transform="translate(30, 90)">
        <path
          d="M 10 70 L 10 24 C 10 6 50 6 50 24 L 50 70 Z"
          fill={isLcd ? '#1b3b22' : isPixel ? '#94a3b8' : '#e2e8f0'}
          stroke={strokeColor}
          strokeWidth="4"
        />
        <line x1="30" y1="18" x2="30" y2="44" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="18" y1="28" x2="42" y2="28" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
        <text x="30" y="58" fontSize="8.5" fontWeight="900" textAnchor="middle" fill={strokeColor} fontFamily="monospace">
          R.I.P
        </text>
      </g>

      {/* Floating Angel Dog Ghost */}
      <motion.g
        animate={{ y: [-4, 5, -4], x: [-1, 2, -1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        transform="translate(100, 48)"
      >
        {/* Golden Halo */}
        <ellipse cx="32" cy="6" rx="16" ry="4.5" fill="none" stroke={medalColor} strokeWidth="3.5" />

        {/* Floating Ghost Body with Floppy Ears */}
        <path
          d="M 12 36 C 12 16 52 16 52 36 C 52 56 46 64 40 58 C 34 52 30 64 26 58 C 22 52 16 64 12 56 Z"
          fill={isLcd ? '#2d5a37' : '#ffffff'}
          stroke={strokeColor}
          strokeWidth="3.5"
        />

        {/* Floppy Ears */}
        <path d="M 14 24 C 2 28 4 46 16 40 Z" fill={isLcd ? '#142c19' : furBase} stroke={strokeColor} strokeWidth="2.5" />
        <path d="M 50 24 C 62 28 60 46 48 40 Z" fill={isLcd ? '#142c19' : furBase} stroke={strokeColor} strokeWidth="2.5" />

        {/* Little Angel Wings */}
        <path d="M 10 38 C 0 32 2 48 12 44 Z" fill={isLcd ? '#73986a' : '#f1f5f9'} stroke={strokeColor} strokeWidth="2" />
        <path d="M 54 38 C 64 32 62 48 52 44 Z" fill={isLcd ? '#73986a' : '#f1f5f9'} stroke={strokeColor} strokeWidth="2" />

        {/* Happy closed eyes (⌒ ⌒) */}
        <path d="M 22 30 Q 26 26 30 30" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        <path d="M 34 30 Q 38 26 42 30" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="32" cy="35" rx="3.5" ry="2.5" fill={noseColor} />
      </motion.g>
    </g>
  );

  // --- CORE REFERENCE DOG SVG VECTOR COMPONENT ---
  // Matches the provided reference image with high fidelity:
  // - Rounded head with warm caramel fur
  // - Large curved floppy ears
  // - Cream muzzle mask with inverted triangle nose
  // - Happy curved smile (⌒ ⌒) or round shiny open eyes
  // - Pink tongue
  // - Turquoise neck collar
  // - Chubby sitting body with 2 front paws & 2 round hind legs with paw pads
  // - Cute tail curled up on right
  // - Bold dark chocolate outline & solid ground shadow
  const renderReferenceDog = (variant: 'puppy' | 'playful' | 'curious' | 'adventurous' | 'sporty' | 'champion') => {
    const isPlaying = activeScreen === 'game';
    const isDancing = activeScreen === 'game' || happyHearts >= 4;
    // When playing in game with multiple pets, scale down diminutively
    const miniScale = isPlaying && isMiniGameMultiplePets ? 0.65 : 1;

    return (
      <g transform={`translate(100, 95) scale(${miniScale * 0.95})`}>
        <motion.g
          animate={
            isPlaying
              ? { rotate: [-5, 5, -5], scale: [1, 1.05, 1], y: [0, -6, 0] }
              : isDancing
              ? { y: [0, -7, 0], scale: [1, 1.04, 1] }
              : variant === 'playful' || variant === 'adventurous'
              ? { y: [0, -5, 0], scale: [1, 1.03, 1] }
              : { y: [0, -3, 0] }
          }
          transition={{
            duration: isPlaying ? 0.35 : isDancing ? 0.6 : 0.8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
        {/* Ground Dark Shadow (matching reference image base) */}
        <ellipse
          cx="0"
          cy="74"
          rx="50"
          ry="11"
          fill={groundShadow}
          opacity={isLcd ? 0.4 : 0.95}
        />

        {/* --- BODY & HIND LEGS & TAIL --- */}
        <g transform="translate(0, 5)">
          {/* Curled Upward Happy Tail on Right (matching reference image) */}
          <motion.g
            animate={{
              rotate: variant === 'champion' || variant === 'sporty' ? [-20, 20, -20] : [-12, 12, -12]
            }}
            transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '24px', originY: '48px' }}
          >
            {/* Tail Outer Outline & Fur Fill */}
            <path
              d="M 24 48 C 34 48 46 44 44 24 C 40 14 32 22 32 28 C 32 34 28 42 22 46 Z"
              fill={furBase}
              stroke={strokeColor}
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Tail inner warm highlight */}
            {!isLcd && (
              <path
                d="M 28 44 C 36 42 41 36 40 26"
                fill="none"
                stroke={furHighlight}
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </motion.g>

          {/* Chubby Sitting Dog Torso */}
          <path
            d="M -26 22 C -32 38 -30 58 -20 64 C -10 68 10 68 20 64 C 30 58 32 38 26 22 Z"
            fill={furBase}
            stroke={strokeColor}
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Torso Shadow / Depth */}
          {!isLcd && (
            <path
              d="M -20 30 C -26 44 -24 58 -16 64 C -4 67 14 67 22 62 C 28 56 28 42 24 30 Z"
              fill={furShadow}
              opacity={0.3}
            />
          )}

          {/* Left Hind Leg & Round Paw at side */}
          <g>
            <ellipse
              cx="-28"
              cy="50"
              rx="16"
              ry="17"
              fill={furBase}
              stroke={strokeColor}
              strokeWidth="5"
            />
            {/* Left Hind Paw Pad (cream oval matching reference) */}
            <ellipse
              cx="-25"
              cy="54"
              rx="9"
              ry="11"
              fill={creamFur}
              stroke={strokeColor}
              strokeWidth="4"
            />
          </g>

          {/* Right Hind Leg & Round Paw at side (matching reference image) */}
          <g>
            <ellipse
              cx="28"
              cy="50"
              rx="16"
              ry="17"
              fill={furBase}
              stroke={strokeColor}
              strokeWidth="5"
            />
            {/* Right Hind Paw Pad (cream oval matching reference) */}
            <ellipse
              cx="25"
              cy="54"
              rx="9"
              ry="11"
              fill={creamFur}
              stroke={strokeColor}
              strokeWidth="4"
            />
          </g>

          {/* Two Front Paws sitting neatly in center */}
          <g>
            {/* Left Front Leg */}
            <path
              d="M -15 24 L -15 58 C -15 64 -5 66 -1 64 L -1 26 Z"
              fill={furBase}
              stroke={strokeColor}
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Left Front Paw Foot */}
            <ellipse
              cx="-8"
              cy="62"
              rx="7.5"
              ry="5.5"
              fill={creamFur}
              stroke={strokeColor}
              strokeWidth="4.5"
            />

            {/* Right Front Leg */}
            <path
              d="M 1 26 L 1 64 C 5 66 15 64 15 58 L 15 24 Z"
              fill={furBase}
              stroke={strokeColor}
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Right Front Paw Foot */}
            <ellipse
              cx="8"
              cy="62"
              rx="7.5"
              ry="5.5"
              fill={creamFur}
              stroke={strokeColor}
              strokeWidth="4.5"
            />
          </g>

          {/* Cute Neck Collar (Turquoise Cyan matching reference) */}
          <g transform="translate(0, 15)">
            <path
              d="M -24 3 C -10 12 10 12 24 3 C 26 8 24 12 18 14 C 4 18 -4 18 -18 14 C -24 12 -26 8 -24 3 Z"
              fill={variant === 'sporty' ? '#ef4444' : collarColor}
              stroke={strokeColor}
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Collar Highlight */}
            {!isLcd && (
              <path
                d="M -18 6 C -8 11 8 11 18 6"
                fill="none"
                stroke="#a5f3fc"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}

            {/* Golden Star / Bone Pendant for Champion & Sporty */}
            {(variant === 'sporty' || variant === 'champion') && (
              <g transform="translate(0, 14)">
                <circle cx="0" cy="0" r="5.5" fill={medalColor} stroke={strokeColor} strokeWidth="2" />
                <text x="0" y="3" fontSize="6.5" fontWeight="900" textAnchor="middle" fill="#78350f">
                  {variant === 'champion' ? '★' : '🦴'}
                </text>
              </g>
            )}
          </g>
        </g>

        {/* --- HEAD & EARS & EXPRESSION (Exact match to reference image) --- */}
        <motion.g
          animate={
            isPlaying
              ? { rotate: [-6, 6, -6] }
              : variant === 'playful'
              ? { rotate: [-4, 4, -4] }
              : { rotate: [-2, 2, -2] }
          }
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          transform="translate(0, -14)"
        >
          {/* LEFT FLOPPY EAR (Sweeping curved teardrop hanging down on left) */}
          <motion.g
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '-38px', originY: '-14px' }}
          >
            <path
              d="M -34 -14 C -58 -10 -68 18 -58 40 C -50 56 -30 52 -28 32 C -26 18 -30 0 -34 -14 Z"
              fill={furBase}
              stroke={strokeColor}
              strokeWidth="5.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Left Ear Inner Warm Shading */}
            {!isLcd && (
              <path
                d="M -46 -2 C -58 14 -52 40 -38 34"
                fill="none"
                stroke={furShadow}
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}
          </motion.g>

          {/* RIGHT FLOPPY EAR (Sweeping curved teardrop hanging down on right) */}
          <motion.g
            animate={{ rotate: [4, -4, 4] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '38px', originY: '-14px' }}
          >
            <path
              d="M 34 -14 C 58 -10 68 18 58 40 C 50 56 30 52 28 32 C 26 18 30 0 34 -14 Z"
              fill={furBase}
              stroke={strokeColor}
              strokeWidth="5.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Right Ear Inner Warm Shading */}
            {!isLcd && (
              <path
                d="M 46 -2 C 58 14 52 40 38 34"
                fill="none"
                stroke={furShadow}
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}
          </motion.g>

          {/* BIG ROUND CUTE HEAD */}
          <ellipse
            cx="0"
            cy="0"
            rx="46"
            ry="42"
            fill={furBase}
            stroke={strokeColor}
            strokeWidth="5.5"
          />

          {/* Head Top Golden Highlight */}
          {!isLcd && (
            <path
              d="M -24 -24 C -10 -34 10 -34 24 -24"
              fill="none"
              stroke={furHighlight}
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}

          {/* CREAM MUZZLE / MOUTH MASK (covering bottom half of face matching reference) */}
          <path
            d="M -42 2 C -34 -6 -16 6 0 6 C 16 6 34 -6 42 2 C 45 16 38 36 0 38 C -38 36 -45 16 -42 2 Z"
            fill={creamFur}
            stroke={strokeColor}
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* INVERTED TRIANGLE / ROUNDED DARK CHOCOLATE NOSE */}
          <path
            d="M -8 11 C -8 7 8 7 8 11 C 8 16 2 19 0 19 C -2 19 -8 16 -8 11 Z"
            fill={noseColor}
            stroke={strokeColor}
            strokeWidth="2"
          />
          {/* Tiny nose shine */}
          {!isLcd && (
            <ellipse cx="-2.5" cy="10" rx="1.8" ry="1" fill="#ffffff" opacity={0.75} />
          )}

          {/* MOUTH & PINK TONGUE (Open Happy Smile matching reference) */}
          {isDarkSleep ? (
            /* Sleeping quiet muzzle */
            <path
              d="M -4 23 Q 0 26 4 23"
              fill="none"
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ) : isSick ? (
            /* Sick sad mouth */
            <path
              d="M -6 25 Q 0 20 6 25"
              fill="none"
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ) : (
            /* Happy Open Smile with Pink Tongue */
            <g transform="translate(0, 18)">
              {/* Smile contour & Open Tongue Pocket */}
              <path
                d="M -10 2 C -6 12 6 12 10 2"
                fill={tongueColor}
                stroke={strokeColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Tongue inner crease */}
              <line x1="0" y1="4" x2="0" y2="8" stroke="#be185d" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          )}

          {/* EYES (Expressive, matching the reference image's signature `⌒ ⌒` happy curves!) */}
          {isDarkSleep ? (
            /* Peaceful Sleeping Eyes (- -) */
            <g transform="translate(0, -6)">
              <line x1="-24" y1="0" x2="-10" y2="0" stroke={strokeColor} strokeWidth="4.5" strokeLinecap="round" />
              <line x1="10" y1="0" x2="24" y2="0" stroke={strokeColor} strokeWidth="4.5" strokeLinecap="round" />
            </g>
          ) : isSick ? (
            /* Sick / Worried Eyes (• ︿ •) */
            <g transform="translate(0, -6)">
              <circle cx="-16" cy="0" r="4.5" fill={darkDetail} />
              <circle cx="16" cy="0" r="4.5" fill={darkDetail} />
              <path d="M -22 -6 Q -16 -10 -10 -6" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M 10 -6 Q 16 -10 22 -6" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : variant === 'curious' || activeScreen === 'game' ? (
            /* Big Alert Shiny Open Eyes */
            <g transform="translate(0, -6)">
              {/* Left Eye */}
              <circle cx="-16" cy="0" r="7" fill={darkDetail} />
              <circle cx="-18" cy="-2.5" r="2.5" fill="#ffffff" />
              <circle cx="-14" cy="2" r="1.2" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="16" cy="0" r="7" fill={darkDetail} />
              <circle cx="14" cy="-2.5" r="2.5" fill="#ffffff" />
              <circle cx="18" cy="2" r="1.2" fill="#ffffff" />
            </g>
          ) : (
            /* SIGNATURE HAPPY SMILING ARCS (⌒ ⌒) from the reference image */
            <g transform="translate(0, -6)">
              {/* Left Eye Arc */}
              <path
                d="M -26 4 C -24 -6 -8 -6 -6 4"
                fill="none"
                stroke={strokeColor}
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Right Eye Arc */}
              <path
                d="M 6 4 C 8 -6 24 -6 26 4"
                fill="none"
                stroke={strokeColor}
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Cute Soft Cheek Blush */}
          {!isLcd && !isDarkSleep && (
            <>
              <ellipse cx="-28" cy="12" rx="6" ry="4" fill={blushColor} opacity={0.65} />
              <ellipse cx="28" cy="12" rx="6" ry="4" fill={blushColor} opacity={0.65} />
            </>
          )}
        </motion.g>

        {/* Floating Zzz when sleeping */}
        {isDarkSleep && (
          <motion.g
            animate={{ y: [-4, -20], opacity: [0, 1, 0], x: [10, 24] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            transform="translate(15, -45)"
          >
            <text x="0" y="0" fontSize="13" fontWeight="900" fill={darkDetail} fontFamily="monospace">
              Zzz...
            </text>
          </motion.g>
        )}
      </motion.g>
      </g>
    );
  };

  // --- INTERACTIVE PROPS & ANIMATIONS ---
  const renderPoopPiles = () => {
    if (poopCount <= 0) return null;
    const poopPositions = [
      { x: 155, y: 145 },
      { x: 172, y: 158 },
      { x: 22, y: 150 },
      { x: 38, y: 162 }
    ];

    return (
      <g id="dog-poop-piles">
        {poopPositions.slice(0, poopCount).map((pos, idx) => (
          <motion.g
            key={`dog-poop-${idx}`}
            animate={{ scale: [1, 1.08, 1], y: [0, -2, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: idx * 0.2 }}
            transform={`translate(${pos.x}, ${pos.y})`}
          >
            <path
              d="M 0 16 C 0 10 6 8 10 10 C 14 6 20 8 20 14 C 22 18 18 22 10 22 C 2 22 0 20 0 16 Z"
              fill={poopColor}
              stroke={strokeColor}
              strokeWidth="2"
            />
            <circle cx="7" cy="14" r="1.5" fill="#ffffff" />
            <circle cx="13" cy="14" r="1.5" fill="#ffffff" />
            <circle cx="7.5" cy="14" r="0.8" fill={darkDetail} />
            <circle cx="13.5" cy="14" r="0.8" fill={darkDetail} />
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
        transform="translate(24, 65)"
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
        animate={{ x: [10, -5, 10], opacity: [1, 0.85, 1] }}
        transition={{ duration: 0.35, repeat: 3 }}
        transform="translate(130, 95)"
      >
        {foodType === 'meal' ? (
          // Dog Food Bowl with Kibbles
          <g>
            <path d="M 0 16 Q 16 32 32 16 Z" fill={isLcd ? '#1b3b22' : '#ef4444'} stroke={strokeColor} strokeWidth="2.5" />
            <ellipse cx="16" cy="14" rx="15" ry="5.5" fill={isLcd ? '#73986a' : '#78350f'} stroke={strokeColor} strokeWidth="2" />
            <text x="16" y="16" fontSize="11" fontWeight="bold" textAnchor="middle" fill={darkDetail}>
              🍖
            </text>
          </g>
        ) : (
          // Dog Treat Biscuit Bone
          <g>
            <ellipse cx="6" cy="12" rx="4.5" ry="4.5" fill={isLcd ? '#1b3b22' : '#fbbf24'} stroke={strokeColor} strokeWidth="1.8" />
            <ellipse cx="26" cy="12" rx="4.5" ry="4.5" fill={isLcd ? '#1b3b22' : '#fbbf24'} stroke={strokeColor} strokeWidth="1.8" />
            <rect x="6" y="9" width="20" height="6" rx="2" fill={isLcd ? '#73986a' : '#fef08a'} stroke={strokeColor} strokeWidth="1.8" />
            <text x="16" y="15" fontSize="9" fontWeight="bold" textAnchor="middle" fill={darkDetail}>
              🦴
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
        <circle cx="30" cy="22" r="14" fill={furBase} stroke={strokeColor} strokeWidth="2" />
        <circle cx="40" cy="14" r="9" fill={furBase} stroke={strokeColor} strokeWidth="2" />
        <circle cx="43" cy="12" r="1.8" fill={darkDetail} />
        <circle cx="10" cy="15" r="4" fill={isLcd ? '#73986a' : '#bae6fd'} />
        <circle cx="2" cy="25" r="3" fill={isLcd ? '#73986a' : '#bae6fd'} />
        <text x="40" y="10" fontSize="10">🧼</text>
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
      title="Tamagotchi Dog"
      style={{ transform: `scale(${scale})` }}
    >
      <svg
        viewBox="0 0 200 200"
        className={`w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 max-w-full max-h-full ${isPixel ? 'rendering-pixelated' : ''}`}
        style={{
          imageRendering: isPixel ? 'pixelated' : 'auto'
        }}
      >
        {/* Main Character Stage Render */}
        {stage === EvolutionStage.DEAD ? (
          renderDeadScreen()
        ) : (
          <>
            {stage === EvolutionStage.EGG_INCUBATING && renderReferenceDog('puppy')}
            {stage === EvolutionStage.EGG_WIGGLING && renderReferenceDog('playful')}
            {stage === EvolutionStage.EGG_CRACKING && renderReferenceDog('curious')}
            {stage === EvolutionStage.EGG_HATCHING && renderReferenceDog('adventurous')}
            {stage === EvolutionStage.BABY_CHICK && renderReferenceDog('sporty')}
            {stage === EvolutionStage.ADULT_CHICK && renderReferenceDog('champion')}
          </>
        )}

        {/* Interactive Overlays */}
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
