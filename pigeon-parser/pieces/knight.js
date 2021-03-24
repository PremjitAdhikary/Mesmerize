class Knight {
  
  static deduceSourceSquare = (state, move) => {
    let destination = PieceCommons.destinationSquare(move);
    let destinationIndex = PieceCommons.notationToIndex(destination);
    let isACapture = PieceCommons.isACapture(move);
    let isWhiteMove = state.isWhitesMove('w');
    let knightsOnBoard = PieceCommons.findIndicesOfPiecesOnBoard(
      state._state, (isWhiteMove ? GameState.Pieces.wN : GameState.Pieces.bN));

    let possibleSources = [];
    for (let knightIndex of knightsOnBoard) {
      if (Knight.isDestinationReachable(knightIndex, destinationIndex, 
        state._state, isWhiteMove, isACapture)) {
        possibleSources.push(knightIndex);
      }
    }
    return PieceCommons.reconcileAmbiguity(state._state, move, possibleSources);
  }

  static directionFunctions = [
    sourceIndex => PieceCommons.stepEast(PieceCommons.stepNorth(sourceIndex, 2), 1),
    sourceIndex => PieceCommons.stepWest(PieceCommons.stepNorth(sourceIndex, 2), 1),
    sourceIndex => PieceCommons.stepEast(PieceCommons.stepSouth(sourceIndex, 2), 1),
    sourceIndex => PieceCommons.stepWest(PieceCommons.stepSouth(sourceIndex, 2), 1),
    sourceIndex => PieceCommons.stepNorth(PieceCommons.stepEast(sourceIndex, 2), 1),
    sourceIndex => PieceCommons.stepSouth(PieceCommons.stepEast(sourceIndex, 2), 1),
    sourceIndex => PieceCommons.stepNorth(PieceCommons.stepWest(sourceIndex, 2), 1),
    sourceIndex => PieceCommons.stepSouth(PieceCommons.stepWest(sourceIndex, 2), 1),
  ];

  static isDestinationReachable(sourceIndex, destinationIndex, state, isWhiteMove, isACapture) {
    for (let directionFunction of Knight.directionFunctions) {
      let di = directionFunction(sourceIndex);
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