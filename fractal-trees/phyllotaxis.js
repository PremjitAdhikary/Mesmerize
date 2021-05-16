class Phyllotaxis {

  constructor(phyllotaxis_angle, phyllotaxis_level, phyllotaxis_gap, max_phyllotaxis_level) {
    this._angle = phyllotaxis_angle;
    this._level = phyllotaxis_level;
    this._gap = phyllotaxis_gap;
    this._max_level = max_phyllotaxis_level;
  }

  show() {
    colorMode(HSB, 100);
    translate(width / 2, height / 2);
    let rMax = this._gap * sqrt(this._max_level);
    for (let i = 0; i < this._level; i++) {
      let a = i * this._angle;
      let r = this._gap * sqrt(i);
      let aInRad = radians(a);
      let x = r * cos(aInRad);
      let y = r * sin(aInRad);
      let hu = 360 - (r * 1.5 % 360);
      fill(color('hsb(' + Math.round(hu) + ', 100%, 80%)'));
      noStroke();
      push();
      rotate(aInRad);
      let major = map(r, 0, rMax, 6, 10);
      ellipse(x, y, major, 3);
      pop();
    }
  }
}