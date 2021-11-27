/// <reference path='../lib/babylonJS/4_2_0/babylon.d.ts' />

class VisualOctree extends Octree {

  constructor(scene, centerX, centerY, centerZ, treeSize, capacity, onlyLeafItems) {
    super(centerX, centerY, centerZ, treeSize, capacity, onlyLeafItems);
    this.setupVisuals(scene);
  }

  setupVisuals(scene) {
    this.scene = scene;
    this.body = BABYLON.Mesh.CreateBox("tree", this.treeSize, scene);
    this.body.position.x = this.x;
    this.body.position.y = this.y;
    this.body.position.z = this.z;
    this.body.enableEdgesRendering();
    this.body.edgesWidth = this.treeSize/2;
    this.body.edgesColor = SketchColor.white().babylonColor();
    let boxDiffuse = new BABYLON.StandardMaterial('boxEmit', scene);
    boxDiffuse.diffuseColor = new BABYLON.Color3(1, 0, 0);
    boxDiffuse.alpha = 0.01;
    this.body.material = boxDiffuse;
  }

  buildTree(centerX, centerY, centerZ, size) {
    return new VisualOctree(
      this.scene, centerX, centerY, centerZ, size, this.capacity, this.onlyLeafItems);
  }

}