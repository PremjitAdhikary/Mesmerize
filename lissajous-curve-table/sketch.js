let canvas;
let angle = 0;
let number;
let side;
let col;
let row;
let offset;
let angleIncr;
let curves;
let pointMatrix; // the curve points
let ebus;
let colorArr;
let colorFadedArr;

function setup() {
  colorArr = createColorArr();
  colorFadedArr = createColorArr();
  colorFadedArr.forEach(c => c.alpha75());

  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  init();
}

function draw() {
  background(0);
  noFill();
  let d = side - side * 0.1;
  let r = d / 2;

  for (let i=0; i<col; i++) {
    let cx = offset + i * side + side / 2;
    let cy = side / 2;
    let px = r * cos(angle * (i+1) - HALF_PI);
    let py = r * sin(angle * (i+1) - HALF_PI);
    let guideId = "a:"+(i+1);

    // top row
    let guide = new Guide(cx, cy, d, px, py, guideId);
    guide.drawGuideCircle(colorArr[i%colorArr.length].stringify());
    guide.drawVerticalGuideLine(colorFadedArr[i%colorFadedArr.length].stringify());

    for (let j=0; j<row; j++) {
      pointMatrix[j][i].x = cx + px;
    }
  }

  for (let i=0; i<row; i++) {
    let cx = offset - side + side / 2;
    let cy = side + i * side + side / 2;
    let px = r * cos(angle * (i+1) - HALF_PI);
    let py = r * sin(angle * (i+1) - HALF_PI);
    let guideId = "b:"+(i+1);

    // left column
    let guide = new Guide(cx, cy, d, px, py, guideId);
    guide.drawGuideCircle(colorArr[i%colorArr.length].stringify());
    guide.drawHorizontalGuideLine(colorFadedArr[i%colorFadedArr.length].stringify());

    for (let j=0; j<col; j++) {
      pointMatrix[i][j].y = cy + py;
    }
  }

  for (let i=0; i<row; i++) {
    for (let j=0; j<row; j++) {
      if (curves[i][j] == null) {
        let bl = SketchColor.blend(colorArr[i%colorArr.length],colorArr[j%colorArr.length]);
        curves[i][j] = new Curve(bl.stringify());
      }
      curves[i][j].addPoint(pointMatrix[i][j]);
      curves[i][j].show();
    }
  }

  angle += angleIncr;

  if (angle > TWO_PI) {
    for (let i=0; i<row; i++) {
      for (let j=0; j<row; j++) {
        curves[i][j].clear();
      }
    }
    angle = 0;
  }
}

function setBus(bus) {
  bus.register("ControlLCTTablSize", e => setNumber(e.detail.size) );
  bus.register("ControlLCTAngleSpeed", e => setSpeed(e.detail.speed) );
}

function setNumber(n) {
  number = n+1;
  init();
}

function setSpeed(s) {
  angleIncr = s/100;
  init();
}

function setData(d) {
  number = d.startSize + 1;
  angleIncr = d.startSpeed/100;
}

function init() {
  angle = 0;
  col = number - 1;
  row = number - 1;
  side = floor(height / number);
  offset = 60 + side;
  curves = create2DArray(row, col);
  pointMatrix = create2DArray(row, col);

  for (let i=0; i<row; i++) {
    for (let j=0; j<row; j++) {
      pointMatrix[i][j] = {x:0,y:0};
    }
  }
}

function createColorArr() {
  let arr = [
    SketchColor.violet(),
    SketchColor.blue(),
    SketchColor.green(),
    SketchColor.yellow(),
    SketchColor.orange(),
    SketchColor.red()
  ];
  return arr;
}