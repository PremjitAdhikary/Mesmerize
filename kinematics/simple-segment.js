class SimpleSegment extends Segment {

  constructor(length, width, color, setter) {
    super(length, setter);
    this._wid = width;
    this._color = color;
  }

  render() {
    stroke(this._color);
    strokeWeight(this._wid);
    line(this._anchor.x, this._anchor.y, this._tip.x, this._tip.y);
  }

}