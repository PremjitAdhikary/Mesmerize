/**
 * Original Source: https://codepen.io/bt-sugita/pen/RpZOLq
 */
class EffectsCloud {

  constructor(wd, ht, gap, xNoiseIncr, yNoiseIncr, edgeMultiplier, noiseMultiplier) {
    this._wd = wd;
    this._ht = ht;
    this._wdOffset = wd / 4;

    this._gap = gap;
    
    this._xStart = random(10);
    this._xNoise = this._xStart;
    this._xNoiseIncrement = xNoiseIncr;
    this._yNoise = random(10);
    this._yNoiseIncrement = yNoiseIncr;

    this.initCloudPoints(edgeMultiplier, noiseMultiplier);

    this._colorA = color(255);
    this._colorB = color(150, 150, 150);
  }

  setColor(color) {
    for (let cloudPoint of this._cloudPoints) {
      cloudPoint.setColor(color);
    }
  }

  setGradient(colorA, colorB) {
    this._colorA = color(colorA.stringify());
    this._colorB = color(colorB.stringify());
  }

  initCloudPoints(edgeMultiplier, noiseMultiplier) {
    this._cloudPoints = [];
    for(var y = 0; y <= this._ht; y += this._gap) {
      this._yNoise += this._yNoiseIncrement;
      this._xNoise = this._xStart;
      for(var x = -this._wdOffset; x <= this._wd + this._wdOffset; x += this._gap) {
        this._xNoise += this._yNoiseIncrement;
        this._cloudPoints.push(new CloudPoint(
          x, y, 
          noise(this._xNoise, this._yNoise), 
          this._wd, this._wdOffset, 
          edgeMultiplier, noiseMultiplier));
      }
    }
  }

  show() {
    this.drawBackground();
    for (let cloudPoint of this._cloudPoints) {
      cloudPoint.show();
    }
  }

  drawBackground() {
    for (let y=0; y < this._ht; y++) {
      let newColor = lerpColor(this._colorA, this._colorB, map(y, 0, this._ht, 0, 1));
      stroke(newColor);
      line(0, y, this._wd, y);
    }
  }

}

class CloudPoint {

  constructor(x, y, noiseFactor, maxWd, wdOffset, edgeMultiplier, noiseMultiplier) {
    this._x = x;
    this._y = y;
    this._noiseFactor = noiseFactor;
    this._maxWd = maxWd;
    this._wdOffset = wdOffset;
    this._noiseMultiplier = noiseMultiplier;

    this._edgeSize = this._noiseFactor * edgeMultiplier;
    this._alph = 150 + (this._noiseFactor * this._noiseMultiplier);
    this.setColor(new SketchColor(150, 150, 150));
  }

  setColor(color) {
    this._color = color.copy();
    this._color._r += (this._noiseFactor * this._noiseMultiplier);
    this._color._g += (this._noiseFactor * this._noiseMultiplier);
    this._color._b += (this._noiseFactor * this._noiseMultiplier);
  }

  show() {
    push();
    translate(this._x, this._y);
    rotate(this._noiseFactor * radians(540));
    noStroke();
    fill(this._color._r, this._color._g, this._color._b, this._alph);
    ellipse(0, 0, this._edgeSize, this._edgeSize/2);
    pop();
    this._x += 0.5;
    if (this._x > this._maxWd + this._wdOffset)
      this._x = -this._wdOffset;
  }
}