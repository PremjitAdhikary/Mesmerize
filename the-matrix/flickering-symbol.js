class FlickeringSymbol {
  constructor(x,y,color,value,hide) {
    this._x = x;
    this._y = y;
    this._value = value;
    this._hide = hide;
    this._color = color;
    this._showCounter = 0;
    this._flicker = false;
    this._flickerRate = floor(random(2,6));
  }

  show() {
    if (this._hide) return;
    if (this.isSteadyZone() || !this._flicker) {
      stroke(this._color);
      fill(this._color);
      textSize(Symbol.SIZE);
      text(this._value, this._x, this._y);
    }
    if (!this.isSteadyZone() && this.isFlickerToggable()) {
      this._flicker = !this._flicker;
    }
    this._showCounter++;
    if (this._showCounter > 500) {
      this._showCounter = 0;
      this._flicker = false;
      this._hide = true;
    }
  }

  isSteadyZone() {
    return this._showCounter > 25 && this._showCounter < 475;
  }

  isFlickerToggable() {
    return this._showCounter % this._flickerRate == 0;
  }

  setVisibility(visible) {
    this._hide = !visible;
  }

  isVisible() {
    return !this._hide;
  }
}