class QuadTree {

  constructor (centerX, centerY, treeWidth, treeHeight, capacity) {
    this.x = centerX;
    this.y = centerY;
    this.treeHeight = treeHeight;
    this.treeWidth = treeWidth;
    this.capacity = capacity;
    this.points = [];
    this.subdivided = false;

    this.color = 255;
  }

  insert(x, y, element) {
    if (!this.pointInQuad(x,y)) return false;
    
    if (this.points.length < this.capacity) {
      this.points.push(new Point(x,y,element));
      return true;
    }

    if (!this.subdivided) this.subdivide();

    return this.neTree.insert(x, y, element) 
            || this.nwTree.insert(x, y, element) 
            || this.seTree.insert(x, y, element) 
            || this.swTree.insert(x, y, element);
  }

  subdivide() {
    let newWd = this.treeWidth/2;
    let newHt = this.treeHeight/2;
    this.neTree = new QuadTree(this.x + newWd/2, this.y - newHt/2, newWd, newHt, this.capacity);
    this.nwTree = new QuadTree(this.x - newWd/2, this.y - newHt/2, newWd, newHt, this.capacity);
    this.seTree = new QuadTree(this.x + newWd/2, this.y + newHt/2, newWd, newHt, this.capacity);
    this.swTree = new QuadTree(this.x - newWd/2, this.y + newHt/2, newWd, newHt, this.capacity);
    this.subdivided = true;
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