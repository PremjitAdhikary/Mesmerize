class RingedCelestial extends CelestialBody {

  constructor(dist, radius, color, angleVelocity) {
    super(dist, radius, color, angleVelocity);
  }

  show() {
    push();

    rotate(this._angle);
    translate(this._dist, 0);

    this.drawSatellite();
    this.drawRings();

    pop();
  }

  drawRings() {
    noFill();
    stroke(SketchColor.grey().alpha75().stringify());
    strokeWeight(5);
    circle(0, 0, this._radius*2 + 3);
  }
  
}