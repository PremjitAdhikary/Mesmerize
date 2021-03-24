class Queen {
  
  static deduceSourceSquare = (state, move) => {
    let destination = PieceCommons.destinationSquare(move);
    let destinationIndex = PieceCommons.notationToIndex(destination);
    let isACapture = PieceCommons.isACapture(move);
    let isWhiteMove = state.isWhitesMove('w');
    let queensOnBoard = PieceCommons.findIndicesOfPiecesOnBoard(
      state._state, (isWhiteMove ? GameState.Pieces.wQ : GameState.Pieces.bQ));

    let possibleSources = [];
    for (let queenIndex of queensOnBoard) {
      if (Queen.isDestinationReachable(queenIndex, destinationIndex, 
          state._state, isWhiteMove, isACapture)) {
        possibleSources.push(queenIndex);
      }
    }
    return PieceCommons.reconcileAmbiguity(state._state, move, possibleSources);
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
    for (let directionFunction of Queen.directionFunctions) {
      if (PieceCommons.isDestinationInDirectionReachable(sourceIndex, destinationIndex, 
          state, isWhiteMove, isACapture, directionFunction))
        return true;
    }

    return false;
  }
  
}