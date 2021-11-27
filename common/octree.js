class Octree {

  constructor(centerX, centerY, centerZ, treeSize, capacity, onlyLeafItems = false) {
    this.x = centerX;
    this.y = centerY;
    this.z = centerZ;
    this.treeSize = treeSize;
    this.capacity = capacity;
    this.points = [];
    this.subdivided = false;
    this.onlyLeafItems = onlyLeafItems;

    this.minOctEdge = 4;
  }

  insert(x, y, z, element) {
    return this.insertPoint(new OctPoint(x,y,z,element));
  }

  insertPoint(op) {
    if (!this.pointInOct(op.x, op.y, op.z)) return false;

    if (this.canPointsBeInsertedInThisOct()) {
      this.points.push(op);
      return true;
    }

    if (!this.subdivided) this.subdivide();

    return this.insertPointInSubtrees(op);
  }

  canPointsBeInsertedInThisOct() {
    // in case smallest quad, insert
    if (!this.canBeSubDivided()) return true;
    // in case capacity reached, dont insert
    if (this.points.length >= this.capacity) return false;
    // if points can be inserted anywhere, fine else only if leaf node
    return !this.onlyLeafItems || (this.onlyLeafItems && !this.subdivided);
  }

  insertPointInSubtrees(op) {
    return this.nefTree.insertPoint(op) || this.nebTree.insertPoint(op) 
            || this.nwfTree.insertPoint(op) || this.nwbTree.insertPoint(op) 
            || this.sefTree.insertPoint(op) || this.sebTree.insertPoint(op) 
            || this.swfTree.insertPoint(op) || this.swbTree.insertPoint(op);
  }

  canBeSubDivided() {
    return this.treeSize/2 > this.minOctEdge;
  }

  subdivide() {
    let newSz = this.treeSize/2;
    if (newSz < this.minOctEdge) 
      return;
    this.nefTree = this.buildTree(this.x + newSz/2, this.y - newSz/2, this.z - newSz/2, newSz);
    this.nebTree = this.buildTree(this.x + newSz/2, this.y - newSz/2, this.z + newSz/2, newSz);
    this.nwfTree = this.buildTree(this.x - newSz/2, this.y - newSz/2, this.z - newSz/2, newSz);
    this.nwbTree = this.buildTree(this.x - newSz/2, this.y - newSz/2, this.z + newSz/2, newSz);
    this.sefTree = this.buildTree(this.x + newSz/2, this.y + newSz/2, this.z - newSz/2, newSz);
    this.sebTree = this.buildTree(this.x + newSz/2, this.y + newSz/2, this.z + newSz/2, newSz);
    this.swfTree = this.buildTree(this.x - newSz/2, this.y + newSz/2, this.z - newSz/2, newSz);
    this.swbTree = this.buildTree(this.x - newSz/2, this.y + newSz/2, this.z + newSz/2, newSz);
    this.subdivided = true;

    if (this.onlyLeafItems) {
      for (let op of this.points) {
        let inserted = this.insertPointInSubtrees(op);
        if (!inserted)
          console.error('!! Insert Failed at: ('+op.x+','+op.y+','+op.z+')');
      }
      this.points = [];
    }
  }

  /**
   * To enable proper subclassing. Otherwise this.subdivide() will keep creating sub quads of 
   * type OcTree
   */
  buildTree(centerX, centerY, centerZ, size) {
    let ot = new Octree(centerX, centerY, centerZ, size, this.capacity, this.onlyLeafItems);
    ot.minOctEdge = this.minOctEdge;
    return ot;
  }

  query(centerX, centerY, centerZ, rangeSize) {
    let pointsFound = [];
    this.queryRecursive(centerX, centerY, centerZ, rangeSize, pointsFound);
    return pointsFound;
  }

  queryRecursive(centerX, centerY, centerZ, rangeSize, pointsFound) {
    if (!this.intersects(centerX, centerY, centerZ, rangeSize)) {
      return pointsFound;
    }

    for (let p of this.points) {
      if (this.pointInRange(p.x, p.y, p.z, centerX, centerY, centerZ, rangeSize)) {
        pointsFound.push(p.element);
      }
    }

    if (this.subdivided) {
      this.nefTree.queryRecursive(centerX, centerY, centerZ, rangeSize, pointsFound);
      this.nebTree.queryRecursive(centerX, centerY, centerZ, rangeSize, pointsFound);
      this.nwfTree.queryRecursive(centerX, centerY, centerZ, rangeSize, pointsFound);
      this.nwbTree.queryRecursive(centerX, centerY, centerZ, rangeSize, pointsFound);
      this.sefTree.queryRecursive(centerX, centerY, centerZ, rangeSize, pointsFound);
      this.sebTree.queryRecursive(centerX, centerY, centerZ, rangeSize, pointsFound);
      this.swfTree.queryRecursive(centerX, centerY, centerZ, rangeSize, pointsFound);
      this.swbTree.queryRecursive(centerX, centerY, centerZ, rangeSize, pointsFound);
    }
  }

  intersects(centerX, centerY, centerZ, rangeSize) {
    return !( 
        ((centerX-rangeSize/2) > (this.x+this.treeSize/2)) 
        || ((centerX+rangeSize/2) < (this.x-this.treeSize/2)) 
        || ((centerY-rangeSize/2) > (this.y+this.treeSize/2)) 
        || ((centerY+rangeSize/2) < (this.y-this.treeSize/2)) 
        || ((centerZ-rangeSize/2) > (this.z+this.treeSize/2)) 
        || ((centerZ+rangeSize/2) < (this.z-this.treeSize/2))
      );
  }

  pointInOct(x, y, z) {
    return this.pointInRange(x, y, z, this.x, this.y, this.z, this.treeSize);
  }

  pointInRange(x, y, z, rangeCenterX, rangeCenterY, rangeCenterZ, rangeSize) {
    return (x >= (rangeCenterX-rangeSize/2)) 
          && (x <= (rangeCenterX+rangeSize/2)) 
          && (y >= (rangeCenterY-rangeSize/2)) 
          && (y <= (rangeCenterY+rangeSize/2)) 
          && (z >= (rangeCenterZ-rangeSize/2)) 
          && (z <= (rangeCenterZ+rangeSize/2));
  }
  
}

class OctPoint {
  constructor(x, y, z, element) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.element = element;
  }
}