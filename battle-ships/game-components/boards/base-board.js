class BaseBoard {
  constructor(x, y, size, cellsOnSide) {
    this.cellsOnSide = cellsOnSide;
    this.board = create2DArray(this.cellsOnSide, this.cellsOnSide);
    forEach2DArray(this.board, (arr, r, c) => this.board[r][c] = 0);
    this.x = x;
    this.y = y;
    this.len = size;
    this.side = size/this.cellsOnSide;
    this.resetHilight();
  }

  resetHilight() {console.log('???')
    this.toHilight = [];
  }

  hilight(row, col) {
    this.toHilight.push({ x: row, y: col });
    console.log(this.toHilight.length);
  }

  show() {
    stroke(pencilMark);
    strokeWeight(1);
    for (let i=0; i<=this.cellsOnSide; i++) {
      scribble.scribbleLine( this.x, this.y+this.side*i, this.x+this.len, this.y+this.side*i );
    }
    for (let i=0; i<=this.cellsOnSide; i++) {
      scribble.scribbleLine( this.x+this.side*i, this.y, this.x+this.side*i, this.y+this.len );
    }
    console.log(this.toHilight.length);
    for (let hl of this.toHilight) {
      fill(hilightColor);
      stroke(hilightColor);
      strokeWeight(1);
      circle(this.x+hl.y*this.side-this.side/2, this.y+hl.x*this.side-this.side/2, this.side);
    }
  }

  drawCross(stColor, i, j) {
    stroke(stColor);
    strokeWeight(1);
    scribble.scribbleLine(this.x+j*this.side+this.side/4, this.y+i*this.side+this.side/4, 
      this.x+j*this.side+this.side*3/4, this.y+i*this.side+this.side*3/4);
    scribble.scribbleLine(this.x+j*this.side+this.side*3/4, this.y+i*this.side+this.side/4, 
      this.x+j*this.side+this.side/4, this.y+i*this.side+this.side*3/4);
  }
}