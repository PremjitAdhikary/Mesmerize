/**
 * Gives out a water ripple effect on the canvas.
 * 
 * Constructor:
 * - wd: width of the canvas
 * - ht: height of the canvas
 * - rippleColor: a SketchColor object
 * - damping: keep this < 1. Otherwise it will be infinite ripples (so uncool)
 * 
 * Cool Methods:
 * - ripple(x,y): where you want the next ripple to appear
 * - setDamping(d): change the damping to some other value than whats there in the constructor
 * - setBaseColor(): this reads whatevers in the current canvas and sets it up as the colored 
 * background
 * - colorize(): Use this to enable colored background and colored ripple
 * - deColor(): default to b/w
 * - show(): draws the ripples on the canvas
 * 
 * Gotchas:
 * - Must have pixelDensity(1) called in the setup.
 * - After the constructor call, call EffectsRipple.setBaseColor() before the EffectsRipple.show()
 * 
 * Algorithm on which this is based off:
 * Source: https://web.archive.org/web/20160418004149/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm
 * 
 * ProcessWater
 * 
 * damping = some non-integer between 0 and 1
 * 
 * begin loop
 *   for every non-edge element:
 *   loop
 *       Buffer2(x, y) = (Buffer1(x-1,y)            ; It is also important for the waves to spread 
 *                        Buffer1(x+1,y)            ; out, so the buffers are smoothed every frame.
 *                        Buffer1(x,y+1)
 *                        Buffer1(x,y-1)) / 2 
 *                             - Buffer2(x,y)
 * 
 *       Buffer2(x,y) = Buffer2(x,y) * damping      ; the ripples are damped to lose energy
 *   end loop
 *   Display Buffer2
 *   Swap the buffers
 * 
 * end loop
 */
class EffectsRipples {

  constructor(wd, ht, rippleColor, damping) {
    this._wd = wd;
    this._ht = ht;
    this._rippleColor = rippleColor;
    this.setDamping(damping);

    this._colorized = true;

    this._original = create2DArray(this._wd, this._ht);
    forEach2DArray(this._original, (arr, r, c) => this._original[r][c] = [0,0,0]);

    this._current = create2DArray(this._wd, this._ht);
    forEach2DArray(this._current, (arr, r, c) => this._current[r][c] = 0);

    this._previous = create2DArray(this._wd, this._ht);
    forEach2DArray(this._previous, (arr, r, c) => this._previous[r][c] = 0);
  }

  ripple(x,y) {
    if (x > 2 && x < width - 3 && y > 2 && y < height - 3) {
      this._current[Math.round(x)][Math.round(y)] = 255;
    }
  }

  colorize() {
    this._colorized = true;
  }

  deColor() {
    this._colorized = false;
  }

  setDamping(damping) {
    if (damping < 0 || damping >= 1) {
      this._damping = 0.9;
    } else {
      this._damping = damping;
    }
  }

  setBaseColor() {
    loadPixels();
    
    for (let r=0; r<this._wd; r++) {
      for (let c=0; c<this._ht; c++) {
        let pIndex = (r + c*this._wd) * 4;

        this._original[r][c][0] = pixels[pIndex];
        this._original[r][c][1] = pixels[pIndex + 1];
        this._original[r][c][2] = pixels[pIndex + 2];
      }
    }
  }

  show() {
    loadPixels();
    for (let r=1; r<this._current.length-1; r++) {
      for (let c=1; c<this._current[r].length-1; c++) {
          this._current[r][c] =  (
            this._previous[r - 1][c] + this._previous[r + 1][c] + 
            this._previous[r][c - 1] + this._previous[r][c + 1] + 
            this._previous[r - 1][c - 1] + this._previous[r - 1][c + 1] + 
            this._previous[r + 1][c - 1] + this._previous[r + 1][c + 1]
            ) / 4 - this._current[r][c];
          this._current[r][c] *= this._damping;

        let pIndex = (r + c*this._wd) * 4;

        switch(this.getPixelColorizer(r,c)) {
          case EffectsRipples.COLORED_RIPPLE:
            pixels[pIndex] = this._current[r][c] * this._rippleColor._r;
            pixels[pIndex + 1] = this._current[r][c] * this._rippleColor._g;
            pixels[pIndex + 2] = this._current[r][c] * this._rippleColor._b;
            break;
          case EffectsRipples.COLORED_WATER:
            pixels[pIndex] = this._original[r][c][0];
            pixels[pIndex + 1] = this._original[r][c][1];
            pixels[pIndex + 2] = this._original[r][c][2];
            break;
          case EffectsRipples.DECOLORED_RIPPLE:
            pixels[pIndex] = this._current[r][c] * 255;
            pixels[pIndex + 1] = this._current[r][c] * 255;
            pixels[pIndex + 2] = this._current[r][c] * 255;
            break;
          case EffectsRipples.DECOLORED_WATER:
            pixels[pIndex] = 0;
            pixels[pIndex + 1] = 0;
            pixels[pIndex + 2] = 0;
            break;
        }
        pixels[pIndex+3] = 255;
      }
    }
    updatePixels();

    this.swap();
  }

  swap() {
    let temp = this._previous;
    this._previous = this._current;
    this._current = temp;
  }

  getPixelColorizer(r,c) {
    if (this._colorized && this._current[r][c] > 0.1) {
      return EffectsRipples.COLORED_RIPPLE;
    }
    if (this._colorized && this._current[r][c] <= 0.1) {
      return EffectsRipples.COLORED_WATER;
    }
    if (!this._colorized && this._current[r][c] > 0.1) {
      return EffectsRipples.DECOLORED_RIPPLE;
    }
    if (!this._colorized && this._current[r][c] <= 0.1) {
      return EffectsRipples.DECOLORED_WATER;
    }
  }

}

EffectsRipples.COLORED_RIPPLE = 1;
EffectsRipples.COLORED_WATER = 2;
EffectsRipples.DECOLORED_RIPPLE = 3;
EffectsRipples.DECOLORED_WATER = 4;