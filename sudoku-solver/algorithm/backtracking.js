class Backtracking {

  static solve(input, board) {
    let ops = [];

    const findUnsovledIndex = () => {
      for (let r = 0; r < input.length; r++) {
        for (let c = 0; c < input[r].length; c++) {
          if (input[r][c] == 0) 
            return (r*input[0].length + c);
        }
      }
      return -1;
    };

    const solveRecursive = () => {
      let unsolvedIndex = findUnsovledIndex(input);
  
      if (unsolvedIndex == -1) return true;
  
      let row = Math.floor(unsolvedIndex / input[0].length);
      let col = unsolvedIndex % input[0].length;
      for (let value = 1; value <= 9; value++) {
        if (isSafeToPut(input, row, col, value)) {
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