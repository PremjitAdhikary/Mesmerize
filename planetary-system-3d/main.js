/// <reference path='../lib/babylonJS/4_2_0/babylon.d.ts' />

import { bus } from '../components/event-bus.js';

let canvas = document.getElementById('myCanvas', 'smooth');

let engine = new BABYLON.Engine(canvas, true);

let paused;

// objects
let celestialData = new CelestialData();
let celestialBodies = [];
let asteroidBelt;

function createScene() {
  let scene = new BABYLON.Scene(engine);
  
  let camera = new BABYLON.ArcRotateCamera( 'camera', 180, 0, 500, BABYLON.Vector3.Zero(), scene );
  camera.attachControl(canvas, true);
  let light = new BABYLON.HemisphericLight( 'systemlight', new BABYLON.Vector3( 0, 0, 1 ), scene);
  light.intensity = 0.6;
  light.groundColor = new BABYLON.Color3( 0.5, 0.5, 1.0 );

  let sunLight = new BABYLON.PointLight( 'sunlight', BABYLON.Vector3.Zero(), scene );
  sunLight.intensity = 5;
  
  scene.ambientColor = new BABYLON.Color3(1, 1, 1);
  
  addObjects(scene);
  return scene;
}

function addObjects(scene) {
  addSkybox(scene);
  for (let cKey of Array.from(celestialData.allSystemNames())) {
    let cBody = new Celestial(scene, celestialData.get(cKey));
    celestialBodies.push(cBody);
  }
  addAsteroidBelt(scene);
}

function addSkybox(scene) {
  let skybox = BABYLON.MeshBuilder.CreateBox('skyBox', {size:3000.0}, scene);
  let skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('./img/textures/skybox/skybox', scene, ['_px.png', '_py.png', '_pz.png', '_nx.png', '_ny.png', '_nz.png']);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;
}

function addAsteroidBelt(scene) {
  let data = celestialData._asteroidBelt;
  let torus = BABYLON.Mesh.CreateTorus('astorus', data.diameter, data.thickness, 32, scene);
  torus.scaling = new BABYLON.Vector3(1, data.scale, 1);
  asteroidBelt= new BABYLON.PointsCloudSystem("asteroids", 2, scene);
  asteroidBelt.addVolumePoints(torus, 2800, BABYLON.PointColor.Stated, SketchColor.grey().babylonColor());
  asteroidBelt.buildMeshAsync().then(() => torus.dispose());
  asteroidBelt.computeParticleRotation = false;
}

let scene = createScene();

function animate() {
  if (!paused) {
    for (let body of celestialBodies) {
      body.update();
    }
    asteroidBelt.mesh.rotate(new BABYLON.Vector3(0, 1, 0), 0.0005);
  }
  scene.render();
}

engine.runRenderLoop( () => animate() );

bus.register("ControlPS3pu", e => {
  paused = e.detail.paused;
});