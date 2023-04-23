let PI_CHAR = 'π';

function create2DArray(rows, cols, initializer) {
  let arr = new Array(rows);
  for (let i=0; i<arr.length; i++) {
    if (initializer == undefined) 
      arr[i] = new Array(cols);
    else
      arr[i] = Array.from(Array(cols), initializer);
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

function clone2DArray(source) {
  let arr = create2DArray(source.length, source[0].length);
  forEach2DArray(arr, (e, r, c) => arr[r][c] = source[r][c]);
  return arr;
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

/**
 * When we have a requirement where a particular piece of code has to be run at a certain 
 * interval... (in p5 sketch, this would be after every n frames).
 * 
 * intervalCaller give you ability to do just that!
 * 
 * @param {*} interval - a function which returns the interval duration, because this is a 
 *  function, the interval can be constant or a variable based on some logic (or totally 
 *  random)
 * @param {*} funcToCall - this holds the peice of logic to run at every interval. Must return 
 *  true/false. When true (ie, the logic did accomplish its purpose), the interval will be reset 
 *  by calling the interval function
 * @returns - a function which has to be called at every frame (in draw method if a p5 sketch)
 */
function intervalCaller(interval, funcToCall) {
  let count = interval();
  return () => {
    if (count > 0) {
      count--;
      return;
    }
    if (funcToCall()) {
      count = interval();
    }
  };
}

/**
 * Takes in an image and fades it by passed value
 * The passed in image is updated and returned
 * @param {*} img - The image to fade
 * @param {*} alpha - the amount (between 0 and 255) to fade it to
 */
function fadeImage(img, alpha) {
  img.loadPixels();
  for(let i = 0 ; i < img.pixels.length; i+= 4) {
    if (img.pixels[i + 3] > alpha) img.pixels[i + 3] = alpha;
  }
  img.updatePixels();
  return img;
}