class MostConstrainedSquareSelection {

  static solve(input, board) {
    let ops = [];
    let eliminatedValues = create2DArray(9, 9);
    forEach2DArray(eliminatedValues, (elem, r, c) => 
      eliminatedValues[r][c] = new Array(9).fill(false) );

    const findUnsovledIndex = () => {
      let unsolvedIndex = -1;
      let minPossibleCandidates = 10;

      for (let r = 0; r < input.length; r++) {
        for (let c = 0; c < input[r].length; c++) {
          if (input[r][c] == 0) {
            let possibleCandidatesCount = 0;
            for (let value = 1; value <= 9; value++) {
              eliminatedValues[r][c][value-1] = !isSafeToPut(input, r, c, value);
              if (!eliminatedValues[r][c][value-1]) {
                possibleCandidatesCount++;
              }
            }
            if (possibleCandidatesCount < minPossibleCandidates) {
              minPossibleCandidates = possibleCandidatesCount;
              unsolvedIndex = (r*input[0].length + c);
            }
          }
        }
      }
      return unsolvedIndex;
    };

    const solveRecursive = () => {
      let unsolvedIndex = findUnsovledIndex(input);
  
      if (unsolvedIndex == -1) return true;
  
      let row = Math.floor(unsolvedIndex / input[0].length);
      let col = unsolvedIndex % input[0].length;
      for (let value = 1; value <= 9; value++) {
        if (!eliminatedValues[row][col][value-1]) {
          input[row][col] = value;
          ops.push(() => board.set(row, col, value));
  
          if (solveRecursive()) return true;
  
          input[row][col] = 0;
          ops.push(() => board.reset(row, col));
        }
      }
      return false;
    }

    if (solveRecursive()) return ops;
    console.error('Unsolvable Board!');
  }

}