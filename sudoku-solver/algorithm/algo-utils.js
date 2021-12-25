const isValueInRow = (input, row, col, value) => input[row].find( (e, c) => c != col && e == value);

const isValueInCol = (input, row, col, value) => input.filter( (e, r) => r != row ).map(a => a[col]).find( e => e == value);

const isValueInBox = (input, row, col, value) => {
  let rLow = row - row%3;
  let cLow = col - col%3;
  for (let r = rLow; r < rLow + 3; r++) {
    for (let c = cLow; c < cLow + 3; c++) {
      if (r != row && c != col && input[r][c] == value) 
        return true;
    }
  }
  return false;
};

const isSafeToPut = (input, row, col, value) => 
    input[row][col] == 0 
    && !(isValueInRow(input, row, col, value) 
        || isValueInCol(input, row, col, value) 
        || isValueInBox(input, row, col, value));