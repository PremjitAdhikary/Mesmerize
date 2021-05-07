class PhaseCycle extends LightCycle {

  constructor(id, start, direction, grid, maxSpeed, maxAmmo) {
    super(id, start, direction, SketchColor.greenyellow(), grid, maxSpeed);
    this._paths = [];
    this._paths.push([]);
    this._isPhasing = false;
    this._phaseAmmo = 10;
    this._phaseAmmoMax = maxAmmo;
    this._phaseAlphaAngle = 3*HALF_PI;
  }

  // commands

  actionIn(keyCode) {
    if ((keyCode === 88 || keyCode === 120) && !this._isPhasing) {
      this._isPhasing = true;
      this._phaseAlphaAngle = 3*HALF_PI;
      this._paths.push([]);
    }
  }

  actionOut(keyCode) {
    if ((keyCode === 88 || keyCode === 120) && this._isPhasing) {
      this.unPhase();
    }
  }

  deactivate() {
    if (this.isActive()) {
      this.unPhase();
      this._state = LightCycle.STATE.STOP;
    }
  }

  unPhase() {
    this._isPhasing = false;
    this.updateColorsAlpha(1.0);
  }

  show() {
    if (!this._showCrashAnimation && this._isPhasing) {
      let alpha = map(sin(this._phaseAlphaAngle), -1, 1, 0.9, 0.5);
      this.updateColorsAlpha(alpha);
      this._phaseAlphaAngle += 0.4;
    }
    super.show();
  }

  animate() {
    if (!this.isActive()) return;

    this.move();
    if (!this._isPhasing)
      this._paths[this._paths.length-1].push(this._current.copy());
    if (this.checkIfCollision()) {
      this.setCycleCrashed();
      return;
    }
    this.updateMoveOnGrid();
    if (!this._isPhasing && this._phaseAmmo < this._phaseAmmoMax) {
      this._phaseAmmo += 0.2;
      this._phaseAmmo = Math.min(this._phaseAmmo, this._phaseAmmoMax)
    }
    if (this._isPhasing && this._phaseAmmo > 0) {
      this._phaseAmmo --;
      if (this._phaseAmmo <= 0) {
        this._phaseAmmo = 0;
        this.unPhase();
      }
    }
  }

  checkIfCollision() {
    if (this._isPhasing) return false;
    return super.checkIfCollision();
  }

  updateMoveOnGrid() {
    if (this._isPhasing) return;
    super.updateMoveOnGrid();
  }

  drawDiskAndTrailLights() {
    stroke(this._color);
    strokeWeight(2);
    line(0, this._len / 2 - this._wheelLen / 2, 0, this._len / 2 + 3);
    fill(0);
    circle(0, -this._len * 1 / 12, this._bodyWid+2);
    let angle = radians(map(this._phaseAmmo, 0, this._phaseAmmoMax, 0, 360));
    noStroke();
    fill(this._color);
    arc(0, -this._len * 1 / 12, this._bodyWid+2, this._bodyWid+2, -HALF_PI, -HALF_PI + angle);
  }

  drawPath() {
    if (!this._showCrashAnimation) {
      strokeWeight(6);
      stroke(this._glow);
      noFill();
      for (let path of this._paths) {
        beginShape();
        for (let v of path) {
          vertex(v.x, v.y);
        }
        endShape();
      }
    }
    strokeWeight(2);
    stroke(this._color);
    noFill();
    for (let path of this._paths) {
      beginShape();
      for (let v of path) {
        vertex(v.x, v.y);
      }
      endShape();
    }
  }

}