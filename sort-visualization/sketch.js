let canvas;

let choice_sort;
let choice_render;
let algo;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  init();
}

function init() {
  switch(choice_sort) {
    case 1: algo = new BubbleSort(0); break;
    case 2: algo = new BubbleSort(1); break;
    case 3: algo = new SelectionSort(0); break;
    case 4: algo = new SelectionSort(1); break;
    case 5: algo = new InsertionSort(0); break;
    case 6: algo = new InsertionSort(1); break;
    case 7: algo = new QuickSort(); break;
  }
}

function draw() {
  background(0);
  algo.render(choice_render);
}

function setBus(bus) {
  bus.register("ControlSVcs", e => {
    choice_sort = e.detail.choice_sort;
    init();
  });
  bus.register("ControlSVcr", e => {
    choice_render = e.detail.choice_render;
  });
}

function setData(d) {
  choice_sort = d.choice_sort;
  choice_render = d.choice_render;
}

function keyTyped() {
  saveCanvas(canvas, 'myCanvas', 'jpg');
}