let canvas;

let choice_tree;
let choice_op;
let query_size;

let tree;
let qtPoints;
let qtPointsFound;

let bgColor;
let treeColor;
let pointColor;
let queryColor;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');

  bgColor = new SketchColor(29, 17, 53).stringify();
  treeColor = SketchColor.greenyellow().alpha(0.15).stringify();
  pointColor = new SketchColor(155, 155, 155).stringify();
  queryColor = 250;

  init();
}

function init() {
  if (choice_tree === 1)
    tree = new QuadTree(width/2, height/2, width, height, 5);
  else
    tree = new QuadTree(width/2, height/2, width, height, 5, true);
  tree.minQuadEdge = 20;
  qtPoints = [];
  qtPointsFound = [];
}

function draw() {
  background(bgColor);
  tree.show(treeColor);
  for (let qtPoint of qtPoints) {
    qtPoint.show(pointColor);
  }
  if (choice_op === 2) {
    stroke(queryColor);
    strokeWeight(1);
    rect(mouseX - query_size/2, mouseY - query_size/2, query_size, query_size);
    for (let qtPoint of qtPointsFound) {
      qtPoint.show(queryColor);
    }
  }
}

function mouseClicked() {
  if (!mouseInCanvas()) return;
  if (choice_op === 1) {
    let qtPoint = new QTPoint(mouseX, mouseY);
    qtPoints.push(qtPoint);
    tree.insert(mouseX, mouseY, qtPoint);
  } else if (choice_op === 2) {
    qtPointsFound = tree.query(mouseX, mouseY, query_size, query_size)
  }
}

function insertRandomPoints(numPoints) {
  for (let i = 0; i < numPoints; i++) {
    let qtPoint = new QTPoint(random(width), random(height));
    tree.insert(qtPoint._x, qtPoint._y, qtPoint);
    qtPoints.push(qtPoint);
  }
}

function setBus(bus) {
  bus.register("ControlQVct", e => {
    choice_tree = e.detail.choice_tree;
    init();
  });
  bus.register("ControlQVco", e => {
    choice_op = e.detail.choice_op;
  });
  bus.register("ControlQVsqs", e => {
    query_size = e.detail.query_size;
  });
  bus.register("ControlQVbip", e => {
    insertRandomPoints(e.detail.insert_points);
  });
}

function setData(d) {
  choice_tree = d.choice_tree;
  choice_op = d.choice_op;
  query_size = d.query_size;
}

class QTPoint {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  show(color) {
    stroke(color);
    strokeWeight(3);
    point(this._x, this._y);
  }
}