class Human {
  constructor(boardConfig) {
    this.boardConfig = boardConfig;
    this.myBoard = new MyBoard(boardConfig.startX, boardConfig.startY, 
      boardConfig.side, boardConfig.cellsSide);
    this.enemyBoard = new EnemyBoard(boardConfig.startX, boardConfig.startY, 
      boardConfig.side, boardConfig.cellsSide);
    this.boardConfig = boardConfig;
    this.isBoardSet = false;
    this.isMyTurn = true;
  }

  show() {
    if (!this.isBoardSet || !this.isMyTurn) {
      this.myBoard.show();
      return;
    }
    this.enemyBoard.show();
  }

  isEventOnBoard(x, y) {
    return x >= this.boardConfig.startX && x <= (this.boardConfig.startX + this.boardConfig.side) 
      && y >= this.boardConfig.startY && y <= (this.boardConfig.startY + this.boardConfig.side);
  }

  addShipAt(x, y, ship) {
    let col = this.getColForX(x);
    let row = this.getRowForY(y);
    return this.myBoard.addShip(ship, row, col);
  }

  fireAttempt(row, col) {
    return this.enemyBoard.hitAttempt(row, col);
  }

  fireOutcome(row, col, success) {
    if (success)
      this.enemyBoard.hitSuccessful(row, col);
    else 
      this.enemyBoard.hitUnsuccessful(row, col);
  }

  successRate() {
    let total = (this.enemyBoard.hitCount + this.enemyBoard.missCount);
    return total == 0 ? 0 : Math.floor(100 * this.enemyBoard.hitCount / total);
  }

  getColForX(x) {
    let side = this.boardConfig.side / this.boardConfig.cellsSide;
    return Math.ceil((x - this.boardConfig.startX) / side);
  }

  getRowForY(y) {
    let side = this.boardConfig.side / this.boardConfig.cellsSide;
    return Math.ceil((y - this.boardConfig.startY) / side);
  }

  attacked(row, col) {
    this.myBoard.resetHilight();
    this.myBoard.hilight(row, col);
    return this.myBoard.hit(row, col);
  }
  
}