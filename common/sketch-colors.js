class SketchColor {

  constructor(r,g,b) {
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = 1.0;
  }

  static white = () => new SketchColor(255, 255, 255);
  static violet = () => new SketchColor(148, 0, 211);
  static indigo = () => new SketchColor(75, 0, 130);
  static blue = () => new SketchColor(0, 0, 255);
  static green = () => new SketchColor(0, 255, 0);
  static yellow = () => new SketchColor(255, 255, 0);
  static orange = () => new SketchColor(255, 127, 0);
  static red = () => new SketchColor(255, 0, 0);
  static greenyellow = () => new SketchColor(177, 251, 23);
  static grey = () => new SketchColor(80, 80, 80);
  static gold = () => new SketchColor(255, 215, 0);
  static skyBlue = () => new SketchColor(174, 245, 255);

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

  alpha50 = () => this.alpha(0.5);
  alpha75 = () => this.alpha(0.75);
  alpha100 = () => this.alpha(1.0);

  alpha(val) {
    this._a = val;
    return this;
  }

  stringify = () => 'rgba('+this._r+','+this._g+','+this._b+','+this._a+')';
}