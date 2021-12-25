class SudokuBoard {

  constructor() {
    this.cells = create2DArray(9, 9);
    forEach2DArray(this.cells, (elem, r, c) => this.cells[r][c] = new SudokuCell() );
  }

  initialize(arr) {
    forEach2DArray(this.cells, (elem, r, c) => {
      if (arr[c][r] > 0) this.cells[r][c].initialize(arr[c][r])
    } );
  }

  set(r, c, val) {
    this.cells[c][r].solve(val);
  }

  reset(r, c) {
    this.cells[c][r].reset();
  }

  draw() {
    this.drawCells();
    this.drawBoard();
  }

  drawCells() {
    strokeWeight(1);
    textSize(25);
    textFont('Courier New');
    for (let i=0; i<=8; i++) {
      for (let j=0; j<=8; j++) {
        if (this.cells[i][j].state == SudokuCell.INITIALIZED)
          fill(cellInitColor);
        else 
          fill(0);
        square(width/2 - (CELL_SIZE*9)/2 + CELL_SIZE*i, 
          height/2 - (CELL_SIZE*9)/2 + CELL_SIZE*j, CELL_SIZE);
        let off = CELL_SIZE/2 - textWidth(this.cells[i][j].val)/2;
        if (this.cells[i][j].state == SudokuCell.INITIALIZED) {
          stroke(lineColor);
          fill(lineColor);
          text(this.cells[i][j].val, width/2 - (CELL_SIZE*9)/2 + CELL_SIZE*i + off, 
            height/2 - (CELL_SIZE*9)/2 + CELL_SIZE*j + CELL_SIZE/2 + 9);
        } else if (this.cells[i][j].state == SudokuCell.SOLVED) {
          stroke(lineColor);
          fill(lineColor);
          text(this.cells[i][j].val, width/2 - (CELL_SIZE*9)/2 + CELL_SIZE*i + off, 
            height/2 - (CELL_SIZE*9)/2 + CELL_SIZE*j + CELL_SIZE/2 + 9);
        }
      }
    }
  }
  
  drawBoard() {
    stroke(lineColor);
    strokeWeight(5);
    noFill();
    square(width/2 - (CELL_SIZE*9)/2, height/2 - (CELL_SIZE*9)/2, CELL_SIZE*9);
    for (let i=1; i<=8; i++) {
      strokeWeight((i%3 == 0 ? 5 : 2));
      line(width/2 - (CELL_SIZE*9)/2, height/2 - (CELL_SIZE*9)/2 + CELL_SIZE*i, 
        width/2 + (CELL_SIZE*9)/2, height/2 - (CELL_SIZE*9)/2 + CELL_SIZE*i);
      line(width/2 - (CELL_SIZE*9)/2 + CELL_SIZE*i, height/2 - (CELL_SIZE*9)/2, 
        width/2 - (CELL_SIZE*9)/2 + CELL_SIZE*i, height/2 + (CELL_SIZE*9)/2);
    }
  }

}

class SudokuCell {

  constructor() {
    this.reset();
  }

  initialize(val) {
    if (val < 1 || val > 9) return;
    this.state = SudokuCell.INITIALIZED;
    this.val = val;
  }

  solve(val) {
    if (val < 1 || val > 9) return;
    this.state = SudokuCell.SOLVED;
    this.val = val;
  }

  reset() {
    if (this.state == SudokuCell.INITIALIZED) return;
    this.state = SudokuCell.EMPTY;
    this.val = 0;
  }

}

SudokuCell.INITIALIZED = 'I';
SudokuCell.EMPTY = 'E';
SudokuCell.SOLVED = 'S';