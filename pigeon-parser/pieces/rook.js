class Rook {
  
  static deduceSourceSquare = (state, move) => {
    let destination = PieceCommons.destinationSquare(move);
    let destinationIndex = PieceCommons.notationToIndex(destination);
    let isACapture = PieceCommons.isACapture(move);
    let isWhiteMove = state.isWhitesMove('w');
    let rooksOnBoard = PieceCommons.findIndicesOfPiecesOnBoard(
      state._state, (isWhiteMove ? GameState.Pieces.wR : GameState.Pieces.bR));

    let possibleSources = [];
    for (let rookIndex of rooksOnBoard) {
      if (Rook.isDestinationReachable(rookIndex, destinationIndex, 
          state._state, isWhiteMove, isACapture)) {
        possibleSources.push(rookIndex);
      }
    }
    return PieceCommons.reconcileAmbiguity(state._state, move, possibleSources);
  }

  static directionFunctions = [
    PieceCommons.stepNorth,
    PieceCommons.stepSouth,
    PieceCommons.stepEast,
    PieceCommons.stepWest
  ];

  static isDestinationReachable(sourceIndex, destinationIndex, state, isWhiteMove, isACapture) {
    for (let directionFunction of Rook.directionFunctions) {
      if (PieceCommons.isDestinationInDirectionReachable(sourceIndex, destinationIndex, 
          state, isWhiteMove, isACapture, directionFunction))
        return true;
    }

    return false;
  }
}