/**
 * Gives out a fire effect on the canvas.
 * 
 * Constructor:
 * - wd: width of the canvas
 * - ht: height of the canvas
 * 
 * Cool Methods:
 * - burn(x,y,radius): where you want the canvas to burn
 * - enableFireLine(): the bottom fire burn line is enabled
 * - disableFireLine(): the bottom fire burn line is disabled
 * - selectAndSetupFireVariables(fire_choice): fire_choice should be one of the ID value of the 
 *    effect types (BASIC, RAGING, TALL)
 * - show(): draws the fire on the canvas
 * 
 * Gotchas:
 * - Must have pixelDensity(1) called in the setup.
 * - Very memory intensive and calculation intensive. FrameRate as of now is pathetic.
 * 
 * Algorithm on which this is based off:
 * Source: https://web.archive.org/web/20160418004150/http://freespace.virgin.net/hugo.elias/models/m_fire.htm
 * 
 * INTEGER: xsize
 * INTEGER: ysize
 * INTEGER: c
 * INTEGER: n1
 * INTEGER: n2
 * INTEGER: n3
 * INTEGER: n4
 * INTEGER: p
 * ARRAY_OF_BYTES: buffer1(xsize*ysize)
 * ARRAY_OF_BYTES: buffer2(xsize*ysize)
 * ARRAY_OF_BYTES: CoolingMap(xsize*ysize)
 * 
 * loop forever
 * 
 *   loop y  from 1 to (ysize-2)                   ;Loop through all pixels on the screen, except
 *     loop x  from 1 to (xsize-2)                 ;the ones at the very edge.
 * 
 *       n1 = read pixel from buffer1(x+1, y)      ;Read the 4 neighbouring pixels
 *       n2 = read pixel from buffer1(x-1, y)
 *       n3 = read pixel from buffer1(x, y+1)
 *       n4 = read pixel from buffer1(x, y-1)
 * 
 *       c  = read pixel from CoolingMap(x, y)     ;Read a pixel from the cooling map
 * 
 *       p = ((n1+n2+n3+n4) / 4)                   ;The average of the 4 neighbours
 *       p = p-c                                   ;minus c
 * 
 *       if p<0 then p=0                           ;Don't let the fire cool below zero
 * 
 *       write pixel of value p to buffer2(x,y-1)  ;write this pixel to the other buffer
 *                                                 ;notice that it is one pixel higher.
 * 
 *     end x loop
 *   end yloop
 * 
 *   copy buffer2 to the screen                    ;Display the next frame
 *   copy buffer2 to buffer1                       ;Update buffer1
 *   scroll CoolingMap up one pixel
 * 
 * end of loop
 */
class EffectsFire {

  constructor(wd, ht) {
    this._wd = wd;
    this._ht = ht;
    
    this._current = createGraphics(this._wd, this._ht);
    this._previous = createGraphics(this._wd, this._ht);
    this._finalFrame = createGraphics(this._wd, this._ht);
    this._cooling = createImage(this._wd, this._ht);

    this._yStart = 0.0;
    this.selectAndSetupFireVariables(EffectsFire.BASIC.ID);

    this.setupCooling();

    this._fireLine = true;
  }

  enableFireLine() {
    this._fireLine = true;
  }

  disableFireLine() {
    this._fireLine = false;
  }

  burn(x,y,radius) {
    if (x > 1 && x < width - 2 && y > 1 && y < height - 2 && radius >= 10 && radius < 100) {
      this._current.fill(255);
      this._current.noStroke();
      let r = radius/4;
      for (let i=0; i<radius*2; i++) {
        let v = this.randomPointInACircle(radius/2, x, y);
        if (v.x - r > 1 && v.x + r < width - 2 && v.y - r > 1 && v.y + r < height - 2)
          this._current.circle(v.x, v.y, r);
      }
    }
  }

  randomPointInACircle(radius, xOffset, yOffset) {
    let a = random(0, TWO_PI);
    let r = radius * sqrt(random(0,1));
    return createVector(xOffset + r * cos(a), yOffset + r * sin(a));
  }

  selectAndSetupFireVariables(choice) {
    switch(choice) {
      case EffectsFire.BASIC.ID:
        this.setupFireEffectVariables(EffectsFire.BASIC);
        return;
      case EffectsFire.RAGING.ID:
        this.setupFireEffectVariables(EffectsFire.RAGING);
        return;
      case EffectsFire.TALL.ID:
        this.setupFireEffectVariables(EffectsFire.TALL);
        return;
    }
  }

  setupFireEffectVariables(effect) {
    this._yStartIncrement = effect.YSTART_INCREMENT;
    this._noiseIncrement = effect.NOISE_INCREMENT;
    this._burnRows = effect.BURN_ROWS;
    this._brightnessExponent = effect.BRIGHTNESS_EXPONENT;
    this._color = effect.color();
  }

  setupCooling() {
    this._cooling.loadPixels();
    let yOffset = this._yStart;
    for (let y = 0; y < this._ht; y++) {
      yOffset += this._noiseIncrement;
      this.drawCoolingRow(y, yOffset);
    }
    this._cooling.updatePixels();
  }

  /**
   * The cooling map is done using perlin noise
   */
  cool() {
    this._cooling.copy(0, 1, this._wd, this._ht - 1, 0, 0, this._wd, this._ht - 1);
    this._cooling.loadPixels();
    let yOffset = this._yStart + this._noiseIncrement;
    this.drawCoolingRow(this._ht - 1, yOffset);

    this._cooling.updatePixels();
    this._yStart += this._yStartIncrement;
  }
  
  drawCoolingRow(y, yOffset) {
    let xOffset = 0.0;
    for (let x = 0; x < this._wd; x++) {
      xOffset += this._noiseIncrement;
      let n = noise(xOffset, yOffset);
      let bright = pow(n, this._brightnessExponent) * 255;

      let index = (x + y * this._wd) * 4;
      this._cooling.pixels[index] = bright;
      this._cooling.pixels[index + 1] = bright;
      this._cooling.pixels[index + 2] = bright;
      this._cooling.pixels[index + 3] = 255;
    }
  }

  fire() {
    if (!this._fireLine) 
      return;

    this._current.loadPixels();
    for (let x = 1; x < this._wd - 1; x++) {
      for (let j = 2; j <= this._burnRows + 1; j++) {
        let y = this._ht - (j + 1);
        let index = (x + y * this._wd) * 4;
        this._current.pixels[index] = 255;
        this._current.pixels[index + 1] = 255;
        this._current.pixels[index + 2] = 255;
        this._current.pixels[index + 3] = 255;
      }
    }
    this._current.updatePixels();
  }

  show() {
    this.fire();
    this.cool();
    background(0);
    this._current.loadPixels();
    this._previous.loadPixels();
    for (let x = 1; x < this._wd - 1; x++) {
      for (let y = 1; y < this._ht - 1; y++) {
        let indexXY = (x + y * this._wd) * 4;
        let indexXplus1Y = ((x + 1) + y * this._wd) * 4;
        let indexXminus1Y = ((x - 1) + y * this._wd) * 4;
        let indexXYplus1 = (x + (y + 1) * this._wd) * 4;
        let indexXYminus1 = (x + (y - 1) * this._wd) * 4;

        let colorA = this._current.pixels[indexXplus1Y];
        let colorB = this._current.pixels[indexXminus1Y];
        let colorC = this._current.pixels[indexXYplus1];
        let colorD = this._current.pixels[indexXYminus1];

        let colorCool = this._cooling.pixels[indexXY];
        let newColor = (colorA + colorB + colorC + colorD) * 0.25;
        newColor = newColor - colorCool;

        this._previous.pixels[indexXYminus1] = newColor;
        this._previous.pixels[indexXYminus1 + 1] = newColor;
        this._previous.pixels[indexXYminus1 + 2] = newColor;
        this._previous.pixels[indexXYminus1 + 3] = 255;
      }
    }
    this._previous.updatePixels();

    this.swap();
    // image(this._cooling, 0, 0);
    this.drawFire();
  }

  drawFire() {
    this._finalFrame.loadPixels();
    for (let i=0; i<this._finalFrame.pixels.length/4; i++) {
      let index = i*4;
      this._finalFrame.pixels[index] = (this._previous.pixels[index] * this._color._r) / 255;
      this._finalFrame.pixels[index + 1] = (this._previous.pixels[index + 1] * this._color._g) / 255;
      this._finalFrame.pixels[index + 2] = (this._previous.pixels[index + 2] * this._color._b) / 255;
      this._finalFrame.pixels[index + 3] = this._previous.pixels[index + 3];
    }
    this._finalFrame.updatePixels();
    image(this._finalFrame, 0, 0);
  }

  swap() {
    let temp = this._previous;
    this._previous = this._current;
    this._current = temp;
  }
}

// Effect Types

EffectsFire.BASIC = {
  ID: 1,
  YSTART_INCREMENT: 0.02, // affects the vertical scroll of cooling
  NOISE_INCREMENT: 0.02, // affects the cooling canvas
  BURN_ROWS: 5,
  BRIGHTNESS_EXPONENT: 3, // affects the cooling canvas
  color: () => SketchColor.white()
};

EffectsFire.RAGING = {
  ID: 2,
  YSTART_INCREMENT: 0.1,
  NOISE_INCREMENT: 0.2,
  BURN_ROWS: 10,
  BRIGHTNESS_EXPONENT: 5,
  color: () => SketchColor.greenyellow()
};

EffectsFire.TALL = {
  ID: 3,
  YSTART_INCREMENT: 0.05,
  NOISE_INCREMENT: 0.2,
  BURN_ROWS: 8,
  BRIGHTNESS_EXPONENT: 4,
  color: () => SketchColor.orange()
};