class Guide {
  constructor(cx, cy, d, px, py, id) {
    this._cx = cx;
    this._cy = cy;
    this._d = d;
    this._px = px;
    this._py = py;
    this._id = id;
  }

  drawGuideCircle(color) {
    stroke(color);
    strokeWeight(2);
    circle(this._cx, this._cy, this._d);
    strokeWeight(1);
    text(this._id, this._cx-9, this._cy+5);
    
    strokeWeight(6);
    point(this._cx + this._px, this._cy + this._py);
  }

  drawVerticalGuideLine(color) {
    stroke(color);
    strokeWeight(1);
    line(this._cx + this._px, 0, this._cx + this._px, height);
  }

  drawHorizontalGuideLine(color) {
    stroke(color);
    strokeWeight(1);
    line(0, this._cy + this._py, width, this._cy + this._py);
  }
}