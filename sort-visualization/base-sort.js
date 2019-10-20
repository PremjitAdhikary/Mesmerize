class BaseSort {

  constructor(baseColor, strokeWid) {
    this._strokeWid = strokeWid;
    this._array = new Array(width/this._strokeWid);
    for (let i=0; i<this._array.length; i++) {
      this._array[i] = floor(map(i, 0, this._array.length, height-5, 0));
    }
    shuffle(this._array, true);
    this._baseColor = baseColor;
  }

  renderBars() {
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
    strokeWeight(this._strokeWid);
    for (let i=0; i<this._array.length; i++) {
      stroke(SketchColor.gold().stringify());
      point(floor(this._strokeWid/2) + i*this._strokeWid, height - this._array[i]);
    }
  }

  render(renderStyle) {
    this.sort();
    switch(renderStyle) {
      case 1: this.renderBars(); break;
      case 2: this.renderCurve(); break;
      case 3: this.renderPoints(); break;
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