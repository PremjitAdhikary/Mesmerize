let PI_CHAR = 'π';

function create2DArray(rows, cols) {
  let arr = new Array(rows);
  for (let i=0; i<arr.length; i++) {
    arr[i] = new Array(cols);
  }
  return arr;
}

function mouseInCanvas() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}