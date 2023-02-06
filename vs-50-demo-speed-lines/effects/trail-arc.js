/**
 * Configuration: The configuration sets up how the animation for the arc will be rendered. 
 * This is based on TrailLine where the arc is formed by adding points to embedded TrailLine.
 * start: The starting point of the arc
 * z: The depth
 * totalFrames: total frames before the arc fades out
 * strokeWeight: 
 * strokeCap: SQUARE / ROUND / PROJECT
 * arcToAdd: An array of points to add every subsequent frame. Every point is 1 degree apart. So 
 *   an array [40, 30] would mean in 1st frame an arc of 40 degree will be rendered and in next 
 *   frame the arc will grow to 70 degree.
 * center: The center for the drawn arc
 * arcDirection: 1 for clockwise, -1 for anticlockwise
 * color: color of the arc trail
 */
class TrailArc {

  constructor(config) {
    this.config = config;
    this.trail = new TrailLine({
      start: config.start, z: config.z, 
      totalFrames: config.totalFrames, 
      strokeWeight: config.strokeWeight, 
      strokeCap: config.strokeCap, 
      color: config.color
    });
    this.arcToAddIndex = 0;
    this.prevAngleOfRotation = 0;
  }

  get removeObj() { return this.trail.removeObj; }

  render(originX) {
    if (this.removeObj) return;
    if (this.arcToAddIndex < this.config.arcToAdd.length) {
      let totalNodesToAdd = this.config.arcToAdd[this.arcToAddIndex];
      for (let a = this.prevAngleOfRotation; 
          a < this.prevAngleOfRotation + totalNodesToAdd; a++) {
        let dir = p5.Vector.sub(this.config.start, this.config.center);
        dir.rotate(radians(a+1) * this.config.arcDirection);
        dir.add(this.config.center);
        this.trail.addToPath(dir);
      }
      this.prevAngleOfRotation += totalNodesToAdd;
      this.arcToAddIndex++;
    } else {
      this.trail.fade();
    }
    this.trail.render(originX);
  }
}

TrailArc.CLOCKWISE = 1;
TrailArc.ANTICLOCKWISE = -1;