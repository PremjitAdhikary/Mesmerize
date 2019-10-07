class Curve {
  constructor(color) {
    this.path = [];
    this.current;
    this.color = color;
  }

  addPoint(point) {
    this.current = createVector(point.x, point.y);
    this.path.push(this.current);
  }

  show() {
    stroke(this.color);
    strokeWeight(1.5);
    noFill();
    beginShape();
    for (let v of this.path) {
      vertex(v.x, v.y);
    }
    endShape();

    strokeWeight(6);
    point(this.current.x, this.current.y);
  }

  clear() {
    this.path = [];
  }

}