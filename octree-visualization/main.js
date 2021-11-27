/// <reference path='../lib/babylonJS/4_2_0/babylon.d.ts' />

import { bus } from '../components/event-bus.js';

let canvas = document.getElementById('myCanvas', 'smooth');

let engine = new BABYLON.Engine(canvas, true);

// objects
let tree;
let treeMaxSize = 128;
let treePoints = [];

let queryBox;
let queryBoxSize = 20;

function createScene() {
  let scene = new BABYLON.Scene(engine);
  
  let camera = new BABYLON.ArcRotateCamera( 'camera', -11/7, 11/7, 240, BABYLON.Vector3.Zero(), scene );
  camera.attachControl(canvas, true);
  let light = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 0, 1), scene);
  light.intensity = 0.7;
  
  tree = new VisualOctree(scene, 0, 0, 0, treeMaxSize, 5, false);
  addQueryBox(scene);

  return scene;
}

function addPoints(numOfPoints) {
  for (let i = 0; i < numOfPoints; i++) {
    let oe = new OctElement(scene, 
      Math.floor(Math.random() * treeMaxSize) - treeMaxSize/2, 
      Math.floor(Math.random() * treeMaxSize) - treeMaxSize/2, 
      Math.floor(Math.random() * treeMaxSize) - treeMaxSize/2);
    treePoints.push(oe);
    tree.insert(oe.x, oe.y, oe.z, oe);
  }
}

function addQueryBox(scene) {
  queryBox = BABYLON.Mesh.CreateBox("qb", queryBoxSize, scene);console.log(queryBox);
  queryBox.enableEdgesRendering();
  queryBox.edgesWidth = 20;
  queryBox.edgesColor = SketchColor.greenyellow().babylonColor();
  let qbDiffuse = new BABYLON.StandardMaterial('qbEmit', scene);
  qbDiffuse.diffuseColor = SketchColor.greenyellow().babylonColor();
  qbDiffuse.alpha = 0.3;
  queryBox.material = qbDiffuse;
}

let scene = createScene();

function animate() {
  query();
  scene.render();
}

function query() {
  treePoints.forEach( tp => tp.hilight(false) );
  let pointsFound = tree.query(
    queryBox.position.x, queryBox.position.y, queryBox.position.z, queryBoxSize);
  pointsFound.forEach( tp => tp.hilight(true) );
}

engine.runRenderLoop( () => animate() );

bus.register("ControlOTVap", e => {
  addPoints(parseInt(e.detail.num));
});
bus.register("ControlOTVqb", e => {
  queryBox.position.x = e.detail.query_box_x;
  queryBox.position.y = e.detail.query_box_y;
  queryBox.position.z = e.detail.query_box_z;
});