class ReconAndAttack {

  constructor(enemyBoard, cellSide) {
    this.enemyBoard = enemyBoard;
    this.cellSide = cellSide;
    this.generateReconPoints();
  }

  run() {
    if (!this.isReconOver()) {
      return this.getReconMove();
    }
    if (this.probableAttackPoints == undefined) this.generateAttackPoints();
    return this.getHighProbableMove();
  }

  generateReconPoints() {
    this.reconPoints = [];
    for (let i=1; i<=this.cellSide; i+=2) 
      for (let j=1; j<=this.cellSide; j+=2) 
        this.reconPoints.push({x:i,y:j});
    for (let i=2; i<=this.cellSide; i+=2) 
      for (let j=2; j<=this.cellSide; j+=2) 
        this.reconPoints.push({x:i,y:j});
  }

  isReconOver() {
    return this.reconPoints.length == 0;
  }

  getReconMove() {
    let moveIndex = Math.floor(random(this.reconPoints.length));
    let move = this.reconPoints[moveIndex];
    this.reconPoints 
      = this.reconPoints.slice(0, moveIndex).concat(this.reconPoints.slice(moveIndex+1));
    this.enemyBoard.hitAttempt(move.x, move.y);
    return move;
  }

  generateAttackPoints() {
    this.probableAttackPoints = [];
    for (let i=1; i<=this.cellSide; i++) 
      for (let j=1; j<=this.cellSide; j++) 
        if (this.enemyBoard.cellState(i, j) == EnemyBoard.NOT_ATTEMPTED) 
          this.probableAttackPoints.push({x:i,y:j,
            cnt:this.getNeighborHitCount(i, j),fired:false});
    this.probableAttackPoints.sort((a,b) => {
      if (a.cnt < b.cnt) return -1;
      else if (a.cnt > b.cnt) return 1;
      return 0;
    });
  }

  getNeighborHitCount(i, j) {
    let neighborsHitCount = 0;
    if (i>1 && this.enemyBoard.cellState(i-1, j) == EnemyBoard.HIT) neighborsHitCount++;
    if (i<this.cellSide && this.enemyBoard.cellState(i+1, j) == EnemyBoard.HIT) neighborsHitCount++;
    if (j>1 && this.enemyBoard.cellState(i, j-1) == EnemyBoard.HIT) neighborsHitCount++;
    if (j<this.cellSide && this.enemyBoard.cellState(i, j+1) == EnemyBoard.HIT) neighborsHitCount++;
    return neighborsHitCount;
  }

  getHighProbableMove() {
    let availableTargetPoints = this.probableAttackPoints.filter(p => !p.fired);
    for (let count=4; count>=0; count--) {
      if (availableTargetPoints.some(p => p.cnt == count)) {
        let probableTargets = availableTargetPoints.filter(p => p.cnt == count);
        let moveIndex = Math.floor(random(probableTargets.length));
        probableTargets[moveIndex].fired = true;
        return probableTargets[moveIndex];
      }
    }
  }

}