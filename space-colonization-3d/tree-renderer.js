class TreeRenderer {

  constructor(scene, container, root, params) {
    this.scene = scene;
    this.container = container;
    this.root = root;
    this.params = params;
    this.updateNodeWeights();
    this.branches = [];
    this.branchMaterial = params.material();
    this.branchHideMaterial = params.offColor;
    this.rendered = false;
    this.showTexture = false;
    this.doShowTree = false;
    this.generateRenederers();
  }

  updateNodeWeights() {
    let que = [];
    let stk = [];
    que.push(this.root);
    while (que.length > 0) {
      let node = que.shift();
      stk.push(node);
      node.children.forEach( c => que.push(c) );
    }
    while (stk.length > 0) {
      let node = stk.pop();
      node.weight = 1;
      if (node.hasChild()) {
        node.children.forEach( c => node.weight += c.weight );
      }
    }
  }

  generateRenederers() {
    let que = [];
    let paths = [];
    que.push(this.root);
    while (que.length > 0) {
      let node = que.shift();
      let path = [node];
      while (node.hasChild()) {
        path.push(node.children[0]);
        for (let c = 1; c < node.children.length; c++) {
          que.push(node.children[c]);
        }
        node = node.children[0];
      }
      paths.push(path);
    }
    paths.forEach( path => this.geenrateBranch(path) );
    this.rendered = true;
  }

  geenrateBranch(path) {
    let nodePath = path.map(p => p.pos);
    let nodeWeights = path.map(p => p.weight);
    if (path[0].hasParent()) {
      nodePath.unshift(path[0].parent.pos);
      nodeWeights.unshift(path[0].parent.weight);
    }

    let branch = BABYLON.MeshBuilder.CreateTube("tube", {
      path: nodePath, 
      radiusFunction: (index) => 
        (this.params.baseDiam + nodeWeights[index] * this.params.diamIncr)/2, 
      sideOrientation: BABYLON.Mesh.DOUBLESIDE}, 
      this.scene);
    branch.material = this.doShowTree ? this.branchMaterial : this.branchHideMaterial;
    this.branches.push(branch);
    this.container.meshes.push(branch);
  }

  show(val) {
    this.doShowTree = val;
    this.renderUpdate();
  }

  texture(val) {
    this.showTexture = val;
    this.renderUpdate();
  }

  renderUpdate() {
    let getMaterial = () => !this.doShowTree ? this.branchHideMaterial 
      : this.showTexture ? this.branchMaterial : null;
    if (this.rendered) {
      this.branches.forEach( branch => branch.material = getMaterial() );
    }
  }

}