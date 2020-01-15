class TouchMeNotBall {

  constructor(position, size) {
    this._position = position;
    this._size = size;
    this._ballColor = SketchColor.greenyellow().stringify();
    this._glowColor = SketchColor.greenyellow().alpha75().stringify();
  }
  
  render() {
    noStroke();
    fill(this._ballColor);
    circle(this._position.x, this._position.y, this._size);
    fill(this._glowColor);
    circle(this._position.x, this._position.y, this._size*2);
  }

  touched(by) {
    return this._position.dist(by) < (this._size * 0.8);
  }
  
}