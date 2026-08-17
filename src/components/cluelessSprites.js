// Pixel-art sprite data for the Clueless cat, kept out of the component so the
// art can be previewed by tooling without pulling in React.
//
// The style is chibi line-art (after ivonchee's f2u cat bases): a white cat
// with a thin dark outline, small wide-set dot eyes and a tiny mouth — no
// shading, just silhouette. Color only appears in small accents (pink ears,
// tongue, hearts) and props.
//
// Everything is a 32×28 grid of palette letters ('.' = transparent). The
// sitting cat is drawn as a 16-column left half and mirrored, which keeps it
// symmetric by construction. Face, arms, tail and props are separate overlay
// patches, so a new emotion costs a few rows of eyes or mouth rather than a
// whole redraw.
//
// Sit-rig layout: ears rows 0-4, head rows 4-14 (cols 3-28), body rows 14-27
// (cols 5-26). Columns 27-31 stay clear for the tail; 0-2 for raised paws.
// The face patch lands at (4, 8) — eyes in its first four rows, mouth in the
// last two.

export const COLS = 32
export const ROWS = 28

export const PALETTE = {
  X: '#2a2438', // outline
  E: '#2a2438', // eyes, mouth (same ink as the outline)
  W: '#faf7f0', // fur + white props
  S: '#ffffff', // eye glint
  P: '#f6a5c1', // pink — inner ear, tongue, blush, droplets
  N: '#ef6d94', // deep pink — hearts, fish, yarn
  K: '#39445a', // laptop lid logo / screen dark
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

// ── Body (front-facing sit) ─────────────────────────────────────────────────
// One continuous blob — cheeks widest, a slight neck pinch, haunches flaring
// back out. No line between head and body; the pinch and the face imply it.

const SIT_HALF = [
  '.......XX.......',
  '......XWWX......',
  '......XWPPX.....',
  '.....XWWPPWX....',
  '.....XWWWWWXXXXX',
  '....XWWWWWWWWWWW',
  '....XWWWWWWWWWWW',
  '...XWWWWWWWWWWWW',
  '...XWWWWWWWWWWWW',
  '...XWWWWWWWWWWWW',
  '...XWWWWWWWWWWWW',
  '...XWWWWWWWWWWWW',
  '....XWWWWWWWWWWW',
  '....XWWWWWWWWWWW',
  '.....XWWWWWWWWWW',
  '......XWWWWWWWWW',
  '......XWWWWWWWWW',
  '......XWWWWWWWWW',
  '......XWWWWWWWWW',
  '......XWWWWWWWWW',
  '.....XWWWWWWWWWW',
  '.....XWWWWWWWWWW',
  '.....XWWWWWWWWWW',
  '.....XWWWWWWWWWW',
  '.....XWWWWWWWWWW',
  '.....XWWWWWWWWWW',
  '......XWWWWWWWWW',
  '.......XXXXXXXXX',
]

const SIT = mirrored(SIT_HALF)

// Front-paw slits: two short lines at the bottom edge splitting the base into
// paws, like the reference's hinted front legs.
const PAWS_DOWN = mirrored(['.............X..', '.............X..'])
const PAWS_AT = 25

const BLUSH = ['......PP................PP......']
const BLUSH_AT = 11

// ── Tails ───────────────────────────────────────────────────────────────────
// Long and expressive — the reference cats' tails are half the charm. Upright
// with a sway for happy poses; lying on the ground for calm/droopy ones.

const TAIL_UP_A = [
  '............................XX..',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '..........................XWWX..',
  '..........................XWWX..',
  '..........................XWWX..',
  '..........................XXXX..',
]

const TAIL_UP_B = [
  '.............................XX.',
  '............................XWWX',
  '............................XWWX',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '..........................XWWX..',
  '..........................XWWX..',
  '..........................XWWX..',
  '..........................XXXX..',
]

const TAIL_UP_AT = 11

const TAIL_LOW = [
  '..........................XXXXX.',
  '.........................XWWWWWX',
  '..........................XXXXX.',
]
const TAIL_LOW_AT = 25

const TAIL_LOW_B = [
  '.............................XX.',
  '..........................XXXWWX',
  '.........................XWWWWX.',
  '..........................XXXX..',
]
const TAIL_LOW_B_AT = 24

// ── Arms ────────────────────────────────────────────────────────────────────

const ARM_WAVE_UP = [
  '...........................XXX..',
  '..........................XWWWX.',
  '..........................XWWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '...........................XWWX.',
  '..........................XWWX..',
  '..........................XWWX..',
]

const ARM_WAVE_DOWN = [
  '............................XXX.',
  '...........................XWWWX',
  '...........................XWWWX',
  '...........................XWWX.',
  '...........................XWWX.',
  '..........................XWWX..',
  '..........................XWWX..',
]

const ARM_POINT = [
  '..........................XXXXX.',
  '..........................WWWWWX',
  '..........................XXXXX.',
]

// Raised in a V from the shoulders. The inner edge always lands on the body's
// own outline column so the arm reads as a separate limb, not a white bridge.
const ARMS_UP = mirrored([
  '.XX.............',
  'XWWX............',
  'XWWX............',
  'XWWX............',
  'XWWX............',
  '.XWWX...........',
  '..XWWX..........',
  '...XWWX.........',
  '....XXX.........',
])

// Batting at a toy on the ground — two frames of a low right-arm swipe.
const ARM_PLAY_A = [
  '..........................XXXX..',
  '.........................XWWWWX.',
  '..........................XXXX..',
]

const ARM_PLAY_B = [
  '...........................XXXX.',
  '..........................XWWWWX',
  '...........................XXXX.',
]

// Foreleg raised across the chest to the mouth, fully outlined so it reads
// against the white body. Two heights for the lick-lick loop.
const ARM_GROOM_A = [
  '..................XXXX..........',
  '..................XWWX..........',
  '..................XWWX..........',
  '...................XWWX.........',
  '....................XWWX........',
  '.....................XWWX.......',
  '......................XXX.......',
]

const ARM_GROOM_B = ARM_GROOM_A

const TONGUE = ['...............PP...............']
const TONGUE_AT = 14

// ── Props ───────────────────────────────────────────────────────────────────

// Open laptop, lid back toward the viewer, little glowing logo on the lid.
const LAPTOP = [
  '.........XXXXXXXXXXXXXX.........',
  '.........XWWWWWWWWWWWWX.........',
  '.........XWWWWWKKWWWWWX.........',
  '.........XWWWWWWWWWWWWX.........',
  '.........XWWWWWWWWWWWWX.........',
  '........XXXXXXXXXXXXXXXX........',
]
const LAPTOP_AT = 21

// Paws hooked over the lid's top edge, alternating for a typing shuffle.
const PAWS_TYPE_A = ['..........XWWX......XWWX........', '..........XWWX......XWWX........']
const PAWS_TYPE_B = ['...........XWWX....XWWX.........', '...........XWWX....XWWX.........']
const PAWS_TYPE_AT = 20

// A little "achoo" spray in front of the muzzle (pink so it shows on fur).
const SNEEZE_SPRAY = [
  '............P..P..P.............',
  '..............P..P..............',
]

// Cardboard-style box (drawn white, like the reference's line-art box): rim,
// plain front face, and two flaps folded out at the sides.
const BOX_FRONT = [
  '...XXXXXXXXXXXXXXXXXXXXXXXXXX...',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '..XXXXXXXXXXXXXXXXXXXXXXXXXXXX..',
]
const BOX_AT = 14

const BOX_FLAPS = mirrored([
  '.XX.............',
  'XW..............',
  'XW..............',
  'XX..............',
])
const BOX_FLAPS_AT = 15

// Paws hooked over the box rim.
const PAWS_RIM = mirrored([
  '.........XXXX...',
  '.........XWWX...',
  '.........XWWX...',
  '.........XXXX...',
])
const PAWS_RIM_AT = 13

// ── Faces ───────────────────────────────────────────────────────────────────
// Eyes and mouths are authored as 12-column left halves so any pair of eyes
// composes with any mouth. The patch is six rows: eyes fill rows 0-3, the
// mouth rows 4-5. Dot eyes sit wide apart, reference-style.

const EYES = {
  // small round dot — the default; nearly all the reference cats have these
  open: ['............', '.....EE.....', '.....EE.....', '............'],
  // mid-blink
  blink: ['............', '............', '.....EE.....', '............'],
  // squeezed-shut happy arcs (∩ ∩)
  arc: ['............', '.....EE.....', '....E..E....', '............'],
  // contentedly shut (∪ ∪) — grooming, sleeping upright, pre-sneeze scrunch
  shut: ['............', '....E..E....', '.....EE.....', '............'],
  // half-lidded — only for 'bored', where the flat lid is the point
  sleepy: ['............', '....EEE.....', '.....EE.....', '............'],
  // cast down at something in front of the cat (laptop, reading)
  down: ['............', '............', '.....EE.....', '.....EE.....'],
  // saucer eyes with a glint
  wide: ['....SEE.....', '....EEE.....', '....EEE.....', '............'],
  heart: ['....N.N.....', '....NNN.....', '.....N......', '............'],
  // spun-around X eyes
  dizzy: ['....E.E.....', '.....E......', '....E.E.....', '............'],
}

const MOUTHS = {
  // tiny ω — raised corners, dipped center
  smile: ['..........E.', '...........E'],
  // open grin with a tongue
  open: ['..........EE', '..........EP'],
  // small neutral 'o'
  small: ['...........E', '...........E'],
  none: ['............', '............'],
}

const face = (eyes, mouth, rightEyes) => [
  ...(rightEyes ? halves(EYES[eyes], EYES[rightEyes]) : mirrored(EYES[eyes])),
  ...mirrored(MOUTHS[mouth]),
]

const FACES = {
  happy: face('open', 'smile'),
  happyBlink: face('blink', 'smile'),
  joy: face('arc', 'open'),
  joyBlink: face('arc', 'smile'),
  wink: face('open', 'smile', 'arc'),
  excited: face('wide', 'open'),
  curious: face('wide', 'small'),
  focused: face('down', 'smile'),
  working: face('down', 'small'),
  asleep: face('shut', 'none'),
  love: face('heart', 'open'),
  bored: face('sleepy', 'none'),
  dizzy: face('dizzy', 'small'),
  groom: face('shut', 'small'),
}

const FACE_AT = [4, 8]

// ── Side-view rigs ──────────────────────────────────────────────────────────
// Locomotion, lying down and eating get proper full bodies — head forward,
// slim torso, four thin legs, long tail — drawn facing right and
// bottom-aligned with the sit rig so pose switches don't hop.

// Trot: the legs alternate by diagonal pairs; the lifted pair's paw stops two
// rows short of the ground.
const WALK_A = [
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '.....................XX....XX...',
  '....................XWWX..XWWX..',
  '....................XWWWWWWWWX..',
  '..XX...............XWWWWWWWWWWX.',
  '.XWWX..............XWWWWWWWWWWX.',
  '.XWWX.............XWWWWWWWWWWWWX',
  '.XWWX.............XWWWWWWWEEWWWX',
  '.XWWX.............XWWWWWWWEEWWWX',
  '..XWWX............XWWWWWWWWWWWNX',
  '..XWWX............XWWWWWWWWWWWWX',
  '...XWWX...........XWWWWWWWWWWWX.',
  '....XWWXXXXXXXXXXXWWWWWWWWWWWX..',
  '....XWWWWWWWWWWWWWWWWWWWWWWWX...',
  '....XWWWWWWWWWWWWWWWWWWWWWWX....',
  '....XWWWWWWWWWWWWWWWWWWWWWWX....',
  '....XWWWWWWWWWWWWWWWWWWWWWX.....',
  '.....XWWWWWWWWWWWWWWWWWWWWX.....',
  '.....XWWWWWWWWWWWWWWWWWWWX......',
  '.....XXWXXXXWXXXXXXWXXXXWX......',
  '......XWX..XWX....XWX..XWX......',
  '......XXX..XWX....XXX..XWX......',
  '...........XWX.........XWX......',
  '...........XXX.........XXX......',
]

const WALK_B = [
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '.....................XX....XX...',
  '....................XWWX..XWWX..',
  '....................XWWWWWWWWX..',
  '...XX..............XWWWWWWWWWWX.',
  '..XWWX.............XWWWWWWWWWWX.',
  '..XWWX............XWWWWWWWWWWWWX',
  '..XWWX............XWWWWWWWEEWWWX',
  '..XWWX............XWWWWWWWEEWWWX',
  '...XWWX...........XWWWWWWWWWWWNX',
  '...XWWX...........XWWWWWWWWWWWWX',
  '....XWWX..........XWWWWWWWWWWWX.',
  '.....XWWXXXXXXXXXXWWWWWWWWWWWX..',
  '....XWWWWWWWWWWWWWWWWWWWWWWWX...',
  '....XWWWWWWWWWWWWWWWWWWWWWWX....',
  '....XWWWWWWWWWWWWWWWWWWWWWWX....',
  '....XWWWWWWWWWWWWWWWWWWWWWX.....',
  '.....XWWWWWWWWWWWWWWWWWWWWX.....',
  '.....XWWWWWWWWWWWWWWWWWWWX......',
  '.....XXWXXXXWXXXXXXWXXXXWX......',
  '......XWX..XWX....XWX..XWX......',
  '......XWX..XXX....XWX..XXX......',
  '......XWX.........XWX...........',
  '......XXX.........XXX...........',
]

// Curled up in a donut: head at the left with a ∪ shut eye under the ears,
// back mounding up behind, tail wrapping around the front under the chin.
// Frame B shifts the tail root and tip for a sleepy flick.
const LIE_A = [
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '....XX..XX......................',
  '...XWWXXWWX.....................',
  '...XWWWWWWXXXXXX................',
  '..XWWWWWWWWWWWWXXXX.............',
  '..XWWWWWWWWWWWWWWWWXXX..........',
  '.XWWEWWEWWWWWWWWWWWWWXX.........',
  '.XWWWEEWWWWWWWWWWWWWWWXX........',
  '.XWWWWWWWWWWWWWWWWWWWWWWX.......',
  '.XWWWWWWWWWWWWWWWWWWWWWWWX......',
  '.XWWWWWWWWWWWWWWWWWWWWWWWX......',
  '.XWWWWXXXXXXXXXXXXXXXXXWWX......',
  '.XWWWXWWWWWWWWWWWWWWWWWWWX......',
  '..XWWWWWWWWWWWWWWWWWWWWWX.......',
  '...XXXXXXXXXXXXXXXXXXXXX........',
]

const LIE_B = [
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '....XX..XX......................',
  '...XWWXXWWX.....................',
  '...XWWWWWWXXXXXX................',
  '..XWWWWWWWWWWWWXXXX.............',
  '..XWWWWWWWWWWWWWWWWXXX..........',
  '.XWWEWWEWWWWWWWWWWWWWXX.........',
  '.XWWWEEWWWWWWWWWWWWWWWXX........',
  '.XWWWWWWWWWWWWWWWWWWWWWWX.......',
  '.XWWWWWWWWWWWWWWWWWWWWWWWX......',
  '.XWWWWWWWWWWWWWWWWWWWWWWWX......',
  '.XWWWWXXXXXXXXXXXXXXXXWWWX......',
  '.XWWWWXWWWWWWWWWWWWWWWWWWX......',
  '..XWWWWWWWWWWWWWWWWWWWWWX.......',
  '...XXXXXXXXXXXXXXXXXXXXX........',
]

// Eating from a fish bowl on the ground — muzzle dipped to the bowl rim, then
// head up mid-chew (fish visible again). Walk-rig body, all four paws planted.
const EAT_A = [
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '......................XX..XX....',
  '.....................XWWXXWWX...',
  '.....................XWWWWWWX...',
  '....................XWWWWWWWWX..',
  '...XX...............XWWWWWWWWX..',
  '..XWWX..............XWWWWWWWWWX.',
  '...XWWXXXXXXXXXXXXXXWWWWWWWWWWX.',
  '....XWWWWWWWWWWWWWWWWWWWWWWWWX..',
  '....XWWWWWWWWWWWWWWWWWEEWWWWX...',
  '....XWWWWWWWWWWWWWWWWWWWWWWWX...',
  '.....XWWWWWWWWWWWWWWWWWWWWWX....',
  '.....XXWXXXXWXXXWXXXWXXWWWWX....',
  '......XWX..XWX.XWX.XWX.XWWX.....',
  '......XWX..XWX.XWX.XWX.XXXXXX...',
  '......XWX..XWX.XWX.XWX..XWWWWX..',
  '......XXX..XXX.XXX.XXX..XXXXXX..',
]

const EAT_B = [
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '.....................XX...XX....',
  '....................XWWX.XWWX...',
  '....................XWWWWWWWX...',
  '...................XWWWWWWWWWX..',
  '...................XWWWWWWWWWX..',
  '...................XWWWWWEEWWX..',
  '...................XWWWWWEEWWX..',
  '...................XWWWWWWWWWX..',
  '...................XWWWWWWEEWX..',
  '...XX..............XWWWWWWWWX...',
  '..XWWX.............XWWWWWWWWX...',
  '...XWWXXXXXXXXXXXXXWWWWWWWWX....',
  '....XWWWWWWWWWWWWWWWWWWWWWWX....',
  '....XWWWWWWWWWWWWWWWWWWWWWWX....',
  '....XWWWWWWWWWWWWWWWWWWWWWX.....',
  '.....XWWWWWWWWWWWWWWWWWWWWX.....',
  '.....XWWWWWWWWWWWWWWWWWWWX......',
  '.....XXWXXXXWXXXWXXXWXX.........',
  '......XWX..XWX.XWX.XWX...NN.N...',
  '......XWX..XWX.XWX.XWX.XXXXXX...',
  '......XWX..XWX.XWX.XWX..XWWWWX..',
  '......XXX..XXX.XXX.XXX..XXXXXX..',
]

// ── Frame assembly ──────────────────────────────────────────────────────────

function build({
  face: faceName = 'happy',
  tail = TAIL_UP_A,
  tailAt = TAIL_UP_AT,
  paws = PAWS_DOWN,
  pawsAt = PAWS_AT,
  arm = null,
  armAt = 0,
  extras = [],
}) {
  let out = SIT
  if (tail) out = overlay(out, tail, 0, tailAt)
  if (paws) out = overlay(out, paws, 0, pawsAt)
  out = overlay(out, FACES[faceName], FACE_AT[0], FACE_AT[1])
  if (arm) out = overlay(out, arm, 0, armAt)
  // Props (laptop, box, sneeze spray, play swipes) land last, over everything.
  for (const [patch, ox, oy] of extras) out = overlay(out, patch, ox, oy)
  return out
}

// The box pose hides the body, so tail and paw slits are dropped before the
// box lands on top and the paws re-appear hooked over its rim.
const boxFrame = (faceName) =>
  build({
    face: faceName,
    tail: null,
    paws: null,
    extras: [
      [BOX_FRONT, 0, BOX_AT],
      [BOX_FLAPS, 0, BOX_FLAPS_AT],
      [PAWS_RIM, 0, PAWS_RIM_AT],
    ],
  })

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
  // Side-view quadruped trot.
  walk: {
    ms: 150,
    frames: [WALK_A, WALK_B],
  },
  wave: {
    ms: 300,
    frames: [
      build({ face: 'joy', arm: ARM_WAVE_UP, armAt: 6 }),
      build({ face: 'joy', arm: ARM_WAVE_DOWN, armAt: 7, tail: TAIL_UP_B }),
    ],
  },
  point: {
    ms: 900,
    frames: [
      build({ face: 'happy', tail: TAIL_LOW, tailAt: TAIL_LOW_AT, arm: ARM_POINT, armAt: 15 }),
      build({ face: 'happyBlink', tail: TAIL_LOW, tailAt: TAIL_LOW_AT, arm: ARM_POINT, armAt: 15 }),
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
      build({ face: 'excited', arm: ARMS_UP, armAt: 8 }),
      build({ face: 'excited', arm: ARMS_UP, armAt: 7, tail: TAIL_UP_B }),
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
    frames: [
      build({ face: 'love', extras: [[BLUSH, 0, BLUSH_AT]] }),
      build({ face: 'love', tail: TAIL_UP_B, extras: [[BLUSH, 0, BLUSH_AT]] }),
    ],
  },
  // Curled up in a donut, fully out.
  sleep: {
    ms: 1200,
    frames: [LIE_A, LIE_A, LIE_B],
  },
  // Half-lidded stare into the middle distance; only the tail tip flicks.
  bored: {
    ms: 850,
    frames: [
      build({ face: 'bored', tail: TAIL_LOW, tailAt: TAIL_LOW_AT }),
      build({ face: 'bored', tail: TAIL_LOW_B, tailAt: TAIL_LOW_B_AT }),
    ],
  },
  // Hunched behind a mini laptop, paws shuffling on the lid edge.
  laptop: {
    ms: 380,
    frames: [
      build({
        face: 'working',
        tail: TAIL_LOW,
        tailAt: TAIL_LOW_AT,
        paws: null,
        extras: [[LAPTOP, 0, LAPTOP_AT], [PAWS_TYPE_A, 0, PAWS_TYPE_AT]],
      }),
      build({
        face: 'working',
        tail: TAIL_LOW_B,
        tailAt: TAIL_LOW_B_AT,
        paws: null,
        extras: [[LAPTOP, 0, LAPTOP_AT], [PAWS_TYPE_B, 0, PAWS_TYPE_AT]],
      }),
    ],
  },
  // Scrunch… scrunch… ACHOO (droplet spray).
  sneeze: {
    ms: 280,
    frames: [
      build({ face: 'asleep', tail: TAIL_LOW, tailAt: TAIL_LOW_AT }),
      build({ face: 'asleep', tail: TAIL_LOW, tailAt: TAIL_LOW_AT }),
      build({ face: 'joy', tail: TAIL_UP_B, extras: [[SNEEZE_SPRAY, 0, 14]] }),
    ],
  },
  // Batting at a toy on the floor.
  play: {
    ms: 180,
    frames: [
      build({ face: 'excited', extras: [[ARM_PLAY_A, 0, 22]] }),
      build({ face: 'excited', tail: TAIL_UP_B, extras: [[ARM_PLAY_B, 0, 22]] }),
    ],
  },
  // Spun around too much — X eyes, everything droops.
  dizzy: {
    ms: 320,
    frames: [
      build({ face: 'dizzy', tail: TAIL_LOW, tailAt: TAIL_LOW_AT }),
      build({ face: 'dizzy', tail: TAIL_LOW_B, tailAt: TAIL_LOW_B_AT }),
    ],
  },
  // Picked up mid-air: saucer eyes, paws out, tail hanging.
  held: {
    ms: 500,
    frames: [
      build({ face: 'curious', arm: ARMS_UP, armAt: 8, tail: TAIL_LOW, tailAt: TAIL_LOW_AT }),
      build({ face: 'curious', arm: ARMS_UP, armAt: 9, tail: TAIL_LOW_B, tailAt: TAIL_LOW_B_AT }),
    ],
  },
  // Eyes shut, paw up, lick lick.
  groom: {
    ms: 420,
    frames: [
      build({ face: 'groom', tail: TAIL_LOW, tailAt: TAIL_LOW_AT, arm: ARM_GROOM_A, armAt: 12, extras: [[TONGUE, 0, TONGUE_AT]] }),
      build({ face: 'groom', tail: TAIL_LOW_B, tailAt: TAIL_LOW_B_AT, arm: ARM_GROOM_B, armAt: 13, extras: [[TONGUE, 0, TONGUE_AT]] }),
    ],
  },
  // Head down in the fish bowl, then up to chew.
  eat: {
    ms: 450,
    frames: [EAT_A, EAT_B],
  },
  // If it fits, it sits. Head and paws peeking out of a box.
  box: {
    ms: 900,
    frames: [boxFrame('happy'), boxFrame('happy'), boxFrame('happyBlink')],
  },
}

export const POSE_NAMES = Object.keys(POSES)
