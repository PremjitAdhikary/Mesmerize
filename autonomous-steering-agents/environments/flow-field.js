/**
 * A mine fields of flow fields :)
 * cellSize determines at what intervals a different flow will occur
 * randomFlow() generates a random flow field
 * perlinFlow() is better as it generates a flow based on perlin noise
 * directedFlow(x, y) points all the flows in the field to (x, y)
 * calcFlow(position) returns the flow at position
 */
class FlowField {

  constructor(cellSize) {
    this._cellSize = cellSize;
    this._cols = width/this._cellSize;
    this._rows = height/this._cellSize;
    this._field = create2DArray(this._rows, this._cols);
    this._fieldColor = 255;
  }

  randomFlow() {
    forEach2DArray(this._field, (v, r, c) => this._field[r][c] = p5.Vector.random2D());
  }

  perlinFlow() {
    noiseSeed(Math.floor(random(1000)));
    for (let c = 0, xOffset = 0; c < this._cols; c++, xOffset += 0.1) {
      for (let r = 0, yOffset = 0; r < this._rows; r++, yOffset += 0.1) {
        let angle = map(noise(xOffset, yOffset), 0, 1, 0, TWO_PI);
        this._field[r][c] = createVector(cos(angle), sin(angle));
      }
    }
  }

  directedFlow(x, y) {
    let target = createVector(Math.floor(x), Math.floor(y));
    forEach2DArray(this._field, (v, r, c) => 
      this._field[r][c] = p5.Vector
        .sub(target, createVector(this._cellSize * c, this._cellSize * r)).setMag(1)
    );
  }

  calcFlow(position) {
    return this._field
      [(Math.floor(position.y / this._cellSize) + this._rows) % this._rows]
      [(Math.floor(position.x / this._cellSize) + this._cols) % this._cols];
  }

  show() {
    strokeWeight(2);
    stroke(this._fieldColor);
    forEach2DArray(this._field, (v, r, c) => {
      push();
      translate(c * this._cellSize + this._cellSize / 2, r * this._cellSize + this._cellSize / 2);
      rotate(v.heading());
      let len = v.mag() * this._cellSize / 2;
      line(-len/2, 0, len/2, 0);
      line(len/2, 0, len/6, -len/6);
      line(len/2, 0, len/6, len/6);
      pop();
    } );
  }
}