/**
 * Pollination and Rreproduction.
 * 
 * A plant can be a father, if it attaches its pollen to the pollinator, or mother if it recieves 
 * pollen and creates an offspring next to it.
 * 
 * To make things a bit more interesting, evolution is simulated by blending the colors of the 
 * parents and it's own color.
 */
class PollinateAndReproduce extends Behaviour {

  constructor(actor, energyCost, energyRequired, chance) {
    super(pollinateAndReproduceCriteria(actor, energyRequired, chance));
    this._actor = actor;
    this._cost = energyCost;
  }

  executeBehaviour() {
    this._actor._energy -= this._cost;
    if (this._actor._foundLocations && this._actor._foundLocations.length > 0) { 
      let offSpring = this._actor.createOffspring();
      offSpring._petalColor = SketchColor.blend(
        offSpring._petalColor, 
        this._actor._petalColor, 
        this._actor._pollinator._pollen._petalColor
      );
      offSpring.updateRenderer();
    } else {
      this._actor._pollinator._pollen = this._actor;
    }
    this._actor._pollinator = null;
    return true;
  }

}