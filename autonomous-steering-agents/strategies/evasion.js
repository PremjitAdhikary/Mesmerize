class Evasion {

  constructor(target) {
    this._pursuit = new Pursuit(target);
  }

  run(vehicle) {
    return this._pursuit.run(vehicle).mult(-1);
  }

  predictionMax(value) {
    this._pursuit.predictionMax(value);
    return this;
  }

  showPrediction(value) {
    this._pursuit.showPrediction(value);
    return this;
  }

}