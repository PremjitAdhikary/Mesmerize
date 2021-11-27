/// <reference path='../lib/babylonJS/4_2_0/babylon.d.ts' />

class BranchNode {

  constructor(scene, container, parent, pos, dir, id = '0', params) {
    this.scene = scene;
    this.container = container;
    this.parent = parent;
    this.children = [];
    this.id = id;
    this.params = params;
    this.pos = pos.clone() ;
    this.dir = dir.clone();
    this.originalDir = dir;
    this.count = 0;
    this.weight = 0;
    this.show = true;
  }

  get x() { return this.pos.x; }
  get y() { return this.pos.y; }
  get z() { return this.pos.z; }

  next(len, id) {
    let nextDir = this.dir.normalize().scale(len);
    let nextPos = this.pos.add(nextDir);
    let child = new BranchNode(
      this.scene, this.container, this, nextPos, this.dir.clone(), id, this.params);
    this.children.push(child);
    return child;
  }

  hasChild() {
    return this.children.length > 0;
  }

  hasParent() {
    return this.parent != null;
  }

  reset() {
    this.dir = this.originalDir.clone();
    this.count = 0;
  }

  removeChild(child) {
    let index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  renderNode() {
    this.body = BABYLON.Mesh.CreateSphere("node"+this.id, 2, this.params.diam, this.scene);
    this.body.position = this.pos;
    this.container.meshes.push(this.body);
  }

  showNode(val) {
    if (!this.body) return;
    this.body.material = val ? this.params.baseColor : this.params.offColor;
  }

}