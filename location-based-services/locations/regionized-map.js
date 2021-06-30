class RegionizedMap {

  constructor(bg) {
    this._bg = bg;
    this._denseRegions = [];
    this._normalRegions = [];
    this._noMansRegions = [];
  }

  static mapBuilder(mapData) {
    let map = new RegionizedMap(loadImage(mapData.bg));
    for (let regionData of mapData.regions) {
      let subRegions = [];
      for (let subregionData of regionData.subregions) {
        switch (subregionData.type) {
          case SubRegion.TRI:
            subRegions.push(new TriangleSubRegion(subregionData.vertices));
            break;
          case SubRegion.RECT:
            subRegions.push(new RectangleSubRegion(subregionData.vertices));
            break;
          case SubRegion.ELL:
            subRegions.push(new EllipseSubRegion(subregionData.vertices));
            break;
        }
      }
      switch(regionData.type) {
        case Region.DENSE:
          map._denseRegions.push(new Region(subRegions));
          break;
        case Region.NORMAL:
          map._normalRegions.push(new Region(subRegions));
          break;
        case Region.NO_MANS:
          map._noMansRegions.push(new Region(subRegions));
          break;
      }
    }
    return map;
  }

  render() {
    background(this._bg);
  }

  showDenseRegions() {
    this._denseRegions.forEach(r => r.render(SketchColor.red().alpha(0.3).stringify()));
  }

  showNormalRegions() {
    this._normalRegions.forEach(r => r.render(SketchColor.yellow().alpha(0.4).stringify()));
  }

  showNoMansRegions() {
    this._noMansRegions.forEach(r => r.render(SketchColor.blue().stringify()));
  }
  
}

RegionizedMap.SCALE = 50;

class Region {
  constructor(subRegions) {
    this._subRegions = subRegions;
    this._roundRobinIndex = 0;
  }

  render(color) {
    this._subRegions.forEach(sr => sr.render(color));
  }

  randomPointInRegion() {
    return this._subRegions[(this._roundRobinIndex++) % this._subRegions.length].randomPointInSubRegion();
  }

  pointInRegion(point) {
    return this._subRegions.some(sr => sr.pointInSubRegion(point));
  }
}

Region.DENSE = 'dns';
Region.NORMAL = 'nrl';
Region.NO_MANS = 'nmn'

class SubRegion {

  constructor(shape, vertices) {
    if (!SubRegion.VERTICES_MAP.has(shape) || SubRegion.VERTICES_MAP.get(shape) != vertices.length) {
      console.error('Illegal Subregion construction attempted.');
    }
    this._shape = shape;
    this._vertices = vertices.map( v => createVector(v[0], v[1]) )
  }

  render(color) {
    noStroke();
    fill(color);
    this.drawShape();
  }
}

class TriangleSubRegion extends SubRegion {
  constructor(vertices) {
    super(SubRegion.TRI, vertices);
  }

  drawShape() {
    triangle(this._vertices[0].x, this._vertices[0].y, this._vertices[1].x, this._vertices[1].y, 
      this._vertices[2].x, this._vertices[2].y);
  }

  randomPointInSubRegion() {
    let r1 = random(), r2 = random();
    let sqrtR1 = Math.sqrt(r1);
    let x = Math.round( (1 - sqrtR1) * this._vertices[0].x + (sqrtR1 * (1 - r2)) * this._vertices[1].x 
      + (sqrtR1 * r2) * this._vertices[2].x );
    let y = Math.round( (1 - sqrtR1) * this._vertices[0].y + (sqrtR1 * (1 - r2)) * this._vertices[1].y 
      + (sqrtR1 * r2) * this._vertices[2].y );
    return createVector(x, y);
  }

  pointInSubRegion(pt) {
    let triangleArea = (a, b, c) => Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);
    let abc = triangleArea(this._vertices[0], this._vertices[1], this._vertices[2]);
    let pbc = triangleArea(pt, this._vertices[1], this._vertices[2]);
    let apc = triangleArea(this._vertices[0], pt, this._vertices[2]);
    let abp = triangleArea(this._vertices[0], this._vertices[1], pt);
    return (abc == (pbc + apc + abp));
  }
}

class RectangleSubRegion extends SubRegion {
  constructor(vertices) {
    super(SubRegion.RECT, vertices);
  }

  drawShape() {
    rect(this._vertices[0].x, this._vertices[0].y, 
      this._vertices[1].x - this._vertices[0].x, 
      this._vertices[1].y - this._vertices[0].y)
  }

  randomPointInSubRegion() {
    return createVector(
      Math.round(random(this._vertices[0].x, this._vertices[1].x)), 
      Math.round(random(this._vertices[0].y, this._vertices[1].y))
    );
  }

  pointInSubRegion(pt) {
    return this._vertices[0].x <= pt.x && this._vertices[1].x >= pt.x 
      && this._vertices[0].y <= pt.y && this._vertices[1].y >= pt.y;
  }

}

class EllipseSubRegion extends SubRegion {
  constructor(vertices) {
    super(SubRegion.ELL, vertices);
  }

  drawShape() {
    ellipse(this._vertices[0].x, this._vertices[0].y, this._vertices[1].x, this._vertices[1].y);
  }

  randomPointInSubRegion() {
    let a = random(0, TWO_PI);
    let r = this._vertices[1].x/2 * sqrt(random(0,1));
    return createVector(
      this._vertices[0].x + r * cos(a), 
      this._vertices[0].y + (this._vertices[1].y / this._vertices[1].x) * r * sin(a)
    );
  }

}

SubRegion.RECT = 'r';
SubRegion.TRI = 't';
SubRegion.ELL = 'e';
SubRegion.VERTICES_MAP = new Map([
  [SubRegion.RECT, 2], 
  [SubRegion.TRI, 3],
  [SubRegion.ELL, 2]
]);