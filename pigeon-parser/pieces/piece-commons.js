class PieceCommons {

  static moveIsACheck = move => move.endsWith('+');
  static moveIsACheckMate = move => move.endsWith('#');
  static isACapture = move => move.indexOf('x') > 0;

  static movingPiece = move => {
    let notPawn = ['R', 'N', 'B', 'Q', 'K'];
    return notPawn.includes(move.charAt(0)) ? move.charAt(0) : 'P';
  };

  static destinationSquare = move => {
    let destinationRegex = /[a-h][1-8]/g;
    let allMatches = [...move.matchAll(destinationRegex)];
    return allMatches[allMatches.length-1][0];
  }

  static notationToIndex = square => {
    let rank = square.match(/\d/);
    let file = square.match(/\D/);
    return (parseInt(rank) - 1) * 8 + PieceCommons.fileToIndex[file];
  }

  static indexToNotation = index => {
    let rank = Math.floor(index / 8);
    let file = index % 8;
    return PieceCommons.indexToFile[file] + '' + (rank+1);
  }

  static findIndicesOfPiecesOnBoard = (state, piece) => {
    let indices = [];
    for (let i=0; i<state.length; i++) {
      if (state[i] == piece) 
        indices.push(i);
    }
    return indices;
  }

  static reconcileAmbiguity = (state, move, sources) => {
    if (sources.length == 0)
      throw 'Illegal move: ' + move;
    if (sources.length == 1)
      return sources[0];
    let firstIndexToCheck = (move.charAt(0) == move.charAt(0).toUpperCase()) ? 1 : 0;
    let hasFile = (/[a-h]/).test(move.charAt(firstIndexToCheck));//move.charAt(firstIndexToCheck).isLetter();
    let hasRank = hasFile ? 
      (/\d/).test(move.charAt(firstIndexToCheck + 1)) 
      : (/\d/).test(move.charAt(firstIndexToCheck));
    if (hasFile && hasRank) {
      let source = move.charAt(firstIndexToCheck) + move.charAt(firstIndexToCheck + 1);
      return PieceCommons.notationToIndex(source);
    }
    for (let source of sources) {
      if (hasFile) {
        let file = move.charAt(firstIndexToCheck);
        let fileIndex = PieceCommons.fileToIndex[file];
        if (source % 8 == fileIndex) return source;
      }
      if (hasRank) {
        let rank = move.charAt(firstIndexToCheck);
        let rankIndex = parseInt(rank) - 1;
        if (Math.floor(source / 8) == rankIndex) return source;
      }
    }
    throw 'Illegal move: ' + move;
  }

  static stepNorth = (sourceIndex, steps) => {
    if (sourceIndex < 0 || sourceIndex > 63) return -1;
    let sourceFile = sourceIndex % 8;
    let sourceRank = Math.floor(sourceIndex / 8);
    let destRank = sourceRank + steps;
    return (destRank >=0 && destRank < 8 ? (destRank * 8 + sourceFile) : -1);
  }

  static stepEast = (sourceIndex, steps) => {
    if (sourceIndex < 0 || sourceIndex > 63) return -1;
    let sourceFile = sourceIndex % 8;
    let sourceRank = Math.floor(sourceIndex / 8);
    let destFile = sourceFile + steps;
    return (destFile >=0 && destFile < 8 ? (sourceRank * 8 + destFile) : -1);
  }

  static stepSouth = (sourceIndex, steps) => PieceCommons.stepNorth(sourceIndex, -steps);
  static stepWest = (sourceIndex, steps) => PieceCommons.stepEast(sourceIndex, -steps);
  static stepNorthEast = (sourceIndex, steps) => 
    PieceCommons.stepNorth(PieceCommons.stepEast(sourceIndex, steps), steps);
  static stepNorthWest = (sourceIndex, steps) => 
    PieceCommons.stepNorth(PieceCommons.stepWest(sourceIndex, steps), steps);
  static stepSouthEast = (sourceIndex, steps) => 
    PieceCommons.stepSouth(PieceCommons.stepEast(sourceIndex, steps), steps);
  static stepSouthWest = (sourceIndex, steps) => 
    PieceCommons.stepSouth(PieceCommons.stepWest(sourceIndex, steps), steps);
    
  /**
   * Idea is to keep moving the piece by stepping up in the given direction till:
   * 1) the piece is out of the board
   * 2) the piece is blocked
   * 3) the destination index is reached (capture has to be considered)
   */
  static isDestinationInDirectionReachable(sourceIndex, destinationIndex, state, 
    isWhiteMove, isACapture, directionFunction) {
    for (let steps = 1; steps <= 7; steps++) {
      let di = directionFunction(sourceIndex, steps);
      if (di == destinationIndex) {
        let moveIntoEmptySquare = !isACapture && state[di] == 0;
        let captureOpponent = (isACapture && (
          (isWhiteMove && state[di] < 0) || (!isWhiteMove && state[di] > 0)
        )
        );
        if (moveIntoEmptySquare || captureOpponent)
          return true;
      }
      if (di < 0 || state[di] != 0) return false;
    }
  }
}

PieceCommons.fileToIndex = {
  'a': 0,
  'b': 1,
  'c': 2,
  'd': 3,
  'e': 4,
  'f': 5,
  'g': 6,
  'h': 7
};
PieceCommons.indexToFile = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];