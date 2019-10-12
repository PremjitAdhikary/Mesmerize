class SketchColor {
  constructor(r,g,b) {
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = 1.0;
  }

  static white() {
    return new SketchColor(255, 255, 255);
  }

  static violet() {
    return new SketchColor(148, 0, 211);
  }

  static indigo() {
    return new SketchColor(75, 0, 130);
  }

  static blue() {
    return new SketchColor(0, 0, 255);
  }

  static green() {
    return new SketchColor(0, 255, 0);
  }

  static yellow() {
    return new SketchColor(255, 255, 0);
  }

  static orange() {
    return new SketchColor(255, 127, 0);
  }

  static red() {
    return new SketchColor(255, 0, 0);
  }

  static greenyellow() {
    return new SketchColor(177, 251, 23);
  }

  static grey() {
    return new SketchColor(80, 80, 80);
  }

  static gold() {
    return new SketchColor(255, 215, 0);
  }

  static blend() {
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < arguments.length; i++) {
      r += arguments[i]._r;
      g += arguments[i]._g;
      b += arguments[i]._b;
    }
    return new SketchColor(
          Math.floor(r/arguments.length), 
          Math.floor(g/arguments.length), 
          Math.floor(b/arguments.length));
  }

  alpha50() {
    this._a = .5;
    return this;
  }

  alpha75() {
    this._a = .75;
    return this;
  }

  alpha100() {
    this._a = 1.0;
    return this;
  }

  stringify() {
    return 'rgba('+this._r+','+this._g+','+this._b+','+this._a+')';
  }
}