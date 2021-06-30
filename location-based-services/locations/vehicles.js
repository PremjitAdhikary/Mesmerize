class Vehicles {

  constructor(x, y, id) {
    this._id = id;
    this._dest = createVector(x, y);
    let mover = new Mover(this._dest);
    mover.setTopSpeed(0.3);
    this._availableColor = SketchColor.indigo().stringify();
    this._hiredColor = SketchColor.red().stringify();
    let renderer = new VehicleRenderer(8, this._availableColor);
    this._baseCar = new BasicCreature(mover, renderer);
    this._hired = false;
  }

  setHired() {
    this._hired = true;
    this._baseCar._renderer._color = this._hiredColor;
  }

  setAvailable() {
    this._hired = false;
    this._baseCar._renderer._color = this._availableColor;
  }

  get _x() { return this._baseCar._mover.getLocation().x; }
  get _y() { return this._baseCar._mover.getLocation().y; }

  setDestination(destination) { this._dest = destination; this.setAvailable(); }

  onLocation() { return this._baseCar.onLocation(this._dest); }
  moveTo() { this._baseCar.moveTo(this._dest); }
  render() { this._baseCar.render(); }

  stateCopy() {
    return { _id: this._id, _x: this._x, _y: this._y, _color: this._availableColor, _hired: this._hired };
  }
}

class VehicleRenderer {
  
  constructor(len, color) {
    this._len = len;
    this._color = color;
  }

  render(mover) {
    noStroke();
    fill(this._color);
    push();
    translate(mover._location.x, mover._location.y);
    rotate(mover._angle);
    triangle(this._len/2, 0, -this._len/2, -this._len/4, -this._len/2, this._len/4);
    pop();
  }

}