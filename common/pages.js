/**
 * Has all the page meta.
 * Has all the utility functions to enable search by name and tags, list similar pages.
 * 
 * Ranking for Creators Choice (no ranks for internal pages):
 * 1: creator created: big project, awesome in all ways
 * 2: creator created: medium project, good to look at
 * 3: creator created: small, ok to look at
 *    inspired creation: big / medium project, good to look at
 * 4: everything else
 * 
 * Weight for tags:
 * 1: Meh
 * 2: Somewhat significant
 * 3: Very significant
 * 5: All about this
 */
class Pages {

  constructor() {
    this._pages = [
      {
        id: 1000,
        name: 'Demo',
        url: '/demo',
        img: '/demo/img/preview.jpg',
        detail: 'Just a Demo.',
        tags: [],
        internal: true,
        date: 'Oct 7 2019'
      },
      {
        id: 10000,
        name: 'Clock',
        url: '/clock',
        img: '/clock/img/preview.jpg',
        detail: 'Animating a clock.',
        rank: 4,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'clock', wt: 5 }, 
          { tag: 'maeda', wt: 1 }, 
          { tag: 'pendulum', wt: 1 }
        ]
      },
      {
        id: 10001,
        name: 'Lissajous Curve',
        url: '/lissajous-curve',
        img: '/lissajous-curve/img/preview.jpg',
        detail: 'Animation showing Lissajous curve adaptation!',
        rank: 4,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'lissajous', wt: 3 }, 
          { tag: 'curve', wt: 5 }, 
          { tag: 'bowditch', wt: 1 }
        ]
      },
      {
        id: 10002,
        name: 'Lissajous Curve Table',
        url: '/lissajous-curve-table',
        img: '/lissajous-curve-table/img/preview.jpg',
        detail: 'Table of curves animating around based on Lissajous equation!',
        rank: 3,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'lissajous', wt: 3 }, 
          { tag: 'curve', wt: 5 }, 
          { tag: 'bowditch', wt: 1 }
        ]
      },
      {
        id: 10003,
        name: 'Planetary System - 2D',
        url: '/planetary-system',
        img: '/planetary-system/img/preview.jpg',
        detail: 'A simulation of a Planetary System in 2D.',
        rank: 4,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'planet', wt: 5 }, 
          { tag: 'space', wt: 3 }, 
          { tag: 'circle', wt: 1 }, 
          { tag: 'sim', wt: 2 }
        ]
      },
      {
        id: 10004,
        name: 'Spirograph',
        url: '/spirograph',
        img: '/spirograph/img/preview.jpg',
        detail: 'A spiral with lot of circles!',
        rank: 4,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'spiral', wt: 3 }, 
          { tag: 'circle', wt: 1 }, 
          { tag: 'curve', wt: 1 }, 
          { tag: 'color', wt: 1 }
        ]
      },
      {
        id: 10005,
        name: 'Unit Circle',
        url: '/unit-circle',
        img: '/unit-circle/img/preview.jpg',
        detail: 'Trigonometry - Sine wave, Cosine wave and the Unit Circle.',
        rank: 4,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'circle', wt: 3 }, 
          { tag: 'curve', wt: 1 }, 
          { tag: 'wave', wt: 3 }
        ]
      },
      {
        id: 10006,
        name: 'Fourier Series',
        url: '/fourier-series',
        img: '/fourier-series/img/preview.jpg',
        detail: 'Fourier Series - Square Waves, Sawtooth and others.',
        rank: 3,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'fourier', wt: 5 }, 
          { tag: 'curve', wt: 1 }, 
          { tag: 'wave', wt: 3 }, 
          { tag: 'square', wt: 3 }, 
          { tag: 'triangle', wt: 3 }
        ]
      },
      {
        id: 10007,
        name: 'Fractal Circles',
        url: '/fractal-circles',
        img: '/fractal-circles/img/preview.jpg',
        detail: 'Fractal Circles - Recursion in Effect.',
        rank: 4,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'fractal', wt: 3 }, 
          { tag: 'circle', wt: 3 }
        ]
      },
      {
        id: 10008,
        name: 'More Fractals',
        url: '/more-fractals',
        img: '/more-fractals/img/preview.jpg',
        detail: 'More Fractal Shapes - Cantor Set, Vicsek Snowflake, Koch Curves and variations.',
        rank: 3,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'fractal', wt: 3 }, 
          { tag: 'curve', wt: 1 }, 
          { tag: 'triangle', wt: 1 }, 
          { tag: 'square', wt: 1 }, 
          { tag: 'snowflake', wt: 1 }, 
          { tag: 'cantor', wt: 1 }, 
          { tag: 'vicsek', wt: 1 }, 
          { tag: 'koch', wt: 1 }, 
          { tag: 'cesaro', wt: 1 }, 
          { tag: 'minkowski', wt: 1 }
        ]
      },
      {
        id: 10009,
        name: 'Sierpinski Fractals',
        url: '/sierpinski-fractals',
        img: '/sierpinski-fractals/img/preview.jpg',
        detail: 'Sierpinski Triangle, Gasket, Carpet, n-gons and n-flakes.',
        rank: 3,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'fractal', wt: 3 }, 
          { tag: 'sierpinski', wt: 5 }, 
          { tag: 'curve', wt: 1 }, 
          { tag: 'triangle', wt: 1 }, 
          { tag: 'square', wt: 1 }, 
          { tag: 'polygon', wt: 1 }, 
          { tag: 'snowflake', wt: 1 }
        ]
      },
      {
        id: 10010,
        name: 'Fractal Trees',
        url: '/fractal-trees',
        img: '/fractal-trees/img/preview.jpg',
        detail: 'Fractal Trees. L-Systems. Pythagorean Tree.',
        rank: 3,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'fractal', wt: 3 }, 
          { tag: 'l system', wt: 2 }, 
          { tag: 'pythagoras', wt: 1 }, 
          { tag: 'triangle', wt: 1 }, 
          { tag: 'square', wt: 1 }, 
          { tag: 'phyllotaxis', wt: 1 }, 
          { tag: 'tree', wt: 2 }, 
          { tag: 'turtle graphics', wt: 2 }, 
          { tag: 'lindenmayer', wt: 1 }, 
          { tag: 'spiral', wt: 1 }
        ]
      },
      {
        id: 10011,
        name: 'The Matrix',
        url: '/the-matrix',
        img: '/the-matrix/img/preview.jpg',
        detail: 'The Matrix Rainfall!!',
        rank: 3,
        date: 'Oct 7 2019', 
        tags: [
          { tag: 'matrix', wt: 5 }, 
          { tag: 'rainfall', wt: 1 },
          { tag: 'film', wt: 2 }
        ]
      },
      {
        id: 10012,
        name: 'Prime Spirals',
        url: '/prime-spirals',
        img: '/prime-spirals/img/preview.jpg',
        detail: 'The Spirals that Prime numbers make.',
        rank: 3,
        date: 'Oct 12 2019', 
        tags: [
          { tag: 'prime', wt: 5 }, 
          { tag: 'spiral', wt: 3 }
        ]
      },
      {
        id: 10013,
        name: 'Logo',
        url: '/logo',
        img: '/logo/img/preview.jpg',
        detail: 'Animate the Logo.',
        rank: 4,
        date: 'Oct 12 2019', 
        tags: [
          { tag: 'logo', wt: 5 }, 
          { tag: 'original', wt: 2 }
        ]
      },
      {
        id: 10014,
        name: 'Sort Visualization',
        url: '/sort-visualization',
        img: '/sort-visualization/img/preview.jpg',
        detail: 'Visualize different sorting algorithms.',
        rank: 3,
        date: 'Oct 20 2019', 
        tags: [
          { tag: 'sort', wt: 5 }, 
          { tag: 'visualization', wt: 2 }, 
          { tag: 'curve', wt: 1 }, 
          { tag: 'color', wt: 1 }
        ]
      },
      {
        id: 10015,
        name: 'Starfield',
        url: '/starfield',
        img: '/starfield/img/preview.jpg',
        detail: 'Into the Space!',
        rank: 4,
        date: 'Oct 20 2019', 
        tags: [
          { tag: 'starfield', wt: 5 }, 
          { tag: 'space', wt: 3 }, 
          { tag: 'film', wt: 2 }, 
          { tag: '3d', wt: 2 }
        ]
      },
      {
        id: 10016,
        name: 'Fractal Spirograph',
        url: '/fractal-spirograph',
        img: '/fractal-spirograph/img/preview.jpg',
        detail: 'Fractals and Spirals!',
        rank: 4,
        date: 'Oct 20 2019', 
        tags: [
          { tag: 'spiral', wt: 3 }, 
          { tag: 'fractal', wt: 3 }, 
          { tag: 'circle', wt: 1 }, 
          { tag: 'curve', wt: 1 }
        ]
      },
      {
        id: 10017,
        name: 'Barnsley Fern',
        url: '/barnsley-fern',
        img: '/barnsley-fern/img/preview.jpg',
        detail: 'Barnsley fern is another fractal.',
        rank: 3,
        date: 'Oct 20 2019', 
        tags: [
          { tag: 'barnsley', wt: 3 }, 
          { tag: 'fractal', wt: 3 }, 
          { tag: 'fern', wt: 2 }
        ]
      },
      {
        id: 10018,
        name: 'Rose',
        url: '/rose',
        img: '/rose/img/preview.jpg',
        detail: 'Mathematical Roses. Maurer Roses.',
        rank: 3,
        date: 'Oct 27 2019', 
        tags: [
          { tag: 'rose', wt: 3 }, 
          { tag: 'maurer', wt: 2 }, 
          { tag: 'curve', wt: 1 }
        ]
      },
      {
        id: 10019,
        name: 'Fractal Hands',
        url: '/fractal-hands',
        img: '/fractal-hands/img/preview.jpg',
        detail: 'Remember Doctor Strange?',
        rank: 3,
        date: 'Oct 27 2019', 
        tags: [
          { tag: 'fractal', wt: 3 }, 
          { tag: 'hand', wt: 2 }, 
          { tag: 'original', wt: 2 }, 
          { tag: 'film', wt: 2 }
        ]
      },
      {
        id: 10020,
        name: 'Simulated Combat',
        url: '/simulated-combat',
        img: '/simulated-combat/img/preview.gif',
        detail: 'MCU with DC characters',
        rank: 1,
        date: 'Dec 23 2019', 
        tags: [
          { tag: 'combat', wt: 3 }, 
          { tag: 'mcu', wt: 2 }, 
          { tag: 'original', wt: 2 }, 
          { tag: 'film', wt: 2 }, 
          { tag: 'sprite', wt: 1 }, 
          { tag: 'sim', wt: 1 }
        ]
      },
      {
        id: 10021,
        name: 'Terrains',
        url: '/terrains',
        img: '/terrains/img/preview.jpg',
        detail: 'Terrain Generation.',
        rank: 3,
        date: 'Dec 29 2019', 
        tags: [
          { tag: 'terrain', wt: 5 }, 
          { tag: 'perlin noise', wt: 2 }, 
          { tag: '3d', wt: 1 }, 
          { tag: 'sim', wt: 1 }
        ]
      },
      {
        id: 10022,
        name: 'Kinematics',
        url: '/kinematics',
        img: '/kinematics/img/preview.jpg',
        detail: 'How does your arm move?',
        rank: 4,
        date: 'Jan 15 2020', 
        tags: [
          { tag: 'kinematics', wt: 5 }, 
          { tag: 'interactive', wt: 1 }
        ]
      },
      {
        id: 10023,
        name: 'Rorschach',
        url: '/rorschach',
        img: '/rorschach/img/preview.jpg',
        detail: 'Rorschach from Watchmen.',
        rank: 2,
        date: 'Jan 15 2020', 
        tags: [
          { tag: 'rorschach', wt: 5 }, 
          { tag: 'perlin noise', wt: 2 }, 
          { tag: 'original', wt: 2 }, 
          { tag: 'rainfall', wt: 1 },
          { tag: 'film', wt: 2 }, 
          { tag: 'artwork', wt: 1 }
        ]
      },
      {
        id: 10024,
        name: 'Game Of Life',
        url: '/game-of-life',
        img: '/game-of-life/img/preview.jpg',
        detail: 'Conways Game of Life.',
        rank: 3,
        date: 'Jan 19 2020', 
        tags: [
          { tag: 'automata', wt: 3 }
        ]
      },
      {
        id: 10025,
        name: 'Creatures',
        url: '/creatures',
        img: '/creatures/img/preview.jpg',
        detail: 'Electronic Creatures.',
        rank: 2,
        date: 'Mar 1 2020', 
        tags: [
          { tag: 'creature', wt: 5 }, 
          { tag: 'sim', wt: 1 }, 
          { tag: 'original', wt: 2 }, 
          { tag: 'interactive', wt: 2 }
        ]
      },
      {
        id: 10026,
        name: 'Tree Space Colonization',
        url: '/space-colonization',
        img: '/space-colonization/img/preview.jpg',
        detail: 'Generate Tree using Space Colonization Algorithm.',
        rank: 3,
        date: 'Apr 18 2020', 
        tags: [
          { tag: 'colonization', wt: 3 }, 
          { tag: 'tree', wt: 3 }, 
          { tag: 'space', wt: 2 }, 
          { tag: 'quadtree', wt: 1 }, 
          { tag: 'visualization', wt: 2 }
        ]
      },
      {
        id: 10027,
        name: 'Special Effects',
        url: '/special-effects',
        img: '/special-effects/img/preview.jpg',
        detail: 'Effects of and on Environment.',
        rank: 3,
        date: 'Oct 16 2020', 
        tags: [
          { tag: 'sim', wt: 1 }, 
          { tag: 'perlin noise', wt: 2 }, 
          { tag: 'interactive', wt: 2 }, 
          { tag: 'nature', wt: 1 }
        ]
      },
      {
        id: 10028,
        name: 'Electronic Life',
        url: '/electronic-life',
        img: '/electronic-life/img/preview.jpg',
        detail: 'Electronic Creatures given some intelligence to survive in artificial world.',
        rank: 1,
        date: 'Nov 16 2020', 
        tags: [
          { tag: 'sim', wt: 1 }, 
          { tag: 'creature', wt: 3 }, 
          { tag: 'intelligence', wt: 2 }, 
          { tag: 'statistics', wt: 1 }
        ]
      },
      {
        id: 10029,
        name: 'Travelling Salesman Problem',
        url: '/travelling-salesman-problem',
        img: '/travelling-salesman-problem/img/preview.jpg',
        detail: 'Travelling Salesman Algorithm Visualizations.',
        rank: 3,
        date: 'Dec 6 2020', 
        tags: [
          { tag: 'visualization', wt: 1 }, 
          { tag: 'tsp', wt: 3 }, 
          { tag: 'genetic algorithm', wt: 2 }, 
          { tag: 'dynamic programming', wt: 2 }
        ]
      },
      {
        id: 1001,
        name: 'Pigeon Parser',
        url: '/pigeon-parser',
        img: '/pigeon-parser/img/preview.jpg',
        detail: 'Pigeons and Chess.',
        tags: [],
        internal: true,
        date: 'Mar 24 2021'
      },
      {
        id: 10030,
        name: 'Intelligence Question?',
        url: '/sim-intel',
        img: '/sim-intel/img/preview.jpg',
        detail: 'IQ evolution across multiple generations.',
        rank: 2,
        date: 'Mar 24 2021', 
        tags: [
          { tag: 'statistics', wt: 3 }, 
          { tag: 'sim', wt: 1 }, 
          { tag: 'original', wt: 2 }
        ]
      },
      {
        id: 10031,
        name: 'Tron Cycle',
        url: '/tron-cycle',
        img: '/tron-cycle/img/preview.jpg',
        detail: 'Light Cycle Battle Game.',
        rank: 1,
        date: 'Mar 31 2021', 
        tags: [
          { tag: 'tron', wt: 5 }, 
          { tag: 'game', wt: 2 }, 
          { tag: 'film', wt: 2 }, 
          { tag: 'intelligence', wt: 1 }
        ]
      },
      {
        id: 10032,
        name: 'Holi Special',
        url: '/holi-special',
        img: '/holi-special/img/preview.jpg',
        detail: 'Celebrate with digital colors.',
        rank: 4,
        date: 'Mar 31 2021', 
        tags: [
          { tag: 'holi', wt: 5 }, 
          { tag: 'color', wt: 3 }, 
          { tag: 'original', wt: 2 }, 
          { tag: 'interactive', wt: 2 }, 
          { tag: 'artwork', wt: 1 }
        ]
      },
      {
        id: 10033,
        name: 'Mandelbrot Set',
        url: '/mandelbrot-set',
        img: '/mandelbrot-set/img/preview.jpg',
        detail: 'Mandelbrot Set, Julia Set.',
        rank: 3,
        date: 'May 16 2021', 
        tags: [
          { tag: 'mandelbrot', wt: 5 }, 
          { tag: 'complex plane', wt: 2 }, 
          { tag: 'julia', wt: 2 }, 
          { tag: 'fractal', wt: 1 }, 
          { tag: 'visualization', wt: 2 }
        ]
      },
      {
        id: 10034,
        name: 'Lorenz System',
        url: '/lorenz-system',
        img: '/lorenz-system/img/preview.jpg',
        detail: 'Lorenz Attractor and other strange attractors.',
        rank: 3,
        date: 'May 16 2021', 
        tags: [
          { tag: 'lorenz', wt: 5 }, 
          { tag: 'curve', wt: 3 }, 
          { tag: '3d', wt: 1 }, 
          { tag: 'interactive', wt: 1 }, 
          { tag: 'chen', wt: 1 }, 
          { tag: 'dadras', wt: 1 }, 
          { tag: 'thomas', wt: 1 }, 
          { tag: 'aizawa', wt: 1 }, 
          { tag: 'rossler', wt: 1 }, 
          { tag: 'halvorsen', wt: 1 }, 
          { tag: 'rabinovich fabrikant', wt: 1 }, 
          { tag: 'sprott', wt: 1 }
        ]
      },
      {
        id: 1002,
        name: 'Quadtree Visualization',
        url: '/quadtree-visualization',
        img: '/quadtree-visualization/img/preview.jpg',
        detail: 'Visualizing a Quadtree.',
        tags: [],
        date: 'May 29 2021',
        internal: true
      },
      {
        id: 10035,
        name: 'The M-Phone',
        url: '/sim-phone',
        img: '/sim-phone/img/preview.jpg',
        detail: 'Simulation of a Phone.',
        rank: 2,
        date: 'Jun 30 2021', 
        tags: [
          { tag: 'phone', wt: 5 }, 
          { tag: 'color', wt: 2 }, 
          { tag: 'sim', wt: 1 }, 
          { tag: 'interactive', wt: 2 }, 
          { tag: 'artwork', wt: 1 }
        ]
      },
      {
        id: 10036,
        name: 'L-Systems Revisited',
        url: '/l-systems',
        img: '/l-systems/img/preview.jpg',
        detail: 'More L-Systems explored. Old ones revisited.',
        rank: 3,
        date: 'Jun 30 2021', 
        tags: [
          { tag: 'l system', wt: 5 }, 
          { tag: 'turtle graphics', wt: 3 }, 
          { tag: 'lindenmayer', wt: 1 }, 
          { tag: 'pythagoras', wt: 1 }, 
          { tag: 'phyllotaxis', wt: 1 }, 
          { tag: 'tree', wt: 1 }, 
          { tag: 'intelligence', wt: 1 }, 
          { tag: 'curve', wt: 1 }, 
          { tag: 'circle', wt: 1 }, 
          { tag: 'square', wt: 1 }, 
          { tag: 'triangle', wt: 1 }, 
          { tag: 'fractal', wt: 2 }, 
          { tag: 'cantor', wt: 1 }, 
          { tag: 'koch', wt: 1 }, 
          { tag: 'minkowski', wt: 1 }, 
          { tag: 'snowflake', wt: 1 }, 
          { tag: 'peano', wt: 1 }, 
          { tag: 'hilbert', wt: 1 }, 
          { tag: 'moore', wt: 1 }, 
          { tag: 'levy', wt: 1 }
        ]
      },
      {
        id: 10037,
        name: 'Location Based Services',
        url: '/location-based-services',
        img: '/location-based-services/img/preview.jpg',
        detail: 'Simulating a Location Based Service.',
        rank: 2,
        date: 'Jun 30 2021', 
        tags: [
          { tag: 'quadtree', wt: 2 }, 
          { tag: 'original', wt: 2 }, 
          { tag: 'sim', wt: 1 }, 
          { tag: 'phone', wt: 2 }, 
          { tag: 'hilbert', wt: 1 }, 
          { tag: 'curve', wt: 1 }, 
          { tag: 'geohash', wt: 2 }, 
          { tag: 'visualization', wt: 1 }
        ]
      },
      {
        id: 10038,
        name: 'Diffusion Limited Aggregation',
        url: '/diffusion-limited-aggregation',
        img: '/diffusion-limited-aggregation/img/preview.jpg',
        detail: 'And a Brownian Tree Snowflake.',
        rank: 3,
        date: 'Jul 31 2021', 
        tags: [
          { tag: 'snowflake', wt: 1 }, 
          { tag: 'fractal', wt: 2 }, 
          { tag: 'tree', wt: 1 }, 
          { tag: 'brownian', wt: 1 }, 
          { tag: 'quadtree', wt: 2 }, 
          { tag: 'visualization', wt: 1 }
        ]
      },
      {
        id: 1003,
        name: 'Babylon Demo',
        url: '/demo-babylon',
        img: '/demo-babylon/img/preview.jpg',
        detail: 'Just a Demo on Babylon JS.',
        tags: [],
        internal: true,
        date: 'Jul 31 2021'
      },
      {
        id: 10039,
        name: 'Planetary System - 3D',
        url: '/planetary-system-3d',
        img: '/planetary-system-3d/img/preview.jpg',
        detail: 'A simulation of a Planetary System in 3D.',
        rank: 4,
        date: 'Jul 31 2021', 
        tags: [
          { tag: 'planet', wt: 5 }, 
          { tag: 'space', wt: 3 }, 
          { tag: 'interactive', wt: 1 }, 
          { tag: '3d', wt: 2 }, 
          { tag: 'sim', wt: 2 }
        ]
      },
      {
        id: 10040,
        name: 'Autonomous Steering Agents',
        url: '/autonomous-steering-agents',
        img: '/autonomous-steering-agents/img/preview.jpg',
        detail: 'Simulations based on the awesome Craig Reynolds paper.',
        rank: 3,
        date: 'Oct 23 2021', 
        tags: [
          { tag: 'steer', wt: 3 }, 
          { tag: 'interactive', wt: 2 }, 
          { tag: 'sim', wt: 1 }, 
          { tag: 'perlin noise', wt: 1 }, 
          { tag: 'intelligence', wt: 1 }
        ]
      },
      {
        id: 10041,
        name: 'Diwali Special',
        url: '/diwali-special',
        img: '/diwali-special/img/preview.jpg',
        detail: 'Celebrate with digital fireworks.',
        rank: 2,
        date: 'Oct 28 2021', 
        tags: [
          { tag: 'diwali', wt: 5 }, 
          { tag: 'firework', wt: 3 }, 
          { tag: 'original', wt: 2 }, 
          { tag: 'artwork', wt: 2 }, 
          { tag: 'mcu', wt: 2 }
        ]
      },
      {
        id: 1004,
        name: 'Octree Visualization',
        url: '/octree-visualization',
        img: '/octree-visualization/img/preview.jpg',
        detail: 'Visualizing an Octtree.',
        tags: [],
        date: 'Nov 27 2021',
        internal: true
      },
      {
        id: 10042,
        name: 'Tree Space Colonization - 3D',
        url: '/space-colonization-3d',
        img: '/space-colonization-3d/img/preview.jpg',
        detail: 'Generate Tree using Space Colonization Algorithm in 3D.',
        rank: 3,
        date: 'Nov 27 2021', 
        tags: [
          { tag: 'colonization', wt: 3 }, 
          { tag: 'tree', wt: 3 }, 
          { tag: 'space', wt: 2 }, 
          { tag: 'octree', wt: 1 }, 
          { tag: 'visualization', wt: 2 }, 
          { tag: '3d', wt: 2 }, 
          { tag: 'interactive', wt: 1 }
        ]
      },
      {
        id: 10043,
        name: 'Air Base B',
        url: '/air-base-b',
        img: '/air-base-b/img/preview.jpg',
        detail: 'Defend the Air Base at all costs!',
        rank: 1,
        date: 'Dec 25 2021', 
        tags: [
          { tag: 'steer', wt: 3 }, 
          { tag: 'game', wt: 2 }, 
          { tag: 'original', wt: 2 }
        ]
      },
      {
        id: 10044,
        name: 'Sudoku Solver',
        url: '/sudoku-solver',
        img: '/sudoku-solver/img/preview.jpg',
        detail: 'As the name suggests...',
        rank: 4,
        date: 'Dec 25 2021', 
        tags: [
          { tag: 'backtracking', wt: 2 }, 
          { tag: 'visualization', wt: 1 }
        ]
      },
      {
        id: 10045,
        name: 'Sliding Puzzle',
        url: '/sliding-puzzle',
        img: '/sliding-puzzle/img/preview.jpg',
        detail: 'An old classic',
        rank: 4,
        date: 'Mar 20 2022', 
        tags: [
          { tag: 'artwork', wt: 3 }, 
          { tag: 'game', wt: 1 }
        ]
      },
      {
        id: 10046,
        name: 'Aquarium',
        url: '/aquarium',
        img: '/aquarium/img/preview.jpg',
        detail: 'Something soothing about this.',
        rank: 4,
        date: 'Mar 20 2022', 
        tags: [
          { tag: 'steer', wt: 3 }, 
          { tag: 'creature', wt: 2 }, 
          { tag: 'sim', wt: 1 }
        ]
      },
      {
        id: 10047,
        name: 'Logo Interpreter',
        url: '/logo-interpreter',
        img: '/logo-interpreter/img/preview.jpg',
        detail: 'Logo the Language.',
        rank: 2,
        date: 'Mar 20 2022', 
        tags: [
          { tag: 'turtle graphics', wt: 3 }, 
          { tag: 'intelligence', wt: 2 }, 
          { tag: 'interactive', wt: 1 }
        ]
      },
      {
        id: 10048,
        name: 'Another Holi Special',
        url: '/another-holi-special',
        img: '/another-holi-special/img/preview.jpg',
        detail: 'Celebrate with digital balloons.',
        rank: 4,
        date: 'Mar 20 2022', 
        tags: [
          { tag: 'holi', wt: 5 }, 
          { tag: 'color', wt: 3 }, 
          { tag: 'original', wt: 2 }, 
          { tag: 'game', wt: 2 }, 
          { tag: 'artwork', wt: 1 }, 
          { tag: 'sprite', wt: 1 }
        ]
      },
      {
        id: 1005,
        name: 'VS 50 Demo - Environment',
        url: '/vs-50-demo-env',
        img: '/vs-50-demo-env/img/preview.jpg',
        detail: 'Environment Demo.',
        tags: [],
        date: 'Feb 6 2023',
        internal: true
      },
      {
        id: 1006,
        name: 'VS 50 Demo - Speed Lines',
        url: '/vs-50-demo-speed-lines',
        img: '/vs-50-demo-speed-lines/img/preview.jpg',
        detail: 'Speed Lines Demo.',
        tags: [],
        date: 'Feb 6 2023',
        internal: true
      },
      {
        id: 1007,
        name: 'VS 50 Demo - Character Animation',
        url: '/vs-50-demo-character-animation',
        img: '/vs-50-demo-character-animation/img/preview.jpg',
        detail: 'Character Animation Demo.',
        tags: [],
        date: 'Feb 6 2023',
        internal: true
      },
      {
        id: 1008,
        name: 'VS 50 - Calculator',
        url: '/vs-50-calculator',
        img: '/vs-50-calculator/img/preview.jpg',
        detail: 'Calculator for attributes.',
        tags: [],
        date: 'Feb 6 2023',
        internal: true
      }, 
      {
        id: 10049,
        name: 'VS 50',
        url: '/vs-50',
        img: '/vs-50/img/animatedPreview.gif',
        detail: 'Celebrating the 50th Page',
        rank: 1,
        date: 'Feb 6 2023', 
        tags: [
          { tag: 'steer', wt: 1 }, 
          { tag: 'mcu', wt: 1 }, 
          { tag: 'original', wt: 2 }, 
          { tag: 'game', wt: 2 }, 
          { tag: 'artwork', wt: 3 }, 
          { tag: 'sprite', wt: 2 }, 
          { tag: 'combat', wt: 3 }, 
          { tag: 'intelligence', wt: 1 }
        ]
      },
      {
        id: 10050,
        name: 'Matrix City',
        url: '/matrix-city',
        img: '/matrix-city/img/preview.jpg',
        detail: 'A City in the Matrix - Pure CSS Animation!!',
        rank: 3,
        date: 'Apr 2023', 
        tags: [
          { tag: 'matrix', wt: 5 }, 
          { tag: 'rainfall', wt: 1 },
          { tag: 'film', wt: 2 }, 
          { tag: 'artwork', wt: 2 }, 
          { tag: 'no lib', wt: 3 }
        ]
      },
      {
        id: 10051,
        name: 'Ascii Galaxian',
        url: '/ascii-galaxian',
        img: '/ascii-galaxian/img/preview.jpg',
        detail: 'Galaxian game with ascii characters - Canvas less Animation!!',
        rank: 3,
        date: 'Apr 2023', 
        tags: [
          { tag: 'game', wt: 2 }, 
          { tag: 'combat', wt: 3 }, 
          { tag: 'no lib', wt: 3 }
        ]
      }
    ];

    this._pagesMap = {};
    this._allPagesId = [];
    this._publishedPagesId = [];
    this._pages
        .forEach(p => {
          this._pagesMap[p.id] = p;
          this._allPagesId.push(p.id);
          if (!p.internal) {
            this._publishedPagesId.push(p.id);
          }
        });

    this._latest = [10050, 10051];
  }

  getPageById(pageId) {
    let base = this.getBase();
    return {
      id: this._pagesMap[pageId].id,
      name: this._pagesMap[pageId].name,
      url: base+this._pagesMap[pageId].url,
      img: base+this._pagesMap[pageId].img,
      detail: this._pagesMap[pageId].detail,
      date: this._pagesMap[pageId].date,
      rank: this._pagesMap[pageId].rank,
      tag: this._pagesMap[pageId].tag,
      tags: this._pagesMap[pageId].tags,
      tags: this._pagesMap[pageId].tags,
      processedTags: this._pagesMap[pageId].processedTags,
      internal: this._pagesMap[pageId].internal
    };
  }

  getBase() {
    let hostname = window.location.hostname;
    return hostname.includes('github') ? '/Mesmerize' : '';
  }

  getAllPagesId() {
    return this._allPagesId;
  }

  getPublishedPagesId() {
    return this._publishedPagesId;
  }

}

export let pages = new Pages();