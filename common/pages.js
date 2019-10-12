class Pages {

  constructor() {
    this._pages = [
      {
        id: 10000,
        name: 'Clock',
        url: '/clock',
        img: '/clock/img/preview.jpg',
        detail: 'Animating a clock.',
        tag: [
          'clock'
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
          'curve'
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
          'curve'
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
        detail: 'Sierpinski Triangle, Sierpinski Gasket, Sierpinski Carpet.',
        tag: [
          'sierpinski triangle',
          'sierpinski gasket',
          'sierpinski carpet',
          'sierpinski',
          'fractal',
          'curve'
        ]
      },
      {
        id: 10010,
        name: 'Fractal Trees',
        url: '/fractal-trees',
        img: '/fractal-trees/img/preview.jpg',
        detail: 'Fractal Trees. L-Systems.',
        tag: [
          'fractal tree',
          'fractal',
          'l system'
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
          'logo'
        ]
      }
    ];

    this._pagesMap = {};
    this._allPagesId = [];
    this._pages
        .forEach(p => {
          this._pagesMap[p.id] = p;
          this._allPagesId.push(p.id);
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

}

export let pages = new Pages();