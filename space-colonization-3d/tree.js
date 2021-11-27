class Tree {

  constructor(scene, container, params, bus) {
    this.scene = scene;
    this.container = container;
    this.bus = bus;

    this.attractorIdGen = idGenerator(100, 'a_');
    this.branchNodeIdGen = idGenerator(1000, 'n_');
    
    this.otAttractors = new Octree(0, 0, 0, params.treeSize, 5, false);
    this.otBranchNodes = new Octree(0, 0, 0, params.treeSize, 10, false);
    this.otBranchNodes.minOctEdge = 2;

    this.offColor = new BABYLON.StandardMaterial('offColor', scene);
    this.offColor.diffuseColor = SketchColor.grey().babylonColor();
    this.offColor.alpha = 0.01
    
    this.addAttractors(scene, container, params);
    this.attractionMinDist = params.attractors.minDist;
    this.attractionMaxDist = params.attractors.maxDist;

    this.nodeParams = {
      dist: params.branchNode.dist, 
      diam: params.branchNode.diam, 
      baseColor: params.branchNode.baseColor(), 
      offColor: this.offColor
    };

    this.renderer;
    this.rendererParams = params.renderer;
    this.rendererParams.offColor = this.offColor;

    this.mainStemInVicinity = false;
    this.enableGrow = false;
    this.allGrown = false;
    this.doShowNodes = true;

    this.nodes = [];
    let root = new BranchNode(
      scene, container, null, 
      params.root.position(), params.root.direction(), this.branchNodeIdGen(), 
      this.nodeParams);
    this.nodes.push(root);
    this.otBranchNodes.insert(root.x, root.y, root.z, root);
  }

  addAttractors(scene, container, params) {
    this.attractors = [];
    let baseColor = params.attractors.baseColor();
    for (let i=0; i<params.attractors.count; i++) {
      let attractor = new Attractor(
        scene, container, params.attractors.position(), this.attractorIdGen(), 
        baseColor, this.offColor, params.attractors.diam);
      this.attractors.push(attractor);
      this.otAttractors.insert(attractor.x, attractor.y, attractor.z, attractor);
    }
  }

  grow() {
    if (!this.enableGrow) return;
    if (!this.mainStemInVicinity) {
      this.growMainStem();
    } else if (!this.allGrown) {
      this.growBranchNodes();
    }
  }

  growMainStem() {
    let grown = false;
    for (let n = this.nodes.length-1; n>=0; n--) {
      if (this.nodes[n].hasChild()) continue;
      if (this.getProximalAttractors(this.nodes[n]).length == 0) {
        let node = this.nodes[n].next(this.nodeParams.dist, this.branchNodeIdGen());
        this.otBranchNodes.insert(node.x, node.y, node.z, node);
        node.renderNode();
        node.showNode(this.doShowNodes);
        this.nodes.push(node);
        grown = true;
      }
    }
    if (!grown) {
      this.mainStemInVicinity = true;
    }
  }

  getProximalAttractors(node) {
    let otResult = this.otAttractors.query(node.x, node.y, node.z, this.attractionMaxDist*2);
    return otResult.filter(a => 
      BABYLON.Vector3.DistanceSquared(a.body.position, node.pos) 
        <= this.attractionMaxDist * this.attractionMaxDist);
  }

  growBranchNodes() {
    let grown = false;
    this.attractors.forEach(attractor => {
      if (!attractor.reached) {
        let closestBranch = this.getClosestBranchNode(attractor);
        if (closestBranch != null) {
          this.setupNextBranchNode(closestBranch, attractor);
        }
      }
    });

    
    for (let n = this.nodes.length - 1; n >= 0; n--) {
      if (this.nodes[n].count > 0) {
        if (this.growNextBranchNode(this.nodes[n]))
          grown = true;
      }
    }

    if (!grown) {
      this.allGrown = true;
      this.renderer = new TreeRenderer(
        this.scene, this.container, this.nodes[0], this.rendererParams);
      this.bus.dispatch("ControlSC3tg", { });
    }

  }
  
  getClosestBranchNode(attractor) {
    let otResult = this.otBranchNodes.query(
      attractor.x, attractor.y, attractor.z, this.attractionMaxDist * 2);
    let closestBranch = null;
    let minDistYet = this.attractionMaxDist * this.attractionMaxDist;
    for (let n=0; n<otResult.length; n++) {
      let branch = otResult[n];
      let distSq = BABYLON.Vector3.DistanceSquared(attractor.body.position, branch.pos);
      if (distSq < (this.attractionMinDist * this.attractionMinDist)) {
        closestBranch = null;
        attractor.reached = true;
        break;
      } else if (distSq < minDistYet) {
        closestBranch = branch;
        minDistYet = distSq;
      }
    }
    
    return closestBranch;
  }

  setupNextBranchNode(node, attractor) {
    let newDir = attractor.body.position.subtract(node.pos);
    node.dir.addInPlace(newDir);
    node.count++;
  }

  growNextBranchNode(node) {
    node.dir.scale(1/(node.count+1));
    let newBranchNode = node.next(this.nodeParams.dist, this.branchNodeIdGen());
    node.reset();
    let otResult = this.otBranchNodes.query(
      newBranchNode.x, newBranchNode.y, newBranchNode.z, this.attractionMinDist / 2);
    if (otResult.length > 0) {
      node.removeChild(newBranchNode);
      return false;
    }
    newBranchNode.renderNode();
    newBranchNode.showNode(this.doShowNodes);
    this.otBranchNodes.insert(newBranchNode.x, newBranchNode.y, newBranchNode.z, newBranchNode);
    this.nodes.push(newBranchNode);
    return true;
  }

  startGrowing() {
    this.enableGrow = true;
  }

  showNodes(val) {
    this.doShowNodes = val;
    this.nodes.forEach( node => node.showNode(val) );
    this.attractors.forEach( attractor => attractor.show(val) );
  }

  showTree(val) {
    if (this.allGrown) {
      this.renderer.show(val);
    }
  }

  showTexture(val) {
    if (this.allGrown) {
      this.renderer.texture(val);
    }
  }

}