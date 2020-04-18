let canvas;

let choice_tree;
let color_quadtree;
let color_quadtree_query;
let tree;
let bgColor;

let basicTree = () => {
  return {
    attractorsCount: 1500,
    attractorColor: SketchColor.white().stringify(),
    branchColor: SketchColor.white().stringify(),
    root: createVector(width/2, height),
    branchLen: 10,
    branchWid: 2,
    branchMinWid: 2,
    branchWidRatio: 1.0,
    minDist: 20,
    maxDist: 50,
    generateV: () => createVector(random(0,width), random(0,height-150)),
    quadTreeColor: SketchColor.grey().stringify()
}};
let circleTree = () => {
  return {
    attractorsCount: 700,
    attractorColor: SketchColor.red().stringify(),
    branchColor: SketchColor.gold().stringify(),
    root: createVector(width/2, height),
    branchLen: 5,
    branchWid: 35,
    branchMinWid: 1,
    branchWidRatio: 0.97,
    minDist: 20,
    maxDist: 40,
    generateV: () => randomPointInACircle(180, width/2, height/2.5),
    quadTreeColor: SketchColor.grey().stringify()
}};
let cherryTree = () => {
  return {
    attractorsCount: 2700,
    attractorColor: SketchColor.skyBlue().stringify(),
    bloomingColor: SketchColor.red().stringify(),
    bloomingRadius: 10,
    bloomingFunction: (bloomArr, pos) => bloomArr.push(pos),
    branchColor: SketchColor.blend(
      SketchColor.grey(), SketchColor.grey(), SketchColor.grey(), SketchColor.yellow(), 
      SketchColor.orange()).stringify(),
    root: createVector(width/2, height),
    branchLen: 5,
    branchWid: 35,
    branchMinWid: 1,
    branchWidRatio: 0.97,
    minDist: 10,
    maxDist: 20,
    generateV: () => randomPointInAnEllipse(300, width/2, 1, height/2, 0.6),
    quadTreeColor: SketchColor.grey().stringify()
}};
let hauntedTree = () => {
  return {
    attractorsCount: 3500,
    attractorColor: SketchColor.blend(
      SketchColor.grey(), SketchColor.grey(), SketchColor.skyBlue()).stringify(),
    branchColor: 0,
    root: createVector(width/3, height),
    branchLen: 5,
    branchWid: 60,
    branchMinWid: 2,
    branchWidRatio: 0.96,
    minDist: 10,
    maxDist: 20,
    generateV: () => {
      let a = random(0, TWO_PI);
      let r = 300 * sqrt(random(0,1));
      // another adjustment to make it a half ellipse
      return createVector(width/2 + r * cos(a), height/1.1 - r * 0.9 * abs(sin(a)));
  }
}};
let possibleTree = () => {
  return {
    attractorsCount: 4000,
    attractorColor: SketchColor.grey().stringify(),
    // bloomingColor: SketchColor.greenyellow().stringify(),
    bloomingColor: SketchColor.orange().stringify(),
    bloomingRadius: 4,
    bloomingFunction: (bloomArr, pos) => {
      for (let l=0; l<random(45,60); l++) {
        bloomArr.push(randomPointInAnEllipse(35,pos.x, 1, pos.y, 0.6));
      }
    },
    branchColor: SketchColor.blend(
      SketchColor.grey(), SketchColor.yellow(), SketchColor.orange()).stringify(),
    root: createVector(width/2, height),
    branchLen: 6,
    branchWid: 30,
    branchMinWid: 2,
    branchWidRatio: 0.95,
    minDist: 12,
    maxDist: 25,
    // a somewhat complicated structure
    generateV: (function () {
      let xSmallCircle = random(-50,50);
      let xBigCircle = random(-80,80);
      let x1BigEllipse = random(-40,40);
      let y1BigEllipse = random(-40,40);
      let x2BigEllipse = random(-40,40);
      let y2BigEllipse = random(-40,40);
      let x1SmallEllipse = random(-30,30);
      let y1SmallEllipse = random(-30,30);
      let x2SmallEllipse = random(-30,30);
      let y2SmallEllipse = random(-30,30);

      return function () {
        let c = random(0,1);
        if (c < 0.1) {
          return randomPointInACircle(60, width/2+xSmallCircle, height/1.4);
        } else if (c < 0.4) {
          return randomPointInACircle(150, width/2+xBigCircle, height/2.5);
        } else if (c < 0.55) {
          return randomPointInAnEllipse(180,width*2/5+x1BigEllipse, 1, height/1.5+y1BigEllipse, 0.3);
        } else if (c < 0.7) {
          return randomPointInAnEllipse(180,width*3/5+x2BigEllipse, 1, height/1.5+y2BigEllipse, 0.3);
        } else if (c < 0.85) {
          return randomPointInAnEllipse(150,width*2/5+x1SmallEllipse, 1, height/2.2+y1SmallEllipse, 0.3);
        } else  {
          return randomPointInAnEllipse(150,width*3/5+x2SmallEllipse, 1, height/2.2+y2SmallEllipse, 0.3);
        }
      };
    })(),
    quadTreeColor: SketchColor.grey().stringify()
  }};

// Formula from https://programming.guide/random-point-within-circle.html
function randomPointInACircle(radius, xOffset, yOffset) {
  let a = random(0, TWO_PI);
  let r = radius * sqrt(random(0,1));
  return createVector(xOffset + r * cos(a), yOffset + r * sin(a));
}

// small adjustment in randomPointInACircle to make it an ellipse
// an ellipse can be transformed into a circle when its major and minor axis are equal
// so the adjustment is to add a multiplier to the radius element which will be different 
// for x and y axis (for a cricle, these multipliers will be 1)
function randomPointInAnEllipse(radius, xOffset, xMult, yOffset, yMult) {
  let a = random(0, TWO_PI);
  let r = radius * sqrt(random(0,1));
  return createVector(xOffset + xMult * r * cos(a), yOffset + yMult * r * sin(a));
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');

  initTree();
}

function initTree() {
  switch(choice_tree) {
    case 1:
        tree = new Tree(basicTree());
        bgColor = 0;
        color_quadtree_query = SketchColor.red().stringify();
        break;
    case 2:
        tree = new Tree(circleTree());
        bgColor = 0;
        color_quadtree_query = SketchColor.red().stringify();
        break;
    case 3:
        tree = new BloomingTree(cherryTree());
        bgColor = SketchColor.skyBlue().stringify();
        color_quadtree_query = SketchColor.grey().stringify();
        break;
    case 4:
        tree = new Tree(hauntedTree());
        bgColor = SketchColor.blend(
          SketchColor.grey(), SketchColor.grey(), SketchColor.skyBlue()).stringify();
        color_quadtree_query = SketchColor.red().stringify();
        break;
    case 5:
        tree = new BloomingTree(possibleTree());
        bgColor = 0;
        color_quadtree_query = SketchColor.greenyellow().stringify();
        break;
  }
  tree.colorQuadTree = color_quadtree;
}

function draw() {
  background(bgColor);
  tree.show();
  tree.grow();
  if (color_quadtree && mouseInCanvas()) {
    markQuadTreePoints();
  }
}

function markQuadTreePoints() {
  let size = 50;
  stroke(color_quadtree_query);
  strokeWeight(2);
  noFill();
  rect(mouseX-size/2, mouseY-size/2, size, size);

  tree.qtBranches.query(mouseX, mouseY, size, size).forEach( p => {
    stroke(color_quadtree_query);
    strokeWeight(5);
    point(p.pos.x, p.pos.y);
  });
}

function setBus(bus) {
  bus.register("ControlSCcrt", e => {
    choice_tree = e.detail.choice_tree;
    initTree();
  });
  bus.register("ControlSCTqt", e => {
    color_quadtree = e.detail.color_quadtree;
    tree.colorQuadTree = color_quadtree;
  });
}

function setData(d) {
  choice_tree = d.choice_tree;
  color_quadtree = color_quadtree;
}