/**
 * 2 versions of Quadtree here:
 * 1) All the quads keep points in them
 * 2) Only the leaf quads keep points in them
 */
class QuadTree {

  constructor (centerX, centerY, treeWidth, treeHeight, capacity, onlyLeafItems = false) {
    this.x = centerX;
    this.y = centerY;
    this.treeHeight = treeHeight;
    this.treeWidth = treeWidth;
    this.capacity = capacity;
    this.points = [];
    this.subdivided = false;
    this.onlyLeafItems = onlyLeafItems;

    this.color = 255;

    this.minQuadEdge = 4;
  }

  insert(x, y, element) {
    return this.insertPoint(new Point(x,y,element));
  }

  insertPoint(qp) {
    if (!this.pointInQuad(qp.x, qp.y)) return false;

    if (this.canPointsBeInsertedInThisQuad()) {
      this.points.push(qp);
      return true;
    }

    if (!this.subdivided) this.subdivide();

    return this.insertPointInSubtrees(qp);
  }

  canPointsBeInsertedInThisQuad() {
    // in case smallest quad, insert
    if (!this.canBeSubDivided()) return true;
    // in case capacity reached, dont insert
    if (this.points.length >= this.capacity) return false;
    // if points can be inserted anywhere, fine else only if leaf node
    return !this.onlyLeafItems || (this.onlyLeafItems && !this.subdivided);
  }

  insertPointInSubtrees(qp) {
    return this.neTree.insertPoint(qp) 
            || this.nwTree.insertPoint(qp) 
            || this.seTree.insertPoint(qp) 
            || this.swTree.insertPoint(qp);
  }

  canBeSubDivided() {
    return this.treeWidth/2 > this.minQuadEdge && this.treeHeight/2 > this.minQuadEdge;
  }

  subdivide() {
    let newWd = this.treeWidth/2;
    let newHt = this.treeHeight/2;
    if (newWd < this.minQuadEdge || newHt < this.minQuadEdge) 
      return;
    this.neTree = new QuadTree(this.x + newWd/2, this.y - newHt/2, newWd, newHt, 
      this.capacity, this.onlyLeafItems);
    this.neTree.minQuadEdge = this.minQuadEdge;
    this.nwTree = new QuadTree(this.x - newWd/2, this.y - newHt/2, newWd, newHt, 
      this.capacity, this.onlyLeafItems);
    this.nwTree.minQuadEdge = this.minQuadEdge;
    this.seTree = new QuadTree(this.x + newWd/2, this.y + newHt/2, newWd, newHt, 
      this.capacity, this.onlyLeafItems);
    this.seTree.minQuadEdge = this.minQuadEdge;
    this.swTree = new QuadTree(this.x - newWd/2, this.y + newHt/2, newWd, newHt, 
      this.capacity, this.onlyLeafItems);
    this.swTree.minQuadEdge = this.minQuadEdge;
    this.subdivided = true;

    if (this.onlyLeafItems) {
      for (let qp of this.points) {
        let inserted = this.insertPointInSubtrees(qp);
        if (!inserted)
          console.error('!! Insert Failed at: ('+qp.x+','+qp.y+')');
      }
      this.points = [];
    }
  }

  query(centerX, centerY, rangeWidth, rangeHeight) {
    let pointsFound = [];
    this.queryRecursive(centerX, centerY, rangeWidth, rangeHeight, pointsFound);
    return pointsFound;
  }

  queryRecursive(centerX, centerY, rangeWidth, rangeHeight, pointsFound) {
    if (!this.intersects(centerX, centerY, rangeWidth, rangeHeight)) {
      return pointsFound;
    }

    for (let p of this.points) {
      if (this.pointInRange(p.x, p.y, centerX, centerY, rangeWidth, rangeHeight)) {
        pointsFound.push(p.element);
      }
    }

    if (this.subdivided) {
      this.neTree.queryRecursive(centerX, centerY, rangeWidth, rangeHeight, pointsFound);
      this.nwTree.queryRecursive(centerX, centerY, rangeWidth, rangeHeight, pointsFound);
      this.seTree.queryRecursive(centerX, centerY, rangeWidth, rangeHeight, pointsFound);
      this.swTree.queryRecursive(centerX, centerY, rangeWidth, rangeHeight, pointsFound);
    }
  }

  intersects(centerX, centerY, rangeWidth, rangeHeight) {
    return !( 
        ((centerX-rangeWidth/2) > (this.x+this.treeWidth/2)) 
        || ((centerX+rangeWidth/2) < (this.x-this.treeWidth/2)) 
        || ((centerY-rangeHeight/2) > (this.y+this.treeHeight/2)) 
        || ((centerY+rangeHeight/2) < (this.y-this.treeHeight/2))
      );
  }

  pointInQuad(x, y) {
    return this.pointInRange(x, y, this.x, this.y, this.treeWidth, this.treeHeight);
  }

  pointInRange(x, y, rangeCenterX, rangeCenterY, rangeWidth, rangeHeight) {
    return (x >= rangeCenterX-rangeWidth/2) 
          && (x <= (rangeCenterX+rangeWidth/2)) 
          && (y >= rangeCenterY-rangeHeight/2) 
          && (y <= (rangeCenterY+rangeHeight/2));
  }

  show(color) {
    if (!color) color = this.color;
    stroke(color);
    strokeWeight(1);
    noFill();
    rect(
      this.x - this.treeWidth/2, this.y - this.treeHeight/2, this.treeWidth, this.treeHeight);

    if (this.subdivided) {
      this.neTree.show(color);
      this.nwTree.show(color);
      this.seTree.show(color);
      this.swTree.show(color);
    }
  }
}

class Point {
  constructor(x, y, element) {
    this.x = x;
    this.y = y;
    this.element = element;
  }
}