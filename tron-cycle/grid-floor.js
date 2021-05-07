class GridFloor {

  constructor(gameType) {
    this._lines = [];
    this.setupFloor(gameType);
  }

  show() {
    for (let line of this._lines) {
      line.show();
    }
  }

  animate() {
    for (let line of this._lines) {
      line.animate();
    }
  }

  setupFloor(gameType) {
    switch(gameType) {
      case Game.GAMETYPE.PHASER: 
        this.setupPhaserFloor();
        break;
      case Game.GAMETYPE.RINZLER: 
        this.setupRinzlerFloor();
        break;
      case Game.GAMETYPE.ONE: 
      case Game.GAMETYPE.MANY: 
        this.setupDefaultFloor();
        break;
    }
  }

  setupPhaserFloor() {
    this._lines.push(new FloorLine(createVector(0, 64), ['10o', '3e', '6o'], orange));
    this._lines.push(new FloorLine(createVector(0, 104), ['8e', '20o', '10w', '6o'], orange));
    this._lines.push(new FloorLine(createVector(0, 144), ['8e', '20o', '3e', '6o', '5w', '10o'], 
      orange));
    this._lines.push(new FloorLine(createVector(0, 240), ['10o', '3e', '26o', '2w', '10o', '3e', 
      '14o'], orange));
    this._lines.push(new FloorLine(createVector(320, 0), ['10r', '3e', '20r', '3w', '4r', '5e', '8r', 
      '6w', '8r', '4e', '30r', '3w'], orange));
    this._lines.push(new FloorLine(createVector(0, 380), ['6e', '10o', '3e', '60o', '2e', '14o', '6w', 
      '12o'], orange));
    this._lines.push(new FloorLine(createVector(0, 400), ['10e', '30o', '3e', '40o', '2e', '14o', '2w', 
      '12o', '3w', '4o'], orange));
    this._lines.push(new FloorLine(createVector(0, 440), ['6o', '10e', '36o', '4e', '40o', '2w', 
      '30o'], orange));
    this._lines.push(new FloorLine(createVector(80, 480), ['6o', '4e', '36o', '4w', '30o', '2e', 
      '30o', '2e', '10o', '3w', '10o'], orange));
    this._lines.push(new FloorLine(createVector(120, 480), ['8o', '4e', '38o', '2w', '24o', '2e', 
      '32o', '2e', '8o', '3w', '12o'], orange));
    this._lines.push(new FloorLine(createVector(200, 480), ['8o', '4e', '38o', '2w', '24o', '2e', 
      '32o', '2e', '2o'], orange));
    this._lines.push(new FloorLine(createVector(260, 480), ['30o', '4e', '38o', '4w', '20o', '8e'], 
      orange));
    this._lines.push(new FloorLine(createVector(340, 480), ['40o', '4w', '18o', '4e', '18o'], 
      orange));
    this._lines.push(new FloorLine(createVector(640, 240), ['40r', '4w', '18r', '4e', '2r'], 
      orange));
    this._lines.push(new FloorLine(createVector(440, 480), ['40o', '4e', '6o'], 
      orange));
    this._lines.push(new FloorLine(createVector(520, 480), ['10o', '4e', '12o', '4e'], 
      orange));
    this._lines.push(new FloorLine(createVector(580, 480), ['10o', '6e'], 
      orange));
  }

  setupRinzlerFloor() {
    this._lines.push(new FloorLine(createVector(width, 120), ['45w', '15m', '40w', '15r', '45w'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(0, 180), ['45e', '15t', '40e', '15o', '45e'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width, 230), ['45w', '15r', '40w', '15m', '45w'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(0, 280), ['45e', '15t', '40e', '15o', '45e'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width, 460), ['45w', '15m', '40w', '15r', '45w'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width/2-120, height), ['10o', '40e', '10t'], 
      SketchColor.white()));

    this._lines.push(new FloorLine(createVector(width/2-50,height/2-140), ['25e', '25s'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width/2+50,height/2-40), ['25w', '25n'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width/2-66,height/2-156), ['33s', '33e'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width/2+66,height/2-24), ['33n', '33w'], 
      SketchColor.white()));
    
    this._lines.push(new FloorLine(createVector(width/2-250,height/2+80), ['25e', '25s'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width/2-150,height/2+180), ['25w', '25n'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width/2-266,height/2+64), ['33s', '33e'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width/2-134,height/2+196), ['33n', '33w'], 
      SketchColor.white()));
    
    this._lines.push(new FloorLine(createVector(width/2+150,height/2+80), ['25e', '25s'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width/2+250,height/2+180), ['25w', '25n'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width/2+134,height/2+64), ['33s', '33e'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width/2+266,height/2+196), ['33n', '33w'], 
      SketchColor.white()));

    this._lines.push(new FloorLine(createVector(0,height/2+80), ['8e', '25s', '8w'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width,height/2+80), ['8w', '25s', '8e'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(0,140), ['58e', '5s', '58w'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width,140), ['58w', '5s', '58e'], 
      SketchColor.white()));
    this._lines.push(new FloorLine(createVector(0,100), ['38e', '15o', '25e', '5n', '30w', '10r', 
      '43w'], SketchColor.white()));
    this._lines.push(new FloorLine(createVector(width,100), ['38w', '15m', '25w', '5n', '30e', '10t', 
      '43e'], SketchColor.white()));
  }

  setupDefaultFloor() {
    this._lines.push(new FloorLine(createVector(0, 52), ['18e', '37s', '18w'], blue));
    this._lines.push(new FloorLine(createVector(72, height), ['5n', '3m', '27n', '5o', 
      '17n', '20w'], blue));
    this._lines.push(new FloorLine(createVector(100, height), ['2n', '7m', '21n', '5o', 
      '40n', '3m', '17n', '4o', '21n'], blue));
    this._lines.push(new FloorLine(createVector(160, 0), ['45s', '5r', '38s', '10r', 
      '10s', '4t', '8s'], blue));
    this._lines.push(new FloorLine(createVector(150, height), ['50n', '13o', '10n', '5m', '42n'], 
      blue));
    this._lines.push(new FloorLine(createVector(240, 0), ['24s', '7r', '20s', '5t', '25s', '10r', 
      '15s', '5t', '10s'], blue));
    this._lines.push(new FloorLine(createVector(224, height), ['12n', '10o', '10n', '4m', '50n', 
      '5o', '15n', '3o', '12n'], blue));
    this._lines.push(new FloorLine(createVector(290, height), ['35n', '8m', '32n', '11o', '34n'], 
      blue));
    this._lines.push(new FloorLine(createVector(320, 0), ['38s', '5t', '10e', '24s', '3o', '28n', 
      '14w', '36n'], blue));
    this._lines.push(new FloorLine(createVector(350, 0), ['20s', '15t', '32s', '10r', '12w', '3r', 
      '40s'], blue));
    this._lines.push(new FloorLine(createVector(350, height), ['15n', '25e', '15s'], blue));
    this._lines.push(new FloorLine(createVector(460, height), ['18n', '10w', '20n', '6o', '25n', 
      '5m', '48n'], blue));
    this._lines.push(new FloorLine(createVector(460, 0), ['16s', '25e', '3o', '5e', '3t', '9e'], 
      blue));
    this._lines.push(new FloorLine(createVector(470, 0), ['14s', '20e', '14n'], blue));
    this._lines.push(new FloorLine(createVector(490, height), ['25n', '4m', '30n', '4o', '10e', 
      '18n', '4o', '25e'], blue));
    this._lines.push(new FloorLine(createVector(width, 180), ['24w', '15s', '12w', '30s', '4t', 
      '10s', '4r', '12s'], blue));
    this._lines.push(new FloorLine(createVector(530, height), ['30n', '5e', '5t', '20e'], blue));
    this._lines.push(new FloorLine(createVector(width, 350), ['2w', '5r', '8w', '4m', '12w', 
      '24n', '15e', '6o', '10e'], blue));

    this._lines.push(new FloorLine(createVector(width/2-50,height/2-50), ['25e', '25s'], blue));
    this._lines.push(new FloorLine(createVector(width/2+50,height/2+50), ['25w', '25n'], blue));
  }
}

class FloorLine {
  constructor(start, path, color) {
    this._points = [];
    this._points.push(start.copy());
    this.processPath(path);
    this._blipColor = color.copy().alpha(0.5).stringify();
    this._lineColor = color.copy().alpha(0.3).stringify();
    this._blipIndex = 0;
  }

  processPath(path) {
    for (let p of path) {
      let dir = GridFloor.directionMap.get(p.slice(-1));
      let loops = parseInt(p.slice(0, -1));
      for (let i=0; i<loops; i++) {
        let nextV = this._points[this._points.length-1].copy();
        nextV.x += dir.x;
        nextV.y += dir.y;
        this._points.push(nextV);
      }
    }
  }

  show() {
    noFill();
    strokeWeight(2);
    stroke(this._lineColor);
    beginShape();
    for (let i = 0; i < this._points.length; i++) {
      vertex(this._points[i].x, this._points[i].y);
    }
    endShape();
    strokeWeight(4);
    stroke(this._blipColor);
    line(this._points[this._blipIndex].x, this._points[this._blipIndex].y, 
      this._points[this._blipIndex+1].x, this._points[this._blipIndex+1].y);
  }

  animate() {
    this._blipIndex++;
    if (this._blipIndex >= this._points.length-2) 
      this._blipIndex = 0;
  }
}

/**
 * mno
 * w e
 * rst
 */
GridFloor.directionMap = new Map();
GridFloor.directionMap.set('n', {x:0, y:-4});
GridFloor.directionMap.set('s', {x:0, y:4});
GridFloor.directionMap.set('e', {x:4, y:0});
GridFloor.directionMap.set('w', {x:-4, y:0});

GridFloor.directionMap.set('m', {x:-4, y:-4});
GridFloor.directionMap.set('o', {x:4, y:-4});
GridFloor.directionMap.set('r', {x:-4, y:4});
GridFloor.directionMap.set('t', {x:4, y:4});