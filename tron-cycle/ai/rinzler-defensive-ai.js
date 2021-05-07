class RinzlerDefensiveAI extends DefensiveAI {

  constructor(lightCycle, commandCooldownThreshHold, safeTilesMax) {
    super(lightCycle, commandCooldownThreshHold, safeTilesMax);
  }

  safeTilesInDirection(direction) {
    let r = this._directionToTile.get(direction).r;
    let c = this._directionToTile.get(direction).c;
    let currR = this._lightCycle._currentGridR;
    let currC = this._lightCycle._currentGridC;
    for (let t=1; t<=this._safeTilesMax; t++) {
      if (!this._lightCycle._grid.isTileFree(currR+t*r, currC+t*c) 
        && this._lightCycle._grid.getTileOccupiedBy(currR+t*r, currC+t*c) != this._lightCycle._id) 
        return t-1;
    }
    return this._safeTilesMax+1;
  }

}