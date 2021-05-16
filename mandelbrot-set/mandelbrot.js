class Mandelbrot {

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
    for (let x = this._xOffset; x < this._wd + this._xOffset; x++) {
      for (let y = this._yOffset; y < this._ht + this._yOffset; y++) {
        let a = map(x, 0, this._wd, this._minLimit, this._maxLimit);
        let b = map(y, 0, this._ht, this._minLimit, this._maxLimit);
        let n = 0;
        let ca = a;
        let cb = b;

        while (n < this._maxIterations) {
          let aa = a * a;
          let bb = b * b;
          let twoAB = 2 * a * b;
          a = aa - bb + ca;
          b = twoAB + cb;

          if (aa + bb > 16) {
            break;
          }
          n++;
        }

        let bright = 0;
        bright = map(n, 0, this._maxIterations, 0, 1);
        bright = map(sqrt(bright), 0, 1, 0, 255);
        if (n === this._maxIterations) {
          bright = 0;
        }
        let pix = ((this._x + x - this._xOffset) + (this._y + y - this._yOffset) * width) * 4;
        pixels[pix + 0] = bright;
        pixels[pix + 1] = bright;
        pixels[pix + 2] = bright == 0 ? 0 : 80;
        pixels[pix + 3] = 255;
      }
    }
    updatePixels();
  }
}