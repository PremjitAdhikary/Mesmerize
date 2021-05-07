class OffensiveAI extends DefensiveAI {

  constructor(lightCycle, commandCooldownThreshHold, safeTilesMax, opponent) {
    super(lightCycle, commandCooldownThreshHold, safeTilesMax);

    this._opponent = opponent;
  }

  command() {
    if (!this.isCommandEnabled()) 
      return;
    if (!this.hasObstacleInFront()) 
      return;
    this.makeSafeTurnIfPossible();
  }

  isOpponentWalled(checkRange) {
    let startR = this._opponent._currentGridR - checkRange;
    // let endR = this._opponent._currentGridR + checkRange;
    let startC = this._opponent._currentGridC - checkRange;
    // let endC = this._opponent._currentGridC + checkRange;
    // console.log(startR+' - '+endR);
    // console.log(startC+' - '+endC);
    let tempFeild = create2DArray(2*checkRange+1, 2*checkRange+1);
    console.log(this._opponent._grid);
    for (let r=0; r<=2*checkRange; r++) {
      for (let c=0; c<=2*checkRange; c++) {
        if ((startR + r) < 0 || (startR + r) >= this._opponent._grid._rows 
            || (startC + c) < 0 || (startC + c) >= this._opponent._grid._cols) {
          tempFeild[r][c] = OffensiveAI.OUT_OF_RANGE;
        } else if (this._opponent._grid._floor[startR + r][startC + c] != 0) {
          tempFeild[r][c] = OffensiveAI.BLOCK;
        } else {
          tempFeild[r][c] = 0;
        }
      }
    }
    console.log(tempFeild);
    return false;
  }
}

OffensiveAI.BLOCK = -1;
OffensiveAI.OUT_OF_RANGE = -2;