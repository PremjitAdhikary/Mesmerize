/**
 * For the average location of all nearby vehicles, calculate steering vector towards it
 */
class Cohesion {

  constructor(vehicles, desiredNeighborhood) {
    this._vehicles = vehicles;
    this._desiredNeighborhood = desiredNeighborhood;
    this._cohesionTarget = new DummyTarget(0, 0);
    this._seek = new Seek(this._cohesionTarget);
  }

  run(vehicle) {
    let desiredNeighborhood = (this._desiredNeighborhood ? 
      this._desiredNeighborhood : vehicle.size * 4);
      
    let neighborVehicles = this._vehicles.filter(v => 
      v != vehicle && 
      distanceSquared(v.position, vehicle.position) < (desiredNeighborhood * desiredNeighborhood)
    );
    if (neighborVehicles.length == 0) return createVector(0, 0);

    let target = (neighborVehicles
      .map(v => v.position)
      .reduce((total, next) => total.add(next), createVector(0, 0)))
      .div(neighborVehicles.length);
    this._cohesionTarget._position.x = target.x;
    this._cohesionTarget._position.y = target.y;
    
    return this._seek.run(vehicle);
  }

}