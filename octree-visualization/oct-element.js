class OctElement {

  constructor(scene, centerX, centerY, centerZ) {
    this.scene = scene;
    this.body = BABYLON.Mesh.CreateSphere("point", 8, 1, scene);
    this.body.position.x = centerX;
    this.body.position.y = centerY;
    this.body.position.z = centerZ;
    this.baseColor = new BABYLON.StandardMaterial('base', scene);
    this.baseColor.emissiveColor = SketchColor.red().babylonColor();
    this.hilightColor = new BABYLON.StandardMaterial('base', scene);
    this.hilightColor.emissiveColor = SketchColor.greenyellow().babylonColor();
    this.hilight(false)
  }

  get x() { return this.body.position.x; }
  get y() { return this.body.position.y; }
  get z() { return this.body.position.z; }

  hilight(val) {
    this._hilight = val;
    this.body.material = (this._hilight ? this.hilightColor : this.baseColor);
  }

}