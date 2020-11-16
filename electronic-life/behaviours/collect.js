/**
 * Collect nectar from plants around to taek to hive where it can be converted to energy.
 * 
 * Every time the pollinator lands on a plants, it registers itself as to the plants as 
 * a pollinator.
 * 
 * Constructor:
 * - actor: 
 * - energyCost:
 * - collectibleType: 
 * - collectCriteria: This can be customized
 * - ratioToCollect: The ratio pollinator extracts energy from the flower as nectar
 * - maxToCollect: The pollinator wont collect more than this much nectar
 */
class Collect extends Behaviour {
  
  constructor(actor, energyCost, collectibleType, collectCriteria, ratioToCollect, maxToCollect) {
    super(collectCriteria);
    this._actor = actor;
    this._cost = energyCost;
    this._collectibleType = collectibleType;
    this._ratioToCollect = ratioToCollect;
    this._maxToCollect = maxToCollect;
  }

  executeBehaviour() {
    let loc = random(this._actor._foundLocations);
    let collectible = this._actor._world._data[loc.x][loc.y]
      .find(actor => actor._type == this._collectibleType);
    this._actor._energy -= this._cost;
    this._actor.setState(Collect.IS_COLLECTING);
    this._actor.setAction( () => {
        let actualLocation = collectible.getLocation();
        if (this._actor.onLocation(actualLocation)) {
          this._actor._world.ripple(actualLocation.x, actualLocation.y);
          let collected = Math.min(collectible._energy * this._ratioToCollect, this._maxToCollect);
          this._actor._nectar += collected;
          collectible._energy -= collected;
          collectible._pollinator = this._actor;
          this._actor._collectedFrom.push(collectible);
          this.resetActorBehaviour(this._actor);
        }
        this._actor.moveTo(actualLocation);
      }
    );
    return true;
  }

}

Collect.IS_COLLECTING = "is-collecting";