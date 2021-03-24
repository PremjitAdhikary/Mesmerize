class Pawn {

  static deduceSourceSquare = (state, move) => {
    let destination = PieceCommons.destinationSquare(move);
    let destinationIndex = PieceCommons.notationToIndex(destination);
    let isACapture = PieceCommons.isACapture(move);
    let isWhiteMove = state.isWhitesMove('w');
    let pawnsOnBoard = PieceCommons.findIndicesOfPiecesOnBoard(
      state._state, (isWhiteMove ? GameState.Pieces.wP : GameState.Pieces.bP));
    
    let possibleSources = [];
    for (let pawnIndex of pawnsOnBoard) {
      if (Pawn.isDestinationReachable(pawnIndex, destinationIndex, state, 
        isWhiteMove, isACapture)) {
        possibleSources.push(pawnIndex);
      }
    }
    return PieceCommons.reconcileAmbiguity(state._state, move, possibleSources);
  }

  // figure out en passant
  static isDestinationReachable(sourceIndex, destinationIndex, state, isWhiteMove, isACapture) {
    let sourceRank = Math.floor(sourceIndex / 8);

    if (isWhiteMove && !isACapture && state._state[destinationIndex] == 0) {
      let north = PieceCommons.stepNorth(sourceIndex, 1);
      if ((north == destinationIndex) 
        || (sourceRank == 1 && state._state[north] == 0 
          && PieceCommons.stepNorth(sourceIndex, 2) == destinationIndex))
        return true;
    }

    if (!isWhiteMove && !isACapture && state._state[destinationIndex] == 0) {
      let south = PieceCommons.stepSouth(sourceIndex, 1);
      if ((south == destinationIndex) 
        || (sourceRank == 6 && state._state[south] == 0 
          && PieceCommons.stepSouth(sourceIndex, 2) == destinationIndex))
        return true;
    }

    if (isWhiteMove && isACapture && state._state[destinationIndex] < 0) {
      if ( (PieceCommons.stepNorthEast(sourceIndex, 1) == destinationIndex) 
        || (PieceCommons.stepNorthWest(sourceIndex, 1) == destinationIndex))
        return true;
    }

    if (!isWhiteMove && isACapture && state._state[destinationIndex] > 0) {
      if ( (PieceCommons.stepSouthEast(sourceIndex, 1) == destinationIndex) 
        || (PieceCommons.stepSouthWest(sourceIndex, 1) == destinationIndex))
        return true;
    }

    if (isWhiteMove && isACapture && state.enPassantable) {
      if ( (PieceCommons.stepNorthEast(sourceIndex, 1) == state.enPassantable.by) 
        || (PieceCommons.stepNorthWest(sourceIndex, 1) == state.enPassantable.by))
        return true;
    }

    if (!isWhiteMove && isACapture && state.enPassantable) {
      if ( (PieceCommons.stepSouthEast(sourceIndex, 1) == state.enPassantable.by) 
        || (PieceCommons.stepSouthWest(sourceIndex, 1) == state.enPassantable.by))
        return true;
    }

    return false;
  }
}