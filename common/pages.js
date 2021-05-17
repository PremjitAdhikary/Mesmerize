class Pages {

  constructor() {
    this._pages = [
      {
        id: 1000,
        name: 'Demo',
        url: '/demo',
        img: '/demo/img/preview.jpg',
        detail: 'Just a Demo.',
        tag: [],
        internal: true
      },
      {
        id: 10000,
        name: 'Clock',
        url: '/clock',
        img: '/clock/img/preview.jpg',
        detail: 'Animating a clock.',
        tag: [
          'clock',
          'maeda',
          'pendulum'
        ]
      },
      {
        id: 10001,
        name: 'Lissajous Curve',
        url: '/lissajous-curve',
        img: '/lissajous-curve/img/preview.jpg',
        detail: 'Animation showing Lissajous curve adaptation!',
        tag: [
          'lissajous',
          'curve',
          'bowditch'
        ]
      },
      {
        id: 10002,
        name: 'Lissajous Curve Table',
        url: '/lissajous-curve-table',
        img: '/lissajous-curve-table/img/preview.jpg',
        detail: 'Table of curves animating around based on Lissajous equation!',
        tag: [
          'lissajous',
          'curve',
          'bowditch'
        ]
      },
      {
        id: 10003,
        name: 'Planetary System - 2D',
        url: '/planetary-system',
        img: '/planetary-system/img/preview.jpg',
        detail: 'A simulation of a Planetary System in 2D.',
        tag: [
          'space',
          'circle'
        ]
      },
      {
        id: 10004,
        name: 'Spirograph',
        url: '/spirograph',
        img: '/spirograph/img/preview.jpg',
        detail: 'A spiral with lot of circles!',
        tag: [
          'spiral',
          'circle',
          'curve'
        ]
      },
      {
        id: 10005,
        name: 'Unit Circle',
        url: '/unit-circle',
        img: '/unit-circle/img/preview.jpg',
        detail: 'Trigonometry - Sine wave, Cosine wave and the Unit Circle.',
        tag: [
          'circle',
          'curve',
          'sin',
          'cos'
        ]
      },
      {
        id: 10006,
        name: 'Fourier Series',
        url: '/fourier-series',
        img: '/fourier-series/img/preview.jpg',
        detail: 'Fourier Series - Square Waves, Sawtooth and others.',
        tag: [
          'fourier',
          'curve',
          'wave'
        ]
      },
      {
        id: 10007,
        name: 'Fractal Circles',
        url: '/fractal-circles',
        img: '/fractal-circles/img/preview.jpg',
        detail: 'Fractal Circles - Recursion in Effect.',
        tag: [
          'fractal',
          'circle'
        ]
      },
      {
        id: 10008,
        name: 'More Fractals',
        url: '/more-fractals',
        img: '/more-fractals/img/preview.jpg',
        detail: 'More Fractal Shapes - Cantor Set, Vicsek Snowflake, Koch Curves and variations.',
        tag: [
          'cantor',
          'vicsek snowflake',
          'koch curve',
          'koch snowflake',
          'cesaro snowflake',
          'minkowski curve',
          'minkowski snowflake',
          'vicsek',
          'koch',
          'cesaro',
          'minkowski',
          'fractal',
          'curve',
          'snowflake'
        ]
      },
      {
        id: 10009,
        name: 'Sierpinski Fractals',
        url: '/sierpinski-fractals',
        img: '/sierpinski-fractals/img/preview.jpg',
        detail: 'Sierpinski Triangle, Gasket, Carpet, n-gons and n-flakes.',
        tag: [
          'sierpinski triangle',
          'sierpinski gasket',
          'sierpinski carpet',
          'sierpinski ngon',
          'sierpinski nflake',
          'sierpinski',
          'fractal',
          'curve',
          'triangle',
          'polygon',
          'ngon',
          'snowflake1'
        ]
      },
      {
        id: 10010,
        name: 'Fractal Trees',
        url: '/fractal-trees',
        img: '/fractal-trees/img/preview.jpg',
        detail: 'Fractal Trees. L-Systems. Pythagorean Tree.',
        tag: [
          'fractal tree',
          'fractal',
          'l system',
          'pythagorean tree',
          'pythagoras',
          'phyllotaxis',
          'tree',
          'botany'
        ]
      },
      {
        id: 10011,
        name: 'The Matrix',
        url: '/the-matrix',
        img: '/the-matrix/img/preview.jpg',
        detail: 'The Matrix Rainfall!!',
        tag: [
          'matrix',
          'rainfall'
        ]
      },
      {
        id: 10012,
        name: 'Prime Spirals',
        url: '/prime-spirals',
        img: '/prime-spirals/img/preview.jpg',
        detail: 'The Spirals that Prime numbers make.',
        tag: [
          'spiral',
          'prime'
        ]
      },
      {
        id: 10013,
        name: 'Logo',
        url: '/logo',
        img: '/logo/img/preview.jpg',
        detail: 'Animate the Logo.',
        tag: [
          'logo',
          'original'
        ]
      },
      {
        id: 10014,
        name: 'Sort Visualization',
        url: '/sort-visualization',
        img: '/sort-visualization/img/preview.jpg',
        detail: 'Visualize different sorting algorithms.',
        tag: [
          'sort',
          'algorithm',
          'visualization',
          'curve'
        ]
      },
      {
        id: 10015,
        name: 'Starfield',
        url: '/starfield',
        img: '/starfield/img/preview.jpg',
        detail: 'Into the Space!',
        tag: [
          'starfield',
          'space',
          '3d'
        ]
      },
      {
        id: 10016,
        name: 'Fractal Spirograph',
        url: '/fractal-spirograph',
        img: '/fractal-spirograph/img/preview.jpg',
        detail: 'Fractals and Spirals!',
        tag: [
          'spiral',
          'circle',
          'fractal',
          'curve'
        ]
      },
      {
        id: 10017,
        name: 'Barnsley Fern',
        url: '/barnsley-fern',
        img: '/barnsley-fern/img/preview.jpg',
        detail: 'Barnsley fern is another fractal.',
        tag: [
          'barnsley fern',
          'fractal',
          'barnsley',
          'fern',
          'botany'
        ]
      },
      {
        id: 10018,
        name: 'Rose',
        url: '/rose',
        img: '/rose/img/preview.jpg',
        detail: 'Mathematical Roses. Maurer Roses.',
        tag: [
          'rose',
          'curve',
          'maurer'
        ]
      },
      {
        id: 10019,
        name: 'Fractal Hands',
        url: '/fractal-hands',
        img: '/fractal-hands/img/preview.jpg',
        detail: 'Remember Doctor Strange?',
        tag: [
          'fractal',
          'hand',
          'original'
        ]
      },
      {
        id: 10020,
        name: 'Simulated Combat',
        url: '/simulated-combat',
        img: '/simulated-combat/img/preview.gif',
        detail: 'MCU with DC characters',
        tag: [
          'mcu',
          'combat',
          'kombat',
          'sim',
          'original'
        ]
      },
      {
        id: 10021,
        name: 'Terrains',
        url: '/terrains',
        img: '/terrains/img/preview.jpg',
        detail: 'Terrain Generation.',
        tag: [
          'terrain',
          'perlin noise',
          '3d',
          'sim'
        ]
      },
      {
        id: 10022,
        name: 'Kinematics',
        url: '/kinematics',
        img: '/kinematics/img/preview.jpg',
        detail: 'How does your arm move?',
        tag: [
          'kinematics'
        ]
      },
      {
        id: 10023,
        name: 'Rorschach',
        url: '/rorschach',
        img: '/rorschach/img/preview.jpg',
        detail: 'Rorschach from Watchmen.',
        tag: [
          'rorschach',
          'perlin noise',
          'sim',
          'original'
        ]
      },
      {
        id: 10024,
        name: 'Game Of Life',
        url: '/game-of-life',
        img: '/game-of-life/img/preview.jpg',
        detail: 'Conways Game of Life.',
        tag: [
          'cellular automata',
          'sim'
        ]
      },
      {
        id: 10025,
        name: 'Creatures',
        url: '/creatures',
        img: '/creatures/img/preview.jpg',
        detail: 'Electronic Creatures.',
        tag: [
          'creature',
          'sim',
          'original'
        ]
      },
      {
        id: 10026,
        name: 'Tree Space Colonization',
        url: '/space-colonization',
        img: '/space-colonization/img/preview.jpg',
        detail: 'Generate Tree using Space Colonization Algorithm.',
        tag: [
          'colonization',
          'tree',
          'space',
          'botany',
          'quadtree'
        ]
      },
      {
        id: 10027,
        name: 'Special Effects',
        url: '/special-effects',
        img: '/special-effects/img/preview.jpg',
        detail: 'Effects of and on Environment.',
        tag: [
          'sim',
          'perlin noise'
        ]
      },
      {
        id: 10028,
        name: 'Electronic Life',
        url: '/electronic-life',
        img: '/electronic-life/img/preview.jpg',
        detail: 'Electronic Creatures given some intelligence to survive in artificial world.',
        tag: [
          'sim',
          'creature',
          'chartjs'
        ]
      },
      {
        id: 10029,
        name: 'Travelling Salesman Problem',
        url: '/travelling-salesman-problem',
        img: '/travelling-salesman-problem/img/preview.jpg',
        detail: 'Travelling Salesman Algorithm Visualizations.',
        tag: [
          'travelling salesman',
          'genetic algorithm',
          'algorithm',
          'visualization'
        ]
      },
      {
        id: 1001,
        name: 'Pigeon Parser',
        url: '/pigeon-parser',
        img: '/pigeon-parser/img/preview.jpg',
        detail: 'Pigeons and Chess.',
        tag: [],
        internal: true
      },
      {
        id: 10030,
        name: 'Intelligence Question?',
        url: '/sim-intel',
        img: '/sim-intel/img/preview.jpg',
        detail: 'IQ evolution across multiple generations.',
        tag: [
          'intelligence',
          'sim',
          'original'
        ]
      },
      {
        id: 10031,
        name: 'Tron Cycle',
        url: '/tron-cycle',
        img: '/tron-cycle/img/preview.jpg',
        detail: 'Light Cycle Battle Game.',
        tag: [
          'tron',
          'cycle',
          'light',
          'game'
        ]
      },
      {
        id: 10032,
        name: 'Holi Special',
        url: '/holi-special',
        img: '/holi-special/img/preview.jpg',
        detail: 'Celebrate with digital colors.',
        tag: [
          'holi',
          'festival',
          'color',
          'original'
        ]
      },
      {
        id: 10033,
        name: 'Mandelbrot Set',
        url: '/mandelbrot-set',
        img: '/mandelbrot-set/img/preview.jpg',
        detail: 'Mandelbrot Set, Julia Set.',
        tag: [
          'mandelbrot',
          'julia',
          'complex plane',
          'fractal'
        ]
      },
      {
        id: 10034,
        name: 'Lorenz System',
        url: '/lorenz-system',
        img: '/lorenz-system/img/preview.jpg',
        detail: 'Lorenz Attractor and other strange attractors.',
        tag: [
          'lorenz',
          'chen',
          'dadras',
          'thomas',
          'aizawa',
          'rossler',
          'halvorsen',
          'rabinovich fabrikant',
          'sprott',
          'four wing',
          '3d',
          'curve'
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
  }

  getPageById(pageId) {
    let base = this.getBase();
    return {
      id: this._pagesMap[pageId].id,
      name: this._pagesMap[pageId].name,
      url: base+this._pagesMap[pageId].url,
      img: base+this._pagesMap[pageId].img,
      detail: this._pagesMap[pageId].detail,
      tag: this._pagesMap[pageId].tag
    };
  }

  getBase() {
    let hostname = window.location.hostname;
    return hostname.includes('github') ? '/Mesmerize' : '';
  }

  getPageIdsByName(name) {
    return this._pages
      .filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
      .map(p => p.id);
  }

  getPageIdsByTag(tag) {
    return this._pages
      .filter(p => p.tag.find( t=> t.includes(tag.toLowerCase())))
      .map(p => p.id);
  }

  getAllPagesId() {
    return this._allPagesId;
  }

  getPublishedPagesId() {
    return this._publishedPagesId;
  }

  getSimilarPageIds(pageId) {
    let mySet = new Set();
    let myPages = this._pages;
    if (!this._pagesMap[pageId]) 
      return [];
    this._pagesMap[pageId].tag
      .forEach(t => 
        myPages
          .filter(p => p.id != pageId && p.tag.includes(t))
          .forEach(p => mySet.add(p.id))
      );
    return mySet;
  }

  allTags() {
    let tags = {};
    let totalTags = 0;
    this._pages.forEach(
      p => p.tag.forEach(
        t => {
          if (tags[t]) {
            tags[t].count++;
          } else {
            tags[t] = {count: 1};
          }
          totalTags++;
        }
      )
    );
    Object.keys(tags).forEach(k => tags[k].weight = totalTags/tags[k].count);
    return tags;
  }

}

export let pages = new Pages();