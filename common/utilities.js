let PI_CHAR = 'π';

function create2DArray(rows, cols) {
  let arr = new Array(rows);
  for (let i=0; i<arr.length; i++) {
    arr[i] = new Array(cols);
  }
  return arr;
}

function forEach2DArray(arr, action) {
  for (let r=0; r<arr.length; r++) {
    for (let c=0; c<arr[r].length; c++) {
      action(arr[r][c], r, c);
    }
  }
}

function mouseInCanvas() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

function toggleClassForElement(el, toggleClass, isAddCondition) {
  if (isAddCondition && !el.classList.contains(toggleClass)) {
    el.classList.add(toggleClass);
  } else if (!isAddCondition && el.classList.contains(toggleClass)) {
    el.classList.remove(toggleClass);
  }
}

function distanceSquared(a, b) {
  return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

function idGenerator(seed = 1, pre = '', post = '') {
  let _id = seed;
  return () => {
    _id++;
    return pre + _id + post;
  };
}