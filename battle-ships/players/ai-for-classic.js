class AiForClassic {
  constructor(boardConfig, strategyBuilder) {
    this.boardConfig = boardConfig;
    this.myBoard = new MyBoard(boardConfig.startX, boardConfig.startY, boardConfig.side, boardConfig.cellsSide);
    this.enemyBoard = new EnemyBoard(boardConfig.startX, boardConfig.startY, boardConfig.side, boardConfig.cellsSide);
    this.boardConfig = boardConfig;
    this.isBoardSet = false;
    this.isMyTurn = false;
    this.strategy = strategyBuilder(this.enemyBoard, boardConfig.cellsSide);
  }

  show() { }

  addShips(ships) {
    for (let s=0; s<ships.length; s++) {
      if (random(100) > 50) ships[s].switchOrientation();
      while (true) {
        let row = Math.ceil(random(this.boardConfig.cellsSide));
        let col = Math.ceil(random(this.boardConfig.cellsSide));
        if (this.myBoard.addShip(ships[s], row, col)) break;
      }
    }
  }

  attacked(row, col) {
    return this.myBoard.hit(row, col);
  }

  run() {
    return this.strategy.run();
  }

  runOutcome(row, col, success) {
    if (success)
      this.enemyBoard.hitSuccessful(row, col);
    else 
      this.enemyBoard.hitUnsuccessful(row, col);
  }

  successRate() {
    let total = (this.enemyBoard.hitCount + this.enemyBoard.missCount);
    return total == 0 ? 0 : Math.floor(100 * this.enemyBoard.hitCount / total);
  }

}