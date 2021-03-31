class LightCycle {

  constructor(id, start, direction, color, grid, maxSpeed) {
    this._id = id;
    this._current = start;
    this._direction = direction;
    
    this._baseColor = color.copy();
    this._color = this._baseColor.stringify();
    this._glow = this._baseColor.alpha(0.6).stringify();
    this._cycleBaseColorA = new SketchColor(130,135,136);
    this._cycleBaseColorAStr = this._cycleBaseColorA.stringify();
    this._cycleBaseColorB = new SketchColor(84,87,97);
    this._cycleBaseColorBStr = this._cycleBaseColorB.stringify();
    
    this._path = [];
    this._pathGlowIndex = 0;
    this._maxSpeed = maxSpeed;
    this._state = LightCycle.STATE.READY;
    this._showCrashAnimation = false;
    this._crashAlpha = 1;

    this._len = 40;
    this._wheelLen = this._len * 1 / 3;
    this._wheelWid = this._len * 4 / 15;
    this._bodyWid = this._len / 6;
    this._grid = grid;
    if (this._grid !== undefined) {
      this._currentGridR = this._grid.getTileRowIndex(this._current);
      this._currentGridC = this._grid.getTileColIndex(this._current);
      this._previousGridR = this._currentGridR;
      this._previousGridC = this._currentGridC;
    }
  }

  // commands

  north() {
    this.topDownControl(
      [LightCycle.DIRECTION.EAST, LightCycle.DIRECTION.WEST], LightCycle.DIRECTION.NORTH);
  }

  south() {
    this.topDownControl(
      [LightCycle.DIRECTION.EAST, LightCycle.DIRECTION.WEST], LightCycle.DIRECTION.SOUTH);
  }

  east() {
    this.topDownControl(
      [LightCycle.DIRECTION.NORTH, LightCycle.DIRECTION.SOUTH], LightCycle.DIRECTION.EAST);
  }

  west() {
    this.topDownControl(
      [LightCycle.DIRECTION.NORTH, LightCycle.DIRECTION.SOUTH], LightCycle.DIRECTION.WEST);
  }

  topDownControl(allowedDirections, newDirection) {
    if (!this.isActive()) return;
    if (allowedDirections.includes(this._direction)) 
      this._direction = newDirection;
  }

  left() {
    if (!this.isActive()) return;
    this._direction = LightCycle.leftFromDirection(this._direction);
  }

  right() {
    if (!this.isActive()) return;
    this._direction = LightCycle.rightFromDirection(this._direction);
  }

  // movements and states

  move() {
    switch(this._direction) {
      case LightCycle.DIRECTION.NORTH: 
        this._current.y -= this._maxSpeed;
        break;
      case LightCycle.DIRECTION.SOUTH: 
        this._current.y += this._maxSpeed;
        break;
      case LightCycle.DIRECTION.EAST:
        this._current.x += this._maxSpeed;
        break;
      case LightCycle.DIRECTION.WEST: 
        this._current.x -= this._maxSpeed;
        break;
    }
  }

  checkIfCollision() {
    this._currentGridR = this._grid.getTileRowIndex(this._current);
    this._currentGridC = this._grid.getTileColIndex(this._current);
    return !this._grid.isTileFree(this._currentGridR, this._currentGridC);
  }

  updateMoveOnGrid() {
    if (this._currentGridR != this._previousGridR || this._currentGridC != this._previousGridC) {
      if (!this._grid.isTileFree(this._previousGridR, this._previousGridC) 
        && this._grid.getTileOccupiedBy(this._previousGridR, this._previousGridC) == this._id) {
        this.setCycleCrashed();
        return;
      }
      this._grid.setTileOccupiedBy(this._previousGridR, this._previousGridC, this._id);
      this._previousGridR = this._currentGridR;
      this._previousGridC = this._currentGridC;
    }
  }

  getAngle() {
    switch(this._direction) {
      case LightCycle.DIRECTION.NORTH: return 0;
      case LightCycle.DIRECTION.SOUTH: return PI;
      case LightCycle.DIRECTION.EAST: return HALF_PI;
      case LightCycle.DIRECTION.WEST: return -HALF_PI;
    }
  }

  setCycleCrashed() {
    this._state = LightCycle.STATE.CRASHED;
    this._showCrashAnimation = true;
    this._grid.removeOccupiedCellsForCycle(this._id);
  }

  activate() {
    if (this._state === LightCycle.STATE.READY)
      this._state = LightCycle.STATE.PLAYING;
  }

  isActive() {
    return this._state === LightCycle.STATE.PLAYING;
  }

  crashed() {
    return this._state === LightCycle.STATE.CRASHED;
  }

  deactivate() {
    if (this.isActive())
      this._state = LightCycle.STATE.STOP;
  }

  // ui and control

  show() {
    if (this._showCrashAnimation && this._crashAlpha > 0) {
      this._crashAlpha -= 0.02;
      this._color = this._baseColor.alpha(this._crashAlpha).stringify();
      this._cycleBaseColorAStr = this._cycleBaseColorA.alpha(this._crashAlpha).stringify();
      this._cycleBaseColorBStr = this._cycleBaseColorB.alpha(this._crashAlpha).stringify();
    }
    if (this._crashAlpha <= 0) return;
    this.drawPath();
    this.drawCycle();
    if (!this.isActive()) return;
    this.move();
    this._path.push(this._current.copy());
    if (this.checkIfCollision()) {
      this.setCycleCrashed();
      return;
    }
    this.updateMoveOnGrid();
  }

  drawCycle() {
    push();
    translate(this._current.x, this._current.y);
    rotate(this.getAngle());

    this.drawCycleBase();
    this.drawLights();
    this.drawHeadLights();

    pop();
  }

  drawLights() {
    this.drawWheelLights();
    this.drawBodyLights();
  }

  drawCycleBase() {
    strokeWeight(1);
    stroke(this._cycleBaseColorBStr);
    fill(this._cycleBaseColorBStr);
    rect(-this._wheelWid / 2, -this._len / 2, this._wheelWid, this._wheelLen, 3);
    rect(-this._wheelWid / 2, this._len / 2 - this._wheelLen, this._wheelWid, this._wheelLen + 3, 3);
    rect(-this._bodyWid / 2, -this._len / 2, this._bodyWid, this._len);
    // metal shade
    fill(this._cycleBaseColorAStr);
    if (this._direction === LightCycle.DIRECTION.NORTH 
      || this._direction === LightCycle.DIRECTION.EAST) {
      rect(-this._wheelWid / 2 + 1, -this._len / 2, this._wheelWid / 2 - 2, this._wheelLen, 
        3, 0, 0, 3);
      rect(-this._wheelWid / 2 + 1, this._len / 2 - this._wheelLen, this._wheelWid / 2 - 2, 
        this._wheelLen + 3, 3, 0, 0, 3);
    } else  {
      rect(1, -this._len / 2, this._wheelWid / 2 - 2, this._wheelLen, 0, 3, 3, 0);
      rect(1, this._len / 2 - this._wheelLen, this._wheelWid / 2 - 2, 
        this._wheelLen + 3, 0, 3, 3, 0);
    }
    // plate
    fill(0);
    noStroke();
    rect(-this._bodyWid / 2 + 1, -this._len * 3 / 9, this._bodyWid - 2, 3);
  }

  drawWheelLights() {
    let frontWheelLeftCurve = [
      createVector(-this._wheelWid / 2, -this._len / 2 + 1),
      createVector(-this._wheelWid / 2 - 1, -this._len / 2 + this._wheelLen / 2),
      createVector(-this._wheelWid / 2, -this._len / 2 + this._wheelLen - 1),
    ];
    let frontWheelRightCurve = [
      createVector(this._wheelWid / 2, -this._len / 2 + 1),
      createVector(this._wheelWid / 2 + 1, -this._len / 2 + this._wheelLen / 2),
      createVector(this._wheelWid / 2, -this._len / 2 + this._wheelLen - 1),
    ];
    let backWheelLeftCurve = [
      createVector(-this._wheelWid / 2, this._len / 2),
      createVector(-this._wheelWid / 2 - 1, this._len / 2 - this._wheelLen / 2),
      createVector(-this._wheelWid / 2, this._len / 2 - this._wheelLen),
    ];
    let backWheelRightCurve = [
      createVector(this._wheelWid / 2, this._len / 2),
      createVector(this._wheelWid / 2 + 1, this._len / 2 - this._wheelLen / 2),
      createVector(this._wheelWid / 2, this._len / 2 - this._wheelLen),
    ];
    stroke(this._color);
    strokeWeight(2);
    this.drawAcurve(frontWheelLeftCurve);
    this.drawAcurve(frontWheelRightCurve);
    this.drawAcurve(backWheelLeftCurve);
    this.drawAcurve(backWheelRightCurve);
  }

  drawBodyLights() {
    let shinLeftCurve = [
      createVector(-this._wheelWid / 2 - 1, this._len / 2 - this._wheelLen - 3),
      createVector(-this._wheelWid / 2 - 1, this._len / 2 - this._wheelLen),
      createVector(-this._wheelWid / 2 - 3, this._len / 2 - this._wheelLen + 2),
      createVector(-this._wheelWid / 2 - 3, this._len / 2 - this._wheelLen + 6),
    ];
    let backLeftCurve = [
      createVector(-this._bodyWid / 2 - 1, -3),
      createVector(-this._bodyWid / 2 + 1, this._len / 2 - this._wheelLen),
      createVector(-this._bodyWid / 2 - 1, this._len / 2 - this._wheelLen),
      createVector(-this._bodyWid / 2 - 3, this._len / 2 - this._wheelLen - 3)
    ];
    let shinRightCurve = [
      createVector(this._wheelWid / 2 + 1, this._len / 2 - this._wheelLen - 3),
      createVector(this._wheelWid / 2 + 1, this._len / 2 - this._wheelLen),
      createVector(this._wheelWid / 2 + 3, this._len / 2 - this._wheelLen + 2),
      createVector(this._wheelWid / 2 + 3, this._len / 2 - this._wheelLen + 6),
    ];
    let backRightCurve = [
      createVector(this._bodyWid / 2 + 1, -3),
      createVector(this._bodyWid / 2 - 1, this._len / 2 - this._wheelLen),
      createVector(this._bodyWid / 2 + 1, this._len / 2 - this._wheelLen),
      createVector(this._bodyWid / 2 + 3, this._len / 2 - this._wheelLen - 3)
    ];
    let armLeftCurve = [
      createVector(-this._bodyWid / 2 - 2, -3),
      createVector(-this._bodyWid / 2 - 5, -4),
      createVector(-this._bodyWid / 2 - 6, -9),
      createVector(-this._bodyWid / 2 - 2, -10),
    ];
    let armRightCurve = [
      createVector(this._bodyWid / 2 + 2, -3),
      createVector(this._bodyWid / 2 + 5, -4),
      createVector(this._bodyWid / 2 + 6, -9),
      createVector(this._bodyWid / 2 + 2, -10),
    ];
    stroke(this._color);
    strokeWeight(2);
    this.drawAcurve(shinLeftCurve);
    this.drawAcurve(backLeftCurve);
    this.drawAcurve(shinRightCurve);
    this.drawAcurve(backRightCurve);
    this.drawAcurve(armLeftCurve);
    this.drawAcurve(armRightCurve);
    line(0, this._len / 2 - this._wheelLen / 2, 0, this._len / 2 + 3);
    fill(0);
    circle(0, -this._len * 1 / 12, this._bodyWid);
  }

  drawHeadLights() {
    stroke(this._glow);
    strokeWeight(3);
    line(-this._wheelWid / 2 + 3, -this._len / 2 - 1, this._wheelWid / 2 - 3, -this._len / 2 - 1);
    stroke(this._color);
    strokeWeight(2);
    point(-this._wheelWid / 2 + 3, -this._len / 2 - 1);
    point(this._wheelWid / 2 - 3, -this._len / 2 - 1);
  }

  drawAcurve(curvePoints) {
    beginShape();
    curveVertex(curvePoints[0].x, curvePoints[0].y);
    for (let cp of curvePoints) {
      curveVertex(cp.x, cp.y);
    }
    curveVertex(curvePoints[curvePoints.length-1].x, curvePoints[curvePoints.length-1].y);
    endShape();
  }

  drawPath() {
    if (!this._showCrashAnimation) {
      strokeWeight(6);
      stroke(this._glow);
      noFill();
      beginShape();
      for (let v of this._path) {
        vertex(v.x, v.y);
      }
      endShape();
      strokeWeight(8);
      stroke(this._color);
      point(this._path[this._pathGlowIndex].x, this._path[this._pathGlowIndex].y);
      this._pathGlowIndex -= 5;
      if (this._pathGlowIndex <= 0) {
        this._pathGlowIndex = this._path.length - 1;
      }
    }
    strokeWeight(2);
    stroke(this._color);
    noFill();
    beginShape();
    for (let v of this._path) {
      vertex(v.x, v.y);
    }
    endShape();
  }
}

LightCycle.DIRECTION = {
  NORTH: 'n',
  SOUTH: 's',
  EAST: 'e',
  WEST: 'w',
};

LightCycle.STATE = {
  READY: 1,
  PLAYING: 2,
  CRASHED: 3,
  STOP: 4
};

LightCycle.leftFromDirection = (direction) => {
  let dirMap = new Map();
  dirMap.set(LightCycle.DIRECTION.NORTH, LightCycle.DIRECTION.WEST);
  dirMap.set(LightCycle.DIRECTION.SOUTH, LightCycle.DIRECTION.EAST);
  dirMap.set(LightCycle.DIRECTION.EAST, LightCycle.DIRECTION.NORTH);
  dirMap.set(LightCycle.DIRECTION.WEST, LightCycle.DIRECTION.SOUTH);

  return dirMap.get(direction);
}

LightCycle.rightFromDirection = (direction) => {
  let dirMap = new Map();
  dirMap.set(LightCycle.DIRECTION.NORTH, LightCycle.DIRECTION.EAST);
  dirMap.set(LightCycle.DIRECTION.SOUTH, LightCycle.DIRECTION.WEST);
  dirMap.set(LightCycle.DIRECTION.EAST, LightCycle.DIRECTION.SOUTH);
  dirMap.set(LightCycle.DIRECTION.WEST, LightCycle.DIRECTION.NORTH);

  return dirMap.get(direction);
}
