/**
 * Checks for nearby vehicles and steers away
 */
class Separation {

  constructor(vehicles, desiredSeparation) {
    this._vehicles = vehicles;
    this._desiredSeparation = desiredSeparation;
  }

  run(vehicle) {
    let desiredSeparation = (this._desiredSeparation ? this._desiredSeparation : vehicle.size * 2);
    let closeVehicles = vehicles.filter(v => 
      v != vehicle && 
      distanceSquared(v.position, vehicle.position) < (desiredSeparation * desiredSeparation)
    );
    if (closeVehicles.length == 0) return createVector(0, 0);

    let force = (closeVehicles.map(v => 
      p5.Vector.sub(vehicle.position, v.position).normalize()
        .div(p5.Vector.dist(v.position, vehicle.position))
    ).reduce((total, next) => total.add(next), createVector(0, 0))).div(closeVehicles.length);

    if (force.mag() > 0) {
      force.normalize().mult(vehicle.maxSpeed).sub(vehicle.velocity).limit(vehicle.maxForce);
    }
    return force;
  }
}