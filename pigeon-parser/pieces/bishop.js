class Bishop {
  
  static deduceSourceSquare = (state, move) => {
    let destination = PieceCommons.destinationSquare(move);
    let destinationIndex = PieceCommons.notationToIndex(destination);
    let isACapture = PieceCommons.isACapture(move);
    let isWhiteMove = state.isWhitesMove('w');
    let bishopsOnBoard = PieceCommons.findIndicesOfPiecesOnBoard(
      state._state, (isWhiteMove ? GameState.Pieces.wB : GameState.Pieces.bB));

    let possibleSources = [];
    for (let bishopIndex of bishopsOnBoard) {
      if (Bishop.isDestinationReachable(bishopIndex, destinationIndex, 
          state._state, isWhiteMove, isACapture)) {
        possibleSources.push(bishopIndex);
      }
    }
    return PieceCommons.reconcileAmbiguity(state._state, move, possibleSources);
  }

  static directionFunctions = [
    PieceCommons.stepNorthEast,
    PieceCommons.stepNorthWest,
    PieceCommons.stepSouthEast,
    PieceCommons.stepSouthWest
  ];

  static isDestinationReachable(sourceIndex, destinationIndex, state, isWhiteMove, isACapture) {
    for (let directionFunction of Bishop.directionFunctions) {
      if (PieceCommons.isDestinationInDirectionReachable(sourceIndex, destinationIndex, 
          state, isWhiteMove, isACapture, directionFunction))
        return true;
    }

    return false;
  }
  
}