/**
 * The class which holds all the other classes together and delegates appropriate operations.
 * 
 * Constructor:
 * - electronicEnvironment: Initial environment without any actors
 * - builderMap: the non-living builders
 * 
 * Other Methods:
 * - register(actor, r, c): Registers an actor in the world cell (r,c)
 * - deregister(actor, r, c): Deregisters an actor from the world cell (r,c)
 * - updateRegister(actor, prevR, prevC, currR, currC): Moves actor from previous cell to current 
 *     cell
 * - show(): bunch of steps-
 *     1) calls show on all the world elements
 *     2) sends messages to actors to act if they have any assigned action
 *     3) updates Day
 * - updateDay(): internal method which gets called from show(). This taeks care of the 'turn'
 * - ripple(x, y): adds a ripple to (x,y). Internally uses the ripple effect in 
 *     electronicEnvironment. When creatures move over water, this is triggered
 * - enableShow(x, y): enables showInfo for actors at (x,y)
 * - showInfo(): calls showInfo() on all living actors
 * - publishActionToLiving(action): internal method to publish passed action to each living actor
 * - publishActionToNonLiving(action): same as above for the non-living
 * - showMessage(): The world over message
 * - convertCoordinateToPixel(r,c): Gives back pixel vector location for world cell(r,c)
 * - convertPixelToCoordinate(v): Gives back world cell (in vector format) for passed pixel vector
 */
class World {
  
  constructor(electronicEnvironment, builderMap) {
    this._electronicEnvironment = electronicEnvironment;
    let envData = electronicEnvironment._configData;
    this._data = create2DArray(envData.data.length, envData.data[0].length);
    this._actors = 0;
    this._actorMap = new Map();
    this._actorMap.set(Land.TYPE, []);
    this._actorMap.set(Hive.TYPE, []);
    this._actorMap.set(Fish.TYPE, []);
    this._actorMap.set(Lily.TYPE, []);
    this._actorMap.set(Turtle.TYPE, []);
    this._actorMap.set(Worm.TYPE, []);
    this._actorMap.set(Fly.TYPE, []);
    for (let r = 0; r < electronicEnvironment._envData.length; r++) {
      for (let c = 0; c < electronicEnvironment._envData[r].length; c++) {
        this._data[r][c] = [];
        if (builderMap[electronicEnvironment._envData[r][c]]) {
          builderMap[electronicEnvironment._envData[r][c]](this, r, c);
        }
      }
    }

    this._nonLivingActorTypes = new Set();
    this._nonLivingActorTypes.add(Land.TYPE);
    this._nonLivingActorTypes.add(Hive.TYPE);

    this._daysOld = 0;
    this._dayOldIncrementCounter = 0;

    this._isAlive = true;
  }

  register(actor, r, c) {
    this._data[r][c].push(actor);
    this._actorMap.get(actor._type).push(actor);
    this._actors++;
  }

  deregister(actor, r, c) {
    let index = this._data[r][c].indexOf(actor);
    if (index > -1) {
      this._data[r][c].splice(index, 1);
    }
    let actorArr = this._actorMap.get(actor._type);
    let actorIndex = actorArr.indexOf(actor);
    if (index > -1) {
      actorArr.splice(actorIndex, 1);
    }
    this._actors--;
  }

  updateRegister(actor, prevR, prevC, currR, currC) {
    let index = this._data[prevR][prevC].indexOf(actor);
    if (index > -1) {
      this._data[prevR][prevC].splice(index, 1);
    }
    this._data[currR][currC].push(actor);
  }

  show() {
    this._electronicEnvironment.show();
    this.publishActionToNonLiving( actor => actor.show() );
    this.publishActionToLiving( actor => actor.show() );
    this.publishActionToLiving( actor => {
      if (actor._action != null) actor._action();
    } );
    if (!this._isAlive) 
      this.showMessage();
    this.updateDay();
  }

  updateDay() {
    if (this._dayOldIncrementCounter == World.DAYS_OLD_INCREMENT_FREQUENCY/2) {
      updateStats();
    }
    if (this._dayOldIncrementCounter >= World.DAYS_OLD_INCREMENT_FREQUENCY) {
      this._dayOldIncrementCounter = 0;
      this._daysOld++;
      this.publishActionToLiving( actor => actor.dayUpdated() );
      if (this._isAlive && this._actors == this._actorMap.get(Land.TYPE).length ) {
        this._isAlive = false;
      }
      this.publishActionToNonLiving( actor => actor.dayUpdated() );
    }
    this._dayOldIncrementCounter++;
  }

  ripple(x, y) {
    this._electronicEnvironment.ripple(x, y);
  }

  enableShow(x, y) {
    let size = this._electronicEnvironment._configData.size / 2;
    this.publishActionToLiving( actor => {
      let actorLoc = actor.getLocation();
      let toEnableShow = x > actorLoc.x - size && x < actorLoc.x + size 
        && y > actorLoc.y - size && y < actorLoc.y + size;
      actor._showInfo = toEnableShow;
    } );
  }

  showInfo() {
    this.publishActionToLiving( actor => actor.showInfo() );
  }

  publishActionToLiving(action) {
    for (let [actorType, actors] of this._actorMap.entries()) {
      if (this._nonLivingActorTypes.has(actorType)) continue;
      for (let actor of actors) 
        action(actor);
    }
  }

  publishActionToNonLiving(action) {
    for (let [actorType, actors] of this._actorMap.entries()) 
      if (this._nonLivingActorTypes.has(actorType)) 
        for (let actor of actors) 
          action(actor);
  }

  showMessage() {
    rectMode(CENTER);
    noStroke();
    fill(SketchColor.gold().alpha75().stringify());
    rect(width/2, height/2, 250, 50, 5);
    fill(SketchColor.black().alpha75().stringify());
    textSize(15);
    let txtWidth = textWidth(World.MESSAGE);
    text(World.MESSAGE, (width - txtWidth)/2, height/2);
  }

  convertCoordinateToPixel = (r,c) => {
    let cellSize = electronicEnvironment._configData.size;
    return createVector(
      c * cellSize + cellSize/2,
      r * cellSize + cellSize/2
    );
  }

  convertPixelToCoordinate = (v) => {
    let cellSize = electronicEnvironment._configData.size;
    return createVector(
      Math.floor(v.y/cellSize), 
      Math.floor(v.x/cellSize)
    );
  }
}

World.DAYS_OLD_INCREMENT_FREQUENCY = 8;
World.MESSAGE = "It's GAME OVER for this World!";