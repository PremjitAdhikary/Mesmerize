class SecondGenCycle extends LightCycle {

  constructor(id, start, direction, grid, maxSpeed) {
    super(id, start, direction, SketchColor.white(), grid, maxSpeed * 1.5);
    this._currentSpeed = 1.5;
    this._minSpeed = 1.5;
    this._accelerating = true;
  }

  move() {
    switch(this._direction) {
      case LightCycle.DIRECTION.NORTH: 
        this._current.y -= this._currentSpeed;
        break;
      case LightCycle.DIRECTION.SOUTH: 
        this._current.y += this._currentSpeed;
        break;
      case LightCycle.DIRECTION.EAST:
        this._current.x += this._currentSpeed;
        break;
      case LightCycle.DIRECTION.WEST: 
        this._current.x -= this._currentSpeed;
        break;
    }
    if (this._accelerating && this._currentSpeed < this._maxSpeed) {
      this._currentSpeed = Math.min(this._currentSpeed + 0.1, this._maxSpeed);
    } else if (!this._accelerating && this._currentSpeed > this._minSpeed) {
      this._currentSpeed = Math.max(this._currentSpeed - 0.1, this._minSpeed);
    }
  }

  // commands

  actionIn(keyCode) {
    if (keyCode === 88 || keyCode === 120) {
      this._accelerating = false;
    }
  }

  actionOut(keyCode) {
    if (keyCode === 88 || keyCode === 120) {
      this._accelerating = true;
    }
  }

  // ui

  drawCycleBase() {
    strokeWeight(1);
    stroke(this._color);
    fill(this._color);
    rect(-this._wheelWid / 2, -this._len / 2, this._wheelWid, this._wheelLen, 3);
    stroke(this._cycleBaseColorBStr);
    fill(this._cycleBaseColorBStr);
    rect(-this._wheelWid / 2, this._len / 2 - this._wheelLen, this._wheelWid, this._wheelLen + 3, 3);

    stroke(this._color);
    fill(this._color);
    beginShape();
    vertex(-this._wheelWid / 2, this._len / 2 - this._wheelLen / 2);
    vertex(-this._wheelWid / 2, 2);
    vertex(-this._wheelWid / 3, -this._len / 3);
    vertex(this._wheelWid / 3, -this._len / 3);
    vertex(this._wheelWid / 2, 2);
    vertex(this._wheelWid / 2, this._len / 2 - this._wheelLen / 2);
    endShape(CLOSE);
    stroke(this._color);
    fill(0);
    beginShape();
    vertex(-this._wheelWid / 2, 0);
    vertex(-this._wheelWid / 3, -this._len / 3);
    vertex(this._wheelWid / 3, -this._len / 3);
    vertex(this._wheelWid / 2, 0);
    endShape(CLOSE);
  }

  drawLights() {
    stroke(this._color);
    strokeWeight(2);
    line(0, this._len / 2 - this._wheelLen / 2, 0, this._len / 2 + 3);
  }

}