class King {
  
  static deduceSourceSquare = (state, move) => {
    let destination = PieceCommons.destinationSquare(move);
    let destinationIndex = PieceCommons.notationToIndex(destination);
    let isACapture = PieceCommons.isACapture(move);
    let isWhiteMove = state.isWhitesMove('w');
    let kingIndex = PieceCommons.findIndicesOfPiecesOnBoard(
      state._state, (isWhiteMove ? GameState.Pieces.wK : GameState.Pieces.bK))[0];

    if (King.isDestinationReachable(kingIndex, destinationIndex, 
        state._state, isWhiteMove, isACapture)) {
      return kingIndex;
    }
    throw 'Illegal move: ' + move;
  }

  static directionFunctions = [
    PieceCommons.stepNorth,
    PieceCommons.stepSouth,
    PieceCommons.stepEast,
    PieceCommons.stepWest,
    PieceCommons.stepNorthEast,
    PieceCommons.stepNorthWest,
    PieceCommons.stepSouthEast,
    PieceCommons.stepSouthWest
  ];

  static isDestinationReachable(sourceIndex, destinationIndex, state, isWhiteMove, isACapture) {
    for (let directionFunction of King.directionFunctions) {
      let di = directionFunction(sourceIndex, 1);
      if (di == destinationIndex) {
        let moveIntoEmptySquare = !isACapture && state[di] == 0;
        let captureOpponent = (isACapture && (
          (isWhiteMove && state[di] < 0) || (!isWhiteMove && state[di] > 0)
        )
        );
        if (moveIntoEmptySquare || captureOpponent)
          return true;
      }
    }
    return false;
  }
}