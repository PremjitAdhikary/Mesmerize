class ACircle {
  
  constructor(x, y, level, index, baseAngleVelocity, trace) {
    ACircle.colors = [
      SketchColor.violet(),
      SketchColor.blue(),
      SketchColor.green(),
      SketchColor.yellow(),
      SketchColor.orange(),
      SketchColor.red()
    ];
    
    this._radius = (height/4)/(index + 1);
    this._angle = PI;
    this._angleVelocity = baseAngleVelocity + (baseAngleVelocity * index);
    this._level = level;
    this._trace = trace;
    if (level > 0) {
      this._next = new ACircle(x + this._radius, y + this._radius, level - 1, 
          index + 1, baseAngleVelocity, this._trace);
    }
  }

  show() {
    this.drawCircle();
    this.drawPoint();
    this._angle += this._angleVelocity;
    if (this._next) {
      this._next.show();
    }
  }

  drawCircle() {
    if (this._trace) return;
    stroke(SketchColor.greenyellow().stringify());
    strokeWeight(1);
    circle(0, 0, this._radius * 2);
  }

  drawPoint() {
    rotate(this._angle);
    translate(0, this._radius);
    if (this._trace) {
      stroke(ACircle.colors[this._level % ACircle.colors.length].alpha75().stringify());
      strokeWeight(1.5);
    } else {
      stroke(SketchColor.yellow().stringify());
      strokeWeight(3);
    }
    point(0, 0);
  }

}