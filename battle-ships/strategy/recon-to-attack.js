class ReconToAttack {

  constructor(enemyBoard, cellSide) {
    this.enemyBoard = enemyBoard;
    this.cellSide = cellSide;
    this.generateReconPoints();
    this.probableTargets = [];
  }

  run () {
    if (this.probableTargets.length == 0) {
      this.generateProbableTargets();
    }
    if (this.probableTargets.length > 0) {
      return this.probableTargets.shift();
    }
    return this.getReconMove();
  }

  generateReconPoints() {
    this.reconPoints = [];
    for (let i=1; i<=this.cellSide; i+=2) 
      for (let j=2; j<=this.cellSide; j+=2) 
        this.reconPoints.push({x:i,y:j});
    for (let i=2; i<=this.cellSide; i+=2) 
      for (let j=1; j<=this.cellSide; j+=2) 
        this.reconPoints.push({x:i,y:j});
  }

  generateProbableTargets() {
    for (let i=1; i<=this.cellSide; i++) 
      for (let j=1; j<=this.cellSide; j++) 
        if (this.enemyBoard.cellState(i, j) == EnemyBoard.HIT) 
          this.addNeighbourAsTargets(i, j);
  }

  addNeighbourAsTargets(i, j) {
    if (i>1 && this.enemyBoard.cellState(i-1, j) == EnemyBoard.NOT_ATTEMPTED) 
      this.probableTargets.push({x:i-1,y:j,});
    if (i<this.cellSide && this.enemyBoard.cellState(i+1, j) == EnemyBoard.NOT_ATTEMPTED) 
      this.probableTargets.push({x:i+1,y:j,});
    if (j>1 && this.enemyBoard.cellState(i, j-1) == EnemyBoard.NOT_ATTEMPTED) 
      this.probableTargets.push({x:i,y:j-1,});
    if (j<this.cellSide && this.enemyBoard.cellState(i, j+1) == EnemyBoard.NOT_ATTEMPTED) 
      this.probableTargets.push({x:i,y:j+1,});
  }

  getReconMove() {
    while (true) {
      let moveIndex = Math.floor(random(this.reconPoints.length));
      let move = this.reconPoints[moveIndex];
      this.reconPoints 
        = this.reconPoints.slice(0, moveIndex).concat(this.reconPoints.slice(moveIndex+1));
      if (this.enemyBoard.cellState(move.x, move.y) == EnemyBoard.NOT_ATTEMPTED) {
        this.enemyBoard.hitAttempt(move.x, move.y);
        return move;
      }
    }
  }

}