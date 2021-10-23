/**
 * Uses Scalar projection to fingure out the distance from the wall and follow the same
 * lookAhead() gives how far to look ahead for collisions
 * offset() gives how far the vehicle will stay away from the wall
 * showPrediction() whether to show the calculated vectors
 * 
 * Algorithm (for a wall segment)
 * predict a location ahead of vehicle (p_loc)
 * let wall start from a to b
 * Get normal on ab from p_loc
 *   get vector from a to p_loc (ap = p_loc - a)
 *   get vector from a to b (ab = b - a)
 *   normalize ab (n_ab = normalize(ab))
 *   project d on ab by using dot product (ab = ab x ap.dot(ab))
 *   normal = a + ab
 * Get point from normal on ap for distance offset (n_off)
 * seek(n_off)
 * 
 * Do this for all walls and select the nearest wall segment
 */
class FollowWall {

  constructor(environments) {
    this._environments = environments;
    this._lookAhead = 50;
    this._offset = 30;
    this._dummyTarget = new DummyTarget(0, 0);
    this._seek = new Seek(this._dummyTarget);
    this._showPredictedTarget = false;

    this._predictionColor = SketchColor.red().stringify();
    this._normalColor = SketchColor.skyblue().stringify();
    this._dummyTargetColor = SketchColor.green().stringify();
  }

  run(vehicle) {
    let prediction = p5.Vector.normalize(vehicle.velocity)
      .mult(this._lookAhead).add(vehicle.position);

    let maxDist = 100000;
    let normal;

    this._environments.forEach(
      env => env._walls.forEach(wall => {
        for (let i = 1; i < wall.length; i++) {
          let a = wall[(i-1)];
          let b = wall[i];
          let normalPt = FollowPath.normalPoint(prediction, a, b);

          if (FollowPath.isNormalPointOnLine(normalPt, a, b)) {
            normalPt = b.copy();
          }

          let distance = p5.Vector.dist(normalPt, prediction);
          if (distance < maxDist) {
            maxDist = distance;
            normal = normalPt.copy();

            let dir = p5.Vector.sub(prediction, normal).setMag(this._offset);
            let newTarget = normal.copy().add(dir);
            this._dummyTarget._position = !this.pointInEnvironment(newTarget) ? 
              newTarget : normal.copy().sub(dir);
          }
        }
      })
    );
    this.show(prediction, normal, vehicle);

    return this._seek.run(vehicle);
  }

  pointInEnvironment(checkPoint, show = false) {
    return this._environments.some(env => env.pointInUnreachable(checkPoint.x, checkPoint.y, show));
  }

  show(prediction, normal, vehicle) {
    if (!this._showPredictedTarget) return;
    noFill();
    stroke(this._predictionColor);
    circle(prediction.x, prediction.y, 10);
    line(prediction.x, prediction.y, vehicle.position.x, vehicle.position.y);
    if (normal) {
      stroke(this._normalColor);
      circle(normal.x, normal.y, 10);
      line(prediction.x, prediction.y, normal.x, normal.y);
      stroke(this._dummyTargetColor);
      circle(this._dummyTarget._position.x, this._dummyTarget._position.y, 10);
      line(this._dummyTarget._position.x, this._dummyTarget._position.y, 
        vehicle.position.x, vehicle.position.y);
    }
  }

  lookAhead(value) {
    this._lookAhead = value;
    return this;
  }

  offset(value) {
    this._offset = value;
    return this;
  }

  showPrediction(value) {
    this._showPredictedTarget = value;
    return this;
  }

}