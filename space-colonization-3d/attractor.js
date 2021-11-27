class Attractor {

  constructor(scene, container, pos, id = 0, baseColor, offColor, diam = 1) {
    this._reached = false;
    this.body = BABYLON.Mesh.CreateSphere("attractor_"+id, 2, diam, scene);
    this.body.position = pos;
    this.baseColor = baseColor;
    this.offColor = offColor;
    this.body.material = this._reached ? this.offColor : this.baseColor;
    container.meshes.push(this.body);
  }

  get x() { return this.body.position.x; }
  get y() { return this.body.position.y; }
  get z() { return this.body.position.z; }

  get reached() { return this._reached; }
  set reached(val) {
    this._reached = val;
    this.body.material = (val ? this.offColor : this.baseColor);
  }

  show(val) {
    this.body.material = (val && !this._reached ? this.baseColor : this.offColor);
  }

}