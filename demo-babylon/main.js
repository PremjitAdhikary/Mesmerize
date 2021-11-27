/// <reference path='../lib/babylonJS/4_2_0/babylon.d.ts' />

import { bus } from '../components/event-bus.js';

let canvas = document.getElementById('myCanvas');

let engine = new BABYLON.Engine(canvas, true);

// objects
let box;
let boxDiffuse;
let boxEmmit;
let boxRotate = 0;

let choice_color;
let box_size_slider;

function createScene() {
  let scene = new BABYLON.Scene(engine);
  
  let camera = new BABYLON.FreeCamera('freeCam', new BABYLON.Vector3(0, 7, -25), scene);
  camera.attachControl(canvas, true);
  let light = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 4, 0), scene);
  light.intensity = 0.7;
  
  addObjects(scene);

  // scene.onKeyboardObservable.add( kbInfo => {
  //   switch(kbInfo.type) {
  //     case BABYLON.KeyboardEventTypes.KEYUP:
  //       switch(kbInfo.event.key) {
  //         case 's':
  //         case 'S':
  //           saveCanvas(scene);
  //           break;
  //       }
  //       break;
  //   }
  // } );

  return scene;
}

function saveCanvas(scene) {
  BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, scene.activeCamera, { precision: 2 }, undefined, 'image/jpeg');
}

function addObjects(scene) {
  box = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, scene);
  boxDiffuse = new BABYLON.StandardMaterial('boxEmit', scene);
  boxDiffuse.diffuseColor = new BABYLON.Color3(1, 0, 0);
  boxEmmit = new BABYLON.StandardMaterial('boxEmit', scene);
  boxEmmit.emissiveColor = SketchColor.red().babylonColor();
}

let scene = createScene();

function animate() {
  boxRotate += 0.05;
  box.rotation.y = boxRotate;
  scene.render()
}

engine.runRenderLoop( () => animate() );

bus.register("ControlDBcc", e => {
  choice_color = e.detail.choice_color;
  switch(choice_color) {
    case 1: box.material = null; break;
    case 2: box.material = boxDiffuse; break;
    case 3: box.material = boxEmmit; break;
  }
});
bus.register("ControlDBbss", e => {
  box_size_slider = e.detail.box_size_slider;
  box.scaling = new BABYLON.Vector3(box_size_slider, box_size_slider, box_size_slider);
});