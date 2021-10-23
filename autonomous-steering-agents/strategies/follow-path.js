/**
 * Uses Scalar projection to fingure out the distance from the path and seek it if vehicle 
 * lookAhead() gives how far to look ahead for collisions
 * showPrediction() whether to show the calculated vectors
 * 
 * is not on path
 * Algorithm (for a path segment ie path with no turns):
 * predict a location ahead of vehicle (p_loc)
 * let path start from a to b
 * Get normal on ab from p_loc
 *   get vector from a to p_loc (ap = p_loc - a)
 *   get vector from a to b (ab = b - a)
 *   normalize ab (n_ab = normalize(ab))
 *   project d on ab by using dot product (ab = ab x ap.dot(ab))
 *   normal = a + ab
 * Get distance from normal (dist = dist(noraml, p_loc))
 * if dist > path wid, then vehicle is not on path
 * in that case seek(normal)
 * 
 * Do this for the nearest path segment (by getting distance from all path segments and select 
 * minimum)
 */
class FollowPath {

  constructor(path) {
    this._path = path;
    this._lookAhead = 50;
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

    for (let i = 1; i < this._path._points.length + 1; i++) {
      if (i == this._path._points.length && !this._path._isClosed) break;

      let a = this._path._points[(i-1) % this._path._points.length];
      let b = this._path._points[i % this._path._points.length];
      let normalPt = FollowPath.normalPoint(prediction, a, b);

      if (FollowPath.isNormalPointOnLine(normalPt, a, b)) {
        normalPt = b.copy();
      }

      let distance = p5.Vector.dist(normalPt, prediction);
      if (distance < maxDist) {
        maxDist = distance;
        normal = normalPt.copy();

        let dir = p5.Vector.sub(b, a).setMag(this._lookAhead / 4);
        this._dummyTarget._position = normal.copy().add(dir);
      }
    }
    this.show(prediction, normal, vehicle);

    if (maxDist > this._path._wid/2) {
      return this._seek.run(vehicle);
    }
    return p5.Vector.normalize(vehicle.velocity).mult(vehicle.maxSpeed).limit(vehicle.maxForce);
  }

  static normalPoint(p, a, b) {
    let ab = p5.Vector.sub(b, a).normalize();
    return ab.mult(p5.Vector.sub(p, a).dot(ab)).add(a);
  }

  static isNormalPointOnLine(np, a, b) {
    return np.x < min(a.x, b.x) || np.x > max(a.x, b.x) 
      || np.y < min(a.y, b.y) || np.y > max(a.y, b.y);
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

  showPrediction(value) {
    this._showPredictedTarget = value;
    return this;
  }

}