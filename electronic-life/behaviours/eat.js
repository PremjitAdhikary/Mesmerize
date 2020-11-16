/**
 * Enables Locomoting Actors to hunt and eat.
 * 
 * Constructor:
 * - actor: 
 * - energyCost: to move you need energy
 * - foodType: what can this actor hunt and eat
 * - eatCriteria: this is different for different actors and worlds
 */
class Eat extends Behaviour {
  
  constructor(actor, energyCost, foodType, eatCriteria) {
    super(eatCriteria);
    this._actor = actor;
    this._cost = energyCost;
    this._foodType = foodType;
  }

  /**
   * The criteria fill ups this._actor._foundLocations with eligible food locations. The actor 
   * selects one of them at random and hunts it (if the target is locomotor, then the hunt takes 
   * a while).
   * Till the time the actor is moving towards the target location, it's state is set to 
   * IS_HUNTING and action to a hunting one.
   * Every moment the actor checks if the food is still available, because theres a chance that 
   * another actor may have already consumed the food. If food is already consumed, the actor 
   * abandons the hunt and resets state and action.
   * The moment actor reaches the food, it eats it and resets its state and action.
   */
  executeBehaviour() {
    let loc = random(this._actor._foundLocations);
    if (loc == null) return false;
    let food = this._actor._world._data[loc.x][loc.y].find(a => a._type == this._foodType);
    this._actor._energy -= this._cost;
    this._actor.setState(Eat.IS_HUNTING);
    this._actor.setAction( () => {
      if (food == null || !food.isAlive()) {
        this.resetActorBehaviour(this._actor);
      } else {
        let actualLocation = food.getLocation();
        if (this._actor.onLocation(actualLocation)) {
          this._actor._energy += food._energy;
          food.die();
          this.resetActorBehaviour(this._actor);
        }
        this._actor.moveTo(actualLocation);
      }
    } );
    return true;
  }

}

Eat.IS_HUNTING = "is-hunting";