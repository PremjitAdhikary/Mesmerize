class Game {

  constructor(gameState) {
    this.contrast(false);
    this._states = [];
    if (!gameState)
      this._states.push(new GameState());
    else
      this._states.push(gameState);
    this._showState = 0;
  }

  // to change looks at runtime: 
  // game.contrast(true/false)
  contrast(val) {
    if (val) {
      this._lightColor = 255;
      this._darkColor = 0;
      this._highlightMove = SketchColor.gold().stringify();
      this._highlightCheck = SketchColor.orange().stringify();
    } else {
      this._lightColor = (new SketchColor(192, 200, 199)).stringify();
      this._darkColor = (new SketchColor(125, 135, 150)).stringify();
      this._highlightMove = SketchColor.skyblue().alpha75().stringify();
      this._highlightCheck = SketchColor.violet().alpha75().stringify();
    }
  }

  setTag(name, value) {
    this[name] = () => value;
  }

  move(moveNode) {
    let currState = this._states[this._states.length - 1];
    let nextState = currState.play(moveNode);
    this._states.push(nextState);
  }

  setComment(comment) {
    this._states[this._states.length-1]._comment = comment;
  }

  // render functions

  show() {
    this.renderBoard();
    this.renderMe();
  }

  renderBoard() {
    let startX = width / 2 - Game.tileSize * 4;
    let startY = 10 + Game.tileSize * 7;

    this.drawBoard(startX, startY);
    this.hilightSquares(startX, startY);
    this.drawPieces(startX, startY);

    this.showComment();
  }

  drawBoard(startX, startY) {
    let isLightColor = false;
    strokeWeight(1);
    for (let i=0; i<8; i++) {
      for (let j=0; j<8; j++) {
        stroke(isLightColor ? this._lightColor : this._darkColor);
        fill(isLightColor ? this._lightColor : this._darkColor);
        square(startX + Game.tileSize * j, startY - Game.tileSize * i, Game.tileSize);
        isLightColor = !isLightColor;
      }
      isLightColor = !isLightColor;
    }
  }

  hilightSquares(startX, startY) {
    let moveFrom = this._states[this._showState]._moveFrom;
    if (moveFrom >= 0) {
      strokeWeight(Game.hilightStrokeWeight);
      stroke(this._highlightMove);
      noFill();
      square(startX + Game.tileSize * (moveFrom % 8), 
        startY - Game.tileSize * (Math.floor(moveFrom / 8)), Game.tileSize);
      let moveTo = this._states[this._showState]._moveTo;
      square(startX + Game.tileSize * (moveTo % 8), 
        startY - Game.tileSize * (Math.floor(moveTo / 8)), Game.tileSize);
    }
    if (this._states[this._showState]._inCheck) {
      let kingIndex = PieceCommons.findIndicesOfPiecesOnBoard(
        this._states[this._showState]._state, (this._states[this._showState].isWhitesMove() ? 
        GameState.Pieces.wK : GameState.Pieces.bK))[0];
      strokeWeight(Game.hilightStrokeWeight);
      stroke(this._highlightCheck);
      noFill();
      square(startX + Game.tileSize * (kingIndex % 8), 
        startY - Game.tileSize * (Math.floor(kingIndex / 8)), Game.tileSize);
    }
  }

  drawPieces(startX, startY) {
    if (allPiecesImg) {
      for (let i=0; i<8; i++) {
        for (let j=0; j<8; j++) {
          let piece = this._states[this._showState]._state[i*8 + j];
          if (piece == 0) continue;
          let spriteY = (piece > 0 ? 0 : 1) * Game.tileSize;
          let spriteX = (Math.abs(piece) - 1) * Game.tileSize;
          let img = allPiecesImg.get(spriteX, spriteY, Game.tileSize, Game.tileSize);
          image(img, startX + Game.tileSize * j, startY - Game.tileSize * i);
        }
      }
    }
  }

  showComment() {
    let comment = this._states[this._showState]._comment;
    if (comment) {
      stroke(SketchColor.white().stringify());
      fill(SketchColor.white().stringify());
      strokeWeight(1);
      textSize(12);
      let tWidth = textWidth(comment);
      if (tWidth < width)
        text(comment, (width - tWidth)/2, 435);
      else {
        let commentLines = this.breakComment(comment);
        let offSet = 0;
        for (let commentLine of commentLines) {
          let cltWidth = textWidth(commentLine);
          text(commentLine, (width - cltWidth)/2, 435 + offSet);
          offSet += 15;
        }
      }
    }
  }

  breakComment(comment) {
    let spWidth = textWidth(' ');
    let commentTokens = comment.split(' ');
    let commentLines = [];
    let currentLine = '';
    let currentLineWidth = 0;
    for (let token of commentTokens) {
      let tokenWidth = textWidth(token) + spWidth;
      if (currentLineWidth + tokenWidth < width) {
        currentLineWidth += tokenWidth;
        currentLine += (token + ' ');
      } else {
        commentLines.push(currentLine);
        currentLine = token + ' ';
        currentLineWidth = tokenWidth;
      }
    }
    commentLines.push(currentLine);
    return commentLines;
  }

  renderMe() {
    let imgY = (this.White() == 'Me' ? 315 : 10);
    image(myImg, 10, imgY);
  }

}

Game.tileSize = 50;
Game.hilightStrokeWeight = 5;