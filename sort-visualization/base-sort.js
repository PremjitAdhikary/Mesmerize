class BaseSort {

  constructor(baseColor, strokeWid) {
    this._strokeWid = strokeWid;
    this._array = new Array(width/this._strokeWid);
    this._max = height-5; 
    for (let i=0; i<this._array.length; i++) {
      this._array[i] = floor(map(i, 0, this._array.length, this._max, 0));
    }
    shuffle(this._array, true);
    this._baseColor = baseColor;
  }

  renderBars() {
    colorMode(RGB, 100);
    strokeCap(SQUARE);
    let stWt = this._strokeWid > 3 ? (this._strokeWid - 2) : this._strokeWid;
    strokeWeight(stWt);
    for (let i=0; i<this._array.length; i++) {
      stroke(this.getColor(i));
      line(
        floor(this._strokeWid/2) + i*this._strokeWid, 
        height, 
        floor(this._strokeWid/2) + i*this._strokeWid, 
        height - this._array[i]);
    }
  }

  renderCurve() {
    colorMode(RGB, 100);
    strokeWeight(min(this._strokeWid,2));
    beginShape();
    noFill();
    vertex(0,height);
    stroke(SketchColor.gold().stringify());
    for (let i=0; i<this._array.length; i++) {
      vertex(floor(this._strokeWid/2) + i*this._strokeWid, height - this._array[i]);
    }
    vertex(width,0);
    endShape();
  }

  renderPoints() {
    colorMode(RGB, 100);
    strokeWeight(this._strokeWid);
    for (let i=0; i<this._array.length; i++) {
      stroke(SketchColor.gold().stringify());
      point(floor(this._strokeWid/2) + i*this._strokeWid, height - this._array[i]);
    }
  }

  renderDisk() {
    colorMode(HSB, 100); // Hue, Saturation, Brightness, allows the nice color wheel
    noStroke();
    let end = radians(360 / this._array.length);
    for (let i=0; i<this._array.length; i++) {
      let angle = map(i, 0, this._array.length - 1, 0, 360);
      let h = map(this._array[i], 0, this._max, 0, 100);
      push();
      translate(width / 2, height / 2);
      rotate(radians(angle));
      fill(h, 100, 100);
      arc(0, 0, this._max - 15, this._max - 15, 0, end);
      pop();
    }
  }

  render(renderStyle) {
    this.sort();
    switch(renderStyle) {
      case 1: this.renderBars(); break;
      case 2: this.renderCurve(); break;
      case 3: this.renderPoints(); break;
      case 4: this.renderDisk(); break;
    }
  }

  sort() {
    // this is where the algorithm needs to work
  }

  getColor() {
    // this where you ask for color
  }

  swap(a,b) {
    let tmp = this._array[a];
    this._array[a] = this._array[b];
    this._array[b] = tmp;
  }

}

BaseSort.STEP_MODE = "step";
BaseSort.LOOP_MODE = "loop";