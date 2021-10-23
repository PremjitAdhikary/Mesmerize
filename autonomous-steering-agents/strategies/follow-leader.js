/**
 * Pursues a target behind by some distance (and slows down if close)
 * followRadius(value) sets that distance
 * slowRadius(value) sets the deceleration radius
 * showFollow(value) whether to show the calculated vectors
 */
class FollowLeader {

  constructor(target) {
    if (!target._velocity) throw 'Not a capable leader!';
    this._pursuit = new Pursuit(target);
    this._pursuit.predictionMax(-20);
  }

  run(vehicle) {
    return this._pursuit.run(vehicle, true);
  }

  followRadius(value) {
    this._pursuit.predictionMax(-value);
  }

  slowRadius(value) {
    this._pursuit.slowRadius(value);
  }

  showFollow(value) {
    this._pursuit.showPrediction(value);
  }

}