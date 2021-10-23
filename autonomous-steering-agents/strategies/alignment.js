/**
 * For every nearby vehicles, calculate the average velocity
 */
class Alignment {

  constructor(vehicles, desiredNeighborhood) {
    this._vehicles = vehicles;
    this._desiredNeighborhood = desiredNeighborhood;
  }

  run(vehicle) {
    let desiredNeighborhood = (this._desiredNeighborhood ? 
      this._desiredNeighborhood : vehicle.size * 2.5);
      
    let neighborVehicles = vehicles.filter(v => 
      v != vehicle && 
      distanceSquared(v.position, vehicle.position) < (desiredNeighborhood * desiredNeighborhood)
    );
    if (neighborVehicles.length == 0) return createVector(0, 0);

    let force = (neighborVehicles
      .map(v => v.velocity)
      .reduce((total, next) => total.add(next), createVector(0, 0)))
      .div(neighborVehicles.length);

    if (force.mag() > 0) {
      force.setMag(vehicle.maxSpeed).sub(vehicle.velocity).limit(vehicle.maxForce);
    }
    return force;
  }

}