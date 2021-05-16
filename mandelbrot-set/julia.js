class Julia {

  constructor(x, y, wd, ht, minLimit, maxLimit, maxIterations) {
    this._x = x;
    this._y = y;
    this._wd = wd;
    this._ht = ht;
    this._minLimit = minLimit;
    this._maxLimit = maxLimit;
    this._maxIterations = maxIterations;

    this._xOffset = 0;
    this._yOffset = 0;
  }

  show() {
    loadPixels();
    for (let x = 0; x < this._wd; x++) {
      for (let y = 0; y < this._ht; y++) {
        let a = map(x, 0, this._wd, this._minLimit, this._maxLimit);
        let b = map(y, 0, this._ht, this._minLimit, this._maxLimit);
        let n = 0;
        let ca = map(this._xOffset, 0, width, this._minLimit, this._maxLimit);
        let cb = map(this._yOffset, 0, height, this._minLimit, this._maxLimit);

        while (n < this._maxIterations) {
          let aa = a * a;
          let bb = b * b;
          let twoAB = 2 * a * b;

          if (aa + bb > 4) {
            break;
          }

          a = aa - bb + ca;
          b = twoAB + cb;
          n++;
        }

        let hu = 0;
        hu = map(n, 0, this._maxIterations, 0, 1);
        hu = map(sqrt(hu), 0, 1, 0, 360);
        let pColor;
        if (n === this._maxIterations) {
          pColor = color(0);
        } else {
          pColor = color('hsb('+Math.round(hu)+', 90%, 90%)');
        }
        let pix = ((this._x + x) + (this._y + y) * width) * 4;
        pixels[pix + 0] = red(pColor);
        pixels[pix + 1] = green(pColor);
        pixels[pix + 2] = blue(pColor);
        pixels[pix + 3] = alpha(pColor);
      }
    }
    updatePixels();
  }

}