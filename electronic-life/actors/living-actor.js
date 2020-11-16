/**
 * Base class for all Living actors. Living actors can act. They need energy to act. How they act 
 * is based on the behaviours the actor has and which one of the behaviour is applicable. When they 
 * act is decided by the world they reside in. The moment they run out of enery, they die.
 * 
 * Constructor:
 * - world: the world in which this actor will be registered
 * - r: row of this actor in the world grid
 * - c: col of this actor in the world grid
 * - type: type of the actor
 * - energy: initial energy of the actor
 * - builder: builder for its offspring
 * 
 * Other Methods:
 * - addBehaviour(behaviour): Adds a behavoiur to the actor
 * - dayUpdated(): This is where the 'world' sends a message to the actor so that he/she can act
 * - setState(state): Sets the State to inform actor is busy in some action
 * - resetState(): Self Explanatory
 * - setAction(action): Sets the action that the actor would be busy doing
 * - resetAction(): Self Explanatory
 * - simulateGrowth(val): This is purely aesthetics. If set to true, depicts the actor growing 
 *     into adult as days pass. By default this is true.
 * - isChild(): Every living actor has a adultAge. So till daysOld is less that this, its true
 * - createOffspring(): Uses the builder to craete an Offspring from this actor
 * - isAlive(): Self Explanatory
 * - die(): When death comes, this method does all the clean up
 * - showInfo(): Diplays info of this actor if _showInfo is true
 */
class LivingActor extends WorldActor {
  
  constructor(world, r, c, type, energy, builder) {
    super(world, r, c, type);
    this._energy = energy;
    this._daysOld = 0;
    this._adultAge = 0;
    this._generation = 0;
    this._showInfo = false;
    
    this._state;
    this._behaviours = [];
    
    this._simulateGrowth = true;
    this._renderAlpha = 1.0;

    this._foundLocations;

    this._action;

    this._builder = builder;
  }

  addBehaviour(behaviour) {
    this._behaviours.push(behaviour);
  }

  /**
   * Every day, if not busy doind something, go through available behaviours as per priority and 
   * if execute the first one applicable.
   * Can be overridden by sub classes to react to this
   */
  dayUpdated() {
    this._daysOld++;
    if (!this._state) {
      for (let behaviour of this._behaviours) {
        if (behaviour.behave()) break;
      }
    }
  }

  setState(state) {
    this._state = state;
  }

  resetState() {
    this._state = null;
  }

  setAction(action) {
    this._action = action;
  }

  resetAction() {
    this._action = null;
  }

  simulateGrowth(val) {
    this._simulateGrowth = val;
  }

  isChild() {
    return this._daysOld < this._adultAge;
  }

  createOffspring() {
    let bSpace = random(this._foundLocations);
    this._foundLocations = [];
    let offspring = this._builder(this._world, bSpace.x, bSpace.y, this._builder);
    offspring._generation = this._generation + 1;
    return offspring;
  }

  isAlive() {
    return !(this._state == Die.IS_DYING || this._state == Die.DEAD);
  }

  die() {
    this.setState(Die.IS_DYING);
    this._energy = 0;
    this.setAction(() => {
      this._renderAlpha -= 0.05;
      if (this._renderAlpha <= 0) {
        this.resetAction();
        this.setState(Die.DEAD);
        this._world.deregister(this, this._r, this._c);
      }
    });
  }

  showInfo() {
    if (!this._showInfo) return;

    let tSize = 10;
    rectMode(CENTER);
    noStroke();
    textSize(tSize);
    let energyMessage = LivingActor.MESSAGE_ENERGY + this._energy.toFixed(1);
    let generationMessage = LivingActor.MESSAGE_GENERATION + this._generation;
    let daysMessage = LivingActor.MESSAGE_DAYS + this._daysOld;
    let txtWidth = textWidth(generationMessage);
    fill(SketchColor.white().alpha75().stringify());
    let l = this.getLocation();
    rect(l.x, l.y - 25, txtWidth, 35, 5);
    fill(0);
    text(energyMessage, l.x - txtWidth/2, l.y - tSize - 25);
    text(generationMessage, l.x - txtWidth/2, l.y - 25);
    text(daysMessage, l.x - txtWidth/2, l.y + tSize - 25);
  }
  
}

LivingActor.MESSAGE_ENERGY = "Energy: ";
LivingActor.MESSAGE_DAYS = "Days: ";
LivingActor.MESSAGE_GENERATION = "Generation: ";