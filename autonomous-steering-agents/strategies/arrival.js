/**
 * Slows down at target.
 * Go to Seek for actual impelementation
 */
class Arrival {

  constructor(target) {
    this._seek = new Seek(target);
  }

  run(vehicle) {
    return this._seek.run(vehicle, true);
  }

  slowRadius(value) {
    this._seek._slowRadius = value;
    return this;
  }

}