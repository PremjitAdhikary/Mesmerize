class AlphaSymbol {
  constructor(x,y,charCodes,color,speed,resetTo) {
    this._x = x;
    this._y = y;
    this._charCodes = charCodes;
    this.setCode();
    this._color = color;
    this._speed = speed;
    this._resetTo = resetTo ? resetTo : 0;
  }

  show() {
    stroke(this._color);
    fill(this._color);
    textSize(AlphaSymbol.SIZE);
    text(this._value, this._x, this._y);
    this._y = this._y > height ? this._resetTo : this._y+this._speed;
    if (floor(random(1,25)) == 1) {
      this.setCode();
    }
  }

  setCode() {
    this._value = String.fromCharCode(this._charCodes[floor(random(0, this._charCodes.length+1))]);
  }
}

AlphaSymbol.SIZE = 14;
AlphaSymbol.COLOR_BRIGHT = SketchColor.blend(SketchColor.greenyellow(),SketchColor.white()).stringify();
AlphaSymbol.COLOR_DIM = SketchColor.blend(SketchColor.green(),SketchColor.grey()).stringify();