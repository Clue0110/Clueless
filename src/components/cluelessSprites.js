// Pixel-art sprite data for the Clueless cat, kept out of the component so the
// art can be previewed by tooling without pulling in React.
//
// Everything is a 32×24 grid of palette letters ('.' = transparent). The body is
// drawn as a 16-column left half and mirrored, which keeps it symmetric by
// construction. Face, blush, arms and tail are separate overlay patches, so a
// new emotion costs a few rows of eyes or mouth rather than a whole redraw.
//
// Layout: ears rows 0-4, head rows 4-15 (cols 4-27), body rows 16-23 (cols
// 6-25). Columns 0-3 and 28-31 are deliberately kept clear so raised paws and
// the tail have somewhere to go. The face patch lands at (4, 7) — eyes fill its
// first five rows, the nose and mouth the last four.

export const COLS = 32
export const ROWS = 24

export const PALETTE = {
  X: '#4a2d0a', // outline
  B: '#f6b445', // fur
  D: '#d1861c', // dark fur — stripes, tail
  W: '#fff4de', // cream — muzzle, paws
  P: '#f79ab0', // pink — inner ear, blush
  E: '#2c1a10', // eyes, mouth line
  S: '#ffffff', // eye shine
  N: '#ef6d94', // nose, tongue, hearts
}

const mirrored = (half) => half.map((row) => row + [...row].reverse().join(''))

// Left half + a *different* left half reversed — for asymmetric faces (wink).
const halves = (left, right) => left.map((row, i) => row + [...right[i]].reverse().join(''))

// Paint patch over base at (ox, oy); '.' in the patch keeps the base pixel.
const overlay = (base, patch, ox, oy) =>
  base.map((row, y) => {
    const patchRow = patch[y - oy]
    if (!patchRow) return row
    return [...row]
      .map((cell, x) => {
        const from = patchRow[x - ox]
        return from && from !== '.' ? from : cell
      })
      .join('')
  })

// ── Body ────────────────────────────────────────────────────────────────────
// Paw rows are left as plain fur and stamped from PAWS_* so the walk cycle can
// lift them independently of the body.

const SIT_HALF = [
  '......XX........',
  '.....XBBX.......',
  '....XBPPBX......',
  '....XBPPPBX.....',
  '....XBPPPBBXXXXX',
  '....XBBDBBBBDBBB',
  '....XBBBBBBBBBBB',
  '....XBBBBBBBBBBB',
  '....XBBBBBBBBBBB',
  '....XBBBBBBBBBBB',
  '....XBBBBBBBBBBB',
  '....XBBBBBBBBBBB',
  '....XBBBBBBBBBBB',
  '....XBBBBBBBBBBB',
  '....XBBBBBBBBBBB',
  '.....XBBBBBBBBBB',
  '......XBBBBBBBBB',
  '......XBBBBBBBBB',
  '......XBDBBBBBBB',
  '......XBBBBBBBBB',
  '......XBDBBBBBBB',
  '......XBBBBBBBBB',
  '......XBBBBBBBBB',
  '......XXXXXXXXXX',
]

const SIT = mirrored(SIT_HALF)

const BLUSH = ['.....PP..................PP.....', '.....PP..................PP.....']
const BLUSH_AT = 10

// ── Paws ────────────────────────────────────────────────────────────────────

const PAWS_DOWN = ['........WWWW........WWWW........', '........WWWW........WWWW........']

const PAWS_STEP_L = [
  '........WWWW....................',
  '........WWWW........WWWW........',
  '....................WWWW........',
]

const PAWS_STEP_R = [
  '....................WWWW........',
  '........WWWW........WWWW........',
  '........WWWW....................',
]

// ── Tails ───────────────────────────────────────────────────────────────────
// A tail held high is the whole "happy to see you" tell, so idle/wave/cheer keep
// it up and only point/read/sleep drop it.

const TAIL_UP_A = [
  '...........................DD...',
  '............................DD..',
  '............................DD..',
  '............................DD..',
  '............................DD..',
  '...........................DD...',
  '..........................DD....',
]

const TAIL_UP_B = [
  '............................DD..',
  '.............................DD.',
  '.............................DD.',
  '............................DD..',
  '............................DD..',
  '...........................DD...',
  '..........................DD....',
]

const TAIL_UP_AT = 16

const TAIL_LOW = ['............................DD..', '..........................DDD...']
const TAIL_LOW_AT = 21

// ── Arms ────────────────────────────────────────────────────────────────────

const ARM_WAVE_UP = [
  '.............................XX.',
  '............................XWWX',
  '............................XWWX',
  '............................XWWX',
  '............................XBBX',
  '............................XBBX',
  '...........................XBBX.',
]

const ARM_WAVE_DOWN = [
  '............................XX..',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XBBX.',
  '...........................XBBX.',
  '..........................XBBX..',
]

const ARM_POINT = [
  '..........................XXXXXX',
  '..........................BBBWWX',
  '..........................BBBWWX',
  '..........................XXXXXX',
]

const ARMS_UP = [
  '.XX..........................XX.',
  'XWWX........................XWWX',
  'XWWX........................XWWX',
  'XWWX........................XWWX',
  'XBBX........................XBBX',
  'XBBX........................XBBX',
  '.XBBX......................XBBX.',
]

// ── Faces ───────────────────────────────────────────────────────────────────
// Eyes and mouths are authored as 12-column left halves so any pair of eyes
// composes with any mouth. Eyes fill face rows 0-4, the nose row is fixed, and
// the mouth fills rows 6-8.

const EYES = {
  // wide open with a shine — the default, and the reason the cat reads friendly
  open: ['....EEE.....', '...ESSEE....', '...EEEEE....', '...EEEEE....', '....EEE.....'],
  // mid-blink
  blink: ['............', '............', '...EEEEE....', '............', '............'],
  // squeezed-shut happy arcs (∩ ∩)
  arc: ['............', '.....EE.....', '....E..E....', '...E....E...', '............'],
  // star-struck
  sparkle: ['....EEE.....', '...ESSSE....', '...ESSSE....', '...EEEEE....', '....EEE.....'],
  // half-lidded, looking down at something
  sleepy: ['............', '............', '...EEEEE....', '...EEEEE....', '....EEE.....'],
  // saucer eyes
  wide: ['...EEEEE....', '..ESSEEEE...', '..EEEEEEE...', '..EEEEEEE...', '...EEEEE....'],
  heart: ['...NN.NN....', '...NNNNN....', '...NNNNN....', '....NNN.....', '.....N......'],
}

const NOSE = ['.........WWN']

// The cream muzzle stops at the nose row on purpose: a closed smile only reads
// as a curve if the gap between its raised corners is fur, not more cream.
const MOUTHS = {
  smile: ['.........E..', '..........EE', '............'],
  // open grin with a tongue
  grin: ['.........EEE', '.........ENN', '..........EE'],
  // small neutral 'o'
  small: ['............', '...........E', '...........E'],
}

const face = (eyes, mouth, rightEyes) => [
  ...(rightEyes ? halves(EYES[eyes], EYES[rightEyes]) : mirrored(EYES[eyes])),
  ...mirrored(NOSE),
  ...mirrored(MOUTHS[mouth]),
]

const FACES = {
  happy: face('open', 'smile'),
  happyBlink: face('blink', 'smile'),
  joy: face('arc', 'grin'),
  joyBlink: face('arc', 'smile'),
  wink: face('open', 'grin', 'arc'),
  excited: face('sparkle', 'grin'),
  curious: face('wide', 'small'),
  focused: face('sleepy', 'smile'),
  asleep: face('arc', 'small'),
  love: face('heart', 'grin'),
}

const FACE_AT = [4, 7]

// ── Frame assembly ──────────────────────────────────────────────────────────

function build({ face: faceName = 'happy', tail = TAIL_UP_A, tailAt = TAIL_UP_AT, paws = PAWS_DOWN, pawsAt = 21, arm = null, armAt = 0 }) {
  let out = SIT
  if (tail) out = overlay(out, tail, 0, tailAt)
  if (paws) out = overlay(out, paws, 0, pawsAt)
  out = overlay(out, BLUSH, 0, BLUSH_AT)
  out = overlay(out, FACES[faceName], FACE_AT[0], FACE_AT[1])
  if (arm) out = overlay(out, arm, 0, armAt)
  return out
}

// Frame sequences per pose. Blinks are deliberately one frame in a long cycle —
// the cat should look like it's holding a smile, not flickering.
export const POSES = {
  idle: {
    ms: 380,
    frames: [
      build({}),
      build({}),
      build({ tail: TAIL_UP_B }),
      build({ tail: TAIL_UP_B }),
      build({}),
      build({ face: 'happyBlink' }),
    ],
  },
  happy: {
    ms: 340,
    frames: [build({ face: 'joy' }), build({ face: 'joy', tail: TAIL_UP_B })],
  },
  walk: {
    ms: 150,
    frames: [
      build({ face: 'joyBlink', paws: PAWS_STEP_L, pawsAt: 20, tail: TAIL_UP_B }),
      build({ face: 'joyBlink', paws: PAWS_STEP_R, pawsAt: 20 }),
    ],
  },
  wave: {
    ms: 300,
    frames: [
      build({ face: 'joy', arm: ARM_WAVE_UP, armAt: 7 }),
      build({ face: 'joy', arm: ARM_WAVE_DOWN, armAt: 8, tail: TAIL_UP_B }),
    ],
  },
  point: {
    ms: 900,
    frames: [
      build({ face: 'happy', tail: TAIL_LOW, tailAt: TAIL_LOW_AT, arm: ARM_POINT, armAt: 17 }),
      build({ face: 'happyBlink', tail: TAIL_LOW, tailAt: TAIL_LOW_AT, arm: ARM_POINT, armAt: 17 }),
    ],
  },
  read: {
    ms: 700,
    frames: [
      build({ face: 'focused', tail: TAIL_LOW, tailAt: TAIL_LOW_AT }),
      build({ face: 'happy', tail: TAIL_LOW, tailAt: TAIL_LOW_AT }),
    ],
  },
  celebrate: {
    ms: 200,
    frames: [
      build({ face: 'excited', arm: ARMS_UP, armAt: 7 }),
      build({ face: 'excited', arm: ARMS_UP, armAt: 6, tail: TAIL_UP_B }),
    ],
  },
  wink: {
    ms: 600,
    frames: [build({ face: 'wink' }), build({ face: 'joy', tail: TAIL_UP_B })],
  },
  curious: {
    ms: 700,
    frames: [build({ face: 'curious' }), build({ face: 'curious', tail: TAIL_UP_B })],
  },
  love: {
    ms: 400,
    frames: [build({ face: 'love' }), build({ face: 'love', tail: TAIL_UP_B })],
  },
  sleep: {
    ms: 1100,
    frames: [
      build({ face: 'asleep', tail: TAIL_LOW, tailAt: TAIL_LOW_AT }),
      build({ face: 'asleep', tail: TAIL_LOW, tailAt: TAIL_LOW_AT }),
      build({ face: 'happyBlink', tail: TAIL_LOW, tailAt: TAIL_LOW_AT }),
    ],
  },
}

export const POSE_NAMES = Object.keys(POSES)
