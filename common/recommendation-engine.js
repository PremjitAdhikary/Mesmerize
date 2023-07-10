import { pages } from './pages.js';

class ATag {

  constructor(name, description, parent = null) {
    this.name = name;
    this.description = description;
    this.parent = parent;
    this.idf = 0;
    this.count = 0;
  }

}

/**
 * Contains logic to generate recommendations for similar pages
 * 
 * searchAndOrderPagesByTagsFor() is the method to invoke
 * 
 * To add a new tag, add it in setupTagsMap()
 */
class RecommendationEngine {

  constructor() {
    this.setupTagsMap();
    this.calculateIdf();
    this.tagsProcessor();
  }

  searchAndOrderPagesByTagsFor(pageId) {
    let scoreMap = new Map();
    if (!this.pageTagsMap.has(Number(pageId))) return [];
    this.pageTagsMap.get(Number(pageId)).forEach(tag => {
      pages._pages
        .filter(p => !p.internal && p.id != Number(pageId) 
          && this.pageTagsMap.get(p.id).some(t => t.name == tag.name))
        .forEach(p => {
          let pageTag = this.pageTagsMap.get(p.id).find(t => t.name == tag.name);
          if (!scoreMap.has(p.id)) 
            scoreMap.set(p.id, { total: 0, matchedTags: [] });
          scoreMap.get(p.id).total += 
            ((tag.wt + pageTag.wt) * this.tagsMap.get(tag.name).idf);
          scoreMap.get(p.id).matchedTags.push(pageTag);
        });
    });
    let orderedPages = [];
    Array.from(scoreMap.keys())
      .sort((a, b) => scoreMap.get(b).total - scoreMap.get(a).total)
      .forEach(pid => orderedPages.push({
        id: pid, 
        matchedTags: scoreMap.get(pid).matchedTags.sort((a, b) => 
          (b.wt * b.idf) - (a.wt * a.idf)), 
        total: scoreMap.get(pid).total
      }))
    return orderedPages;
  }

  // internal methods
  calculateIdf() {
    let totalCount = 0;
    pages._pages
      .filter(p => !p.internal)
      .map(p => p.tags)
      .forEach(tags => 
        tags.forEach(t => {
          if (this.tagsMap.has(t.tag)) {
            this.tagsMap.get(t.tag).count++;
            totalCount++;
          } else {
            console.error('tag absent in list: ' + t.tag);
          }
        }) 
      );
    for (let tag of this.tagsMap.values()) 
      tag.idf = Math.log10(tag.count == 0 ? totalCount : totalCount/tag.count);
  }

  tagsProcessor() {
    this.pageTagsMap = new Map();
    pages._pages
      .filter(p => !p.internal)
      .forEach(page => {
        let processedTags = [];
        this.transferTags(page.tags, processedTags);
        this.addParentTags(processedTags);
        this.pageTagsMap.set(page.id, processedTags);
      });
  }

  transferTags(tags, processedTags) {
    tags.forEach(tag => processedTags.push({
      name: tag.tag, wt: tag.wt, 
      description: this.descriptionGenerator(this.tagsMap.get(tag.tag))
    }));
  }

  descriptionGenerator(tag) {
    return ((Math.random() * 10 >= 5) ? 
      RecommendationEngine.PREFIX + ' ' + tag.description : 
      tag.description + ' ' + RecommendationEngine.SUFFIX);
  }

  addParentTags(tags) {
    let tagsWithParent = tags.filter(tag => this.tagsMap.get(tag.name).parent);
    for (let child of tagsWithParent) {
      while (this.tagsMap.get(child.name).parent) {
        let parent = this.tagsMap.get(child.name).parent;
        if (!tags.some(tag => tag.name == parent.name)) 
          tags.push({
            name: parent.name, wt: 0, 
            description: this.descriptionGenerator(parent)
          });
        let t = tags.find(tag => tag.name == parent.name);
        t.wt += child.wt/4;
        child = t;
      }
    }
  }

  setupTagsMap() {
    this.tagsMap = new Map();
    let math = new ATag('math', 'mathematical concepts utilized');
    this.tagsMap.set('math', math);
    this.tagsMap.set('pythagoras', new ATag('pythagoras', 'pythagorean formula utilized', math));
    this.tagsMap.set('prime', new ATag('prime', 'prime numbers are featured', math));
    this.tagsMap.set('statistics', new ATag('statistics', 'some statistics is featured', math));
    this.tagsMap.set('complex plane', new ATag('complex plane', 'Complex Plane concepts utilized', math));
    
    let geometry = new ATag('geometry', 'geometric Shapes heavily utilized', math);
    this.tagsMap.set('geometry', geometry);
    this.tagsMap.set('curve', new ATag('curve', 'utilization of curve(s) are present', geometry));
    this.tagsMap.set('circle', new ATag('circle', 'utilization of circle(s) are present', geometry));
    this.tagsMap.set('spiral', new ATag('spiral', 'utilization of spiral(s) are present', geometry));
    this.tagsMap.set('square', new ATag('square', 'utilization of square(s) are present', geometry));
    this.tagsMap.set('triangle', new ATag('triangle', 'utilization of triangle(s) are present', geometry));
    this.tagsMap.set('fractal', new ATag('fractal', 'utilization of fractal(s) are present', geometry));
    this.tagsMap.set('snowflake', new ATag('snowflake', 'utilization of snowflake(s) are present', geometry));
    this.tagsMap.set('polygon', new ATag('polygon', 'utilization of polygon(s) are present', geometry));
    
    let trigonometry = new ATag('trigonometry', 'trigonometric functions heavily utilized', math);
    this.tagsMap.set('trigonometry', trigonometry);
    this.tagsMap.set('wave', new ATag('wave', 'utilization of wave(s) are present', trigonometry));
    
    let physics = new ATag('physics', 'concepts from Physics are applied');
    this.tagsMap.set('physics', physics);
    this.tagsMap.set('kinematics', new ATag('kinematics', 'kinematics motion is showcased', physics));
    this.tagsMap.set('steer', new ATag('steer', 'steering motion are applied', physics));
    this.tagsMap.set('pendulum', new ATag('pendulum', 'pendulum behaviour implemented', physics));
    
    let algorithm = new ATag('algorithm', 'algorithmic solutions are implemented');
    this.tagsMap.set('algorithm', algorithm);
    this.tagsMap.set('sort', new ATag('sort', 'sorting is implemented', algorithm));
    this.tagsMap.set('perlin noise', new ATag('perlin noise', 'perlin noise is utilized', algorithm));
    this.tagsMap.set('colonization', new ATag('colonization', 'colonization is showcased', algorithm));
    this.tagsMap.set('genetic algorithm', new ATag('genetic algorithm', 'genetic algorithm is utilized', algorithm));
    this.tagsMap.set('tsp', new ATag('tsp', 'travelling salesman problem is solved', algorithm));
    this.tagsMap.set('geohash', new ATag('geohash', 'geohash algorithm is utilized', algorithm));
    this.tagsMap.set('backtracking', new ATag('backtracking', 'backtracking algorithm is utilized', algorithm));
    this.tagsMap.set('dynamic programming', new ATag('dynamic programming', 'dynamic programming is utilized', algorithm));

    let dataStructure = new ATag('data structure', 'data structures centric solutions are implemented', algorithm);
    this.tagsMap.set('data structure', dataStructure);
    this.tagsMap.set('quadtree', new ATag('quadtree', 'quadtree implementation is present', dataStructure));
    this.tagsMap.set('octree', new ATag('octree', 'octree implementation is present', dataStructure));

    let nature = new ATag('nature', 'nature inspired elements are present');
    this.tagsMap.set('nature', nature);
    this.tagsMap.set('phyllotaxis', new ATag('phyllotaxis', 'phyllotaxis pattern is present', nature));
    this.tagsMap.set('tree', new ATag('tree', 'tree structures are heavily utilized', nature));
    this.tagsMap.set('rainfall', new ATag('rainfall', 'rainfall inspired graphics are present', nature));
    this.tagsMap.set('fern', new ATag('fern', 'fern patterns are utilized', nature));
    this.tagsMap.set('rose', new ATag('rose', 'rose pattern is present', nature));
    this.tagsMap.set('hand', new ATag('hand', 'hand pattern is present', nature));
    this.tagsMap.set('creature', new ATag('creature', 'creatures are showcased', nature));

    let festival = new ATag('festival', 'a festival is featured');
    this.tagsMap.set('festival', festival);
    this.tagsMap.set('holi', new ATag('holi', 'holi festival is featured', festival));
    this.tagsMap.set('diwali', new ATag('diwali', 'diwali festival is featured', festival));

    let technical = new ATag('technical', 'a technical solution is implemented');
    this.tagsMap.set('technical', technical);
    this.tagsMap.set('l system', new ATag('l system', 'l system is implemented', technical));
    this.tagsMap.set('turtle graphics', new ATag('turtle graphics', 'turtle graphics engine does the rendering', technical));
    this.tagsMap.set('intelligence', new ATag('intelligence', 'some intelligence is encoded', technical));
    this.tagsMap.set('sim', new ATag('sim', 'a simulation is featured', technical));
    this.tagsMap.set('automata', new ATag('automata', 'automata concepts feature', this.tagsMap.get('sim')));

    let art = new ATag('art', 'artistic flavors present');
    this.tagsMap.set('art', art);
    this.tagsMap.set('color', new ATag('color', 'lots of color play is involved', art));
    this.tagsMap.set('sprite', new ATag('sprite', 'sprites are utilized', art));
    this.tagsMap.set('artwork', new ATag('artwork', 'some artwork is done and featured', art));
    
    // by names
    this.tagsMap.set('maeda', new ATag('maeda', 'references of John Maeda'));
    this.tagsMap.set('lissajous', new ATag('lissajous', 'Lissajous figure implemented'));
    this.tagsMap.set('bowditch', new ATag('bowditch', 'Bowditch figure implemented'));
    this.tagsMap.set('fourier', new ATag('fourier', 'references of Fourier'));
    this.tagsMap.set('cantor', new ATag('cantor', 'references of Cantor'));
    this.tagsMap.set('vicsek', new ATag('vicsek', 'references of Vicsek'));
    this.tagsMap.set('koch', new ATag('koch', 'references of Koch'));
    this.tagsMap.set('cesaro', new ATag('cesaro', 'references of Cesaro'));
    this.tagsMap.set('minkowski', new ATag('minkowski', 'references of Minkowski'));
    this.tagsMap.set('sierpinski', new ATag('sierpinski', 'references of Sierpinski'));
    this.tagsMap.set('lindenmayer', new ATag('lindenmayer', 'references of Lindenmayer'));
    this.tagsMap.set('barnsley', new ATag('barnsley', 'references of Barnsley'));
    this.tagsMap.set('maurer', new ATag('maurer', 'references of Maurer'));
    this.tagsMap.set('rorschach', new ATag('rorschach', 'references of Rorschach'));
    this.tagsMap.set('mandelbrot', new ATag('mandelbrot', 'references of Mandelbrot'));
    this.tagsMap.set('julia', new ATag('julia', 'references of Julia'));
    this.tagsMap.set('lorenz', new ATag('lorenz', 'references of Lorenz'));
    this.tagsMap.set('chen', new ATag('chen', 'references of Chen'));
    this.tagsMap.set('dadras', new ATag('dadras', 'references of Dadras'));
    this.tagsMap.set('thomas', new ATag('thomas', 'references of Thomas'));
    this.tagsMap.set('aizawa', new ATag('aizawa', 'references of Aizawa'));
    this.tagsMap.set('rossler', new ATag('rossler', 'references of Rossler'));
    this.tagsMap.set('halvorsen', new ATag('halvorsen', 'references of Halvorsen'));
    this.tagsMap.set('rabinovich fabrikant', new ATag('rabinovich fabrikant', 'references of Rabinovich Fabrikant'));
    this.tagsMap.set('sprott', new ATag('sprott', 'references of Sprott'));
    this.tagsMap.set('peano', new ATag('peano', 'references of Peano'));
    this.tagsMap.set('hilbert', new ATag('hilbert', 'references of Hilbert'));
    this.tagsMap.set('moore', new ATag('moore', 'references of Moore'));
    this.tagsMap.set('levy', new ATag('levy', 'references of Levy'));
    this.tagsMap.set('brownian', new ATag('brownian', 'references of Brownian'));
    
    // miscelleneous
    this.tagsMap.set('clock', new ATag('clock', 'a clock implementation is present'));
    this.tagsMap.set('space', new ATag('space', 'space is showcased'));
    this.tagsMap.set('matrix', new ATag('matrix', 'matrix inspired graphics are present'));
    this.tagsMap.set('film', new ATag('film', 'film inspired elements are present'));
    this.tagsMap.set('logo', new ATag('logo', 'Mesmerize logo featured'));
    this.tagsMap.set('original', new ATag('original', 'original concept is presented'));
    this.tagsMap.set('visualization', new ATag('visualization', 'solution is visualized'));
    this.tagsMap.set('starfield', new ATag('starfield', 'starfield inspired graphics rendered'));
    this.tagsMap.set('3d', new ATag('3d', '3d graphics rendered'));
    this.tagsMap.set('mcu', new ATag('mcu', 'MCU (My Coding Universe) ideas (shared in more than 1 repo) present'));
    this.tagsMap.set('combat', new ATag('combat', 'combat oriented concepts'));
    this.tagsMap.set('terrain', new ATag('terrain', 'terrain is generated'));
    this.tagsMap.set('interactive', new ATag('interactive', 'lots of User Interactivity'));
    this.tagsMap.set('game', new ATag('game', 'a playable game'));
    this.tagsMap.set('phone', new ATag('phone', 'usage of Phone interface'));
    this.tagsMap.set('game', new ATag('game', 'a playable game'));
    this.tagsMap.set('firework', new ATag('firework', 'fireworks featured'));
    this.tagsMap.set('tron', new ATag('tron', 'tron inspired graphics are present'));
    this.tagsMap.set('planet', new ATag('planet', 'elements inspired by planets'));
    this.tagsMap.set('no lib', new ATag('no lib', 'there are no external libraries, pure html-js-css are used'));

  }

}

RecommendationEngine.PREFIX = 'in both the pages';
RecommendationEngine.SUFFIX = 'in both';

export let recommendationEngine = new RecommendationEngine();