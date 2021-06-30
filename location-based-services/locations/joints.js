class Joints {

  constructor(x, y, id, name, type) {
    this._id = id;
    this._type = type;
    this._name = name;
    this._x = x;
    this._y = y;
    this._color = (type == Joints.BREWERY ? SketchColor.orange().stringify() : SketchColor.indigo().stringify())
  }

  render(color = this._color) {
    stroke(color);
    strokeWeight(5);
    point(this._x, this._y);
  }

  renderInfo() {
    let tSize = 10;
    rectMode(CENTER);
    noStroke();
    textSize(tSize);
    fill(SketchColor.white().alpha75().stringify());
    let txtWidth = textWidth(this._name);
    rect(this._x, this._y - 13, txtWidth, 15, 2);
    fill(0);
    text(this._name, this._x - txtWidth/2, this._y - tSize);
  }
  
}

Joints.PUB = 'pub';
Joints.BREWERY = 'brewery';