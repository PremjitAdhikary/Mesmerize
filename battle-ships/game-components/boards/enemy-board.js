class EnemyBoard extends BaseBoard {
  constructor(x, y, size, cellsOnSide) {
    super(x, y, size, cellsOnSide);
    this.missedColor = blueMark;
    this.hitColor = redMark;
    this.allHits = [];
    this.hitCount = 0;
    this.missCount = 0;
  }

  show() {
    super.show();
    for (let aHit of this.allHits) {
      let aColor = (this.board[aHit.x][aHit.y] == EnemyBoard.HIT) ? this.hitColor : this.missedColor;
      this.drawCross(aColor, aHit.x, aHit.y);
    }
  }

  hitAttempt(row, col) {
    if (this.allHits.some( h => h.x == (row-1) && h.y == (col-1) ))  return false;
    this.allHits.push({ x: (row-1), y: (col-1) });
    this.board[row-1][col-1] = EnemyBoard.ATTEMPTED;
    return true;
  }

  hitSuccessful(row, col) {
    this.hitCount++;
    this.board[row-1][col-1] = EnemyBoard.HIT;
  }

  hitUnsuccessful(row, col) {
    this.missCount++;
    this.board[row-1][col-1] = EnemyBoard.MISSED;
  }

  cellState(row, col) {
    return this.board[row-1][col-1];
  }

  printBoard() {
    for (let i=0; i<this.cellsOnSide; i++) {
      let s = '';
      for (let j=0; j<this.cellsOnSide; j++) 
        s += (''+this.board[i][j]);
      console.log(s);
    }
  }

}

EnemyBoard.NOT_ATTEMPTED = 0
EnemyBoard.MISSED = 1;
EnemyBoard.HIT = 2;
EnemyBoard.ATTEMPTED = 3;