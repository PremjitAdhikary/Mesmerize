class DefensiveAI {

  constructor(lightCycle, commandCooldownThreshHold, safeTilesMax) {
    this._lightCycle = lightCycle;
    this._commandCooldownCounter = 0;
    this._commandCooldownThreshHold = commandCooldownThreshHold;

    this._safeTilesMax = safeTilesMax;

    this.setDirectionToTileMap();
  }

  setDirectionToTileMap() {
    this._directionToTile = new Map();
    this._directionToTile.set(LightCycle.DIRECTION.NORTH, {r:-1, c:0});
    this._directionToTile.set(LightCycle.DIRECTION.SOUTH, {r:1, c:0});
    this._directionToTile.set(LightCycle.DIRECTION.EAST, {r:0, c:1});
    this._directionToTile.set(LightCycle.DIRECTION.WEST, {r:0, c:-1});
  }

  command() {
    if (!this._lightCycle.isActive()) 
      return;
    if (!this.readyToCommand())
      return;
    if (!this.hasObstacleInFront()) 
      return;

    let frontSafe = this.safeTilesInFront();
    if (random(100) >= this.chanceToTurn(frontSafe))
      return;
    
    let leftSafe = this.safeTilesOnLeft();
    let rightSafe = this.safeTilesOnRight();
    if (this.noSafeTurn(leftSafe, rightSafe)) 
      return;

    if (this.leftTurnPossible(leftSafe, rightSafe))  {
      this._lightCycle.left();
    } else {
      this._lightCycle.right();
    }
  }

  leftTurnPossible(leftSafe, rightSafe) {
    if (leftSafe > rightSafe)
      return true;
    let randomLeft = random(100) > 50;
    return (leftSafe == rightSafe && randomLeft);
  }

  noSafeTurn(leftSafe, rightSafe) {
    return leftSafe == 0 && rightSafe == 0;
  }

  readyToCommand() {
    this._commandCooldownCounter++;
    if (this.isCommandInCooldown()) {
      return false;
    }
    this._commandCooldownCounter = 0;
    return true;
  }

  isCommandInCooldown() {
    return (this._commandCooldownCounter < this._commandCooldownThreshHold);
  }

  hasObstacleInFront() {
    return this.safeTilesInFront() <= this._safeTilesMax;
  }

  safeTilesInFront() {
    return this.safeTilesInDirection(this._lightCycle._direction);
  }

  safeTilesOnLeft() {
    return this.safeTilesInDirection(LightCycle.leftFromDirection(this._lightCycle._direction));
  }

  safeTilesOnRight() {
    return this.safeTilesInDirection(LightCycle.rightFromDirection(this._lightCycle._direction));
  }

  safeTilesInDirection(direction) {
    let r = this._directionToTile.get(direction).r;
    let c = this._directionToTile.get(direction).c;
    let currR = this._lightCycle._currentGridR;
    let currC = this._lightCycle._currentGridC;
    for (let t=1; t<=this._safeTilesMax; t++) {
      if (!this._lightCycle._grid.isTileFree(currR+t*r, currC+t*c)) 
        return t-1;
    }
    return this._safeTilesMax+1;
  }

  chanceToTurn(obstacleSafe) {
    return map(obstacleSafe, this._safeTilesMax, 1, 10, 100);
  }

}