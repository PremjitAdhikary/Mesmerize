class GameState {

  constructor(state) {
    if (state)
      this._state = state;
    else 
      this.setInitialBoard();
  }

  setInitialBoard() {
    this._state = [];
    this._state.push(GameState.Pieces.wR);
    this._state.push(GameState.Pieces.wN);
    this._state.push(GameState.Pieces.wB);
    this._state.push(GameState.Pieces.wQ);
    this._state.push(GameState.Pieces.wK);
    this._state.push(GameState.Pieces.wB);
    this._state.push(GameState.Pieces.wN);
    this._state.push(GameState.Pieces.wR);
    for (let i=0; i<8; i++)
      this._state.push(GameState.Pieces.wP);
    for (let i=0; i<32; i++)
      this._state.push(0);
    for (let i=0; i<8; i++)
      this._state.push(GameState.Pieces.bP);
    this._state.push(GameState.Pieces.bR);
    this._state.push(GameState.Pieces.bN);
    this._state.push(GameState.Pieces.bB);
    this._state.push(GameState.Pieces.bQ);
    this._state.push(GameState.Pieces.bK);
    this._state.push(GameState.Pieces.bB);
    this._state.push(GameState.Pieces.bN);
    this._state.push(GameState.Pieces.bR);
    
    this._canWhiteCastleKingSide = true;
    this._canWhiteCastleQueenSide = true;
    this._canBlackCastleKingSide = true;
    this._canBlackCastleQueenSide = true;
    this._nextMoveBy = 'w';

    this._id = '0';
  }

  play(moveNode) {
    if (moveNode.move.startsWith('O-O-O')) {
      return this.castleQueenSide(moveNode);
    }
    
    if (moveNode.move.startsWith('O-O')) {
      return this.castleKingSide(moveNode);
    }
    
    let piece = PieceCommons.movingPiece(moveNode.move);
    let destination = PieceCommons.notationToIndex(PieceCommons.destinationSquare(moveNode.move));
    let source = GameState.getPieceDeduceSource(piece)(this, moveNode.move);
    let nextState = this.cloneState();
    nextState[destination] = nextState[source];
    nextState[source] = 0;
    let nextGameState = new GameState(nextState);
    nextGameState._moveFrom = source;
    nextGameState._moveTo = destination;
    //
    if (piece == 'P' && this.isEnPassantable(source, destination)) {
      nextGameState.enPassantable = {
        at: destination, 
        by: (destination + (this.isWhitesMove() ? - 8 : 8))
      };
    }

    if (piece == 'P' && this.enPassantable && destination == this.enPassantable.by) {
      nextGameState._state[this.enPassantable.at] = 0;
    }

    this.updateCastlingPrivileges(nextGameState, piece, source);

    this.updateNextState(nextGameState, moveNode);

    return nextGameState;
  }

  isEnPassantable(source, destination) {
    let sourceRank = Math.floor(source / 8);
    let destinationRank = Math.floor(destination / 8);
    return (this.isWhitesMove() && sourceRank == 1 && destinationRank == 3) 
      || (!this.isWhitesMove() && sourceRank == 6 && destinationRank == 4);
  }

  updateCastlingPrivileges(nextGameState, movingPiece, source) {
    if (this.isWhitesMove() && movingPiece == 'K') {
      this.updateCastlingFlags(nextGameState, false, false, this._canBlackCastleKingSide, 
        this._canBlackCastleQueenSide);
      return;
    }
    if (!this.isWhitesMove() && movingPiece == 'K') {
      this.updateCastlingFlags(nextGameState, this._canWhiteCastleKingSide, 
        this._canWhiteCastleQueenSide, false, false);
      return;
    }
    if (this.isWhitesMove() && movingPiece == 'R') {
      this.updateCastlingFlags(nextGameState, 
        (source == PieceCommons.notationToIndex('h1') ? false : this._canWhiteCastleKingSide), 
        (source == PieceCommons.notationToIndex('a1') ? false : this._canWhiteCastleQueenSide), 
        this._canBlackCastleKingSide, this._canBlackCastleQueenSide);
      return;
    }
    if (!this.isWhitesMove() && movingPiece == 'R') {
      this.updateCastlingFlags(nextGameState, 
        this._canWhiteCastleKingSide, this._canWhiteCastleQueenSide,
        (source == PieceCommons.notationToIndex('h8') ? false : this._canWhiteCastleKingSide), 
        (source == PieceCommons.notationToIndex('a8') ? false : this._canWhiteCastleQueenSide));
      return;
    }
    this.updateCastlingFlags(nextGameState, this._canWhiteCastleKingSide, 
      this._canWhiteCastleQueenSide, this._canBlackCastleKingSide, this._canBlackCastleQueenSide);
  }

  castleKingSide(moveNode) {
    if (this.isWhitesMove() && this._canWhiteCastleKingSide
      && this._state[PieceCommons.notationToIndex('f1')] == 0 
      && this._state[PieceCommons.notationToIndex('g1')] == 0) {
        let nextState = this.cloneState();
        nextState[PieceCommons.notationToIndex('e1')] = 0;
        nextState[PieceCommons.notationToIndex('f1')] = GameState.Pieces.wR;
        nextState[PieceCommons.notationToIndex('g1')] = GameState.Pieces.wK;
        nextState[PieceCommons.notationToIndex('h1')] = 0;

        let nextGameState = new GameState(nextState);
        nextGameState._moveFrom = PieceCommons.notationToIndex('e1');
        nextGameState._moveTo = PieceCommons.notationToIndex('g1');
        this.updateCastlingFlags(nextGameState, false, false, this._canBlackCastleKingSide, 
          this._canBlackCastleQueenSide);
        this.updateNextState(nextGameState, moveNode);
    
        return nextGameState;
    } else if (!this.isWhitesMove() && this._canBlackCastleKingSide
      && this._state[PieceCommons.notationToIndex('f8')] == 0 
      && this._state[PieceCommons.notationToIndex('g8')] == 0) {
        let nextState = this.cloneState();
        nextState[PieceCommons.notationToIndex('e8')] = 0;
        nextState[PieceCommons.notationToIndex('f8')] = GameState.Pieces.bR;
        nextState[PieceCommons.notationToIndex('g8')] = GameState.Pieces.bK;
        nextState[PieceCommons.notationToIndex('h8')] = 0;

        let nextGameState = new GameState(nextState);
        nextGameState._moveFrom = PieceCommons.notationToIndex('e8');
        nextGameState._moveTo = PieceCommons.notationToIndex('g8');
        this.updateCastlingFlags(nextGameState, this._canWhiteCastleKingSide, 
          this._canWhiteCastleQueenSide, false, false);
        this.updateNextState(nextGameState, moveNode);
    
        return nextGameState;
    }
    throw 'Illegal move: ' + move;
  }

  castleQueenSide(moveNode) {
    if (this.isWhitesMove() && this._canWhiteCastleQueenSide
      && this._state[PieceCommons.notationToIndex('b1')] == 0 
      && this._state[PieceCommons.notationToIndex('c1')] == 0 
      && this._state[PieceCommons.notationToIndex('d1')] == 0) {
        let nextState = this.cloneState();
        nextState[PieceCommons.notationToIndex('a1')] = 0;
        nextState[PieceCommons.notationToIndex('c1')] = GameState.Pieces.wK;
        nextState[PieceCommons.notationToIndex('d1')] = GameState.Pieces.wR;
        nextState[PieceCommons.notationToIndex('e1')] = 0;

        let nextGameState = new GameState(nextState);
        nextGameState._moveFrom = PieceCommons.notationToIndex('e1');
        nextGameState._moveTo = PieceCommons.notationToIndex('c1');
        this.updateCastlingFlags(nextGameState, false, false, this._canBlackCastleKingSide, 
          this._canBlackCastleQueenSide);
        this.updateNextState(nextGameState, moveNode);
    
        return nextGameState;
    } else if (!this.isWhitesMove() && this._canBlackCastleQueenSide
      && this._state[PieceCommons.notationToIndex('b8')] == 0 
      && this._state[PieceCommons.notationToIndex('c8')] == 0 
      && this._state[PieceCommons.notationToIndex('d8')] == 0) {
        let nextState = this.cloneState();
        nextState[PieceCommons.notationToIndex('a8')] = 0;
        nextState[PieceCommons.notationToIndex('c8')] = GameState.Pieces.bK;
        nextState[PieceCommons.notationToIndex('d8')] = GameState.Pieces.bR;
        nextState[PieceCommons.notationToIndex('e8')] = 0;

        let nextGameState = new GameState(nextState);
        nextGameState._moveFrom = PieceCommons.notationToIndex('e8');
        nextGameState._moveTo = PieceCommons.notationToIndex('c8');
        this.updateCastlingFlags(nextGameState, this._canWhiteCastleKingSide, 
          this._canWhiteCastleQueenSide, false, false);
        this.updateNextState(nextGameState, moveNode);
    
        return nextGameState;
    }
    throw 'Illegal move: ' + move;
  }

  updateNextState(nextGameState, moveNode) {
    nextGameState._nextMoveBy = this._nextMoveBy == 'w' ? 'b' : 'w';
    nextGameState._id = moveNode.num + this._nextMoveBy;
    nextGameState._parent = this._id;
    if (moveNode.move.endsWith('+') || moveNode.move.endsWith('#')) {
      nextGameState._inCheck = true;
    }
  }

  // utilities

  updateCastlingFlags(gameState, wKS, wQS, bKS, bQS) {
    gameState._canWhiteCastleKingSide = wKS;
    gameState._canWhiteCastleQueenSide = wQS;
    gameState._canBlackCastleKingSide = bKS;
    gameState._canBlackCastleQueenSide = bQS;
  }

  clone() {
    let theClone = new GameState(this.cloneState());

    this.updateCastlingFlags(theClone, this._canWhiteCastleKingSide, this._canWhiteCastleQueenSide, 
      this._canBlackCastleKingSide, this._canBlackCastleQueenSide);
    theClone._nextMoveBy = this._nextMoveBy;
    theClone._moveFrom = this._moveFrom;
    theClone._moveTo = this._moveTo;

    theClone._id = this._id + 'c';
    theClone._parent = this._id;
    theClone._inCheck = this._inCheck;

    return theClone;
  }

  cloneState() {
    let newState = [];
    this._state.forEach( s => newState.push(s));
    return newState;
  }

  isWhitesMove = () => this._nextMoveBy == 'w';

  // for debugging
  printState() {
    let str = '';
    for (let rank=7; rank>=0; rank--) {
      for (let file=0; file<8; file++) {
        str += (' ' +  GameState.getPiece(this._state[rank * 8 + file]) + ' ');
      }
      str += '\n';
    }
    console.log(str);
  }
}

GameState.Pieces = {
  wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6,
  bP: -1, bN: -2, bB: -3, bR: -4, bQ: -5, bK: -6
};
GameState.getPiece = (val) => {
  let pieces = ['P', 'N', 'B', 'R', 'Q', 'K'];
  if (val == 0) return '  ';
  if (val < 0) {
    return 'b' + pieces[(val * (-1)) - 1];
  } else {
    return 'w' + pieces[val - 1];
  }
}
GameState.getPieceDeduceSource = (function () {
  let pieceMap = new Map();
  pieceMap.set('P', Pawn.deduceSourceSquare);
  pieceMap.set('N', Knight.deduceSourceSquare);
  pieceMap.set('B', Bishop.deduceSourceSquare);
  pieceMap.set('R', Rook.deduceSourceSquare);
  pieceMap.set('Q', Queen.deduceSourceSquare);
  pieceMap.set('K', King.deduceSourceSquare);

  return piece => pieceMap.get(piece);
})();