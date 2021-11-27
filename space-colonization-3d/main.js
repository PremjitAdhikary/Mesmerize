/// <reference path='../lib/babylonJS/4_2_0/babylon.d.ts' />

import { bus } from '../components/event-bus.js';

let canvas = document.getElementById('myCanvas');

let engine = new BABYLON.Engine(canvas, true);

let scene;

// objects
let containers = [];
let choice_tree;
let showTree;
let showNodes;
let tree;
let box;
let boxMaterial;
let repo = new TreeRepo();
  
function createScene() {
  let scene = new BABYLON.Scene(engine);
  let camera = new BABYLON.ArcRotateCamera( 'camera', 
    -Math.PI / 2, Math.PI / 3, 150, new BABYLON.Vector3.Zero(), scene );
  camera.attachControl(canvas, true);
  camera.target = new BABYLON.Vector3(0, 32, 0);
  let light = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(10, 50, -60), scene);
  light.intensity = 0.9;
  light.specular = new BABYLON.Color3.Gray();

  let spot = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-1, 100, 1), 
    new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 25, scene);
  spot.diffuse = SketchColor.white().babylonColor();
  spot.intensity = 0.7;
  spot.specular = new BABYLON.Color3.Black();

  scene.onBeforeAnimationsObservable.add(beforeAnimate);

  return scene;
}

const repoKeys = [TreeRepo.CUBE, TreeRepo.GENERAL, TreeRepo.SPREAD, TreeRepo.PINE, 
  TreeRepo.HAUNTED, TreeRepo.NATURE];

function addTree() {
  if (containers.length > 0) {
    containers[containers.length - 1].removeAllFromScene();
  }
  let container = new BABYLON.AssetContainer(scene);

  let treeData = repo.getData(repoKeys[choice_tree-1])(scene);

  box = BABYLON.MeshBuilder.CreateBox("box", treeData.base.props, scene);
  boxMaterial = treeData.base.material();
  box.material = null;
  container.meshes.push(box);

  tree = new Tree(scene, container, treeData, bus);
  containers.push(container);
}

function beforeAnimate() {
  if (tree) 
    tree.grow();
}

function animate() {
  if (scene)
    scene.render();
}

engine.runRenderLoop( () => animate() );

bus.register("ControlSC3init", e => {
  choice_tree = e.detail.initData.choice_tree;
  showTree = !e.detail.initData.btn_show_tree;
  showNodes = e.detail.initData.btn_show_tree;
  scene = createScene();
  addTree();
});
bus.register("ControlSC3ct", e => {
  choice_tree = e.detail.choice_tree;
  addTree();
});
bus.register("ControlSC3bc", e => {
  showTree = !e.detail.btn_show_tree;
  showNodes = e.detail.btn_show_tree;
  if (tree) {
    tree.showNodes(showNodes);
    tree.showTree(showTree);
  }
});
bus.register("ControlSC3bst", e => {
  let val = e.detail.btn_show_texture;
  box.material = val ? null : boxMaterial;
  if (tree) {
    tree.showTexture(!val);
  }
});
bus.register("ControlSC3gt", e => {
  if (tree) {
    tree.startGrowing();
  }
});