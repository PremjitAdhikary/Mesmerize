class Flee {

  constructor(target) {
    this._seek = new Seek(target);
  }

  run(vehicle) {
    return this._seek.run(vehicle).mult(-1);
  }

}