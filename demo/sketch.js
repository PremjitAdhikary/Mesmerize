let canvas;

let choice_radio;
let choice_slider;
let onclick_slider;
let onchange_slider;
let onchange_step_slider;
let variable_slider;
let variable_slider_min;
let variable_slider_max;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(1);
  fill(255);
  text('choice_radio: '+(choice_radio==1?'Enabled':'Disabled'), 10, 20);
  text('choice_slider: '+(choice_slider==1?'Enabled':'Disabled'), 10, 50);
  text('onclick_slider: '+onclick_slider, 10, 80);
  text('onchange_slider: '+onchange_slider, 10, 110);
  text('onchange_step_slider: '+onchange_step_slider, 10, 140);
  text('variable_slider: '+variable_slider, 10, 170);
  text('variable_slider_min: '+variable_slider_min, 10, 200);
  text('variable_slider_max: '+variable_slider_max, 10, 230);
}

function setBus(bus) {
  bus.register("ControlBcr", e => {
    choice_radio = e.detail.choice_radio;
  });
  bus.register("ControlBcs", e => {
    choice_slider = e.detail.choice_slider;
  });
  bus.register("ControBclks", e => {
    onclick_slider = e.detail.onclick_slider;
  });
  bus.register("ControBchgs", e => {
    onchange_slider = e.detail.onchange_slider;
  });
  bus.register("ControBchgss", e => {
    onchange_step_slider = e.detail.onchange_step_slider;
  });
  bus.register("ControBvars", e => {
    variable_slider = e.detail.variable_slider;
    variable_slider_min = e.detail.variable_slider_min;
    variable_slider_max = e.detail.variable_slider_max;
  });
  bus.register("ControBvarsmin", e => {
    variable_slider_min = e.detail.variable_slider_min;
  });
  bus.register("ControBvarsmax", e => {
    variable_slider_max = e.detail.variable_slider_max;
  });
}

function setData(d) {
  choice_radio = d.choice_radio;
  choice_slider = d.choice_slider;
  onclick_slider = d.onclick_slider;
  onchange_slider = d.onchange_slider;
  onchange_step_slider = d.onchange_step_slider;
  variable_slider = d.variable_slider;
  variable_slider_min = d.variable_slider_min;
  variable_slider_max = d.variable_slider_max;
}